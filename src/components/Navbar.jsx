import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ onOpenAddExpense }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();

  const isActive = (path) => (location.pathname === path ? 'active' : '');

  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to log out of SpendWise?')) {
      await logout();
      navigate('/login');
    }
  };

  const displayName = currentUser ? (currentUser.fullName || currentUser.username) : '';
  const initials = displayName
    ? displayName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : 'U';

  return (
    <header className="app-header">
      <div className="navbar-container">
        
        {/* Brand Logo & Identity */}
        <Link to="/" className="brand-wrap">
          <svg className="brand-logo-svg" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="navLogoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="50%" stopColor="#4f46e5" />
                <stop offset="100%" stopColor="#312e81" />
              </linearGradient>
              <linearGradient id="navShieldAccent" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="100%" stopColor="#818cf8" />
              </linearGradient>
              <linearGradient id="navGoldPulse" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#34d399" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>
            </defs>
            <rect x="6" y="6" width="88" height="88" rx="24" fill="url(#navLogoGrad)" stroke="rgba(255,255,255,0.18)" strokeWidth="2.5" />
            <path d="M18 64 C30 52, 45 74, 60 56 C70 44, 78 48, 82 42" stroke="url(#navShieldAccent)" strokeWidth="4.5" strokeLinecap="round" fill="none" opacity="0.4" />
            <path d="M33 30 H67" stroke="#ffffff" strokeWidth="6" strokeLinecap="round" />
            <path d="M33 42 H63" stroke="#ffffff" strokeWidth="6" strokeLinecap="round" />
            <path d="M47 30 V54 C58 54, 64 48, 64 42" stroke="#ffffff" strokeWidth="6" strokeLinecap="round" fill="none" />
            <path d="M44 54 L66 74" stroke="#ffffff" strokeWidth="6" strokeLinecap="round" />
            <circle cx="72" cy="28" r="6" fill="url(#navGoldPulse)" />
            <path d="M72 22 L72 34 M66 28 L78 28" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
          </svg>

          <div className="brand-info">
            <div className="brand-title">
              Spend<span className="brand-gradient">Wise</span>
              <span className="brand-badge">PRO v2.0</span>
            </div>
            <span className="brand-subtitle">Smart Financial Intelligence</span>
          </div>
        </Link>

        {/* Navigation Links */}
        {currentUser && (
          <nav className="nav-navigation">
            <Link to="/" className={`nav-link-btn ${isActive('/')}`}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>
              Dashboard
            </Link>
            <Link to="/expenses" className={`nav-link-btn ${isActive('/expenses')}`}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><line x1="8" x2="21" y1="6" y2="6"/><line x1="8" x2="21" y1="12" y2="12"/><line x1="8" x2="21" y1="18" y2="18"/><line x1="3" x2="3.01" y1="6" y2="6"/><line x1="3" x2="3.01" y1="12" y2="12"/><line x1="3" x2="3.01" y1="18" y2="18"/></svg>
              All Expenses
            </Link>
            <Link to="/reports" className={`nav-link-btn ${isActive('/reports')}`}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>
              Reports & Lab Manual
            </Link>
            <Link to="/specs" className={`nav-link-btn ${isActive('/specs')}`}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
              Full Stack Specs
            </Link>
          </nav>
        )}

        {/* Right Area: Add Button, User Avatar, Logout */}
        {currentUser ? (
          <div className="nav-actions">
            <Link to="/add" className="btn-quick-add">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
              <span>Add Expense</span>
            </Link>

            <div className="user-pill">
              <div className="user-avatar">{initials}</div>
              <span className="user-name-text">{displayName}</span>
            </div>

            <button className="btn-logout" onClick={handleLogout} title="Sign out of SpendWise">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
              <span>Logout</span>
            </button>
          </div>
        ) : (
          <div className="nav-actions">
            <Link to="/login" className="btn-quick-add">
              <span>Sign In / Register</span>
            </Link>
          </div>
        )}

      </div>
    </header>
  );
}
