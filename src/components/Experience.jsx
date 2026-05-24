import { useLanguage } from '../context/LanguageContext';
import { RevealItem } from './ScrollReveal';
import './Experience.css';

const EXPERIENCE = [
  {
    type: 'work',
    period: '2023 — Hozir',
    periodEn: '2023 — Present',
    periodRu: '2023 — Сейчас',
    role: 'Frontend Developer',
    roleEn: 'Frontend Developer',
    roleRu: 'Frontend Developer',
    company: 'Frilanser',
    companyEn: 'Freelancer',
    companyRu: 'Фриланс',
    desc: 'React, Next.js va TypeScript yordamida mijozlar uchun zamonaviy veb-ilovalar yaratish. Firebase, Firestore va REST API integratsiyasi.',
    descEn: 'Building modern web apps for clients using React, Next.js, and TypeScript. Firebase, Firestore, and REST API integrations.',
    descRu: 'Создание современных веб-приложений для клиентов с использованием React, Next.js и TypeScript.',
    tags: ['React', 'Next.js', 'TypeScript', 'Firebase'],
    current: true,
  },
  {
    type: 'work',
    period: '2022 — 2023',
    periodEn: '2022 — 2023',
    periodRu: '2022 — 2023',
    role: 'Junior Frontend Developer',
    roleEn: 'Junior Frontend Developer',
    roleRu: 'Junior Frontend Developer',
    company: 'IT Kompaniya',
    companyEn: 'IT Company',
    companyRu: 'IT Компания',
    desc: 'HTML, CSS, JavaScript va React asosida UI komponentlar yaratish. Jamoaviy loyihalarda Git bilan ishlash tajribasi.',
    descEn: 'Creating UI components with HTML, CSS, JavaScript, and React. Gained team Git workflow experience.',
    descRu: 'Создание UI-компонентов на HTML, CSS, JavaScript и React. Опыт командной работы с Git.',
    tags: ['React', 'JavaScript', 'CSS', 'Git'],
    current: false,
  },
  {
    type: 'edu',
    period: '2021 — 2022',
    periodEn: '2021 — 2022',
    periodRu: '2021 — 2022',
    role: "Web dasturlashni o'rganish",
    roleEn: 'Self-taught Web Development',
    roleRu: 'Самообучение Web-разработке',
    company: 'Online Kurslar',
    companyEn: 'Online Courses',
    companyRu: 'Онлайн Курсы',
    desc: "HTML, CSS va JavaScript asoslarini o'rganish. Udemy, YouTube va amaliy loyihalar orqali bilim olish.",
    descEn: 'Learning HTML, CSS, and JavaScript fundamentals through Udemy, YouTube, and hands-on projects.',
    descRu: 'Изучение основ HTML, CSS и JavaScript через Udemy, YouTube и практические проекты.',
    tags: ['HTML', 'CSS', 'JavaScript'],
    current: false,
  },
  {
    type: 'edu',
    period: '2020 — Hozir',
    periodEn: '2020 — Present',
    periodRu: '2020 — Сейчас',
    role: "Oliy ta'lim",
    roleEn: 'Higher Education',
    roleRu: 'Высшее образование',
    company: 'Universitet',
    companyEn: 'University',
    companyRu: 'Университет',
    desc: "Axborot texnologiyalari yo'nalishida tahsil. Dasturlash va algoritmlar asoslari.",
    descEn: 'Studying Information Technology. Programming and algorithm fundamentals.',
    descRu: 'Обучение по направлению информационных технологий.',
    tags: ['IT', 'Algorithms'],
    current: false,
  },
];

export default function Experience() {
  const { language } = useLanguage();

  const getField = (item, field) => {
    if (language === 'en') return item[`${field}En`] || item[field];
    if (language === 'ru') return item[`${field}Ru`] || item[field];
    return item[field];
  };

  const sectionTitle = { uz: 'Tajriba &', ru: 'Опыт &', en: 'Experience &' };
  const sectionGrad  = { uz: "Ta'lim", ru: 'Образование', en: 'Education' };
  const sectionTag   = { uz: 'KARYERA', ru: 'КАРЬЕРА', en: 'CAREER' };
  const workLabel    = { uz: 'Ish', ru: 'Работа', en: 'Work' };
  const eduLabel     = { uz: "Ta'lim", ru: 'Образование', en: 'Education' };

  return (
    <section className="section experience-section" id="experience">
      <div className="container">
        <RevealItem delay={0}>
          <div className="section-header">
            <p className="section-tag">{sectionTag[language] || sectionTag.uz}</p>
            <h2 className="section-title">
              {sectionTitle[language] || sectionTitle.uz}{' '}
              <span className="gradient-text">{sectionGrad[language] || sectionGrad.uz}</span>
            </h2>
          </div>
        </RevealItem>

        <div className="exp-timeline">
          <div className="exp-line" />
          {EXPERIENCE.map((item, i) => (
            <RevealItem key={i} delay={i * 100}>
              <div className={`exp-item ${item.type === 'edu' ? 'exp-item--edu' : ''}`}>
                <div className="exp-dot">
                  {item.type === 'work' ? (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z" /><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
                    </svg>
                  ) : (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" />
                    </svg>
                  )}
                </div>

                <div className="exp-card">
                  <div className="exp-card-header">
                    <div>
                      <span className="exp-type-badge">
                        {item.type === 'work' ? workLabel[language] : eduLabel[language]}
                      </span>
                      {item.current && <span className="exp-current-badge">● Hozir</span>}
                    </div>
                    <span className="exp-period">{getField(item, 'period')}</span>
                  </div>

                  <h3 className="exp-role">{getField(item, 'role')}</h3>
                  <p className="exp-company">{getField(item, 'company')}</p>
                  <p className="exp-desc">{getField(item, 'desc')}</p>

                  <div className="exp-tags">
                    {item.tags.map(tag => (
                      <span key={tag} className="exp-tag">{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            </RevealItem>
          ))}
        </div>
      </div>
    </section>
  );
}
