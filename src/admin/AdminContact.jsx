import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export default function AdminContact() {
    const [data, setData] = useState({
        email: 'abdumajid@example.com',
        phone: '+998 90 123 45 67',
        location: 'Tashkent, Uzbekistan',
        telegram: 'https://t.me/abdumajid',
        instagram: 'https://instagram.com/abdumajid',
        linkedin: 'https://linkedin.com/in/abdumajid',
        github: 'https://github.com/abdumajid',
    });
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState('');

    useEffect(() => {
        getDoc(doc(db, 'portfolio', 'contact')).then((snap) => {
            if (snap.exists()) setData(snap.data());
        }).catch(() => { });
    }, []);

    const normalizeUrl = (url, key) => {
        if (!url) return '';
        let normalized = url.trim();
        if (normalized.startsWith('http://') || normalized.startsWith('https://') || normalized.startsWith('mailto:') || normalized.startsWith('tel:')) {
            return normalized;
        }
        if (key === 'telegram' && normalized.startsWith('@')) {
            return `https://t.me/${normalized.substring(1)}`;
        }
        if (key === 'telegram' && !normalized.includes('/')) {
            return `https://t.me/${normalized}`;
        }
        if (key === 'email') return `mailto:${normalized}`;
        if (key === 'phone') return normalized; // Phone usually handled separately
        return `https://${normalized}`;
    };

    const handleSave = async () => {
        setSaving(true);
        const normalizedData = { ...data };
        ['telegram', 'instagram', 'linkedin', 'github'].forEach(key => {
            normalizedData[key] = normalizeUrl(normalizedData[key], key);
        });

        try {
            await setDoc(doc(db, 'portfolio', 'contact'), normalizedData);
            setData(normalizedData);
            setToast('Saqlandi! ✅');
            setTimeout(() => setToast(''), 2500);
        } catch (err) {
            setToast('Xatolik: ' + err.message);
            setTimeout(() => setToast(''), 3000);
        }
        setSaving(false);
    };

    return (
        <div>
            <div className="admin-page-header">
                <h1>📧 Aloqa</h1>
                <p>Contact bo'limi ma'lumotlari</p>
            </div>

            <div className="admin-card">
                <h3>Asosiy Ma'lumotlar</h3>
                <div className="admin-form-group">
                    <label>Email</label>
                    <input value={data.email} onChange={(e) => setData({ ...data, email: e.target.value })} />
                </div>
                <div className="admin-form-group">
                    <label>Telefon</label>
                    <input value={data.phone} onChange={(e) => setData({ ...data, phone: e.target.value })} />
                </div>
                <div className="admin-form-group">
                    <label>Manzil</label>
                    <input value={data.location} onChange={(e) => setData({ ...data, location: e.target.value })} />
                </div>
            </div>

            <div className="admin-card">
                <h3>Ijtimoiy Tarmoqlar</h3>
                <div className="admin-form-group">
                    <label>Telegram</label>
                    <input value={data.telegram} onChange={(e) => setData({ ...data, telegram: e.target.value })} placeholder="https://t.me/username" />
                </div>
                <div className="admin-form-group">
                    <label>Instagram</label>
                    <input value={data.instagram} onChange={(e) => setData({ ...data, instagram: e.target.value })} placeholder="https://instagram.com/username" />
                </div>
                <div className="admin-form-group">
                    <label>LinkedIn</label>
                    <input value={data.linkedin} onChange={(e) => setData({ ...data, linkedin: e.target.value })} placeholder="https://linkedin.com/in/username" />
                </div>
                <div className="admin-form-group">
                    <label>GitHub</label>
                    <input value={data.github} onChange={(e) => setData({ ...data, github: e.target.value })} placeholder="https://github.com/username" />
                </div>
            </div>

            <button className="admin-save-btn" onClick={handleSave} disabled={saving}>
                {saving ? '⏳ Saqlanmoqda...' : '💾 Saqlash'}
            </button>
            {toast && <div className="admin-toast">{toast}</div>}
        </div>
    );
}
