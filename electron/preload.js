import { contextBridge, ipcRenderer } from 'electron'

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
    setSettings: (settings) => ipcRenderer.invoke('settings:set', settings)
})
