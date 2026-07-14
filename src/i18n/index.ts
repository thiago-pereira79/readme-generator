import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { ptBR } from './locales/pt-BR';
import { enUS } from './locales/en-US';
import { es419 } from './locales/es-419';

function getBrowserLanguage(): 'pt-BR' | 'en-US' | 'es-419' {
  if (typeof navigator === 'undefined') return 'pt-BR';
  const legacyNavigator = navigator as Navigator & { userLanguage?: string };
  const navLang = (navigator.language || legacyNavigator.userLanguage || '').toLowerCase();
  if (navLang.startsWith('pt')) return 'pt-BR';
  if (navLang.startsWith('en')) return 'en-US';
  if (navLang.startsWith('es')) return 'es-419';
  return 'pt-BR';
}

// Retrieve saved preferences from localStorage to pick initial language
let initialLanguage: 'pt-BR' | 'en-US' | 'es-419' = 'pt-BR';
try {
  if (typeof localStorage !== 'undefined') {
    const storedPrefsStr = localStorage.getItem('tp-lab-readme-preferences');
    if (storedPrefsStr) {
      const storedPrefs = JSON.parse(storedPrefsStr);
      if (storedPrefs) {
        if (storedPrefs.locale) {
          initialLanguage = storedPrefs.locale;
        } else if (storedPrefs.language) {
          initialLanguage = storedPrefs.language;
        } else {
          initialLanguage = getBrowserLanguage();
        }
      } else {
        initialLanguage = getBrowserLanguage();
      }
    } else {
      initialLanguage = getBrowserLanguage();
    }
  } else {
    initialLanguage = getBrowserLanguage();
  }
} catch (e) {
  initialLanguage = getBrowserLanguage();
}

// Update document attributes
if (typeof document !== 'undefined') {
  document.documentElement.lang = initialLanguage;
  document.documentElement.dir = 'ltr';
}

i18n
  .use(initReactI18next)
  .init({
    resources: {
      'pt-BR': { translation: ptBR },
      'en-US': { translation: enUS },
      'es-419': { translation: es419 },
    },
    lng: initialLanguage,
    fallbackLng: 'pt-BR',
    supportedLngs: ['pt-BR', 'en-US', 'es-419'],
    defaultNS: 'translation',
    interpolation: {
      escapeValue: false, // React already safes from xss
    },
  });

export default i18n;
