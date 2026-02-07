<template>
  <div class="editor-toolbar">
    <el-button-group>
      <el-tooltip content="加粗 (Ctrl+B)" placement="bottom">
        <el-button size="small" @click="emit('command', { type: 'bold' })">
          <strong>B</strong>
        </el-button>
      </el-tooltip>
      
      <el-tooltip content="斜体 (Ctrl+I)" placement="bottom">
        <el-button size="small" @click="emit('command', { type: 'italic' })">
          <em>I</em>
        </el-button>
      </el-tooltip>
      
      <el-tooltip content="删除线" placement="bottom">
        <el-button size="small" @click="emit('command', { type: 'strike' })">
          <s>S</s>
        </el-button>
      </el-tooltip>
    </el-button-group>
    
    <el-divider direction="vertical" />
    
    <el-button-group>
      <el-dropdown @command="handleHeading">
        <el-button size="small">
          标题 <el-icon class="el-icon--right"><ArrowDown /></el-icon>
        </el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item :command="1">标题 1</el-dropdown-item>
            <el-dropdown-item :command="2">标题 2</el-dropdown-item>
            <el-dropdown-item :command="3">标题 3</el-dropdown-item>
            <el-dropdown-item :command="4">标题 4</el-dropdown-item>
            <el-dropdown-item :command="5">标题 5</el-dropdown-item>
            <el-dropdown-item :command="6">标题 6</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </el-button-group>
    
    <el-divider direction="vertical" />
    
    <el-button-group>
      <el-tooltip content="无序列表" placement="bottom">
        <el-button size="small" :icon="List" @click="emit('command', { type: 'ul' })" />
      </el-tooltip>
      
      <el-tooltip content="有序列表" placement="bottom">
        <el-button size="small" :icon="Menu" @click="emit('command', { type: 'ol' })" />
      </el-tooltip>
      
      <el-tooltip content="引用" placement="bottom">
        <el-button size="small" :icon="ChatLineSquare" @click="emit('command', { type: 'quote' })" />
      </el-tooltip>
    </el-button-group>
    
    <el-divider direction="vertical" />
    
    <el-button-group>
      <el-tooltip content="行内代码" placement="bottom">
        <el-button size="small" @click="emit('command', { type: 'code' })">
          <el-icon><Grid /></el-icon>
        </el-button>
      </el-tooltip>
      
      <el-tooltip content="代码块" placement="bottom">
        <el-button size="small" @click="emit('command', { type: 'codeblock' })">
          <el-icon><Document /></el-icon>
        </el-button>
      </el-tooltip>
    </el-button-group>
    
    <el-divider direction="vertical" />
    
    <el-button-group>
      <el-tooltip content="插入链接" placement="bottom">
        <el-button size="small" :icon="Link" @click="handleInsertLink" />
      </el-tooltip>
      
      <el-tooltip content="插入图片" placement="bottom">
        <el-button size="small" :icon="Picture" @click="handleInsertImage" />
      </el-tooltip>
      
      <el-tooltip content="插入表格" placement="bottom">
        <el-button size="small" :icon="Grid" @click="emit('command', { type: 'table' })" />
      </el-tooltip>
      
      <el-tooltip content="分隔线" placement="bottom">
        <el-button size="small" @click="emit('command', { type: 'hr' })">
          —
        </el-button>
      </el-tooltip>
    </el-button-group>
    
    <el-divider direction="vertical" />
    
    <el-button-group>
      <el-tooltip :content="showPreview ? '隐藏预览' : '显示预览'" placement="bottom">
        <el-button size="small" :icon="View" @click="emit('command', { type: 'togglePreview' })" />
      </el-tooltip>
    </el-button-group>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { 
  List, Menu, ChatLineSquare, Link, Picture, Grid, 
  Document, View, ArrowDown 
} from '@element-plus/icons-vue'
import { ElMessageBox } from 'element-plus'
import { useSettingsStore } from '@/store/settings'
import { assetAPI } from '@/utils/electron'

const settingsStore = useSettingsStore()

const emit = defineEmits(['command'])

const showPreview = computed(() => settingsStore.showPreview)

function handleHeading(level) {
  emit('command', { type: 'heading', level })
}

async function handleInsertLink() {
  try {
    const { value } = await ElMessageBox.prompt('请输入链接地址', '插入链接', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      inputPattern: /^https?:\/\/.+/,
      inputErrorMessage: '请输入有效的链接地址'
    })
    
    const text = await ElMessageBox.prompt('请输入链接文本', '插入链接', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      inputPlaceholder: '链接文本'
    })
    
    emit('command', { type: 'link', url: value, text: text.value || value })
  } catch {
    // 用户取消
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
