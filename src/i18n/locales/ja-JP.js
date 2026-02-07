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
            image: '画像を挿入',
            table: '表を挿入',
            hr: '水平線',
            preview: 'プレビュー',
            hidePreview: 'プレビューを非表示',
            showPreview: 'プレビューを表示'
        },
        placeholder: 'Markdown ドキュメントを入力してください...',
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
    }
}
