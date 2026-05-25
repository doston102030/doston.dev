import { useState, useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';
import './AccessibilityPanel.css';

const FONT_SIZES = [
  { key: 'normal', label: 'A', size: '16px' },
  { key: 'large',  label: 'A+', size: '18px' },
  { key: 'xlarge', label: 'A++', size: '20px' },
];

const CONTRASTS = [
  { key: 'normal',   label: 'A', title: 'Oddiy' },
  { key: 'high',     label: 'A', title: 'Yuqori kontrast' },
  { key: 'inverted', label: 'A', title: 'Teskari' },
];

export default function AccessibilityPanel() {
  const { theme, toggleTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const [fontSize, setFontSize]   = useState(() => localStorage.getItem('a11y-font') || 'normal');
  const [contrast, setContrast]   = useState(() => localStorage.getItem('a11y-contrast') || 'normal');
  const [themeMode, setThemeMode] = useState(() => localStorage.getItem('a11y-theme-mode') || 'dark');
  const panelRef = useRef(null);

  // Apply font size
  useEffect(() => {
    const size = FONT_SIZES.find(f => f.key === fontSize)?.size || '16px';
    document.documentElement.style.setProperty('--base-font-size', size);
    localStorage.setItem('a11y-font', fontSize);
  }, [fontSize]);

  // Apply contrast
  useEffect(() => {
    document.documentElement.setAttribute('data-contrast', contrast);
    localStorage.setItem('a11y-contrast', contrast);
  }, [contrast]);

  // Sync theme with ThemeContext
  const handleTheme = (mode) => {
    setThemeMode(mode);
    localStorage.setItem('a11y-theme-mode', mode);
    if (mode === 'system') {
      const sys = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', sys);
    } else {
      document.documentElement.setAttribute('data-theme', mode);
    }
  };

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const onClick = (e) => {
      if (!panelRef.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [open]);

  return (
    <div className="a11y-wrapper" ref={panelRef}>
      {/* Toggle button */}
      <button
        className={`a11y-toggle ${open ? 'active' : ''}`}
        onClick={() => setOpen(o => !o)}
        aria-label="Maxsus imkoniyatlar"
        title="Maxsus imkoniyatlar"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="5" r="1.5" fill="currentColor" />
          <path d="M9 9h6M12 9v11M9 14l-3 6M15 14l3 6" />
          <circle cx="12" cy="12" r="10" strokeOpacity="0.3" />
        </svg>
      </button>

      {/* Panel */}
      <div className={`a11y-panel ${open ? 'open' : ''}`}>
        <div className="a11y-panel-header">
          <span>Maxsus imkoniyatlar</span>
          <button className="a11y-close" onClick={() => setOpen(false)}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Theme */}
        <div className="a11y-section">
          <p className="a11y-label">Yorug'/Qorong'i mavzu</p>
          <div className="a11y-row">
            <button
              className={`a11y-btn icon-btn ${themeMode === 'light' ? 'selected' : ''}`}
              onClick={() => handleTheme('light')}
              title="Yorug' mavzu"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>
              </svg>
            </button>
            <button
              className={`a11y-btn icon-btn ${themeMode === 'dark' ? 'selected' : ''}`}
              onClick={() => handleTheme('dark')}
              title="Qorong'i mavzu"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z"/>
              </svg>
            </button>
            <button
              className={`a11y-btn icon-btn ${themeMode === 'system' ? 'selected' : ''}`}
              onClick={() => handleTheme('system')}
              title="Tizim mavzusi"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Font size */}
        <div className="a11y-section">
          <p className="a11y-label">Matn o'lchami</p>
          <div className="a11y-row">
            {FONT_SIZES.map(f => (
              <button
                key={f.key}
                className={`a11y-btn font-btn ${fontSize === f.key ? 'selected' : ''}`}
                onClick={() => setFontSize(f.key)}
                title={f.label}
                style={{ fontSize: f.key === 'normal' ? '13px' : f.key === 'large' ? '16px' : '19px' }}
              >
                A
              </button>
            ))}
          </div>
        </div>

        {/* Contrast */}
        <div className="a11y-section">
          <p className="a11y-label">Foydalanish imkoniyati</p>
          <div className="a11y-row">
            <button
              className={`a11y-btn contrast-btn contrast-normal ${contrast === 'normal' ? 'selected' : ''}`}
              onClick={() => setContrast('normal')}
              title="Oddiy"
            >A</button>
            <button
              className={`a11y-btn contrast-btn contrast-high ${contrast === 'high' ? 'selected' : ''}`}
              onClick={() => setContrast('high')}
              title="Yuqori kontrast"
            >A</button>
            <button
              className={`a11y-btn contrast-btn contrast-inverted ${contrast === 'inverted' ? 'selected' : ''}`}
              onClick={() => setContrast('inverted')}
              title="Teskari"
            >A</button>
          </div>
        </div>

        {/* Reset */}
        <button
          className="a11y-reset"
          onClick={() => {
            setFontSize('normal');
            setContrast('normal');
            handleTheme('dark');
          }}
        >
          Qayta tiklash
        </button>
      </div>
    </div>
  );
}
