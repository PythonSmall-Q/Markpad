<template>
  <div class="help-page">
    <div class="help-header">
      <el-icon @click="$emit('close')" class="close-icon"><Close /></el-icon>
      <h2>{{ t('help.title') }}</h2>
    </div>
    
    <el-scrollbar class="help-content">
      <el-collapse v-model="activeNames" accordion>
        <!-- 快速开始 -->
        <el-collapse-item :title="t('help.quickStart.title')" name="1">
          <div class="help-section">
            <p>{{ t('help.quickStart.desc') }}</p>
            <ol>
              <li>{{ t('help.quickStart.step1') }}</li>
              <li>{{ t('help.quickStart.step2') }}</li>
              <li>{{ t('help.quickStart.step3') }}</li>
              <li>{{ t('help.quickStart.step4') }}</li>
            </ol>
          </div>
        </el-collapse-item>

        <!-- 编辑器功能 -->
        <el-collapse-item :title="t('help.editor.title')" name="2">
          <div class="help-section">
            <h3>{{ t('help.editor.formatting') }}</h3>
            <ul>
              <li><strong>{{ t('help.editor.bold') }}</strong>: Ctrl+B</li>
              <li><em>{{ t('help.editor.italic') }}</em>: Ctrl+I</li>
              <li><s>{{ t('help.editor.strikethrough') }}</s>: {{ t('help.editor.toolbar') }}</li>
            </ul>
            
            <h3>{{ t('help.editor.lists') }}</h3>
            <ul>
              <li>{{ t('help.editor.unordered') }}</li>
              <li>{{ t('help.editor.ordered') }}</li>
            </ul>
            
            <h3>{{ t('help.editor.other') }}</h3>
            <ul>
              <li>{{ t('help.editor.links') }}</li>
              <li>{{ t('help.editor.images') }}</li>
              <li>{{ t('help.editor.tables') }}</li>
              <li>{{ t('help.editor.code') }}</li>
            </ul>
          </div>
        </el-collapse-item>

        <!-- 快捷键 -->
        <el-collapse-item :title="t('help.shortcuts.title')" name="3">
          <div class="help-section">
            <el-table :data="shortcuts" stripe>
              <el-table-column prop="action" :label="t('help.shortcuts.action')" width="200" />
              <el-table-column prop="key" :label="t('help.shortcuts.key')" />
            </el-table>
          </div>
        </el-collapse-item>

        <!-- 文档管理 -->
        <el-collapse-item :title="t('help.documents.title')" name="4">
          <div class="help-section">
            <p>{{ t('help.documents.desc') }}</p>
            <ul>
              <li>{{ t('help.documents.create') }}</li>
              <li>{{ t('help.documents.save') }}</li>
              <li>{{ t('help.documents.open') }}</li>
              <li>{{ t('help.documents.tabs') }}</li>
            </ul>
          </div>
        </el-collapse-item>

        <!-- 导出功能 -->
        <el-collapse-item :title="t('help.export.title')" name="5">
          <div class="help-section">
            <p>{{ t('help.export.desc') }}</p>
            <ul>
              <li>{{ t('help.export.html') }}</li>
              <li>{{ t('help.export.pdf') }}</li>
              <li>{{ t('help.export.markdown') }}</li>
              <li>{{ t('help.export.text') }}</li>
            </ul>
          </div>
        </el-collapse-item>

        <!-- 常见问题 -->
        <el-collapse-item :title="t('help.faq.title')" name="6">
          <div class="help-section">
            <h3>{{ t('help.faq.q1') }}</h3>
            <p>{{ t('help.faq.a1') }}</p>
            
            <h3>{{ t('help.faq.q2') }}</h3>
            <p>{{ t('help.faq.a2') }}</p>
            
            <h3>{{ t('help.faq.q3') }}</h3>
            <p>{{ t('help.faq.a3') }}</p>
          </div>
        </el-collapse-item>
      </el-collapse>
    </el-scrollbar>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { Close } from '@element-plus/icons-vue'

const { t } = useI18n()
const activeNames = ref(['1'])

defineEmits(['close'])

const shortcuts = ref([
  { action: t('help.shortcuts.newDoc'), key: 'Ctrl+N' },
  { action: t('help.shortcuts.saveDoc'), key: 'Ctrl+S' },
  { action: t('help.shortcuts.openDoc'), key: 'Ctrl+O' },
  { action: t('help.shortcuts.bold'), key: 'Ctrl+B' },
  { action: t('help.shortcuts.italic'), key: 'Ctrl+I' },
  { action: t('help.shortcuts.find'), key: 'Ctrl+F' },
  { action: t('help.shortcuts.replace'), key: 'Ctrl+H' },
  { action: t('help.shortcuts.undo'), key: 'Ctrl+Z' },
  { action: t('help.shortcuts.redo'), key: 'Ctrl+Y / Ctrl+Shift+Z' }
])
</script>

<style lang="scss" scoped>
.help-page {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: var(--el-bg-color);
}

.help-header {
  padding: 20px;
  border-bottom: 1px solid var(--el-border-color);
  display: flex;
  align-items: center;
  gap: 12px;
  
  h2 {
    margin: 0;
    font-size: 24px;
    color: var(--el-text-color-primary);
  }
  
  .close-icon {
    font-size: 24px;
    cursor: pointer;
    color: var(--el-text-color-regular);
    transition: color 0.3s;
    
    &:hover {
      color: var(--el-color-primary);
    }
  }
}

.help-content {
  flex: 1;
  padding: 20px;
  
  :deep(.el-collapse) {
    border: none;
  }
  
  :deep(.el-collapse-item__header) {
    font-size: 16px;
    font-weight: 600;
    padding: 12px 0;
  }
}

.help-section {
  padding: 12px 0;
  
  h3 {
    margin: 16px 0 8px;
    font-size: 16px;
    color: var(--el-text-color-primary);
  }
  
  p {
    margin: 8px 0;
    line-height: 1.6;
    color: var(--el-text-color-regular);
  }
  
  ul, ol {
    margin: 8px 0;
    padding-left: 24px;
    
    li {
      margin: 6px 0;
      line-height: 1.6;
      color: var(--el-text-color-regular);
    }
  }
}
</style>
