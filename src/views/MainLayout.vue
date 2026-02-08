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
import { useI18n } from 'vue-i18n'
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
const { t } = useI18n()

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
    ElMessage.info(t('messages.restoredUnsaved', { count: restoredCount }))
  }
  
  // Enable auto-save
  documentsStore.enableAutoSave(settingsStore.autoSaveInterval)
  
  // Keyboard shortcuts
  document.addEventListener('keydown', handleKeyDown)
  
  // 监听窗口关闭事件
  windowAPI.onBeforeClose(handleWindowClose)
  
  // 监听菜单事件
  setupMenuListeners()
  
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

function setupMenuListeners() {
  // 只在 Electron 环境下设置菜单监听
  if (!window.electronAPI || !window.electronAPI.onMenuEvent) return
  
  window.electronAPI.onMenuEvent((action, data) => {
    console.log('Menu action:', action, data)
    
    switch (action) {
      // 文件菜单
      case 'new-document':
        headerBarRef.value?.handleNewFile()
        break
      case 'open-file':
        headerBarRef.value?.handleOpenFile()
        break
      case 'save-file':
        headerBarRef.value?.handleSaveFile()
        break
      case 'save-file-as':
        headerBarRef.value?.handleSaveAs()
        break
      case 'export-html':
        headerBarRef.value?.handleExport('html')
        break
      case 'export-pdf':
        headerBarRef.value?.handleExport('pdf')
        break
      case 'export-markdown':
        headerBarRef.value?.handleExport('markdown')
        break
      case 'close-document':
        if (activeDocument.value) {
          documentsStore.closeDocument(activeDocument.value.id)
        }
        break
      
      // 编辑菜单
      case 'find':
        showSearchDialog.value = true
        showReplaceMode.value = false
        break
      case 'replace':
        showSearchDialog.value = true
        showReplaceMode.value = true
        break
      
      // 视图菜单
      case 'toggle-sidebar':
        // TODO: 实现侧边栏切换
        ElMessage.info('Toggle sidebar - Coming soon')
        break
      case 'toggle-preview':
        editorViewRef.value?.togglePreview()
        break
      
      // 格式菜单（这些需要编辑器支持）
      case 'format-bold':
      case 'format-italic':
      case 'format-strikethrough':
      case 'insert-link':
      case 'insert-image':
      case 'insert-code':
      case 'insert-table':
        editorViewRef.value?.handleFormat(action)
        break
      case 'format-heading':
        editorViewRef.value?.handleFormat('heading', data)
        break
      
      // 帮助菜单
      case 'welcome':
        if (activeDocument.value) {
          documentsStore.closeDocument(activeDocument.value.id)
        }
        break
      case 'check-updates':
        if (updateAPI) {
          window.__manualUpdateCheck = true
          updateAPI.check()
        }
        break
      case 'about':
        showSettingsPage.value = true
        break
    }
  })
}

function setupAutoUpdate() {
  if (!updateAPI) return
  
  // Listen for checking update
  updateAPI.onChecking(() => {
    console.log('Checking for updates...')
  })
  
  // Listen for update not available
  updateAPI.onUpdateNotAvailable((info) => {
    console.log('No updates available, current version:', info?.version)
    // Only show message if user manually checked
    if (window.__manualUpdateCheck) {
      ElMessage.success(t('settings.about.latestVersion'))
      window.__manualUpdateCheck = false
    }
  })
  
  // Listen for update available
  updateAPI.onUpdateAvailable((info) => {
    ElMessageBox.confirm(
      `${t('settings.update.updateAvailable')}: ${info.version}`,
      t('settings.update.title'),
      {
        confirmButtonText: t('settings.update.downloadNow'),
        cancelButtonText: t('settings.update.downloadLater'),
        type: 'info'
      }
    ).then(() => {
      // User chose to download
      ElMessage.info(t('settings.update.downloading'))
      updateAPI.download()
    }).catch(() => {
      // User chose to remind later
      ElMessage.info(t('settings.update.downloadLater'))
    })
  })
  
  // Listen for download progress
  updateAPI.onDownloadProgress((progress) => {
    const percent = Math.round(progress.percent)
    console.log(`Download progress: ${percent}%`)
    // Show progress message every 25%
    if (percent % 25 === 0) {
      ElMessage.info(`${t('settings.update.downloading')}: ${percent}%`)
    }
  })
  
  // Listen for update downloaded
  updateAPI.onUpdateDownloaded(() => {
    ElMessageBox.confirm(
      t('settings.update.updateReady'),
      t('settings.update.title'),
      {
        confirmButtonText: t('settings.update.restartNow'),
        cancelButtonText: t('settings.update.restartLater'),
        type: 'success'
      }
    ).then(() => {
      // User chose to restart
      updateAPI.install()
    }).catch(() => {
      // User chose to restart later
      ElMessage.info(t('settings.update.restartLater'))
    })
  })
  
  // Listen for errors
  updateAPI.onError((error) => {
    console.error('Update error:', error)
    ElMessage.error(`${t('settings.update.checkFailed')}: ${error.error || 'Unknown error'}`)
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
        t('messages.unsavedChanges'),
        t('dialog.warning'),
        {
          confirmButtonText: t('document.save'),
          cancelButtonText: t('document.dontSave'),
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
