import { createI18n } from 'vue-i18n'
import zhCN from './locales/zh-CN'
import zhTW from './locales/zh-TW'
import enUS from './locales/en-US'
import jaJP from './locales/ja-JP'
import koKR from './locales/ko-KR'
import esES from './locales/es-ES'
import frFR from './locales/fr-FR'
import deDE from './locales/de-DE'
import ruRU from './locales/ru-RU'
import ptBR from './locales/pt-BR'

// Get saved language from localStorage, default to English
const savedLocale = localStorage.getItem('markpad-locale') || 'en-US'

const i18n = createI18n({
    legacy: false, // Use Composition API mode
    locale: savedLocale,
    fallbackLocale: 'en-US',
    messages: {
        'zh-CN': zhCN,
        'zh-TW': zhTW,
        'en-US': enUS,
        'ja-JP': jaJP,
        'ko-KR': koKR,
        'es-ES': esES,
        'fr-FR': frFR,
        'de-DE': deDE,
        'ru-RU': ruRU,
        'pt-BR': ptBR
    },
    globalInjection: true // Global injection of $t function
})

export default i18n
