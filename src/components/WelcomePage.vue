<template>
  <div class="welcome-page">
    <div class="welcome-content">
      <div class="logo">
        <el-icon :size="80"><Edit /></el-icon>
      </div>
      
      <h1>欢迎使用 Markpad</h1>
      <p class="subtitle">一个功能强大的 Markdown 笔记本应用</p>
      
      <div class="actions">
        <el-button type="primary" size="large" :icon="FolderOpened" @click="handleNewFile">
          新建文档
        </el-button>
        <el-button size="large" :icon="Folder" @click="handleOpenFile">
          打开文件
        </el-button>
      </div>
      
      <div v-if="recentFiles.length > 0" class="recent-section">
        <h3>最近打开</h3>
        <div class="recent-list">
          <div 
            v-for="file in recentFiles.slice(0, 5)" 
            :key="file"
            class="recent-item"
            @click="handleOpenRecent(file)"
          >
            <el-icon><Document /></el-icon>
            <span>{{ getFileName(file) }}</span>
          </div>
        </div>
      </div>
      
      <div class="features">
        <div class="feature-item">
          <el-icon><Edit /></el-icon>
          <h4>Markdown 编辑</h4>
          <p>实时预览、语法高亮</p>
        </div>
        <div class="feature-item">
          <el-icon><Document /></el-icon>
          <h4>多格式导出</h4>
          <p>PDF、HTML、纯文本</p>
        </div>
        <div class="feature-item">
          <el-icon><Picture /></el-icon>
          <h4>文件插入</h4>
          <p>图片、音视频支持</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Edit, FolderOpened, Folder, Document, Picture } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { useDocumentsStore } from '@/store/documents'
import { useSettingsStore } from '@/store/settings'
import { fileAPI } from '@/utils/electron'

const documentsStore = useDocumentsStore()
const settingsStore = useSettingsStore()

const recentFiles = computed(() => settingsStore.recentFiles)

function getFileName(path) {
  return path.split(/[/\\]/).pop()
}

function handleNewFile() {
  documentsStore.createDocument()
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

async function handleOpenRecent(filePath) {
  try {
    const result = await fileAPI.read(filePath)
    if (result.success) {
      documentsStore.openDocument(filePath, result.content)
      ElMessage.success('文件已打开')
    } else {
      ElMessage.error('无法打开文件')
      settingsStore.removeRecentFile(filePath)
    }
  } catch (error) {
    ElMessage.error('打开文件失败')
  }
}
</script>

<style lang="scss" scoped>
.welcome-page {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--bg-color);
}

.welcome-content {
  text-align: center;
  max-width: 600px;
  padding: 40px;
  
  .logo {
    margin-bottom: 24px;
    color: #409eff;
  }
  
  h1 {
    font-size: 32px;
    margin: 0 0 12px 0;
    color: var(--text-color);
  }
  
  .subtitle {
    font-size: 16px;
    color: #909399;
    margin: 0 0 32px 0;
  }
  
  .actions {
    display: flex;
    gap: 16px;
    justify-content: center;
    margin-bottom: 40px;
  }
  
  .recent-section {
    margin-bottom: 40px;
    
    h3 {
      font-size: 18px;
      margin: 0 0 16px 0;
      color: var(--text-color);
    }
    
    .recent-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    
    .recent-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px;
      background-color: var(--sidebar-bg);
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.2s;
      text-align: left;
      
      &:hover {
        background-color: var(--hover-bg);
        transform: translateX(4px);
      }
      
      .el-icon {
        color: #909399;
      }
      
      span {
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
  
  .features {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
    
    .feature-item {
      padding: 24px;
      background-color: var(--sidebar-bg);
      border-radius: 8px;
      
      .el-icon {
        font-size: 32px;
        color: #409eff;
        margin-bottom: 12px;
      }
      
      h4 {
        font-size: 16px;
        margin: 0 0 8px 0;
        color: var(--text-color);
      }
      
      p {
        font-size: 14px;
        margin: 0;
        color: #909399;
      }
    }
  }
}
</style>
