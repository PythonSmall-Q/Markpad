<template>
  <div class="settings-page">
    <div class="settings-header">
      <h2>{{ t('settings.title') }}</h2>
      <el-button type="text" @click="emit('close')" class="close-btn">
        <el-icon><Close /></el-icon>
      </el-button>
    </div>
    
    <div class="settings-content">
      <!-- Appearance settings -->
      <el-card class="settings-card" shadow="never">
        <template #header>
          <div class="card-header">
            <el-icon><Sunny /></el-icon>
            <span>{{ t('settings.appearance.title') }}</span>
          </div>
        </template>
        
        <el-form label-width="120px">
          <el-form-item :label="t('settings.appearance.theme')">
            <el-radio-group v-model="localSettings.theme" @change="handleThemeChange">
              <el-radio-button label="light">{{ t('settings.appearance.themeLight') }}</el-radio-button>
              <el-radio-button label="dark">{{ t('settings.appearance.themeDark') }}</el-radio-button>
              <el-radio-button label="auto">{{ t('settings.appearance.themeAuto') }}</el-radio-button>
            </el-radio-group>
          </el-form-item>
          
          <el-form-item :label="t('settings.appearance.fontSize')">
            <el-slider
              v-model="localSettings.fontSize"
              :min="12"
              :max="24"
              :step="1"
              show-input
              @change="handleFontSizeChange"
            />
          </el-form-item>
          
          <el-form-item :label="t('settings.appearance.editorWidth')">
            <el-radio-group v-model="localSettings.editorWidth" @change="handleEditorWidthChange">
              <el-radio-button label="normal">{{ t('settings.appearance.widthNormal') }}</el-radio-button>
              <el-radio-button label="wide">{{ t('settings.appearance.widthWide') }}</el-radio-button>
              <el-radio-button label="full">{{ t('settings.appearance.widthFull') }}</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </el-card>
      
      <!-- Editor settings -->
      <el-card class="settings-card" shadow="never">
        <template #header>
          <div class="card-header">
            <el-icon><Edit /></el-icon>
            <span>{{ t('settings.editor.title') }}</span>
          </div>
        </template>
        
        <el-form label-width="120px">
          <el-form-item :label="t('settings.editor.defaultPreview')">
            <el-switch
              v-model="localSettings.showPreview"
              :active-text="t('settings.editor.show')"
              :inactive-text="t('settings.editor.hide')"
              @change="handleShowPreviewChange"
            />
          </el-form-item>
          
          <el-form-item :label="t('settings.editor.autoSave')">
            <el-switch
              v-model="localSettings.autoSave"
              :active-text="t('settings.editor.enable')"
              :inactive-text="t('settings.editor.disable')"
              @change="handleAutoSaveChange"
            />
          </el-form-item>
          
          <el-form-item :label="t('settings.editor.autoSaveInterval')" v-if="localSettings.autoSave">
            <el-input-number
              v-model="localSettings.autoSaveInterval"
              :min="1"
              :max="60"
              :step="1"
              @change="handleAutoSaveIntervalChange"
            />
            <span class="unit-text">{{ t('settings.editor.seconds') }}</span>
          </el-form-item>
          
          <el-form-item :label="t('settings.editor.showLineNumbers')">
            <el-switch
              v-model="localSettings.showLineNumbers"
              :active-text="t('settings.editor.show')"
              :inactive-text="t('settings.editor.hide')"
              @change="handleLineNumbersChange"
            />
          </el-form-item>
          
          <el-form-item :label="t('settings.editor.syntaxHighlight')">
            <el-switch
              v-model="localSettings.syntaxHighlight"
              :active-text="t('settings.editor.enable')"
              :inactive-text="t('settings.editor.disable')"
              @change="handleSyntaxHighlightChange"
            />
          </el-form-item>
        </el-form>
      </el-card>
      
      <!-- File settings -->
      <el-card class="settings-card" shadow="never">
        <template #header>
          <div class="card-header">
            <el-icon><Folder /></el-icon>
            <span>{{ t('settings.file.title') }}</span>
          </div>
        </template>
        
        <el-form label-width="120px">
          <el-form-item :label="t('settings.file.defaultFileName')">
            <el-input
              v-model="localSettings.defaultFileName"
              placeholder="未命名文档"
              @change="handleDefaultFileNameChange"
            />
          </el-form-item>
          
          <el-form-item :label="t('settings.file.fileExtension')">
            <el-input
              v-model="localSettings.fileExtension"
              placeholder=".md"
              @change="handleFileExtensionChange"
            />
          </el-form-item>
          
          <el-form-item :label="t('settings.file.recentFilesLimit')">
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
      
      <!-- Language settings -->
      <el-card class="settings-card" shadow="never">
        <template #header>
          <div class="card-header">
            <el-icon><Reading /></el-icon>
            <span>{{ t('settings.language.title') }}</span>
          </div>
        </template>
        
        <el-form label-width="120px">
          <el-form-item :label="t('settings.language.selectLanguage')">
            <el-select v-model="localSettings.locale" @change="handleLocaleChange" style="width: 200px">
              <el-option label="简体中文" value="zh-CN" />
              <el-option label="繁體中文" value="zh-TW" />
              <el-option label="English" value="en-US" />
              <el-option label="日本語" value="ja-JP" />
              <el-option label="한국어" value="ko-KR" />
              <el-option label="Español" value="es-ES" />
              <el-option label="Français" value="fr-FR" />
              <el-option label="Deutsch" value="de-DE" />
              <el-option label="Русский" value="ru-RU" />
              <el-option label="Português (Brasil)" value="pt-BR" />
            </el-select>
          </el-form-item>
        </el-form>
      </el-card>
      
      <!-- Update settings -->
      <el-card class="settings-card" shadow="never">
        <template #header>
          <div class="card-header">
            <el-icon><Setting /></el-icon>
            <span>{{ t('settings.update.title') }}</span>
          </div>
        </template>
        
        <el-form label-width="120px">
          <el-form-item :label="t('settings.update.autoCheck')">
            <el-switch
              v-model="localSettings.autoCheckUpdates"
              :active-text="t('settings.editor.enable')"
              :inactive-text="t('settings.editor.disable')"
              @change="handleAutoCheckUpdatesChange"
            />
          </el-form-item>
          
          <el-form-item :label="t('settings.update.autoDownload')" v-if="localSettings.autoCheckUpdates">
            <el-switch
              v-model="localSettings.autoDownloadUpdates"
              :active-text="t('settings.editor.enable')"
              :inactive-text="t('settings.editor.disable')"
              @change="handleAutoDownloadUpdatesChange"
            />
          </el-form-item>
        </el-form>
      </el-card>
      
      <!-- Shortcut settings -->
      <el-card class="settings-card" shadow="never">
        <template #header>
          <div class="card-header">
            <el-icon><Menu /></el-icon>
            <span>{{ t('settings.shortcuts.title') }}</span>
          </div>
        </template>
        
        <el-table :data="shortcuts" style="width: 100%">
          <el-table-column prop="action" :label="t('settings.shortcuts.action')" width="200" />
          <el-table-column prop="key" :label="t('settings.shortcuts.key')" />
        </el-table>
      </el-card>
      
      <!-- About -->
      <el-card class="settings-card" shadow="never">
        <template #header>
          <div class="card-header">
            <el-icon><InfoFilled /></el-icon>
            <span>{{ t('settings.about.title') }}</span>
          </div>
        </template>
        
        <div class="about-content">
          <h3>Markpad</h3>
          <p>{{ t('settings.about.version') }}: {{ appVersion }}</p>
          <p>{{ t('settings.about.description') }}</p>
          <el-space>
            <el-button type="primary" link @click="checkUpdate">{{ t('settings.about.checkUpdate') }}</el-button>
            <el-button type="primary" link @click="openGithub">{{ t('settings.about.github') }}</el-button>
            <el-button type="primary" link @click="openDocs">{{ t('settings.about.docs') }}</el-button>
          </el-space>
        </div>
      </el-card>
      
      <!-- Footer actions -->
      <div class="settings-footer">
        <el-button @click="resetSettings">{{ t('settings.reset') }}</el-button>
        <el-button type="primary" @click="saveSettings">{{ t('settings.save') }}</el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
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
  recentFilesLimit: 20,
  autoCheckUpdates: true,
  autoDownloadUpdates: false
})

