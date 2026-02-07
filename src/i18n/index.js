import { createI18n } from 'vue-i18n'
import zhCN from './locales/zh-CN'
import enUS from './locales/en-US'

// 从 localStorage 获取保存的语言设置
const savedLocale = localStorage.getItem('markpad-locale') || 'zh-CN'

const i18n = createI18n({
    legacy: false, // 使用 Composition API 模式
    locale: savedLocale,
    fallbackLocale: 'en-US',
    messages: {
        'zh-CN': zhCN,
        'en-US': enUS
    },
    globalInjection: true // 全局注入 $t 函数
})

export default i18n
