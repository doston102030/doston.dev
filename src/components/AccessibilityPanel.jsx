import { useState, useEffect, useRef } from 'react';
import './AccessibilityPanel.css';

const FONT_SIZES = [
  { key: 'normal', size: '16px' },
  { key: 'large',  size: '18px' },
  { key: 'xlarge', size: '20px' },
];

const ACCENT_COLORS = [
  { key: 'silver', label: 'Kumush',      color: '#d4d4d4', rgb: '212,212,212' },
  { key: 'purple', label: 'Binafsha',    color: '#a855f7', rgb: '168,85,247'  },
  { key: 'blue',   label: "Ko'k",        color: '#60a5fa', rgb: '96,165,250'  },
  { key: 'cyan',   label: 'Moviy',       color: '#22d3ee', rgb: '34,211,238'  },
  { key: 'green',  label: 'Yashil',      color: '#4ade80', rgb: '74,222,128'  },
  { key: 'orange', label: "To'q sariq",  color: '#fb923c', rgb: '251,146,60'  },
  { key: 'pink',   label: 'Pushti',      color: '#f472b6', rgb: '244,114,182' },
  { key: 'red',    label: 'Qizil',       color: '#f87171', rgb: '248,113,113' },
];

const BG_THEMES = [
  {
    key: 'dark',
    label: 'Qora',
    vars: { '--bg': '#0a0a0a', '--bg2': '#131313', '--text': '#e0e0e0',
            '--surface': 'rgba(255,255,255,0.03)', '--surface2': 'rgba(255,255,255,0.06)',
            '--border': 'rgba(255,255,255,0.08)', '--text-muted': '#777', '--text-dim': '#444' },
    preview: '#0a0a0a', lines: ['#333', '#222'],
  },
  {
    key: 'light',
    label: 'Oq',
    vars: { '--bg': '#f5f2ed', '--bg2': '#ebe7e0', '--text': '#1a1a1a',
            '--surface': 'rgba(0,0,0,0.04)', '--surface2': 'rgba(0,0,0,0.07)',
            '--border': 'rgba(0,0,0,0.12)', '--text-muted': '#4a4a4a', '--text-dim': '#7a7a7a' },
    preview: '#f5f2ed', lines: ['#d0ccc5', '#e0ddd8'],
  },
  {
    key: 'navy',
    label: 'Dengiz',
    vars: { '--bg': '#060d1f', '--bg2': '#0a1628', '--text': '#c8d8ff',
            '--surface': 'rgba(100,140,255,0.05)', '--surface2': 'rgba(100,140,255,0.09)',
            '--border': 'rgba(100,140,255,0.15)', '--text-muted': '#5a7aaa', '--text-dim': '#2a3a5a' },
    preview: '#060d1f', lines: ['#0a1628', '#0d1e38'],
  },
  {
    key: 'forest',
    label: "O'rmon",
    vars: { '--bg': '#061209', '--bg2': '#0a1e0e', '--text': '#c8f0d4',
            '--surface': 'rgba(80,200,100,0.05)', '--surface2': 'rgba(80,200,100,0.09)',
            '--border': 'rgba(80,200,100,0.15)', '--text-muted': '#4a8a5a', '--text-dim': '#1a3a22' },
    preview: '#061209', lines: ['#0a1e0e', '#0d2812'],
  },
  {
    key: 'wine',
    label: 'Vino',
    vars: { '--bg': '#12060a', '--bg2': '#1e0a10', '--text': '#f0ccd8',
            '--surface': 'rgba(200,60,100,0.05)', '--surface2': 'rgba(200,60,100,0.09)',
            '--border': 'rgba(200,60,100,0.15)', '--text-muted': '#8a3a54', '--text-dim': '#3a1020' },
    preview: '#12060a', lines: ['#1e0a10', '#280d16'],
  },
  {
    key: 'contrast',
    label: 'Kontrast',
    vars: { '--bg': '#000000', '--bg2': '#0a0a0a', '--text': '#ffffff',
            '--surface': 'rgba(255,255,255,0.06)', '--surface2': 'rgba(255,255,255,0.1)',
            '--border': 'rgba(255,255,255,0.25)', '--text-muted': '#aaaaaa', '--text-dim': '#555' },
    preview: '#000000', lines: ['#1a1a1a', '#111'],
  },
];

function applyBgTheme(theme) {
  const root = document.documentElement;
  Object.entries(theme.vars).forEach(([k, v]) => root.style.setProperty(k, v));
}

