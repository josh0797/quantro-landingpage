import React from 'react';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage';
import { translateAuthRoute } from '../lib/authRoutes';

const LanguageSwitcher = ({ className = '' }) => {
  const { language, setLanguage, isHydrated } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();

  const changeLanguage = (next) => {
    if (next === language) return;
    setLanguage(next);
    // If we're on an auth route, redirect to the equivalent in the new lang
    const equivalent = translateAuthRoute(location.pathname, next);
    if (equivalent && equivalent !== location.pathname) {
      navigate(equivalent, { replace: true });
    }
  };

  if (!isHydrated) {
    return (
      <div className={`flex items-center gap-1 bg-slate-800/50 rounded-full p-1 ${className}`}>
        <div className="px-3 py-1.5 text-xs font-medium text-slate-400">ES</div>
        <div className="px-3 py-1.5 text-xs font-medium text-slate-400">EN</div>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-1 bg-slate-800/50 border border-slate-700/50 rounded-full p-1 ${className}`}>
      <motion.button
        onClick={() => changeLanguage('es')}
        data-testid="lang-toggle-es"
        aria-label="Switch to Spanish"
        className={`relative px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
          language === 'es' 
            ? 'text-[#0A0F1C]' 
            : 'text-slate-400 hover:text-white'
        }`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {language === 'es' && (
          <motion.div
            layoutId="lang-indicator"
            className="absolute inset-0 bg-[#00F5FF] rounded-full"
            initial={false}
            transition={{ type: "spring", duration: 0.4, bounce: 0.2 }}
          />
        )}
        <span className="relative z-10">ES</span>
      </motion.button>
      
      <motion.button
        onClick={() => changeLanguage('en')}
        data-testid="lang-toggle-en"
        aria-label="Switch to English"
        className={`relative px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
          language === 'en' 
            ? 'text-[#0A0F1C]' 
            : 'text-slate-400 hover:text-white'
        }`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {language === 'en' && (
          <motion.div
            layoutId="lang-indicator"
            className="absolute inset-0 bg-[#00F5FF] rounded-full"
            initial={false}
            transition={{ type: "spring", duration: 0.4, bounce: 0.2 }}
          />
        )}
        <span className="relative z-10">EN</span>
      </motion.button>
    </div>
  );
};

export default LanguageSwitcher;
