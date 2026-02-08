<template>
  <div class="editor-view">
    <!-- Toolbar -->
    <EditorToolbar @command="handleToolbarCommand" />
    
    <!-- Editor container with outline -->
    <div class="editor-main">
      <div class="editor-container">
        <div ref="editorRef" class="editor"></div>
      </div>
      
      <!-- Outline View -->
      <OutlineView 
        v-if="showOutline"
        :content="activeDocument?.content || ''"
        @close="showOutline = false"
        @jump-to-line="jumpToLine"
      />
    </div>
    
    <!-- Status Bar -->
    <StatusBar 
      :content="activeDocument?.content || ''"
      @show-outline="showOutline = !showOutline"
    />
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
import StatusBar from './StatusBar.vue'
import OutlineView from './OutlineView.vue'
import logger from '@/utils/logger'

const documentsStore = useDocumentsStore()
const settingsStore = useSettingsStore()

const editorRef = ref(null)
const showOutline = ref(false)
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
    events: {
      change: () => {
        handleEditorChange()
        // 延迟渲染数学公式，等待预览更新
        setTimeout(renderMathInPreview, 100)
      },
      keyup: handleKeyUp
    }
  })
  
  logger.info('Editor initialized', 'Editor created with math support and autocompletion')
  
  // Apply theme
  if (theme.value === 'dark') {
    editorRef.value.classList.add('toastui-editor-dark')
  }
  
  // Load initial content after editor is ready
  if (activeDocument.value && activeDocument.value.content) {
    setTimeout(() => {
      if (editorInstance) {
        editorInstance.setMarkdown(activeDocument.value.content)
        // 初始渲染数学公式
        setTimeout(renderMathInPreview, 200)
      }
    }, 0)
  }
}

// 自动补全处理
function handleKeyUp(event) {
  if (!editorInstance || !settingsStore.autoComplete) return
  
  const key = event.key
  const editor = editorInstance
  
  try {
    // 获取当前光标位置和内容
    const [start, end] = editor.getSelection()
    const content = editor.getMarkdown()
    
    // 获取当前行内容
    const beforeCursor = content.substring(0, start)
    const currentLineStart = beforeCursor.lastIndexOf('\n') + 1
    const currentLine = content.substring(currentLineStart, start)
    
    // 检测是否需要自动补全
    if (key === ']') {
      // 检测 [] 转为 [ ] (任务列表)
      if (currentLine.endsWith('[]')) {
        editor.setSelection([start - 2, start])
        editor.replaceSelection('[ ] ')
        editor.setSelection([start + 2, start + 2])
        logger.info('Autocomplete', 'Task list item created')
        return
      }
      
      // 检测 [text] 后按 ( 自动补全链接
      const linkMatch = currentLine.match(/\[([^\]]+)\]$/)
      if (linkMatch) {
        // 等待用户输入 (
        setTimeout(() => {
          const newContent = editor.getMarkdown()
          const [newStart] = editor.getSelection()
          if (newContent.charAt(newStart) !== '(') {
            // 如果用户没有输入(，提示可以输入
            return
          }
        }, 100)
      }
    }
    
    if (key === '(') {
      // 检测 [text]( 自动补全为 [text](url)
      const linkPattern = /\[([^\]]+)\]\($/
      if (linkPattern.test(currentLine)) {
        editor.insertText(')')
        editor.setSelection([start, start])
        logger.info('Autocomplete', 'Link parentheses completed')
        return
      }
    }
    
    if (key === ']' && currentLine.endsWith('![]')) {
      // 检测 ![] 自动补全为 ![alt](url)
      editor.insertText('()')
      editor.setSelection([start + 1, start + 1])
      logger.info('Autocomplete', 'Image syntax completed')
      return
    }
    
    if (key === '`') {
      // 检测 ``` 自动补全代码块
      if (currentLine.endsWith('```')) {
        editor.insertText('\n\n```')
        editor.setSelection([start + 1, start + 1])
        logger.info('Autocomplete', 'Code block completed')
        return
      }
      
      // 检测单个 ` 自动配对
      if (currentLine.endsWith('`') && !currentLine.endsWith('``')) {
        const afterCursor = content.substring(start)
        if (!afterCursor.startsWith('`')) {
          editor.insertText('`')
          editor.setSelection([start, start])
          logger.info('Autocomplete', 'Inline code completed')
          return
        }
      }
    }
    
    if (key === '$') {
      // 检测 $ 自动配对（数学公式）
      if (currentLine.endsWith('$')) {
        const beforeDollar = currentLine.substring(0, currentLine.length - 1)
        // 避免在已有配对或在行首时自动配对
        if (!beforeDollar.endsWith('$') && beforeDollar.trim() !== '') {
          const afterCursor = content.substring(start)
          if (!afterCursor.startsWith('$')) {
            editor.insertText('$')
            editor.setSelection([start, start])
            logger.info('Autocomplete', 'Math inline completed')
            return
          }
        }
      }
      
      // 检测 $$ 自动配对（块级数学公式）
      if (currentLine.endsWith('$$')) {
        editor.insertText('\n\n$$')
        editor.setSelection([start + 1, start + 1])
        logger.info('Autocomplete', 'Math block completed')
        return
      }
    }
    
    if (key === '*') {
      // 检测 ** 自动配对（粗体）
      if (currentLine.endsWith('**')) {
        const afterCursor = content.substring(start)
        if (!afterCursor.startsWith('**')) {
          editor.insertText('**')
          editor.setSelection([start, start])
          logger.info('Autocomplete', 'Bold marker completed')
          return
        }
      }
    }
    
    if (key === '_') {
      // 检测 __ 自动配对（斜体）
      if (currentLine.endsWith('__')) {
        const afterCursor = content.substring(start)
        if (!afterCursor.startsWith('__')) {
          editor.insertText('__')
          editor.setSelection([start, start])
          logger.info('Autocomplete', 'Italic marker completed')
          return
        }
      }
    }
    
  } catch (error) {
    console.warn('Autocomplete error:', error)
  }
}

