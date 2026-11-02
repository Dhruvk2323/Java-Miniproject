import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { createExpense, updateExpense, fetchExpenseById, DEFAULT_CATEGORIES } from '../services/api';

export default function ExpenseFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [categoryId, setCategoryId] = useState('1');
  const [expenseDate, setExpenseDate] = useState(new Date().toISOString().slice(0, 10));
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEditMode) {
      setLoading(true);
      fetchExpenseById(id)
        .then(data => {
          setTitle(data.title || '');
          setAmount(data.amount || '');
          setCategoryId(String(data.categoryId || '1'));
          setExpenseDate(data.expenseDate || new Date().toISOString().slice(0, 10));
          setPaymentMethod(data.paymentMethod || 'UPI');
          setNotes(data.notes || '');
        })
        .catch(err => {
          setError('Failed to load expense details: ' + err.message);
        })
        .finally(() => setLoading(false));
    }
  }, [id, isEditMode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);

    if (!title.trim()) {
      setError('Please provide an expense title.');
      return;
    }
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError('Amount must be a positive number greater than zero.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const payload = {
        title: title.trim(),
        amount: parsedAmount,
        categoryId: parseInt(categoryId),
        expenseDate,
        paymentMethod,
        notes: notes.trim()
      };

      if (isEditMode) {
        await updateExpense(id, payload);
      } else {
        await createExpense(payload);
      }

      navigate('/expenses');
    } catch (err) {
      setError(err.message || 'Operation failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto' }}>
      <div className="dashboard-header" style={{ marginBottom: '1.25rem' }}>
        <div>
          <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--text-main)' }}>
            {isEditMode ? 'Edit Expense Record' : 'Record New Expense'}
          </h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            {isEditMode ? 'Update transaction details and amount' : 'Log an expenditure into your personal ledger'}
          </p>
        </div>
        <Link to="/expenses" className="btn btn-secondary btn-sm">
          ← Back to Ledger
        </Link>
      </div>

      {error && (
        <div className="alert-banner alert-danger" style={{ marginBottom: '1.25rem' }}>
          ⚠️ {error}
        </div>
      )}

      <div className="transactions-card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Expense Title / Description <span style={{ color: 'var(--danger)' }}>*</span></label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Grocery store purchase, Petrol fill-up, Course book..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Amount (₹) <span style={{ color: 'var(--danger)' }}>*</span></label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                className="form-control"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Category <span style={{ color: 'var(--danger)' }}>*</span></label>
              <select
                className="form-control"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                required
              >
                {DEFAULT_CATEGORIES.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Expense Date <span style={{ color: 'var(--danger)' }}>*</span></label>
              <input
                type="date"
                className="form-control"
                value={expenseDate}
                onChange={(e) => setExpenseDate(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Payment Method</label>
              <select
                className="form-control"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <option value="UPI">UPI (GPay / PhonePe / Paytm)</option>
                <option value="Credit Card">Credit Card</option>
                <option value="Debit Card">Debit Card</option>
                <option value="Net Banking">Net Banking</option>
                <option value="Cash">Cash</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Notes / Remarks (Optional)</label>
            <textarea
              className="form-control"
              rows={3}
              placeholder="Vendor notes, invoice numbers, or additional context..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <Link to="/expenses" className="btn btn-secondary">
              Cancel
            </Link>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : (isEditMode ? 'Update Expense' : 'Save Expense')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
