<template>
  <div class="header-bar">
    <div class="header-left">
      <h1 class="app-title">
        <el-icon><Edit /></el-icon>
        Markpad
      </h1>
    </div>
    
    <div class="header-center">
      <el-button-group>
        <el-button :icon="FolderOpened" @click="handleNewFile" :title="`${t('header.new')} (Ctrl+N)`">
          {{ t('header.new') }}
        </el-button>
        <el-button :icon="Folder" @click="handleOpenFile" :title="`${t('header.open')} (Ctrl+O)`">
          {{ t('header.open') }}
        </el-button>
        <el-button :icon="DocumentCopy" @click="handleSaveFile" :title="`${t('header.save')} (Ctrl+S)`" :disabled="!activeDocument">
          {{ t('header.save') }}
        </el-button>
        <el-button @click="handleSaveAs" :title="`${t('header.saveAs')} (Ctrl+Shift+S)`" :disabled="!activeDocument">
          {{ t('header.saveAs') }}
        </el-button>
      </el-button-group>
      
      <el-divider direction="vertical" />
      
      <el-button-group>
        <el-dropdown @command="handleExport">
          <el-button :icon="Download">
            {{ t('header.export') }} <el-icon class="el-icon--right"><ArrowDown /></el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="markdown">
                <el-icon><Document /></el-icon> {{ t('header.exportMarkdown') }}
              </el-dropdown-item>
              <el-dropdown-item command="html">
                <el-icon><Document /></el-icon> {{ t('header.exportHtml') }}
              </el-dropdown-item>
              <el-dropdown-item command="pdf">
                <el-icon><Document /></el-icon> {{ t('header.exportPdf') }}
              </el-dropdown-item>
              <el-dropdown-item command="text">
                <el-icon><Document /></el-icon> {{ t('header.exportText') }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-button-group>
    </div>
    
    <div class="header-right">
      <el-button :icon="Search" circle :title="`${t('header.search')} (Ctrl+F)`" @click="handleSearch" />
      <el-button :icon="Setting" circle :title="`${t('header.settings')} (Ctrl+,)`" @click="handleSettings" />
      <el-button 
        :icon="theme === 'light' ? Moon : Sunny" 
        circle 
        :title="t('header.themeToggle')" 
        @click="toggleTheme" 
      />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { 
  Edit, FolderOpened, Folder, DocumentCopy, Download, 
  Document, Search, Setting, Moon, Sunny, ArrowDown 
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { useDocumentsStore } from '@/store/documents'
import { useSettingsStore } from '@/store/settings'
import { fileAPI, exportAPI } from '@/utils/electron'
import { generateHtmlDocument, markdownToText } from '@/utils/markdown'
import { useRouter } from 'vue-router'

const documentsStore = useDocumentsStore()
const settingsStore = useSettingsStore()
const router = useRouter()
const { t } = useI18n()

const activeDocument = computed(() => documentsStore.activeDocument)
const theme = computed(() => settingsStore.theme)

const emit = defineEmits(['openSettings', 'openSearch'])

function handleNewFile() {
  documentsStore.createDocument()
  ElMessage.success(t('welcome.newDocument'))
}

async function handleOpenFile() {
  const result = await fileAPI.open()
  if (result) {
    const { filePath, content } = result
    documentsStore.openDocument(filePath, content)
    settingsStore.addRecentFile(filePath)
    ElMessage.success(t('messages.fileOpened'))
  }
}

async function handleSaveFile() {
  if (!activeDocument.value) return
  
  if (!activeDocument.value.filePath) {
    await handleSaveAs()
    return
  }
  
  const result = await fileAPI.save(
    activeDocument.value.filePath,
    activeDocument.value.content
  )
  
  if (result.success) {
    documentsStore.markAsSaved(activeDocument.value.id)
    ElMessage.success(t('messages.fileSaved'))
  } else {
    ElMessage.error(`${t('messages.saveFailed')}: ${result.error}`)
  }
}

async function handleSaveAs() {
  if (!activeDocument.value) return
  
  const result = await fileAPI.saveAs(
    activeDocument.value.content,
    activeDocument.value.title + '.md'
  )
  
  if (result.success && !result.canceled) {
    documentsStore.updateDocument(activeDocument.value.id, {
      filePath: result.filePath,
      title: result.filePath.split(/[/\\]/).pop()
    })
    documentsStore.markAsSaved(activeDocument.value.id)
    settingsStore.addRecentFile(result.filePath)
    ElMessage.success(t('messages.fileSaved'))
  }
}

async function handleExport(format) {
  if (!activeDocument.value) return
  
  const title = activeDocument.value.title.replace(/\.[^/.]+$/, '')
  
  try {
    let result
    
    switch (format) {
      case 'markdown':
        result = await exportAPI.toMarkdown(activeDocument.value.content, title + '.md')
        break
      case 'html':
        const htmlContent = generateHtmlDocument(activeDocument.value.content, title)
        result = await exportAPI.toHtml(htmlContent, title + '.html')
        break
      case 'pdf':
        result = await exportAPI.toPdf(title + '.pdf')
        break
      case 'text':
        const textContent = markdownToText(activeDocument.value.content)
        result = await exportAPI.toText(textContent, title + '.txt')
        break
    }
    
    if (result && result.success) {
      ElMessage.success(t('export.exportSuccess'))
    }
  } catch (error) {
    ElMessage.error(`${t('export.exportFailed')}: ${error.message}`)
  }
}

function handleSearch() {
  emit('openSearch')
}

function handleSettings() {
  emit('openSettings')
}

function toggleTheme() {
  settingsStore.toggleTheme()
}

// 导出这些函数以供外部调用
defineExpose({
  handleSaveFile,
  handleSaveAs,
  handleOpenFile,
  handleNewFile
})
</script>

<style lang="scss" scoped>
.header-bar {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  background-color: var(--bg-color);
  border-bottom: 1px solid var(--border-color);
  user-select: none;
}

.header-left {
  .app-title {
    font-size: 20px;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 0;
    color: var(--text-color);
  }
}

.header-center {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 8px;
  
  :deep(.el-button.is-circle) {
    border: 1px solid var(--border-color);
    
    &:hover {
      background-color: var(--hover-bg);
      border-color: var(--el-color-primary);
    }
  }
}

:deep(.el-divider--vertical) {
  height: 24px;
  margin: 0;
}
</style>