export default function AccessibilityPanel() {
  const [open, setOpen]       = useState(false);
  const [fontSize, setFontSize] = useState(() => localStorage.getItem('a11y-font') || 'normal');
  const [bgKey, setBgKey]     = useState(() => localStorage.getItem('a11y-bg') || 'dark');
  const [accentKey, setAccentKey] = useState(() => localStorage.getItem('a11y-accent') || 'silver');
  const panelRef = useRef(null);

  // Font size
  useEffect(() => {
    const size = FONT_SIZES.find(f => f.key === fontSize)?.size || '16px';
    document.documentElement.style.setProperty('--base-font-size', size);
    localStorage.setItem('a11y-font', fontSize);
  }, [fontSize]);

  // Background theme
  useEffect(() => {
    const found = BG_THEMES.find(b => b.key === bgKey) || BG_THEMES[0];
    applyBgTheme(found);
    localStorage.setItem('a11y-bg', bgKey);
  }, [bgKey]);

  // Accent color
  useEffect(() => {
    const found = ACCENT_COLORS.find(c => c.key === accentKey) || ACCENT_COLORS[0];
    const root = document.documentElement;
    root.style.setProperty('--accent',     found.color);
    root.style.setProperty('--accent2',    found.color);
    root.style.setProperty('--accent3',    found.color);
    root.style.setProperty('--accent-rgb', found.rgb);
    root.style.setProperty('--glow', `rgba(${found.rgb}, 0.08)`);
    localStorage.setItem('a11y-accent', accentKey);
  }, [accentKey]);

  // Apply saved on mount
  useEffect(() => {
    const savedBg     = localStorage.getItem('a11y-bg')     || 'dark';
    const savedAccent = localStorage.getItem('a11y-accent') || 'silver';
    const bg     = BG_THEMES.find(b => b.key === savedBg)     || BG_THEMES[0];
    const accent = ACCENT_COLORS.find(c => c.key === savedAccent) || ACCENT_COLORS[0];
    applyBgTheme(bg);
    const root = document.documentElement;
    root.style.setProperty('--accent',     accent.color);
    root.style.setProperty('--accent2',    accent.color);
    root.style.setProperty('--accent3',    accent.color);
    root.style.setProperty('--accent-rgb', accent.rgb);
    root.style.setProperty('--glow', `rgba(${accent.rgb}, 0.08)`);
  }, []);

  // Outside click
  useEffect(() => {
    if (!open) return;
    const onClick = (e) => { if (!panelRef.current?.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [open]);

  const handleReset = () => {
    setFontSize('normal');
    setBgKey('dark');
    setAccentKey('silver');
  };

  return (
    <div className="a11y-wrapper" ref={panelRef}>
      {/* Icon button */}
      <button
        className={`a11y-toggle ${open ? 'active' : ''}`}
        onClick={() => setOpen(o => !o)}
        aria-label="Maxsus imkoniyatlar"
        title="Maxsus imkoniyatlar"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="a11y-icon">
          <defs>
            <linearGradient id="pr-g1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--accent)" stopOpacity="1"/>
              <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.4"/>
            </linearGradient>
            <linearGradient id="pr-g2" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.8"/>
              <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.2"/>
            </linearGradient>
            <filter id="pr-glow">
              <feGaussianBlur stdDeviation="0.8" result="blur"/>
              <feComposite in="SourceGraphic" in2="blur" operator="over"/>
            </filter>
          </defs>
          {/* Outer spin ring */}
          <circle cx="12" cy="12" r="10.5"
            stroke="url(#pr-g1)" strokeWidth="0.6"
            strokeDasharray="4 2" className="a11y-spin-outer"
          />
          {/* Inner spin ring reverse */}
          <circle cx="12" cy="12" r="7.5"
            stroke="url(#pr-g2)" strokeWidth="0.5"
            strokeDasharray="2 3" className="a11y-spin-inner"
          />
          {/* Center diamond */}
          <path
            d="M12 6.5L15.5 12L12 17.5L8.5 12Z"
            fill="url(#pr-g1)" opacity="0.9"
            filter="url(#pr-glow)"
            className="a11y-diamond"
          />
          {/* Diamond inner highlight */}
          <path d="M12 8.5L14 12L12 15.5L10 12Z" fill="var(--accent)" opacity="0.3"/>
          {/* Top glow dot */}
          <circle cx="12" cy="1.5"  r="1.2" fill="var(--accent)" opacity="0.8" className="a11y-dot-t"/>
          <circle cx="22.5" cy="12" r="1.2" fill="var(--accent)" opacity="0.6"/>
          <circle cx="12" cy="22.5" r="1.2" fill="var(--accent)" opacity="0.8"/>
          <circle cx="1.5"  cy="12" r="1.2" fill="var(--accent)" opacity="0.6"/>
          {/* Cross rays */}
          <line x1="12" y1="3"  x2="12" y2="6.5"  stroke="var(--accent)" strokeWidth="0.7" opacity="0.5"/>
          <line x1="21" y1="12" x2="17.5" y2="12" stroke="var(--accent)" strokeWidth="0.7" opacity="0.5"/>
          <line x1="12" y1="21" x2="12" y2="17.5" stroke="var(--accent)" strokeWidth="0.7" opacity="0.5"/>
          <line x1="3"  y1="12" x2="6.5"  y2="12" stroke="var(--accent)" strokeWidth="0.7" opacity="0.5"/>
        </svg>
      </button>

      {/* Panel */}
      <div className={`a11y-panel ${open ? 'open' : ''}`}>
        <div className="a11y-panel-header">
          <span>Maxsus imkoniyatlar</span>
          <button className="a11y-close" onClick={() => setOpen(false)}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {/* Accent colors */}
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

        {/* Background themes */}
        <div className="a11y-section">
          <p className="a11y-label">Fon mavzusi</p>
          <div className="bg-grid">
            {BG_THEMES.map(b => (
              <button
                key={b.key}
                className={`bg-card ${bgKey === b.key ? 'selected' : ''}`}
                onClick={() => setBgKey(b.key)}
                title={b.label}
                style={{ '--bg-preview': b.preview, '--bg-line1': b.lines[0], '--bg-line2': b.lines[1] }}
              >
                <div className="bg-card-preview">
                  <div className="bg-line"/>
                  <div className="bg-line short"/>
                  <div className="bg-line"/>
                </div>
                <span className="bg-card-label">{b.label}</span>
              </button>
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
                style={{ fontSize: i === 0 ? '12px' : i === 1 ? '15px' : '18px' }}
              >A</button>
            ))}
          </div>
        </div>

        <button className="a11y-reset" onClick={handleReset}>Qayta tiklash</button>
      </div>
    </div>
  );
}
