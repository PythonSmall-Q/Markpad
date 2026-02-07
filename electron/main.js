import { app, BrowserWindow, ipcMain, dialog, shell } from 'electron'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import fs from 'fs/promises'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

let mainWindow = null

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1400,
        height: 900,
        minWidth: 800,
        minHeight: 600,
        webPreferences: {
            preload: join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false
        },
        show: false,
        backgroundColor: '#ffffff'
    })

    mainWindow.once('ready-to-show', () => {
        mainWindow.show()
    })

    // 开发环境加载 Vite 服务器，生产环境加载打包文件
    if (process.env.NODE_ENV === 'development') {
        mainWindow.loadURL('http://localhost:5173')
        mainWindow.webContents.openDevTools()
    } else {
        mainWindow.loadFile(join(__dirname, '../dist/index.html'))
    }

    mainWindow.on('closed', () => {
        mainWindow = null
    })
}

app.whenReady().then(() => {
    createWindow()

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
