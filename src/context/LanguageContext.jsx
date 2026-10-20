import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import enTranslations from '../locales/en.json';
import teTranslations from '../locales/te.json';
import { getTranslatedContent } from '../locales/dynamicTerms';

const LanguageContext = createContext(null);

const TRANSLATIONS = {
  en: enTranslations,
  te: teTranslations
};

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => {
    try {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('gs_language');
        if (saved === 'te' || saved === 'en') return saved;
      }
    } catch {
      // localStorage unavailable or private mode
    }
    return 'en';
  });

  // Keep <html> lang attribute in sync
  useEffect(() => {
    try {
      if (typeof document !== 'undefined') {
        document.documentElement.lang = language;
      }
    } catch {
      // ignore
    }
  }, [language]);

  const setLanguage = useCallback((newLang) => {
    if (newLang !== 'en' && newLang !== 'te') return;
    setLanguageState(newLang);
    try {
      localStorage.setItem('gs_language', newLang);
    } catch {
      // ignore
    }
  }, []);

  const toggleLanguage = useCallback(() => {
    setLanguage(language === 'te' ? 'en' : 'te');
  }, [language, setLanguage]);

  /**
   * Translate static UI strings
   * Example: t('nav.home'), t('shop.showing_products', { count: 5, total: 20 })
   */
  const t = useCallback((keyPath, paramsOrFallback = {}, maybeFallback = null) => {
    if (!keyPath) return '';

    let params = {};
    let fallbackText = null;
    if (typeof paramsOrFallback === 'string') {
      fallbackText = paramsOrFallback;
    } else if (paramsOrFallback && typeof paramsOrFallback === 'object') {
      params = paramsOrFallback;
    }
    if (maybeFallback && typeof maybeFallback === 'string') {
      fallbackText = maybeFallback;
    }

    const getVal = (obj, path) => {
      if (!obj) return null;
      const parts = path.split('.');
      let current = obj;
      for (const part of parts) {
        if (current && typeof current === 'object' && part in current) {
          current = current[part];
        } else {
          return null;
        }
      }
      return current;
    };

    // 1. Try current language
    let val = getVal(TRANSLATIONS[language], keyPath);

    // 2. Fallback to English if missing in Telugu
    if (val === null && language !== 'en') {
      val = getVal(TRANSLATIONS.en, keyPath);
    }

    // 3. Fallback to fallbackText or key itself if not found anywhere
    if (val === null || val === undefined) {
      return fallbackText !== null ? fallbackText : keyPath;
    }

    // If string with parameters, interpolate {param}
    if (typeof val === 'string' && Object.keys(params).length > 0) {
      return val.replace(/\{(\w+)\}/g, (_, k) => (params[k] !== undefined ? params[k] : `{${k}}`));
    }

    return val;
  }, [language]);

  /**
   * Translate dynamic database items (Products, Categories, Poojas, Homams)
   */
  const translateDynamic = useCallback((itemOrText, field = 'name') => {
    return getTranslatedContent(itemOrText, field, language);
  }, [language]);

  const value = useMemo(() => ({
    language,
    setLanguage,
    toggleLanguage,
    t,
    translateDynamic,
    isTelugu: language === 'te'
  }), [language, setLanguage, toggleLanguage, t, translateDynamic]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

export default LanguageContext;
