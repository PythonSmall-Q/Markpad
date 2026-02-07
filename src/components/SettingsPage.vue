<template>
  <div class="settings-page">
    <div class="settings-header">
      <h2>设置</h2>
      <el-button type="text" @click="emit('close')" class="close-btn">
        <el-icon><Close /></el-icon>
      </el-button>
    </div>
    
    <div class="settings-content">
      <!-- 外观设置 -->
      <el-card class="settings-card" shadow="never">
        <template #header>
          <div class="card-header">
            <el-icon><Sunny /></el-icon>
            <span>外观</span>
          </div>
        </template>
        
        <el-form label-width="120px">
          <el-form-item label="主题">
            <el-radio-group v-model="localSettings.theme" @change="handleThemeChange">
              <el-radio-button label="light">浅色</el-radio-button>
              <el-radio-button label="dark">深色</el-radio-button>
              <el-radio-button label="auto">跟随系统</el-radio-button>
            </el-radio-group>
          </el-form-item>
          
          <el-form-item label="字体大小">
            <el-slider
              v-model="localSettings.fontSize"
              :min="12"
              :max="24"
              :step="1"
              show-input
              @change="handleFontSizeChange"
            />
          </el-form-item>
          
          <el-form-item label="编辑器宽度">
            <el-radio-group v-model="localSettings.editorWidth" @change="handleEditorWidthChange">
              <el-radio-button label="normal">正常</el-radio-button>
              <el-radio-button label="wide">宽屏</el-radio-button>
              <el-radio-button label="full">全宽</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </el-card>
      
      <!-- 编辑器设置 -->
      <el-card class="settings-card" shadow="never">
        <template #header>
          <div class="card-header">
            <el-icon><Edit /></el-icon>
            <span>编辑器</span>
          </div>
        </template>
        
        <el-form label-width="120px">
          <el-form-item label="默认预览模式">
            <el-switch
              v-model="localSettings.showPreview"
              active-text="显示"
              inactive-text="隐藏"
              @change="handleShowPreviewChange"
            />
          </el-form-item>
          
          <el-form-item label="自动保存">
            <el-switch
              v-model="localSettings.autoSave"
              active-text="开启"
              inactive-text="关闭"
              @change="handleAutoSaveChange"
            />
          </el-form-item>
          
          <el-form-item label="自动保存间隔" v-if="localSettings.autoSave">
            <el-input-number
              v-model="localSettings.autoSaveInterval"
              :min="1"
              :max="60"
              :step="1"
              @change="handleAutoSaveIntervalChange"
            />
            <span class="unit-text">秒</span>
          </el-form-item>
          
          <el-form-item label="行号">
            <el-switch
              v-model="localSettings.showLineNumbers"
              active-text="显示"
              inactive-text="隐藏"
              @change="handleLineNumbersChange"
            />
          </el-form-item>
          
          <el-form-item label="代码高亮">
            <el-switch
              v-model="localSettings.syntaxHighlight"
              active-text="开启"
              inactive-text="关闭"
              @change="handleSyntaxHighlightChange"
            />
          </el-form-item>
        </el-form>
      </el-card>
      
      <!-- 文件设置 -->
      <el-card class="settings-card" shadow="never">
        <template #header>
          <div class="card-header">
            <el-icon><Folder /></el-icon>
            <span>文件</span>
          </div>
        </template>
        
        <el-form label-width="120px">
          <el-form-item label="默认文件名">
            <el-input
              v-model="localSettings.defaultFileName"
              placeholder="未命名文档"
              @change="handleDefaultFileNameChange"
            />
          </el-form-item>
          
          <el-form-item label="文件扩展名">
            <el-input
              v-model="localSettings.fileExtension"
              placeholder=".md"
              @change="handleFileExtensionChange"
            />
          </el-form-item>
          
          <el-form-item label="最近文件数量">
            <el-input-number
              v-model="localSettings.recentFilesLimit"
              :min="5"
              :max="50"
              :step="5"
              @change="handleRecentFilesLimitChange"
            />
          </el-form-item>
        </el-form>
      </el-card>
      
      <!-- 语言设置 -->
      <el-card class="settings-card" shadow="never">
        <template #header>
          <div class="card-header">
            <el-icon><Reading /></el-icon>
            <span>{{ t('settings.language.title') }}</span>
          </div>
        </template>
        
        <el-form label-width="120px">
          <el-form-item :label="t('settings.language.selectLanguage')">
            <el-radio-group v-model="localSettings.locale" @change="handleLocaleChange">
              <el-radio-button label="zh-CN">{{ t('settings.language.zhCN') }}</el-radio-button>
              <el-radio-button label="en-US">{{ t('settings.language.enUS') }}</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </el-card>
      
      <!-- 快捷键设置 -->
      <el-card class="settings-card" shadow="never">
        <template #header>
          <div class="card-header">
            <el-icon><Menu /></el-icon>
            <span>快捷键</span>
          </div>
        </template>
        
        <el-table :data="shortcuts" style="width: 100%">
          <el-table-column prop="action" label="操作" width="200" />
          <el-table-column prop="key" label="快捷键" />
        </el-table>
      </el-card>
      
      <!-- 关于 -->
      <el-card class="settings-card" shadow="never">
        <template #header>
          <div class="card-header">
            <el-icon><InfoFilled /></el-icon>
            <span>关于</span>
          </div>
        </template>
        
        <div class="about-content">
          <h3>Markpad</h3>
          <p>版本: {{ appVersion }}</p>
          <p>一个强大的 Markdown 笔记本应用</p>
          <el-space>
            <el-button type="primary" link @click="checkUpdate">检查更新</el-button>
            <el-button type="primary" link @click="openGithub">GitHub</el-button>
            <el-button type="primary" link @click="openDocs">文档</el-button>
          </el-space>
        </div>
      </el-card>
      
      <!-- 底部操作 -->
      <div class="settings-footer">
        <el-button @click="resetSettings">恢复默认设置</el-button>
        <el-button type="primary" @click="saveSettings">保存设置</el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { 
  Sunny, Edit, Folder, InfoFilled, Close, Reading, Menu, Setting 
} from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useSettingsStore } from '@/store/settings'
import { useI18n } from 'vue-i18n'

