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
let highlightMarkers = []

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

function getCodeMirror() {
  const editorInstance = props.editorViewRef?.getEditorInstance?.()
  const editor = editorInstance?.getCurrentModeEditor?.()
  return editor?.cm || null
}

function getSelectionIndices() {
  const editorInstance = props.editorViewRef?.getEditorInstance?.()
  if (!editorInstance) return null

  const cm = getCodeMirror()
  if (cm) {
    const from = cm.getCursor('from')
    const to = cm.getCursor('to')
    return {
      start: cm.indexFromPos(from),
      end: cm.indexFromPos(to)
    }
  }

  const selection = editorInstance.getSelection?.()
  if (!selection || selection.length !== 2) return null

  const [startPos, endPos] = selection
  if (typeof startPos === 'number' && typeof endPos === 'number') {
    return { start: startPos, end: endPos }
  }

  const content = props.editorViewRef?.getContent?.() || ''
  const lines = content.split('\n')

  function indexFromLineCh(pos) {
    if (!pos || typeof pos.line !== 'number' || typeof pos.ch !== 'number') return 0
    let index = 0
    for (let i = 0; i < pos.line && i < lines.length; i++) {
      index += lines[i].length + 1
    }
    return index + pos.ch
  }

  return {
    start: indexFromLineCh(startPos),
    end: indexFromLineCh(endPos)
  }
}

function selectionInMatch(selection, match) {
  if (!selection || !match) return false
  const start = selection.start
  const end = selection.end
  return start >= match.index && start < match.index + match.length && end <= match.index + match.length
}

function clearHighlights() {
  if (highlightMarkers.length === 0) return
  highlightMarkers.forEach(marker => marker.clear?.())
  highlightMarkers = []
}

function applyHighlights() {
  clearHighlights()
  if (!matches.value.length) return

  const cm = getCodeMirror()
  if (!cm) return

  matches.value.forEach((match, index) => {
    const from = cm.posFromIndex(match.index)
    const to = cm.posFromIndex(match.index + match.length)
    const className = index === currentMatchIndex.value
      ? 'search-highlight-current'
      : 'search-highlight'
    const marker = cm.markText(from, to, { className })
    highlightMarkers.push(marker)
  })
}

function updateMatches() {
  if (!props.editorViewRef || !searchText.value) {
    matches.value = []
    totalMatches.value = 0
    currentMatchIndex.value = -1
    clearHighlights()
    return
  }
  
  try {
    const content = props.editorViewRef.getContent?.()
    if (!content) {
      matches.value = []
      totalMatches.value = 0
      currentMatchIndex.value = -1
      clearHighlights()
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
      const selection = getSelectionIndices()
      if (selection) {
        const inMatchIndex = matches.value.findIndex(m => selectionInMatch(selection, m))
        if (inMatchIndex !== -1) {
          currentMatchIndex.value = inMatchIndex
        } else {
          currentMatchIndex.value = matches.value.findIndex(m => m.index >= selection.end)
          if (currentMatchIndex.value === -1) {
            currentMatchIndex.value = 0
          }
        }
      } else {
        currentMatchIndex.value = 0
      }
    } else {
      currentMatchIndex.value = -1
    }

    applyHighlights()
  } catch (error) {
    ElMessage.error(`${t('search.error')}: ${error.message}`)
    matches.value = []
    totalMatches.value = 0
    currentMatchIndex.value = -1
    clearHighlights()
  }
}

function handleFindNext() {
  if (!searchText.value || !props.editorViewRef) return
  
  updateMatches()
  
  if (matches.value.length === 0) {
    ElMessage.warning(t('search.noMatch'))
    return
  }
  
  const editorInstance = props.editorViewRef.getEditorInstance?.()
  if (!editorInstance) return

  const selection = getSelectionIndices()
  let nextIndex
  if (selection && currentMatchIndex.value >= 0 && selectionInMatch(selection, matches.value[currentMatchIndex.value])) {
    nextIndex = (currentMatchIndex.value + 1) % matches.value.length
  } else if (selection) {
    nextIndex = matches.value.findIndex(m => m.index >= selection.end)
    if (nextIndex === -1) {
      nextIndex = 0
    }
  } else {
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
        const cm = getCodeMirror()
        if (cm) {
          const from = cm.posFromIndex(targetMatch.index)
          const to = cm.posFromIndex(targetMatch.index + targetMatch.length)
          cm.setSelection(from, to)
          cm.scrollIntoView(from, 100)
        } else {
          editorInstance.setSelection([targetMatch.index, targetMatch.index + targetMatch.length])
        }
        applyHighlights()
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
  
  const editorInstance = props.editorViewRef.getEditorInstance?.()
  if (!editorInstance) return

  const selection = getSelectionIndices()
  let prevIndex
  if (selection && currentMatchIndex.value >= 0 && selectionInMatch(selection, matches.value[currentMatchIndex.value])) {
    prevIndex = (currentMatchIndex.value - 1 + matches.value.length) % matches.value.length
  } else if (selection) {
    prevIndex = -1
    for (let i = matches.value.length - 1; i >= 0; i--) {
      if (matches.value[i].index < selection.start) {
        prevIndex = i
        break
      }
    }
    if (prevIndex === -1) {
      prevIndex = matches.value.length - 1
    }
  } else {
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
        const cm = getCodeMirror()
        if (cm) {
          const from = cm.posFromIndex(targetMatch.index)
          const to = cm.posFromIndex(targetMatch.index + targetMatch.length)
          cm.setSelection(from, to)
          cm.scrollIntoView(from, 100)
        } else {
          editorInstance.setSelection([targetMatch.index, targetMatch.index + targetMatch.length])
        }
        applyHighlights()
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
  
  ElMessage.success(t('search.replaced', { count }))
  
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
  clearHighlights()
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

:deep(.search-highlight) {
  background: rgba(255, 215, 0, 0.35);
}

:deep(.search-highlight-current) {
  background: rgba(255, 140, 0, 0.45);
  outline: 1px solid rgba(255, 140, 0, 0.9);
}
</style>
