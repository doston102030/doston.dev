import { useState, useEffect, useMemo } from 'react';
import { db } from '../firebase';
import { collection, query, orderBy, onSnapshot, doc, deleteDoc, updateDoc } from 'firebase/firestore';

export default function AdminLogs() {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState('');
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('all'); // all | unread | read
    const [expandedId, setExpandedId] = useState(null);

    useEffect(() => {
        const q = query(collection(db, 'messages'), orderBy('timestamp', 'desc'));
        const unsubscribe = onSnapshot(q, (snap) => {
            const msgs = snap.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setMessages(msgs);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Haqiqatan ham ushbu xabarni o\'chirmoqchimisiz?')) return;
        try {
            await deleteDoc(doc(db, 'messages', id));
            showToast('✅ Xabar o\'chirildi');
        } catch (err) {
            showToast('❌ Xatolik: ' + err.message);
        }
    };

    const markAsRead = async (id, currentStatus) => {
        try {
            await updateDoc(doc(db, 'messages', id), { read: !currentStatus });
            showToast(currentStatus ? '📩 O\'qilmagan deb belgilandi' : '✅ O\'qildi deb belgilandi');
        } catch (err) {
            console.error(err);
        }
    };

    const showToast = (msg) => {
        setToast(msg);
        setTimeout(() => setToast(''), 2500);
    };

    const formatDate = (ts) => {
        if (!ts) return 'Hozir';
        const date = ts.toDate();
        return date.toLocaleString('uz-UZ', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getRelativeTime = (ts) => {
        if (!ts) return 'Hozirgina';
        const now = new Date();
        const date = ts.toDate();
        const diff = Math.floor((now - date) / 1000);
        if (diff < 60) return `${diff} soniya oldin`;
        if (diff < 3600) return `${Math.floor(diff / 60)} daqiqa oldin`;
        if (diff < 86400) return `${Math.floor(diff / 3600)} soat oldin`;
        if (diff < 604800) return `${Math.floor(diff / 86400)} kun oldin`;
        return formatDate(ts);
    };

    const stats = useMemo(() => ({
        total: messages.length,
        unread: messages.filter(m => !m.read).length,
        read: messages.filter(m => m.read).length,
    }), [messages]);

    const filtered = useMemo(() => {
        let list = messages;
        if (filter === 'unread') list = list.filter(m => !m.read);
        if (filter === 'read') list = list.filter(m => m.read);
        if (search.trim()) {
            const s = search.toLowerCase();
            list = list.filter(m =>
                m.name?.toLowerCase().includes(s) ||
                m.email?.toLowerCase().includes(s) ||
                m.message?.toLowerCase().includes(s)
            );
        }
        return list;
    }, [messages, filter, search]);

    const getInitials = (name) => {
        if (!name) return '?';
        return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
    };

    if (loading) return (
        <div className="logs-loading">
            <div className="logs-loading-spinner" />
            <span>Xabarlar yuklanmoqda...</span>
        </div>
    );

    return (
        <div className="logs-page">
            {/* ── PREMIUM HEADER ── */}
            <div className="logs-header">
                <div className="logs-header-icon">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                        <polyline points="22,6 12,13 2,6" />
                    </svg>
                    {stats.unread > 0 && <span className="logs-header-badge">{stats.unread}</span>}
                </div>
                <div className="logs-header-text">
                    <h1>Xabarlar</h1>
                    <p>Kontakt formasi orqali kelgan barcha xabarlar</p>
                </div>
            </div>

            {/* ── STATS CARDS ── */}
            <div className="logs-stats">
                <div className="logs-stat-card logs-stat-total">
                    <div className="logs-stat-icon">📬</div>
                    <div className="logs-stat-info">
                        <span className="logs-stat-number">{stats.total}</span>
                        <span className="logs-stat-label">Jami xabarlar</span>
                    </div>
                </div>
                <div className="logs-stat-card logs-stat-unread">
                    <div className="logs-stat-icon">🔵</div>
                    <div className="logs-stat-info">
                        <span className="logs-stat-number">{stats.unread}</span>
                        <span className="logs-stat-label">O'qilmagan</span>
                    </div>
                    {stats.unread > 0 && <div className="logs-stat-pulse" />}
                </div>
                <div className="logs-stat-card logs-stat-read">
                    <div className="logs-stat-icon">✅</div>
                    <div className="logs-stat-info">
                        <span className="logs-stat-number">{stats.read}</span>
                        <span className="logs-stat-label">O'qilgan</span>
                    </div>
                </div>
            </div>

            {/* ── SEARCH & FILTER ── */}
            <div className="logs-toolbar">
                <div className="logs-search-wrapper">
                    <svg className="logs-search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                        <circle cx="11" cy="11" r="8" />
                        <path d="M21 21l-4.35-4.35" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Ism, email yoki xabar bo'yicha qidiring..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="logs-search-input"
                    />
                    {search && (
                        <button className="logs-search-clear" onClick={() => setSearch('')}>✕</button>
                    )}
                </div>
                <div className="logs-filter-group">
                    {[
                        { key: 'all', label: 'Hammasi', icon: '📋' },
                        { key: 'unread', label: 'O\'qilmagan', icon: '🔵' },
                        { key: 'read', label: 'O\'qilgan', icon: '✅' },
                    ].map(f => (
                        <button
                            key={f.key}
                            className={`logs-filter-btn ${filter === f.key ? 'active' : ''}`}
                            onClick={() => setFilter(f.key)}
                        >
                            <span>{f.icon}</span> {f.label}
                            {f.key === 'unread' && stats.unread > 0 && (
                                <span className="logs-filter-count">{stats.unread}</span>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* ── MESSAGE LIST ── */}
            <div className="logs-list">
                {filtered.length === 0 ? (
                    <div className="logs-empty">
                        <div className="logs-empty-icon">
                            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                <polyline points="22,6 12,13 2,6" />
                            </svg>
                        </div>
                        <h3>{search ? 'Qidiruv natijasi topilmadi' : 'Hozircha xabarlar yo\'q'}</h3>
                        <p>{search ? 'Boshqa kalit so\'z bilan qidirib ko\'ring' : 'Kontakt formasi orqali birinchi xabar kelishini kuting'}</p>
                    </div>
                ) : (
                    filtered.map((m, idx) => (
                        <div
                            key={m.id}
                            className={`log-card ${m.read ? 'read' : 'unread'} ${expandedId === m.id ? 'expanded' : ''}`}
                            style={{ animationDelay: `${idx * 0.05}s` }}
                            onClick={() => setExpandedId(expandedId === m.id ? null : m.id)}
                        >
                            {/* Card accent line */}
                            {!m.read && <div className="log-card-accent" />}

                            <div className="log-card-header">
                                <div className="log-card-left">
                                    <div className={`log-avatar ${m.read ? '' : 'unread'}`}>
                                        {getInitials(m.name)}
                                    </div>
                                    <div className="log-sender-info">
                                        <div className="log-sender-name">
                                            {m.name}
                                            {!m.read && <span className="log-new-badge">YANGI</span>}
                                        </div>
                                        <div className="log-sender-email">{m.email}</div>
                                    </div>
                                </div>
                                <div className="log-card-right">
                                    <span className="log-time" title={formatDate(m.timestamp)}>
                                        {getRelativeTime(m.timestamp)}
                                    </span>
                                    <div className={`log-status-indicator ${m.read ? 'read' : 'unread'}`}>
                                        {m.read ? (
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                                        ) : (
                                            <div className="log-unread-dot" />
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="log-card-body">
                                <p className="log-message-text">{m.message}</p>
                            </div>

                            <div className="log-card-actions" onClick={(e) => e.stopPropagation()}>
                                <button
                                    className={`log-action-btn ${m.read ? 'mark-unread' : 'mark-read'}`}
                                    onClick={() => markAsRead(m.id, m.read)}
                                >
                                    {m.read ? (
                                        <>
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                                            O'qilmagan
                                        </>
                                    ) : (
                                        <>
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                                            O'qildi
                                        </>
                                    )}
                                </button>
                                <button className="log-action-btn delete" onClick={() => handleDelete(m.id)}>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" /></svg>
                                    O'chirish
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* ── TOAST ── */}
            {toast && (
                <div className="logs-toast">
                    <span>{toast}</span>
                </div>
            )}
        </div>
    );
}
