export default {
    app: {
        name: 'Markpad',
        description: 'Eine leistungsstarke Markdown-Notizen-Anwendung'
    },

    menu: {
        file: 'Datei',
        edit: 'Bearbeiten',
        view: 'Ansicht',
        help: 'Hilfe'
    },

    header: {
        new: 'Neu',
        open: 'Öffnen',
        save: 'Speichern',
        saveAs: 'Speichern unter',
        export: 'Exportieren',
        settings: 'Einstellungen'
    },

    sidebar: {
        files: 'Dateien',
        recentFiles: 'Zuletzt verwendet',
        openDocuments: 'Geöffnet',
        noRecentFiles: 'Keine zuletzt verwendeten Dateien',
        noDocuments: 'Keine Dokumente',
        settings: 'Einstellungen'
    },

    editor: {
        toolbar: {
            bold: 'Fett',
            italic: 'Kursiv',
            strikethrough: 'Durchgestrichen',
            heading: 'Überschrift',
            unorderedList: 'Aufzählungsliste',
            orderedList: 'Nummerierte Liste',
            quote: 'Zitat',
            inlineCode: 'Inline-Code',
            codeBlock: 'Codeblock',
            link: 'Link einfügen',
            image: 'Bild einfügen',
            video: 'Video einfügen',
            audio: 'Audio einfügen',
            table: 'Tabelle einfügen',
            inlineMath: 'Inline-Formel',
            blockMath: 'Block-Formel',
            hr: 'Horizontale Linie',
            preview: 'Vorschau',
            hidePreview: 'Vorschau ausblenden',
            showPreview: 'Vorschau anzeigen'
        },
        placeholder: 'Beginnen Sie mit dem Schreiben Ihres Markdown-Dokuments...',
        dialog: {
            insertLink: 'Link einfügen',
            linkUrl: 'Link-URL',
            linkText: 'Link-Text',
            invalidUrl: 'Bitte geben Sie eine gültige URL ein',
            enterFormula: 'Mathematische Formel eingeben',
            inlineMath: 'Inline-Formel',
            blockMath: 'Block-Formel',
            confirm: 'Bestätigen',
            cancel: 'Abbrechen'
        },
        placeholder: 'Beginnen Sie mit dem Schreiben Ihres Markdown-Dokuments...',
        preview: 'Vorschau',
        split: 'Teilen',
        fullscreen: 'Vollbild',
        exitFullscreen: 'Vollbild beenden'
    },

    settings: {
        title: 'Einstellungen',
        appearance: {
            title: 'Erscheinungsbild',
            theme: 'Design',
            light: 'Hell',
            dark: 'Dunkel',
            auto: 'Automatisch'
        },
        language: {
            title: 'Sprache',
            selectLanguage: 'Sprache auswählen',
            zhCN: 'Vereinfachtes Chinesisch',
            enUS: 'English'
        },
        editor: {
            title: 'Editor',
            fontSize: 'Schriftgröße',
            lineHeight: 'Zeilenhöhe',
            tabSize: 'Tabulatorgröße',
            wordWrap: 'Zeilenumbruch',
            lineNumbers: 'Zeilennummern anzeigen',
            autoSave: 'Automatisches Speichern',
            autoSaveInterval: 'Automatisches Speicherintervall (Sekunden)'
        },
        file: {
            title: 'Datei',
            defaultFileName: 'Standarddateiname',
            fileExtension: 'Dateierweiterung',
            recentFilesLimit: 'Limit für zuletzt verwendete Dateien'
        },
        shortcuts: {
            title: 'Tastenkombinationen',
            action: 'Aktion',
            key: 'Taste'
        },
        about: {
            title: 'Über',
            version: 'Version',
            description: 'Eine leistungsstarke Markdown-Notizen-Anwendung',
            author: 'Autor',
            license: 'Lizenz',
            homepage: 'Startseite',
            repository: 'Repository'
        },
        saveSuccess: 'Einstellungen gespeichert',
        resetConfirm: 'Möchten Sie alle Einstellungen zurücksetzen?',
        reset: 'Einstellungen zurücksetzen'
    },

    file: {
        new: 'Neue Datei',
        open: 'Datei öffnen',
        save: 'Speichern',
        saveAs: 'Speichern unter',
        close: 'Schließen',
        closeAll: 'Alle schließen',
        recentFiles: 'Zuletzt verwendete Dateien',
        clearRecent: 'Verlauf löschen'
    },

    export: {
        title: 'Exportieren',
        html: 'Als HTML exportieren',
        pdf: 'Als PDF exportieren',
        markdown: 'Als Markdown exportieren',
        success: 'Export erfolgreich',
        failed: 'Export fehlgeschlagen'
    },

    shortcuts: {
        newFile: 'Neue Datei',
        openFile: 'Datei öffnen',
        save: 'Speichern',
        saveAs: 'Speichern unter',
        close: 'Schließen',
        bold: 'Fett',
        italic: 'Kursiv',
        find: 'Suchen',
        replace: 'Ersetzen',
        settings: 'Einstellungen'
    },

    messages: {
        saveSuccess: 'Erfolgreich gespeichert',
        saveFailed: 'Speichern fehlgeschlagen',
        openFailed: 'Öffnen fehlgeschlagen',
        unsavedChanges: 'Sie haben nicht gespeicherte Änderungen, möchten Sie speichern?',
        confirmClose: 'Möchten Sie diese Datei schließen?',
        confirmCloseAll: 'Möchten Sie alle Dateien schließen?',
        fileNotFound: 'Datei nicht gefunden',
        invalidFile: 'Ungültige Datei',
        exportSuccess: 'Export erfolgreich',
        exportFailed: 'Export fehlgeschlagen'
    },

    mathTutorial: {
        title: 'Mathe-Formel-Tutorial',
        basics: { title: 'Grundlagen', desc: 'LaTeX unterstützt Inline- und Block-Formeln', inline: { title: 'Inline-Formel' }, block: { title: 'Block-Formel' } },
        symbols: { title: 'Symbole', name: 'Name', code: 'Code', result: 'Ergebnis', greek: { title: 'Griechische Buchstaben' }, operators: { title: 'Operatoren' } },
        fractions: { title: 'Brüche und Wurzeln', fraction: { title: 'Bruch' }, root: { title: 'Wurzel' } },
        scripts: { title: 'Hoch- und Tiefstellung', superscript: { title: 'Hochstellung' }, subscript: { title: 'Tiefstellung' } },
        functions: { title: 'Funktionen', trig: { title: 'Trigonometrische Funktionen' }, log: { title: 'Logarithmus' }, limits: { title: 'Grenzwerte' } },
        matrices: { title: 'Matrizen', bracket: { title: 'Runde Klammern' }, square: { title: 'Eckige Klammern' }, determinant: { title: 'Determinante' } },
        equations: { title: 'Gleichungen', system: { title: 'Gleichungssystem' }, align: { title: 'Ausrichtung' } },
        examples: { title: 'Beispiele', quadratic: 'Quadratische Gleichung', integral: 'Integral', summation: 'Summation', limit: 'Grenzwert', matrix: 'Matrix', system: 'Gleichungssystem', derivative: 'Ableitung', partial: 'Partielle Ableitung', vector: 'Vektor', set: 'Menge', logic: 'Logik', copy: 'Kopieren', copied: 'Kopiert' }
    }
}
