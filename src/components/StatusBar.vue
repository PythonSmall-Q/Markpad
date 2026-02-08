<template>
  <div class="status-bar">
    <div class="status-item">
      <el-icon><Document /></el-icon>
      <span>{{ t('statusBar.lines') }}: {{ stats.lines }}</span>
    </div>
    
    <el-divider direction="vertical" />
    
    <div class="status-item">
      <el-icon><Edit /></el-icon>
      <span>{{ t('statusBar.words') }}: {{ stats.words }}</span>
    </div>
    
    <el-divider direction="vertical" />
    
    <div class="status-item">
      <el-icon><Reading /></el-icon>
      <span>{{ t('statusBar.chars') }}: {{ stats.chars }}</span>
    </div>
    
    <el-divider direction="vertical" />
    
    <div class="status-item">
      <el-icon><Clock /></el-icon>
      <span>{{ t('statusBar.readTime') }}: {{ readTime }}</span>
    </div>
    
    <div class="spacer"></div>
    
    <el-button 
      size="small" 
      text 
      @click="$emit('show-outline')"
      :title="t('statusBar.outline')"
    >
      <el-icon><List /></el-icon>
      {{ t('statusBar.outline') }}
    </el-button>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { Document, Edit, Reading, Clock, List } from '@element-plus/icons-vue'

const { t } = useI18n()

const props = defineProps({
  content: {
    type: String,
    default: ''
  }
})

defineEmits(['show-outline'])

// 计算统计数据
const stats = computed(() => {
  const content = props.content || ''
  
  // 行数
  const lines = content.split('\n').length
  
  // 字符数（含空格）
  const chars = content.length
  
  // 字符数（不含空格）
  const charsNoSpace = content.replace(/\s/g, '').length
  
  // 词数（中英文混合计数）
  let words = 0
  
  // 统计英文词数
  const englishWords = content.match(/[a-zA-Z]+/g)
  if (englishWords) {
    words += englishWords.length
  }
  
  // 统计中文字符数
  const chineseChars = content.match(/[\u4e00-\u9fa5]/g)
  if (chineseChars) {
    words += chineseChars.length
  }
  
  return {
    lines,
    chars,
    charsNoSpace,
    words
  }
})

// 计算预计阅读时间（假设每分钟阅读200个中文字或300个英文词）
const readTime = computed(() => {
  const content = props.content || ''
  
  // 统计中文字符
  const chineseChars = content.match(/[\u4e00-\u9fa5]/g)
  const chineseCount = chineseChars ? chineseChars.length : 0
  
  // 统计英文词
  const englishWords = content.match(/[a-zA-Z]+/g)
  const englishCount = englishWords ? englishWords.length : 0
  
  // 计算阅读时间（分钟）
  const minutes = Math.ceil(chineseCount / 300 + englishCount / 200)
  
  if (minutes < 1) {
    return t('statusBar.lessThanMinute')
  } else if (minutes === 1) {
    return '1 ' + t('statusBar.minute')
  } else {
    return `${minutes} ${t('statusBar.minutes')}`
  }
})
</script>

<style lang="scss" scoped>
.status-bar {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 4px 16px;
  background-color: var(--sidebar-bg);
  border-top: 1px solid var(--border-color);
  font-size: 12px;
  color: var(--text-secondary);
  height: 32px;
  
  .status-item {
    display: flex;
    align-items: center;
    gap: 4px;
    
    .el-icon {
      font-size: 14px;
    }
  }
  
  .el-divider--vertical {
    height: 16px;
    margin: 0;
  }
  
  .spacer {
    flex: 1;
  }
  
  .el-button {
    font-size: 12px;
    
    .el-icon {
      margin-right: 4px;
    }
  }
}
</style>
