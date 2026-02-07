<template>
  <div class="main-layout">
    <!-- 顶部菜单栏 -->
    <HeaderBar />
    
    <!-- 内容区域 -->
    <div class="content-area">
      <!-- 侧边栏 -->
      <Sidebar v-if="showSidebar" @open-settings="showSettingsPage = true" />
      
      <!-- 主编辑区 -->
      <div class="main-area" v-if="!showSettingsPage">
        <!-- 文档标签 -->
        <DocumentTabs />
        
        <!-- 编辑器 -->
        <EditorView v-if="activeDocument" />
        
        <!-- 欢迎页 -->
        <WelcomePage v-else />
      </div>
      
      <!-- 设置页面 -->
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
const showSidebar = computed(() => true) // 可以添加到设置中

onMounted(() => {
  // 加载设置
  settingsStore.loadSettings()
  
  // 启用自动保存
  documentsStore.enableAutoSave(settingsStore.autoSaveInterval)
  
  // 快捷键
  document.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  // 清理
  documentsStore.disableAutoSave()
  document.removeEventListener('keydown', handleKeyDown)
})

function handleKeyDown(e) {
  // Ctrl/Cmd + N: 新建文档
  if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
    e.preventDefault()
    documentsStore.createDocument()
  }
  
  // Ctrl/Cmd + O: 打开文件
  if ((e.ctrlKey || e.metaKey) && e.key === 'o') {
    e.preventDefault()
    // 触发打开文件对话框
  }
  
  // Ctrl/Cmd + S: 保存文件
  if ((e.ctrlKey || e.metaKey) && e.key === 's') {
    e.preventDefault()
    // 触发保存文件
  }
  
  // Ctrl/Cmd + W: 关闭当前文档
  if ((e.ctrlKey || e.metaKey) && e.key === 'w') {
    e.preventDefault()
    if (activeDocument.value) {
      documentsStore.closeDocument(activeDocument.value.id)
  
  // Ctrl/Cmd + ,: 打开设置
  if ((e.ctrlKey || e.metaKey) && e.key === ',') {
    e.preventDefault()
    showSettingsPage.value = true
  }
  
  // Esc: 关闭设置页面
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
