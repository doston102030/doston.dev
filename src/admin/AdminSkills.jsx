import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const defaultSkills = [
    // 🧱 Languages
    { name: 'HTML', icon: '🟠', level: 98, color: '#e34f26', category: 'languages' },
    { name: 'CSS', icon: '🔵', level: 95, color: '#264de4', category: 'languages' },
    { name: 'JavaScript', icon: '🟡', level: 93, color: '#f7df1e', category: 'languages' },

    // ⚛️ Frameworks & Libraries
    { name: 'TypeScript', icon: '💙', level: 85, color: '#3178c6', category: 'frameworks' },
    { name: 'React', icon: '⚛️', level: 94, color: '#61dafb', category: 'frameworks' },
    { name: 'Next.js', icon: '⬛', level: 88, color: '#ffffff', category: 'frameworks' },
    { name: 'Redux Toolkit', icon: '🟣', level: 85, color: '#764abc', category: 'frameworks' },
    { name: 'Zustand', icon: '🐻', level: 82, color: '#433929', category: 'frameworks' },
    { name: 'React Hook Form', icon: '📋', level: 90, color: '#ec5990', category: 'frameworks' },
    { name: 'Axios', icon: '📡', level: 95, color: '#5a29e4', category: 'frameworks' },
    { name: 'TanStack Query', icon: '🔍', level: 88, color: '#ff4154', category: 'frameworks' },
    { name: 'Framer Motion', icon: '🎭', level: 85, color: '#00ccff', category: 'frameworks' },

    // 🎨 Styling & UI
    { name: 'Tailwind CSS', icon: '🌊', level: 92, color: '#38bdf8', category: 'styling' },
    { name: 'Styled Components', icon: '💅', level: 88, color: '#db7093', category: 'styling' },
    { name: 'DaisyUI', icon: '🌼', level: 85, color: '#1eb854', category: 'styling' },
    { name: 'Shadcn/ui', icon: '🔳', level: 90, color: '#ffffff', category: 'styling' },
    { name: 'Material UI', icon: '🟦', level: 85, color: '#007fff', category: 'styling' },
    { name: 'Ant Design', icon: 'Ant', level: 80, color: '#0170fe', category: 'styling' },

    // 🔧 Tools
    { name: 'Git', icon: '🔴', level: 87, color: '#f05032', category: 'tools' },
    { name: 'GitHub', icon: '🐙', level: 90, color: '#ffffff', category: 'tools' },
    { name: 'VS Code', icon: '💻', level: 95, color: '#007acc', category: 'tools' },
    { name: 'Windsurf', icon: '🏄‍♂️', level: 92, color: '#00d1ff', category: 'tools' },
    { name: 'Figma', icon: '🎨', level: 88, color: '#f24e1e', category: 'tools' },
    { name: 'Postman', icon: '🚀', level: 85, color: '#ff6c37', category: 'tools' },
    { name: 'Vercel', icon: '▲', level: 90, color: '#ffffff', category: 'tools' },
    { name: 'Netlify', icon: '◈', level: 85, color: '#00c7b7', category: 'tools' },

    // 🔥 Backend
    { name: 'Firebase', icon: '🔥', level: 85, color: '#ffca28', category: 'backend' },
    { name: 'Supabase', icon: '⚡', level: 80, color: '#3ecf8e', category: 'backend' },

    // 🧠 Additional
    { name: 'REST API', icon: '🔌', level: 90, color: '#a78bfa', category: 'additional' },
    { name: 'Responsive Design', icon: '📱', level: 95, color: '#4ade80', category: 'additional' },
    { name: 'SEO Basics', icon: '📈', level: 80, color: '#fb923c', category: 'additional' },
    { name: 'Performance Optimization', icon: '⚡', level: 85, color: '#facc15', category: 'additional' },
];

const emptyForm = { name: '', icon: '📦', level: 80, color: '#6382ff', category: 'languages' };

