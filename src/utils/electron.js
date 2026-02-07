/**
 * Electron API 封装层
 * 提供统一的 API 接口，处理 Electron 和 Web 环境的兼容性
 */

const isElectron = () => {
    return window.electronAPI !== undefined
}

// 文件操作
export const fileAPI = {
    async open() {
        if (!isElectron()) {
            console.warn('File operations are only available in Electron environment')
            return null
        }
        return await window.electronAPI.fileOpen()
    },

    async save(filePath, content) {
        if (!isElectron()) {
            console.warn('File operations are only available in Electron environment')
            return { success: false, error: 'Not in Electron environment' }
        }
        return await window.electronAPI.fileSave({ filePath, content })
    },

    async saveAs(content, defaultName = 'untitled.md') {
        if (!isElectron()) {
            console.warn('File operations are only available in Electron environment')
            return { success: false, error: 'Not in Electron environment' }
        }
        return await window.electronAPI.fileSaveAs({ content, defaultName })
    },

    async read(filePath) {
        if (!isElectron()) {
            console.warn('File operations are only available in Electron environment')
            return { success: false, error: 'Not in Electron environment' }
        }
        return await window.electronAPI.fileRead(filePath)
    }
}

// 资源导入
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

// 导出功能
export const exportAPI = {
    async toHtml(content, defaultName = 'export.html') {
        if (!isElectron()) {
            console.warn('Export operations are only available in Electron environment')
            return { success: false, error: 'Not in Electron environment' }
        }
        return await window.electronAPI.exportHtml({ content, defaultName })
    },

    async toPdf(defaultName = 'export.pdf') {
        if (!isElectron()) {
            console.warn('Export operations are only available in Electron environment')
            return { success: false, error: 'Not in Electron environment' }
        }
        return await window.electronAPI.exportPdf(defaultName)
    },

    async toMarkdown(content, defaultName = 'export.md') {
        if (!isElectron()) {
            console.warn('Export operations are only available in Electron environment')
            return { success: false, error: 'Not in Electron environment' }
        }
        return await window.electronAPI.exportMarkdown({ content, defaultName })
    },

    async toText(content, defaultName = 'export.txt') {
        if (!isElectron()) {
            console.warn('Export operations are only available in Electron environment')
            return { success: false, error: 'Not in Electron environment' }
        }
        return await window.electronAPI.exportText({ content, defaultName })
    }
}

// 系统功能
export const systemAPI = {
    async openExternal(url) {
        if (!isElectron()) {
            window.open(url, '_blank')
            return
        }
        await window.electronAPI.openExternal(url)
    }
}

// 设置
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

export default {
    isElectron,
    fileAPI,
    assetAPI,
    exportAPI,
    systemAPI,
    settingsAPI
}
