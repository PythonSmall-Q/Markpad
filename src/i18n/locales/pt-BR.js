export default {
    app: {
        name: 'Markpad',
        description: 'Um poderoso aplicativo de anotações Markdown'
    },

    menu: {
        file: 'Arquivo',
        edit: 'Editar',
        view: 'Visualizar',
        help: 'Ajuda'
    },

    header: {
        new: 'Novo',
        open: 'Abrir',
        save: 'Salvar',
        saveAs: 'Salvar como',
        export: 'Exportar',
        settings: 'Configurações'
    },

    sidebar: {
        files: 'Arquivos',
        recentFiles: 'Recentes',
        openDocuments: 'Abertos',
        noRecentFiles: 'Nenhum arquivo recente',
        noDocuments: 'Nenhum documento',
        settings: 'Configurações'
    },

    editor: {
        toolbar: {
            bold: 'Negrito',
            italic: 'Itálico',
            strikethrough: 'Tachado',
            heading: 'Título',
            unorderedList: 'Lista com marcadores',
            orderedList: 'Lista numerada',
            quote: 'Citação',
            inlineCode: 'Código em linha',
            codeBlock: 'Bloco de código',
            link: 'Inserir link',
            image: 'Inserir imagem',
            video: 'Inserir vídeo',
            audio: 'Inserir áudio',
            table: 'Inserir tabela',
            inlineMath: 'Fórmula em linha',
            blockMath: 'Fórmula em bloco',
            hr: 'Linha horizontal',
            preview: 'Visualizar',
            hidePreview: 'Ocultar visualização',
            showPreview: 'Mostrar visualização'
        },
        placeholder: 'Comece a escrever seu documento Markdown...',
        dialog: {
            insertLink: 'Inserir link',
            linkUrl: 'URL do link',
            linkText: 'Texto do link',
            invalidUrl: 'Por favor, insira uma URL válida',
            enterFormula: 'Inserir fórmula matemática',
            inlineMath: 'Fórmula em linha',
            blockMath: 'Fórmula em bloco',
            confirm: 'Confirmar',
            cancel: 'Cancelar'
        },
        placeholder: 'Comece a escrever seu documento Markdown...',
        preview: 'Visualização',
        split: 'Dividir',
        fullscreen: 'Tela cheia',
        exitFullscreen: 'Sair da tela cheia'
    },

    settings: {
        title: 'Configurações',
        appearance: {
            title: 'Aparência',
            theme: 'Tema',
            light: 'Claro',
            dark: 'Escuro',
            auto: 'Automático'
        },
        language: {
            title: 'Idioma',
            selectLanguage: 'Selecionar idioma',
            zhCN: 'Chinês simplificado',
            enUS: 'English'
        },
        editor: {
            title: 'Editor',
            fontSize: 'Tamanho da fonte',
            lineHeight: 'Altura da linha',
            tabSize: 'Tamanho da tabulação',
            wordWrap: 'Quebra de linha',
            lineNumbers: 'Mostrar números de linha',
            autoSave: 'Salvamento automático',
            autoSaveInterval: 'Intervalo de salvamento automático (segundos)'
        },
        file: {
            title: 'Arquivo',
            defaultFileName: 'Nome de arquivo padrão',
            fileExtension: 'Extensão de arquivo',
            recentFilesLimit: 'Limite de arquivos recentes'
        },
        shortcuts: {
            title: 'Atalhos de teclado',
            action: 'Ação',
            key: 'Tecla'
        },
        about: {
            title: 'Sobre',
            version: 'Versão',
            description: 'Um poderoso aplicativo de anotações Markdown',
            author: 'Autor',
            license: 'Licença',
            homepage: 'Página inicial',
            repository: 'Repositório'
        },
        saveSuccess: 'Configurações salvas',
        resetConfirm: 'Deseja redefinir todas as configurações?',
        reset: 'Redefinir configurações'
    },

    file: {
        new: 'Novo arquivo',
        open: 'Abrir arquivo',
        save: 'Salvar',
        saveAs: 'Salvar como',
        close: 'Fechar',
        closeAll: 'Fechar todos',
        recentFiles: 'Arquivos recentes',
        clearRecent: 'Limpar histórico'
    },

    export: {
        title: 'Exportar',
        html: 'Exportar como HTML',
        pdf: 'Exportar como PDF',
        markdown: 'Exportar como Markdown',
        success: 'Exportação bem-sucedida',
        failed: 'Falha na exportação'
    },

    shortcuts: {
        newFile: 'Novo arquivo',
        openFile: 'Abrir arquivo',
        save: 'Salvar',
        saveAs: 'Salvar como',
        close: 'Fechar',
        bold: 'Negrito',
        italic: 'Itálico',
        find: 'Localizar',
        replace: 'Substituir',
        settings: 'Configurações'
    },

    messages: {
        saveSuccess: 'Salvo com sucesso',
        saveFailed: 'Falha ao salvar',
        openFailed: 'Falha ao abrir',
        unsavedChanges: 'Você tem alterações não salvas, deseja salvar?',
        confirmClose: 'Deseja fechar este arquivo?',
        confirmCloseAll: 'Deseja fechar todos os arquivos?',
        fileNotFound: 'Arquivo não encontrado',
        invalidFile: 'Arquivo inválido',
        exportSuccess: 'Exportação bem-sucedida',
        exportFailed: 'Falha na exportação'
    },

    mathTutorial: {
        title: 'Tutorial de Fórmulas Matemáticas',
        basics: { title: 'Sintaxe Básica', desc: 'LaTeX suporta fórmulas em linha e em bloco', inline: { title: 'Fórmula em Linha' }, block: { title: 'Fórmula em Bloco' } },
        symbols: { title: 'Símbolos', name: 'Nome', code: 'Código', result: 'Resultado', greek: { title: 'Letras Gregas' }, operators: { title: 'Operadores' } },
        fractions: { title: 'Frações e Raízes', fraction: { title: 'Fração' }, root: { title: 'Raiz' } },
        scripts: { title: 'Sobrescritos e Subscritos', superscript: { title: 'Sobrescrito' }, subscript: { title: 'Subscrito' } },
        functions: { title: 'Funções', trig: { title: 'Funções Trigonométricas' }, log: { title: 'Logaritmo' }, limits: { title: 'Limites' } },
        matrices: { title: 'Matrizes', bracket: { title: 'Parênteses' }, square: { title: 'Colchetes' }, determinant: { title: 'Determinante' } },
        equations: { title: 'Equações', system: { title: 'Sistema de Equações' }, align: { title: 'Alinhamento' } },
        examples: { title: 'Exemplos', quadratic: 'Equação Quadrática', integral: 'Integral', summation: 'Somatório', limit: 'Limite', matrix: 'Matriz', system: 'Sistema', derivative: 'Derivada', partial: 'Derivada Parcial', vector: 'Vetor', set: 'Conjunto', logic: 'Lógica', copy: 'Copiar', copied: 'Copiado' }
    },

    statusBar: {
        lines: 'Linhas',
        words: 'Palavras',
        chars: 'Caracteres',
        readTime: 'Tempo de leitura',
        minute: 'minuto',
        minutes: 'minutos',
        lessThanMinute: 'Menos de 1 minuto',
        outline: 'Esboço'
    },

    outline: {
        title: 'Esboço do documento',
        empty: 'Nenhum título encontrado',
        jumpTo: 'Ir para'
    },

    common: {
        close: 'Fechar',
        open: 'Abrir',
        save: 'Salvar',
        cancel: 'Cancelar',
        confirm: 'Confirmar',
        delete: 'Excluir',
        edit: 'Editar',
        add: 'Adicionar',
        remove: 'Remover',
        search: 'Pesquisar',
        filter: 'Filtrar',
        refresh: 'Atualizar',
        export: 'Exportar',
        import: 'Importar'
    }
}
