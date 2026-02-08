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

    menuBar: {
        app: {
            about: '关于 Markpad',
            services: '服务',
            hide: '隐藏 Markpad',
            hideOthers: '隐藏其他',
            unhide: '全部显示',
            quit: '退出 Markpad'
        },
        file: {
            title: '文件',
            newDocument: '新建文档',
            open: '打开...',
            save: '保存',
            saveAs: '另存为...',
            export: '导出',
            exportHtml: '导出为 HTML',
            exportPdf: '导出为 PDF',
            exportMarkdown: '导出为 Markdown',
            closeDocument: '关闭文档',
            exit: '退出'
        },
        edit: {
            title: '编辑',
            undo: '撤销',
            redo: '重做',
            cut: '剪切',
            copy: '复制',
            paste: '粘贴',
            selectAll: '全选',
            find: '查找',
            replace: '替换'
        },
        view: {
            title: '查看',
            toggleSidebar: '切换侧边栏',
            togglePreview: '切换预览',
            reload: '重新加载',
            forceReload: '强制重新加载',
            toggleDevTools: '切换开发者工具',
            actualSize: '实际大小',
            zoomIn: '放大',
            zoomOut: '缩小',
            toggleFullScreen: '切换全屏'
        },
        format: {
            title: '格式',
            bold: '加粗',
            italic: '斜体',
            strikethrough: '删除线',
            heading1: '标题 1',
            heading2: '标题 2',
            heading3: '标题 3',
            insertLink: '插入链接',
            insertImage: '插入图片',
            insertCode: '插入代码块',
            insertTable: '插入表格'
        },
        help: {
            title: '帮助',
            help: '帮助',
            mathTutorial: '数学公式教程',
            documentation: '文档',
            checkUpdates: '检查更新',
            reportIssue: '报告问题',
            about: '关于 Markpad'
        }
    },

    header: {
        new: '新建',
        open: '打开',
        save: '保存',
        saveAs: '另存为',
        export: '导出',
        settings: '设置',
        search: '搜索',
        themeToggle: '切换主题',
        exportMarkdown: 'Markdown',
        exportHtml: 'HTML',
        exportPdf: 'PDF',
        exportText: '纯文本'
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
            video: '插入视频',
            audio: '插入音频',
            table: '插入表格',
            inlineMath: '行内公式',
            blockMath: '块级公式',
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
            enterFormula: '输入数学公式',
            inlineMath: '行内公式',
            blockMath: '块级公式',
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
        },

        features: {
            editor: {
                title: 'Markdown 编辑',
                description: '实时预览、语法高亮'
            },
            export: {
                title: '多格式导出',
                description: 'PDF、HTML、纯文本'
            },
            assets: {
                title: '文件插入',
                description: '图片、音视频支持'
            }
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
            autoComplete: '自动补全',
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

        update: {
            title: '更新',
            autoCheck: '自动检查更新',
            autoDownload: '自动下载更新',
            checking: '正在检查更新...',
            downloading: '正在下载更新',
            checkFailed: '检查更新失败',
            desktopOnly: '更新功能仅在桌面版可用',
            updateAvailable: '发现新版本',
            updateReady: '更新已准备完成',
            downloadNow: '立即下载',
            downloadLater: '稍后提醒',
            restartNow: '立即重启',
            restartLater: '稍后重启'
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

    document: {
        save: '保存',
        dontSave: '不保存'
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
        operationFailed: '操作失败',
        restoredUnsaved: '已恢复 {count} 个未保存的文档'
    },

    search: {
        title: '查找',
        replaceTitle: '查找和替换',
        findPlaceholder: '查找',
        replacePlaceholder: '替换',
        previous: '上一个',
        next: '下一个',
        matchCount: '{current} / {total}',
        caseSensitive: '区分大小写',
        wholeWord: '全词匹配',
        useRegex: '使用正则',
        replace: '替换',
        replaceAll: '全部替换',
        noMatch: '未找到匹配项',
        error: '搜索错误',
        replaced: '已替换 {count} 处'
    },

    help: {
        title: '帮助',
        quickStart: {
            title: '快速开始',
            desc: '欢迎使用 Markpad！按照以下步骤开始使用：',
            step1: '点击"新建"按钮或按 Ctrl+N 创建新文档',
            step2: '在编辑器中输入 Markdown 文本',
            step3: '使用工具栏或快捷键进行格式化',
            step4: '保存或导出你的文档'
        },
        editor: {
            title: '编辑器功能',
            formatting: '文本格式化',
            bold: '加粗',
            italic: '斜体',
            strikethrough: '删除线',
            toolbar: '使用工具栏',
            lists: '列表',
            unordered: '无序列表：点击工具栏按钮',
            ordered: '有序列表：点击工具栏按钮',
            other: '其他功能',
            links: '链接：点击工具栏链接按钮',
            images: '图片：点击工具栏图片按钮',
            tables: '表格：点击工具栏表格按钮',
            code: '代码：行内代码和代码块'
        },
        shortcuts: {
            title: '快捷键',
            action: '操作',
            key: '快捷键',
            newDoc: '新建文档',
            saveDoc: '保存文档',
            openDoc: '打开文档',
            bold: '加粗',
            italic: '斜体',
            find: '查找',
            replace: '替换',
            undo: '撤销',
            redo: '重做'
        },
        documents: {
            title: '文档管理',
            desc: 'Markpad 支持多文档管理：',
            create: '创建多个文档，每个文档都有独立的标签页',
            save: '文档会自动保存到临时位置',
            open: '打开文件将作为新标签页显示',
            tabs: '通过标签页快速切换文档'
        },
        export: {
            title: '导出功能',
            desc: '导出你的文档为多种格式：',
            html: 'HTML：完整的网页文件',
            pdf: 'PDF：适合打印和分享',
            markdown: 'Markdown：保留原始格式',
            text: '纯文本：移除所有格式'
        },
        faq: {
            title: '常见问题',
            q1: '如何插入图片？',
            a1: '点击工具栏的图片按钮，然后选择一张图片。图片路径会自动插入到文档中。',
            q2: '文档会自动保存吗？',
            a2: '是的，所有未保存的文档会自动保存到临时位置，下次打开应用时会自动恢复。',
            q3: '支持哪些 Markdown 语法？',
            a3: 'Markpad 支持标准的 CommonMark 语法，包括标题、列表、链接、图片、表格、代码块等。'
        }
    },

    about: {
        title: '关于 Markpad',
        version: '版本',
        description: '一个强大的 Markdown 笔记本应用，使用 Vue 3 和 Electron 构建',
        license: '许可证',
        github: 'GitHub 仓库',
        issues: '问题反馈',
        tabs: {
            about: '关于',
            system: '系统信息',
            logs: '日志'
        },
        system: {
            os: '操作系统',
            platform: '平台',
            arch: '架构',
            node: 'Node 版本',
            electron: 'Electron 版本',
            chrome: 'Chrome 版本',
            memory: '总内存',
            copy: '复制信息',
            copied: '已复制到剪贴板',
            copyError: '复制失败',
            loadError: '加载系统信息失败'
        },
        logs: {
            all: '全部',
            info: '信息',
            success: '成功',
            warn: '警告',
            error: '错误',
            refresh: '刷新',
            clear: '清空',
            export: '导出',
            empty: '暂无日志',
            confirmClear: '确定要清空所有日志吗？',
            clearTitle: '清空日志',
            confirm: '确定',
            cancel: '取消',
            cleared: '日志已清空',
            exported: '日志已导出',
            exportError: '导出日志失败'
        }
    },

    mathTutorial: {
        title: '数学公式教程',
        basics: {
            title: '基础语法',
            desc: 'LaTeX 数学公式支持行内和块级两种形式',
            inline: {
                title: '行内公式'
            },
            block: {
                title: '块级公式'
            }
        },
        symbols: {
            title: '常用符号',
            name: '名称',
            code: '代码',
            result: '结果',
            greek: {
                title: '希腊字母'
            },
            operators: {
                title: '运算符'
            }
        },
        fractions: {
            title: '分数和根式',
            fraction: {
                title: '分数'
            },
            root: {
                title: '根式'
            }
        },
        scripts: {
            title: '上下标',
            superscript: {
                title: '上标'
            },
            subscript: {
                title: '下标'
            }
        },
        functions: {
            title: '函数',
            trig: {
                title: '三角函数'
            },
            log: {
                title: '对数'
            },
            limits: {
                title: '极限'
            }
        },
        matrices: {
            title: '矩阵',
            bracket: {
                title: '圆括号矩阵'
            },
            square: {
                title: '方括号矩阵'
            },
            determinant: {
                title: '行列式'
            }
        },
        equations: {
            title: '方程组',
            system: {
                title: '方程组'
            },
            align: {
                title: '对齐'
            }
        },
        examples: {
            title: '常用公式示例',
            quadratic: '二次方程',
            integral: '积分',
            summation: '求和',
            limit: '极限',
            matrix: '矩阵',
            system: '方程组',
            derivative: '导数',
            partial: '偏导数',
            vector: '向量',
            set: '集合',
            logic: '逻辑',
            copy: '复制',
            copied: '已复制'
        }
    },

    statusBar: {
        lines: '行数',
        words: '词数',
        chars: '字符',
        readTime: '阅读时间',
        minute: '分钟',
        minutes: '分钟',
        lessThanMinute: '不到 1 分钟',
        outline: '大纲'
    },

    outline: {
        title: '文档大纲',
        empty: '没有找到标题',
        jumpTo: '跳转至'
    },

    common: {
        close: '关闭',
        open: '打开',
        save: '保存',
        cancel: '取消',
        confirm: '确认',
        delete: '删除',
        edit: '编辑',
        add: '添加',
        remove: '移除',
        search: '搜索',
        filter: '筛选',
        refresh: '刷新',
        export: '导出',
        import: '导入'
    }
}