const shortcuts = computed(() => ([
  { action: t('welcome.shortcutList.newDoc'), key: 'Ctrl + N' },
  { action: t('welcome.shortcutList.open'), key: 'Ctrl + O' },
  { action: t('welcome.shortcutList.save'), key: 'Ctrl + S' },
  { action: t('welcome.shortcutList.saveAs'), key: 'Ctrl + Shift + S' },
  { action: t('welcome.shortcutList.close'), key: 'Ctrl + W' },
  { action: t('welcome.shortcutList.bold'), key: 'Ctrl + B' },
  { action: t('welcome.shortcutList.italic'), key: 'Ctrl + I' },
  { action: t('welcome.shortcutList.find'), key: 'Ctrl + F' },
  { action: t('welcome.shortcutList.replace'), key: 'Ctrl + H' },
  { action: t('welcome.shortcutList.settings'), key: 'Ctrl + ,' }
]))

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
    autoCheckUpdates: settingsStore.autoCheckUpdates,
    autoDownloadUpdates: settingsStore.autoDownloadUpdates,
    fileExtension: settingsStore.fileExtension,
    recentFilesLimit: settingsStore.recentFilesLimit
  })
}

function handleLocaleChange(value) {
  settingsStore.setLocale(value)
  locale.value = value
  localStorage.setItem('markpad-locale', value)
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
function handleAutoCheckUpdatesChange(value) {
  settingsStore.setAutoCheckUpdates(value)
}

function handleAutoDownloadUpdatesChange(value) {
  settingsStore.setAutoDownloadUpdates(value)
}

}

async function resetSettings() {
  try {
    await ElMessageBox.confirm(
      t('settings.resetConfirm'),
      t('dialog.confirm'),
      {
        confirmButtonText: t('dialog.confirm'),
        cancelButtonText: t('dialog.cancel'),
        type: 'warning'
      }
    )
    
    settingsStore.resetSettings()
    loadSettings()
    ElMessage.success(t('settings.resetSuccess'))
  } catch {
    // User cancelled
  }
}

async function checkUpdate() {
  if (!window.electronAPI || !window.electronAPI.updateAPI) {
    ElMessage.warning(t('settings.update.desktopOnly'))
    return
  }
  
  try {
    ElMessage.info(t('settings.update.checking'))
    await window.electronAPI.updateAPI.check()
  } catch (error) {
    console.error('Check update failed:', error)
    ElMessage.error(t('settings.update.checkFailed'))
  }
}

function saveSettings() {
  ElMessage.success(t('settings.saveSuccess'))
}

function openGithub() {
  window.open('https://github.com/yourusername/markpad', '_blank')
}

function openDocs() {
  ElMessage.info(t('settings.about.docsComingSoon'))
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
  left: 0;
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
