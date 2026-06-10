import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import styles from './AuthModal.module.css';

const AuthModal = () => {
  const { showAuthModal, setShowAuthModal, authMode, setAuthMode, login, signup } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!showAuthModal) return null;

  const reset = () => {
    setName(''); setEmail(''); setPassword(''); setError('');
  };

  const switchMode = (mode) => {
    reset();
    setAuthMode(mode);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (authMode === 'login') {
        await login(email, password);
      } else {
        if (password.length < 6) throw new Error('Password must be at least 6 characters');
        await signup(name, email, password);
      }
      reset();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={() => setShowAuthModal(false)}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={() => setShowAuthModal(false)}>
          <X size={20} />
        </button>

        <div className={styles.header}>
          <h2>LUCIFUR</h2>
          <p>{authMode === 'login' ? 'Welcome back' : 'Create your account'}</p>
        </div>

        {/* Tabs */}
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${authMode === 'login' ? styles.active : ''}`}
            onClick={() => switchMode('login')}
          >
            Sign In
          </button>
          <button
            className={`${styles.tab} ${authMode === 'signup' ? styles.active : ''}`}
            onClick={() => switchMode('signup')}
          >
            Register
          </button>
        </div>

        {error && <div className={styles.errorMsg}>{error}</div>}

        <form onSubmit={handleSubmit}>
          {authMode === 'signup' && (
            <div className={styles.formGroup}>
              <label htmlFor="auth-name">Full Name</label>
              <input
                id="auth-name"
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                required
              />
            </div>
          )}
          <div className={styles.formGroup}>
            <label htmlFor="auth-email">Email Address</label>
            <input
              id="auth-email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="auth-password">Password</label>
            <input
              id="auth-password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={authMode === 'login' ? 'current-password' : 'new-password'}
              required
            />
          </div>
          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading
              ? authMode === 'login' ? 'SIGNING IN...' : 'CREATING ACCOUNT...'
              : authMode === 'login' ? 'SIGN IN' : 'CREATE ACCOUNT'}
          </button>
        </form>

        <p className={styles.switchText}>
          {authMode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <button onClick={() => switchMode(authMode === 'login' ? 'signup' : 'login')}>
            {authMode === 'login' ? 'Register' : 'Sign In'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthModal;
