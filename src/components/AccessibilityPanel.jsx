import { useState, useEffect, useRef } from 'react';
import './AccessibilityPanel.css';

const FONT_SIZES = [
  { key: 'normal', size: '16px' },
  { key: 'large',  size: '18px' },
  { key: 'xlarge', size: '20px' },
];

const CONTRASTS = [
  { key: 'normal',   label: 'A', title: 'Oddiy' },
  { key: 'high',     label: 'A', title: 'Yuqori kontrast' },
  { key: 'inverted', label: 'A', title: 'Teskari' },
];

const ACCENT_COLORS = [
  { key: 'silver', label: 'Kumush',  color: '#d4d4d4', rgb: '212,212,212' },
  { key: 'purple', label: 'Binafsha', color: '#a855f7', rgb: '168,85,247' },
  { key: 'blue',   label: 'Ko\'k',   color: '#60a5fa', rgb: '96,165,250' },
  { key: 'cyan',   label: 'Moviy',   color: '#22d3ee', rgb: '34,211,238' },
  { key: 'green',  label: 'Yashil',  color: '#4ade80', rgb: '74,222,128' },
  { key: 'orange', label: 'To\'q sariq', color: '#fb923c', rgb: '251,146,60' },
  { key: 'pink',   label: 'Pushti',  color: '#f472b6', rgb: '244,114,182' },
  { key: 'red',    label: 'Qizil',   color: '#f87171', rgb: '248,113,113' },
];

