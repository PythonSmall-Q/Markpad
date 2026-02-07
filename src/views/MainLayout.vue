<template>
  <div class="main-layout">
    <!-- Top menu bar -->
    <HeaderBar 
      ref="headerBarRef" 
      @open-settings="showSettingsPage = true"
      @open-search="showSearchDialog = true"
    />
    
    <!-- Content area -->
    <div class="content-area">
      <!-- Sidebar -->
      <Sidebar v-if="showSidebar" @open-settings="showSettingsPage = true" />
      
      <!-- Main editing area -->
      <div class="main-area" v-if="!showSettingsPage">
        <!-- Document tabs -->
        <DocumentTabs />
        
        <!-- Editor -->
        <EditorView ref="editorViewRef" v-if="activeDocument" />
        
        <!-- Welcome page -->
        <WelcomePage v-else />
      </div>
    </div>
    
    <!-- Settings page (full screen overlay) -->
    <div v-if="showSettingsPage" class="settings-overlay">
      <SettingsPage @close="showSettingsPage = false" />
    </div>
    
    <!-- Search Dialog -->
    <SearchDialog 
      v-model="showSearchDialog"
      :show-replace="showReplaceMode"
      :editor-view-ref="editorViewRef"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useDocumentsStore } from '@/store/documents'
import { useSettingsStore } from '@/store/settings'
import { windowAPI, updateAPI } from '@/utils/electron'
import { ElMessageBox, ElMessage } from 'element-plus'
import HeaderBar from '@/components/HeaderBar.vue'
import Sidebar from '@/components/Sidebar.vue'
import DocumentTabs from '@/components/DocumentTabs.vue'
import EditorView from '@/components/EditorView.vue'
import WelcomePage from '@/components/WelcomePage.vue'
import SettingsPage from '@/components/SettingsPage.vue'
import SearchDialog from '@/components/SearchDialog.vue'

const documentsStore = useDocumentsStore()
const settingsStore = useSettingsStore()

const showSettingsPage = ref(false)
const showSearchDialog = ref(false)
const showReplaceMode = ref(false)
const headerBarRef = ref(null)
const editorViewRef = ref(null)
const activeDocument = computed(() => documentsStore.activeDocument)
const showSidebar = computed(() => true) // Can be added to settings

onMounted(async () => {
  // Load settings
  settingsStore.loadSettings()
  
  // 恢复临时保存的文档
  const restoredCount = await documentsStore.restoreTempDocuments()
  if (restoredCount > 0) {
    ElMessage.info(`已恢复 ${restoredCount} 个未保存的文档`)
  }
  
  // Enable auto-save
  documentsStore.enableAutoSave(settingsStore.autoSaveInterval)
  
  // Keyboard shortcuts
  document.addEventListener('keydown', handleKeyDown)
  
  // 监听窗口关闭事件
  windowAPI.onBeforeClose(handleWindowClose)
  
  // Setup auto-update event listeners
  setupAutoUpdate()
  
  // Check for updates if enabled
  if (settingsStore.autoCheckUpdates && updateAPI) {
    setTimeout(() => {
      updateAPI.check().catch(err => {
        console.error('Auto-update check failed:', err)
      })
    }, 3000) // Check after 3 seconds
  }
})

function setupAutoUpdate() {
  if (!updateAPI) return
  
  // Listen for update available
  updateAPI.onUpdateAvailable((info) => {
    ElMessageBox.confirm(
      `发现新版本 ${info.version}，是否立即下载？`,
      '更新可用',
      {
        confirmButtonText: '立即下载',
        cancelButtonText: '稍后提醒',
        type: 'info'
      }
    ).then(() => {
      // User chose to download
      if (settingsStore.autoDownloadUpdates) {
        updateAPI.download()
      } else {
        ElMessage.info('开始下载更新...')
        updateAPI.download()
      }
    }).catch(() => {
      // User chose to remind later
      ElMessage.info('您可以稍后在设置中检查更新')
    })
  })
  
  // Listen for download progress
  updateAPI.onDownloadProgress((progress) => {
    const percent = Math.round(progress.percent)
    ElMessage.info(`正在下载更新: ${percent}%`)
  })
  
  // Listen for update downloaded
  updateAPI.onUpdateDownloaded(() => {
    ElMessageBox.confirm(
      '新版本已下载完成，是否立即重启安装？',
      '更新就绪',
      {
        confirmButtonText: '立即重启',
        cancelButtonText: '稍后重启',
        type: 'success'
      }
    ).then(() => {
      // User chose to restart
      updateAPI.install()
    }).catch(() => {
      // User chose to restart later
      ElMessage.info('您可以稍后手动重启应用以完成更新')
    })
  })
}

