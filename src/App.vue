<template>
  <div id="app" :class="['app-container', theme]">
    <router-view />
    <LanguageSelector 
      v-model="showLanguageSelector" 
      :is-first-time="isFirstLaunch"
      @confirm="handleLanguageConfirm"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useSettingsStore } from './store/settings'
import LanguageSelector from './components/LanguageSelector.vue'

const settingsStore = useSettingsStore()
const theme = computed(() => settingsStore.theme)

const showLanguageSelector = ref(false)
const isFirstLaunch = ref(false)

onMounted(() => {
  // Check if this is the first launch
  const firstLaunch = localStorage.getItem('markpad-first-launch')
  if (firstLaunch === null) {
    // First time launching the app
    isFirstLaunch.value = true
    showLanguageSelector.value = true
  }
  
  // Diagnostic: Check if running in Electron
  if (typeof window !== 'undefined') {
    console.log('=== Application Environment Check ===')
    console.log('Window object exists:', true)
    console.log('electronAPI exists:', typeof window.electronAPI !== 'undefined')
    
    if (window.electronAPI) {
      console.log('✓ Running in Electron environment')
      console.log('Available API methods:', Object.keys(window.electronAPI).join(', '))
    } else {
      console.warn('⚠ Not running in Electron environment')
      console.warn('File operations will not work.')
      console.warn('Please run: npm run electron:dev or use the packaged application')
    }
  }
})

const handleLanguageConfirm = () => {
  showLanguageSelector.value = false
}
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
