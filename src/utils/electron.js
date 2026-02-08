/**
 * Electron API 封装层
 * 提供统一的 API 接口，处理 Electron 和 Web 环境的兼容性
 */

export const isElectron = () => {
    return window.electronAPI !== undefined
}

// File operations
export const fileAPI = {
    async open() {
        if (!isElectron()) {
            console.warn('File operations are only available in Electron environment')
            return null
        }
        try {
            return await window.electronAPI.fileOpen()
        } catch (error) {
            console.error('File open error:', error)
            return null
        }
    },

    async save(filePath, content) {
        if (!isElectron()) {
            console.warn('File operations are only available in Electron environment')
            return { success: false, error: 'Not in Electron environment' }
        }
        try {
            return await window.electronAPI.fileSave({ filePath, content })
        } catch (error) {
            console.error('File save error:', error)
            return { success: false, error: error.message }
        }
    },

    async saveAs(content, defaultName = 'untitled.md') {
        if (!isElectron()) {
            console.warn('File operations are only available in Electron environment')
            return { success: false, error: 'Not in Electron environment' }
        }
        try {
            return await window.electronAPI.fileSaveAs({ content, defaultName })
        } catch (error) {
            console.error('File saveAs error:', error)
            return { success: false, error: error.message }
        }
    },

    async read(filePath) {
        if (!isElectron()) {
            console.warn('File operations are only available in Electron environment')
            return { success: false, error: 'Not in Electron environment' }
        }
        try {
            return await window.electronAPI.fileRead(filePath)
        } catch (error) {
            console.error('File read error:', error)
            return { success: false, error: error.message }
        }
    }
}

// Asset import
export const assetAPI = {
    async import(type = 'file') {
        if (!isElectron()) {
            console.warn('Asset operations are only available in Electron environment')
            return { success: false, error: 'Not in Electron environment' }
        }
        return await window.electronAPI.assetImport(type)
    },

    async importImage() {
        return await this.import('image')
    },

    async importVideo() {
        return await this.import('video')
    },

    async importAudio() {
        return await this.import('audio')
    }
}

// Export functionality
export const exportAPI = {
    async toHtml(content, defaultName = 'export.html') {
        if (!isElectron()) {
            console.warn('Export operations are only available in Electron environment')
            return { success: false, error: 'Not in Electron environment' }
        }
        try {
            return await window.electronAPI.exportHtml({ content, defaultName })
        } catch (error) {
            console.error('Export HTML error:', error)
            return { success: false, error: error.message }
        }
    },

    async toPdf(defaultName = 'export.pdf') {
        if (!isElectron()) {
            console.warn('Export operations are only available in Electron environment')
            return { success: false, error: 'Not in Electron environment' }
        }
        try {
            return await window.electronAPI.exportPdf(defaultName)
        } catch (error) {
            console.error('Export PDF error:', error)
            return { success: false, error: error.message }
        }
    },

    async toMarkdown(content, defaultName = 'export.md') {
        if (!isElectron()) {
            console.warn('Export operations are only available in Electron environment')
            return { success: false, error: 'Not in Electron environment' }
        }
        try {
            return await window.electronAPI.exportMarkdown({ content, defaultName })
        } catch (error) {
            console.error('Export Markdown error:', error)
            return { success: false, error: error.message }
        }
    },

    async toText(content, defaultName = 'export.txt') {
        if (!isElectron()) {
            console.warn('Export operations are only available in Electron environment')
            return { success: false, error: 'Not in Electron environment' }
        }
        try {
            return await window.electronAPI.exportText({ content, defaultName })
        } catch (error) {
            console.error('Export Text error:', error)
            return { success: false, error: error.message }
        }
    }
}

// System functionality
export const systemAPI = {
    async openExternal(url) {
        if (!isElectron()) {
            window.open(url, '_blank')
            return
        }
        await window.electronAPI.openExternal(url)
    },

    async getSystemInfo() {
        if (!isElectron()) {
            return {
                os: navigator.platform || 'Unknown',
                platform: 'Web',
                arch: 'Unknown',
                nodeVersion: 'N/A',
                electronVersion: 'N/A',
                chromeVersion: navigator.userAgent.match(/Chrome\/(\d+\.\d+\.\d+\.\d+)/)?.[1] || 'N/A',
                totalMemory: navigator.deviceMemory ? `${navigator.deviceMemory} GB` : 'Unknown'
            }
        }
        return await window.electronAPI.getSystemInfo()
    },

    async exportLogs(content) {
        if (!isElectron()) {
            // Web 环境下载到本地
            const blob = new Blob([content], { type: 'text/plain' })
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `markpad-logs-${Date.now()}.txt`
            a.click()
            URL.revokeObjectURL(url)
            return { success: true, filePath: a.download }
        }
        return await window.electronAPI.exportLogs(content)
    }
}

