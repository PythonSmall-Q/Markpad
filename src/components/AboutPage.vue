<template>
  <div class="about-page">
    <div class="about-header">
      <el-icon @click="$emit('close')" class="close-icon"><Close /></el-icon>
      <h2>{{ t('about.title') }}</h2>
    </div>
    
    <el-scrollbar class="about-content">
      <el-tabs v-model="activeTab">
        <!-- 关于 -->
        <el-tab-pane :label="t('about.tabs.about')" name="about">
          <div class="about-section">
            <div class="app-info">
              <div class="app-icon">
                <el-icon :size="80"><Document /></el-icon>
              </div>
              <h1>Markpad</h1>
              <p class="version">{{ t('about.version') }}: {{ appVersion }}</p>
              <p class="description">{{ t('about.description') }}</p>
              
              <div class="links">
                <el-button @click="openLink('https://github.com/PythonSmall-Q/Markpad')">
                  <el-icon><Link /></el-icon>
                  {{ t('about.github') }}
                </el-button>
                <el-button @click="openLink('https://github.com/PythonSmall-Q/Markpad/issues')">
                  <el-icon><Warning /></el-icon>
                  {{ t('about.issues') }}
                </el-button>
              </div>
              
              <div class="copyright">
                <p>© 2026 PythonSmall-Q</p>
                <p>{{ t('about.license') }}: MIT License</p>
              </div>
            </div>
          </div>
        </el-tab-pane>

        <!-- 系统信息 -->
        <el-tab-pane :label="t('about.tabs.system')" name="system">
          <div class="about-section">
            <el-descriptions :column="1" border>
              <el-descriptions-item :label="t('about.system.os')">
                {{ systemInfo.os }}
              </el-descriptions-item>
              <el-descriptions-item :label="t('about.system.platform')">
                {{ systemInfo.platform }}
              </el-descriptions-item>
              <el-descriptions-item :label="t('about.system.arch')">
                {{ systemInfo.arch }}
              </el-descriptions-item>
              <el-descriptions-item :label="t('about.system.node')">
                {{ systemInfo.nodeVersion }}
              </el-descriptions-item>
              <el-descriptions-item :label="t('about.system.electron')">
                {{ systemInfo.electronVersion }}
              </el-descriptions-item>
              <el-descriptions-item :label="t('about.system.chrome')">
                {{ systemInfo.chromeVersion }}
              </el-descriptions-item>
              <el-descriptions-item :label="t('about.system.memory')">
                {{ systemInfo.totalMemory }}
              </el-descriptions-item>
            </el-descriptions>
            
            <el-button @click="copySystemInfo" type="primary" style="margin-top: 16px;">
              <el-icon><DocumentCopy /></el-icon>
              {{ t('about.system.copy') }}
            </el-button>
          </div>
        </el-tab-pane>

        <!-- 日志 -->
        <el-tab-pane :label="t('about.tabs.logs')" name="logs">
          <div class="about-section">
            <div class="logs-toolbar">
              <el-select v-model="logFilter" style="width: 120px;" @change="filterLogs">
                <el-option :label="t('about.logs.all')" value="all" />
                <el-option :label="t('about.logs.info')" value="info" />
                <el-option :label="t('about.logs.success')" value="success" />
                <el-option :label="t('about.logs.warn')" value="warn" />
                <el-option :label="t('about.logs.error')" value="error" />
              </el-select>
              
              <div class="logs-actions">
                <el-button @click="refreshLogs" :icon="Refresh">
                  {{ t('about.logs.refresh') }}
                </el-button>
                <el-button @click="clearLogs" :icon="Delete">
                  {{ t('about.logs.clear') }}
                </el-button>
                <el-button @click="exportLogs" type="primary" :icon="Download">
                  {{ t('about.logs.export') }}
                </el-button>
              </div>
            </div>
            
            <div class="logs-container">
              <div v-if="filteredLogs.length === 0" class="logs-empty">
                {{ t('about.logs.empty') }}
              </div>
              <div 
                v-for="(log, index) in filteredLogs" 
                :key="index" 
                class="log-entry"
                :class="`log-${log.level}`"
              >
                <div class="log-header">
                  <el-tag :type="getLogTagType(log.level)" size="small">
                    {{ log.level.toUpperCase() }}
                  </el-tag>
                  <span class="log-time">{{ formatTime(log.timestamp) }}</span>
                </div>
                <div class="log-content">
                  <div class="log-action">{{ log.action }}</div>
                  <div class="log-result">{{ log.result }}</div>
                  <div v-if="log.details" class="log-details">
                    <pre>{{ JSON.stringify(log.details, null, 2) }}</pre>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-scrollbar>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage, ElMessageBox } from 'element-plus'
import { 
  Close, Document, Link, Warning, DocumentCopy, 
  Refresh, Delete, Download 
} from '@element-plus/icons-vue'
import logger from '@/utils/logger'
import { systemAPI } from '@/utils/electron'

const { t } = useI18n()
const activeTab = ref('about')
const logFilter = ref('all')
const filteredLogs = ref([])

defineEmits(['close'])

// 从 package.json 读取版本
import packageJson from '../../package.json'
const appVersion = ref(packageJson.version)

const systemInfo = ref({
  os: 'Loading...',
  platform: 'Loading...',
  arch: 'Loading...',
  nodeVersion: 'Loading...',
  electronVersion: 'Loading...',
  chromeVersion: 'Loading...',
  totalMemory: 'Loading...'
})

onMounted(async () => {
  await loadSystemInfo()
  refreshLogs()
})

