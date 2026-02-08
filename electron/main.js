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
function createMenu(translations = null) {
    const isMac = process.platform === 'darwin'

    // 默认英文翻译
    const t = translations || {
        app: {
            about: 'About Markpad',
            services: 'Services',
            hide: 'Hide Markpad',
            hideOthers: 'Hide Others',
            unhide: 'Show All',
            quit: 'Quit Markpad'
        },
        file: {
            title: 'File',
            newDocument: 'New Document',
            open: 'Open...',
            save: 'Save',
            saveAs: 'Save As...',
            export: 'Export',
            exportHtml: 'Export as HTML',
            exportPdf: 'Export as PDF',
            exportMarkdown: 'Export as Markdown',
            closeDocument: 'Close Document',
            exit: 'Exit'
        },
        edit: {
            title: 'Edit',
            undo: 'Undo',
            redo: 'Redo',
            cut: 'Cut',
            copy: 'Copy',
            paste: 'Paste',
            selectAll: 'Select All',
            find: 'Find',
            replace: 'Replace'
        },
        view: {
            title: 'View',
            toggleSidebar: 'Toggle Sidebar',
            togglePreview: 'Toggle Preview',
            reload: 'Reload',
            forceReload: 'Force Reload',
            toggleDevTools: 'Toggle Developer Tools',
            actualSize: 'Actual Size',
            zoomIn: 'Zoom In',
            zoomOut: 'Zoom Out',
            toggleFullScreen: 'Toggle Full Screen'
        },
        format: {
            title: 'Format',
            bold: 'Bold',
            italic: 'Italic',
            strikethrough: 'Strikethrough',
            heading1: 'Heading 1',
            heading2: 'Heading 2',
            heading3: 'Heading 3',
            insertLink: 'Insert Link',
            insertImage: 'Insert Image',
            insertCode: 'Insert Code Block',
            insertTable: 'Insert Table'
        },
        help: {
            title: 'Help',
            help: 'Help',
            mathTutorial: 'Math Tutorial',
            documentation: 'Documentation',
            checkUpdates: 'Check for Updates',
            reportIssue: 'Report Issue',
            about: 'About Markpad'
        }
    }

    const template = [
        // macOS 应用菜单
        ...(isMac ? [{
            label: app.name,
            submenu: [
                { role: 'about', label: t.app.about },
                { type: 'separator' },
                { role: 'services', label: t.app.services },
                { type: 'separator' },
                { role: 'hide', label: t.app.hide },
                { role: 'hideOthers', label: t.app.hideOthers },
                { role: 'unhide', label: t.app.unhide },
                { type: 'separator' },
                { role: 'quit', label: t.app.quit }
            ]
        }] : []),
        // File 菜单
        {
            label: t.file.title,
            submenu: [
                {
                    label: t.file.newDocument,
                    accelerator: 'CmdOrCtrl+N',
                    click: () => mainWindow?.webContents.send('menu:new-document')
                },
                { type: 'separator' },
                {
                    label: t.file.open,
                    accelerator: 'CmdOrCtrl+O',
                    click: () => mainWindow?.webContents.send('menu:open-file')
                },
                { type: 'separator' },
                {
                    label: t.file.save,
                    accelerator: 'CmdOrCtrl+S',
                    click: () => mainWindow?.webContents.send('menu:save-file')
                },
                {
                    label: t.file.saveAs,
                    accelerator: 'CmdOrCtrl+Shift+S',
                    click: () => mainWindow?.webContents.send('menu:save-file-as')
                },
                { type: 'separator' },
                {
                    label: t.file.export,
                    submenu: [
                        {
                            label: t.file.exportHtml,
                            click: () => mainWindow?.webContents.send('menu:export-html')
                        },
                        {
                            label: t.file.exportPdf,
                            click: () => mainWindow?.webContents.send('menu:export-pdf')
                        },
                        {
                            label: t.file.exportMarkdown,
                            click: () => mainWindow?.webContents.send('menu:export-markdown')
                        }
                    ]
                },
                { type: 'separator' },
                {
                    label: t.file.closeDocument,
                    accelerator: 'CmdOrCtrl+W',
                    click: () => mainWindow?.webContents.send('menu:close-document')
                },
                ...(!isMac ? [
                    { type: 'separator' },
                    { role: 'quit', label: t.file.exit }
                ] : [])
            ]
        },
        // Edit 菜单
        {
            label: t.edit.title,
            submenu: [
                {
                    label: t.edit.undo,
                    accelerator: 'CmdOrCtrl+Z',
                    click: () => mainWindow?.webContents.send('menu:undo')
                },
                {
                    label: t.edit.redo,
                    accelerator: process.platform === 'darwin' ? 'Cmd+Shift+Z' : 'Ctrl+Y',
                    click: () => mainWindow?.webContents.send('menu:redo')
                },
                { type: 'separator' },
                { role: 'cut', label: t.edit.cut },
                { role: 'copy', label: t.edit.copy },
                { role: 'paste', label: t.edit.paste },
                { role: 'selectAll', label: t.edit.selectAll },
                { type: 'separator' },
                {
                    label: t.edit.find,
                    accelerator: 'CmdOrCtrl+F',
                    click: () => mainWindow?.webContents.send('menu:find')
                },
                {
                    label: t.edit.replace,
                    accelerator: 'CmdOrCtrl+H',
                    click: () => mainWindow?.webContents.send('menu:replace')
                }
            ]
        },
        // View 菜单
        {
            label: t.view.title,
            submenu: [
                {
                    label: t.view.toggleSidebar,
                    accelerator: 'CmdOrCtrl+Shift+B',
                    click: () => mainWindow?.webContents.send('menu:toggle-sidebar')
                },
                {
                    label: t.view.togglePreview,
                    accelerator: 'CmdOrCtrl+Shift+P',
                    click: () => mainWindow?.webContents.send('menu:toggle-preview')
                },
                { type: 'separator' },
                { role: 'reload', label: t.view.reload },
                { role: 'forceReload', label: t.view.forceReload },
                { role: 'toggleDevTools', label: t.view.toggleDevTools },
                { type: 'separator' },
                { role: 'resetZoom', label: t.view.actualSize },
                { role: 'zoomIn', label: t.view.zoomIn },
                { role: 'zoomOut', label: t.view.zoomOut },
                { type: 'separator' },
                { role: 'togglefullscreen', label: t.view.toggleFullScreen }
            ]
        },
        // Format 菜单
        {
            label: t.format.title,
            submenu: [
                {
                    label: t.format.bold,
                    accelerator: 'CmdOrCtrl+B',
                    click: () => mainWindow?.webContents.send('menu:format-bold')
                },
                {
                    label: t.format.italic,
                    accelerator: 'CmdOrCtrl+I',
                    click: () => mainWindow?.webContents.send('menu:format-italic')
                },
                {
                    label: t.format.strikethrough,
                    click: () => mainWindow?.webContents.send('menu:format-strikethrough')
                },
                { type: 'separator' },
                {
                    label: t.format.heading1,
                    click: () => mainWindow?.webContents.send('menu:format-heading', 1)
                },
                {
                    label: t.format.heading2,
                    click: () => mainWindow?.webContents.send('menu:format-heading', 2)
                },
                {
                    label: t.format.heading3,
                    click: () => mainWindow?.webContents.send('menu:format-heading', 3)
                },
                { type: 'separator' },
                {
                    label: t.format.insertLink,
                    click: () => mainWindow?.webContents.send('menu:insert-link')
                },
                {
                    label: t.format.insertImage,
                    click: () => mainWindow?.webContents.send('menu:insert-image')
                },
                {
                    label: t.format.insertCode,
                    click: () => mainWindow?.webContents.send('menu:insert-code')
                },
                {
                    label: t.format.insertTable,
                    click: () => mainWindow?.webContents.send('menu:insert-table')
                }
            ]
        },
        // Help 菜单
        {
            label: t.help.title,
            submenu: [
                {
                    label: t.help.help,
                    accelerator: 'F1',
                    click: () => mainWindow?.webContents.send('menu:help')
                },
                {
                    label: t.help.mathTutorial,
                    accelerator: 'F2',
                    click: () => mainWindow?.webContents.send('menu:math-tutorial')
                },
                {
                    label: t.help.documentation,
                    click: () => shell.openExternal('https://github.com/PythonSmall-Q/Markpad')
                },
                { type: 'separator' },
                {
                    label: t.help.checkUpdates,
                    click: () => mainWindow?.webContents.send('menu:check-updates')
                },
                { type: 'separator' },
                {
                    label: t.help.reportIssue,
                    click: () => shell.openExternal('https://github.com/PythonSmall-Q/Markpad/issues')
                },
                ...(!isMac ? [
                    { type: 'separator' },
                    {
                        label: t.help.about,
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

// 菜单更新
ipcMain.handle('menu:update-translations', (event, translations) => {
    try {
        createMenu(translations)
        return { success: true }
    } catch (error) {
        console.error('Failed to update menu:', error)
        return { success: false, error: error.message }
    }
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

