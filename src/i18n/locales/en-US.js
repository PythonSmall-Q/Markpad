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
        settings: 'Settings',
        search: 'Search',
        themeToggle: 'Toggle Theme',
        exportMarkdown: 'Markdown',
        exportHtml: 'HTML',
        exportPdf: 'PDF',
        exportText: 'Plain Text'
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
            video: 'Insert Video',
            audio: 'Insert Audio',
            table: 'Insert Table',
            inlineMath: 'Inline Formula',
            blockMath: 'Block Formula',
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
            enterFormula: 'Enter Math Formula',
            inlineMath: 'Inline Formula',
            blockMath: 'Block Formula',
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
        },

        features: {
            editor: {
                title: 'Markdown Editing',
                description: 'Live preview and syntax highlighting'
            },
            export: {
                title: 'Multi-format Export',
                description: 'PDF, HTML, and plain text'
            },
            assets: {
                title: 'Asset Insertion',
                description: 'Images, audio, and video support'
            }
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

        update: {
            title: 'Updates',
            autoCheck: 'Auto Check Updates',
            autoDownload: 'Auto Download Updates',
            checking: 'Checking for updates...',
            downloading: 'Downloading update',
            checkFailed: 'Failed to check for updates',
            desktopOnly: 'Updates are available only on desktop',
            updateAvailable: 'A new version is available',
            updateReady: 'Update is ready to install',
            downloadNow: 'Download Now',
            downloadLater: 'Later',
            restartNow: 'Restart Now',
            restartLater: 'Later'
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

    document: {
        save: 'Save',
        dontSave: "Don't Save"
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
        operationFailed: 'Operation failed',
        restoredUnsaved: 'Restored {count} unsaved documents'
    },

    search: {
        title: 'Find',
        replaceTitle: 'Find and Replace',
        findPlaceholder: 'Find',
        replacePlaceholder: 'Replace',
        previous: 'Previous',
        next: 'Next',
        matchCount: '{current} / {total}',
        caseSensitive: 'Match Case',
        wholeWord: 'Match Whole Word',
        useRegex: 'Use Regex',
        replace: 'Replace',
        replaceAll: 'Replace All',
        noMatch: 'No matches found',
        error: 'Search error',
        replaced: 'Replaced {count} occurrences'
    },

    help: {
        title: 'Help',
        quickStart: {
            title: 'Quick Start',
            desc: 'Welcome to Markpad! Follow these steps to get started:',
            step1: 'Click "New" button or press Ctrl+N to create a new document',
            step2: 'Type your Markdown text in the editor',
            step3: 'Use toolbar or shortcuts for formatting',
            step4: 'Save or export your document'
        },
        editor: {
            title: 'Editor Features',
            formatting: 'Text Formatting',
            bold: 'Bold',
            italic: 'Italic',
            strikethrough: 'Strikethrough',
            toolbar: 'Use toolbar',
            lists: 'Lists',
            unordered: 'Unordered list: Click toolbar button',
            ordered: 'Ordered list: Click toolbar button',
            other: 'Other Features',
            links: 'Links: Click toolbar link button',
            images: 'Images: Click toolbar image button',
            tables: 'Tables: Click toolbar table button',
            code: 'Code: Inline code and code blocks'
        },
        shortcuts: {
            title: 'Keyboard Shortcuts',
            action: 'Action',
            key: 'Shortcut',
            newDoc: 'New Document',
            saveDoc: 'Save Document',
            openDoc: 'Open Document',
            bold: 'Bold',
            italic: 'Italic',
            find: 'Find',
            replace: 'Replace',
            undo: 'Undo',
            redo: 'Redo'
        },
        documents: {
            title: 'Document Management',
            desc: 'Markpad supports multiple document management:',
            create: 'Create multiple documents, each with its own tab',
            save: 'Documents are automatically saved to temporary location',
            open: 'Opening files will display as new tabs',
            tabs: 'Quickly switch between documents using tabs'
        },
        export: {
            title: 'Export Functionality',
            desc: 'Export your documents to various formats:',
            html: 'HTML: Complete web page file',
            pdf: 'PDF: Suitable for printing and sharing',
            markdown: 'Markdown: Preserve original format',
            text: 'Plain Text: Remove all formatting'
        },
        faq: {
            title: 'Frequently Asked Questions',
            q1: 'How do I insert an image?',
            a1: 'Click the image button in the toolbar, then select an image. The image path will be automatically inserted into the document.',
            q2: 'Are documents auto-saved?',
            a2: 'Yes, all unsaved documents are automatically saved to a temporary location and will be restored when you reopen the application.',
            q3: 'What Markdown syntax is supported?',
            a3: 'Markpad supports standard CommonMark syntax, including headings, lists, links, images, tables, code blocks, and more.'
        }
    },

    about: {
        title: 'About Markpad',
        version: 'Version',
        description: 'A powerful Markdown notebook application built with Vue 3 and Electron',
        license: 'License',
        github: 'GitHub Repository',
        issues: 'Report Issues',
        tabs: {
            about: 'About',
            system: 'System Info',
            logs: 'Logs'
        },
        system: {
            os: 'Operating System',
            platform: 'Platform',
            arch: 'Architecture',
            node: 'Node Version',
            electron: 'Electron Version',
            chrome: 'Chrome Version',
            memory: 'Total Memory',
            copy: 'Copy Info',
            copied: 'Copied to clipboard',
            copyError: 'Failed to copy',
            loadError: 'Failed to load system information'
        },
        logs: {
            all: 'All',
            info: 'Info',
            success: 'Success',
            warn: 'Warning',
            error: 'Error',
            refresh: 'Refresh',
            clear: 'Clear',
            export: 'Export',
            empty: 'No logs available',
            confirmClear: 'Are you sure you want to clear all logs?',
            clearTitle: 'Clear Logs',
            confirm: 'Confirm',
            cancel: 'Cancel',
            cleared: 'Logs cleared',
            exported: 'Logs exported',
            exportError: 'Failed to export logs'
        }
    }
}
