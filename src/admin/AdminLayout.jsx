import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import AdminHero from './AdminHero';
import AdminAbout from './AdminAbout';
import AdminSkills from './AdminSkills';
import AdminProjects from './AdminProjects';
import AdminContact from './AdminContact';
import AdminLogs from './AdminLogs';
import AdminSocials from './AdminSocials';
import './admin.css';

const navItems = [
    { id: 'hero', label: 'Hero', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg> },
    { id: 'about', label: 'Haqimda', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /></svg> },
    { id: 'skills', label: 'Bilimlar', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg> },
    { id: 'projects', label: 'Loyihalar', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16" /></svg> },
    { id: 'contact', label: 'Aloqa', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg> },
    { id: 'logs', label: 'Xabarlar', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 01-2 2H7l4 4M3 9h18M3 5h18M3 13h18M3 17H3" /></svg> },
    { id: 'socials', label: 'Ijtimoiy', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" /></svg> },
];

export default function AdminLayout() {
    const [page, setPage] = useState('hero');
    const [mobileOpen, setMobileOpen] = useState(false);
    const navigate = useNavigate();

    if (sessionStorage.getItem('admin_auth') !== 'true') {
        return <Navigate to="/admin" replace />;
    }

    const handleLogout = () => {
        sessionStorage.removeItem('admin_auth');
        navigate('/admin');
    };

    const handleNavClick = (id) => {
        setPage(id);
        setMobileOpen(false);
    };

    const renderPage = () => {
        switch (page) {
            case 'hero': return <AdminHero />;
            case 'about': return <AdminAbout />;
            case 'skills': return <AdminSkills />;
            case 'projects': return <AdminProjects />;
            case 'contact': return <AdminContact />;
            case 'logs': return <AdminLogs />;
            case 'socials': return <AdminSocials />;
            default: return <AdminHero />;
        }
    };

    return (
        <div className="admin-layout">
            {/* Mobile Toggle Button */}
            <button
                className={`admin-nav-toggle ${mobileOpen ? 'is-open' : ''}`}
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Toggle Menu"
            >
                <div className="hamburger-icon">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </button>

            {/* Mobile Overlay */}
            <div
                className={`admin-overlay ${mobileOpen ? 'is-visible' : ''}`}
                onClick={() => setMobileOpen(false)}
            />

            <aside className={`admin-sidebar ${mobileOpen ? 'mobile-open' : ''}`}>
                <div className="admin-sidebar-logo">
                    <h2>&lt;AX/&gt; Admin</h2>
                    <span>Portfolio Manager</span>
                </div>
                <nav className="admin-nav">
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            className={`admin-nav-item ${page === item.id ? 'active' : ''}`}
                            onClick={() => handleNavClick(item.id)}
                        >
                            {item.icon}
                            <span>{item.label}</span>
                        </button>
                    ))}
                </nav>
                <div className="admin-sidebar-footer">
                    <button className="admin-logout-btn" onClick={handleLogout}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
                        </svg>
                        <span>Chiqish</span>
                    </button>
                    <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', borderRadius: 10, color: '#94a3b8', fontSize: '0.85rem', textDecoration: 'none', marginTop: 4 }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" /></svg>
                        <span>Saytni ko'rish</span>
                    </a>
                </div>
            </aside>
            <main className="admin-main">
                {renderPage()}
            </main>
        </div>
    );
}
