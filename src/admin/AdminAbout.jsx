import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export default function AdminAbout() {
    const [data, setData] = useState({
        cardName: 'Adhamjonov Doston',
        cardRole: 'Frontend Developer',
        cardLocation: 'Tashkent, Uzbekistan',
        cardBadge1: 'Open to work',
        cardBadge2: 'Remote OK',
        text1: '',
        text2: '',
        stat1Value: '3+', stat1Label: 'Yil tajriba',
        stat2Value: '40+', stat2Label: 'Loyihalar',
        stat3Value: '25+', stat3Label: 'Mijozlar',
        stat4Value: '99%', stat4Label: 'Mamnunlik',
    });
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState('');

    useEffect(() => {
        getDoc(doc(db, 'portfolio', 'about')).then((snap) => {
            if (snap.exists()) setData(snap.data());
        }).catch(() => { });
    }, []);

    const handleSave = async () => {
        setSaving(true);
        try {
            await setDoc(doc(db, 'portfolio', 'about'), data);
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
                <h1>👤 Haqimda</h1>
                <p>About bo'limi ma'lumotlari</p>
            </div>

            <div className="admin-card">
                <h3>Karta Ma'lumotlari</h3>
                <div className="admin-form-row">
                    <div className="admin-form-group">
                        <label>Ism</label>
                        <input value={data.cardName} onChange={(e) => setData({ ...data, cardName: e.target.value })} />
                    </div>
                    <div className="admin-form-group">
                        <label>Lavozim</label>
                        <input value={data.cardRole} onChange={(e) => setData({ ...data, cardRole: e.target.value })} />
                    </div>
                </div>
                <div className="admin-form-group">
                    <label>Joylashuv</label>
                    <input value={data.cardLocation} onChange={(e) => setData({ ...data, cardLocation: e.target.value })} />
                </div>
                <div className="admin-form-row">
                    <div className="admin-form-group">
                        <label>Badge 1</label>
                        <input value={data.cardBadge1} onChange={(e) => setData({ ...data, cardBadge1: e.target.value })} />
                    </div>
                    <div className="admin-form-group">
                        <label>Badge 2</label>
                        <input value={data.cardBadge2} onChange={(e) => setData({ ...data, cardBadge2: e.target.value })} />
                    </div>
                </div>
            </div>

            <div className="admin-card">
                <h3>Haqimda Matn</h3>
                <div className="admin-form-group">
                    <label>1-Paragraf</label>
                    <textarea rows={4} value={data.text1} onChange={(e) => setData({ ...data, text1: e.target.value })} />
                </div>
                <div className="admin-form-group">
                    <label>2-Paragraf</label>
                    <textarea rows={4} value={data.text2} onChange={(e) => setData({ ...data, text2: e.target.value })} />
                </div>
            </div>

            <div className="admin-card">
                <h3>Statistika</h3>
                <div className="admin-form-row">
                    <div className="admin-form-group">
                        <label>Stat 1 — Qiymat</label>
                        <input value={data.stat1Value} onChange={(e) => setData({ ...data, stat1Value: e.target.value })} />
                    </div>
                    <div className="admin-form-group">
                        <label>Stat 1 — Label</label>
                        <input value={data.stat1Label} onChange={(e) => setData({ ...data, stat1Label: e.target.value })} />
                    </div>
                </div>
                <div className="admin-form-row">
                    <div className="admin-form-group">
                        <label>Stat 2 — Qiymat</label>
                        <input value={data.stat2Value} onChange={(e) => setData({ ...data, stat2Value: e.target.value })} />
                    </div>
                    <div className="admin-form-group">
                        <label>Stat 2 — Label</label>
                        <input value={data.stat2Label} onChange={(e) => setData({ ...data, stat2Label: e.target.value })} />
                    </div>
                </div>
                <div className="admin-form-row">
                    <div className="admin-form-group">
                        <label>Stat 3 — Qiymat</label>
                        <input value={data.stat3Value} onChange={(e) => setData({ ...data, stat3Value: e.target.value })} />
                    </div>
                    <div className="admin-form-group">
                        <label>Stat 3 — Label</label>
                        <input value={data.stat3Label} onChange={(e) => setData({ ...data, stat3Label: e.target.value })} />
                    </div>
                </div>
                <div className="admin-form-row">
                    <div className="admin-form-group">
                        <label>Stat 4 — Qiymat</label>
                        <input value={data.stat4Value} onChange={(e) => setData({ ...data, stat4Value: e.target.value })} />
                    </div>
                    <div className="admin-form-group">
                        <label>Stat 4 — Label</label>
                        <input value={data.stat4Label} onChange={(e) => setData({ ...data, stat4Label: e.target.value })} />
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
