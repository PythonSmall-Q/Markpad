<template>
  <transition name="search-slide">
    <div v-if="visible" class="search-box" :class="{ 'with-replace': showReplace }">
      <div class="search-header">
        <span class="search-title">{{ showReplace ? t('search.replaceTitle') : t('search.title') }}</span>
        <el-icon class="close-icon" @click="handleClose">
          <Close />
        </el-icon>
      </div>
      
      <div class="search-body">
        <!-- Search input -->
        <div class="search-row">
          <el-input
            ref="searchInputRef"
            v-model="searchText"
            :placeholder="t('search.findPlaceholder')"
            size="small"
            clearable
            @keyup.enter="handleFindNext"
            @keydown.enter.shift.prevent="handleFindPrevious"
            @keyup.esc="handleClose"
            @input="onSearchInput"
          >
            <template #suffix>
              <span class="match-count" v-if="searchText && totalMatches >= 0">
                {{ t('search.matchCount', { current: currentMatchIndex >= 0 ? currentMatchIndex + 1 : 0, total: totalMatches }) }}
              </span>
            </template>
          </el-input>
          <div class="search-actions">
            <el-button 
              size="small" 
              :icon="ArrowUp" 
              @click="handleFindPrevious"
              :disabled="!searchText || totalMatches === 0"
              :title="`${t('search.previous')} (Shift+Enter)`"
            />
            <el-button 
              size="small" 
              :icon="ArrowDown" 
              @click="handleFindNext"
              :disabled="!searchText || totalMatches === 0"
              :title="`${t('search.next')} (Enter)`"
            />
          </div>
        </div>
        
        <!-- Replace input -->
        <div v-if="showReplace" class="search-row">
          <el-input
            v-model="replaceText"
            :placeholder="t('search.replacePlaceholder')"
            size="small"
            clearable
            @keyup.enter="handleReplace"
            @keyup.esc="handleClose"
          />
          <div class="search-actions">
            <el-button 
              size="small" 
              @click="handleReplace"
              :disabled="!searchText || !replaceText || totalMatches === 0"
              :title="t('search.replace')"
            >
              {{ t('search.replace') }}
            </el-button>
            <el-button 
              size="small" 
              @click="handleReplaceAll"
              :disabled="!searchText || !replaceText || totalMatches === 0"
              :title="t('search.replaceAll')"
            >
              {{ t('search.replaceAll') }}
            </el-button>
          </div>
        </div>
        
        <!-- Options -->
        <div class="search-options">
          <el-checkbox 
            v-model="caseSensitive" 
            size="small"
            @change="onOptionsChange"
          >
            <el-tooltip :content="t('search.caseSensitive')" placement="bottom">
              <span class="option-label">Aa</span>
            </el-tooltip>
          </el-checkbox>
          <el-checkbox 
            v-model="wholeWord" 
            size="small"
            @change="onOptionsChange"
          >
            <el-tooltip :content="t('search.wholeWord')" placement="bottom">
              <span class="option-label">Ab|</span>
            </el-tooltip>
          </el-checkbox>
          <el-checkbox 
            v-model="useRegex" 
            size="small"
            @change="onOptionsChange"
          >
            <el-tooltip :content="t('search.useRegex')" placement="bottom">
              <span class="option-label">.*</span>
            </el-tooltip>
          </el-checkbox>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import { Close, ArrowUp, ArrowDown } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  showReplace: {
    type: Boolean,
    default: false
  },
  editorViewRef: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['update:modelValue'])
const { t } = useI18n()

const visible = ref(props.modelValue)
const searchInputRef = ref(null)
const searchText = ref('')
const replaceText = ref('')
const caseSensitive = ref(false)
const wholeWord = ref(false)
const useRegex = ref(false)
const currentMatchIndex = ref(-1)
const totalMatches = ref(0)
const matches = ref([])

