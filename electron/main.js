import { app, BrowserWindow, ipcMain, dialog, shell } from 'electron'
import updaterPkg from 'electron-updater'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import fs from 'fs/promises'
import { existsSync } from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const { autoUpdater } = updaterPkg

let mainWindow = null
let willQuitApp = false

// 临时文件目录
const tempDir = join(app.getPath('userData'), '.temp')

// 确保临时目录存在
async function ensureTempDir() {
    if (!existsSync(tempDir)) {
        await fs.mkdir(tempDir, { recursive: true })
    }
}

function createWindow() {
    // 设置应用图标路径
    const iconPath = process.platform === 'win32'
        ? join(__dirname, '../build/icons/icon.ico')
        : process.platform === 'darwin'
            ? join(__dirname, '../build/icons/icon.icns')
            : join(__dirname, '../build/icons/512x512.png')

    // 确定 preload 脚本的正确路径
    // 使用 .cjs 扩展名以确保 CommonJS 格式被正确识别
    const preloadPath = join(__dirname, 'preload.cjs')

    console.log('Preload path:', preloadPath)
    console.log('__dirname:', __dirname)
    console.log('app.isPackaged:', app.isPackaged)

    mainWindow = new BrowserWindow({
        width: 1400,
        height: 900,
        minWidth: 800,
        minHeight: 600,
        icon: iconPath,
        webPreferences: {
            preload: preloadPath,
            contextIsolation: true,
            nodeIntegration: false,
            sandbox: false
        },
        show: false,
        backgroundColor: '#ffffff'
    })

    mainWindow.once('ready-to-show', () => {
        mainWindow.show()

        // 诊断信息：检查 preload 是否正确加载
        mainWindow.webContents.executeJavaScript(`
            console.log('=== Electron Environment Check ===');
            console.log('window.electronAPI exists:', typeof window.electronAPI !== 'undefined');
            if (window.electronAPI) {
                console.log('electronAPI methods:', Object.keys(window.electronAPI));
            } else {
                console.error('⚠️ electronAPI is not available! Preload script may not have loaded correctly.');
            }
        `).catch(err => console.error('Failed to check electronAPI:', err))
    })

    // 开发环境加载 Vite 服务器，生产环境加载打包文件
    if (process.env.NODE_ENV === 'development' || !app.isPackaged) {
        mainWindow.loadURL('http://localhost:5175')
        mainWindow.webContents.openDevTools()
    } else {
        // 生产环境：从 app.asar 中加载
        mainWindow.loadFile(join(__dirname, '../dist/index.html'))
    }

    // 拦截窗口关闭事件
    mainWindow.on('close', (e) => {
        if (!willQuitApp) {
            e.preventDefault()
            mainWindow.webContents.send('window:before-close')
        }
    })

    mainWindow.on('closed', () => {
        mainWindow = null
    })
}

