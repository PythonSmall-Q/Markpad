import { app, BrowserWindow, ipcMain, dialog, shell, Menu } from 'electron'
import updaterPkg from 'electron-updater'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import fs from 'fs/promises'
import { existsSync } from 'fs'
import os from 'os'

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

// 创建应用菜单
function createMenu() {
    const isMac = process.platform === 'darwin'

    const template = [
        // macOS 应用菜单
        ...(isMac ? [{
            label: app.name,
            submenu: [
                { role: 'about', label: 'About Markpad' },
                { type: 'separator' },
                { role: 'services' },
                { type: 'separator' },
                { role: 'hide' },
                { role: 'hideOthers' },
                { role: 'unhide' },
                { type: 'separator' },
                { role: 'quit' }
            ]
        }] : []),
        // File 菜单
        {
            label: 'File',
            submenu: [
                {
                    label: 'New Document',
                    accelerator: 'CmdOrCtrl+N',
                    click: () => mainWindow?.webContents.send('menu:new-document')
                },
                { type: 'separator' },
                {
                    label: 'Open...',
                    accelerator: 'CmdOrCtrl+O',
                    click: () => mainWindow?.webContents.send('menu:open-file')
                },
                { type: 'separator' },
                {
                    label: 'Save',
                    accelerator: 'CmdOrCtrl+S',
                    click: () => mainWindow?.webContents.send('menu:save-file')
                },
                {
                    label: 'Save As...',
                    accelerator: 'CmdOrCtrl+Shift+S',
                    click: () => mainWindow?.webContents.send('menu:save-file-as')
                },
                { type: 'separator' },
                {
                    label: 'Export',
                    submenu: [
                        {
                            label: 'Export as HTML',
                            click: () => mainWindow?.webContents.send('menu:export-html')
                        },
                        {
                            label: 'Export as PDF',
                            click: () => mainWindow?.webContents.send('menu:export-pdf')
                        },
                        {
                            label: 'Export as Markdown',
                            click: () => mainWindow?.webContents.send('menu:export-markdown')
                        }
                    ]
                },
                { type: 'separator' },
                {
                    label: 'Close Document',
                    accelerator: 'CmdOrCtrl+W',
                    click: () => mainWindow?.webContents.send('menu:close-document')
                },
                ...(!isMac ? [
                    { type: 'separator' },
                    { role: 'quit', label: 'Exit' }
                ] : [])
            ]
        },
        // Edit 菜单
        {
            label: 'Edit',
            submenu: [
                {
                    label: 'Undo',
                    accelerator: 'CmdOrCtrl+Z',
                    click: () => mainWindow?.webContents.send('menu:undo')
                },
                {
                    label: 'Redo',
                    accelerator: process.platform === 'darwin' ? 'Cmd+Shift+Z' : 'Ctrl+Y',
                    click: () => mainWindow?.webContents.send('menu:redo')
                },
                { type: 'separator' },
                { role: 'cut', label: 'Cut' },
                { role: 'copy', label: 'Copy' },
                { role: 'paste', label: 'Paste' },
                { role: 'selectAll', label: 'Select All' },
                { type: 'separator' },
                {
                    label: 'Find',
                    accelerator: 'CmdOrCtrl+F',
                    click: () => mainWindow?.webContents.send('menu:find')
                },
                {
                    label: 'Replace',
                    accelerator: 'CmdOrCtrl+H',
                    click: () => mainWindow?.webContents.send('menu:replace')
                }
            ]
        },
        // View 菜单
        {
            label: 'View',
            submenu: [
                {
                    label: 'Toggle Sidebar',
                    accelerator: 'CmdOrCtrl+Shift+B',
                    click: () => mainWindow?.webContents.send('menu:toggle-sidebar')
                },
                {
                    label: 'Toggle Preview',
                    accelerator: 'CmdOrCtrl+Shift+P',
                    click: () => mainWindow?.webContents.send('menu:toggle-preview')
                },
                { type: 'separator' },
                { role: 'reload', label: 'Reload' },
                { role: 'forceReload', label: 'Force Reload' },
                { role: 'toggleDevTools', label: 'Toggle Developer Tools' },
                { type: 'separator' },
                { role: 'resetZoom', label: 'Actual Size' },
                { role: 'zoomIn', label: 'Zoom In' },
                { role: 'zoomOut', label: 'Zoom Out' },
                { type: 'separator' },
                { role: 'togglefullscreen', label: 'Toggle Full Screen' }
            ]
        },
        // Format 菜单
        {
            label: 'Format',
            submenu: [
                {
                    label: 'Bold',
                    accelerator: 'CmdOrCtrl+B',
                    click: () => mainWindow?.webContents.send('menu:format-bold')
                },
                {
                    label: 'Italic',
                    accelerator: 'CmdOrCtrl+I',
                    click: () => mainWindow?.webContents.send('menu:format-italic')
                },
                {
                    label: 'Strikethrough',
                    click: () => mainWindow?.webContents.send('menu:format-strikethrough')
                },
                { type: 'separator' },
                {
                    label: 'Heading 1',
                    click: () => mainWindow?.webContents.send('menu:format-heading', 1)
                },
                {
                    label: 'Heading 2',
                    click: () => mainWindow?.webContents.send('menu:format-heading', 2)
                },
                {
                    label: 'Heading 3',
                    click: () => mainWindow?.webContents.send('menu:format-heading', 3)
                },
                { type: 'separator' },
                {
                    label: 'Insert Link',
                    click: () => mainWindow?.webContents.send('menu:insert-link')
                },
                {
                    label: 'Insert Image',
                    click: () => mainWindow?.webContents.send('menu:insert-image')
                },
                {
                    label: 'Insert Code Block',
                    click: () => mainWindow?.webContents.send('menu:insert-code')
                },
                {
                    label: 'Insert Table',
                    click: () => mainWindow?.webContents.send('menu:insert-table')
                }
            ]
        },
        // Help 菜单
        {
            label: 'Help',
            submenu: [
                {
                    label: 'Help',
                    accelerator: 'F1',
                    click: () => mainWindow?.webContents.send('menu:help')
                },
                {
                    label: 'Documentation',
                    click: () => shell.openExternal('https://github.com/PythonSmall-Q/Markpad')
                },
                { type: 'separator' },
                {
                    label: 'Check for Updates',
                    click: () => mainWindow?.webContents.send('menu:check-updates')
                },
                { type: 'separator' },
                {
                    label: 'Report Issue',
                    click: () => shell.openExternal('https://github.com/PythonSmall-Q/Markpad/issues')
                },
                ...(!isMac ? [
                    { type: 'separator' },
                    {
                        label: 'About Markpad',
                        click: () => mainWindow?.webContents.send('menu:about')
                    }
                ] : [])
            ]
        }
    ]

    const menu = Menu.buildFromTemplate(template)
    Menu.setApplicationMenu(menu)
}

