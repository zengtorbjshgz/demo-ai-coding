import type { WeatherData, WeatherAPIResponse } from '../types/weather';

const API_KEY = import.meta.env.VITE_BAIDU_AK;
const API_URL = '/api/weather/';
const GEOCODER_URL = '/api/geocoder/';



// 百度逆地理编码API响应接口
interface GeocoderResponse {
  status: number;
  result?: {
    addressComponent: {
      country: string;
      province: string;
      city: string;
      district: string;
      town?: string;
      adcode: string;
      country_code: number;
      direction: string;
      distance: string;
    };
    formatted_address: string;
    business: string;
    sematic_description: string;
  };
  message?: string;
}



// 行政区划代码映射表（部分主要城市）
const DISTRICT_CODE_MAP: Record<string, string> = {
  '北京市': '110100',
  '上海市': '310100', 
  '天津市': '120100',
  '重庆市': '500100',
  '广州市': '440100',
  '深圳市': '440300',
  '杭州市': '330100',
  '南京市': '320100',
  '武汉市': '420100',
  '成都市': '510100',
  '西安市': '610100',
  '郑州市': '410100',
  '济南市': '370100',
  '青岛市': '370200',
  '大连市': '210200',
  '沈阳市': '210100',
  '长春市': '220100',
  '哈尔滨市': '230100',
  '石家庄市': '130100',
  '太原市': '140100',
  '呼和浩特市': '150100',
  '长沙市': '430100',
  '南昌市': '360100',
  '福州市': '350100',
  '厦门市': '350200',
  '合肥市': '340100',
  '南宁市': '450100',
  '海口市': '460100',
  '贵阳市': '520100',
  '昆明市': '530100',
  '拉萨市': '540100',
  '兰州市': '620100',
  '西宁市': '630100',
  '银川市': '640100',
  '乌鲁木齐市': '650100'
};

/**
 * 通过经纬度获取行政区划代码
 * @param latitude 纬度
 * @param longitude 经度
 * @returns 行政区划代码
 */
async function getDistrictCodeByLocation(latitude: number, longitude: number): Promise<string> {
  try {
    const url = `${GEOCODER_URL}?location=${latitude},${longitude}&output=json&ak=${API_KEY}`;
    console.log(`🌐 逆地理编码请求URL: ${url}`);
    console.log(`🔑 API密钥状态: ${API_KEY ? '已配置' : '❌ 未配置'}`);
    
    const response = await fetch(url);
    console.log(`📡 HTTP响应状态: ${response.status} ${response.statusText}`);
    
    if (!response.ok) {
      throw new Error(`HTTP错误: ${response.status} ${response.statusText}`);
    }
    
    const data: GeocoderResponse = await response.json();
    console.log('📍 逆地理编码响应:', data);
    
    if (data.status !== 0) {
      throw new Error(`逆地理编码API错误: ${data.message || '未知错误'}`);
    }
    
    if (!data.result?.addressComponent) {
      throw new Error('逆地理编码返回数据格式错误');
    }
    
    const { city, adcode } = data.result.addressComponent;
    
    // 优先使用API返回的adcode
    if (adcode && adcode.length >= 6) {
      // 取前6位作为市级行政区划代码
      const districtCode = adcode.substring(0, 6);
      console.log(`使用API返回的行政区划代码: ${districtCode}`);
      return districtCode;
    }
    
    // 如果adcode不可用，尝试从城市名称映射
    const mappedCode = DISTRICT_CODE_MAP[city];
    if (mappedCode) {
      console.log(`使用映射表获取的行政区划代码: ${mappedCode} (城市: ${city})`);
      return mappedCode;
    }
    
    console.warn(`未找到城市 ${city} 的行政区划代码，使用默认值`);
    return '110100'; // 默认北京市
    
  } catch (error) {
    console.error('逆地理编码失败:', error);
    return '110100'; // 默认北京市
  }
}

// 缓存用户选择的城市
let userSelectedCity: string | null = null;

/**
 * 尝试通过IP地址获取大概位置（备选方案）
 */
async function getLocationByIP(): Promise<string> {
  try {
    console.log('🌐 尝试通过IP地址获取位置信息...');
    // 使用免费的IP定位服务
    const response = await fetch('https://ipapi.co/json/');
    if (response.ok) {
      const data = await response.json();
      const city = data.city;
      console.log(`🌐 IP定位获取到城市: ${city}`);
      
      // 尝试从映射表中找到对应的行政区划代码
      const mappedCode = DISTRICT_CODE_MAP[city + '市'] || DISTRICT_CODE_MAP[city];
      if (mappedCode) {
        console.log(`✅ IP定位成功，使用城市: ${city}`);
        return mappedCode;
      }
    }
  } catch (error) {
    console.warn('⚠️ IP定位失败:', error);
  }
  return '110100'; // 最终回退到北京
}

/**
 * 获取用户首选的城市列表（常用城市）
 */
function getPopularCities(): Array<{name: string, code: string}> {
  return [
    { name: '北京市', code: '110100' },
    { name: '上海市', code: '310100' },
    { name: '广州市', code: '440100' },
    { name: '深圳市', code: '440300' },
    { name: '杭州市', code: '330100' },
    { name: '南京市', code: '320100' },
    { name: '武汉市', code: '420100' },
    { name: '成都市', code: '510100' }
  ];
}

/**
 * 优化后的获取当前行政区划ID函数
 * 支持多种定位方式和用户交互
 */