// 在预览面板中渲染数学公式
function renderMathInPreview() {
  if (!editorRef.value) return
  
  try {
    const previewEl = editorRef.value.querySelector('.toastui-editor-md-preview')
    if (!previewEl) return
    
    // 查找所有包含 $ 符号的段落和文本
    const elements = previewEl.querySelectorAll('p, li, td, th, h1, h2, h3, h4, h5, h6')
    
    elements.forEach(element => {
      // 跳过已经处理过的元素
      if (element.hasAttribute('data-math-rendered')) return
      
      let html = element.innerHTML
      const originalHtml = html
      
      // 先处理块级公式 $$...$$ (必须独占一行)
      html = html.replace(/\$\$([\s\S]+?)\$\$/g, (match, formula) => {
        try {
          return katex.renderToString(formula.trim(), {
            displayMode: true,
            throwOnError: false
          })
        } catch (e) {
          console.warn('KaTeX block render error:', e)
          return match
        }
      })
      
      // 再处理行内公式 $...$
      html = html.replace(/\$([^\$\n]+?)\$/g, (match, formula) => {
        try {
          return katex.renderToString(formula.trim(), {
            displayMode: false,
            throwOnError: false
          })
        } catch (e) {
          console.warn('KaTeX inline render error:', e)
          return match
        }
      })
      
      // 如果内容有变化，更新并标记
      if (html !== originalHtml) {
        element.innerHTML = html
        element.setAttribute('data-math-rendered', 'true')
      }
    })
  } catch (e) {
    console.warn('Math rendering error:', e)
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

// 跳转到指定行
function jumpToLine(lineNumber) {
  if (!editorInstance) return
  
  try {
    const editor = editorInstance.getCurrentModeEditor()
    if (editor && editor.cm) {
      // CodeMirror API
      const line = lineNumber - 1 // CodeMirror uses 0-based indexing
      editor.cm.setCursor({ line, ch: 0 })
      editor.cm.scrollIntoView({ line, ch: 0 }, 100)
      editor.cm.focus()
      logger.info('Jump to line', `Jumped to line ${lineNumber}`)
    }
  } catch (error) {
    console.warn('Failed to jump to line:', error)
  }
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

.editor-main {
  flex: 1;
  display: flex;
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
