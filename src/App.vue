<template>
  <div id="app" :class="['app-container', theme]">
    <router-view />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useSettingsStore } from './store/settings'

const settingsStore = useSettingsStore()
const theme = computed(() => settingsStore.theme)
</script>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body, #app {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.app-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  
  &.light {
    --bg-color: #ffffff;
    --text-color: #303133;
    --border-color: #dcdfe6;
    --hover-bg: #f5f7fa;
    --sidebar-bg: #f8f9fa;
  }
  
  &.dark {
    --bg-color: #1e1e1e;
    --text-color: #e4e4e4;
    --border-color: #3f3f3f;
    --hover-bg: #2d2d2d;
    --sidebar-bg: #252526;
  }
  
  background-color: var(--bg-color);
  color: var(--text-color);
}
</style>