app.whenReady().then(async () => {
    await ensureTempDir()
    createWindow()
    createMenu()

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
            { name: 'All Supported Files', extensions: ['md', 'markdown', 'txt'] },
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

// 获取系统信息
ipcMain.handle('system:getInfo', async () => {
    return {
        os: `${os.type()} ${os.release()}`,
        platform: process.platform,
        arch: process.arch,
        nodeVersion: process.versions.node,
        electronVersion: process.versions.electron,
        chromeVersion: process.versions.chrome,
        totalMemory: `${(os.totalmem() / 1024 / 1024 / 1024).toFixed(2)} GB`
    }
})

// 导出日志
ipcMain.handle('system:exportLogs', async (event, content) => {
    const result = await dialog.showSaveDialog(mainWindow, {
        defaultPath: `markpad-logs-${Date.now()}.txt`,
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

    // 使用 GitHub Releases 作为更新源
    console.log('Using GitHub Releases for auto-updates')

    // 更新检查错误
    autoUpdater.on('error', (error) => {
        console.error('Update error:', error)
        if (mainWindow && !mainWindow.isDestroyed()) {
            mainWindow.webContents.send('updater:error', { error: error.message })
        }
    })

    // 检查更新
    autoUpdater.on('checking-for-update', () => {
        console.log('Checking for updates...')
        if (mainWindow && !mainWindow.isDestroyed()) {
            mainWindow.webContents.send('updater:checking')
        }
    })

    // 发现新版本
    autoUpdater.on('update-available', (info) => {
        console.log('Update available:', info)
        if (mainWindow && !mainWindow.isDestroyed()) {
            mainWindow.webContents.send('updater:update-available', {
                version: info.version,
                releaseDate: info.releaseDate,
                releaseName: info.releaseName,
                releaseNotes: info.releaseNotes
            })
        }
    })

    // 没有新版本
    autoUpdater.on('update-not-available', (info) => {
        console.log('Update not available')
        if (mainWindow && !mainWindow.isDestroyed()) {
            mainWindow.webContents.send('updater:not-available', { version: info.version })
        }
    })

    // 下载进度
    autoUpdater.on('download-progress', (progressObj) => {
        if (mainWindow && !mainWindow.isDestroyed()) {
            mainWindow.webContents.send('updater:download-progress', {
                percent: progressObj.percent,
                transferred: progressObj.transferred,
                total: progressObj.total,
                bytesPerSecond: progressObj.bytesPerSecond
            })
        }
    })

    // 下载完成
    autoUpdater.on('update-downloaded', (info) => {
        console.log('Update downloaded:', info)
        if (mainWindow && !mainWindow.isDestroyed()) {
            mainWindow.webContents.send('updater:update-downloaded', {
                version: info.version,
                releaseDate: info.releaseDate
            })
        }
    })
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

// 系统信息
ipcMain.handle('system:get-info', () => {
    return {
        platform: process.platform,
        platformName: getPlatformName(),
        arch: process.arch,
        appVersion: app.getVersion(),
        electronVersion: process.versions.electron,
        nodeVersion: process.versions.node,
        chromeVersion: process.versions.chrome,
        v8Version: process.versions.v8,
        osRelease: os.release(),
        osType: os.type(),
        totalMemory: os.totalmem(),
        freeMemory: os.freemem()
    }
})

function getPlatformName() {
    switch (process.platform) {
        case 'win32':
            return 'Windows'
        case 'darwin':
            return 'macOS'
        case 'linux':
            return 'Linux'
        default:
            return process.platform
    }
}

