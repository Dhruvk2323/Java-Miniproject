import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchExpenses, fetchCategories, deleteExpense } from '../services/api';

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState('');

  // Filters State
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sortBy, setSortBy] = useState('date-desc');

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [expData, catData] = await Promise.all([
        fetchExpenses({
          search,
          categoryId: selectedCategory,
          startDate,
          endDate,
        }),
        fetchCategories(),
      ]);
      setExpenses(expData || []);
      setCategories(catData || []);
    } catch (err) {
      setError('Failed to fetch expenses: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [search, selectedCategory, startDate, endDate]);

  const handleResetFilters = () => {
    setSearch('');
    setSelectedCategory('');
    setStartDate('');
    setEndDate('');
    setSortBy('date-desc');
  };

  const handleDelete = async (id, title) => {
    if (window.confirm(`Are you sure you want to delete the expense "${title}"?`)) {
      try {
        await deleteExpense(id);
        setNotification(`Expense "${title}" was successfully deleted.`);
        setTimeout(() => setNotification(''), 4000);
        loadData();
      } catch (err) {
        alert('Failed to delete expense: ' + err.message);
      }
    }
  };

  // Client-side sorting
  const sortedExpenses = [...expenses].sort((a, b) => {
    if (sortBy === 'date-desc') return new Date(b.expenseDate) - new Date(a.expenseDate);
    if (sortBy === 'date-asc') return new Date(a.expenseDate) - new Date(b.expenseDate);
    if (sortBy === 'amount-desc') return b.amount - a.amount;
    if (sortBy === 'amount-asc') return a.amount - b.amount;
    return 0;
  });

  const totalFilteredAmount = sortedExpenses.reduce((sum, item) => sum + item.amount, 0);

  // Export CSV
  const handleExportCSV = () => {
    if (sortedExpenses.length === 0) {
      alert('No expense data to export.');
      return;
    }

    const headers = ['ID,Title,Amount (INR),Category,Date,Payment Method,Notes'];
    const rows = sortedExpenses.map(e =>
      `"${e.id}","${e.title.replace(/"/g, '""')}","${e.amount}","${e.category?.name || 'N/A'}","${e.expenseDate}","${e.paymentMethod || 'N/A'}","${(e.notes || '').replace(/"/g, '""')}"`
    );

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Expense_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Expense Records</h1>
          <p>Search, filter, analyze, and manage all your expenditure items</p>
        </div>
        <div style={{ display: 'flex', gap: '0.6rem' }}>
          <button className="btn btn-secondary btn-sm" onClick={handleExportCSV}>
            📥 Export CSV
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

      {error && (
        <div className="alert-banner alert-danger">
          <span>{error}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="filter-bar">
        <div className="search-box">
          <input
            type="text"
            className="form-control"
            placeholder="🔍 Search description, notes, method..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div>
          <select
            className="form-control"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>From:</span>
          <input
            type="date"
            className="form-control"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>To:</span>
          <input
            type="date"
            className="form-control"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>

        <div>
          <select
            className="form-control"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="date-desc">Date: Newest First</option>
            <option value="date-asc">Date: Oldest First</option>
            <option value="amount-desc">Amount: Highest First</option>
            <option value="amount-asc">Amount: Lowest First</option>
          </select>
        </div>

        {(search || selectedCategory || startDate || endDate) && (
          <button className="btn btn-secondary btn-sm" onClick={handleResetFilters}>
            ✕ Clear
          </button>
        )}
      </div>

      {/* Filter Stats Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', padding: '0 0.2rem' }}>
        <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Showing <strong>{sortedExpenses.length}</strong> transactions
        </span>
        <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a' }}>
          Total Sum: ₹{totalFilteredAmount.toLocaleString()}
        </span>
      </div>

      {/* Table of Expenses */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem 0' }}>
          <h3>Loading records...</h3>
        </div>
      ) : sortedExpenses.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <h3>No matching expenses found</h3>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>
            Try clearing your filters or create a new expense entry.
          </p>
          <button className="btn btn-secondary btn-sm" style={{ marginTop: '1rem' }} onClick={handleResetFilters}>
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Title / Description</th>
                <th>Category</th>
                <th>Payment Method</th>
                <th>Amount</th>
                <th>Notes</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedExpenses.map((exp) => (
                <tr key={exp.id}>
                  <td style={{ whiteSpace: 'nowrap', color: 'var(--text-muted)' }}>{exp.expenseDate}</td>
                  <td><strong>{exp.title}</strong></td>
                  <td>
                    <span
                      className="badge"
                      style={{
                        backgroundColor: `${exp.category?.color || '#3B82F6'}20`,
                        color: exp.category?.color || '#3B82F6',
                      }}
                    >
                      {exp.category?.name || 'General'}
                    </span>
                  </td>
                  <td>
                    <span className="badge badge-payment">{exp.paymentMethod || 'UPI'}</span>
                  </td>
                  <td className="amount-cell">₹{exp.amount.toLocaleString()}</td>
                  <td style={{ fontSize: '0.82rem', color: 'var(--text-muted)', maxWidth: '220px' }}>
                    {exp.notes || '—'}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                      <Link to={`/edit/${exp.id}`} className="btn btn-secondary btn-sm" title="Edit Expense">
                        ✏️ Edit
                      </Link>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(exp.id, exp.title)}
                        title="Delete Expense"
                      >
                        🗑️ Delete
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
  );
}
