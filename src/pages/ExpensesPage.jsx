import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchExpenses, deleteExpense, DEFAULT_CATEGORIES } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryId, setCategoryId] = useState('all');
  const [paymentMethod, setPaymentMethod] = useState('all');
  const [sort, setSort] = useState('date-desc');
  const [notification, setNotification] = useState('');

  const { currentUser } = useAuth();

  const loadExpenses = async () => {
    try {
      setLoading(true);
      const data = await fetchExpenses({ search, categoryId, paymentMethod, sort });
      setExpenses(data);
    } catch (err) {
      console.error('Failed to load expenses:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExpenses();
  }, [search, categoryId, paymentMethod, sort]);

  const handleDelete = async (id, title) => {
    if (window.confirm(`Are you sure you want to delete the expense "${title}"?`)) {
      try {
        await deleteExpense(id);
        setNotification(`Expense "${title}" was deleted.`);
        setTimeout(() => setNotification(''), 4000);
        loadExpenses();
      } catch (err) {
        alert('Failed to delete expense: ' + err.message);
      }
    }
  };

  const handleExportCSV = () => {
    if (expenses.length === 0) {
      alert('No expense records to export.');
      return;
    }

    let csv = "ID,Date,Title,Category,Payment Method,Amount,Notes\n";
    expenses.forEach(exp => {
      const cat = DEFAULT_CATEGORIES.find(c => c.id === Number(exp.categoryId)) || { name: 'Other' };
      csv += `"${exp.id}","${exp.expenseDate}","${(exp.title || '').replace(/"/g, '""')}","${cat.name}","${exp.paymentMethod || 'UPI'}","${exp.amount}","${(exp.notes || '').replace(/"/g, '""')}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SpendWise_Expenses_${currentUser?.username || 'user'}_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const clearFilters = () => {
    setSearch('');
    setCategoryId('all');
    setPaymentMethod('all');
    setSort('date-desc');
  };

  const totalFilteredSum = expenses.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);

  return (
    <div>
      <div className="dashboard-header">
        <div>
          <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--text-main)' }}>All Expenses Ledger</h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Filter, search, audit, and export your personal transactions
          </p>
        </div>

        <div className="dash-action-buttons">
          <button className="btn btn-secondary" onClick={handleExportCSV}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
            <span>Export to CSV</span>
          </button>
          <Link to="/add" className="btn btn-primary">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            <span>Add New Expense</span>
          </Link>
        </div>
      </div>

      {notification && (
        <div className="alert-banner alert-success" style={{ marginBottom: '1.5rem' }}>
          ✓ {notification}
        </div>
      )}

      <div className="transactions-card">
        
        {/* Filters Toolbar */}
        <div className="filters-bar">
          <div className="filter-input-wrap">
            <input
              type="text"
              className="form-control"
              placeholder="🔍 Search title or remarks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select className="filter-select" value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
            <option value="all">All Categories</option>
            {DEFAULT_CATEGORIES.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          <select className="filter-select" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
            <option value="all">All Payment Methods</option>
            <option value="UPI">UPI</option>
            <option value="Credit Card">Credit Card</option>
            <option value="Debit Card">Debit Card</option>
            <option value="Net Banking">Net Banking</option>
            <option value="Cash">Cash</option>
          </select>

          <select className="filter-select" value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="date-desc">Date: Newest First</option>
            <option value="date-asc">Date: Oldest First</option>
            <option value="amount-desc">Amount: Highest First</option>
            <option value="amount-asc">Amount: Lowest First</option>
          </select>

          <button className="btn btn-secondary btn-sm" onClick={clearFilters}>
            Reset Filters
          </button>
        </div>

        {/* Ledger Summary */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', fontSize: '0.88rem' }}>
          <span style={{ color: 'var(--text-muted)' }}>
            Showing <strong style={{ color: 'var(--text-main)' }}>{expenses.length}</strong> transactions
          </span>
          <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>
            Filtered Total: <strong style={{ color: 'var(--primary)', fontFamily: 'JetBrains Mono, monospace' }}>₹{totalFilteredSum.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong>
          </span>
        </div>

        {/* Table */}
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Title / Description</th>
                <th>Category</th>
                <th>Method</th>
                <th>Amount (₹)</th>
                <th>Remarks</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
                    Loading transactions...
                  </td>
                </tr>
              ) : expenses.length === 0 ? (
                <tr>
                  <td colSpan="7">
                    <div className="empty-state-wrap">
                      <div className="empty-state-icon">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                      </div>
                      <h3 className="empty-state-title">No transactions found</h3>
                      <p className="empty-state-desc">Try adjusting your filters or record a new expense.</p>
                      <Link to="/add" className="btn btn-primary">+ Add New Expense</Link>
                    </div>
                  </td>
                </tr>
              ) : (
                expenses.map(exp => {
                  const cat = DEFAULT_CATEGORIES.find(c => c.id === Number(exp.categoryId)) || { name: 'Other', color: '#64748b', bg: '#f1f5f9' };
                  return (
                    <tr key={exp.id}>
                      <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem', whiteSpace: 'nowrap' }}>
                        {exp.expenseDate}
                      </td>
                      <td>
                        <span className="cell-title">{exp.title}</span>
                      </td>
                      <td>
                        <span className="category-tag" style={{ background: cat.bg, color: cat.color, border: `1px solid ${cat.color}33` }}>
                          ● {cat.name}
                        </span>
                      </td>
                      <td>
                        <span className="method-tag">{exp.paymentMethod || 'UPI'}</span>
                      </td>
                      <td>
                        <span className="cell-amount">₹{Number(exp.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                      </td>
                      <td style={{ color: 'var(--text-muted)', fontSize: '0.82rem', maxWidth: '200px' }}>
                        {exp.notes || '-'}
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
                  );
                })
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}