app.whenReady().then(async () => {
    await ensureTempDir()
    createWindow()

    // Initialize auto updater
    initAutoUpdater()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

// IPC 处理器 - 文件操作
ipcMain.handle('file:open', async () => {
    const result = await dialog.showOpenDialog(mainWindow, {
        properties: ['openFile'],
        filters: [
            { name: 'Markdown Files', extensions: ['md', 'markdown'] },
            { name: 'Text Files', extensions: ['txt'] },
            { name: 'All Files', extensions: ['*'] }
        ]
    })

    if (!result.canceled && result.filePaths.length > 0) {
        const filePath = result.filePaths[0]
        const content = await fs.readFile(filePath, 'utf-8')
        return { filePath, content }
    }

    return null
})

ipcMain.handle('file:save', async (event, { filePath, content }) => {
    try {
        await fs.writeFile(filePath, content, 'utf-8')
        return { success: true }
    } catch (error) {
        return { success: false, error: error.message }
    }
})

ipcMain.handle('file:saveAs', async (event, { content, defaultName }) => {
    const result = await dialog.showSaveDialog(mainWindow, {
        defaultPath: defaultName || 'untitled.md',
        filters: [
            { name: 'Markdown Files', extensions: ['md'] },
            { name: 'Text Files', extensions: ['txt'] },
            { name: 'All Files', extensions: ['*'] }
        ]
    })

    if (!result.canceled && result.filePath) {
        try {
            await fs.writeFile(result.filePath, content, 'utf-8')
            return { success: true, filePath: result.filePath }
        } catch (error) {
            return { success: false, error: error.message }
        }
    }

    return { success: false, canceled: true }
})

ipcMain.handle('file:read', async (event, filePath) => {
    try {
        const content = await fs.readFile(filePath, 'utf-8')
        return { success: true, content }
    } catch (error) {
        return { success: false, error: error.message }
    }
})

// 资源导入
ipcMain.handle('asset:import', async (event, type) => {
    const filters = {
        image: [{ name: 'Images', extensions: ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'] }],
        video: [{ name: 'Videos', extensions: ['mp4', 'webm', 'ogg'] }],
        audio: [{ name: 'Audio', extensions: ['mp3', 'wav', 'ogg'] }],
        file: [{ name: 'All Files', extensions: ['*'] }]
    }

    const result = await dialog.showOpenDialog(mainWindow, {
        properties: ['openFile'],
        filters: filters[type] || filters.file
    })

    if (!result.canceled && result.filePaths.length > 0) {
        const filePath = result.filePaths[0]
        return { success: true, filePath }
    }

    return { success: false, canceled: true }
})

// 导出功能
ipcMain.handle('export:html', async (event, { content, defaultName }) => {
    const result = await dialog.showSaveDialog(mainWindow, {
        defaultPath: defaultName || 'export.html',
        filters: [{ name: 'HTML Files', extensions: ['html'] }]
    })

    if (!result.canceled && result.filePath) {
        try {
            await fs.writeFile(result.filePath, content, 'utf-8')
            return { success: true, filePath: result.filePath }
        } catch (error) {
            return { success: false, error: error.message }
        }
    }

    return { success: false, canceled: true }
})

ipcMain.handle('export:pdf', async (event, defaultName) => {
    const result = await dialog.showSaveDialog(mainWindow, {
        defaultPath: defaultName || 'export.pdf',
        filters: [{ name: 'PDF Files', extensions: ['pdf'] }]
    })

    if (!result.canceled && result.filePath) {
        try {
            const data = await mainWindow.webContents.printToPDF({
                printBackground: true,
                marginsType: 1
            })
            await fs.writeFile(result.filePath, data)
            return { success: true, filePath: result.filePath }
        } catch (error) {
            return { success: false, error: error.message }
        }
    }

    return { success: false, canceled: true }
})

ipcMain.handle('export:markdown', async (event, { content, defaultName }) => {
    const result = await dialog.showSaveDialog(mainWindow, {
        defaultPath: defaultName || 'export.md',
        filters: [{ name: 'Markdown Files', extensions: ['md'] }]
    })

    if (!result.canceled && result.filePath) {
        try {
            await fs.writeFile(result.filePath, content, 'utf-8')
            return { success: true, filePath: result.filePath }
        } catch (error) {
            return { success: false, error: error.message }
        }
    }

    return { success: false, canceled: true }
})

ipcMain.handle('export:text', async (event, { content, defaultName }) => {
    const result = await dialog.showSaveDialog(mainWindow, {
        defaultPath: defaultName || 'export.txt',
        filters: [{ name: 'Text Files', extensions: ['txt'] }]
    })

    if (!result.canceled && result.filePath) {
        try {
            await fs.writeFile(result.filePath, content, 'utf-8')
            return { success: true, filePath: result.filePath }
        } catch (error) {
            return { success: false, error: error.message }
        }
    }

    return { success: false, canceled: true }
})

// 打开外部链接
ipcMain.handle('shell:openExternal', async (event, url) => {
    await shell.openExternal(url)
})

// 应用设置
ipcMain.handle('settings:get', async () => {
    // 可以从文件或数据库读取设置
    return {
        theme: 'light',
        autoSaveInterval: 60000,
        defaultExportFormat: 'markdown'
    }
})

ipcMain.handle('settings:set', async (event, settings) => {
    // 保存设置到文件或数据库
    return { success: true }
})

// 临时文件管理
ipcMain.handle('temp:save', async (event, { documents }) => {
    try {
        await ensureTempDir()
        const tempFile = join(tempDir, 'unsaved-documents.json')
        await fs.writeFile(tempFile, JSON.stringify(documents, null, 2), 'utf-8')
        return { success: true }
    } catch (error) {
        console.error('Failed to save temp files:', error)
        return { success: false, error: error.message }
    }
})

ipcMain.handle('temp:load', async () => {
    try {
        const tempFile = join(tempDir, 'unsaved-documents.json')
        if (existsSync(tempFile)) {
            const content = await fs.readFile(tempFile, 'utf-8')
            const documents = JSON.parse(content)
            return { success: true, documents }
        }
        return { success: true, documents: [] }
    } catch (error) {
        console.error('Failed to load temp files:', error)
        return { success: false, error: error.message }
    }
})

ipcMain.handle('temp:clear', async () => {
    try {
        const tempFile = join(tempDir, 'unsaved-documents.json')
        if (existsSync(tempFile)) {
            await fs.unlink(tempFile)
        }
        return { success: true }
    } catch (error) {
        console.error('Failed to clear temp files:', error)
        return { success: false, error: error.message }
    }
})

// 窗口关闭确认
ipcMain.on('window:close-confirmed', (event, shouldClose) => {
    if (shouldClose) {
        willQuitApp = true
        if (mainWindow) {
            mainWindow.close()
        }
    }
})

// ==================== Auto Updater ====================

// 配置自动更新
autoUpdater.autoDownload = false // 不自动下载，等用户确认
autoUpdater.autoInstallOnAppQuit = true // 退出时自动安装

function initAutoUpdater() {
    // 仅在生产环境检查更新
    if (process.env.NODE_ENV === 'development' || !app.isPackaged) {
        console.log('Development mode, skipping auto update check')
        return
    }

    // 更新检查错误
    autoUpdater.on('error', (error) => {
        console.error('Update error:', error)
        sendUpdateMessage('error', { error: error.message })
    })

    // 检查更新
    autoUpdater.on('checking-for-update', () => {
        console.log('Checking for updates...')
        sendUpdateMessage('checking')
    })

    // 发现新版本
    autoUpdater.on('update-available', (info) => {
        console.log('Update available:', info)
        sendUpdateMessage('available', {
            version: info.version,
            releaseDate: info.releaseDate,
            releaseName: info.releaseName,
            releaseNotes: info.releaseNotes
        })
    })

    // 没有新版本
    autoUpdater.on('update-not-available', (info) => {
        console.log('Update not available')
        sendUpdateMessage('not-available', { version: info.version })
    })

    // 下载进度
    autoUpdater.on('download-progress', (progressObj) => {
        sendUpdateMessage('download-progress', {
            percent: progressObj.percent,
            transferred: progressObj.transferred,
            total: progressObj.total,
            bytesPerSecond: progressObj.bytesPerSecond
        })
    })

    // 下载完成
    autoUpdater.on('update-downloaded', (info) => {
        console.log('Update downloaded:', info)
        sendUpdateMessage('downloaded', {
            version: info.version,
            releaseDate: info.releaseDate
        })
    })
}

function sendUpdateMessage(action, data = {}) {
    if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.webContents.send('update-message', { action, ...data })
    }
}

// IPC 处理器 - 更新相关
ipcMain.handle('updater:check', async () => {
    if (process.env.NODE_ENV === 'development' || !app.isPackaged) {
        return { success: false, error: 'Updates not available in development mode' }
    }

    try {
        const result = await autoUpdater.checkForUpdates()
        return { success: true, updateInfo: result.updateInfo }
    } catch (error) {
        return { success: false, error: error.message }
    }
})

ipcMain.handle('updater:download', async () => {
    try {
        await autoUpdater.downloadUpdate()
        return { success: true }
    } catch (error) {
        return { success: false, error: error.message }
    }
})

ipcMain.handle('updater:install', () => {
    // 退出并安装更新
    setImmediate(() => autoUpdater.quitAndInstall(false, true))
    return { success: true }
})

ipcMain.handle('updater:get-version', () => {
    return { version: app.getVersion() }
})

