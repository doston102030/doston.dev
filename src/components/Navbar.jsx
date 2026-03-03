import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import './Navbar.css';

const Gradients = () => (
  <svg style={{ height: 0, width: 0, position: 'absolute' }}>
    <defs>
      <linearGradient id="premium-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#6366f1" />
        <stop offset="100%" stopColor="#a855f7" />
      </linearGradient>
      <radialGradient id="sun-gradient" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#fbbf24" />
        <stop offset="70%" stopColor="#f59e0b" />
        <stop offset="100%" stopColor="#d97706" />
      </radialGradient>
      <radialGradient id="moon-gradient" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#f8fafc" />
        <stop offset="100%" stopColor="#94a3b8" />
      </radialGradient>
      <filter id="glow">
        <feGaussianBlur stdDeviation="1.5" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>
  </svg>
);

const UZFlag = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <clipPath id="clip-uz">
      <circle cx="12" cy="12" r="10" />
    </clipPath>
    <g clipPath="url(#clip-uz)">
      <rect width="24" height="6.6" fill="#0099B5" />
      <rect y="6.6" width="24" height="0.4" fill="#CE1126" />
      <rect y="7" width="24" height="10" fill="white" />
      <rect y="17" width="24" height="0.4" fill="#CE1126" />
      <rect y="17.4" width="24" height="6.6" fill="#1EB53A" />
      <circle cx="6" cy="3.5" r="1.5" fill="white" />
      <circle cx="6.8" cy="3.5" r="1.5" fill="#0099B5" />
      <circle cx="10" cy="2.5" r="0.3" fill="white" />
      <circle cx="11" cy="2.5" r="0.3" fill="white" />
      <circle cx="10" cy="4.5" r="0.3" fill="white" />
    </g>
    <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
  </svg>
);

const RUFlag = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <clipPath id="clip-ru">
      <circle cx="12" cy="12" r="10" />
    </clipPath>
    <g clipPath="url(#clip-ru)">
      <rect width="24" height="8" fill="white" />
      <rect y="8" width="24" height="8" fill="#0039A6" />
      <rect y="16" width="24" height="8" fill="#D52B1E" />
    </g>
    <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
  </svg>
);

const ENFlag = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <clipPath id="clip-en">
      <circle cx="12" cy="12" r="10" />
    </clipPath>
    <g clipPath="url(#clip-en)">
      <rect width="24" height="24" fill="#012169" />
      <path d="M0 0L24 24M24 0L0 24" stroke="white" strokeWidth="2.5" />
      <path d="M0 0L24 24M24 0L0 24" stroke="#C8102E" strokeWidth="1.5" />
      <path d="M12 0V24M0 12H24" stroke="white" strokeWidth="4" />
      <path d="M12 0V24M0 12H24" stroke="#C8102E" strokeWidth="2.5" />
    </g>
    <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
  </svg>
);

const MoonIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" fill="url(#moon-gradient)" />
    <circle cx="15" cy="10" r="0.8" fill="white" fillOpacity="0.4" />
    <circle cx="12" cy="15" r="1.2" fill="white" fillOpacity="0.2" />
    <path d="M18 5L17 7L19 7L18 5Z" fill="#6366f1" fillOpacity="0.6" />
  </svg>
);

const SunIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="5" fill="url(#sun-gradient)" />
    {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
      <rect
        key={angle}
        x="11.5" y="1" width="1" height={i % 2 === 0 ? "4" : "2"}
        rx="0.5"
        fill="#fbbf24"
        transform={`rotate(${angle} 12 12)`}
      />
    ))}
    <circle cx="12" cy="12" r="8" stroke="#fbbf24" strokeWidth="0.5" strokeDasharray="2 2" opacity="0.3" />
  </svg>
);

const UZGerb = () => (
  <img
    src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Emblem_of_Uzbekistan.svg/512px-Emblem_of_Uzbekistan.svg.png"
    alt="Uzbekistan Emblem"
    style={{
      width: '30px',
      height: '30px',
      display: 'inline-block',
      verticalAlign: 'middle',
      objectFit: 'contain',
      marginLeft: '10px'
    }}
    onError={(e) => {
      e.target.src = "/uz-gerb.svg";
    }}
  />
);

export default function Navbar() {
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const headerRef = useRef(null);
  const [active, setActive] = useState('home');
  const [langOpen, setLangOpen] = useState(false);

  const navLinks = [
    { key: 'nav.home', href: '#home' },
    { key: 'nav.about', href: '#about' },
    { key: 'nav.skills', href: '#skills' },
    { key: 'nav.projects', href: '#projects' },
    { key: 'nav.contact', href: '#contact' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      headerRef.current?.classList.toggle('scrolled', window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);

    const options = {
      root: null,
      rootMargin: '-30% 0px -30% 0px',
      threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActive(entry.target.id);
        }
      });
    }, options);

    const sections = ['home', 'about', 'skills', 'projects', 'contact'];
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const close = () => setLangOpen(false);
    if (langOpen) document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, [langOpen]);

  return (
    <header className="navbar" ref={headerRef}>
      <Gradients />
      <div className="nav-container">

        <a href="#home" className="nav-logo" onClick={() => setActive('home')}>
          <span className="logo-text">{'<'}Uzdev{'/>'}</span>
          <UZGerb />
        </a>

        <nav className="nav-links">
          {navLinks.map((link) => (
            <a
              key={link.key}
              href={link.href}
              className={active === link.href.replace('#', '') ? 'active' : ''}
              onClick={() => setActive(link.href.replace('#', ''))}
            >
              {t(link.key)}
            </a>
          ))}
        </nav>

        {/* Controls */}
        <div className="nav-controls">
          <div className="lang-dropdown">
            <button
              className="lang-toggle"
              onClick={(e) => { e.stopPropagation(); setLangOpen(!langOpen); }}
              aria-label="Change language"
            >
              {language === 'uz' ? <UZFlag /> : language === 'ru' ? <RUFlag /> : <ENFlag />}
              <span className="lang-code">{language.toUpperCase()}</span>
            </button>
            <div className={`lang-menu ${langOpen ? 'open' : ''}`} onClick={(e) => e.stopPropagation()}>
              {[
                { code: 'uz', icon: <UZFlag /> },
                { code: 'ru', icon: <RUFlag /> },
                { code: 'en', icon: <ENFlag /> }
              ].map((lang) => (
                <div
                  key={lang.code}
                  className={`lang-item ${language === lang.code ? 'active' : ''}`}
                  onClick={() => { setLanguage(lang.code); setLangOpen(false); }}
                >
                  <span className="lang-item-icon">{lang.icon}</span>
                  {lang.code.toUpperCase()}
                </div>
              ))}
            </div>
          </div>

          {/* Theme Toggle */}
          <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
          </button>
        </div>
      </div>
    </header>
  );
}
