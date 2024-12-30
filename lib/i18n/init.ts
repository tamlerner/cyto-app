'use client';

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { SUPPORTED_LANGUAGES } from '@/lib/constants';

// Import translations
import enCommon from '@/public/locales/en/common.json';
import ptCommon from '@/public/locales/pt/common.json';
import frCommon from '@/public/locales/fr/common.json';
import esCommon from '@/public/locales/es/common.json';

const resources = {
  en: { common: enCommon },
  pt: { common: ptCommon },
  fr: { common: frCommon },
  es: { common: esCommon },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    defaultNS: 'common',
    fallbackLng: 'en',
    supportedLngs: SUPPORTED_LANGUAGES.map(lang => lang.code),
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

export default i18n;