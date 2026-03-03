import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export default function AdminHero() {
    const [data, setData] = useState({
        name1: 'Adhamjonov',
        name2: 'Doston',
        role: 'Frontend Developer',
        tagline: 'Zamonaviy va chiroyli web saytlar yarataman',
        badge: '✋ Salom, men frontend dasturchiman',
        stack: 'React, Next.js, TypeScript, Tailwind',
        initials: 'DA',
        badgeTL: '⚡ Tez va sifatli',
        badgeBR: '🏆 3+ yil tajriba',
        cvUrl: '',
    });
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState('');

    useEffect(() => {
        getDoc(doc(db, 'portfolio', 'hero')).then((snap) => {
            if (snap.exists()) {
                const snapData = snap.data();
                const { avatarUrl, ...rest } = snapData;
                setData(prev => ({ ...prev, ...rest }));
            }
        }).catch(() => { });
    }, []);

    const showToast = (msg) => {
        setToast(msg);
        setTimeout(() => setToast(''), 3000);
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await setDoc(doc(db, 'portfolio', 'hero'), data);
            showToast('✅ Saqlandi!');
        } catch (err) {
            showToast('❌ Xatolik: ' + err.message);
        }
        setSaving(false);
    };

    return (
        <div>
            <div className="admin-page-header">
                <h1>🏠 Hero Bo'limi</h1>
                <p>Asosiy sahifadagi bosh qism ma'lumotlari</p>
            </div>

            <div className="admin-card">
                <h3>Ism va Lavozim</h3>
                <div className="admin-form-row">
                    <div className="admin-form-group">
                        <label>Ism (1-qator)</label>
                        <input value={data.name1} onChange={(e) => setData({ ...data, name1: e.target.value })} />
                    </div>
                    <div className="admin-form-group">
                        <label>Ism (2-qator, gradient)</label>
                        <input value={data.name2} onChange={(e) => setData({ ...data, name2: e.target.value })} />
                    </div>
                </div>
                <div className="admin-form-group">
                    <label>Lavozim / Rol</label>
                    <input value={data.role} onChange={(e) => setData({ ...data, role: e.target.value })} />
                </div>
                <div className="admin-form-group">
                    <label>Initials (Avatar o'rniga)</label>
                    <input value={data.initials} onChange={(e) => setData({ ...data, initials: e.target.value })} maxLength={3} />
                </div>

                {/* CV URL */}
                <div className="admin-form-group">
                    <label>📄 CV havolasi</label>
                    <input
                        value={data.cvUrl}
                        onChange={(e) => setData({ ...data, cvUrl: e.target.value })}
                        placeholder="/cv.pdf yoki GitHub raw link..."
                    />
                    <p style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '6px', lineHeight: 1.5 }}>
                        💡 CV faylni <b>public/</b> papkaga <b>cv.pdf</b> nomi bilan joylang — avtomatik ishlaydi.
                        <br />Yoki GitHub Raw link kiriting.
                    </p>
                    {data.cvUrl && (
                        <a
                            href={data.cvUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px',
                                marginTop: '8px',
                                padding: '8px 14px',
                                background: 'rgba(99, 130, 255, 0.08)',
                                borderRadius: '10px',
                                border: '1px solid rgba(99, 130, 255, 0.15)',
                                color: '#6382ff',
                                fontSize: '0.82rem',
                                textDecoration: 'none'
                            }}
                        >
                            📄 CV ko'rish ↗
                        </a>
                    )}
                </div>
            </div>

            <div className="admin-card">
                <h3>Matn va Badge</h3>
                <div className="admin-form-group">
                    <label>Badge (yuqoridagi yashil nuqta yonidagi)</label>
                    <input value={data.badge} onChange={(e) => setData({ ...data, badge: e.target.value })} />
                </div>
                <div className="admin-form-group">
                    <label>Tagline (qisqa tavsif)</label>
                    <textarea rows={3} value={data.tagline} onChange={(e) => setData({ ...data, tagline: e.target.value })} />
                </div>
            </div>

            <div className="admin-card">
                <h3>Texnologiyalar va Badgelar</h3>
                <div className="admin-form-group">
                    <label>Stack (vergul bilan)</label>
                    <input value={data.stack} onChange={(e) => setData({ ...data, stack: e.target.value })} placeholder="React, Next.js, TypeScript" />
                </div>
                <div className="admin-form-row">
                    <div className="admin-form-group">
                        <label>Suzuvchi badge (chap-yuqori)</label>
                        <input value={data.badgeTL} onChange={(e) => setData({ ...data, badgeTL: e.target.value })} />
                    </div>
                    <div className="admin-form-group">
                        <label>Suzuvchi badge (o'ng-pastki)</label>
                        <input value={data.badgeBR} onChange={(e) => setData({ ...data, badgeBR: e.target.value })} />
                    </div>
                </div>
            </div>

            <button className="admin-save-btn" onClick={handleSave} disabled={saving}>
                {saving ? '⏳ Saqlanmoqda...' : '💾 Saqlash'}
            </button>

            {toast && <div className="admin-toast">{toast}</div>}
        </div>
    );
}
