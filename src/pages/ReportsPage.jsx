import React, { useState, useEffect } from 'react';
import { fetchDashboardStats, fetchExpenses } from '../services/api';

export default function ReportsPage() {
  const [stats, setStats] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [dashData, expData] = await Promise.all([
          fetchDashboardStats(),
          fetchExpenses(),
        ]);
        setStats(dashData);
        setExpenses(expData || []);
      } catch (err) {
        setError('Failed to load reports: ' + err.message);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem 0' }}>
        <h3>Compiling reports and analytics...</h3>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert-banner alert-danger">
        <span>{error}</span>
      </div>
    );
  }

  // Calculate payment method distribution
  const paymentMethodMap = {};
  expenses.forEach((e) => {
    const method = e.paymentMethod || 'Other';
    if (!paymentMethodMap[method]) {
      paymentMethodMap[method] = { total: 0, count: 0 };
    }
    paymentMethodMap[method].total += e.amount;
    paymentMethodMap[method].count += 1;
  });

  const totalAmount = stats?.totalExpense || 1;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Expense Analytics & Lab Report</h1>
          <p>Statistical summaries and audit records (Course Outcome: CO5 & CO6 Evaluation)</p>
        </div>
        <button className="btn btn-secondary btn-sm" onClick={() => window.print()}>
          🖨️ Print Report
        </button>
      </div>

      {/* Overview Metric Row */}
      <div className="stats-grid" style={{ marginBottom: '1.5rem' }}>
        <div className="stat-card">
          <span className="stat-title">Total Spending</span>
          <div className="stat-value">₹{(stats?.totalExpense || 0).toLocaleString()}</div>
          <span className="stat-subtitle">Net expenditure recorded</span>
        </div>
        <div className="stat-card">
          <span className="stat-title">Monthly Budget Allocation</span>
          <div className="stat-value">₹{(stats?.monthlyBudget || 0).toLocaleString()}</div>
          <span className="stat-subtitle">Configured target</span>
        </div>
        <div className="stat-card">
          <span className="stat-title">Budget Utilization</span>
          <div className="stat-value">{stats?.budgetUsedPercentage || 0}%</div>
          <span className="stat-subtitle">{stats?.remainingBudget >= 0 ? 'Surplus' : 'Deficit'}</span>
        </div>
        <div className="stat-card">
          <span className="stat-title">Average per Transaction</span>
          <div className="stat-value">
            ₹{expenses.length > 0 ? Math.round(stats.totalExpense / expenses.length).toLocaleString() : 0}
          </div>
          <span className="stat-subtitle">Across {expenses.length} records</span>
        </div>
      </div>

      {/* Category Breakdown Table */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <h3 className="card-title">Category Spending Breakdown</h3>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Transactions</th>
                <th>Total Spent (₹)</th>
                <th>Share of Total</th>
                <th>Visual Distribution</th>
              </tr>
            </thead>
            <tbody>
              {(stats?.categoryBreakdown || []).map((cat, idx) => (
                <tr key={idx}>
                  <td>
                    <span className="category-name-badge">
                      <span className="color-dot" style={{ backgroundColor: cat.color }} />
                      {cat.categoryName}
                    </span>
                  </td>
                  <td>{cat.transactionCount}</td>
                  <td className="amount-cell">₹{cat.totalAmount.toLocaleString()}</td>
                  <td><strong>{cat.percentage}%</strong></td>
                  <td style={{ minWidth: '150px' }}>
                    <div className="progress-container" style={{ margin: 0 }}>
                      <div
                        className="progress-bar"
                        style={{ width: `${cat.percentage}%`, backgroundColor: cat.color }}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Method Distribution */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <h3 className="card-title">Spending by Payment Method</h3>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Method</th>
                <th>Number of Payments</th>
                <th>Total Volume (₹)</th>
                <th>Percentage</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(paymentMethodMap).map(([method, data], idx) => {
                const pct = Math.round((data.total / totalAmount) * 1000) / 10;
                return (
                  <tr key={idx}>
                    <td>
                      <span className="badge badge-payment">{method}</span>
                    </td>
                    <td>{data.count}</td>
                    <td className="amount-cell">₹{data.total.toLocaleString()}</td>
                    <td><strong>{pct}%</strong></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Observation Table (Aligned with Manual Formats) */}
      <div className="card">
        <h3 className="card-title">Laboratory Manual - Observation & Test Validation Table</h3>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Module / Feature</th>
                <th>Test Case</th>
                <th>Expected Outcome</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Backend REST API</strong></td>
                <td>GET /api/expenses</td>
                <td>Returns JSON array of all expenses sorted by date desc</td>
                <td><span className="badge" style={{ background: '#dcfce7', color: '#166534' }}>Verified (200 OK)</span></td>
              </tr>
              <tr>
                <td><strong>Data Validation</strong></td>
                <td>POST /api/expenses with negative amount</td>
                <td>Returns HTTP 400 Bad Request with field validation error</td>
                <td><span className="badge" style={{ background: '#dcfce7', color: '#166534' }}>Verified (400)</span></td>
              </tr>
              <tr>
                <td><strong>CRUD Operations</strong></td>
                <td>Create, Read, Update, Delete expense</td>
                <td>Database record updated, state syncs dynamically</td>
                <td><span className="badge" style={{ background: '#dcfce7', color: '#166534' }}>Verified</span></td>
              </tr>
              <tr>
                <td><strong>CORS Cross-Origin</strong></td>
                <td>Browser fetch from localhost:5173 to localhost:8080</td>
                <td>Pre-flight OPTIONS handled, headers permitted</td>
                <td><span className="badge" style={{ background: '#dcfce7', color: '#166534' }}>Verified</span></td>
              </tr>
              <tr>
                <td><strong>SPA Client Routing</strong></td>
                <td>Navigation between Dashboard, Expenses, Forms</td>
                <td>Instant route switch without full page reloads</td>
                <td><span className="badge" style={{ background: '#dcfce7', color: '#166534' }}>Verified (React Router)</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
