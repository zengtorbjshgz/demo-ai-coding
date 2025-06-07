<template>
  <div class="weather-container">
    <!-- 城市选择器 -->
    <CitySelector 
      :show-selector="showCitySelector"
      @close="closeCitySelector"
      @city-selected="onCitySelected"
    />
    
    <!-- 城市信息栏 -->
    <div class="city-header">
      <div class="city-info">
        <span class="city-name">{{ currentCityName }}</span>
        <button class="city-change-btn" @click="openCitySelector" title="切换城市">
          📍
        </button>
      </div>
    </div>
    
    <div v-if="loading" class="loading">
      <div class="loading-spinner"></div>
      <p>正在获取天气信息...</p>
    </div>
    
    <div v-else-if="error" class="error">
      <p>{{ error }}</p>
      <button @click="fetchWeather" class="retry-btn">重试</button>
    </div>
    <div v-else-if="weatherData" class="weather-content">
      <h2>{{ weatherData.location.city }} {{ weatherData.location.name }} 天气实况</h2>
      <div class="current-weather">
        <p><strong>温度：</strong>{{ weatherData.now.temp }}°C</p>
        <p><strong>体感温度：</strong>{{ weatherData.now.feels_like }}°C</p>
        <p><strong>天气：</strong>{{ weatherData.now.text }}</p>
        <p><strong>风向：</strong>{{ weatherData.now.wind_dir }}</p>
        <p><strong>风力：</strong>{{ weatherData.now.wind_class }}</p>
        <p><strong>相对湿度：</strong>{{ weatherData.now.rh }}%</p>
        <p><strong>更新时间：</strong>{{ formatTime(weatherData.now.uptime) }}</p>
      </div>
      
      <!-- 天气预报 -->
      <div v-if="weatherData.forecasts && weatherData.forecasts.length > 0" class="forecast-section">
        <h4>未来几天预报</h4>
        <div class="forecast-list">
          <div v-for="forecast in weatherData.forecasts.slice(0, 3)" :key="forecast.date" class="forecast-item">
            <div class="forecast-date">{{ forecast.week }}</div>
            <div class="forecast-temp">{{ forecast.low }}°C ~ {{ forecast.high }}°C</div>
            <div class="forecast-weather">{{ forecast.text_day }}</div>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="no-data">
      暂无天气数据
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getWeather } from '../services/weatherService'
import type { WeatherData } from '../types/weather'
import CitySelector from './CitySelector.vue'

const weatherData = ref<WeatherData | null>(null)
const loading = ref(false)
const error = ref('')
const showCitySelector = ref(false)
const currentCityName = ref('定位中...')

const fetchWeather = async () => {
  loading.value = true
  error.value = ''
  
  try {
    const data = await getWeather()
    weatherData.value = data
    // 从天气数据中获取城市名称
    if (data.location?.city) {
      currentCityName.value = data.location.city
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : '获取天气信息失败'
  } finally {
    loading.value = false
  }
}

const openCitySelector = () => {
  showCitySelector.value = true
}

const closeCitySelector = () => {
  showCitySelector.value = false
}

const onCitySelected = (cityCode: string, cityName: string) => {
  if (cityName === '重新定位') {
    currentCityName.value = '重新定位中...'
  } else {
    currentCityName.value = cityName.replace('市', '')
  }
  fetchWeather()
}

// 格式化时间显示
const formatTime = (timeStr: string) => {
  if (!timeStr || timeStr.length !== 14) return timeStr
  
  const year = timeStr.substring(0, 4)
  const month = timeStr.substring(4, 6)
  const day = timeStr.substring(6, 8)
  const hour = timeStr.substring(8, 10)
  const minute = timeStr.substring(10, 12)
  
  return `${year}-${month}-${day} ${hour}:${minute}`
}

onMounted(() => {
  fetchWeather()
})
</script>

<style scoped>
.weather-container {
  padding: 24px;
  border: none;
}

/* 城市信息栏样式 */
.city-header {
  margin-bottom: 20px;
  padding: 16px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
}

.city-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.city-name {
  color: white;
  font-size: 18px;
  font-weight: 600;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.city-change-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 8px;
  padding: 8px 12px;
  color: white;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  backdrop-filter: blur(10px);
}

.city-change-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-1px);
}

/* 加载和错误状态样式优化 */
.loading {
  text-align: center;
  padding: 40px 20px;
  color: #666;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 16px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error {
  text-align: center;
  padding: 40px 20px;
  color: #e74c3c;
}

.retry-btn {
  background: #667eea;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  margin-top: 12px;
  transition: background 0.2s ease;
}

.retry-btn:hover {
  background: #5a6fd8;
}

/* 原有样式继续 */
.weather-container {
  border-radius: 12px;
  margin: 20px 0;
  background: linear-gradient(135deg, #74b9ff 0%, #0984e3 100%);
  color: white;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  max-width: 100%;
  width: 100%;
}

.weather-container h3 {
  margin-top: 0;
  text-align: center;
  font-size: 1.5em;
}

.weather-container h2 {
  margin: 0 0 20px 0;
  text-align: center;
  font-size: 1.3em;
}

.current-weather {
  background: rgba(255, 255, 255, 0.1);
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.current-weather p {
  margin: 8px 0;
  font-size: 1.1em;
}

.forecast-section {
  background: rgba(255, 255, 255, 0.1);
  padding: 15px;
  border-radius: 8px;
}

.forecast-section h4 {
  margin: 0 0 15px 0;
  text-align: center;
}

.forecast-list {
  display: flex;
  gap: 15px;
  justify-content: space-around;
}

.forecast-item {
  text-align: center;
  background: rgba(255, 255, 255, 0.1);
  padding: 10px;
  border-radius: 6px;
  flex: 1;
}

.forecast-date {
  font-weight: bold;
  margin-bottom: 5px;
}

.forecast-temp {
  font-size: 0.9em;
  margin-bottom: 5px;
}

.forecast-weather {
  font-size: 0.8em;
  opacity: 0.9;
}

.loading {
  color: white;
  font-style: italic;
  padding: 20px;
  text-align: center;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
}

.error {
  color: #ffcdd2;
  background-color: rgba(244, 67, 54, 0.2);
  padding: 15px;
  border-radius: 4px;
  border-left: 4px solid #f44336;
}

.no-data {
  color: rgba(255, 255, 255, 0.8);
  font-style: italic;
  text-align: center;
  padding: 20px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
}
</style>