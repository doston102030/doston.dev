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
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="5" r="1.5" fill="currentColor" />
          <path d="M9 9h6M12 9v11M9 14l-3 6M15 14l3 6" />
          <circle cx="12" cy="12" r="10" strokeOpacity="0.3" />
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
