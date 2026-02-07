import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import i18n from '@/i18n'

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
            title: options.title || i18n.global.t('editor.untitled'),
            content: options.content || '',
            filePath: options.filePath || null,
            isDirty: options.isDirty !== undefined ? options.isDirty : false,
            language: options.language || 'markdown',
            createdAt: options.createdAt || new Date(),
            updatedAt: options.updatedAt || new Date()
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

            // 保存未保存的文档到临时文件
            saveTempDocuments()
        }, interval)
    }

    function disableAutoSave() {
        if (autoSaveTimer.value) {
            clearInterval(autoSaveTimer.value)
            autoSaveTimer.value = null
        }
    }

    // 保存未保存的文档到临时文件
    async function saveTempDocuments() {
        const unsavedDocs = documents.value.filter(doc => !doc.filePath || doc.isDirty)
        console.log('[Temp] Saving temp documents, count:', unsavedDocs.length)

        if (unsavedDocs.length === 0) {
            // 如果没有未保存的文档,清除临时文件
            const { tempAPI } = await import('@/utils/electron')
            await tempAPI.clear()
            console.log('[Temp] No unsaved documents, cleared temp files')
            return
        }

        try {
            // 只保存必要的字段，避免克隆不可序列化的对象
            const serializableDocs = unsavedDocs.map(doc => ({
                id: doc.id,
                title: doc.title,
                content: doc.content,
                filePath: doc.filePath,
                isDirty: doc.isDirty,
                language: doc.language,
                createdAt: doc.createdAt,
                updatedAt: doc.updatedAt
            }))

            console.log('[Temp] Serializable docs:', serializableDocs.map(d => ({ id: d.id, title: d.title })))

            const { tempAPI } = await import('@/utils/electron')
            const result = await tempAPI.save(serializableDocs)
            console.log('[Temp] Save result:', result)
        } catch (error) {
            console.error('[Temp] Failed to save temp documents:', error)
        }
    }

    // 从临时文件恢复文档
    async function restoreTempDocuments() {
        try {
            console.log('[Temp] Attempting to restore temp documents...')
            const { tempAPI } = await import('@/utils/electron')
            const result = await tempAPI.load()
            console.log('[Temp] Load result:', result)

            if (result.success && result.documents && result.documents.length > 0) {
                console.log('[Temp] Restoring documents:', result.documents.map(d => ({ id: d.id, title: d.title })))

                // 恢复文档，确保日期字段正确转换
                result.documents.forEach(doc => {
                    const restoredDoc = {
                        ...doc,
                        createdAt: doc.createdAt ? new Date(doc.createdAt) : new Date(),
                        updatedAt: doc.updatedAt ? new Date(doc.updatedAt) : new Date(),
                        language: doc.language || 'markdown',
                        isDirty: doc.isDirty !== undefined ? doc.isDirty : true
                    }
                    documents.value.push(restoredDoc)
                })

                // 激活第一个文档
                if (documents.value.length > 0) {
                    activeDocumentId.value = documents.value[0].id
                }

                console.log('[Temp] Successfully restored', result.documents.length, 'documents')
                return result.documents.length
            }
            console.log('[Temp] No documents to restore')
            return 0
        } catch (error) {
            console.error('[Temp] Failed to restore temp documents:', error)
            return 0
        }
    }

    // 清除所有临时文档
    async function clearTempDocuments() {
        try {
            const { tempAPI } = await import('@/utils/electron')
            await tempAPI.clear()
        } catch (error) {
            console.error('Failed to clear temp documents:', error)
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
        disableAutoSave,
        saveTempDocuments,
        restoreTempDocuments,
        clearTempDocuments
    }
})
