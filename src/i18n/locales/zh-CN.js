export default {
    app: {
        name: 'Markpad',
        description: '强大的 Markdown 笔记本应用'
    },

    menu: {
        file: '文件',
        edit: '编辑',
        view: '视图',
        help: '帮助'
    },

    header: {
        new: '新建',
        open: '打开',
        save: '保存',
        saveAs: '另存为',
        export: '导出',
        settings: '设置'
    },

    sidebar: {
        files: '文件',
        recentFiles: '最近打开',
        openDocuments: '已打开',
        noRecentFiles: '暂无最近文件',
        noDocuments: '暂无文档',
        settings: '设置'
    },

    editor: {
        toolbar: {
            bold: '加粗',
            italic: '斜体',
            strikethrough: '删除线',
            heading: '标题',
            unorderedList: '无序列表',
            orderedList: '有序列表',
            quote: '引用',
            inlineCode: '行内代码',
            codeBlock: '代码块',
            link: '插入链接',
            image: '插入图片',
            table: '插入表格',
            hr: '分隔线',
            preview: '预览',
            hidePreview: '隐藏预览',
            showPreview: '显示预览'
        },

        placeholder: '开始编写...',
        untitled: '未命名文档',

        dialog: {
            insertLink: '插入链接',
            linkUrl: '链接地址',
            linkText: '链接文本',
            invalidUrl: '请输入有效的链接地址',
            confirm: '确定',
            cancel: '取消'
        }
    },

    welcome: {
        title: '欢迎使用 Markpad',
        subtitle: '开始你的 Markdown 之旅',
        newDocument: '新建文档',
        openFile: '打开文件',
        recentFiles: '最近文件',
        shortcuts: '快捷键',

        shortcutList: {
            newDoc: '新建文档',
            open: '打开文件',
            save: '保存',
            saveAs: '另存为',
            close: '关闭文档',
            bold: '加粗',
            italic: '斜体',
            find: '查找',
            replace: '替换',
            settings: '设置'
        }
    },

    settings: {
        title: '设置',
        close: '关闭',
        save: '保存设置',
        reset: '恢复默认设置',
        resetConfirm: '确定要恢复默认设置吗？此操作无法撤销。',
        resetSuccess: '已恢复默认设置',
        saveSuccess: '设置已保存',

        appearance: {
            title: '外观',
            theme: '主题',
            themeLight: '浅色',
            themeDark: '深色',
            themeAuto: '跟随系统',
            fontSize: '字体大小',
            editorWidth: '编辑器宽度',
            widthNormal: '正常',
            widthWide: '宽屏',
            widthFull: '全宽'
        },

        editor: {
            title: '编辑器',
            defaultPreview: '默认预览模式',
            autoSave: '自动保存',
            autoSaveInterval: '自动保存间隔',
            seconds: '秒',
            showLineNumbers: '行号',
            syntaxHighlight: '代码高亮',
            show: '显示',
            hide: '隐藏',
            enable: '开启',
            disable: '关闭'
        },

        file: {
            title: '文件',
            defaultFileName: '默认文件名',
            fileExtension: '文件扩展名',
            recentFilesLimit: '最近文件数量'
        },

        language: {
            title: '语言',
            selectLanguage: '选择语言',
            zhCN: '简体中文',
            enUS: 'English'
        },

        shortcuts: {
            title: '快捷键',
            action: '操作',
            key: '快捷键'
        },

        about: {
            title: '关于',
            version: '版本',
            description: '一个强大的 Markdown 笔记本应用',
            checkUpdate: '检查更新',
            latestVersion: '当前已是最新版本',
            github: 'GitHub',
            docs: '文档',
            docsComingSoon: '文档功能开发中...'
        }
    },

    export: {
        title: '导出',
        format: '格式',
        pdf: 'PDF',
        html: 'HTML',
        markdown: 'Markdown',
        text: '纯文本',
        exportSuccess: '导出成功',
        exportFailed: '导出失败'
    },

    dialog: {
        confirm: '确认',
        warning: '警告',
        error: '错误',
        info: '提示',
        ok: '确定',
        cancel: '取消',
        yes: '是',
        no: '否'
    },

    messages: {
        fileOpened: '文件已打开',
        fileSaved: '文件已保存',
        fileNotFound: '无法打开文件',
        saveFailed: '保存失败',
        openFailed: '打开文件失败',
        unsavedChanges: '文档有未保存的修改',
        deleteConfirm: '确定要删除吗？',
        operationSuccess: '操作成功',
        operationFailed: '操作失败'
    }
}