watch(() => props.modelValue, (val) => {
  visible.value = val
  if (val) {
    nextTick(() => {
      searchInputRef.value?.focus()
      if (searchText.value) {
        updateMatches()
      }
    })
  }
})

watch(visible, (val) => {
  emit('update:modelValue', val)
})

function onSearchInput() {
  updateMatches()
}

function onOptionsChange() {
  updateMatches()
}

function updateMatches() {
  if (!props.editorViewRef || !searchText.value) {
    matches.value = []
    totalMatches.value = 0
    currentMatchIndex.value = -1
    return
  }
  
  try {
    const content = props.editorViewRef.getContent?.()
    if (!content) {
      matches.value = []
      totalMatches.value = 0
      currentMatchIndex.value = -1
      return
    }
    
    let pattern = searchText.value
    
    if (!useRegex.value) {
      pattern = pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    }
    
    if (wholeWord.value) {
      pattern = `\\b${pattern}\\b`
    }
    
    const flags = caseSensitive.value ? 'g' : 'gi'
    const regex = new RegExp(pattern, flags)
    
    matches.value = []
    let match
    while ((match = regex.exec(content)) !== null) {
      matches.value.push({
        index: match.index,
        length: match[0].length,
        text: match[0]
      })
    }
    
    totalMatches.value = matches.value.length
    
    if (totalMatches.value > 0) {
      // Find current match based on cursor position
      const editorInstance = props.editorViewRef.getEditorInstance?.()
      if (editorInstance) {
        const [cursorPos] = editorInstance.getSelection()
        currentMatchIndex.value = matches.value.findIndex(m => m.index >= cursorPos)
        if (currentMatchIndex.value === -1) {
          currentMatchIndex.value = 0
        }
      } else {
        currentMatchIndex.value = 0
      }
    } else {
      currentMatchIndex.value = -1
    }
  } catch (error) {
    ElMessage.error('搜索错误: ' + error.message)
    matches.value = []
    totalMatches.value = 0
    currentMatchIndex.value = -1
  }
}

function handleFindNext() {
  if (!searchText.value || !props.editorViewRef) return
  
  updateMatches()
  
  if (matches.value.length === 0) {
    ElMessage.warning(t('search.noMatch'))
    return
  }
  
  // Get current selection end position
  const editorInstance = props.editorViewRef.getEditorInstance?.()
  if (!editorInstance) return
  
  const [, endPos] = editorInstance.getSelection()
  
  // Find next match after current selection
  let nextIndex = matches.value.findIndex(m => m.index >= endPos)
  if (nextIndex === -1) {
    // Wrap to beginning
    nextIndex = 0
  }
  
  currentMatchIndex.value = nextIndex
  const targetMatch = matches.value[currentMatchIndex.value]
  
  if (targetMatch) {
    // Focus first
    editorInstance.focus()
    
    // Set selection and scroll
    setTimeout(() => {
      try {
        editorInstance.setSelection([targetMatch.index, targetMatch.index + targetMatch.length])
        
        const editor = editorInstance.getCurrentModeEditor()
        if (editor && editor.cm) {
          const pos = editor.cm.posFromIndex(targetMatch.index)
          editor.cm.scrollIntoView(pos, 100)
        }
      } catch (e) {
        console.debug('Search navigation error:', e)
      }
    }, 10)
  }
}

