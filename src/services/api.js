// ================================================================
// API Client Service for Expense Tracker REST API
// Integrates React Frontend with Spring Boot Backend (Exp 11 & Exp 12)
// ================================================================

const API_BASE_URL = 'http://localhost:8080/api';

/**
 * Generic request helper with error handling
 */
async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);

    // Handle 204 No Content
    if (response.status === 204) {
      return null;
    }

    const data = await response.json();

    if (!response.ok) {
      const errorMessage = data.message || `HTTP Error ${response.status}: ${response.statusText}`;
      const error = new Error(errorMessage);
      error.fieldErrors = data.fieldErrors || {};
      error.status = response.status;
      throw error;
    }

    return data;
  } catch (err) {
    console.error(`API Error on ${endpoint}:`, err);
    throw err;
  }
}

// ---------------- EXPENSES API ---------------- //

export async function fetchExpenses(filters = {}) {
  const queryParams = new URLSearchParams();
  if (filters.search) queryParams.append('search', filters.search);
  if (filters.categoryId) queryParams.append('categoryId', filters.categoryId);
  if (filters.startDate) queryParams.append('startDate', filters.startDate);
  if (filters.endDate) queryParams.append('endDate', filters.endDate);

  const queryStr = queryParams.toString() ? `?${queryParams.toString()}` : '';
  return request(`/expenses${queryStr}`);
}

export async function fetchExpenseById(id) {
  return request(`/expenses/${id}`);
}

export async function createExpense(expenseData) {
  return request('/expenses', {
    method: 'POST',
    body: JSON.stringify(expenseData),
  });
}

export async function updateExpense(id, expenseData) {
  return request(`/expenses/${id}`, {
    method: 'PUT',
    body: JSON.stringify(expenseData),
  });
}

export async function deleteExpense(id) {
  return request(`/expenses/${id}`, {
    method: 'DELETE',
  });
}

// ---------------- CATEGORIES API ---------------- //

export async function fetchCategories() {
  return request('/categories');
}

export async function createCategory(categoryData) {
  return request('/categories', {
    method: 'POST',
    body: JSON.stringify(categoryData),
  });
}

// ---------------- DASHBOARD & USER API ---------------- //

export async function fetchDashboardStats() {
  return request('/dashboard/stats');
}

export async function fetchUserProfile() {
  return request('/user/profile');
}

export async function updateMonthlyBudget(newBudget) {
  return request('/user/budget', {
    method: 'PUT',
    body: JSON.stringify({ monthlyBudget: Number(newBudget) }),
  });
}
