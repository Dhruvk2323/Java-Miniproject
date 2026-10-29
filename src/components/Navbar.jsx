import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <nav className="navbar">
      <Link to="/" className="nav-brand">
        <div className="brand-icon">₹</div>
        <span>SpendWise | Expense Tracker</span>
      </Link>

      <div className="nav-links">
        <Link to="/" className={`nav-link ${isActive('/')}`}>
          📊 Dashboard
        </Link>
        <Link to="/expenses" className={`nav-link ${isActive('/expenses')}`}>
          💳 All Expenses
        </Link>
        <Link to="/reports" className={`nav-link ${isActive('/reports')}`}>
          📈 Reports & Analytics
        </Link>
        <Link to="/add" className="nav-link nav-btn-primary">
          ➕ Add Expense
        </Link>
      </div>
    </nav>
  );
}
