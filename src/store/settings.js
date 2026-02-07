import { defineStore } from 'pinia'
import { ref } from 'vue'
import i18n from '@/i18n'

export const useSettingsStore = defineStore('settings', () => {
    // State
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
    const defaultFileName = ref(i18n.global.t('editor.untitled'))
    const fileExtension = ref('.md')
    const recentFilesLimit = ref(20)
    const autoCheckUpdates = ref(true)
    const autoDownloadUpdates = ref(false)

    // Methods
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
        // Remove duplicates
        const index = recentFiles.value.indexOf(filePath)
        if (index !== -1) {
            recentFiles.value.splice(index, 1)
        }

        // Add to beginning
        recentFiles.value.unshift(filePath)

        // Limit to max 10 items
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
        // If current file count exceeds limit, truncate
        if (recentFiles.value.length > limit) {
            recentFiles.value = recentFiles.value.slice(0, limit)
        }
        saveSettings()
    }

    function setAutoCheckUpdates(value) {
        autoCheckUpdates.value = value
        saveSettings()
    }

    function setAutoDownloadUpdates(value) {
        autoDownloadUpdates.value = value
        saveSettings()
    }

    function resetSettings() {
        theme.value = 'light'
        locale.value = 'zh-CN'
        autoSaveInterval.value = 5
        defaultExportFormat.value = 'markdown'
        autoCheckUpdates.value = true
        autoDownloadUpdates.value = false
        fontSize.value = 14
        lineHeight.value = 1.6
        showPreview.value = true
        editorWidth.value = 'normal'
        autoSave.value = true
        showLineNumbers.value = true
        syntaxHighlight.value = true
        defaultFileName.value = i18n.global.t('editor.untitled')
        fileExtension.value = '.md'
        recentFilesLimit.value = 20
        saveSettings()
    }

    function setLocale(newLocale) {
        locale.value = newLocale
        localStorage.setItem('markpad-locale', newLocale)
        saveSettings()
    }

    // Save settings to localStorage
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
            recentFilesLimit: recentFilesLimit.value,
            autoCheckUpdates: autoCheckUpdates.value,
            autoDownloadUpdates: autoDownloadUpdates.value
        }

        localStorage.setItem('markpad-settings', JSON.stringify(settings))

        // Also save to Electron
        if (window.electronAPI) {
            window.electronAPI.setSettings(settings)
        }
    }

    // Load settings from localStorage
    function loadSettings() {
        const saved = localStorage.getItem('markpad-settings')
        if (saved) {
            try {
                const settings = JSON.parse(saved)
                theme.value = settings.theme || 'light'
                // Use locale from markpad-locale if available, otherwise from settings
                locale.value = settings.locale || localStorage.getItem('markpad-locale') || 'zh-CN'
                autoSaveInterval.value = settings.autoSaveInterval || 5
                defaultExportFormat.value = settings.defaultExportFormat || 'markdown'
                recentFiles.value = settings.recentFiles || []
                fontSize.value = settings.fontSize || 14
                lineHeight.value = settings.lineHeight || 1.6
                showPreview.value = settings.showPreview !== undefined ? settings.showPreview : true
                editorWidth.value = settings.editorWidth || 'normal'
                autoSave.value = settings.autoSave !== undefined ? settings.autoSave : true
                showLineNumbers.value = settings.showLineNumbers !== undefined ? settings.showLineNumbers : true
                autoCheckUpdates.value = settings.autoCheckUpdates !== undefined ? settings.autoCheckUpdates : true
                autoDownloadUpdates.value = settings.autoDownloadUpdates !== undefined ? settings.autoDownloadUpdates : false
                syntaxHighlight.value = settings.syntaxHighlight !== undefined ? settings.syntaxHighlight : true
                defaultFileName.value = settings.defaultFileName || i18n.global.t('editor.untitled')
                fileExtension.value = settings.fileExtension || '.md'
                recentFilesLimit.value = settings.recentFilesLimit || 20
            } catch (error) {
                console.error('Failed to load settings:', error)
            }
        } else {
            // First time loading, use auto-detected locale
            locale.value = localStorage.getItem('markpad-locale') || 'zh-CN'
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
        autoCheckUpdates,
        autoDownloadUpdates,
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
        setAutoCheckUpdates,
        setAutoDownloadUpdates,
        resetSettings,
        saveSettings,
        loadSettings
    }
})