export default function AdminSkills() {
    const [skills, setSkills] = useState(defaultSkills);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({ ...emptyForm });
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState('');

    useEffect(() => {
        getDoc(doc(db, 'portfolio', 'skills')).then((snap) => {
            if (snap.exists() && snap.data().items) {
                const dbItems = snap.data().items;
                const essentialNames = ['HTML', 'HTML5', 'CSS', 'CSS3', 'JavaScript', 'JavaScript (ES6+)', 'JS'];

                // 🚀 Migration & Proper Normalization
                const processed = dbItems.map(s => {
                    // Identity matching
                    if (['HTML', 'HTML5'].includes(s.name)) return { ...s, name: 'HTML', icon: '🟠', category: 'languages', color: '#e34f26' };
                    if (['CSS', 'CSS3'].includes(s.name)) return { ...s, name: 'CSS', icon: '🔵', category: 'languages', color: '#264de4' };
                    if (['JavaScript', 'JavaScript (ES6+)', 'JS'].includes(s.name)) return { ...s, name: 'JavaScript', icon: '🟡', category: 'languages', color: '#f7df1e' };
                    if (s.name === 'TypeScript' || s.name === 'TS') return { ...s, name: 'TypeScript', icon: '💙', category: 'frameworks', color: '#3178c6' };

                    // Normalize 'libraries' to 'frameworks'
                    if (s.category === 'libraries') return { ...s, category: 'frameworks' };

                    if (s.category) return s;

                    let category = 'frameworks';
                    if (essentialNames.includes(s.name)) category = 'languages';
                    if (['Git', 'GitHub', 'Figma', 'Postman', 'Vercel', 'Netlify', 'VS Code', 'Windsurf'].includes(s.name)) category = 'tools';
                    if (['Tailwind CSS', 'Sass', 'SCSS', 'Sass / SCSS', 'Bootstrap', 'Shadcn/ui', 'Material UI', 'Ant Design', 'Styled Components', 'DaisyUI'].includes(s.name)) category = 'styling';
                    if (['Firebase', 'Supabase'].includes(s.name)) category = 'backend';
                    if (['REST API', 'Responsive Design', 'SEO Basics', 'Performance Optimization'].includes(s.name)) category = 'additional';

                    return { ...s, category };
                });

                // 🏗 Master Merge: Ensure essential skills are always in the list
                const merged = [...processed];
                defaultSkills.forEach(defSkill => {
                    const exists = merged.some(s => s.name === defSkill.name);
                    if (!exists) merged.push(defSkill);
                });

                setSkills(merged);
            }
        }).catch(() => { });
    }, []);

    const handleSave = async () => {
        setSaving(true);
        try {
            await setDoc(doc(db, 'portfolio', 'skills'), { items: skills });
            setToast('Saqlandi! ✅');
            setTimeout(() => setToast(''), 2500);
        } catch (err) {
            setToast('Xatolik: ' + err.message);
            setTimeout(() => setToast(''), 3000);
        }
        setSaving(false);
    };

    const handleResetMega = () => {
        if (window.confirm("⚠️ DIQQAT! Barcha mavjud skillarni o'chirib, Mega Ro'yxatni (HTML, CSS, JS, React...) yuklamoqchimisiz? BU QAYTARIB BO'LMAS AMAL!")) {
            setSkills([...defaultSkills]);
            setToast('🔄 Mega Ro\'yxat yuklandi! Saqlashni bosing.');
            setTimeout(() => setToast(''), 3000);
        }
    };

    const handleCancel = () => {
        setEditing(null);
        setForm({ ...emptyForm });
    };

    const handleAdd = () => {
        if (!form.name.trim()) return;
        setSkills([...skills, { ...form, level: Number(form.level) }]);
        setForm({ ...emptyForm });
    };

    const handleEdit = (i) => {
        setEditing(i);
        setForm({ ...skills[i], icon: skills[i].icon || '📦', category: skills[i].category || 'languages' });
    };

    const handleUpdate = () => {
        const updated = [...skills];
        updated[editing] = { ...form, level: Number(form.level) };
        setSkills(updated);
        handleCancel();
    };

    const handleDelete = (i) => {
        if (window.confirm('O\'chirilsinmi?')) {
            if (editing === i) handleCancel();
            setSkills(skills.filter((_, idx) => idx !== i));
        }
    };

    return (
        <div>
            <div className="admin-page-header">
                <h1>💻 Bilimlar (Mega Ro'yxat)</h1>
                <p>Skills bo'limi — texnologiyalarni to'liq boshqarish</p>
            </div>

            {/* List */}
            <div className="admin-card">
                <h3>Mavjud Skilllar ({skills.length})</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxHeight: '400px', overflowY: 'auto', paddingRight: '10px' }}>
                    {skills.map((s, i) => (
                        <div key={i} className={`admin-item${editing === i ? ' admin-item-editing' : ''}`}>
                            <span style={{ fontSize: '1.3rem', flexShrink: 0 }}>{s.icon || '📦'}</span>
                            <div style={{ width: 12, height: 12, borderRadius: 4, background: s.color, flexShrink: 0 }} />
                            <div className="admin-item-info">
                                <h4>{s.name}</h4>
                                <p style={{ fontSize: '0.75rem', opacity: 0.7 }}>{s.category?.toUpperCase()}</p>
                            </div>
                            <div className="admin-item-actions">
                                <button className={`admin-edit-btn${editing === i ? ' active-edit' : ''}`} onClick={() => editing === i ? handleCancel() : handleEdit(i)}>
                                    {editing === i ? '✖️' : '✏️'}
                                </button>
                                <button className="admin-delete-btn" onClick={() => handleDelete(i)}>🗑️</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Add / Edit form */}
            <div className="admin-card" style={editing !== null ? { border: '1px solid #6382ff', boxShadow: '0 0 15px rgba(99,130,255,0.15)' } : {}}>
                <h3>{editing !== null ? `✏️ "${skills[editing]?.name}" ni tahrirlash` : '➕ Yangi Skill'}</h3>
                <div className="admin-form-row">
                    <div className="admin-form-group">
                        <label>Nomi</label>
                        <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="React" />
                    </div>
                    <div className="admin-form-group">
                        <label>Toifa (Category)</label>
                        <select
                            value={form.category}
                            onChange={(e) => setForm({ ...form, category: e.target.value })}
                            style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)', color: '#fff' }}
                        >
                            <option value="languages">Languages (Tillar)</option>
                            <option value="frameworks">Frameworks & Libraries</option>
                            <option value="styling">Styling & UI</option>
                            <option value="tools">Tools & Utilities</option>
                            <option value="backend">Backend Services</option>
                            <option value="additional">Additional (Qo'shimcha)</option>
                        </select>
                    </div>
                </div>
                <div className="admin-form-row">
                    <div className="admin-form-group">
                        <label>Icon (emoji)</label>
                        <input value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} placeholder="⚛️" style={{ fontSize: '1.2rem' }} />
                    </div>
                    <div className="admin-form-group">
                        <label>Rang</label>
                        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                            <input type="color" value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} style={{ width: 48, height: 36, border: 'none', cursor: 'pointer' }} />
                            <input value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} style={{ flex: 1 }} />
                        </div>
                    </div>
                </div>
                {editing !== null ? (
                    <div style={{ display: 'flex', gap: 10 }}>
                        <button className="admin-save-btn" onClick={handleUpdate}>✅ O'zgartirish</button>
                        <button className="admin-delete-btn" onClick={handleCancel}>✖️ Bekor qilish</button>
                    </div>
                ) : (
                    <button className="admin-add-btn" onClick={handleAdd}>+ Qo'shish</button>
                )}
            </div>

            <div style={{ display: 'flex', gap: 15, marginTop: 20 }}>
                <button className="admin-save-btn" onClick={handleSave} disabled={saving} style={{ flex: 2 }}>
                    {saving ? '⏳ Saqlanmoqda...' : '💾 Firebasega Saqlash'}
                </button>
                <button className="admin-delete-btn" onClick={handleResetMega} style={{ flex: 1, background: '#ff4d4d', color: '#fff' }}>
                    🔄 Reset Mega
                </button>
            </div>
            {toast && <div className="admin-toast">{toast}</div>}
        </div>
    );
}
