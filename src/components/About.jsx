import { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { RevealItem } from './ScrollReveal';
import ImageCarousel from './ImageCarousel';
import './About.css';

export default function About() {
  const { t } = useLanguage();
  const [fsData, setFsData] = useState(null);

  useEffect(() => {
    getDoc(doc(db, 'portfolio', 'about')).then(snap => {
      if (snap.exists()) setFsData(snap.data());
    }).catch(err => console.error("Firestore error:", err));
  }, []);

  const val = (fsKey, tKey) => (fsData && fsData[fsKey]) || t(tKey);

  const stats = [
    { value: fsData?.stat1Value || '3+', labelKey: fsData?.stat1Label || 'about.stats.exp', icon: '⚡', isRawLabel: !!fsData?.stat1Label },
    { value: fsData?.stat2Value || '40+', labelKey: fsData?.stat2Label || 'about.stats.projects', icon: '🚀', isRawLabel: !!fsData?.stat2Label },
    { value: fsData?.stat3Value || '25+', labelKey: fsData?.stat3Label || 'about.stats.clients', icon: '🏆', isRawLabel: !!fsData?.stat3Label },
    { value: fsData?.stat4Value || '99%', labelKey: fsData?.stat4Label || 'about.stats.satisfaction', icon: '⭐', isRawLabel: !!fsData?.stat4Label },
  ];

  const highlights = t('about.highlights');

  return (
    <section className="section about-section" id="about">
      <div className="container">
        <div className="about-grid">
          {/* LEFT: IMAGE CAROUSEL */}
          <div className="about-visual animate-fade-up">
            <ImageCarousel
              autoPlay={false}
              images={
                fsData?.carouselImages?.length > 0
                  ? fsData.carouselImages.map((img, i) => ({
                    src: typeof img === 'string' ? img : img.src,
                    alt: typeof img === 'string' ? `Photo ${i + 1}` : img.alt || `Photo ${i + 1}`,
                  }))
                  : [
                    { src: '/n1.jpg', alt: 'Photo 1' },
                    { src: '/n2.jpg', alt: 'Photo 2' },
                  ]
              }
            />
          </div>

          {/* RIGHT: TEXT CONTENT */}
          <div className="about-content animate-fade-up delay-2">
            <p className="section-tag-minimal">{t('about.tag')}</p>
            <h2 className="section-title-minimal">
              {t('about.title')} <span className="gradient-text-fix">{t('about.titleGradient')}</span>
            </h2>

            <div className="about-bio-minimal">
              {(() => {
                const keywords = [
                  'Assalomu alaykum', 'rahmat',
                  'Adhamjonov Doston', 'frontend dasturchiman', 'Murakkab muammolarni',
                  'Foydalanuvchi tajribasini', 'web ilovalar', 'Toza va strukturali kod',
                  'mustahkam arxitektura', 'Sun’iy intellekt', 'innovatsion yechimlar',
                  'Doston', 'Frontend Developer', 'complex problems', 'Достон'
                ];

                const renderText = (text) => {
                  let parts = [{ text: text, isKeyword: false }];

                  keywords.forEach((keyword, idx) => {
                    let newParts = [];
                    parts.forEach(part => {
                      if (!part.isKeyword) {
                        const regex = new RegExp(`(${keyword})`, 'gi');
                        const subParts = part.text.split(regex);
                        subParts.forEach(subPart => {
                          if (subPart.toLowerCase() === keyword.toLowerCase()) {
                            newParts.push({ text: subPart, isKeyword: true, index: idx });
                          } else if (subPart) {
                            newParts.push({ text: subPart, isKeyword: false });
                          }
                        });
                      } else {
                        newParts.push(part);
                      }
                    });
                    parts = newParts;
                  });

                  return parts.map((part, k) =>
                    part.isKeyword
                      ? <span key={k} className={`text-accent-minimal ta-${part.index % 5}`}>{part.text}</span>
                      : part.text
                  );
                };

                return [val('text1', 'about.text1'), val('text2', 'about.text2')].map((text, i) => (
                  text.split('\n').map((p, j) => p.trim() && (
                    <p key={`${i}-${j}`} className="bio-p-minimal">
                      {renderText(p)}
                    </p>
                  ))
                ));
              })()}
            </div>

            <div className="about-highlights-minimal">
              {Array.isArray(highlights) && highlights.map((h, i) => (
                <div key={i} className="h-minimal-item">
                  <span className="h-minimal-icon">{h.icon}</span>
                  <span className="h-minimal-title">{h.title}</span>
                </div>
              ))}
            </div>

            <a href="#contact" className="btn-minimal">
              {t('about.btn')}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>

        {/* STATS MINIMAL */}
        <div className="about-stats-minimal">
          {stats.map((s, idx) => (
            <RevealItem key={s.labelKey} delay={idx * 100}>
              <div className={`stat-minimal-card ta-${idx % 5}`}>
                <div className="stat-minimal-icon">{s.icon}</div>
                <div className="stat-minimal-value">{s.value}</div>
                <div className="stat-minimal-label">{s.isRawLabel ? s.labelKey : t(s.labelKey)}</div>
              </div>
            </RevealItem>
          ))}
        </div>
      </div>
    </section>
  );
}
