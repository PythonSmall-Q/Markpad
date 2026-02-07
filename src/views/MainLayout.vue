<template>
  <div class="main-layout">
    <!-- Top menu bar -->
    <HeaderBar />
    
    <!-- Content area -->
    <div class="content-area">
      <!-- Sidebar -->
      <Sidebar v-if="showSidebar" @open-settings="showSettingsPage = true" />
      
      <!-- Main editing area -->
      <div class="main-area" v-if="!showSettingsPage">
        <!-- Document tabs -->
        <DocumentTabs />
        
        <!-- Editor -->
        <EditorView v-if="activeDocument" />
        
        <!-- Welcome page -->
        <WelcomePage v-else />
      </div>
      
      <!-- Settings page -->
      <SettingsPage v-if="showSettingsPage" @close="showSettingsPage = false" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useDocumentsStore } from '@/store/documents'
import { useSettingsStore } from '@/store/settings'
import HeaderBar from '@/components/HeaderBar.vue'
import Sidebar from '@/components/Sidebar.vue'
import DocumentTabs from '@/components/DocumentTabs.vue'
import EditorView from '@/components/EditorView.vue'
import WelcomePage from '@/components/WelcomePage.vue'
import SettingsPage from '@/components/SettingsPage.vue'

const documentsStore = useDocumentsStore()
const settingsStore = useSettingsStore()

const showSettingsPage = ref(false)
const activeDocument = computed(() => documentsStore.activeDocument)
const showSidebar = computed(() => true) // Can be added to settings

onMounted(() => {
  // Load settings
  settingsStore.loadSettings()
  
  // Enable auto-save
  documentsStore.enableAutoSave(settingsStore.autoSaveInterval)
  
  // Keyboard shortcuts
  document.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  // Cleanup
  documentsStore.disableAutoSave()
  document.removeEventListener('keydown', handleKeyDown)
})

function handleKeyDown(e) {
  // Ctrl/Cmd + N: New document
  if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
    e.preventDefault()
    documentsStore.createDocument()
  }
  
  // Ctrl/Cmd + O: Open file
  if ((e.ctrlKey || e.metaKey) && e.key === 'o') {
    e.preventDefault()
    // Trigger open file dialog
  }
  
  // Ctrl/Cmd + S: Save file
  if ((e.ctrlKey || e.metaKey) && e.key === 's') {
    e.preventDefault()
    // Trigger save file
  }
  
  // Ctrl/Cmd + W: Close current document
  if ((e.ctrlKey || e.metaKey) && e.key === 'w') {
    e.preventDefault()
    if (activeDocument.value) {
      documentsStore.closeDocument(activeDocument.value.id)
  
  // Ctrl/Cmd + ,: Open settings
  if ((e.ctrlKey || e.metaKey) && e.key === ',') {
    e.preventDefault()
    showSettingsPage.value = true
  }
  
  // Esc: Close settings page
  if (e.key === 'Escape' && showSettingsPage.value) {
    e.preventDefault()
    showSettingsPage.value = false
  }
    }
  }
}
</script>

<style lang="scss" scoped>
.main-layout {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.content-area {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.main-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
</style>
