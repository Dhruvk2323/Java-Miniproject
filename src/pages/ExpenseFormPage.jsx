import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { fetchCategories, fetchExpenseById, createExpense, updateExpense } from '../services/api';

export default function ExpenseFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    categoryId: '',
    expenseDate: new Date().toISOString().slice(0, 10),
    paymentMethod: 'UPI',
    notes: '',
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [loadingExpense, setLoadingExpense] = useState(isEditMode);

  // Load categories and existing expense if in edit mode
  useEffect(() => {
    async function init() {
      try {
        const catList = await fetchCategories();
        setCategories(catList || []);
        if (catList && catList.length > 0 && !isEditMode) {
          setFormData((prev) => ({ ...prev, categoryId: catList[0].id }));
        }

        if (isEditMode) {
          const exp = await fetchExpenseById(id);
          setFormData({
            title: exp.title || '',
            amount: exp.amount || '',
            categoryId: exp.category ? exp.category.id : '',
            expenseDate: exp.expenseDate || new Date().toISOString().slice(0, 10),
            paymentMethod: exp.paymentMethod || 'UPI',
            notes: exp.notes || '',
          });
        }
      } catch (err) {
        alert('Error loading data: ' + err.message);
      } finally {
        setLoadingExpense(false);
      }
    }
    init();
  }, [id, isEditMode]);

  // Client-side validation (Aligned with Lab Exp 9)
  const validateForm = () => {
    const newErrors = {};

    if (!formData.title || formData.title.trim().length < 3) {
      newErrors.title = 'Title is required and must be at least 3 characters.';
    }

    if (!formData.amount || isNaN(formData.amount) || Number(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be a positive number greater than 0.';
    }

    if (!formData.categoryId) {
      newErrors.categoryId = 'Please select a valid expense category.';
    }

    if (!formData.expenseDate) {
      newErrors.expenseDate = 'Expense date is required.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear field-specific error as user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setSubmitting(true);
      const payload = {
        title: formData.title.trim(),
        amount: Number(formData.amount),
        categoryId: Number(formData.categoryId),
        expenseDate: formData.expenseDate,
        paymentMethod: formData.paymentMethod,
        notes: formData.notes.trim(),
      };

      if (isEditMode) {
        await updateExpense(id, payload);
      } else {
        await createExpense(payload);
      }

      navigate('/expenses');
    } catch (err) {
      if (err.fieldErrors) {
        setErrors(err.fieldErrors);
      } else {
        alert(`Failed to ${isEditMode ? 'update' : 'create'} expense: ` + err.message);
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingExpense) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem 0' }}>
        <h3>Loading expense details...</h3>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header" style={{ maxWidth: '650px', margin: '0 auto 1.5rem auto' }}>
        <div>
          <h1>{isEditMode ? 'Edit Expense' : 'Add New Expense'}</h1>
          <p>{isEditMode ? `Update details for transaction #${id}` : 'Record a new spend item to your ledger'}</p>
        </div>
        <Link to="/expenses" className="btn btn-secondary btn-sm">
          ← Back to Expenses
        </Link>
      </div>

      <div className="form-card">
        <form onSubmit={handleSubmit}>
          {/* Title */}
          <div className="form-group">
            <label className="form-label" htmlFor="title">Expense Title / Description *</label>
            <input
              type="text"
              id="title"
              name="title"
              className={`form-control ${errors.title ? 'is-invalid' : ''}`}
              placeholder="e.g. Grocery store purchase, Petrol fill-up..."
              value={formData.title}
              onChange={handleChange}
              required
            />
            {errors.title && <span className="error-text">{errors.title}</span>}
          </div>

          {/* Amount & Category */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="amount">Amount (₹) *</label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                id="amount"
                name="amount"
                className={`form-control ${errors.amount ? 'is-invalid' : ''}`}
                placeholder="0.00"
                value={formData.amount}
                onChange={handleChange}
                required
              />
              {errors.amount && <span className="error-text">{errors.amount}</span>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="categoryId">Category *</label>
              <select
                id="categoryId"
                name="categoryId"
                className={`form-control ${errors.categoryId ? 'is-invalid' : ''}`}
                value={formData.categoryId}
                onChange={handleChange}
                required
              >
                <option value="">Select Category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              {errors.categoryId && <span className="error-text">{errors.categoryId}</span>}
            </div>
          </div>

          {/* Date & Payment Method */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="expenseDate">Expense Date *</label>
              <input
                type="date"
                id="expenseDate"
                name="expenseDate"
                className={`form-control ${errors.expenseDate ? 'is-invalid' : ''}`}
                value={formData.expenseDate}
                onChange={handleChange}
                required
              />
              {errors.expenseDate && <span className="error-text">{errors.expenseDate}</span>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="paymentMethod">Payment Method</label>
              <select
                id="paymentMethod"
                name="paymentMethod"
                className="form-control"
                value={formData.paymentMethod}
                onChange={handleChange}
              >
                <option value="UPI">UPI (Google Pay / PhonePe / Paytm)</option>
                <option value="Credit Card">Credit Card</option>
                <option value="Debit Card">Debit Card</option>
                <option value="Cash">Cash</option>
                <option value="Net Banking">Net Banking</option>
              </select>
            </div>
          </div>

          {/* Notes */}
          <div className="form-group">
            <label className="form-label" htmlFor="notes">Notes / Remarks (Optional)</label>
            <textarea
              id="notes"
              name="notes"
              rows="3"
              className="form-control"
              placeholder="Additional comments, invoice number, or vendor details..."
              value={formData.notes}
              onChange={handleChange}
            />
          </div>

          {/* Action Buttons */}
          <div className="form-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate('/expenses')}
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
            >
              {submitting ? 'Saving...' : isEditMode ? '💾 Save Changes' : '➕ Add Expense'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
