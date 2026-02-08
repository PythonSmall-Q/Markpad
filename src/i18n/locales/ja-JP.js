export default {
    app: {
        name: 'Markpad',
        description: '強力な Markdown ノートアプリケーション'
    },

    menu: {
        file: 'ファイル',
        edit: '編集',
        view: '表示',
        help: 'ヘルプ'
    },

    header: {
        new: '新規',
        open: '開く',
        save: '保存',
        saveAs: '名前を付けて保存',
        export: 'エクスポート',
        settings: '設定'
    },

    sidebar: {
        files: 'ファイル',
        recentFiles: '最近開いたファイル',
        openDocuments: '開いているドキュメント',
        noRecentFiles: '最近のファイルはありません',
        noDocuments: 'ドキュメントがありません',
        settings: '設定'
    },

    editor: {
        toolbar: {
            bold: '太字',
            italic: '斜体',
            strikethrough: '取り消し線',
            heading: '見出し',
            unorderedList: '箇条書きリスト',
            orderedList: '番号付きリスト',
            quote: '引用',
            inlineCode: 'インラインコード',
            codeBlock: 'コードブロック',
            link: 'リンクを挿入',
            image: '画像を挿入', video: '動画を挿入',
            audio: '音声を挿入', table: '表を挿入',
            inlineMath: 'インライン数式',
            blockMath: 'ブロック数式',
            hr: '水平線',
            preview: 'プレビュー',
            hidePreview: 'プレビューを非表示',
            showPreview: 'プレビューを表示'
        },
        placeholder: 'Markdown ドキュメントを入力してください...',
        dialog: {
            insertLink: 'リンクを挿入',
            linkUrl: 'リンクURL',
            linkText: 'リンクテキスト',
            invalidUrl: '有効なURLを入力してください',
            enterFormula: '数式を入力',
            inlineMath: 'インライン数式',
            blockMath: 'ブロック数式',
            confirm: '確認',
            cancel: 'キャンセル'
        },
        preview: 'プレビュー',
        split: '分割',
        fullscreen: 'フルスクリーン',
        exitFullscreen: 'フルスクリーンを終了'
    },

    settings: {
        title: '設定',
        appearance: {
            title: '外観',
            theme: 'テーマ',
            light: 'ライト',
            dark: 'ダーク',
            auto: '自動'
        },
        language: {
            title: '言語',
            selectLanguage: '言語を選択',
            zhCN: '簡体字中国語',
            enUS: 'English'
        },
        editor: {
            title: 'エディター',
            fontSize: 'フォントサイズ',
            lineHeight: '行の高さ',
            tabSize: 'タブサイズ',
            wordWrap: 'ワードラップ',
            lineNumbers: '行番号を表示',
            autoSave: '自動保存',
            autoSaveInterval: '自動保存間隔（秒）'
        },
        file: {
            title: 'ファイル',
            defaultFileName: 'デフォルトファイル名',
            fileExtension: 'ファイル拡張子',
            recentFilesLimit: '最近のファイル数'
        },
        shortcuts: {
            title: 'ショートカット',
            action: 'アクション',
            key: 'キー'
        },
        about: {
            title: 'について',
            version: 'バージョン',
            description: '強力な Markdown ノートアプリケーション',
            author: '作者',
            license: 'ライセンス',
            homepage: 'ホームページ',
            repository: 'リポジトリ'
        },
        saveSuccess: '設定を保存しました',
        resetConfirm: 'すべての設定をリセットしますか？',
        reset: '設定をリセット'
    },

    file: {
        new: '新しいファイル',
        open: 'ファイルを開く',
        save: '保存',
        saveAs: '名前を付けて保存',
        close: '閉じる',
        closeAll: 'すべて閉じる',
        recentFiles: '最近開いたファイル',
        clearRecent: '履歴をクリア'
    },

    export: {
        title: 'エクスポート',
        html: 'HTML としてエクスポート',
        pdf: 'PDF としてエクスポート',
        markdown: 'Markdown としてエクスポート',
        success: 'エクスポートに成功しました',
        failed: 'エクスポートに失敗しました'
    },

    shortcuts: {
        newFile: '新しいファイル',
        openFile: 'ファイルを開く',
        save: '保存',
        saveAs: '名前を付けて保存',
        close: '閉じる',
        bold: '太字',
        italic: '斜体',
        find: '検索',
        replace: '置換',
        settings: '設定'
    },

    messages: {
        saveSuccess: '保存に成功しました',
        saveFailed: '保存に失敗しました',
        openFailed: '開けませんでした',
        unsavedChanges: '保存されていない変更があります。保存しますか？',
        confirmClose: 'このファイルを閉じますか？',
        confirmCloseAll: 'すべてのファイルを閉じますか？',
        fileNotFound: 'ファイルが見つかりません',
        invalidFile: '無効なファイルです',
        exportSuccess: 'エクスポートに成功しました',
        exportFailed: 'エクスポートに失敗しました'
    },

    mathTutorial: {
        title: '数式チュートリアル',
        basics: { title: '基本構文', desc: 'LaTeXはインラインとブロック数式をサポート', inline: { title: 'インライン数式' }, block: { title: 'ブロック数式' } },
        symbols: { title: '記号', name: '名前', code: 'コード', result: '結果', greek: { title: 'ギリシャ文字' }, operators: { title: '演算子' } },
        fractions: { title: '分数と根号', fraction: { title: '分数' }, root: { title: '根号' } },
        scripts: { title: '上付きと下付き', superscript: { title: '上付き' }, subscript: { title: '下付き' } },
        functions: { title: '関数', trig: { title: '三角関数' }, log: { title: '対数' }, limits: { title: '極限' } },
        matrices: { title: '行列', bracket: { title: '丸括弧' }, square: { title: '角括弧' }, determinant: { title: '行列式' } },
        equations: { title: '方程式', system: { title: '連立方程式' }, align: { title: '配置' } },
        examples: { title: '例', quadratic: '二次方程式', integral: '積分', summation: '総和', limit: '極限', matrix: '行列', system: '連立', derivative: '導関数', partial: '偏導関数', vector: 'ベクトル', set: '集合', logic: '論理', copy: 'コピー', copied: 'コピー完了' }
    },

    statusBar: {
        lines: '行数',
        words: '単語数',
        chars: '文字数',
        readTime: '読了時間',
        minute: '分',
        minutes: '分',
        lessThanMinute: '1分未満',
        outline: 'アウトライン'
    },

    outline: {
        title: '文書アウトライン',
        empty: '見出しが見つかりません',
        jumpTo: 'ジャンプ'
    },

    common: {
        close: '閉じる',
        open: '開く',
        save: '保存',
        cancel: 'キャンセル',
        confirm: '確認',
        delete: '削除',
        edit: '編集',
        add: '追加',
        remove: '削除',
        search: '検索',
        filter: 'フィルタ',
        refresh: '更新',
        export: 'エクスポート',
        import: 'インポート'
    }
}
