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
        <el-button :icon="FolderOpened" @click="handleNewFile" title="新建 (Ctrl+N)">
          新建
        </el-button>
        <el-button :icon="Folder" @click="handleOpenFile" title="打开 (Ctrl+O)">
          打开
        </el-button>
        <el-button :icon="DocumentCopy" @click="handleSaveFile" title="保存 (Ctrl+S)" :disabled="!activeDocument">
          保存
        </el-button>
        <el-button @click="handleSaveAs" title="另存为" :disabled="!activeDocument">
          另存为
        </el-button>
      </el-button-group>
      
      <el-divider direction="vertical" />
      
      <el-button-group>
        <el-dropdown @command="handleExport">
          <el-button :icon="Download">
            导出 <el-icon class="el-icon--right"><arrow-down /></el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="markdown">
                <el-icon><Document /></el-icon> Markdown
              </el-dropdown-item>
              <el-dropdown-item command="html">
                <el-icon><Document /></el-icon> HTML
              </el-dropdown-item>
              <el-dropdown-item command="pdf">
                <el-icon><Document /></el-icon> PDF
              </el-dropdown-item>
              <el-dropdown-item command="text">
                <el-icon><Document /></el-icon> 纯文本
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-button-group>
    </div>
    
    <div class="header-right">
      <el-button :icon="Search" circle title="搜索 (Ctrl+F)" @click="handleSearch" />
      <el-button :icon="Setting" circle title="设置" @click="handleSettings" />
      <el-button 
        :icon="theme === 'light' ? Moon : Sunny" 
        circle 
        title="切换主题" 
        @click="toggleTheme" 
      />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { 
  Edit, FolderOpened, Folder, DocumentCopy, Download, 
  Document, Search, Setting, Moon, Sunny, ArrowDown 
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { useDocumentsStore } from '@/store/documents'
import { useSettingsStore } from '@/store/settings'
import { fileAPI, exportAPI } from '@/utils/electron'
import { generateHtmlDocument, markdownToText } from '@/utils/markdown'

const documentsStore = useDocumentsStore()
const settingsStore = useSettingsStore()

const activeDocument = computed(() => documentsStore.activeDocument)
const theme = computed(() => settingsStore.theme)

function handleNewFile() {
  documentsStore.createDocument()
  ElMessage.success('新建文档')
}

async function handleOpenFile() {
  const result = await fileAPI.open()
  if (result) {
    const { filePath, content } = result
    documentsStore.openDocument(filePath, content)
    settingsStore.addRecentFile(filePath)
    ElMessage.success('文件已打开')
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
    ElMessage.success('保存成功')
  } else {
    ElMessage.error('保存失败: ' + result.error)
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
    ElMessage.success('保存成功')
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
      ElMessage.success('导出成功')
    }
  } catch (error) {
    ElMessage.error('导出失败: ' + error.message)
  }
}

function handleSearch() {
  ElMessage.info('搜索功能')
}

function handleSettings() {
  ElMessage.info('设置')
}

function toggleTheme() {
  settingsStore.toggleTheme()
}
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
}

:deep(.el-divider--vertical) {
  height: 24px;
  margin: 0;
}
</style>
