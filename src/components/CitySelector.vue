<template>
  <div class="city-selector" v-if="showSelector">
    <div class="selector-overlay" @click="closeSelector"></div>
    <div class="selector-modal">
      <div class="selector-header">
        <h3>选择城市</h3>
        <button class="close-btn" @click="closeSelector">×</button>
      </div>
      
      <div class="selector-content">
        <div class="location-section">
          <button 
            class="location-btn" 
            @click="requestLocation"
            :disabled="isLocating"
          >
            <span class="location-icon">📍</span>
            {{ isLocating ? '定位中...' : '重新定位' }}
          </button>
        </div>
        
        <div class="popular-cities">
          <h4>热门城市</h4>
          <div class="cities-grid">
            <button 
              v-for="city in popularCities" 
              :key="city.code"
              class="city-btn"
              @click="selectCity(city.code, city.name)"
            >
              {{ city.name.replace('市', '') }}
            </button>
          </div>
        </div>
        
        <div class="search-section">
          <h4>搜索城市</h4>
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="输入城市名称"
            class="search-input"
            @input="filterCities"
          >
          <div class="search-results" v-if="filteredCities.length > 0">
            <button 
              v-for="city in filteredCities.slice(0, 8)" 
              :key="city.code"
              class="city-btn small"
              @click="selectCity(city.code, city.name)"
            >
              {{ city.name }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { setUserCity, clearUserCityPreference, getPopularCities } from '../services/weatherService'

interface City {
  name: string
  code: string
}

const props = defineProps<{
  showSelector: boolean
}>()

const emit = defineEmits<{
  close: []
  citySelected: [cityCode: string, cityName: string]
}>()

const searchQuery = ref('')
const isLocating = ref(false)
const popularCities = ref<City[]>(getPopularCities())

// 所有城市列表（从weatherService中的映射表获取）
const allCities = ref<City[]>([
  { name: '北京市', code: '110100' },
  { name: '上海市', code: '310100' },
  { name: '天津市', code: '120100' },
  { name: '重庆市', code: '500100' },
  { name: '广州市', code: '440100' },
  { name: '深圳市', code: '440300' },
  { name: '杭州市', code: '330100' },
  { name: '南京市', code: '320100' },
  { name: '武汉市', code: '420100' },
  { name: '成都市', code: '510100' },
  { name: '西安市', code: '610100' },
  { name: '郑州市', code: '410100' },
  { name: '济南市', code: '370100' },
  { name: '青岛市', code: '370200' },
  { name: '大连市', code: '210200' },
  { name: '沈阳市', code: '210100' },
  { name: '长春市', code: '220100' },
  { name: '哈尔滨市', code: '230100' },
  { name: '石家庄市', code: '130100' },
  { name: '太原市', code: '140100' },
  { name: '呼和浩特市', code: '150100' },
  { name: '长沙市', code: '430100' },
  { name: '南昌市', code: '360100' },
  { name: '福州市', code: '350100' },
  { name: '厦门市', code: '350200' },
  { name: '合肥市', code: '340100' },
  { name: '南宁市', code: '450100' },
  { name: '海口市', code: '460100' },
  { name: '贵阳市', code: '520100' },
  { name: '昆明市', code: '530100' },
  { name: '拉萨市', code: '540100' },
  { name: '兰州市', code: '620100' },
  { name: '西宁市', code: '630100' },
  { name: '银川市', code: '640100' },
  { name: '乌鲁木齐市', code: '650100' }
])

const filteredCities = ref<City[]>([])

const filterCities = () => {
  if (!searchQuery.value.trim()) {
    filteredCities.value = []
    return
  }
  
  const query = searchQuery.value.toLowerCase()
  filteredCities.value = allCities.value.filter(city => 
    city.name.toLowerCase().includes(query) ||
    city.name.replace('市', '').toLowerCase().includes(query)
  )
}

const selectCity = (cityCode: string, cityName: string) => {
  setUserCity(cityCode)
  emit('citySelected', cityCode, cityName)
  closeSelector()
}

const requestLocation = async () => {
  isLocating.value = true
  try {
    // 清除之前的城市偏好，重新定位
    clearUserCityPreference()
    // 触发重新获取天气数据
    emit('citySelected', '', '重新定位')
  } catch (error) {
    console.error('重新定位失败:', error)
  } finally {
    isLocating.value = false
    closeSelector()
  }
}

const closeSelector = () => {
  emit('close')
}
</script>

<style scoped>
.city-selector {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.selector-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
}

.selector-modal {
  position: relative;
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  max-width: 480px;
  width: 90vw;
  max-height: 80vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.selector-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid #f0f0f0;
  background: #fafafa;
}

.selector-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  color: #666;
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: #f0f0f0;
  color: #333;
}

.selector-content {
  padding: 24px;
  overflow-y: auto;
  flex: 1;
}

.location-section {
  margin-bottom: 24px;
}

.location-btn {
  width: 100%;
  padding: 12px 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.location-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.location-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.location-icon {
  font-size: 18px;
}

.popular-cities, .search-section {
  margin-bottom: 24px;
}

.popular-cities h4, .search-section h4 {
  margin: 0 0 12px 0;
  font-size: 14px;
  font-weight: 600;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.cities-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
  gap: 8px;
}

.city-btn {
  padding: 12px 16px;
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  font-size: 14px;
  color: #495057;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: center;
}

.city-btn:hover {
  background: #e9ecef;
  border-color: #dee2e6;
  transform: translateY(-1px);
}

.city-btn.small {
  padding: 8px 12px;
  font-size: 13px;
}

.search-input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  font-size: 16px;
  outline: none;
  transition: border-color 0.2s ease;
  margin-bottom: 12px;
}

.search-input:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.search-results {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 8px;
}

@media (max-width: 480px) {
  .selector-modal {
    width: 95vw;
    margin: 20px;
  }
  
  .cities-grid {
    grid-template-columns: repeat(auto-fit, minmax(70px, 1fr));
  }
  
  .search-results {
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  }
}
</style>