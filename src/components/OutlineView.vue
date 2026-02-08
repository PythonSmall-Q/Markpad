<template>
  <div class="outline-view">
    <div class="outline-header">
      <h3>{{ t('outline.title') }}</h3>
      <el-icon @click="$emit('close')" class="close-icon" :title="t('common.close')">
        <Close />
      </el-icon>
    </div>
    
    <el-scrollbar class="outline-content">
      <div v-if="headings.length === 0" class="empty-state">
        <el-icon><DocumentCopy /></el-icon>
        <p>{{ t('outline.empty') }}</p>
      </div>
      
      <div v-else class="headings-list">
        <div
          v-for="(heading, index) in headings"
          :key="index"
          class="heading-item"
          :class="`level-${heading.level}`"
          @click="jumpToHeading(heading)"
        >
          <span class="heading-text">{{ heading.text }}</span>
        </div>
      </div>
    </el-scrollbar>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { Close, DocumentCopy } from '@element-plus/icons-vue'

const { t } = useI18n()

const props = defineProps({
  content: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['close', 'jump-to-line'])

// 解析 Markdown 内容提取标题
const headings = computed(() => {
  const content = props.content || ''
  const lines = content.split('\n')
  const result = []
  
  lines.forEach((line, index) => {
    // 匹配 # 标题语法
    const match = line.match(/^(#{1,6})\s+(.+)$/)
    if (match) {
      const level = match[1].length
      const text = match[2].trim()
      result.push({
        level,
        text,
        line: index + 1
      })
    }
  })
  
  return result
})

// 跳转到指定标题
function jumpToHeading(heading) {
  emit('jump-to-line', heading.line)
}
</script>

<style lang="scss" scoped>
.outline-view {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: var(--bg-color);
  border-left: 1px solid var(--border-color);
  width: 280px;
  
  .outline-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px;
    border-bottom: 1px solid var(--border-color);
    
    h3 {
      margin: 0;
      font-size: 16px;
      font-weight: 600;
      color: var(--text-color);
    }
    
    .close-icon {
      font-size: 20px;
      cursor: pointer;
      color: var(--text-secondary);
      transition: color 0.3s;
      
      &:hover {
        color: var(--text-color);
      }
    }
  }
  
  .outline-content {
    flex: 1;
    padding: 12px;
  }
  
  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 48px 24px;
    color: var(--text-secondary);
    text-align: center;
    
    .el-icon {
      font-size: 48px;
      margin-bottom: 16px;
      opacity: 0.5;
    }
    
    p {
      margin: 0;
      font-size: 14px;
    }
  }
  
  .headings-list {
    .heading-item {
      padding: 8px 12px;
      margin-bottom: 4px;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.2s;
      color: var(--text-color);
      
      &:hover {
        background-color: var(--hover-bg);
      }
      
      .heading-text {
        display: block;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-size: 14px;
      }
      
      &.level-1 {
        font-weight: 600;
        font-size: 15px;
        padding-left: 12px;
      }
      
      &.level-2 {
        font-weight: 500;
        padding-left: 24px;
      }
      
      &.level-3 {
        padding-left: 36px;
        opacity: 0.9;
      }
      
      &.level-4 {
        padding-left: 48px;
        opacity: 0.8;
        font-size: 13px;
      }
      
      &.level-5 {
        padding-left: 60px;
        opacity: 0.7;
        font-size: 13px;
      }
      
      &.level-6 {
        padding-left: 72px;
        opacity: 0.6;
        font-size: 12px;
      }
    }
  }
}
</style>
