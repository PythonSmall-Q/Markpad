export default {
    app: {
        name: 'Markpad',
        description: 'Мощное приложение для создания заметок Markdown'
    },

    menu: {
        file: 'Файл',
        edit: 'Правка',
        view: 'Вид',
        help: 'Справка'
    },

    header: {
        new: 'Создать',
        open: 'Открыть',
        save: 'Сохранить',
        saveAs: 'Сохранить как',
        export: 'Экспорт',
        settings: 'Настройки'
    },

    sidebar: {
        files: 'Файлы',
        recentFiles: 'Недавние',
        openDocuments: 'Открытые',
        noRecentFiles: 'Нет недавних файлов',
        noDocuments: 'Нет документов',
        settings: 'Настройки'
    },

    editor: {
        toolbar: {
            bold: 'Жирный',
            italic: 'Курсив',
            strikethrough: 'Зачеркнутый',
            heading: 'Заголовок',
            unorderedList: 'Маркированный список',
            orderedList: 'Нумерованный список',
            quote: 'Цитата',
            inlineCode: 'Встроенный код',
            codeBlock: 'Блок кода',
            link: 'Вставить ссылку',
            image: 'Вставить изображение',
            video: 'Вставить видео',
            audio: 'Вставить аудио',
            table: 'Вставить таблицу',
            inlineMath: 'Встроенная формула',
            blockMath: 'Блочная формула',
            hr: 'Горизонтальная линия',
            preview: 'Предварительный просмотр',
            hidePreview: 'Скрыть предварительный просмотр',
            showPreview: 'Показать предварительный просмотр'
        },
        placeholder: 'Начните писать свой документ Markdown...',
        dialog: {
            insertLink: 'Вставить ссылку',
            linkUrl: 'URL ссылки',
            linkText: 'Текст ссылки',
            invalidUrl: 'Пожалуйста, введите действительный URL',
            enterFormula: 'Введите математическую формулу',
            inlineMath: 'Встроенная формула',
            blockMath: 'Блочная формула',
            confirm: 'Подтвердить',
            cancel: 'Отмена'
        },
        preview: 'Предварительный просмотр',
        split: 'Разделить',
        fullscreen: 'Полноэкранный режим',
        exitFullscreen: 'Выйти из полноэкранного режима'
    },

    settings: {
        title: 'Настройки',
        appearance: {
            title: 'Внешний вид',
            theme: 'Тема',
            light: 'Светлая',
            dark: 'Темная',
            auto: 'Автоматически'
        },
        language: {
            title: 'Язык',
            selectLanguage: 'Выбрать язык',
            zhCN: 'Упрощенный китайский',
            enUS: 'English'
        },
        editor: {
            title: 'Редактор',
            fontSize: 'Размер шрифта',
            lineHeight: 'Высота строки',
            tabSize: 'Размер табуляции',
            wordWrap: 'Перенос слов',
            lineNumbers: 'Показать номера строк',
            autoSave: 'Автосохранение',
            autoSaveInterval: 'Интервал автосохранения (секунды)'
        },
        file: {
            title: 'Файл',
            defaultFileName: 'Имя файла по умолчанию',
            fileExtension: 'Расширение файла',
            recentFilesLimit: 'Лимит недавних файлов'
        },
        shortcuts: {
            title: 'Горячие клавиши',
            action: 'Действие',
            key: 'Клавиша'
        },
        about: {
            title: 'О программе',
            version: 'Версия',
            description: 'Мощное приложение для создания заметок Markdown',
            author: 'Автор',
            license: 'Лицензия',
            homepage: 'Домашняя страница',
            repository: 'Репозиторий'
        },
        saveSuccess: 'Настройки сохранены',
        resetConfirm: 'Вы хотите сбросить все настройки?',
        reset: 'Сбросить настройки'
    },

    file: {
        new: 'Новый файл',
        open: 'Открыть файл',
        save: 'Сохранить',
        saveAs: 'Сохранить как',
        close: 'Закрыть',
        closeAll: 'Закрыть все',
        recentFiles: 'Недавние файлы',
        clearRecent: 'Очистить историю'
    },

    export: {
        title: 'Экспорт',
        html: 'Экспортировать в HTML',
        pdf: 'Экспортировать в PDF',
        markdown: 'Экспортировать в Markdown',
        success: 'Экспорт выполнен',
        failed: 'Ошибка экспорта'
    },

    shortcuts: {
        newFile: 'Новый файл',
        openFile: 'Открыть файл',
        save: 'Сохранить',
        saveAs: 'Сохранить как',
        close: 'Закрыть',
        bold: 'Жирный',
        italic: 'Курсив',
        find: 'Найти',
        replace: 'Заменить',
        settings: 'Настройки'
    },

    messages: {
        saveSuccess: 'Успешно сохранено',
        saveFailed: 'Ошибка сохранения',
        openFailed: 'Ошибка открытия',
        unsavedChanges: 'У вас есть несохраненные изменения, хотите сохранить?',
        confirmClose: 'Вы хотите закрыть этот файл?',
        confirmCloseAll: 'Вы хотите закрыть все файлы?',
        fileNotFound: 'Файл не найден',
        invalidFile: 'Недопустимый файл',
        exportSuccess: 'Экспорт выполнен',
        exportFailed: 'Ошибка экспорта'
    },

    mathTutorial: {
        title: 'Учебник по математическим формулам',
        basics: { title: 'Базовый синтаксис', desc: 'LaTeX поддерживает встроенные и блочные формулы', inline: { title: 'Встроенная формула' }, block: { title: 'Блочная формула' } },
        symbols: { title: 'Символы', name: 'Имя', code: 'Код', result: 'Результат', greek: { title: 'Греческие буквы' }, operators: { title: 'Операторы' } },
        fractions: { title: 'Дроби и корни', fraction: { title: 'Дробь' }, root: { title: 'Корень' } },
        scripts: { title: 'Верхние и нижние индексы', superscript: { title: 'Верхний индекс' }, subscript: { title: 'Нижний индекс' } },
        functions: { title: 'Функции', trig: { title: 'Тригонометрические функции' }, log: { title: 'Логарифм' }, limits: { title: 'Пределы' } },
        matrices: { title: 'Матрицы', bracket: { title: 'Круглые скобки' }, square: { title: 'Квадратные скобки' }, determinant: { title: 'Определитель' } },
        equations: { title: 'Уравнения', system: { title: 'Система уравнений' }, align: { title: 'Выравнивание' } },
        examples: { title: 'Примеры', quadratic: 'Квадратное уравнение', integral: 'Интеграл', summation: 'Суммирование', limit: 'Предел', matrix: 'Матрица', system: 'Система', derivative: 'Производная', partial: 'Частная производная', vector: 'Вектор', set: 'Множество', logic: 'Логика', copy: 'Копировать', copied: 'Скопировано' }
    }
}
