import React, { useEffect, useState } from 'react';
import logoImg from '../assets/media/jawzaa-logo.webp';
import { useLanguage } from '../context/LanguageContext.jsx';

export default function SplashScreen() {
  const { isRTL } = useLanguage();
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    // Fade out after 1000ms, completely unmount after 1400ms
    const timer1 = setTimeout(() => {
      setFading(true);
    }, 900);

    const timer2 = setTimeout(() => {
      setVisible(false);
    }, 1350);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`jawzaa-splash-screen ${fading ? 'splash-fade-out' : ''}`}
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 999999,
        background: 'linear-gradient(135deg, #071F36 0%, #082B4C 50%, #0A355C 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: fading ? 0 : 1,
        transition: 'opacity 0.45s cubic-bezier(0.4, 0, 0.2, 1)',
        pointerEvents: fading ? 'none' : 'all',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '20px',
        }}
      >
        <div
          style={{
            position: 'relative',
            width: '100px',
            height: '100px',
            marginBottom: '20px',
            borderRadius: '24px',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1.5px solid rgba(255, 196, 0, 0.4)',
            boxShadow: '0 0 35px rgba(255, 196, 0, 0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}
        >
          <img
            src={logoImg}
            alt="Jawzaa Tabreed Taykeef"
            style={{
              width: '74px',
              height: '74px',
              objectFit: 'contain',
              filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.4))',
            }}
          />
        </div>

        <h2
          style={{
            fontSize: '1.45rem',
            fontWeight: '900',
            color: '#FFFFFF',
            margin: '0 0 6px',
            letterSpacing: isRTL ? '0' : '0.5px',
          }}
        >
          {isRTL ? 'جوزاء للتبريد والتكييف' : 'Jawzaa Tabreed Taykeef'}
        </h2>
        <p
          style={{
            fontSize: '0.85rem',
            fontWeight: '700',
            color: '#FFC400',
            margin: '0 0 24px',
            letterSpacing: '1px',
            textTransform: 'uppercase',
          }}
        >
          {isRTL ? 'المركز الهندسي المعتمد بالرياض' : 'HVAC & Appliance Engineering Center'}
        </p>

        {/* Golden Progress Bar */}
        <div
          style={{
            width: '180px',
            height: '3px',
            background: 'rgba(255, 255, 255, 0.15)',
            borderRadius: '4px',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          <div
            className="splash-progress-bar"
            style={{
              height: '100%',
              width: '100%',
              background: 'linear-gradient(90deg, #FFC400, #FFE082, #FFC400)',
              borderRadius: '4px',
            }}
          />
        </div>
      </div>
    </div>
  );
}
