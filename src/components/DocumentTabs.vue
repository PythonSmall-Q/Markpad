<template>
  <div class="document-tabs">
    <div class="tabs-container">
      <div 
        v-for="doc in documents" 
        :key="doc.id"
        class="tab-item"
        :class="{ active: doc.id === activeDocumentId }"
        @click="handleSelectTab(doc.id)"
      >
        <span class="tab-title">
          {{ doc.title }}
          <span v-if="doc.isDirty" class="dirty-dot">●</span>
        </span>
        <el-icon class="close-icon" @click.stop="handleCloseTab(doc.id)">
          <Close />
        </el-icon>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Close } from '@element-plus/icons-vue'
import { ElMessageBox } from 'element-plus'
import { useDocumentsStore } from '@/store/documents'

const documentsStore = useDocumentsStore()

const documents = computed(() => documentsStore.documents)
const activeDocumentId = computed(() => documentsStore.activeDocumentId)

function handleSelectTab(id) {
  documentsStore.setActiveDocument(id)
}

async function handleCloseTab(id) {
  const doc = documents.value.find(d => d.id === id)
  
  if (doc && doc.isDirty) {
    try {
      await ElMessageBox.confirm(
        '文档有未保存的修改，确定要关闭吗？',
        '提示',
        {
          confirmButtonText: '关闭',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
      documentsStore.closeDocument(id)
    } catch {
      // User cancelled
    }
  } else {
    documentsStore.closeDocument(id)
  }
}
</script>

<style lang="scss" scoped>
.document-tabs {
  height: 40px;
  background-color: var(--sidebar-bg);
  border-bottom: 1px solid var(--border-color);
  overflow: hidden;
}

.tabs-container {
  display: flex;
  height: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  
  &::-webkit-scrollbar {
    height: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background-color: #909399;
    border-radius: 2px;
  }
}

.tab-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 16px;
  min-width: 120px;
  max-width: 200px;
  height: 100%;
  background-color: var(--sidebar-bg);
  border-right: 1px solid var(--border-color);
  cursor: pointer;
  user-select: none;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: var(--hover-bg);
  }
  
  &.active {
    background-color: var(--bg-color);
    
    .tab-title {
      font-weight: 600;
    }
  }
  
  .tab-title {
    flex: 1;
    font-size: 14px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    
    .dirty-dot {
      color: #409eff;
      margin-left: 4px;
    }
  }
  
  .close-icon {
    font-size: 14px;
    opacity: 0;
    transition: opacity 0.2s;
    
    &:hover {
      color: #f56c6c;
    }
  }
  
  &:hover .close-icon,
  &.active .close-icon {
    opacity: 1;
  }
}
</style>
