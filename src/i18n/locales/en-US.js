export default {
    app: {
        name: 'Markpad',
        description: 'A powerful Markdown notebook application'
    },

    menu: {
        file: 'File',
        edit: 'Edit',
        view: 'View',
        help: 'Help'
    },

    header: {
        new: 'New',
        open: 'Open',
        save: 'Save',
        saveAs: 'Save As',
        export: 'Export',
        settings: 'Settings'
    },

    sidebar: {
        files: 'Files',
        recentFiles: 'Recent Files',
        openDocuments: 'Open Documents',
        noRecentFiles: 'No recent files',
        noDocuments: 'No documents',
        settings: 'Settings'
    },

    editor: {
        toolbar: {
            bold: 'Bold',
            italic: 'Italic',
            strikethrough: 'Strikethrough',
            heading: 'Heading',
            unorderedList: 'Unordered List',
            orderedList: 'Ordered List',
            quote: 'Quote',
            inlineCode: 'Inline Code',
            codeBlock: 'Code Block',
            link: 'Insert Link',
            image: 'Insert Image',
            table: 'Insert Table',
            hr: 'Horizontal Rule',
            preview: 'Preview',
            hidePreview: 'Hide Preview',
            showPreview: 'Show Preview'
        },

        placeholder: 'Start writing...',
        untitled: 'Untitled Document',

        dialog: {
            insertLink: 'Insert Link',
            linkUrl: 'Link URL',
            linkText: 'Link Text',
            invalidUrl: 'Please enter a valid URL',
            confirm: 'Confirm',
            cancel: 'Cancel'
        }
    },

    welcome: {
        title: 'Welcome to Markpad',
        subtitle: 'Start your Markdown journey',
        newDocument: 'New Document',
        openFile: 'Open File',
        recentFiles: 'Recent Files',
        shortcuts: 'Keyboard Shortcuts',

        shortcutList: {
            newDoc: 'New Document',
            open: 'Open File',
            save: 'Save',
            saveAs: 'Save As',
            close: 'Close Document',
            bold: 'Bold',
            italic: 'Italic',
            find: 'Find',
            replace: 'Replace',
            settings: 'Settings'
        }
    },

    settings: {
        title: 'Settings',
        close: 'Close',
        save: 'Save Settings',
        reset: 'Reset to Defaults',
        resetConfirm: 'Are you sure you want to reset all settings to defaults? This action cannot be undone.',
        resetSuccess: 'Settings have been reset to defaults',
        saveSuccess: 'Settings saved',

        appearance: {
            title: 'Appearance',
            theme: 'Theme',
            themeLight: 'Light',
            themeDark: 'Dark',
            themeAuto: 'Auto',
            fontSize: 'Font Size',
            editorWidth: 'Editor Width',
            widthNormal: 'Normal',
            widthWide: 'Wide',
            widthFull: 'Full'
        },

        editor: {
            title: 'Editor',
            defaultPreview: 'Default Preview Mode',
            autoSave: 'Auto Save',
            autoSaveInterval: 'Auto Save Interval',
            seconds: 'seconds',
            showLineNumbers: 'Line Numbers',
            syntaxHighlight: 'Syntax Highlight',
            show: 'Show',
            hide: 'Hide',
            enable: 'Enable',
            disable: 'Disable'
        },

        file: {
            title: 'File',
            defaultFileName: 'Default File Name',
            fileExtension: 'File Extension',
            recentFilesLimit: 'Recent Files Limit'
        },

        language: {
            title: 'Language',
            selectLanguage: 'Select Language',
            zhCN: '简体中文',
            enUS: 'English'
        },

        shortcuts: {
            title: 'Keyboard Shortcuts',
            action: 'Action',
            key: 'Key'
        },

        about: {
            title: 'About',
            version: 'Version',
            description: 'A powerful Markdown notebook application',
            checkUpdate: 'Check for Updates',
            latestVersion: 'You are using the latest version',
            github: 'GitHub',
            docs: 'Documentation',
            docsComingSoon: 'Documentation coming soon...'
        }
    },

    export: {
        title: 'Export',
        format: 'Format',
        pdf: 'PDF',
        html: 'HTML',
        markdown: 'Markdown',
        text: 'Plain Text',
        exportSuccess: 'Exported successfully',
        exportFailed: 'Export failed'
    },

    dialog: {
        confirm: 'Confirm',
        warning: 'Warning',
        error: 'Error',
        info: 'Info',
        ok: 'OK',
        cancel: 'Cancel',
        yes: 'Yes',
        no: 'No'
    },

    messages: {
        fileOpened: 'File opened',
        fileSaved: 'File saved',
        fileNotFound: 'Cannot open file',
        saveFailed: 'Save failed',
        openFailed: 'Failed to open file',
        unsavedChanges: 'Document has unsaved changes',
        deleteConfirm: 'Are you sure you want to delete?',
        operationSuccess: 'Operation successful',
        operationFailed: 'Operation failed'
    }
}
