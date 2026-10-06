import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext.jsx';
import { initGsapAnimations } from '../utils/gsapAnimations.js';

export default function SiteMotion() {
  const { pathname } = useLocation();
  const { lang } = useLanguage();
  useEffect(() => {
    const root = document.getElementById('root');
    return initGsapAnimations(root);
  }, [pathname, lang]);
  return null;
}