function handleFindPrevious() {
  if (!searchText.value || !props.editorViewRef) return
  
  updateMatches()
  
  if (matches.value.length === 0) {
    ElMessage.warning(t('search.noMatch'))
    return
  }
  
  // Get current selection start position
  const editorInstance = props.editorViewRef.getEditorInstance?.()
  if (!editorInstance) return
  
  const [startPos] = editorInstance.getSelection()
  
  // Find previous match before current selection
  let prevIndex = -1
  for (let i = matches.value.length - 1; i >= 0; i--) {
    if (matches.value[i].index < startPos) {
      prevIndex = i
      break
    }
  }
  
  if (prevIndex === -1) {
    // Wrap to end
    prevIndex = matches.value.length - 1
  }
  
  currentMatchIndex.value = prevIndex
  const targetMatch = matches.value[currentMatchIndex.value]
  
  if (targetMatch) {
    // Focus first
    editorInstance.focus()
    
    // Set selection and scroll
    setTimeout(() => {
      try {
        editorInstance.setSelection([targetMatch.index, targetMatch.index + targetMatch.length])
        
        const editor = editorInstance.getCurrentModeEditor()
        if (editor && editor.cm) {
          const pos = editor.cm.posFromIndex(targetMatch.index)
          editor.cm.scrollIntoView(pos, 100)
        }
      } catch (e) {
        console.debug('Search navigation error:', e)
      }
    }, 10)
  }
}

function handleReplace() {
  if (!searchText.value || !replaceText.value || !props.editorViewRef) return
  
  props.editorViewRef.performReplace?.({
    searchText: searchText.value,
    replaceText: replaceText.value,
    replaceAll: false,
    caseSensitive: caseSensitive.value,
    wholeWord: wholeWord.value,
    useRegex: useRegex.value
  })
  
  // Update matches after replace
  setTimeout(() => {
    updateMatches()
    if (matches.value.length > 0) {
      handleFindNext()
    }
  }, 50)
}

function handleReplaceAll() {
  if (!searchText.value || !replaceText.value || !props.editorViewRef) return
  
  const count = totalMatches.value
  
  props.editorViewRef.performReplace?.({
    searchText: searchText.value,
    replaceText: replaceText.value,
    replaceAll: true,
    caseSensitive: caseSensitive.value,
    wholeWord: wholeWord.value,
    useRegex: useRegex.value
  })
  
  ElMessage.success(`已替换 ${count} 处`)
  
  // Update matches after replace
  setTimeout(() => {
    updateMatches()
  }, 50)
}

function handleClose() {
  visible.value = false
  searchText.value = ''
  replaceText.value = ''
  matches.value = []
  totalMatches.value = 0
  currentMatchIndex.value = -1
}
</script>

<style lang="scss" scoped>
.search-box {
  position: fixed;
  top: 60px;
  right: 20px;
  width: 420px;
  background: var(--bg-color);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 2000;
  padding: 12px;
  
  &.with-replace {
    width: 480px;
  }
}

.search-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--border-color);
  
  .search-title {
    font-size: 14px;
    font-weight: 600;
    color: var(--text-color);
  }
  
  .close-icon {
    cursor: pointer;
    font-size: 16px;
    color: var(--text-color);
    
    &:hover {
      color: var(--el-color-primary);
    }
  }
}

.search-body {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.search-row {
  display: flex;
  gap: 8px;
  align-items: center;
  
  .el-input {
    flex: 1;
  }
  
  .match-count {
    font-size: 12px;
    color: var(--el-text-color-secondary);
    margin-right: 8px;
    white-space: nowrap;
  }
}

.search-actions {
  display: flex;
  gap: 4px;
  
  .el-button {
    padding: 4px 8px;
    border-color: #909399;
    color: #606266;
    
    &:hover:not(:disabled) {
      border-color: var(--el-color-primary);
      color: var(--el-color-primary);
      background-color: var(--el-color-primary-light-9);
    }
    
    &:disabled {
      opacity: 0.5;
    }
  }
}

.search-options {
  display: flex;
  gap: 12px;
  padding-top: 4px;
  
  .el-checkbox {
    margin-right: 0;
  }
  
  .option-label {
    font-family: monospace;
    font-size: 12px;
    font-weight: 600;
  }
}

// Transition animation
.search-slide-enter-active,
.search-slide-leave-active {
  transition: all 0.2s ease;
}

.search-slide-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.search-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

:deep(.el-input__wrapper) {
  font-size: 13px;
}

:deep(.el-button) {
  font-size: 12px;
}
</style>
