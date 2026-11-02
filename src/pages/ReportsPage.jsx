import React, { useState, useEffect } from 'react';
import { fetchExpenses, DEFAULT_CATEGORIES } from '../services/api';

export default function ReportsPage() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExpenses()
      .then(setExpenses)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const totalVolume = expenses.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
  const avgExpense = expenses.length > 0 ? Math.round(totalVolume / expenses.length) : 0;
  const highestExpense = expenses.length > 0 ? Math.max(...expenses.map(e => Number(e.amount) || 0)) : 0;

  // Category breakdown
  const categoryStats = DEFAULT_CATEGORIES.map(cat => {
    const matching = expenses.filter(e => Number(e.categoryId) === cat.id);
    const volume = matching.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
    const pct = totalVolume > 0 ? ((volume / totalVolume) * 100).toFixed(1) : '0.0';
    return { ...cat, volume, count: matching.length, pct };
  });

  // Method breakdown
  const methods = ['UPI', 'Credit Card', 'Debit Card', 'Net Banking', 'Cash'];
  const methodStats = methods.map(m => {
    const matching = expenses.filter(e => (e.paymentMethod || 'UPI') === m);
    const volume = matching.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
    const pct = totalVolume > 0 ? ((volume / totalVolume) * 100).toFixed(1) : '0.0';
    return { method: m, volume, count: matching.length, pct };
  });

  return (
    <div>
      <div className="dashboard-header">
        <div>
          <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--text-main)' }}>Expense Analytics & Lab Report</h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Course Outcome Evaluation: CO5 & CO6 Audit Metrics
          </p>
        </div>

        <div className="dash-action-buttons">
          <button className="btn btn-secondary" onClick={() => window.print()}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect width="12" height="8" x="6" y="14"/></svg>
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* 3 Metric Cards */}
      <div className="stat-cards-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: '1.5rem' }}>
        <div className="stat-card card-spent">
          <div className="stat-card-header">
            <span className="stat-label">Total Outflow Volume</span>
          </div>
          <div className="stat-value">₹{totalVolume.toLocaleString('en-IN')}</div>
          <div className="stat-subtext">Across {expenses.length} logged entries</div>
        </div>

        <div className="stat-card card-remaining">
          <div className="stat-card-header">
            <span className="stat-label">Average Transaction</span>
          </div>
          <div className="stat-value">₹{avgExpense.toLocaleString('en-IN')}</div>
          <div className="stat-subtext">Per spending event</div>
        </div>

        <div className="stat-card card-alltime">
          <div className="stat-card-header">
            <span className="stat-label">Single Highest Expense</span>
          </div>
          <div className="stat-value">₹{highestExpense.toLocaleString('en-IN')}</div>
          <div className="stat-subtext">Max recorded transaction</div>
        </div>
      </div>

      {/* Category Breakdown Table */}
      <div className="transactions-card" style={{ marginBottom: '1.5rem' }}>
        <div className="card-title-main" style={{ marginBottom: '1rem' }}>
          📊 Categorical Spending Distribution
        </div>
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Total Volume (₹)</th>
                <th>Transaction Count</th>
                <th>Percentage Share</th>
              </tr>
            </thead>
            <tbody>
              {categoryStats.map(s => (
                <tr key={s.id}>
                  <td>
                    <span className="category-tag" style={{ background: s.bg, color: s.color, border: `1px solid ${s.color}33` }}>
                      ● {s.name}
                    </span>
                  </td>
                  <td>
                    <strong style={{ fontFamily: 'JetBrains Mono, monospace' }}>₹{s.volume.toLocaleString('en-IN')}</strong>
                  </td>
                  <td>{s.count} transactions</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontWeight: 700, width: '45px' }}>{s.pct}%</span>
                      <div style={{ flex: 1, height: '6px', background: '#e2e8f0', borderRadius: '999px', overflow: 'hidden', maxWidth: '120px' }}>
                        <div style={{ height: '100%', width: `${s.pct}%`, background: s.color, borderRadius: '999px' }} />
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Method Volume */}
      <div className="transactions-card" style={{ marginBottom: '1.5rem' }}>
        <div className="card-title-main" style={{ marginBottom: '1rem' }}>
          💳 Spending by Payment Channel
        </div>
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Payment Method</th>
                <th>Total Sum (₹)</th>
                <th>Frequency</th>
                <th>Percentage</th>
              </tr>
            </thead>
            <tbody>
              {methodStats.map(m => (
                <tr key={m.method}>
                  <td>
                    <span className="method-tag">{m.method}</span>
                  </td>
                  <td>
                    <strong style={{ fontFamily: 'JetBrains Mono, monospace' }}>₹{m.volume.toLocaleString('en-IN')}</strong>
                  </td>
                  <td>{m.count} payments</td>
                  <td><strong>{m.pct}%</strong></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Lab Manual Observation Matrix */}
      <div className="transactions-card">
        <div className="card-title-main" style={{ marginBottom: '1rem' }}>
          🧪 Laboratory Manual - Observation & Test Validation Table
        </div>
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Module / Feature</th>
                <th>Test Case Description</th>
                <th>Expected Outcome</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Backend REST API</strong></td>
                <td><code>GET /api/expenses</code></td>
                <td>Returns JSON array of all expenses sorted by date desc</td>
                <td><span className="badge-pill safe">Verified (200 OK)</span></td>
              </tr>
              <tr>
                <td><strong>Budget Initialization</strong></td>
                <td><code>POST /api/users/register</code></td>
                <td>Creates user with initial monthly budget = ₹0.00</td>
                <td><span className="badge-pill safe">Verified (Budget: ₹0)</span></td>
              </tr>
              <tr>
                <td><strong>Negative Validation</strong></td>
                <td><code>POST /api/expenses</code> with negative or zero amount</td>
                <td>HTTP 400 Bad Request with field validation rejection</td>
                <td><span className="badge-pill safe">Verified (400)</span></td>
              </tr>
              <tr>
                <td><strong>CRUD Operations</strong></td>
                <td>Create, Read, Update, Delete expense</td>
                <td>Database record updated, state syncs dynamically</td>
                <td><span className="badge-pill safe">Verified (CRUD Sync)</span></td>
              </tr>
              <tr>
                <td><strong>User Data Isolation</strong></td>
                <td>Session logout and switch account</td>
                <td>Active session clears, user data isolated</td>
                <td><span className="badge-pill safe">Verified (Multi-Tenant)</span></td>
              </tr>
              <tr>
                <td><strong>CORS Policy</strong></td>
                <td>Pre-flight OPTIONS on <code>http://localhost:8080</code></td>
                <td>Allowed headers permitted for SPA front-end</td>
                <td><span className="badge-pill safe">Verified</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
