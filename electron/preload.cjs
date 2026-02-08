const { contextBridge, ipcRenderer } = require('electron')

console.log('=== Preload script is running ===')

// 暴露安全的 API 给渲染进程
contextBridge.exposeInMainWorld('electronAPI', {
    // 文件操作
    fileOpen: () => ipcRenderer.invoke('file:open'),
    fileSave: (data) => ipcRenderer.invoke('file:save', data),
    fileSaveAs: (data) => ipcRenderer.invoke('file:saveAs', data),
    fileRead: (filePath) => ipcRenderer.invoke('file:read', filePath),

    // 资源导入
    assetImport: (type) => ipcRenderer.invoke('asset:import', type),

    // 导出功能
    exportHtml: (data) => ipcRenderer.invoke('export:html', data),
    exportPdf: (defaultName) => ipcRenderer.invoke('export:pdf', defaultName),
    exportMarkdown: (data) => ipcRenderer.invoke('export:markdown', data),
    exportText: (data) => ipcRenderer.invoke('export:text', data),

    // 系统功能
    openExternal: (url) => ipcRenderer.invoke('shell:openExternal', url),

    // 设置
    getSettings: () => ipcRenderer.invoke('settings:get'),
    setSettings: (settings) => ipcRenderer.invoke('settings:set', settings),

    // 临时文件管理
    tempSave: (data) => ipcRenderer.invoke('temp:save', data),
    tempLoad: () => ipcRenderer.invoke('temp:load'),
    tempClear: () => ipcRenderer.invoke('temp:clear'),

    // 窗口事件
    onBeforeClose: (callback) => ipcRenderer.on('window:before-close', callback),
    closeConfirmed: (shouldClose) => ipcRenderer.send('window:close-confirmed', shouldClose),

    // 自动更新 API
    updateAPI: {
        check: () => ipcRenderer.invoke('updater:check'),
        download: () => ipcRenderer.invoke('updater:download'),
        install: () => ipcRenderer.invoke('updater:install'),
        getVersion: () => ipcRenderer.invoke('updater:get-version'),
        onUpdateAvailable: (callback) => {
            ipcRenderer.on('updater:update-available', (event, info) => callback(info))
        },
        onDownloadProgress: (callback) => {
            ipcRenderer.on('updater:download-progress', (event, progress) => callback(progress))
        },
        onUpdateDownloaded: (callback) => {
            ipcRenderer.on('updater:update-downloaded', (event, info) => callback(info))
        }
    },

    // 系统信息 API
    getSystemInfo: () => ipcRenderer.invoke('system:get-info')
})

console.log('=== electronAPI exposed successfully ===')
