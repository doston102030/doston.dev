import { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import './BottomNav.css';

const navItems = [
    { id: 'home', icon: 'home', href: '#home' },
    { id: 'about', icon: 'user', href: '#about' },
    { id: 'skills', icon: 'code', href: '#skills' },
    { id: 'projects', icon: 'briefcase', href: '#projects' },
    { id: 'contact', icon: 'mail', href: '#contact' },
];

const navIcons = {
    home: () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9.5L12 3L21 9.5V19C21 20.1 20.1 21 19 21H15V13H9V21H5C3.9 21 3 20.1 3 19V9.5Z" />
        </svg>
    ),
    user: () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="8" r="4" />
            <path d="M6 21v-1a6 6 0 0 1 12 0v1" />
        </svg>
    ),
    code: () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="16 18 22 12 16 6" />
            <polyline points="8 6 2 12 8 18" />
        </svg>
    ),
    briefcase: () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="7" width="20" height="14" rx="2" />
            <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
        </svg>
    ),
    mail: () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <path d="M22 6L12 13L2 6" />
        </svg>
    ),
};

export default function BottomNav() {
    const { t } = useLanguage();
    const [active, setActive] = useState('home');

    useEffect(() => {
        const observerOptions = {
            root: null,
            rootMargin: '-30% 0px -30% 0px',
            threshold: 0
        };

        const handleIntersect = (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setActive(entry.target.id);
                }
            });
        };

        const observer = new IntersectionObserver(handleIntersect, observerOptions);

        navItems.forEach((item) => {
            const section = document.querySelector(item.href);
            if (section) observer.observe(section);
        });

        return () => observer.disconnect();
    }, []);

    return (
        <nav className="fixed bottom-5 left-1/2 -translate-x-1/2 translate-z-0 z-[9999] md:hidden block w-auto max-w-[90vw] will-change-transform max-sm:bottom-4">
            <div className="bottom-nav-container flex items-center bg-[rgba(10,10,10,0.9)] backdrop-blur-[10px] px-2.5 py-1.5 rounded-full border border-white/[0.06] gap-0.5 shadow-[0_2px_8px_rgba(0,0,0,0.4),0_8px_32px_rgba(0,0,0,0.2)]">
                {navItems.map((item) => (
                    <a
                        key={item.id}
                        href={item.href}
                        className={`bottom-nav-item flex flex-col items-center justify-center min-w-[48px] py-1 text-text-muted no-underline relative gap-0.5 transition-all duration-300 max-sm:min-w-[44px] ${active === item.id ? 'active text-accent' : ''}`}
                        onClick={() => setActive(item.id)}
                    >
                        <span className={`flex items-center justify-center w-[30px] h-[30px] rounded-full relative z-[1] transition-all duration-300 max-sm:w-[26px] max-sm:h-[26px] ${active === item.id ? 'bg-[rgba(var(--accent-rgb),0.1)] shadow-[0_0_10px_rgba(var(--accent-rgb),0.1)] -translate-y-px' : ''}`}>
                            {navIcons[item.icon]()}
                        </span>
                        <span className={`text-[7px] font-mono font-semibold tracking-wider uppercase transition-all duration-300 max-sm:text-[6px] ${active === item.id ? 'opacity-100 font-bold' : 'opacity-50'}`}>
                            {t(`nav.${item.id}`)}
                        </span>
                    </a>
                ))}
            </div>
        </nav>
    );
}
