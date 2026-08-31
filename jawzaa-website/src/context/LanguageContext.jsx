import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('jawzaa_lang') || 'ar';
  });

  useEffect(() => {
    localStorage.setItem('jawzaa_lang', lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }, [lang]);

  const toggleLang = () => {
    setLang(prev => (prev === 'ar' ? 'en' : 'ar'));
  };

  const isRTL = lang === 'ar';

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
