<template>
  <div class="editor-toolbar">
    <el-button-group>
      <el-tooltip :content="`${t('editor.toolbar.bold')} (Ctrl+B)`" placement="bottom">
        <el-button size="small" @click="emit('command', { type: 'bold' })">
          <strong>B</strong>
        </el-button>
      </el-tooltip>
      
      <el-tooltip :content="`${t('editor.toolbar.italic')} (Ctrl+I)`" placement="bottom">
        <el-button size="small" @click="emit('command', { type: 'italic' })">
          <em>I</em>
        </el-button>
      </el-tooltip>
      
      <el-tooltip :content="t('editor.toolbar.strikethrough')" placement="bottom">
        <el-button size="small" @click="emit('command', { type: 'strike' })">
          <s>S</s>
        </el-button>
      </el-tooltip>
    </el-button-group>
    
    <el-divider direction="vertical" />
    
    <el-button-group>
      <el-dropdown @command="handleHeading">
        <el-button size="small">
          {{ t('editor.toolbar.heading') }} <el-icon class="el-icon--right"><ArrowDown /></el-icon>
        </el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item :command="1">{{ t('editor.toolbar.heading') }} 1</el-dropdown-item>
            <el-dropdown-item :command="2">{{ t('editor.toolbar.heading') }} 2</el-dropdown-item>
            <el-dropdown-item :command="3">{{ t('editor.toolbar.heading') }} 3</el-dropdown-item>
            <el-dropdown-item :command="4">{{ t('editor.toolbar.heading') }} 4</el-dropdown-item>
            <el-dropdown-item :command="5">{{ t('editor.toolbar.heading') }} 5</el-dropdown-item>
            <el-dropdown-item :command="6">{{ t('editor.toolbar.heading') }} 6</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </el-button-group>
    
    <el-divider direction="vertical" />
    
    <el-button-group>
      <el-tooltip :content="t('editor.toolbar.unorderedList')" placement="bottom">
        <el-button size="small" :icon="List" @click="emit('command', { type: 'ul' })" />
      </el-tooltip>
      
      <el-tooltip :content="t('editor.toolbar.orderedList')" placement="bottom">
        <el-button size="small" :icon="Menu" @click="emit('command', { type: 'ol' })" />
      </el-tooltip>
      
      <el-tooltip :content="t('editor.toolbar.quote')" placement="bottom">
        <el-button size="small" :icon="ChatLineSquare" @click="emit('command', { type: 'quote' })" />
      </el-tooltip>
    </el-button-group>
    
    <el-divider direction="vertical" />
    
    <el-button-group>
      <el-tooltip :content="t('editor.toolbar.inlineCode')" placement="bottom">
        <el-button size="small" @click="emit('command', { type: 'code' })">
          <el-icon><Grid /></el-icon>
        </el-button>
      </el-tooltip>
      
      <el-tooltip :content="t('editor.toolbar.codeBlock')" placement="bottom">
        <el-button size="small" @click="emit('command', { type: 'codeblock' })">
          <el-icon><Document /></el-icon>
        </el-button>
      </el-tooltip>
    </el-button-group>
    
    <el-divider direction="vertical" />
    
    <el-button-group>
      <el-tooltip :content="t('editor.toolbar.link')" placement="bottom">
        <el-button size="small" :icon="Link" @click="handleInsertLink" />
      </el-tooltip>
      
      <el-tooltip :content="t('editor.toolbar.image')" placement="bottom">
        <el-button size="small" :icon="Picture" @click="handleInsertImage" />
      </el-tooltip>
      
      <el-tooltip :content="t('editor.toolbar.table')" placement="bottom">
        <el-button size="small" :icon="Grid" @click="emit('command', { type: 'table' })" />
      </el-tooltip>
      
      <el-dropdown @command="handleInsertMath">
        <el-button size="small">
          <el-icon><Operation /></el-icon>
        </el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="inline">{{ t('editor.toolbar.inlineMath') }}</el-dropdown-item>
            <el-dropdown-item command="block">{{ t('editor.toolbar.blockMath') }}</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      
      <el-tooltip :content="t('editor.toolbar.hr')" placement="bottom">
        <el-button size="small" @click="emit('command', { type: 'hr' })">
          —
        </el-button>
      </el-tooltip>
    </el-button-group>
    
    <el-divider direction="vertical" />
    
    <el-button-group>
      <el-tooltip :content="showPreview ? t('editor.toolbar.hidePreview') : t('editor.toolbar.showPreview')" placement="bottom">
        <el-button size="small" :icon="View" @click="emit('command', { type: 'togglePreview' })" />
      </el-tooltip>
    </el-button-group>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { 
  List, Menu, ChatLineSquare, Link, Picture, Grid, 
  Document, View, ArrowDown, Operation 
} from '@element-plus/icons-vue'
import { ElMessageBox } from 'element-plus'
import { useSettingsStore } from '@/store/settings'
import { assetAPI } from '@/utils/electron'
import logger from '@/utils/logger'

const settingsStore = useSettingsStore()
const { t } = useI18n()

const emit = defineEmits(['command'])

const showPreview = computed(() => settingsStore.showPreview)

function handleHeading(level) {
  emit('command', { type: 'heading', level })
}

async function handleInsertLink() {
  try {
    const { value } = await ElMessageBox.prompt(t('editor.dialog.linkUrl'), t('editor.dialog.insertLink'), {
      confirmButtonText: t('editor.dialog.confirm'),
      cancelButtonText: t('editor.dialog.cancel'),
      inputPattern: /^https?:\/\/.+/,
      inputErrorMessage: t('editor.dialog.invalidUrl')
    })
    
    const text = await ElMessageBox.prompt(t('editor.dialog.linkText'), t('editor.dialog.insertLink'), {
      confirmButtonText: t('editor.dialog.confirm'),
      cancelButtonText: t('editor.dialog.cancel'),
      inputPlaceholder: t('editor.dialog.linkText')
    })
    
    emit('command', { type: 'link', url: value, text: text.value || value })
  } catch {
    // User cancelled
  }
}

async function handleInsertImage() {
  const result = await assetAPI.importImage()
  if (result.success && result.filePath) {
    const fileName = result.filePath.split(/[/\\]/).pop()
    emit('command', { 
      type: 'image', 
      url: result.filePath, 
      alt: fileName 
    })
    logger.info('Insert image', `Image inserted: ${fileName}`)
  }
}

async function handleInsertMath(type) {
  try {
    const { value } = await ElMessageBox.prompt(
      t('editor.dialog.enterFormula'), 
      type === 'inline' ? t('editor.dialog.inlineMath') : t('editor.dialog.blockMath'),
      {
        confirmButtonText: t('editor.dialog.confirm'),
        cancelButtonText: t('editor.dialog.cancel'),
        inputPlaceholder: type === 'inline' ? 'E = mc^2' : 'x = \\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}'
      }
    )
    
    if (value) {
      emit('command', { 
        type: type === 'inline' ? 'inlineMath' : 'blockMath',
        formula: value
      })
    }
  } catch {
    // User cancelled
  }
}
</script>

<style lang="scss" scoped>
.editor-toolbar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background-color: var(--sidebar-bg);
  border-bottom: 1px solid var(--border-color);
  overflow-x: auto;
  
  &::-webkit-scrollbar {
    height: 6px;
  }
  
  &::-webkit-scrollbar-thumb {
    background-color: #909399;
    border-radius: 3px;
  }
  
  :deep(.el-button) {
    font-weight: 600;
  }
  
  :deep(.el-divider--vertical) {
    height: 20px;
    margin: 0;
  }
}
</style>