onUnmounted(() => {
  // Cleanup
  documentsStore.disableAutoSave()
  document.removeEventListener('keydown', handleKeyDown)
})

async function handleWindowClose(event) {
  // 直接关闭，不弹出确认框
  // 保存临时文件（下次启动时可以恢复）
  await documentsStore.saveTempDocuments()
  
  // 确认关闭
  windowAPI.confirmClose(true)
}

function handleKeyDown(e) {
  // Ctrl/Cmd + N: New document
  if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
    e.preventDefault()
    headerBarRef.value?.handleNewFile()
  }
  
  // Ctrl/Cmd + O: Open file
  if ((e.ctrlKey || e.metaKey) && e.key === 'o') {
    e.preventDefault()
    headerBarRef.value?.handleOpenFile()
  }
  
  // Ctrl/Cmd + S: Save file
  if ((e.ctrlKey || e.metaKey) && e.key === 's' && !e.shiftKey) {
    e.preventDefault()
    headerBarRef.value?.handleSaveFile()
  }
  
  // Ctrl/Cmd + Shift + S: Save as
  if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'S') {
    e.preventDefault()
    headerBarRef.value?.handleSaveAs()
  }
  
  // Ctrl/Cmd + W: Close current document
  if ((e.ctrlKey || e.metaKey) && e.key === 'w') {
    e.preventDefault()
    if (activeDocument.value) {
      handleCloseDocument(activeDocument.value.id)
    }
  }
  
  // Ctrl/Cmd + F: Search
  if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
    e.preventDefault()
    showReplaceMode.value = false
    showSearchDialog.value = true
    showSettingsPage.value = false
  }
  
  // Ctrl/Cmd + H: Replace
  if ((e.ctrlKey || e.metaKey) && e.key === 'h') {
    e.preventDefault()
    showReplaceMode.value = true
    showSearchDialog.value = true
    showSettingsPage.value = false
  }
  
  // Esc: Close search dialog
  if (e.key === 'Escape' && showSearchDialog.value) {
    e.preventDefault()
    showSearchDialog.value = false
  }
  
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

async function handleCloseDocument(id) {
  const doc = documentsStore.documents.find(d => d.id === id)
  if (doc && doc.isDirty) {
    const { ElMessageBox } = await import('element-plus')
    try {
      await ElMessageBox.confirm(
        '文档有未保存的更改，是否要保存？',
        '提示',
        {
          confirmButtonText: '保存',
          cancelButtonText: '不保存',
          distinguishCancelAndClose: true,
          type: 'warning'
        }
      )
      // 用户选择保存
      await headerBarRef.value?.handleSaveFile()
      documentsStore.closeDocument(id)
    } catch (action) {
      if (action === 'cancel') {
        // 用户选择不保存
        documentsStore.closeDocument(id)
      }
      // 用户选择取消,不关闭文档
    }
  } else {
    documentsStore.closeDocument(id)
  }
}

// Export function to open search dialog
defineExpose({
  openSearch: () => {
    showReplaceMode.value = false
    showSearchDialog.value = true
  },
  openReplace: () => {
    showReplaceMode.value = true
    showSearchDialog.value = true
  }
})
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

.settings-overlay {
  position: fixed;
  top: 60px;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--bg-color);
  z-index: 1000;
  overflow: hidden;
}
</style>
