export default {
    app: {
        name: 'Markpad',
        description: 'Une puissante application de prise de notes Markdown'
    },

    menu: {
        file: 'Fichier',
        edit: 'Édition',
        view: 'Affichage',
        help: 'Aide'
    },

    header: {
        new: 'Nouveau',
        open: 'Ouvrir',
        save: 'Enregistrer',
        saveAs: 'Enregistrer sous',
        export: 'Exporter',
        settings: 'Paramètres'
    },

    sidebar: {
        files: 'Fichiers',
        recentFiles: 'Récents',
        openDocuments: 'Ouverts',
        noRecentFiles: 'Aucun fichier récent',
        noDocuments: 'Aucun document',
        settings: 'Paramètres'
    },

    editor: {
        toolbar: {
            bold: 'Gras',
            italic: 'Italique',
            strikethrough: 'Barré',
            heading: 'Titre',
            unorderedList: 'Liste à puces',
            orderedList: 'Liste numérotée',
            quote: 'Citation',
            inlineCode: 'Code en ligne',
            codeBlock: 'Bloc de code',
            link: 'Insérer un lien',
            image: 'Insérer une image',
            video: 'Insérer une vidéo',
            audio: 'Insérer un audio',
            table: 'Insérer un tableau',
            inlineMath: 'Formule en ligne',
            blockMath: 'Formule en bloc',
            hr: 'Ligne horizontale',
            preview: 'Aperçu',
            hidePreview: 'Masquer l\'aperçu',
            showPreview: 'Afficher l\'aperçu'
        },
        placeholder: 'Commencez à écrire votre document Markdown...',
        dialog: {
            insertLink: 'Insérer un lien',
            linkUrl: 'URL du lien',
            linkText: 'Texte du lien',
            invalidUrl: 'Veuillez entrer une URL valide',
            enterFormula: 'Entrer une formule mathématique',
            inlineMath: 'Formule en ligne',
            blockMath: 'Formule en bloc',
            confirm: 'Confirmer',
            cancel: 'Annuler'
        },
        placeholder: 'Commencez à écrire votre document Markdown...',
        preview: 'Aperçu',
        split: 'Diviser',
        fullscreen: 'Plein écran',
        exitFullscreen: 'Quitter le plein écran'
    },

    settings: {
        title: 'Paramètres',
        appearance: {
            title: 'Apparence',
            theme: 'Thème',
            light: 'Clair',
            dark: 'Sombre',
            auto: 'Automatique'
        },
        language: {
            title: 'Langue',
            selectLanguage: 'Sélectionner la langue',
            zhCN: 'Chinois simplifié',
            enUS: 'English'
        },
        editor: {
            title: 'Éditeur',
            fontSize: 'Taille de police',
            lineHeight: 'Hauteur de ligne',
            tabSize: 'Taille de tabulation',
            wordWrap: 'Retour à la ligne',
            lineNumbers: 'Afficher les numéros de ligne',
            autoSave: 'Sauvegarde automatique',
            autoSaveInterval: 'Intervalle de sauvegarde automatique (secondes)'
        },
        file: {
            title: 'Fichier',
            defaultFileName: 'Nom de fichier par défaut',
            fileExtension: 'Extension de fichier',
            recentFilesLimit: 'Limite des fichiers récents'
        },
        shortcuts: {
            title: 'Raccourcis clavier',
            action: 'Action',
            key: 'Touche'
        },
        about: {
            title: 'À propos',
            version: 'Version',
            description: 'Une puissante application de prise de notes Markdown',
            author: 'Auteur',
            license: 'Licence',
            homepage: 'Page d\'accueil',
            repository: 'Dépôt'
        },
        saveSuccess: 'Paramètres enregistrés',
        resetConfirm: 'Voulez-vous réinitialiser tous les paramètres ?',
        reset: 'Réinitialiser les paramètres'
    },

    file: {
        new: 'Nouveau fichier',
        open: 'Ouvrir un fichier',
        save: 'Enregistrer',
        saveAs: 'Enregistrer sous',
        close: 'Fermer',
        closeAll: 'Tout fermer',
        recentFiles: 'Fichiers récents',
        clearRecent: 'Effacer l\'historique'
    },

    export: {
        title: 'Exporter',
        html: 'Exporter en HTML',
        pdf: 'Exporter en PDF',
        markdown: 'Exporter en Markdown',
        success: 'Exportation réussie',
        failed: 'Échec de l\'exportation'
    },

    shortcuts: {
        newFile: 'Nouveau fichier',
        openFile: 'Ouvrir un fichier',
        save: 'Enregistrer',
        saveAs: 'Enregistrer sous',
        close: 'Fermer',
        bold: 'Gras',
        italic: 'Italique',
        find: 'Rechercher',
        replace: 'Remplacer',
        settings: 'Paramètres'
    },

    messages: {
        saveSuccess: 'Enregistrement réussi',
        saveFailed: 'Échec de l\'enregistrement',
        openFailed: 'Échec de l\'ouverture',
        unsavedChanges: 'Vous avez des modifications non enregistrées, voulez-vous enregistrer ?',
        confirmClose: 'Voulez-vous fermer ce fichier ?',
        confirmCloseAll: 'Voulez-vous fermer tous les fichiers ?',
        fileNotFound: 'Fichier introuvable',
        invalidFile: 'Fichier non valide',
        exportSuccess: 'Exportation réussie',
        exportFailed: 'Échec de l\'exportation'
    },

    mathTutorial: {
        title: 'Tutoriel de Formules Mathématiques',
        basics: { title: 'Syntaxe de Base', desc: 'LaTeX prend en charge les formules en ligne et en bloc', inline: { title: 'Formule en Ligne' }, block: { title: 'Formule en Bloc' } },
        symbols: { title: 'Symboles', name: 'Nom', code: 'Code', result: 'Résultat', greek: { title: 'Lettres Grecques' }, operators: { title: 'Opérateurs' } },
        fractions: { title: 'Fractions et Racines', fraction: { title: 'Fraction' }, root: { title: 'Racine' } },
        scripts: { title: 'Exposants et Indices', superscript: { title: 'Exposant' }, subscript: { title: 'Indice' } },
        functions: { title: 'Fonctions', trig: { title: 'Fonctions Trigonométriques' }, log: { title: 'Logarithme' }, limits: { title: 'Limites' } },
        matrices: { title: 'Matrices', bracket: { title: 'Parenthèses' }, square: { title: 'Crochets' }, determinant: { title: 'Déterminant' } },
        equations: { title: 'Équations', system: { title: 'Système d\'\u00c9quations' }, align: { title: 'Alignement' } },
        examples: { title: 'Exemples', quadratic: 'Équation Quadratique', integral: 'Intégrale', summation: 'Sommation', limit: 'Limite', matrix: 'Matrice', system: 'Système', derivative: 'Dérivée', partial: 'Dérivée Partielle', vector: 'Vecteur', set: 'Ensemble', logic: 'Logique', copy: 'Copier', copied: 'Copié' }
    }
}
