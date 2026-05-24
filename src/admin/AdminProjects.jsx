import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const defaultProjects = [
    { id: 1, title: 'Game Club CRM', description: 'A premium, modern CRM dashboard user interface screenshot with sleek dark theme, vibrant charts, and glassmorphism cards.', tags: 'React, Next.js, Firebase, Chart.js', demo: '#', github: '#', featured: true, emoji: '🎮', imageUrl: '/projects/crm.png' },
    { id: 2, title: 'E-Commerce Premium', description: 'A premium, modern e-commerce website product page screenshot with high-end furniture, sleek typography, and clean design.', tags: 'React, Stripe, Tailwind, Redux', demo: '#', github: '#', featured: false, emoji: '🛍️', imageUrl: '/projects/ecommerce.png' },
    { id: 3, title: 'TaskFlow Pro', description: 'A premium, modern task management dashboard user interface screenshot. Kanban boards, progress rings, and team feed.', tags: 'React, TypeScript, DND, Framer', demo: '#', github: '#', featured: false, emoji: '📊', imageUrl: '/projects/tasks.png' },
];

export default function AdminProjects() {
    const [projects, setProjects] = useState(defaultProjects);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({ title: '', description: '', tags: '', demo: '#', github: '#', featured: false, emoji: '📦', imageUrl: '' });
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState('');

    useEffect(() => {
        getDoc(doc(db, 'portfolio', 'projects')).then((snap) => {
            if (snap.exists() && snap.data().items) setProjects(snap.data().items);
        }).catch(() => { });
    }, []);

    const handleSave = async () => {
        setSaving(true);
        try {
            await setDoc(doc(db, 'portfolio', 'projects'), { items: projects });
            setToast('Saqlandi! ✅');
            setTimeout(() => setToast(''), 2500);
        } catch (err) {
            setToast('Xatolik: ' + err.message);
            setTimeout(() => setToast(''), 3000);
        }
        setSaving(false);
    };

    const handleAdd = () => {
        if (!form.title.trim()) {
            setToast('Ogohlantirish: Loyiha nomi bo\'sh bo\'lmasligi kerak! ⚠️');
            setTimeout(() => setToast(''), 3000);
            return;
        }
        setProjects([{ ...form, id: Date.now() }, ...projects]);
        setForm({ title: '', description: '', tags: '', demo: '#', github: '#', featured: false, emoji: '🚀', imageUrl: '' });
        setToast('Yangi loyiha ro\'yxat boshiga qo\'shildi! "Saqlash"ni bosing. 📥');
        setTimeout(() => setToast(''), 4000);
    };

    const handleEdit = (i) => {
        setEditing(i);
        setForm(projects[i]);
    };

    const handleUpdate = () => {
        const updated = [...projects];
        updated[editing] = { ...form };
        setProjects(updated);
        setEditing(null);
        setForm({ title: '', description: '', tags: '', demo: '#', github: '#', featured: false, emoji: '📦', imageUrl: '' });
    };

    const handleDelete = (i) => {
        if (window.confirm('Haqiqatan ham ushbu loyihani o\'chirib tashlamoqchimisiz?')) {
            setProjects(projects.filter((_, idx) => idx !== i));
            setToast('O\'chirildi. Saqlashni unutmang! 🗑️');
            setTimeout(() => setToast(''), 3000);
        }
    };

    return (
        <div>
            <div className="admin-page-header">
                <h1>🚀 Loyihalar</h1>
                <p>Projects bo'limi — loyihalarni boshqarish ({projects.length} ta)</p>
            </div>

            {/* Add / Edit Form at the top for better visibility */}
            <div className="admin-card" style={editing !== null ? { border: '1px solid #6382ff', background: 'rgba(99, 130, 255, 0.05)' } : {}}>
                <h3>{editing !== null ? '✏️ Loyihani Tahrirlash' : '➕ Yangi Loyiha Qo\'shish'}</h3>
                <div className="admin-form-row">
                    <div className="admin-form-group">
                        <label>Loyiha Nomi</label>
                        <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Masalan: My Portfolio" />
                    </div>
                    <div className="admin-form-group">
                        <label>Emoji / Icon</label>
                        <input value={form.emoji} onChange={(e) => setForm({ ...form, emoji: e.target.value })} placeholder="🚀" />
                    </div>
                </div>
                <div className="admin-form-group">
                    <label>Tavsif (Qisqacha mazmuni)</label>
                    <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Loyiha haqida ma'lumot..." />
                </div>
                <div className="admin-form-group">
                    <label>Ishlatilgan Texnologiyalar (vergul bilan)</label>
                    <input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} placeholder="React, Tailwind, Firebase" />
                </div>
                <div className="admin-form-group">
                    <label>Rasm URL (Screenshot havolasi)</label>
                    <input value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} placeholder="https://example.com/image.jpg" />
                </div>
                <div className="admin-form-row">
                    <div className="admin-form-group">
                        <label>Demo Link</label>
                        <input value={form.demo} onChange={(e) => setForm({ ...form, demo: e.target.value })} placeholder="#" />
                    </div>
                    <div className="admin-form-group">
                        <label>GitHub Link</label>
                        <input value={form.github} onChange={(e) => setForm({ ...form, github: e.target.value })} placeholder="#" />
                    </div>
                </div>
                <div className="admin-form-group">
                    <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', padding: '10px 0' }}>
                        <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} style={{ width: 20, height: 20 }} />
                        <span>⭐ Asosiy (Featured) loyiha sifatida ko'rsatish</span>
                    </label>
                </div>

                <div style={{ marginTop: 10 }}>
                    {editing !== null ? (
                        <div style={{ display: 'flex', gap: 12 }}>
                            <button className="admin-save-btn" onClick={handleUpdate} style={{ flex: 1 }}>✅ O'zgarishni Tasdiqlash</button>
                            <button className="admin-delete-btn" onClick={() => { setEditing(null); setForm({ title: '', description: '', tags: '', demo: '#', github: '#', featured: false, emoji: '📦', imageUrl: '' }); }}>Bekor Qilish</button>
                        </div>
                    ) : (
                        <button className="admin-add-btn" onClick={handleAdd} style={{ background: 'rgba(99, 130, 255, 0.15)', height: '50px' }}>
                            <b>+ Ro'yxatga Qo'shish</b>
                        </button>
                    )}
                </div>
            </div>

            <div style={{ margin: '30px 0' }}>
                <button className="admin-save-btn" onClick={handleSave} disabled={saving} style={{ width: '100%', height: '55px', fontSize: '1.1rem', justifyContent: 'center', boxShadow: '0 10px 25px rgba(99, 130, 255, 0.3)' }}>
                    {saving ? '⏳ Firebasega yuklanmoqda...' : `💾 Barcha ${projects.length} ta loyihani Firebasega Saqlash`}
                </button>
            </div>

            {/* List at the bottom */}
            <div className="admin-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                    <h3 style={{ margin: 0 }}>📋 Mavjud Loyihalar Ro'yxati</h3>
                    <span style={{ fontSize: '0.9rem', color: '#94a3b8' }}>Jami: {projects.length} ta</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxHeight: '600px', overflowY: 'auto', paddingRight: '12px', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '10px' }}>
                    {projects.map((p, i) => (
                        <div key={p.id || i} className={`admin-item ${editing === i ? 'admin-item-editing' : ''}`} style={{ background: 'rgba(255,255,255,0.02)', padding: '15px' }}>
                            <span style={{ fontSize: '1.5rem', flexShrink: 0 }}>{p.emoji || '🚀'}</span>
                            <div className="admin-item-info">
                                <h4 style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    {p.title} {p.featured && <span style={{ color: '#fbbf24', fontSize: '0.8rem' }}>⭐ Featured</span>}
                                </h4>
                                <p style={{ fontSize: '0.8rem', opacity: 0.7 }}>{p.description?.substring(0, 100)}{p.description?.length > 100 ? '...' : ''}</p>
                            </div>
                            <div className="admin-item-actions">
                                <button title="Tahrirlash" className="admin-edit-btn" onClick={() => handleEdit(i)}>✏️</button>
                                <button title="O'chirish" className="admin-delete-btn" onClick={() => handleDelete(i)}>🗑️</button>
                            </div>
                        </div>
                    ))}
                    {projects.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '40px', opacity: 0.5 }}>
                            <p style={{ fontSize: '2rem', marginBottom: 10 }}>📂</p>
                            <p>Hozircha loyihalar yo'q. Yuqoridagi formadan qo'shing.</p>
                        </div>
                    )}
                </div>
            </div>

            {toast && <div className="admin-toast">{toast}</div>}
        </div>
    );
}