const emit = defineEmits(['close'])

const settingsStore = useSettingsStore()
const { t, locale } = useI18n()
const appVersion = '1.0.0'

const localSettings = reactive({
  locale: 'zh-CN',
  theme: 'light',
  fontSize: 14,
  editorWidth: 'normal',
  showPreview: true,
  autoSave: true,
  autoSaveInterval: 5,
  showLineNumbers: true,
  syntaxHighlight: true,
  defaultFileName: '未命名文档',
  fileExtension: '.md',
  recentFilesLimit: 20
})

const shortcuts = ref([
  { action: '新建文档', key: 'Ctrl + N' },
  { action: '打开文件', key: 'Ctrl + O' },
  { action: '保存', key: 'Ctrl + S' },
  { action: '另存为', key: 'Ctrl + Shift + S' },
  { action: '关闭文档', key: 'Ctrl + W' },
  { action: '加粗', key: 'Ctrl + B' },
  { action: '斜体', key: 'Ctrl + I' },
  { action: '查找', key: 'Ctrl + F' },
  { action: '替换', key: 'Ctrl + H' },
  { action: '设置', key: 'Ctrl + ,' }
])

onMounted(() => {
  loadSettings()
})

function loadSettings() {
  Object.assign(localSettings, {
    locale: settingsStore.locale,
    fontSize: settingsStore.fontSize,
    editorWidth: settingsStore.editorWidth,
    showPreview: settingsStore.showPreview,
    autoSave: settingsStore.autoSave,
    autoSaveInterval: settingsStore.autoSaveInterval,
    showLineNumbers: settingsStore.showLineNumbers,
    syntaxHighlight: settingsStore.syntaxHighlight,
    defaultFileName: settingsStore.defaultFileName,
    fileExtension: settingsStore.fileExtension,
    recentFilesLimit: settingsStore.recentFilesLimit
  })
}

function handleLocaleChange(value) {
  settingsStore.setLocale(value)
  locale.value = value
  ElMessage.success(t('settings.saveSuccess'))
}

function handleThemeChange(value) {
  settingsStore.setTheme(value)
}

function handleFontSizeChange(value) {
  settingsStore.setFontSize(value)
}

function handleEditorWidthChange(value) {
  settingsStore.setEditorWidth(value)
}

function handleShowPreviewChange(value) {
  settingsStore.setShowPreview(value)
}

function handleAutoSaveChange(value) {
  settingsStore.setAutoSave(value)
}

function handleAutoSaveIntervalChange(value) {
  settingsStore.setAutoSaveInterval(value)
}

function handleLineNumbersChange(value) {
  settingsStore.setShowLineNumbers(value)
}

function handleSyntaxHighlightChange(value) {
  settingsStore.setSyntaxHighlight(value)
}

function handleDefaultFileNameChange(value) {
  settingsStore.setDefaultFileName(value)
}

function handleFileExtensionChange(value) {
  settingsStore.setFileExtension(value)
}

function handleRecentFilesLimitChange(value) {
  settingsStore.setRecentFilesLimit(value)
}

async function resetSettings() {
  try {
    await ElMessageBox.confirm(
      '确定要恢复默认设置吗？此操作无法撤销。',
      '确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    settingsStore.resetSettings()
    loadSettings()
    ElMessage.success('已恢复默认设置')
  } catch {
    // 用户取消
  }
}

function saveSettings() {
  ElMessage.success('设置已保存')
}

function checkUpdate() {
  ElMessage.info('当前已是最新版本')
}

function openGithub() {
  window.open('https://github.com/yourusername/markpad', '_blank')
}

function openDocs() {
  ElMessage.info('文档功能开发中...')
}
</script>

<style lang="scss" scoped>
.settings-page {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: var(--bg-color);
}

.settings-header {
  padding: 20px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  h2 {
    margin: 0;
    font-size: 24px;
    font-weight: 600;
    color: var(--text-color);
  }
  
  .close-btn {
    font-size: 20px;
    padding: 8px;
    
    &:hover {
      color: var(--el-color-primary);
    }
    font-weight: 600;
    color: var(--text-color);
  }
}

.settings-content {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
  
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-thumb {
    background-color: #909399;
    border-radius: 4px;
  }
}

.settings-card {
  margin-bottom: 24px;
  
  &:last-of-type {
    margin-bottom: 80px;
  }
  
  .card-header {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 16px;
    font-weight: 600;
    
    .el-icon {
      font-size: 18px;
      color: var(--el-color-primary);
    }
  }
}

.unit-text {
  margin-left: 8px;
  color: var(--el-text-color-secondary);
}

.about-content {
  text-align: center;
  padding: 20px;
  
  h3 {
    margin: 0 0 8px 0;
    font-size: 20px;
    font-weight: 600;
  }
  
  p {
    margin: 4px 0;
    color: var(--el-text-color-secondary);
  }
  
  .el-space {
    margin-top: 16px;
  }
}

.settings-footer {
  position: fixed;
  bottom: 0;
  left: 260px;
  right: 0;
  padding: 16px 24px;
  background-color: var(--sidebar-bg);
  border-top: 1px solid var(--border-color);
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  z-index: 100;
}

:deep(.el-form-item__label) {
  color: var(--text-color);
}
</style>
