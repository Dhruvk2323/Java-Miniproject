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
          <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--text-main)' }}>Expense Reports & Analytics</h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Comprehensive categorical expenditure distribution and channel breakdown
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
      <div className="transactions-card">
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

    </div>
  );
}
