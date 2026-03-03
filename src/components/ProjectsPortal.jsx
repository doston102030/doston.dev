import { useEffect } from 'react';
import './ProjectsPortal.css';

const AI_TOOLS = [
    {
        key: 'claude',
        name: 'Claude',
        by: 'Anthropic',
        href: 'https://claude.ai',
        color: '#D97757',
        emoji: '🟠',
        icon: (
            <svg width="36" height="36" viewBox="0 0 48 48" fill="none">
                <defs>
                    <linearGradient id="claudeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#E8845C" />
                        <stop offset="100%" stopColor="#C9603A" />
                    </linearGradient>
                </defs>
                <rect width="48" height="48" rx="12" fill="url(#claudeGrad)" />
                <text x="50%" y="55%" dominantBaseline="middle" textAnchor="middle" fontSize="22" fill="white">✦</text>
            </svg>
        ),
    },
    {
        key: 'chatgpt',
        name: 'ChatGPT',
        by: 'OpenAI',
        href: 'https://chat.openai.com',
        color: '#10a37f',
        emoji: '🟢',
        icon: (
            <svg width="36" height="36" viewBox="0 0 48 48" fill="none">
                <defs>
                    <linearGradient id="gptGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#15c48a" />
                        <stop offset="100%" stopColor="#0a8a5e" />
                    </linearGradient>
                </defs>
                <rect width="48" height="48" rx="12" fill="url(#gptGrad)" />
                <path d="M24 8C15.163 8 8 15.163 8 24s7.163 16 16 16 16-7.163 16-16S32.837 8 24 8zm0 4a12 12 0 110 24 12 12 0 010-24zm-1 6v7h-5l6 9 6-9h-5V18h-2z" fill="white" opacity=".9" />
            </svg>
        ),
    },
    {
        key: 'gemini',
        name: 'Gemini',
        by: 'Google',
        href: 'https://gemini.google.com',
        color: '#4285F4',
        emoji: '🔵',
        icon: (
            <svg width="36" height="36" viewBox="0 0 48 48" fill="none">
                <rect width="48" height="48" rx="12" fill="#1a1a2e" />
                <defs>
                    <linearGradient id="gemGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#4285F4" />
                        <stop offset="50%" stopColor="#9c59f5" />
                        <stop offset="100%" stopColor="#EA4335" />
                    </linearGradient>
                </defs>
                <path d="M24 10 C24 10 18 24 10 24 C18 24 24 38 24 38 C24 38 30 24 38 24 C30 24 24 10 24 10Z" fill="url(#gemGrad)" />
            </svg>
        ),
    },
    {
        key: 'lovable',
        name: 'Lovable',
        by: 'Lovable.dev',
        href: 'https://lovable.dev',
        color: '#ff6b8a',
        emoji: '💖',
        icon: (
            <svg width="36" height="36" viewBox="0 0 48 48" fill="none">
                <defs>
                    <linearGradient id="lovGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#ff6b8a" />
                        <stop offset="100%" stopColor="#e63e6d" />
                    </linearGradient>
                </defs>
                <rect width="48" height="48" rx="12" fill="url(#lovGrad)" />
                <path d="M24 36 C24 36 12 28 12 20 C12 16 15 13 18.5 13 C20.8 13 22.9 14.3 24 16.2 C25.1 14.3 27.2 13 29.5 13 C33 13 36 16 36 20 C36 28 24 36 24 36Z" fill="white" opacity=".95" />
            </svg>
        ),
    },
    {
        key: 'base44',
        name: 'Base44',
        by: 'Base44.com',
        href: 'https://base44.com',
        color: '#6c5ce7',
        emoji: '🔮',
        icon: (
            <svg width="36" height="36" viewBox="0 0 48 48" fill="none">
                <defs>
                    <linearGradient id="b44Grad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#6c5ce7" />
                        <stop offset="100%" stopColor="#4834d4" />
                    </linearGradient>
                </defs>
                <rect width="48" height="48" rx="12" fill="url(#b44Grad)" />
                <text x="50%" y="54%" dominantBaseline="middle" textAnchor="middle" fontSize="14" fontWeight="bold" fill="white" fontFamily="monospace">B44</text>
            </svg>
        ),
    },
];

export default function AIToolsPortal({ open, onClose }) {
    useEffect(() => {
        if (open) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [open]);

    if (!open) return null;

    return (
        <div className="portal-backdrop" onClick={onClose}>
            <button className="portal-close" onClick={onClose}>✕</button>

            <div className="portal-sphere-wrap" onClick={(e) => e.stopPropagation()}>
                <div className="portal-ring portal-ring--1" />
                <div className="portal-ring portal-ring--2" />
                <div className="portal-ring portal-ring--3" />

                <div className="portal-sphere">
                    <div className="portal-inner">
                        <p className="portal-label">🤖 Men ishlatadigan AI toollar</p>

                        <div className="portal-grid portal-grid--ai">
                            {AI_TOOLS.map((tool, i) => (
                                <a
                                    key={tool.key}
                                    href={tool.href}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="portal-ai-card"
                                    style={{ animationDelay: `${i * 0.07}s`, '--tool-color': tool.color }}
                                >
                                    <div className="portal-ai-icon">{tool.icon}</div>
                                    <div className="portal-ai-info">
                                        <span className="portal-ai-name">{tool.name}</span>
                                        <span className="portal-ai-by">{tool.by}</span>
                                    </div>
                                    <div className="portal-ai-arrow">→</div>
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
