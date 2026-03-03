import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './admin.css';

export default function AdminLogin() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        if (username === '1234' && password === '5678') {
            sessionStorage.setItem('admin_auth', 'true');
            navigate('/admin/dashboard');
        } else {
            setError("Login yoki parol noto'g'ri!");
        }
    };

    return (
        <div className="admin-login">
            <div className="admin-login-card">
                <div className="login-icon">🔐</div>
                <h1>Admin Panel</h1>
                <p>Portfolioni boshqarish paneli</p>
                {error && <div className="login-error">{error}</div>}
                <form className="admin-login-form" onSubmit={handleLogin}>
                    <input
                        type="text"
                        placeholder="Login"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        autoFocus
                    />
                    <input
                        type="password"
                        placeholder="Parol"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button type="submit">Kirish →</button>
                </form>
            </div>
        </div>
    );
}
