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

// Auto-detect system language
function detectSystemLocale() {
    const savedLocale = localStorage.getItem('markpad-locale')
    if (savedLocale) {
        return savedLocale
    }

    // Get browser/system language
    const browserLang = navigator.language || navigator.userLanguage

    // Map browser language to supported locales
    const localeMap = {
        'zh-CN': 'zh-CN',
        'zh-Hans': 'zh-CN',
        'zh': 'zh-CN',
        'zh-TW': 'zh-TW',
        'zh-Hant': 'zh-TW',
        'zh-HK': 'zh-TW',
        'en': 'en-US',
        'en-US': 'en-US',
        'en-GB': 'en-US',
        'ja': 'ja-JP',
        'ja-JP': 'ja-JP',
        'ko': 'ko-KR',
        'ko-KR': 'ko-KR',
        'es': 'es-ES',
        'es-ES': 'es-ES',
        'fr': 'fr-FR',
        'fr-FR': 'fr-FR',
        'de': 'de-DE',
        'de-DE': 'de-DE',
        'ru': 'ru-RU',
        'ru-RU': 'ru-RU',
        'pt': 'pt-BR',
        'pt-BR': 'pt-BR'
    }

    // Try exact match first
    if (localeMap[browserLang]) {
        return localeMap[browserLang]
    }

    // Try language code only (e.g., 'en' from 'en-US')
    const langCode = browserLang.split('-')[0]
    if (localeMap[langCode]) {
        return localeMap[langCode]
    }

    // Default to simplified Chinese for Chinese regions, English for others
    return langCode === 'zh' ? 'zh-CN' : 'en-US'
}

const savedLocale = detectSystemLocale()

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
