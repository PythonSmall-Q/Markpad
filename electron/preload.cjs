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

    // 菜单事件监听
    onMenuEvent: (callback) => {
        // 文件菜单
        ipcRenderer.on('menu:new-document', () => callback('new-document'))
        ipcRenderer.on('menu:open-file', () => callback('open-file'))
        ipcRenderer.on('menu:save-file', () => callback('save-file'))
        ipcRenderer.on('menu:save-file-as', () => callback('save-file-as'))
        ipcRenderer.on('menu:export-html', () => callback('export-html'))
        ipcRenderer.on('menu:export-pdf', () => callback('export-pdf'))
        ipcRenderer.on('menu:export-markdown', () => callback('export-markdown'))
        ipcRenderer.on('menu:close-document', () => callback('close-document'))

        // 编辑菜单
        ipcRenderer.on('menu:undo', () => callback('undo'))
        ipcRenderer.on('menu:redo', () => callback('redo'))
        ipcRenderer.on('menu:find', () => callback('find'))
        ipcRenderer.on('menu:replace', () => callback('replace'))

        // 视图菜单
        ipcRenderer.on('menu:toggle-sidebar', () => callback('toggle-sidebar'))
        ipcRenderer.on('menu:toggle-preview', () => callback('toggle-preview'))

        // 格式菜单
        ipcRenderer.on('menu:format-bold', () => callback('format-bold'))
        ipcRenderer.on('menu:format-italic', () => callback('format-italic'))
        ipcRenderer.on('menu:format-strikethrough', () => callback('format-strikethrough'))
        ipcRenderer.on('menu:format-heading', (event, level) => callback('format-heading', level))
        ipcRenderer.on('menu:insert-link', () => callback('insert-link'))
        ipcRenderer.on('menu:insert-image', () => callback('insert-image'))
        ipcRenderer.on('menu:insert-code', () => callback('insert-code'))
        ipcRenderer.on('menu:insert-table', () => callback('insert-table'))

        // 帮助菜单
        ipcRenderer.on('menu:help', () => callback('help'))
        ipcRenderer.on('menu:check-updates', () => callback('check-updates'))
        ipcRenderer.on('menu:about', () => callback('about'))
    },

    // 自动更新 API
    updateAPI: {
        check: () => ipcRenderer.invoke('updater:check'),
        download: () => ipcRenderer.invoke('updater:download'),
        install: () => ipcRenderer.invoke('updater:install'),
        getVersion: () => ipcRenderer.invoke('updater:get-version'),
        onChecking: (callback) => {
            ipcRenderer.on('updater:checking', () => callback())
        },
        onUpdateAvailable: (callback) => {
            ipcRenderer.on('updater:update-available', (event, info) => callback(info))
        },
        onUpdateNotAvailable: (callback) => {
            ipcRenderer.on('updater:not-available', (event, info) => callback(info))
        },
        onDownloadProgress: (callback) => {
            ipcRenderer.on('updater:download-progress', (event, progress) => callback(progress))
        },
        onUpdateDownloaded: (callback) => {
            ipcRenderer.on('updater:update-downloaded', (event, info) => callback(info))
        },
        onError: (callback) => {
            ipcRenderer.on('updater:error', (event, error) => callback(error))
        }
    },

    // 系统信息 API
    getSystemInfo: () => ipcRenderer.invoke('system:getInfo'),
    exportLogs: (content) => ipcRenderer.invoke('system:exportLogs', content)
})

console.log('=== electronAPI exposed successfully ===')