export default function AccessibilityPanel() {
  const [open, setOpen] = useState(false);
  const [fontSize, setFontSize] = useState(() => localStorage.getItem('a11y-font') || 'normal');
  const [contrast, setContrast] = useState(() => localStorage.getItem('a11y-contrast') || 'normal');
  const [accentKey, setAccentKey] = useState(() => localStorage.getItem('a11y-accent') || 'silver');
  const panelRef = useRef(null);

  useEffect(() => {
    const size = FONT_SIZES.find(f => f.key === fontSize)?.size || '16px';
    document.documentElement.style.setProperty('--base-font-size', size);
    localStorage.setItem('a11y-font', fontSize);
  }, [fontSize]);

  useEffect(() => {
    document.documentElement.setAttribute('data-contrast', contrast);
    localStorage.setItem('a11y-contrast', contrast);
  }, [contrast]);

  useEffect(() => {
    const found = ACCENT_COLORS.find(c => c.key === accentKey) || ACCENT_COLORS[0];
    document.documentElement.style.setProperty('--accent', found.color);
    document.documentElement.style.setProperty('--accent2', found.color);
    document.documentElement.style.setProperty('--accent3', found.color);
    document.documentElement.style.setProperty('--accent-rgb', found.rgb);
    document.documentElement.style.setProperty('--glow', `rgba(${found.rgb}, 0.08)`);
    localStorage.setItem('a11y-accent', accentKey);
  }, [accentKey]);

  // Apply saved accent on mount
  useEffect(() => {
    const saved = localStorage.getItem('a11y-accent') || 'silver';
    const found = ACCENT_COLORS.find(c => c.key === saved) || ACCENT_COLORS[0];
    document.documentElement.style.setProperty('--accent', found.color);
    document.documentElement.style.setProperty('--accent2', found.color);
    document.documentElement.style.setProperty('--accent3', found.color);
    document.documentElement.style.setProperty('--accent-rgb', found.rgb);
    document.documentElement.style.setProperty('--glow', `rgba(${found.rgb}, 0.08)`);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onClick = (e) => {
      if (!panelRef.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [open]);

  const handleReset = () => {
    setFontSize('normal');
    setContrast('normal');
    setAccentKey('silver');
  };

  return (
    <div className="a11y-wrapper" ref={panelRef}>
      <button
        className={`a11y-toggle ${open ? 'active' : ''}`}
        onClick={() => setOpen(o => !o)}
        aria-label="Maxsus imkoniyatlar"
        title="Maxsus imkoniyatlar"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="a11y-icon">
          <defs>
            <linearGradient id="a11y-g1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--accent)" stopOpacity="1"/>
              <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.3"/>
            </linearGradient>
            <filter id="a11y-glow">
              <feGaussianBlur stdDeviation="0.6" result="blur"/>
              <feComposite in="SourceGraphic" in2="blur" operator="over"/>
            </filter>
          </defs>
          {/* Hexagon outer */}
          <path
            d="M12 1.5L21 6.5V17.5L12 22.5L3 17.5V6.5Z"
            stroke="url(#a11y-g1)" strokeWidth="0.7" fill="none"
            strokeDasharray="2.5 1.5" className="a11y-orbit"
          />
          {/* Hexagon inner solid */}
          <path
            d="M12 4.5L18.5 8.25V15.75L12 19.5L5.5 15.75V8.25Z"
            stroke="var(--accent)" strokeWidth="0.4" fill="none" opacity="0.25"
          />
          {/* Head dot */}
          <circle cx="12" cy="8" r="1.6" fill="url(#a11y-g1)" filter="url(#a11y-glow)"/>
          {/* Shoulders bar */}
          <path d="M9 11.5h6" stroke="url(#a11y-g1)" strokeWidth="1.6" strokeLinecap="round"/>
          {/* Spine */}
          <line x1="12" y1="11.5" x2="12" y2="15.5" stroke="url(#a11y-g1)" strokeWidth="1.6" strokeLinecap="round"/>
          {/* Legs */}
          <line x1="12" y1="15.5" x2="9.5" y2="18.5" stroke="url(#a11y-g1)" strokeWidth="1.6" strokeLinecap="round"/>
          <line x1="12" y1="15.5" x2="14.5" y2="18.5" stroke="url(#a11y-g1)" strokeWidth="1.6" strokeLinecap="round"/>
          {/* Corner nodes */}
          <circle cx="12" cy="1.5" r="0.8" fill="var(--accent)" opacity="0.7" className="a11y-node"/>
          <circle cx="21" cy="6.5" r="0.8" fill="var(--accent)" opacity="0.5"/>
          <circle cx="21" cy="17.5" r="0.8" fill="var(--accent)" opacity="0.5"/>
          <circle cx="12" cy="22.5" r="0.8" fill="var(--accent)" opacity="0.7"/>
          <circle cx="3" cy="17.5" r="0.8" fill="var(--accent)" opacity="0.5"/>
          <circle cx="3" cy="6.5" r="0.8" fill="var(--accent)" opacity="0.5"/>
        </svg>
      </button>

      <div className={`a11y-panel ${open ? 'open' : ''}`}>
        <div className="a11y-panel-header">
          <span>Maxsus imkoniyatlar</span>
          <button className="a11y-close" onClick={() => setOpen(false)}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Accent Color */}
        <div className="a11y-section">
          <p className="a11y-label">Loyha rangi</p>
          <div className="color-grid">
            {ACCENT_COLORS.map(c => (
              <button
                key={c.key}
                className={`color-swatch ${accentKey === c.key ? 'selected' : ''}`}
                style={{ '--swatch-color': c.color }}
                onClick={() => setAccentKey(c.key)}
                title={c.label}
              />
            ))}
          </div>
        </div>

        {/* Font size */}
        <div className="a11y-section">
          <p className="a11y-label">Matn o'lchami</p>
          <div className="a11y-row">
            {FONT_SIZES.map((f, i) => (
              <button
                key={f.key}
                className={`a11y-btn font-btn ${fontSize === f.key ? 'selected' : ''}`}
                onClick={() => setFontSize(f.key)}
                style={{ fontSize: i === 0 ? '13px' : i === 1 ? '16px' : '19px' }}
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

        <button className="a11y-reset" onClick={handleReset}>
          Qayta tiklash
        </button>
      </div>
    </div>
  );
}