async function loadSystemInfo() {
  try {
    const info = await systemAPI.getSystemInfo()
    systemInfo.value = info
  } catch (error) {
    logger.error('Load system info', 'Failed to load system information', { error: error.message })
    ElMessage.error(t('about.system.loadError'))
  }
}

function refreshLogs() {
  const logs = logger.getLogs()
  filterLogs()
  logger.info('Refresh logs', `Loaded ${logs.length} log entries`)
}

function filterLogs() {
  const allLogs = logger.getLogs()
  if (logFilter.value === 'all') {
    filteredLogs.value = allLogs
  } else {
    filteredLogs.value = logger.getLogsByLevel(logFilter.value)
  }
}

async function clearLogs() {
  try {
    await ElMessageBox.confirm(
      t('about.logs.confirmClear'),
      t('about.logs.clearTitle'),
      {
        confirmButtonText: t('about.logs.confirm'),
        cancelButtonText: t('about.logs.cancel'),
        type: 'warning'
      }
    )
    logger.clearLogs()
    refreshLogs()
    ElMessage.success(t('about.logs.cleared'))
  } catch {
    // User cancelled
  }
}

async function exportLogs() {
  try {
    const logsText = logger.exportLogs()
    const result = await systemAPI.exportLogs(logsText)
    
    if (result.success) {
      logger.success('Export logs', `Exported to ${result.filePath}`)
      ElMessage.success(t('about.logs.exported'))
    } else {
      throw new Error(result.error || 'Export failed')
    }
  } catch (error) {
    logger.error('Export logs', 'Failed to export logs', { error: error.message })
    ElMessage.error(t('about.logs.exportError'))
  }
}

function copySystemInfo() {
  const info = Object.entries(systemInfo.value)
    .map(([key, value]) => `${key}: ${value}`)
    .join('\n')
  
  navigator.clipboard.writeText(info).then(() => {
    logger.info('Copy system info', 'System information copied to clipboard')
    ElMessage.success(t('about.system.copied'))
  }).catch(error => {
    logger.error('Copy system info', 'Failed to copy', { error: error.message })
    ElMessage.error(t('about.system.copyError'))
  })
}

function openLink(url) {
  systemAPI.openExternal(url)
  logger.info('Open external link', `Opened ${url}`)
}

function getLogTagType(level) {
  const types = {
    info: 'info',
    success: 'success',
    warn: 'warning',
    error: 'danger'
  }
  return types[level] || 'info'
}

function formatTime(timestamp) {
  return new Date(timestamp).toLocaleString()
}
</script>

<style lang="scss" scoped>
.about-page {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: var(--el-bg-color);
}

.about-header {
  padding: 20px;
  border-bottom: 1px solid var(--el-border-color);
  display: flex;
  align-items: center;
  gap: 12px;
  
  h2 {
    margin: 0;
    font-size: 24px;
    color: var(--el-text-color-primary);
  }
  
  .close-icon {
    font-size: 24px;
    cursor: pointer;
    color: var(--el-text-color-regular);
    transition: color 0.3s;
    
    &:hover {
      color: var(--el-color-primary);
    }
  }
}

.about-content {
  flex: 1;
  padding: 20px;
}

.about-section {
  padding: 20px 0;
}

.app-info {
  text-align: center;
  max-width: 600px;
  margin: 0 auto;
  
  .app-icon {
    margin-bottom: 20px;
    color: var(--el-color-primary);
  }
  
  h1 {
    margin: 0 0 8px;
    font-size: 32px;
    color: var(--el-text-color-primary);
  }
  
  .version {
    margin: 0 0 16px;
    font-size: 16px;
    color: var(--el-text-color-secondary);
  }
  
  .description {
    margin: 0 0 24px;
    font-size: 14px;
    line-height: 1.6;
    color: var(--el-text-color-regular);
  }
  
  .links {
    display: flex;
    justify-content: center;
    gap: 12px;
    margin-bottom: 32px;
  }
  
  .copyright {
    padding-top: 24px;
    border-top: 1px solid var(--el-border-color);
    
    p {
      margin: 4px 0;
      font-size: 14px;
      color: var(--el-text-color-secondary);
    }
  }
}

.logs-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  
  .logs-actions {
    display: flex;
    gap: 8px;
  }
}

.logs-container {
  max-height: 500px;
  overflow-y: auto;
  border: 1px solid var(--el-border-color);
  border-radius: 4px;
  padding: 12px;
  background-color: var(--el-fill-color-blank);
}

.logs-empty {
  text-align: center;
  padding: 40px;
  color: var(--el-text-color-secondary);
}

.log-entry {
  margin-bottom: 12px;
  padding: 12px;
  border-radius: 4px;
  border-left: 3px solid;
  background-color: var(--el-bg-color);
  
  &.log-info {
    border-left-color: var(--el-color-info);
  }
  
  &.log-success {
    border-left-color: var(--el-color-success);
  }
  
  &.log-warn {
    border-left-color: var(--el-color-warning);
  }
  
  &.log-error {
    border-left-color: var(--el-color-danger);
  }
}

.log-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  
  .log-time {
    font-size: 12px;
    color: var(--el-text-color-secondary);
  }
}

.log-content {
  .log-action {
    font-weight: 600;
    margin-bottom: 4px;
    color: var(--el-text-color-primary);
  }
  
  .log-result {
    font-size: 14px;
    color: var(--el-text-color-regular);
  }
  
  .log-details {
    margin-top: 8px;
    padding: 8px;
    background-color: var(--el-fill-color-light);
    border-radius: 4px;
    
    pre {
      margin: 0;
      font-size: 12px;
      line-height: 1.5;
      color: var(--el-text-color-regular);
      white-space: pre-wrap;
      word-break: break-all;
    }
  }
}
</style>
