<template>
  <div class="side-nav">
    <div class="menu-section">
      <p class="section-title">MENU</p>
      <ul>
        <li :class="{ active: activeItem === 'Dashboard' }" @click="activeItem = 'Dashboard'">
          <div class="item-content">
            <img src="../assets/icons/home_vector_1.svg" alt="Dashboard Icon" />
            <span>Dashboard</span>
          </div>
          <div v-if="activeItem === 'Dashboard'" class="indicator"></div>
        </li>
        <li :class="{ active: activeItem === 'My Asset' }" @click="activeItem = 'My Asset'">
          <div class="item-content">
            <img src="../assets/icons/wallet_vector.svg" alt="My Asset Icon" />
            <span>My Asset</span>
          </div>
          <div v-if="activeItem === 'My Asset'" class="indicator"></div>
        </li>
        <li :class="{ active: activeItem === 'Analytics' }" @click="activeItem = 'Analytics'">
          <div class="item-content">
            <img src="../assets/icons/chart_vector.svg" alt="Analytics Icon" />
            <span>Analytics</span>
          </div>
          <div v-if="activeItem === 'Analytics'" class="indicator"></div>
        </li>
        <li :class="{ active: activeItem === 'History' }" @click="activeItem = 'History'">
          <div class="item-content">
            <img src="../assets/icons/time_vector.svg" alt="History Icon" />
            <span>History</span>
          </div>
          <div v-if="activeItem === 'History'" class="indicator"></div>
        </li>
        <li :class="{ active: activeItem === 'News' }" @click="activeItem = 'News'">
          <div class="item-content">
            <img src="../assets/icons/news_vector.svg" alt="News Icon" />
            <span>News</span>
          </div>
          <div v-if="activeItem === 'News'" class="indicator"></div>
        </li>
      </ul>
    </div>
    <div class="general-section">
      <p class="section-title">GENERAL</p>
      <ul>
        <li :class="{ active: activeItem === 'Help' }" @click="activeItem = 'Help'">
          <div class="item-content">
            <img src="../assets/icons/info_vector.svg" alt="Help Icon" />
            <span>Help</span>
          </div>
          <div v-if="activeItem === 'Help'" class="indicator"></div>
        </li>
        <li :class="{ active: activeItem === 'Settings' }" @click="activeItem = 'Settings'">
          <div class="item-content">
            <img src="../assets/icons/settings_vector.svg" alt="Settings Icon" />
            <span>Settings</span>
          </div>
          <div v-if="activeItem === 'Settings'" class="indicator"></div>
        </li>
        <li :class="{ active: activeItem === 'Logout' }" @click="activeItem = 'Logout'">
          <div class="item-content">
            <img src="../assets/icons/logout_vector.svg" alt="Logout Icon" />
            <span>Logout</span>
          </div>
          <div v-if="activeItem === 'Logout'" class="indicator"></div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'SideNav',
  setup() {
    const activeItem = ref('Dashboard'); // Default active item

    return {
      activeItem,
    };
  },
});
</script>

<style scoped>
.side-nav {
  width: 256px;
  height: 100vh; /* Full height */
  background-color: #FFFFFF;
  box-shadow: 24px 0px 80px 0px rgba(49, 79, 124, 0.02);
  padding: 32px 16px;
  display: flex;
  flex-direction: column;
  font-family: 'Poppins', sans-serif;
}

.menu-section,
.general-section {
  margin-bottom: 32px;
}

.section-title {
  font-size: 14px;
  color: #8F98B7;
  margin-bottom: 8px;
  padding-left: 16px;
}

ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

li {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  margin-bottom: 8px;
  border-radius: 8px;
  cursor: pointer;
  background-color: rgba(244, 246, 248, 0.73);
  transition: background-color 0.3s ease;
}

li:hover {
  background-color: rgba(230, 232, 235, 0.73);
}

li.active {
  background-color: rgba(244, 246, 248, 0.73); /* Figma uses this for non-active too, active has indicator */
}

li.active .item-content span {
 color: #1CAC70; /* Active text color from Figma */
}

.item-content {
  display: flex;
  align-items: center;
}

.item-content img {
  width: 24px; /* Approximate size from Figma */
  height: 24px; /* Approximate size from Figma */
  margin-right: 12px;
}

.item-content span {
  font-size: 16px; /* Approximate size from Figma */
  color: #5A6482; /* Default text color from Figma */
}

.indicator {
  width: 4px; /* Width from Figma for the active indicator, though it was 14.5px wide in figma, it was a gradient */
  height: 29px;
  background: linear-gradient(to bottom, #1CAC70, #EDDC46);
  border-radius: 0 2px 2px 0; /* Rounded corners on one side */
  position: absolute;
  right: 16px; /* Aligned to the right edge of the li, considering padding */
}

/* Adjustments for active Dashboard item based on Figma */
li.active .item-content img[alt="Dashboard Icon"] + span {
  /* color: #1CAC70; */ /* This is handled by the general active class now */
}

/* Specific icon styling if needed, though Figma data suggests fills are handled by SVG content */
</style>