async function getCurrentDistrictId(): Promise<string> {
  // 如果用户之前手动选择过城市，优先使用
  if (userSelectedCity) {
    console.log(`🎯 使用用户选择的城市: ${userSelectedCity}`);
    return userSelectedCity;
  }

  // 检查本地存储中是否有保存的城市偏好
  const savedCity = localStorage.getItem('preferred_city');
  if (savedCity) {
    console.log(`💾 使用本地存储的城市偏好: ${savedCity}`);
    userSelectedCity = savedCity;
    return savedCity;
  }

  return new Promise((resolve) => {
    // 检查浏览器是否支持地理位置
    if (!navigator.geolocation) {
      console.warn('⚠️ 浏览器不支持地理位置服务');
      console.log('🔄 尝试使用IP定位作为备选方案...');
      getLocationByIP().then(resolve);
      return;
    }

    console.log('📍 开始请求地理位置权限...');
    
    // 设置外部超时，确保不会无限等待
    const timeoutId = setTimeout(() => {
      console.warn('⏰ 地理位置获取超时，尝试IP定位...');
      getLocationByIP().then(resolve);
    }, 10000); // 10秒外部超时
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        clearTimeout(timeoutId);
        const { latitude, longitude, accuracy } = position.coords;
        console.log(`✅ 成功获取地理位置：纬度 ${latitude}, 经度 ${longitude}, 精度 ${accuracy}米`);
        
        // 检查定位精度，如果精度太差（超过5000米），记录警告但仍然使用
        if (accuracy > 5000) {
          console.warn(`⚠️ 定位精度较低 (${accuracy}米)，可能影响天气数据准确性`);
        }
        
        try {
          // 使用逆地理编码获取行政区划代码
          const districtCode = await getDistrictCodeByLocation(latitude, longitude);
          console.log(`✅ 成功获取行政区划代码: ${districtCode}`);
          
          // 保存到本地存储，包含时间戳和精度信息
          localStorage.setItem('preferred_city', districtCode);
          localStorage.setItem('last_location_time', Date.now().toString());
          localStorage.setItem('last_location_accuracy', accuracy.toString());
          
          resolve(districtCode);
        } catch (error) {
          console.error('❌ 逆地理编码失败:', error);
          console.log('🔄 尝试使用IP定位作为备选方案...');
          const fallbackCode = await getLocationByIP();
          resolve(fallbackCode);
        }
      },
      async (error) => {
        clearTimeout(timeoutId);
        const errorMessages = {
          1: 'PERMISSION_DENIED - 用户拒绝了地理位置权限',
          2: 'POSITION_UNAVAILABLE - 位置信息不可用',
          3: 'TIMEOUT - 获取位置超时'
        };
        
        console.error('❌ 地理位置获取失败:', {
          code: error.code,
          message: error.message,
          errorType: errorMessages[error.code as keyof typeof errorMessages] || '未知错误'
        });
        
        // 根据错误类型提供不同的处理策略
        if (error.code === 1) {
          console.log('🔒 用户拒绝位置权限，建议提供城市选择界面');
          // 可以在这里触发城市选择界面
          // showCitySelector();
        } else if (error.code === 2) {
          console.log('📍 位置服务不可用，可能是设备或网络问题');
        } else if (error.code === 3) {
          console.log('⏱️ 定位超时，可能是信号较弱');
        }
        
        console.log('🔄 尝试使用IP定位作为备选方案...');
        const fallbackCode = await getLocationByIP();
        resolve(fallbackCode);
      },
      {
        enableHighAccuracy: false, // 优先考虑速度而非精度，提升用户体验
        timeout: 8000, // 8秒内部超时，与外部超时配合
        maximumAge: 300000, // 5分钟缓存，平衡准确性和性能
      }
    );
  });
}

/**
 * 允许用户手动设置城市
 * @param cityCode 城市行政区划代码
 */
function setUserCity(cityCode: string): void {
  userSelectedCity = cityCode;
  localStorage.setItem('preferred_city', cityCode);
  console.log(`🎯 用户手动设置城市: ${cityCode}`);
}

/**
 * 清除用户城市偏好，重新进行定位
 */
function clearUserCityPreference(): void {
  userSelectedCity = null;
  localStorage.removeItem('preferred_city');
  localStorage.removeItem('last_location_time');
  console.log('🗑️ 已清除城市偏好设置');
}

// 导出辅助函数供其他组件使用
export { setUserCity, clearUserCityPreference, getPopularCities };

export async function getWeather(): Promise<WeatherData> {
  console.log('开始获取天气数据...');
  console.log('API_KEY:', API_KEY ? '已配置' : '未配置');
  
  try {
    const districtId = await getCurrentDistrictId();
    console.log(`使用行政区划ID: ${districtId}`);
    
    const url = `${API_URL}?district_id=${districtId}&data_type=all&ak=${API_KEY}`;
    console.log(`请求URL: ${url}`);
    
    console.log('发送网络请求...');
    const response = await fetch(url);
    console.log('网络请求完成，状态:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('HTTP错误响应:', errorText);
      throw new Error(`HTTP错误: ${response.status} ${response.statusText}`);
    }
    
    console.log('解析JSON响应...');
    const data: WeatherAPIResponse = await response.json();
    console.log('API响应:', data);
    
    if (data.status !== 0) {
      console.error('API状态错误:', data.status, data.message);
      throw new Error(`API错误: ${data.message || '未知错误'}`);
    }
    
    if (!data.result) {
      console.error('API返回数据为空');
      throw new Error('API返回数据为空');
    }
    
    console.log('天气数据获取成功:', data.result);
    return data.result;
  } catch (error) {
    console.error('获取天气数据失败:', error);
    throw error;
  }
}