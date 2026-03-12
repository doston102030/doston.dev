import { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { db } from '../firebase';
import { doc, getDoc, addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { RevealItem } from './ScrollReveal';
import './Contact.css';

export default function Contact() {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [fsData, setFsData] = useState(null);

  useEffect(() => {
    getDoc(doc(db, 'portfolio', 'contact')).then(snap => {
      if (snap.exists()) setFsData(snap.data());
    }).catch(err => console.error("Firestore error:", err));
  }, []);

  const formatLink = (url, type) => {
    if (!url) return '#';
    // If it's already a full URL or special protocol
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('mailto:') || url.startsWith('tel:')) {
      return url;
    }
    // Handle Telegram specific usernames
    if (type === 'Telegram' && url.startsWith('@')) {
      return `https://t.me/${url.substring(1)}`;
    }
    // Default to https
    return `https://${url}`;
  };

  const contactInfo = [
    {
      icon: (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>),
      label: 'Email',
      value: fsData?.email || 'adhamjonov.doston@example.com',
      href: `mailto:${fsData?.email || 'adhamjonov.doston@example.com'}`,
    },
    {
      icon: (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 12 19.79 19.79 0 01.0 3.37 2 2 0 012 1.18h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" /></svg>),
      label: 'Phone',
      value: fsData?.phone || '+998 90 123 45 67',
      href: `tel:${fsData?.phone?.replace(/\s/g, '') || '+998901234567'}`,
    },
    {
      icon: (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg>),
      label: 'Location',
      value: fsData?.location || 'Tashkent, Uzbekistan',
      href: '#',
    },
  ];

  const socialLinks = [
    {
      name: 'Telegram',
      href: formatLink(fsData?.telegram || 'adhamjonov_doston', 'Telegram'),
      color: '#26A5E4',
      icon: (<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" /></svg>)
    },
    {
      name: 'Instagram',
      href: formatLink(fsData?.instagram || 'adhamjonov_doston', 'Instagram'),
      color: '#E1306C',
      icon: (<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>)
    },
    {
      name: 'LinkedIn',
      href: formatLink(fsData?.linkedin || 'adhamjonov-doston', 'LinkedIn'),
      color: '#0A66C2',
      icon: (<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>)
    },
    {
      name: 'GitHub',
      href: formatLink(fsData?.github || 'adhamjonov-doston', 'GitHub'),
      color: '#ffffff',
      icon: (<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" /></svg>)
    },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'messages'), {
        ...formData,
        timestamp: serverTimestamp(),
        read: false
      });
      setSubmitted(true);
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setSubmitted(false), 3000);
    } catch (err) {
      console.error("Error sending message:", err);
      alert("Xabar yuborishda xatolik yuz berdi. Iltimos qaytadan urinib ko'ring.");
    }
  };

  return (
    <section className="section contact-section" id="contact">
      <div className="site-container">
        <RevealItem delay={0}>
          <div className="section-header">
            <p className="section-tag">{t('contact.tag')}</p>
            <h2 className="section-title">
              {t('contact.title')} <span className="gradient-text">{t('contact.titleGradient')}</span>
            </h2>
            <p className="section-subtitle">{t('contact.subtitle')}</p>
          </div>
        </RevealItem>

        <RevealItem delay={150}>
          <div className="contact-grid">
            <div className="contact-info">
              <h3 className="contact-info-title">{t('contact.infoTitle')}</h3>
              <p className="contact-info-text">{t('contact.infoText')}</p>
              <div className="contact-details">
                {contactInfo.map((c) => (
                  <a key={c.label} href={c.href} className="contact-detail-item">
                     <div className="contact-icon">{c.icon}</div>
                    <div>
                      <div className="contact-detail-label">{c.label}</div>
                      <div className="contact-detail-value">{c.value}</div>
                    </div>
                  </a>
                ))}
              </div>
              <div className="contact-socials">
                <p className="socials-label">Follow me on</p>
                <div className="socials-row">
                  {socialLinks.map((s) => (
                    <a key={s.name} href={s.href} target="_blank" rel="noreferrer" className="social-btn" style={{ '--social-color': s.color }} title={s.name}>
                      {s.icon}<span>{s.name}</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            <div className="contact-form-wrapper">
              {submitted ? (
                <div className="form-success">
                  <div className="success-icon">✅</div>
                  <h4>{t('contact.form.success')}</h4>
                  <p>{t('contact.form.successText')}</p>
                </div>
              ) : (
                <form className="contact-form" onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label htmlFor="name">{t('contact.form.name')}</label>
                    <input id="name" type="text" placeholder={t('contact.form.namePlaceholder')} value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">{t('contact.form.email')}</label>
                    <input id="email" type="email" placeholder={t('contact.form.emailPlaceholder')} value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="message">{t('contact.form.message')}</label>
                    <textarea id="message" rows={5} placeholder={t('contact.form.messagePlaceholder')} value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })} required />
                  </div>
                  <button type="submit" className="btn-primary btn-primary-full">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
                    {t('contact.form.send')}
                  </button>
                </form>
              )}
            </div>
          </div>
        </RevealItem>
      </div>
    </section>
  );
}
