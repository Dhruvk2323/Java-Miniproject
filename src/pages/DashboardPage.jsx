import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchDashboardStats, updateMonthlyBudget, deleteExpense } from '../services/api';

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const [newBudget, setNewBudget] = useState('');
  const [notification, setNotification] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchDashboardStats();
      setStats(data);
      setNewBudget(data.monthlyBudget || 30000);
    } catch (err) {
      setError('Unable to connect to Spring Boot backend. Please ensure the backend is running on port 8080.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleBudgetSave = async (e) => {
    e.preventDefault();
    try {
      await updateMonthlyBudget(Number(newBudget));
      setIsEditingBudget(false);
      setNotification('Monthly budget successfully updated!');
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
        setNotification(`Expense "${title}" deleted successfully.`);
        setTimeout(() => setNotification(''), 4000);
        loadData();
      } catch (err) {
        alert('Failed to delete expense: ' + err.message);
      }
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem 0' }}>
        <h2>Loading dashboard financial metrics...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert-banner alert-danger" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '0.75rem' }}>
        <strong>Backend Connection Notice:</strong>
        <p>{error}</p>
        <button className="btn btn-secondary btn-sm" onClick={loadData}>
          🔄 Retry Connection
        </button>
      </div>
    );
  }

  const {
    totalExpense = 0,
    currentMonthExpense = 0,
    monthlyBudget = 30000,
    remainingBudget = 0,
    budgetUsedPercentage = 0,
    totalTransactions = 0,
    categoryBreakdown = [],
    recentExpenses = []
  } = stats || {};

  const getProgressColorClass = (pct) => {
    if (pct >= 100) return 'progress-red';
    if (pct >= 80) return 'progress-yellow';
    return 'progress-green';
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Financial Overview</h1>
          <p>Real-time budget management & expense analytics</p>
        </div>
        <div style={{ display: 'flex', gap: '0.6rem' }}>
          <button className="btn btn-secondary btn-sm" onClick={() => setIsEditingBudget(!isEditingBudget)}>
            ⚙️ Edit Budget
          </button>
          <Link to="/add" className="btn btn-primary btn-sm">
            ➕ Add Expense
          </Link>
        </div>
      </div>

      {notification && (
        <div className="alert-banner alert-success">
          <span>{notification}</span>
        </div>
      )}

      {/* Budget Warning Banner if approaching or exceeding limit */}
      {budgetUsedPercentage >= 100 ? (
        <div className="alert-banner alert-danger">
          ⚠️ <strong>Budget Exceeded!</strong> You have spent ₹{currentMonthExpense.toLocaleString()} this month, exceeding your ₹{monthlyBudget.toLocaleString()} limit by ₹{(currentMonthExpense - monthlyBudget).toLocaleString()}.
        </div>
      ) : budgetUsedPercentage >= 80 ? (
        <div className="alert-banner alert-warning">
          ⚠️ <strong>Budget Warning:</strong> You have consumed {budgetUsedPercentage}% of your monthly budget. Remaining: ₹{remainingBudget.toLocaleString()}.
        </div>
      ) : null}

      {/* Edit Budget Inline Modal/Form */}
      {isEditingBudget && (
        <form onSubmit={handleBudgetSave} className="card" style={{ marginBottom: '1.5rem', background: '#f8fafc' }}>
          <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>Update Monthly Budget Target</h3>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <span style={{ fontWeight: 600 }}>₹</span>
            <input
              type="number"
              className="form-control"
              value={newBudget}
              onChange={(e) => setNewBudget(e.target.value)}
              min="1"
              required
              style={{ maxWidth: '200px' }}
            />
            <button type="submit" className="btn btn-primary btn-sm">Save</button>
            <button type="button" className="btn btn-secondary btn-sm" onClick={() => setIsEditingBudget(false)}>Cancel</button>
          </div>
        </form>
      )}

      {/* Top 4 Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">This Month Spent</span>
            <span className="stat-icon">📅</span>
          </div>
          <div className="stat-value">₹{currentMonthExpense.toLocaleString()}</div>
          <div className="stat-subtitle">{budgetUsedPercentage}% of ₹{monthlyBudget.toLocaleString()} budget</div>
          <div className="progress-container">
            <div
              className={`progress-bar ${getProgressColorClass(budgetUsedPercentage)}`}
              style={{ width: `${Math.min(budgetUsedPercentage, 100)}%` }}
            />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">Remaining Budget</span>
            <span className="stat-icon">💰</span>
          </div>
          <div className="stat-value" style={{ color: remainingBudget < 0 ? 'var(--danger)' : 'var(--success)' }}>
            ₹{remainingBudget.toLocaleString()}
          </div>
          <div className="stat-subtitle">{remainingBudget >= 0 ? 'Within budget limit' : 'Over budget'}</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">All-Time Expenses</span>
            <span className="stat-icon">📈</span>
          </div>
          <div className="stat-value">₹{totalExpense.toLocaleString()}</div>
          <div className="stat-subtitle">Across {totalTransactions} logged transactions</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">Monthly Budget</span>
            <span className="stat-icon">🎯</span>
          </div>
          <div className="stat-value">₹{monthlyBudget.toLocaleString()}</div>
          <div className="stat-subtitle">Configured target allowance</div>
        </div>
      </div>

      {/* Dashboard 2-column Grid: Recent Transactions & Category Breakdown */}
      <div className="dashboard-grid">
        {/* Left Column: Recent Transactions Table */}
        <div className="card">
          <div className="card-title">
            <span>Recent Transactions</span>
            <Link to="/expenses" style={{ fontSize: '0.85rem', color: 'var(--primary)', textDecoration: 'none' }}>
              View All ({totalTransactions}) →
            </Link>
          </div>

          {recentExpenses.length === 0 ? (
            <p style={{ color: 'var(--text-muted)' }}>No expenses recorded yet. Click "Add Expense" to get started!</p>
          ) : (
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Title & Date</th>
                    <th>Category</th>
                    <th>Method</th>
                    <th>Amount</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recentExpenses.map((exp) => (
                    <tr key={exp.id}>
                      <td>
                        <strong>{exp.title}</strong>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{exp.expenseDate}</div>
                      </td>
                      <td>
                        <span
                          className="badge"
                          style={{
                            backgroundColor: `${exp.category?.color || '#3B82F6'}20`,
                            color: exp.category?.color || '#3B82F6'
                          }}
                        >
                          {exp.category?.name || 'General'}
                        </span>
                      </td>
                      <td>
                        <span className="badge badge-payment">{exp.paymentMethod || 'UPI'}</span>
                      </td>
                      <td className="amount-cell">₹{exp.amount.toLocaleString()}</td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.4rem' }}>
                          <Link to={`/edit/${exp.id}`} className="btn btn-secondary btn-sm" title="Edit Expense">
                            ✏️
                          </Link>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDelete(exp.id, exp.title)}
                            title="Delete Expense"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right Column: Category-wise Spending Breakdown */}
        <div className="card">
          <div className="card-title">
            <span>Spending by Category</span>
          </div>

          {categoryBreakdown.length === 0 ? (
            <p style={{ color: 'var(--text-muted)' }}>No category data available yet.</p>
          ) : (
            <div className="category-list">
              {categoryBreakdown.map((cat, idx) => (
                <div key={idx} className="category-item">
                  <div className="category-info">
                    <span className="category-name-badge">
                      <span className="color-dot" style={{ backgroundColor: cat.color }} />
                      {cat.categoryName} ({cat.transactionCount})
                    </span>
                    <span style={{ fontWeight: 600 }}>₹{cat.totalAmount.toLocaleString()} ({cat.percentage}%)</span>
                  </div>
                  <div className="progress-container">
                    <div
                      className="progress-bar"
                      style={{
                        width: `${cat.percentage}%`,
                        backgroundColor: cat.color
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
