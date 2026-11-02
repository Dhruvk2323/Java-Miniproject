import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchDashboardStats, updateMonthlyBudget, deleteExpense } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const [newBudget, setNewBudget] = useState('');
  const [notification, setNotification] = useState('');

  const { currentUser, updateBudgetLocally } = useAuth();

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await fetchDashboardStats();
      setStats(data);
      setNewBudget(data.monthlyBudget !== undefined ? data.monthlyBudget : 0);
    } catch (err) {
      console.error('Error fetching dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleBudgetSave = async (e) => {
    e.preventDefault();
    const val = Number(newBudget);
    if (isNaN(val) || val < 0) {
      alert('Please enter a valid non-negative number for your budget.');
      return;
    }
    try {
      await updateMonthlyBudget(val);
      updateBudgetLocally(val);
      setIsEditingBudget(false);
      setNotification(`Target budget successfully updated to ₹${val.toLocaleString('en-IN')}!`);
      setTimeout(() => setNotification(''), 4000);
      loadData();
    } catch (err) {
      alert('Failed to update budget: ' + err.message);
    }
  };

  const handleDelete = async (id, title) => {
    if (window.confirm(`Are you sure you want to delete the expense "${title}"?`)) {
      try {
        await deleteExpense(id);
        setNotification(`Expense "${title}" deleted.`);
        setTimeout(() => setNotification(''), 4000);
        loadData();
      } catch (err) {
        alert('Failed to delete expense: ' + err.message);
      }
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}>
        <h2>Loading your SpendWise dashboard...</h2>
      </div>
    );
  }

  const {
    totalExpense = 0,
    currentMonthExpense = 0,
    monthlyBudget = 0,
    remainingBudget = 0,
    budgetUsedPercentage = 0,
    totalTransactions = 0,
    categoryBreakdown = [],
    recentExpenses = []
  } = stats || {};

  const displayName = currentUser ? (currentUser.fullName || currentUser.username) : 'User';

  return (
    <div>
      {/* Top Header */}
      <div className="dashboard-header">
        <div className="dash-greeting-wrap">
          <h1>
            <span>Financial Overview</span>
            <span className="badge-pill safe">● Live Ledger</span>
          </h1>
          <p>
            Real-time expenditure tracking and budget ceiling analytics for{' '}
            <strong style={{ color: 'var(--primary)' }}>{displayName}</strong>
          </p>
        </div>

        <div className="dash-action-buttons">
          <button className="btn btn-secondary" onClick={() => setIsEditingBudget(true)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><circle cx="12" cy="12" r="10"/><path d="m4.93 4.93 4.24 4.24"/><path d="m14.83 9.17 4.24-4.24"/><path d="m14.83 14.83 4.24 4.24"/><path d="m9.17 14.83-4.24 4.24"/></svg>
            <span>Set / Edit Budget</span>
          </button>
          <Link to="/add" className="btn btn-primary">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            <span>Add Expense</span>
          </Link>
        </div>
      </div>

      {notification && (
        <div className="alert-banner alert-success" style={{ marginBottom: '1.5rem' }}>
          ✓ {notification}
        </div>
      )}

      {/* ZERO BUDGET HERO BANNER - Displayed when monthlyBudget === 0 */}
      {monthlyBudget === 0 && (
        <div className="zero-budget-card">
          <div className="zero-budget-content">
            <div className="zero-budget-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
            </div>
            <div className="zero-budget-text">
              <h3>New User Account: Monthly Budget is ₹0.00</h3>
              <p>Your spending budget has not been configured yet. Set a monthly target to activate threshold monitoring and expenditure alerts.</p>
            </div>
          </div>
          <button className="btn-set-budget-hero" onClick={() => setIsEditingBudget(true)}>
            🎯 Set Monthly Budget
          </button>
        </div>
      )}

      {/* 4 Stat Overview Cards */}
      <div className="stat-cards-grid">
        
        {/* CARD 1: THIS MONTH SPENT */}
        <div className="stat-card card-spent">
          <div className="stat-card-header">
            <span className="stat-label">This Month Spent</span>
            <div className="stat-icon-wrap stat-icon-spent">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
            </div>
          </div>
          <div className="stat-value">₹{currentMonthExpense.toLocaleString('en-IN')}</div>
          <div className="stat-subtext">
            {monthlyBudget > 0 ? (
              <span className={`badge-pill ${budgetUsedPercentage > 90 ? 'danger' : (budgetUsedPercentage > 70 ? 'warning' : 'safe')}`}>
                {budgetUsedPercentage}% of budget
              </span>
            ) : (
              <span className="badge-pill neutral">Budget not set (₹0)</span>
            )}
            <span style={{ fontSize: '0.78rem' }}>Current cycle</span>
          </div>
        </div>

        {/* CARD 2: REMAINING BUDGET */}
        <div className="stat-card card-remaining">
          <div className="stat-card-header">
            <span className="stat-label">Remaining Budget</span>
            <div className="stat-icon-wrap stat-icon-remaining">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M19 5c-1.5 0-2.8 1.4-3 2-3.5-1.5-11-.3-11 5 0 1.8 0 3 2 4.5V20h4v-2h3v2h4v-4c1-.5 1.7-1 2-2h2v-4h-2c0-1-.5-1.5-1-2V5z"/></svg>
            </div>
          </div>
          <div className="stat-value">
            {monthlyBudget === 0 ? '₹0' : (remainingBudget >= 0 ? `₹${remainingBudget.toLocaleString('en-IN')}` : `-₹${Math.abs(remainingBudget).toLocaleString('en-IN')}`)}
          </div>
          <div className="stat-subtext">
            {monthlyBudget === 0 ? (
              <span className="badge-pill neutral">Set target budget</span>
            ) : remainingBudget >= 0 ? (
              <span className="badge-pill safe">✓ Within limit</span>
            ) : (
              <span className="badge-pill danger">⚠️ Over budget!</span>
            )}
          </div>
        </div>

        {/* CARD 3: ALL-TIME EXPENSES */}
        <div className="stat-card card-alltime">
          <div className="stat-card-header">
            <span className="stat-label">All-Time Expenses</span>
            <div className="stat-icon-wrap stat-icon-alltime">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
            </div>
          </div>
          <div className="stat-value">₹{totalExpense.toLocaleString('en-IN')}</div>
          <div className="stat-subtext">
            <span className="badge-pill neutral">{totalTransactions} transactions</span>
          </div>
        </div>

        {/* CARD 4: MONTHLY TARGET BUDGET */}
        <div className="stat-card card-budget">
          <div className="stat-card-header">
            <span className="stat-label">Monthly Target Budget</span>
            <div className="stat-icon-wrap stat-icon-budget">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
            </div>
          </div>
          <div className="stat-value">₹{monthlyBudget.toLocaleString('en-IN')}</div>
          <div className="stat-subtext">
            <button
              onClick={() => setIsEditingBudget(true)}
              style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline', padding: 0 }}
            >
              Change Limit ✎
            </button>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-light)' }}>(Monthly cap)</span>
          </div>
        </div>

      </div>

      {/* Budget Progress Gauge */}
      <div className="budget-gauge-card">
        <div className="gauge-top">
          <span className="gauge-title">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>
            Monthly Budget Consumption Rate
          </span>
          <span className="gauge-stat-text">
            {monthlyBudget === 0
              ? `₹${currentMonthExpense.toLocaleString('en-IN')} spent • Monthly budget is ₹0.00`
              : `₹${currentMonthExpense.toLocaleString('en-IN')} spent of ₹${monthlyBudget.toLocaleString('en-IN')} (${budgetUsedPercentage}%)`}
          </span>
        </div>
        <div className="progress-track">
          <div
            className={`progress-bar-fill ${budgetUsedPercentage > 90 ? 'bar-red' : (budgetUsedPercentage > 70 ? 'bar-amber' : 'bar-green')}`}
            style={{ width: `${monthlyBudget === 0 ? 0 : Math.min(budgetUsedPercentage, 100)}%` }}
          />
        </div>
      </div>

      {/* Visual Breakdowns */}
      <div className="dashboard-charts-grid">
        
        {/* Spending by Category Card */}
        <div className="chart-card">
          <div className="chart-card-header">
            <div>
              <h3 className="chart-card-title">Spending by Category</h3>
              <p className="chart-card-subtitle">Distribution across predefined expenditure buckets</p>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {categoryBreakdown.filter(c => c.amount > 0).length === 0 ? (
              <div style={{ padding: '2rem 0', textAlign: 'center', color: 'var(--text-muted)' }}>
                No categorized spending recorded yet.
              </div>
            ) : (
              categoryBreakdown
                .filter(c => c.amount > 0)
                .map(cat => (
                  <div key={cat.categoryId} style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.86rem' }}>
                      <span style={{ fontWeight: 600, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: cat.color }}></span>
                        {cat.categoryName}
                      </span>
                      <span style={{ fontWeight: 700, fontFamily: 'JetBrains Mono, monospace' }}>
                        ₹{cat.amount.toLocaleString('en-IN')} ({cat.percentage}%)
                      </span>
                    </div>
                    <div style={{ height: '6px', background: '#f1f5f9', borderRadius: '999px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${cat.percentage}%`, background: cat.color, borderRadius: '999px' }} />
                    </div>
                  </div>
                ))
            )}
          </div>
        </div>

        {/* Quick Summary & Quick Actions */}
        <div className="chart-card">
          <div className="chart-card-header">
            <div>
              <h3 className="chart-card-title">Quick Actions & Shortcuts</h3>
              <p className="chart-card-subtitle">Common tasks and ledger operations</p>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', height: '100%' }}>
            <Link to="/add" className="btn btn-secondary" style={{ flexDirection: 'column', padding: '1.25rem 1rem', height: 'auto', textAlign: 'center' }}>
              <span style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>➕</span>
              <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>Add Expense</span>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Log a new transaction</span>
            </Link>
            <button onClick={() => setIsEditingBudget(true)} className="btn btn-secondary" style={{ flexDirection: 'column', padding: '1.25rem 1rem', height: 'auto', textAlign: 'center' }}>
              <span style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>🎯</span>
              <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>Edit Budget</span>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Adjust monthly ceiling</span>
            </button>
            <Link to="/expenses" className="btn btn-secondary" style={{ flexDirection: 'column', padding: '1.25rem 1rem', height: 'auto', textAlign: 'center' }}>
              <span style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>📋</span>
              <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>All Ledger</span>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Audit & search records</span>
            </Link>
            <Link to="/reports" className="btn btn-secondary" style={{ flexDirection: 'column', padding: '1.25rem 1rem', height: 'auto', textAlign: 'center' }}>
              <span style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>📊</span>
              <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>Lab Report</span>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>CO5 & CO6 Evaluation</span>
            </Link>
          </div>
        </div>

      </div>

      {/* Recent Transactions Table */}
      <div className="transactions-card">
        <div className="card-title-row">
          <div className="card-title-main">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
            Recent Transactions
          </div>
          <Link to="/expenses" className="btn btn-secondary btn-sm">
            View All Transactions →
          </Link>
        </div>

        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Title & Description</th>
                <th>Payment Method</th>
                <th>Expense Date</th>
                <th>Amount (₹)</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {recentExpenses.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '2.5rem 1rem', color: 'var(--text-muted)' }}>
                    No transactions recorded yet. Click <strong>+ Add Expense</strong> to record your first transaction!
                  </td>
                </tr>
              ) : (
                recentExpenses.map(exp => (
                  <tr key={exp.id}>
                    <td>
                      <span className="cell-title">{exp.title}</span>
                      {exp.notes && <span className="cell-notes">{exp.notes}</span>}
                    </td>
                    <td>
                      <span className="method-tag">{exp.paymentMethod || 'UPI'}</span>
                    </td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.84rem' }}>
                      {exp.expenseDate}
                    </td>
                    <td>
                      <span className="cell-amount">₹{Number(exp.amount).toLocaleString('en-IN')}</span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div className="table-actions">
                        <Link to={`/edit/${exp.id}`} className="btn-action-icon" title="Edit Expense">
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                        </Link>
                        <button className="btn-action-icon delete" onClick={() => handleDelete(exp.id, exp.title)} title="Delete Expense">
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Budget Modal Dialog */}
      {isEditingBudget && (
        <div className="modal-overlay open">
          <div className="modal-dialog" style={{ maxWidth: '480px' }}>
            <div className="modal-header">
              <h2 className="modal-title">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
                Configure Monthly Budget
              </h2>
              <button className="modal-close-btn" onClick={() => setIsEditingBudget(false)}>✕</button>
            </div>

            <form onSubmit={handleBudgetSave}>
              <div className="modal-body">
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                  Set your monthly spending ceiling. SpendWise will calculate remaining allowances and alert you as you near your limit.
                </p>

                <div className="form-group">
                  <label className="form-label">Monthly Target Budget (₹)</label>
                  <input
                    type="number"
                    step="100"
                    min="0"
                    className="form-control"
                    value={newBudget}
                    onChange={(e) => setNewBudget(e.target.value)}
                    placeholder="e.g. 25000"
                    style={{ fontSize: '1.2rem', fontWeight: 700, fontFamily: 'JetBrains Mono, monospace' }}
                    required
                  />

                  {/* Preset Quick Chips */}
                  <div className="budget-presets">
                    <button type="button" className="budget-preset-chip" onClick={() => setNewBudget('0')}>₹0 (Reset)</button>
                    <button type="button" className="budget-preset-chip" onClick={() => setNewBudget('5000')}>₹5,000</button>
                    <button type="button" className="budget-preset-chip" onClick={() => setNewBudget('15000')}>₹15,000</button>
                    <button type="button" className="budget-preset-chip" onClick={() => setNewBudget('30000')}>₹30,000</button>
                    <button type="button" className="budget-preset-chip" onClick={() => setNewBudget('50000')}>₹50,000</button>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsEditingBudget(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Target Budget</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
