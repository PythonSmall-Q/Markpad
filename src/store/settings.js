import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSettingsStore = defineStore('settings', () => {
    // 状态
    const theme = ref('light')
    const locale = ref('zh-CN')
    const autoSaveInterval = ref(5)
    const defaultExportFormat = ref('markdown')
    const recentFiles = ref([])
    const fontSize = ref(14)
    const lineHeight = ref(1.6)
    const showPreview = ref(true)
    const editorWidth = ref('normal')
    const autoSave = ref(true)
    const showLineNumbers = ref(true)
    const syntaxHighlight = ref(true)
    const defaultFileName = ref('未命名文档')
    const fileExtension = ref('.md')
    const recentFilesLimit = ref(20)

    // 方法
    function setTheme(newTheme) {
        theme.value = newTheme
        saveSettings()
    }

    function toggleTheme() {
        theme.value = theme.value === 'light' ? 'dark' : 'light'
        saveSettings()
    }

    function setAutoSaveInterval(interval) {
        autoSaveInterval.value = interval
        saveSettings()
    }

    function setDefaultExportFormat(format) {
        defaultExportFormat.value = format
        saveSettings()
    }

    function addRecentFile(filePath) {
        // 移除重复项
        const index = recentFiles.value.indexOf(filePath)
        if (index !== -1) {
            recentFiles.value.splice(index, 1)
        }

        // 添加到开头
        recentFiles.value.unshift(filePath)

        // 限制最多 10 个
        if (recentFiles.value.length > 10) {
            recentFiles.value.pop()
        }

        saveSettings()
    }

    function removeRecentFile(filePath) {
        const index = recentFiles.value.indexOf(filePath)
        if (index !== -1) {
            recentFiles.value.splice(index, 1)
            saveSettings()
        }
    }

    function clearRecentFiles() {
        recentFiles.value = []
        saveSettings()
    }

    function setFontSize(size) {
        fontSize.value = size
        saveSettings()
    }

    function setLineHeight(height) {
        lineHeight.value = height
        saveSettings()
    }

    function togglePreview() {
        showPreview.value = !showPreview.value
        saveSettings()
    }

    function setShowPreview(value) {
        showPreview.value = value
        saveSettings()
    }

    function setEditorWidth(width) {
        editorWidth.value = width
        saveSettings()
    }

    function setAutoSave(value) {
        autoSave.value = value
        saveSettings()
    }

    function setShowLineNumbers(value) {
        showLineNumbers.value = value
        saveSettings()
    }

    function setSyntaxHighlight(value) {
        syntaxHighlight.value = value
        saveSettings()
    }

    function setDefaultFileName(name) {
        defaultFileName.value = name
        saveSettings()
    }

    function setFileExtension(ext) {
        fileExtension.value = ext
        saveSettings()
    }

    function setRecentFilesLimit(limit) {
        recentFilesLimit.value = limit
        // 如果当前文件数超过限制，截断
        if (recentFiles.value.length > limit) {
            recentFiles.value = recentFiles.value.slice(0, limit)
        }
        saveSettings()
    }

    function resetSettings() {
        theme.value = 'light'
        locale.value = 'zh-CN'
        autoSaveInterval.value = 5
        defaultExportFormat.value = 'markdown'
        fontSize.value = 14
        lineHeight.value = 1.6
        showPreview.value = true
        editorWidth.value = 'normal'
        autoSave.value = true
        showLineNumbers.value = true
        syntaxHighlight.value = true
        defaultFileName.value = '未命名文档'
        fileExtension.value = '.md'
        recentFilesLimit.value = 20
        saveSettings()
    }

    function setLocale(newLocale) {
        locale.value = newLocale
        localStorage.setItem('markpad-locale', newLocale)
        saveSettings()
    }

    // 保存设置到 localStorage
    function saveSettings() {
        const settings = {
            theme: theme.value,
            locale: locale.value,
            autoSaveInterval: autoSaveInterval.value,
            defaultExportFormat: defaultExportFormat.value,
            recentFiles: recentFiles.value,
            fontSize: fontSize.value,
            lineHeight: lineHeight.value,
            showPreview: showPreview.value,
            editorWidth: editorWidth.value,
            autoSave: autoSave.value,
            showLineNumbers: showLineNumbers.value,
            syntaxHighlight: syntaxHighlight.value,
            defaultFileName: defaultFileName.value,
            fileExtension: fileExtension.value,
            recentFilesLimit: recentFilesLimit.value
        }

        localStorage.setItem('markpad-settings', JSON.stringify(settings))

        // 同时保存到 Electron
        if (window.electronAPI) {
            window.electronAPI.setSettings(settings)
        }
    }

    // 从 localStorage 加载设置
    function loadSettings() {
        const saved = localStorage.getItem('markpad-settings')
        if (saved) {
            try {
                const settings = JSON.parse(saved)
                theme.value = settings.theme || 'light'
                locale.value = settings.locale || 'zh-CN'
                autoSaveInterval.value = settings.autoSaveInterval || 5
                defaultExportFormat.value = settings.defaultExportFormat || 'markdown'
                recentFiles.value = settings.recentFiles || []
                fontSize.value = settings.fontSize || 14
                lineHeight.value = settings.lineHeight || 1.6
                showPreview.value = settings.showPreview !== undefined ? settings.showPreview : true
                editorWidth.value = settings.editorWidth || 'normal'
                autoSave.value = settings.autoSave !== undefined ? settings.autoSave : true
                showLineNumbers.value = settings.showLineNumbers !== undefined ? settings.showLineNumbers : true
                syntaxHighlight.value = settings.syntaxHighlight !== undefined ? settings.syntaxHighlight : true
                defaultFileName.value = settings.defaultFileName || '未命名文档'
                fileExtension.value = settings.fileExtension || '.md'
                recentFilesLimit.value = settings.recentFilesLimit || 20
            } catch (error) {
                console.error('Failed to load settings:', error)
            }
        }
    }

    return {
        theme,
        locale,
        autoSaveInterval,
        defaultExportFormat,
        recentFiles,
        fontSize,
        lineHeight,
        showPreview,
        editorWidth,
        autoSave,
        showLineNumbers,
        syntaxHighlight,
        defaultFileName,
        fileExtension,
        recentFilesLimit,
        setTheme,
        toggleTheme,
        setLocale,
        setAutoSaveInterval,
        setDefaultExportFormat,
        addRecentFile,
        removeRecentFile,
        clearRecentFiles,
        setFontSize,
        setLineHeight,
        togglePreview,
        setShowPreview,
        setEditorWidth,
        setAutoSave,
        setShowLineNumbers,
        setSyntaxHighlight,
        setDefaultFileName,
        setFileExtension,
        setRecentFilesLimit,
        resetSettings,
        saveSettings,
        loadSettings
    }
})
