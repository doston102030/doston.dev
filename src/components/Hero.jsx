import { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import './Hero.css';


export default function Hero({ onPortalOpen }) {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const [fsData, setFsData] = useState(null);

  useEffect(() => {
    getDoc(doc(db, 'portfolio', 'hero')).then(snap => {
      if (snap.exists()) setFsData(snap.data());
    }).catch(err => console.error("Firestore error:", err));
  }, []);

  const val = (fsKey, tKey) => (fsData && fsData[fsKey]) || t(tKey);

  const parseTagline = (text) => {
    if (!text) return null;
    const parts = text.split(/(\{y\}.*?\{\/y\}|\{b\}.*?\{\/b\})/g);
    return parts.map((part, i) => {
      if (part.startsWith('{y}')) {
        return <mark key={i} className="mark-yellow">{part.replace(/\{y\}|\{\/y\}/g, '')}</mark>;
      }
      if (part.startsWith('{b}')) {
        return <span key={i} className="mark-blue">{part.replace(/\{b\}|\{\/b\}/g, '')}</span>;
      }
      return part;
    });
  };

  return (
    <section className="hero section" id="home">
      <div className="container hero-container">
        {/* LEFT CONTENT */}
        <div className="hero-content">


          <h1 className="hero-name animate-fade-up delay-1">
            {val('name1', 'Adhamjonov')}<br />
            <span>{val('name2', 'Doston')}</span>
          </h1>

          <div className="hero-role-wrapper animate-fade-up delay-2">
            <div className="premium-badge">
              <span className="badge-glow" />
              <span className="badge-text">
                {val('role', 'hero.role').split(' ').map((word, wIdx) => (
                  <span key={wIdx} className="word-wrapper" style={{ display: 'inline-flex', whiteSpace: 'nowrap' }}>
                    {word.split('').map((char, cIdx) => (
                      <span key={cIdx} className="letter">{char}</span>
                    ))}
                    {wIdx < val('role', 'hero.role').split(' ').length - 1 && (
                      <span className="letter">&nbsp;</span>
                    )}
                  </span>
                ))}
              </span>
            </div>
          </div>


          <div className="hero-philosophy animate-fade-up delay-3">
            <p className="philosophy-text">
              {parseTagline(t('hero.tagline'))}
            </p>
          </div>

          <div className="hero-actions animate-fade-up delay-4">
            <a href={fsData?.cvUrl || "/cv.pdf"} download="Adhamjonov_Doston_CV.pdf" className="btn-primary">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
              </svg>
              {t('hero.downloadCv')}
            </a>
            <a href="#contact" className="btn-outline">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 12a19.79 19.79 0 01-3.07-8.67A2 2 0 012 1.18h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
              </svg>
              {t('hero.contactMe')}
            </a>

          </div>

        </div>

        {/* RIGHT: AVATAR */}
        <div className="hero-visual animate-fade-up delay-3">
          <div className="hero-avatar-wrapper">
            <div className="hero-avatar">
              <div className="hero-avatar-inner">
                {fsData?.avatarUrl ? (
                  <img src={fsData.avatarUrl} alt="Profile" className="hero-img" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div className="illustration-wrapper">
                    {/* Local Image Fallback */}
                    <img
                      src="/avatar.jpg"
                      alt="Profile"
                      className="hero-img local-avatar"
                      style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0, zIndex: 5 }}
                      onLoad={(e) => {
                        const placeholder = e.target.parentElement.querySelector('.avatar-placeholder');
                        if (placeholder) placeholder.style.opacity = '0';
                      }}
                      onError={(e) => e.target.style.display = 'none'}
                    />

                    {/* Theme-based Illustration (Optional) */}
                    <div className={`hero-illustration ${theme}`}>
                      <img src="/hero-day.png" alt="" className="illustration-img day" onError={(e) => e.target.style.display = 'none'} />
                      <img src="/hero-night.png" alt="" className="illustration-img night" onError={(e) => e.target.style.display = 'none'} />
                    </div>

                    {/* Initials Placeholder - only visible if image fails */}
                    <div className="avatar-placeholder" style={{ transition: 'opacity 0.6s ease' }}>
                      <div className="placeholder-glow" />
                      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="avatar-svg">
                        <circle cx="50" cy="38" r="20" fill="#6382ff" opacity="0.3" />
                        <ellipse cx="50" cy="85" rx="30" ry="20" fill="#6382ff" opacity="0.2" />
                      </svg>
                      <span className="avatar-initials">{val('initials', 'DA')}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Rotating Rings */}
            <div className="avatar-rings">
              <div className="avatar-ring ring-1" />
              <div className="avatar-ring ring-2" />
              <div className="avatar-ring ring-3" />
            </div>

            {/* floating badges */}
            <div className="avatar-badge avatar-badge--tl">
              {val('badgeTL', 'hero.dev')}
            </div>
            <div className="avatar-badge avatar-badge--br">
              {val('badgeBR', 'hero.years')}
            </div>
          </div>

        </div>
      </div>

      {/* Floating AI Portal Trigger */}
      <button className="btn-portal-floating" onClick={onPortalOpen}>
        <span className="portal-icon">&gt;_</span>
        <span className="portal-label">AI</span>
        <span className="portal-cursor" />
      </button>
    </section>
  );
}
