<template>
  <div class="editor-view">
    <!-- 工具栏 -->
    <EditorToolbar @command="handleToolbarCommand" />
    
    <!-- 编辑器容器 -->
    <div class="editor-container">
      <div ref="editorRef" class="editor"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, computed } from 'vue'
import Editor from '@toast-ui/editor'
import '@toast-ui/editor/dist/toastui-editor.css'
import { useDocumentsStore } from '@/store/documents'
import { useSettingsStore } from '@/store/settings'
import EditorToolbar from './EditorToolbar.vue'

const documentsStore = useDocumentsStore()
const settingsStore = useSettingsStore()

const editorRef = ref(null)
let editorInstance = null
let updateTimer = null

const activeDocument = computed(() => documentsStore.activeDocument)
const theme = computed(() => settingsStore.theme)

onMounted(() => {
  initEditor()
})

onUnmounted(() => {
  if (editorInstance) {
    editorInstance.destroy()
  }
  if (updateTimer) {
    clearTimeout(updateTimer)
  }
})

watch(activeDocument, (newDoc, oldDoc) => {
  if (newDoc && newDoc.id !== oldDoc?.id) {
    editorInstance.setMarkdown(newDoc.content || '')
  }
}, { immediate: true })

watch(theme, (newTheme) => {
  // 根据主题更新编辑器样式
  if (editorInstance) {
    const editorEl = editorRef.value
    if (newTheme === 'dark') {
      editorEl.classList.add('toastui-editor-dark')
    } else {
      editorEl.classList.remove('toastui-editor-dark')
    }
  }
})

function initEditor() {
  if (!editorRef.value) return
  
  editorInstance = new Editor({
    el: editorRef.value,
    height: '100%',
    initialEditType: 'markdown',
    previewStyle: settingsStore.showPreview ? 'vertical' : 'tab',
    initialValue: activeDocument.value?.content || '',
    usageStatistics: false,
    toolbarItems: [],
    hideModeSwitch: false,
    events: {
      change: handleEditorChange
    }
  })
  
  // 应用主题
  if (theme.value === 'dark') {
    editorRef.value.classList.add('toastui-editor-dark')
  }
}

function handleEditorChange() {
  if (!activeDocument.value) return
  
  // 防抖更新
  if (updateTimer) {
    clearTimeout(updateTimer)
  }
  
  updateTimer = setTimeout(() => {
    const content = editorInstance.getMarkdown()
    documentsStore.updateContent(activeDocument.value.id, content)
  }, 300)
}

/**
 * 折叠长 base64 图片 URL，保留前后部分用于识别
 * @param {string} url - 图片 URL
 * @returns {string} - 折叠后的 URL 或原 URL
 */
function collapseBase64Url(url) {
  // 检测是否为 base64 图片
  if (url.startsWith('data:image/') && url.includes('base64,')) {
    const parts = url.split('base64,')
    if (parts.length === 2 && parts[1].length > 100) {
      const base64Data = parts[1]
      // 保留前50个字符和后20个字符，中间用省略号表示
      const collapsed = `${parts[0]}base64,${base64Data.substring(0, 50)}...${base64Data.substring(base64Data.length - 20)}`
      return collapsed
    }
  }
  return url
}

function handleToolbarCommand(command) {
  if (!editorInstance) return
  
  const editor = editorInstance
  
  switch (command.type) {
    case 'bold':
      editor.exec('bold')
      break
    case 'italic':
      editor.exec('italic')
      break
    case 'strike':
      editor.exec('strike')
      break
    case 'heading':
      editor.exec('heading', { level: command.level || 1 })
      break
    case 'ul':
      editor.exec('ul')
      break
    case 'ol':
      editor.exec('ol')
      break
    case 'code':
      editor.exec('code')
      break
    case 'codeblock':
      editor.exec('codeBlock')
      break
    case 'quote':
      editor.exec('blockQuote')
      break
    case 'link':
      if (command.url && command.text) {
        const markdown = `[${command.text}](${command.url})`
        editor.insertText(markdown)
      }
      break
    case 'image':
      if (command.url && command.alt) {
        // 自动折叠 base64 图片 URL
        const displayUrl = collapseBase64Url(command.url)
        const markdown = `![${command.alt}](${displayUrl})`
        editor.insertText(markdown)
      }
      break
    case 'table':
      editor.exec('table')
      break
    case 'hr':
      editor.insertText('\n---\n')
      break
    case 'togglePreview':
      const currentStyle = editor.getCurrentPreviewStyle()
      editor.changePreviewStyle(currentStyle === 'vertical' ? 'tab' : 'vertical')
      settingsStore.togglePreview()
      break
  }
  
  editor.focus()
}

defineExpose({
  getContent: () => editorInstance?.getMarkdown() || '',
  setContent: (content) => editorInstance?.setMarkdown(content || ''),
  insertText: (text) => editorInstance?.insertText(text)
})
</script>

<style lang="scss" scoped>
.editor-view {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.editor-container {
  flex: 1;
  overflow: hidden;
  
  .editor {
    height: 100%;
  }
}

:deep(.toastui-editor-defaultUI) {
  border: none;
  
  .toastui-editor-md-container,
  .toastui-editor-md-preview {
    background-color: var(--bg-color);
    color: var(--text-color);
  }
  
  .toastui-editor-md-splitter {
    background-color: var(--border-color);
  }
}

:deep(.toastui-editor-dark) {
  .toastui-editor-defaultUI {
    background-color: #1e1e1e;
    
    .toastui-editor-md-container,
    .toastui-editor-md-preview {
      background-color: #1e1e1e;
      color: #e4e4e4;
    }
    
    .toastui-editor-md-tab-container {
      background-color: #252526;
    }
    
    .toastui-editor-md-tab {
      color: #e4e4e4;
      
      &.active {
        background-color: #1e1e1e;
        border-bottom-color: #1e1e1e;
      }
    }
  }
}
</style>
