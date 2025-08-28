import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

import en from './locales/en.json';
import sw from './locales/sw.json';
import ar from './locales/ar.json';
import fr from './locales/fr.json';

const LANGUAGE_DETECTOR = {
  type: 'languageDetector',
  async: true,
  detect: async (callback) => {
    try {
      const language = await AsyncStorage.getItem('user-language');
      if (language) {
        callback(language);
      } else {
        callback('en');
      }
    } catch (error) {
      console.error('Error detecting language:', error);
      callback('en');
    }
  },
  init: () => {},
  cacheUserLanguage: async (language) => {
    try {
      await AsyncStorage.setItem('user-language', language);
    } catch (error) {
      console.error('Error caching language:', error);
    }
  },
};

export const initializeI18n = () => {
  i18n
    .use(LANGUAGE_DETECTOR)
    .use(initReactI18next)
    .init({
      compatibilityJSON: 'v3',
      resources: {
        en: { translation: en },
        sw: { translation: sw },
        ar: { translation: ar },
        fr: { translation: fr },
      },
      fallbackLng: 'en',
      debug: __DEV__,
      interpolation: {
        escapeValue: false,
      },
      react: {
        useSuspense: false,
      },
    });
};

export default i18n;
