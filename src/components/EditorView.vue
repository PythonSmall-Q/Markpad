<template>
  <div class="editor-view">
    <!-- Toolbar -->
    <EditorToolbar @command="handleToolbarCommand" />
    
    <!-- Editor container -->
    <div class="editor-container">
      <div ref="editorRef" class="editor"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, computed } from 'vue'
import Editor from '@toast-ui/editor'
import '@toast-ui/editor/dist/toastui-editor.css'
import katex from 'katex'
import 'katex/dist/katex.min.css'
import { useDocumentsStore } from '@/store/documents'
import { useSettingsStore } from '@/store/settings'
import EditorToolbar from './EditorToolbar.vue'
import logger from '@/utils/logger'

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
  if (newDoc && newDoc.id !== oldDoc?.id && editorInstance) {
    editorInstance.setMarkdown(newDoc.content || '')
  }
})

watch(theme, (newTheme) => {
  // Update editor style based on theme
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
    // 禁用编辑器默认快捷键，使用自定义的快捷键处理
    useCommandShortcut: false,
    // 启用数学公式支持
    customHTMLRenderer: {
      latex(node) {
        const generator = node.literal ? katex.renderToString(node.literal, {
          displayMode: false,
          throwOnError: false
        }) : ''
        return [{ type: 'html', content: generator }]
      },
      latexBlock(node) {
        const generator = node.literal ? katex.renderToString(node.literal, {
          displayMode: true,
          throwOnError: false
        }) : ''
        return [{ type: 'html', content: generator }]
      }
    },
    events: {
      change: handleEditorChange
    }
  })
  
  logger.info('Editor initialized', 'Editor created with math support')
  
  // Apply theme
  if (theme.value === 'dark') {
    editorRef.value.classList.add('toastui-editor-dark')
  }
  
  // Load initial content after editor is ready
  if (activeDocument.value && activeDocument.value.content) {
    setTimeout(() => {
      if (editorInstance) {
        editorInstance.setMarkdown(activeDocument.value.content)
      }
    }, 0)
  }
}

function handleEditorChange() {
  if (!activeDocument.value) return
  
  // Debounced update
  if (updateTimer) {
    clearTimeout(updateTimer)
  }
  
  updateTimer = setTimeout(() => {
    const content = editorInstance.getMarkdown()
    documentsStore.updateContent(activeDocument.value.id, content)
  }, 300)
}

/**
 * Collapse long base64 image URL, keeping prefix and suffix for identification
 * @param {string} url - Image URL
 * @returns {string} - Collapsed URL or original URL
 */
