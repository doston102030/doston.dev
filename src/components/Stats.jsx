import { useEffect, useRef, useState } from 'react';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import './Stats.css';

function parseStatValue(raw = '') {
  const num = parseInt(raw.replace(/[^0-9]/g, ''), 10) || 0;
  const suffix = raw.replace(/[0-9]/g, '');
  return { num, suffix };
}

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

function StatItem({ num, suffix, label, delay }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const count = useCountUp(num, 1800, visible);

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
      <div className="stat-number">{count}{suffix}</div>
      <div className="stat-label">{label}</div>
      <div className="stat-line" />
    </div>
  );
}

const FALLBACK = [
  { num: 3,   suffix: '+', label: 'Yillik tajriba' },
  { num: 20,  suffix: '+', label: 'Bitgan loyihalar' },
  { num: 12,  suffix: '+', label: 'Mamnun mijozlar' },
  { num: 100, suffix: '%', label: 'Qoniqish darajasi' },
];

export default function Stats() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    getDoc(doc(db, 'portfolio', 'about')).then((snap) => {
      if (!snap.exists()) return;
      const d = snap.data();
      setStats([
        { ...parseStatValue(d.stat1Value), label: d.stat1Label || 'Yillik tajriba' },
        { ...parseStatValue(d.stat2Value), label: d.stat2Label || 'Bitgan loyihalar' },
        { ...parseStatValue(d.stat3Value), label: d.stat3Label || 'Mamnun mijozlar' },
        { ...parseStatValue(d.stat4Value), label: d.stat4Label || 'Qoniqish darajasi' },
      ]);
    }).catch(() => {});
  }, []);

  const items = stats || FALLBACK;

  return (
    <section className="stats-section">
      <div className="container">
        <div className="stats-grid">
          {items.map((s, i) => (
            <StatItem
              key={i}
              num={s.num}
              suffix={s.suffix}
              label={s.label}
              delay={i * 120}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
