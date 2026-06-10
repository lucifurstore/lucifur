import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDocumentTitle } from '../../utils/useDocumentTitle';
import styles from './AdminLogin.module.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  useDocumentTitle('Admin Access');

  const expiredMessage = location.state?.expired ? "Your session has expired. Please log in again." : "";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'Login failed');
      if (data.data.role !== 'admin') throw new Error('Access denied. Admin only.');

      localStorage.setItem('adminToken', data.data.token);
      localStorage.setItem('adminInfo', JSON.stringify(data.data));
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginPage}>
      <div className={styles.loginCard}>
        <div className={styles.loginHeader}>
          <h1>LUCIFUR</h1>
          <div className={styles.divider} />
          <p>Admin Panel Access</p>
        </div>

        {expiredMessage && (
          <div style={{ color: '#f0c040', border: '1px solid rgba(240, 192, 64, 0.3)', background: 'rgba(240, 192, 64, 0.08)', padding: '10px 14px', fontSize: '0.8rem', letterSpacing: '1px', marginBottom: '16px', textAlign: 'center' }}>
            {expiredMessage}
          </div>
        )}
        {error && <div className={styles.errorMsg}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="admin-email">Email Address</label>
            <input
              id="admin-email"
              type="email"
              placeholder="admin@lucifur.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="admin-password">Password</label>
            <input
              id="admin-password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>
          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? 'AUTHENTICATING...' : 'ACCESS PANEL'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
