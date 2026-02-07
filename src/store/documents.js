import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useDocumentsStore = defineStore('documents', () => {
    // State
    const documents = ref([])
    const activeDocumentId = ref(null)
    const autoSaveTimer = ref(null)

    // Computed properties
    const activeDocument = computed(() => {
        return documents.value.find(doc => doc.id === activeDocumentId.value)
    })

    const hasUnsavedChanges = computed(() => {
        return documents.value.some(doc => doc.isDirty)
    })

    // Methods
    function createDocument(options = {}) {
        const id = Date.now().toString() + Math.random().toString(36).substr(2, 9)
        const doc = {
            id,
            title: options.title || '未命名文档',
            content: options.content || '',
            filePath: options.filePath || null,
            isDirty: false,
            createdAt: new Date(),
            updatedAt: new Date()
        }

        documents.value.push(doc)
        activeDocumentId.value = id

        return doc
    }

    function openDocument(filePath, content, title) {
        // Check if document is already open
        const existingDoc = documents.value.find(doc => doc.filePath === filePath)
        if (existingDoc) {
            activeDocumentId.value = existingDoc.id
            return existingDoc
        }

        const doc = createDocument({
            title: title || filePath.split(/[/\\]/).pop(),
            content,
            filePath
        })

        return doc
    }

    function closeDocument(id) {
        const index = documents.value.findIndex(doc => doc.id === id)
        if (index !== -1) {
            documents.value.splice(index, 1)

            // If closing the current document, switch to another document
            if (activeDocumentId.value === id) {
                if (documents.value.length > 0) {
                    activeDocumentId.value = documents.value[index]
                        ? documents.value[index].id
                        : documents.value[index - 1].id
                } else {
                    activeDocumentId.value = null
                }
            }
        }
    }

    function updateDocument(id, updates) {
        const doc = documents.value.find(d => d.id === id)
        if (doc) {
            Object.assign(doc, updates, { updatedAt: new Date() })
            if (updates.content !== undefined) {
                doc.isDirty = true
            }
        }
    }

    function setActiveDocument(id) {
        activeDocumentId.value = id
    }

    function markAsSaved(id) {
        const doc = documents.value.find(d => d.id === id)
        if (doc) {
            doc.isDirty = false
        }
    }

    function updateContent(id, content) {
        const doc = documents.value.find(d => d.id === id)
        if (doc && doc.content !== content) {
            doc.content = content
            doc.isDirty = true
            doc.updatedAt = new Date()
        }
    }

    // Auto-save
    function enableAutoSave(interval = 60000) {
        if (autoSaveTimer.value) {
            clearInterval(autoSaveTimer.value)
        }

        autoSaveTimer.value = setInterval(() => {
            documents.value.forEach(doc => {
                if (doc.isDirty && doc.filePath) {
                    // Trigger auto-save
                    window.electronAPI.fileSave({
                        filePath: doc.filePath,
                        content: doc.content
                    }).then(() => {
                        markAsSaved(doc.id)
                    })
                }
            })
        }, interval)
    }

    function disableAutoSave() {
        if (autoSaveTimer.value) {
            clearInterval(autoSaveTimer.value)
            autoSaveTimer.value = null
        }
    }

    return {
        documents,
        activeDocumentId,
        activeDocument,
        hasUnsavedChanges,
        createDocument,
        openDocument,
        closeDocument,
        updateDocument,
        setActiveDocument,
        markAsSaved,
        updateContent,
        enableAutoSave,
        disableAutoSave
    }
})
