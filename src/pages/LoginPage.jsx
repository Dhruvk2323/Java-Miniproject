import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(username, password);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Invalid username or password.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      // MANDATORY REQUIREMENT: New user starts with budget = 0
      await register({ fullName, username, email, password });
      navigate('/');
    } catch (err) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = async (u, p) => {
    setIsRegister(false);
    setUsername(u);
    setPassword(p);
    try {
      await login(u, p);
      navigate('/');
    } catch (err) {
      setError('Demo login failed: ' + err.message);
    }
  };

  const handleQuickNewUser = async () => {
    const testId = Math.floor(100 + Math.random() * 900);
    const newUsername = `student_${testId}`;
    try {
      await register({
        fullName: 'New Student Demo',
        username: newUsername,
        email: `${newUsername}@college.edu`,
        password: 'password123'
      });
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ maxWidth: '1020px', margin: '2rem auto', width: '100%' }}>
      <div className="auth-grid">
        
        {/* Left Showcase Banner */}
        <div className="auth-banner">
          <div className="auth-brand-area">
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.6rem',
              background: 'rgba(255,255,255,0.1)',
              padding: '0.4rem 0.85rem',
              borderRadius: '9999px',
              fontSize: '0.78rem',
              fontWeight: 700,
              color: '#c7d2fe',
              border: '1px solid rgba(255,255,255,0.15)'
            }}>
              🚀 Full Stack Mini Project: React + Spring Boot
            </div>

            <h1 className="auth-banner-title">
              Manage Spending With <span>Total Precision</span>.
            </h1>
            <p className="auth-banner-desc">
              SpendWise empowers you with automated monthly budget alerts, categorical expenditure breakdowns, and real-time financial health intelligence.
            </p>
          </div>

          <div className="auth-feature-list">
            <div className="auth-feature-item">
              <div className="auth-feature-icon">✓</div>
              <span><strong>Zero-Setup Budgeting:</strong> All new accounts initialize at strictly ₹0 budget.</span>
            </div>
            <div className="auth-feature-item">
              <div className="auth-feature-icon">✓</div>
              <span><strong>Category & Method Breakdowns:</strong> UPI, Credit Cards, Net Banking & Cash.</span>
            </div>
            <div className="auth-feature-item">
              <div className="auth-feature-icon">✓</div>
              <span><strong>Lab Evaluation Ready:</strong> CO5 & CO6 observation matrix and MySQL architecture specs.</span>
            </div>
          </div>

          <div className="auth-banner-footer">
            <span>Subject Code: <code>CE-JWP-LAB</code></span>
            <span>Scheme: <code>DB25-V1</code></span>
          </div>
        </div>

        {/* Right Form Side */}
        <div className="auth-form-side">
          <div className="auth-tabs">
            <button
              className={`auth-tab-btn ${!isRegister ? 'active' : ''}`}
              onClick={() => { setIsRegister(false); setError(''); }}
            >
              Sign In
            </button>
            <button
              className={`auth-tab-btn ${isRegister ? 'active' : ''}`}
              onClick={() => { setIsRegister(true); setError(''); }}
            >
              Create Account
            </button>
          </div>

          {error && (
            <div className="alert-banner alert-danger" style={{ marginBottom: '1.25rem', padding: '0.75rem 1rem', fontSize: '0.88rem' }}>
              ⚠️ {error}
            </div>
          )}

          {!isRegister ? (
            <div>
              <div className="auth-header">
                <h2>Welcome Back</h2>
                <p>Sign in to access your personal expense dashboard</p>
              </div>

              <form onSubmit={handleLoginSubmit}>
                <div className="form-group">
                  <label className="form-label">Username or Email</label>
                  <div className="input-wrap">
                    <svg className="input-icon-left" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                    <input
                      type="text"
                      className="form-control has-icon"
                      placeholder="e.g., karan or karan@example.com"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Password</label>
                  <div className="input-wrap">
                    <svg className="input-icon-left" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className="form-control has-icon"
                      placeholder="Enter password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="input-btn-right"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                    </button>
                  </div>
                </div>

                <button type="submit" className="btn-submit-auth" disabled={loading}>
                  <span>{loading ? 'Signing in...' : 'Sign In to SpendWise'}</span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                </button>
              </form>

              {/* Quick Demo Logins for Teacher Evaluation */}
              <div className="demo-users-divider">
                <span>Quick Evaluation Demo Accounts</span>
              </div>

              <div className="demo-chips-grid">
                <button type="button" className="demo-chip" onClick={() => handleQuickDemo('karan', 'password')}>
                  <span className="demo-chip-role">👤 Karan (Student)</span>
                  <span className="demo-chip-sub">₹30k Budget • 10 txns</span>
                </button>
                <button type="button" className="demo-chip" onClick={() => handleQuickDemo('admin', 'admin123')}>
                  <span className="demo-chip-role">🛡️ Admin</span>
                  <span className="demo-chip-sub">₹50k Budget</span>
                </button>
                <button type="button" className="demo-chip" onClick={handleQuickNewUser}>
                  <span className="demo-chip-role">✨ Fresh User</span>
                  <span className="demo-chip-sub">Initial ₹0 Budget</span>
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div className="auth-header">
                <h2>Create New Account</h2>
                <p>Start tracking your expenses with zero initial budget</p>
              </div>

              <form onSubmit={handleRegisterSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Full Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Rahul Sharma"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Username *</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. rahul26"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                      minLength={3}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Email Address *</label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="e.g. rahul@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Password *</label>
                    <input
                      type="password"
                      className="form-control"
                      placeholder="Min 6 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Confirm Password *</label>
                    <input
                      type="password"
                      className="form-control"
                      placeholder="Repeat password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      minLength={6}
                    />
                  </div>
                </div>

                {/* Initial Budget Policy Notice */}
                <div className="budget-info-callout">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                  <p>
                    <strong>Initial Budget Policy:</strong> For every new user, the monthly budget is initialized to <strong>₹0.00</strong>. You can customize your spending goal anytime directly from your dashboard.
                  </p>
                </div>

                <button type="submit" className="btn-submit-auth" disabled={loading}>
                  <span>{loading ? 'Creating account...' : 'Create Account (₹0 Initial Budget)'}</span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                </button>
              </form>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