// Settings
export const settingsAPI = {
    async get() {
        if (!isElectron()) {
            return {}
        }
        return await window.electronAPI.getSettings()
    },

    async set(settings) {
        if (!isElectron()) {
            return { success: false }
        }
        return await window.electronAPI.setSettings(settings)
    }
}

// Temporary file management
export const tempAPI = {
    async save(documents) {
        if (!isElectron()) {
            // 在 Web 环境下使用 localStorage
            try {
                localStorage.setItem('markpad-temp-documents', JSON.stringify(documents))
                return { success: true }
            } catch (error) {
                return { success: false, error: error.message }
            }
        }
        return await window.electronAPI.tempSave({ documents })
    },

    async load() {
        if (!isElectron()) {
            // 在 Web 环境下使用 localStorage
            try {
                const data = localStorage.getItem('markpad-temp-documents')
                const documents = data ? JSON.parse(data) : []
                return { success: true, documents }
            } catch (error) {
                return { success: false, error: error.message }
            }
        }
        return await window.electronAPI.tempLoad()
    },

    async clear() {
        if (!isElectron()) {
            // 在 Web 环境下使用 localStorage
            try {
                localStorage.removeItem('markpad-temp-documents')
                return { success: true }
            } catch (error) {
                return { success: false, error: error.message }
            }
        }
        return await window.electronAPI.tempClear()
    }
}

// Window events
export const windowAPI = {
    onBeforeClose(callback) {
        if (!isElectron()) {
            // 在 Web 环境下使用 beforeunload
            window.addEventListener('beforeunload', callback)
            return
        }
        window.electronAPI.onBeforeClose(callback)
    },

    confirmClose(shouldClose) {
        if (!isElectron()) {
            return
        }
        window.electronAPI.closeConfirmed(shouldClose)
    }
}

// Auto Updater
export const updateAPI = {
    async check() {
        if (!isElectron()) {
            console.warn('Auto-update is only available in Electron environment')
            return { success: false, error: 'Not in Electron environment' }
        }
        if (!window.electronAPI.updateAPI) {
            console.warn('updateAPI not available')
            return { success: false, error: 'updateAPI not available' }
        }
        try {
            return await window.electronAPI.updateAPI.check()
        } catch (error) {
            console.error('Check update error:', error)
            return { success: false, error: error.message }
        }
    },

    async download() {
        if (!isElectron()) {
            return { success: false, error: 'Not in Electron environment' }
        }
        if (!window.electronAPI.updateAPI) {
            return { success: false, error: 'updateAPI not available' }
        }
        try {
            return await window.electronAPI.updateAPI.download()
        } catch (error) {
            console.error('Download update error:', error)
            return { success: false, error: error.message }
        }
    },

    async install() {
        if (!isElectron()) {
            return { success: false, error: 'Not in Electron environment' }
        }
        if (!window.electronAPI.updateAPI) {
            return { success: false, error: 'updateAPI not available' }
        }
        try {
            return await window.electronAPI.updateAPI.install()
        } catch (error) {
            console.error('Install update error:', error)
            return { success: false, error: error.message }
        }
    },

    async getVersion() {
        if (!isElectron()) {
            return { success: false, error: 'Not in Electron environment' }
        }
        if (!window.electronAPI.updateAPI) {
            return { success: false, error: 'updateAPI not available' }
        }
        try {
            return await window.electronAPI.updateAPI.getVersion()
        } catch (error) {
            console.error('Get version error:', error)
            return { success: false, error: error.message }
        }
    },

    onChecking(callback) {
        if (!isElectron()) {
            return
        }
        if (window.electronAPI.updateAPI) {
            window.electronAPI.updateAPI.onChecking(callback)
        }
    },

    onUpdateAvailable(callback) {
        if (!isElectron()) {
            return
        }
        if (window.electronAPI.updateAPI) {
            window.electronAPI.updateAPI.onUpdateAvailable(callback)
        }
    },

    onUpdateNotAvailable(callback) {
        if (!isElectron()) {
            return
        }
        if (window.electronAPI.updateAPI) {
            window.electronAPI.updateAPI.onUpdateNotAvailable(callback)
        }
    },

    onDownloadProgress(callback) {
        if (!isElectron()) {
            return
        }
        if (window.electronAPI.updateAPI) {
            window.electronAPI.updateAPI.onDownloadProgress(callback)
        }
    },

    onUpdateDownloaded(callback) {
        if (!isElectron()) {
            return
        }
        if (window.electronAPI.updateAPI) {
            window.electronAPI.updateAPI.onUpdateDownloaded(callback)
        }
    },

    onError(callback) {
        if (!isElectron()) {
            return
        }
        if (window.electronAPI.updateAPI) {
            window.electronAPI.updateAPI.onError(callback)
        }
    }
}

// Backward compatibility
export const updaterAPI = updateAPI

export default {
    isElectron,
    fileAPI,
    assetAPI,
    exportAPI,
    systemAPI,
    settingsAPI,
    tempAPI,
    windowAPI,
    updateAPI,
    updaterAPI
}
