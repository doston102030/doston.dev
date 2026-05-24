import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import './Stats.css';

const STATS = [
  { key: 'exp',          value: 3,   suffix: '+', prefix: '' },
  { key: 'projects',     value: 20,  suffix: '+', prefix: '' },
  { key: 'clients',      value: 12,  suffix: '+', prefix: '' },
  { key: 'satisfaction', value: 100, suffix: '%', prefix: '' },
];

function useCountUp(target, duration = 1800, started = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!started) return;
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(ease * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [started, target, duration]);
  return count;
}

function StatItem({ value, suffix, label, delay }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const count = useCountUp(value, 1800, visible);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="stat-item" ref={ref} style={{ '--delay': `${delay}ms` }}>
      <div className="stat-number">
        {count}{suffix}
      </div>
      <div className="stat-label">{label}</div>
      <div className="stat-line" />
    </div>
  );
}

export default function Stats() {
  const { t } = useLanguage();
  return (
    <section className="stats-section">
      <div className="container">
        <div className="stats-grid">
          {STATS.map((s, i) => (
            <StatItem
              key={s.key}
              value={s.value}
              suffix={s.suffix}
              label={t(`about.stats.${s.key}`)}
              delay={i * 120}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
