<template>
  <div class="sidebar">
    <div class="sidebar-header">
      <h3>文件</h3>
    </div>
    
    <div class="sidebar-content">
      <!-- Recently opened -->
      <div class="section">
        <div class="section-title">最近打开</div>
        <div class="recent-files">
          <div 
            v-for="file in recentFiles" 
            :key="file"
            class="file-item"
            @click="handleOpenRecent(file)"
          >
            <el-icon><Document /></el-icon>
            <span class="file-name">{{ getFileName(file) }}</span>
          </div>
          <div v-if="recentFiles.length === 0" class="empty-text">
            暂无最近文件
          </div>
        </div>
      </div>
      
      <!-- Opened documents -->
      <div class="section">
        <div class="section-title">已打开</div>
        <div class="open-documents">
          <div 
            v-for="doc in documents" 
            :key="doc.id"
            class="doc-item"
            :class="{ active: doc.id === activeDocumentId }"
            @click="handleSelectDocument(doc.id)"
          >
            <el-icon><Document /></el-icon>
            <span class="doc-name">
              {{ doc.title }}
              <span v-if="doc.isDirty" class="dirty-indicator">●</span>
            </span>
            <el-icon class="close-btn" @click.stop="handleCloseDocument(doc.id)">
              <Close />
            </el-icon>
          </div>
          <div v-if="documents.length === 0" class="empty-text">
            暂无文档
          </div>
        </div>
      </div>
    </div>
    
    <!-- Sidebar footer -->
    <div class="sidebar-footer">
      <el-button 
        type="text" 
        class="settings-btn"
        @click="handleOpenSettings"
      >
        <el-icon><Setting /></el-icon>
        <span>设置</span>
      </el-button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Document, Close, Setting } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { useDocumentsStore } from '@/store/documents'
import { useSettingsStore } from '@/store/settings'
import { fileAPI } from '@/utils/electron'

const documentsStore = useDocumentsStore()
const settingsStore = useSettingsStore()

const emit = defineEmits(['open-settings'])

const documents = computed(() => documentsStore.documents)
const activeDocumentId = computed(() => documentsStore.activeDocumentId)
const recentFiles = computed(() => settingsStore.recentFiles)

function getFileName(path) {
  return path.split(/[/\\]/).pop()
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

function handleSelectDocument(id) {
  documentsStore.setActiveDocument(id)
}

function handleCloseDocument(id) {
  const doc = documents.value.find(d => d.id === id)
  if (doc && doc.isDirty) {
    ElMessage.warning('文档有未保存的修改')
  }

function handleOpenSettings() {
  emit('open-settings')
}
  documentsStore.closeDocument(id)
}
</script>

<style lang="scss" scoped>
.sidebar {
  width: 250px;
  background-color: var(--sidebar-bg);
  border-right: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.sidebar-header {
  padding: 16px;
  border-bottom: 1px solid var(--border-color);
  
  h3 {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
  }
}

.sidebar-content {
  flex: 1;
  overflow-y: auto;
  padding: 8px 0;
}

.section {
  margin-bottom: 16px;
  
  .section-title {
    padding: 8px 16px;
    font-size: 12px;
    font-weight: 600;
    color: #909399;
    text-transform: uppercase;
  }
}

.file-item, .doc-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: var(--hover-bg);
  }
  
  .el-icon {
    font-size: 16px;
    color: #909399;
  }
  
  .file-name, .doc-name {
    flex: 1;
    font-size: 14px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.doc-item {
  position: relative;
  
  &.active {
    background-color: var(--hover-bg);
    
    .doc-name {
      font-weight: 600;
    }
  }
  
  .close-btn {
    opacity: 0;
    transition: opacity 0.2s;
    
    &:hover {
      color: #f56c6c;
    }
  }
  
  &:hover .close-btn {
    opacity: 1;
  }
  
  .dirty-indicator {
    color: #409eff;
    margin-left: 4px;
  }
}

.empty-text {
  padding: 16px;

.sidebar-footer {
  padding: 12px 8px;
  border-top: 1px solid var(--border-color);
  
  .settings-btn {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 10px;
    font-size: 14px;
    color: var(--text-color);
    
    &:hover {
      background-color: var(--hover-bg);
    }
    
    .el-icon {
      font-size: 18px;
    }
  }
}
  text-align: center;
  color: #909399;
  font-size: 14px;
}
</style>
