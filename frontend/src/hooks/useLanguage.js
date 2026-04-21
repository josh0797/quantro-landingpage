import { useState, useEffect, useCallback, createContext, useContext } from 'react';
import translations from '../i18n';

// Language Context
const LanguageContext = createContext(null);

// Default language
const DEFAULT_LANGUAGE = 'es';
const STORAGE_KEY = 'quantro-language';

// Detect browser language
const detectBrowserLanguage = () => {
  if (typeof window === 'undefined') return DEFAULT_LANGUAGE;
  
  const browserLang = navigator.language || navigator.userLanguage;
  if (browserLang?.startsWith('es')) return 'es';
  if (browserLang?.startsWith('en')) return 'en';
  
  return DEFAULT_LANGUAGE;
};

// Get initial language from localStorage or browser
const getInitialLanguage = () => {
  if (typeof window === 'undefined') return DEFAULT_LANGUAGE;
  
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored && (stored === 'es' || stored === 'en')) {
    return stored;
  }
  
  return detectBrowserLanguage();
};

// Language Provider Component
export const LanguageProvider = ({ children }) => {
  const [language, setLanguageState] = useState(DEFAULT_LANGUAGE);
  const [isHydrated, setIsHydrated] = useState(false);

  // Hydrate language from localStorage on mount
  useEffect(() => {
    const initialLang = getInitialLanguage();
    setLanguageState(initialLang);
    setIsHydrated(true);
  }, []);

  // Set language and persist to localStorage
  const setLanguage = useCallback((newLang) => {
    if (newLang !== 'es' && newLang !== 'en') return;
    
    setLanguageState(newLang);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, newLang);
    }
  }, []);

  // Toggle between languages
  const toggleLanguage = useCallback(() => {
    setLanguage(language === 'es' ? 'en' : 'es');
  }, [language, setLanguage]);

  // Translation function
  const t = useCallback((key, fallback = null) => {
    const translation = translations[language]?.[key];
    
    if (translation !== undefined) {
      return translation;
    }
    
    // Try fallback language
    const fallbackTranslation = translations[DEFAULT_LANGUAGE]?.[key];
    if (fallbackTranslation !== undefined) {
      return fallbackTranslation;
    }
    
    // Return fallback or key
    return fallback || key;
  }, [language]);

  // Get localized value from object { es: '...', en: '...' }
  const tObj = useCallback((obj) => {
    if (!obj) return '';
    if (typeof obj === 'string') return obj;
    return obj[language] || obj[DEFAULT_LANGUAGE] || '';
  }, [language]);

  const value = {
    language,
    setLanguage,
    toggleLanguage,
    t,
    tObj,
    isHydrated,
    isSpanish: language === 'es',
    isEnglish: language === 'en'
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

// Hook to use language context
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  
  if (!context) {
    // Return default values if outside provider
    return {
      language: DEFAULT_LANGUAGE,
      setLanguage: () => {},
      toggleLanguage: () => {},
      t: (key) => translations[DEFAULT_LANGUAGE]?.[key] || key,
      tObj: (obj) => obj?.[DEFAULT_LANGUAGE] || '',
      isHydrated: false,
      isSpanish: true,
      isEnglish: false
    };
  }
  
  return context;
};

export default useLanguage;
