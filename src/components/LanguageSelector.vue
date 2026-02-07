<template>
  <el-dialog
    v-model="visible"
    :title="isFirstTime ? 'Welcome to Markpad' : 'Select Language'"
    width="500px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :show-close="!isFirstTime"
    center
  >
    <div class="language-selector">
      <div class="welcome-text" v-if="isFirstTime">
        <p>{{ welcomeText }}</p>
      </div>
      
      <el-form label-position="top">
        <el-form-item :label="selectLanguageLabel">
          <el-select 
            v-model="selectedLocale" 
            size="large"
            style="width: 100%"
            @change="handleLanguageChange"
          >
            <el-option
              v-for="lang in languages"
              :key="lang.code"
              :label="lang.name"
              :value="lang.code"
            >
              <span class="language-option">
                <span class="language-flag">{{ lang.flag }}</span>
                <span>{{ lang.name }}</span>
              </span>
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>

    <template #footer>
      <el-button 
        type="primary" 
        size="large"
        @click="confirmSelection"
      >
        {{ confirmText }}
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useSettingsStore } from '@/store/settings'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  isFirstTime: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'confirm'])

const { t, locale } = useI18n()
const settingsStore = useSettingsStore()

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const selectedLocale = ref(locale.value)

const languages = [
  { code: 'en-US', name: 'English', flag: '🇺🇸' },
  { code: 'zh-CN', name: '简体中文', flag: '🇨🇳' },
  { code: 'zh-TW', name: '繁體中文', flag: '🇹🇼' },
  { code: 'ja-JP', name: '日本語', flag: '🇯🇵' },
  { code: 'ko-KR', name: '한국어', flag: '🇰🇷' },
  { code: 'es-ES', name: 'Español', flag: '🇪🇸' },
  { code: 'fr-FR', name: 'Français', flag: '🇫🇷' },
  { code: 'de-DE', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'ru-RU', name: 'Русский', flag: '🇷🇺' },
  { code: 'pt-BR', name: 'Português (Brasil)', flag: '🇧🇷' }
]

const welcomeText = computed(() => {
  const texts = {
    'en-US': 'Please select your preferred language',
    'zh-CN': '请选择您的首选语言',
    'zh-TW': '請選擇您的首選語言',
    'ja-JP': 'お好みの言語を選択してください',
    'ko-KR': '원하는 언어를 선택하세요',
    'es-ES': 'Por favor, seleccione su idioma preferido',
    'fr-FR': 'Veuillez sélectionner votre langue préférée',
    'de-DE': 'Bitte wählen Sie Ihre bevorzugte Sprache',
    'ru-RU': 'Пожалуйста, выберите предпочитаемый язык',
    'pt-BR': 'Por favor, selecione seu idioma preferido'
  }
  return texts[selectedLocale.value] || texts['en-US']
})

const selectLanguageLabel = computed(() => {
  const labels = {
    'en-US': 'Language',
    'zh-CN': '语言',
    'zh-TW': '語言',
    'ja-JP': '言語',
    'ko-KR': '언어',
    'es-ES': 'Idioma',
    'fr-FR': 'Langue',
    'de-DE': 'Sprache',
    'ru-RU': 'Язык',
    'pt-BR': 'Idioma'
  }
  return labels[selectedLocale.value] || labels['en-US']
})

const confirmText = computed(() => {
  const texts = {
    'en-US': 'Confirm',
    'zh-CN': '确认',
    'zh-TW': '確認',
    'ja-JP': '確認',
    'ko-KR': '확인',
    'es-ES': 'Confirmar',
    'fr-FR': 'Confirmer',
    'de-DE': 'Bestätigen',
    'ru-RU': 'Подтвердить',
    'pt-BR': 'Confirmar'
  }
  return texts[selectedLocale.value] || texts['en-US']
})

const handleLanguageChange = () => {
  // Preview language change without saving
  locale.value = selectedLocale.value
}

const confirmSelection = () => {
  settingsStore.setLocale(selectedLocale.value)
  if (props.isFirstTime) {
    localStorage.setItem('markpad-first-launch', 'false')
  }
  emit('confirm', selectedLocale.value)
  visible.value = false
}

onMounted(() => {
  selectedLocale.value = settingsStore.locale || 'en-US'
})
</script>

<style scoped lang="scss">
.language-selector {
  padding: 20px 0;

  .welcome-text {
    margin-bottom: 30px;
    text-align: center;
    
    p {
      font-size: 16px;
      color: var(--el-text-color-regular);
      line-height: 1.6;
    }
  }

  .language-option {
    display: flex;
    align-items: center;
    gap: 10px;

    .language-flag {
      font-size: 20px;
    }
  }
}

:deep(.el-dialog__header) {
  padding: 30px 30px 0;
}

:deep(.el-dialog__body) {
  padding: 20px 30px;
}

:deep(.el-dialog__footer) {
  padding: 20px 30px 30px;
  text-align: center;
}
</style>
