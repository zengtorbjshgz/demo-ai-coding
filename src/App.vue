<script setup lang="ts">
import SideNav from './components/SideNav.vue';
import WeatherDisplay from './components/WeatherDisplay.vue';
</script>

<template>
  <div class="app-container">
    <!-- 左侧导航菜单 -->
    <div class="sidebar">
      <SideNav />
    </div>
    
    <!-- 右侧主内容区域 -->
    <div class="main-content">
      <!-- 顶部Logo区域 -->
      <div class="header">
        <a href="https://vite.dev" target="_blank">
          <img src="/vite.svg" class="logo" alt="Vite logo" />
        </a>
        <a href="https://vuejs.org/" target="_blank">
          <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
        </a>
      </div>
      
      <!-- 主要内容 -->
       <div class="content-area">
         <WeatherDisplay />
       </div>
    </div>
  </div>
</template>

<style scoped>
.app-container {
  display: flex;
  min-height: 100vh;
  background-color: #f5f5f5;
}

.sidebar {
  width: 280px;
  background-color: #fff;
  box-shadow: 2px 0 4px rgba(0, 0, 0, 0.1);
  position: fixed;
  height: 100vh;
  overflow-y: auto;
  z-index: 1000;
}

.main-content {
  flex: 1;
  margin-left: 280px;
  display: flex;
  flex-direction: column;
}

.header {
  background-color: #fff;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
}

.content-area {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}

.logo {
  height: 4em;
  padding: 0.5em;
  will-change: filter;
  transition: filter 300ms;
}

.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}

.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .sidebar {
    width: 250px;
  }
  
  .main-content {
    margin-left: 250px;
  }
}

@media (max-width: 640px) {
  .sidebar {
    width: 100%;
    position: relative;
    height: auto;
  }
  
  .main-content {
    margin-left: 0;
  }
  
  .app-container {
    flex-direction: column;
  }
}
</style>
