// 定义百度天气 API 返回的原始数据结构
export interface WeatherAPIResponse {
  status: number;
  message?: string; // 错误信息，成功时可能不存在
  result?: WeatherData;
}

// 定义天气数据结构 (基于百度天气API文档)
export interface WeatherData {
  location: LocationInfo;
  now: CurrentWeather;
  forecasts: DailyForecast[];
  indexes?: WeatherIndex[]; // 可能不存在
  alerts?: WeatherAlert[]; // 可能没有预警信息
}

export interface LocationInfo {
  country: string;
  province: string;
  city: string;
  name: string; // 区县名称
  id: string;   // 行政区划代码
}

export interface CurrentWeather {
  temp: number;        // 温度，单位℃
  feels_like: number;  // 体感温度，单位℃
  rh: number;          // 相对湿度，单位%
  wind_class: string;  // 风力等级
  wind_dir: string;    // 风向
  text: string;        // 天气现象文字，例如“多云”
  prec_1h?: number;     // 1小时累计降水量，单位mm (可选)
  clouds?: number;      // 云量，天空被云覆盖的百分比，0-100 (可选)
  vis?: number;         // 能见度，单位米 (可选)
  uptime: string;      // 数据更新时间，格式 YYYYMMDDHHMMSS
  // 以下为空气质量相关，根据API文档可能存在
  aqi?: number;         // 空气质量指数 (AQI)
  pm25?: number;        // PM2.5浓度，单位μg/m³
  pm10?: number;        // PM10浓度，单位μg/m³
  o3?: number;          // 臭氧浓度，单位μg/m³
  no2?: number;         // 二氧化氮浓度，单位μg/m³
  so2?: number;         // 二氧化硫浓度，单位μg/m³
  co?: number;          // 一氧化碳浓度，单位mg/m³
}

export interface DailyForecast {
  date: string;        // 日期，格式 YYYY-MM-DD
  week: string;        // 星期
  high: number;        // 最高温度，单位℃
  low: number;         // 最低温度，单位℃
  wc_day: string;      // 白天风力
  wc_night: string;    // 夜间风力
  wd_day: string;      // 白天风向
  wd_night: string;    // 夜间风向
  text_day: string;    // 白天天气现象
  text_night: string;  // 夜间天气现象
  aqi?: number;         // 当日空气质量指数 (可选)
}

export interface WeatherIndex {
  name: string;        // 指数名称，例如“穿衣指数”
  brief: string;       // 指数级别或概况，例如“舒适”
  detail: string;      // 指数详细描述
}

export interface WeatherAlert {
  type: string;        // 预警类型，例如“暴雨”
  level: string;       // 预警级别，例如“蓝色预警”
  title: string;       // 预警标题
  desc: string;        // 预警详细描述
}