function collapseBase64Url(url) {
  // Check if it's a base64 image
  if (url.startsWith('data:image/') && url.includes('base64,')) {
    const parts = url.split('base64,')
    if (parts.length === 2 && parts[1].length > 100) {
      const base64Data = parts[1]
      // Keep first 50 and last 20 characters, use ellipsis in between
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
      // Insert unordered list item
      const ulText = editor.getSelectedText()
      if (ulText) {
        const lines = ulText.split('\n')
        const listItems = lines.map(line => line ? `- ${line}` : '').join('\n')
        editor.replaceSelection(listItems)
      } else {
        editor.insertText('\n- ')
      }
      break
    case 'ol':
      // Insert ordered list item
      const olText = editor.getSelectedText()
      if (olText) {
        const lines = olText.split('\n')
        const listItems = lines.map((line, index) => line ? `${index + 1}. ${line}` : '').join('\n')
        editor.replaceSelection(listItems)
      } else {
        editor.insertText('\n1. ')
      }
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
        // Auto-collapse base64 image URL
        const displayUrl = collapseBase64Url(command.url)
        const markdown = `![${command.alt}](${displayUrl})`
        editor.insertText(markdown)
      }
      break
    case 'table':
      // Insert a basic table template
      const tableTemplate = '\n| Header 1 | Header 2 | Header 3 |\n| -------- | -------- | -------- |\n| Cell 1   | Cell 2   | Cell 3   |\n| Cell 4   | Cell 5   | Cell 6   |\n\n'
      editor.insertText(tableTemplate)
      logger.info('Insert table', 'Table template inserted')
      break
    case 'inlineMath':
      // Insert inline math formula
      const inlineMath = command.formula || 'E = mc^2'
      editor.insertText(`$${inlineMath}$`)
      logger.info('Insert inline math', `Formula: ${inlineMath}`)
      break
    case 'blockMath':
      // Insert block math formula
      const blockMath = command.formula || 'x = \\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}'
      editor.insertText(`\n$$\n${blockMath}\n$$\n`)
      logger.info('Insert block math', `Formula: ${blockMath}`)
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

// Search and Replace functions
function performSearch(options) {
  if (!editorInstance) return
  
  try {
    const { text, direction, caseSensitive, wholeWord, useRegex } = options
    const content = editorInstance.getMarkdown()
    
    let pattern = text
    if (!useRegex) {
      pattern = pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    }
    if (wholeWord) {
      pattern = `\\b${pattern}\\b`
    }
    
    const flags = caseSensitive ? 'g' : 'gi'
    const regex = new RegExp(pattern, flags)
    
    // Find matches
    const matches = []
    let match
    while ((match = regex.exec(content)) !== null) {
      matches.push({
        index: match.index,
        length: match[0].length,
        text: match[0]
      })
    }
    
    if (matches.length > 0) {
      // Get current cursor position
      const [startPos, endPos] = editorInstance.getSelection()
      
      // Find next/previous match based on cursor position
      let targetMatch
      if (direction === 'next') {
        // Find first match after current cursor position
        targetMatch = matches.find(m => m.index > startPos)
        // If no match found after cursor, wrap to beginning
        if (!targetMatch) {
          targetMatch = matches[0]
        }
      } else {
        // Find last match before current cursor position
        const reversedMatches = [...matches].reverse()
        targetMatch = reversedMatches.find(m => m.index < startPos)
        // If no match found before cursor, wrap to end
        if (!targetMatch) {
          targetMatch = matches[matches.length - 1]
        }
      }
      
      // Select the match
      if (targetMatch) {
        // Focus editor first
        editorInstance.focus()
        
        // Set selection with slight delay to ensure editor is ready
        setTimeout(() => {
          try {
            editorInstance.setSelection([targetMatch.index, targetMatch.index + targetMatch.length])
            
            // Try to scroll to the match
            const editorEl = editorInstance.getCurrentModeEditor()
            if (editorEl && editorEl.cm) {
              // For CodeMirror
              const pos = editorEl.cm.posFromIndex(targetMatch.index)
              editorEl.cm.scrollIntoView(pos, 100)
            }
          } catch (e) {
            console.debug('Could not set selection or scroll:', e)
          }
        }, 10)
        
        return { success: true, matchIndex: matches.indexOf(targetMatch), totalMatches: matches.length }
      }
    }
    
    return { success: false, matchIndex: -1, totalMatches: 0 }
  } catch (error) {
    console.error('Search error:', error)
    return { success: false, error: error.message }
  }
}

function performReplace(options) {
  if (!editorInstance) return
  
  try {
    const { searchText, replaceText, replaceAll, caseSensitive, wholeWord, useRegex } = options
    const content = editorInstance.getMarkdown()
    
    let pattern = searchText
    if (!useRegex) {
      pattern = pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    }
    if (wholeWord) {
      pattern = `\\b${pattern}\\b`
    }
    
    const flags = caseSensitive ? 'g' : 'gi'
    const regex = new RegExp(pattern, flags)
    
    if (replaceAll) {
      // Replace all occurrences
      const newContent = content.replace(regex, replaceText)
      editorInstance.setMarkdown(newContent)
    } else {
      // Replace current selection only
      const [startPos, endPos] = editorInstance.getSelection()
      const selectedText = content.substring(startPos, endPos)
      
      if (regex.test(selectedText)) {
        const before = content.substring(0, startPos)
        const after = content.substring(endPos)
        const newContent = before + replaceText + after
        editorInstance.setMarkdown(newContent)
        
        // Select the replaced text
        editorInstance.setSelection([startPos, startPos + replaceText.length])
      }
    }
    
    editorInstance.focus()
  } catch (error) {
    console.error('Replace error:', error)
  }
}

function togglePreview() {
  if (!editorInstance) return
  
  const currentMode = editorInstance.getCurrentPreviewStyle()
  if (currentMode === 'vertical') {
    editorInstance.changePreviewStyle('tab')
  } else {
    editorInstance.changePreviewStyle('vertical')
  }
}

function undo() {
  if (!editorInstance) return
  try {
    editorInstance.exec('undo')
    editorInstance.focus()
  } catch (error) {
    console.warn('Undo not available:', error)
  }
}

function redo() {
  if (!editorInstance) return
  try {
    editorInstance.exec('redo')
    editorInstance.focus()
  } catch (error) {
    console.warn('Redo not available:', error)
  }
}

function handleFormat(action, data) {
  if (!editorInstance) return
  
  try {
    switch (action) {
      case 'format-bold':
        editorInstance.exec('bold')
        break
      case 'format-italic':
        editorInstance.exec('italic')
        break
      case 'format-strikethrough':
        editorInstance.exec('strike')
        break
      case 'format-heading':
        editorInstance.exec('heading', { level: data || 1 })
        break
      case 'insert-link':
        editorInstance.exec('link')
        break
      case 'insert-image':
        editorInstance.exec('image')
        break
      case 'insert-code':
        editorInstance.exec('code')
        break
      case 'insert-table':
        // Insert a basic table template
        const tableTemplate = '\n| Header 1 | Header 2 | Header 3 |\n| -------- | -------- | -------- |\n| Cell 1   | Cell 2   | Cell 3   |\n| Cell 4   | Cell 5   | Cell 6   |\n\n'
        editorInstance.insertText(tableTemplate)
        break
    }
  } catch (error) {
    console.warn('Format action not supported:', action, error)
  }
}

defineExpose({
  getContent: () => editorInstance?.getMarkdown() || '',
  setContent: (content) => editorInstance?.setMarkdown(content || ''),
  insertText: (text) => editorInstance?.insertText(text),
  getEditorInstance: () => editorInstance,
  performSearch,
  performReplace,
  togglePreview,
  handleFormat,
  undo,
  redo
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
      background-color: #ffffff;
      color: #303133;
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
