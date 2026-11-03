// ================================================================
// SPENDWISE API CLIENT — Live Spring Boot Backend + MySQL
// Primary: Spring Boot REST API (localhost:8080 / cloud)
// Fallback: Client-side LocalStorage
// ================================================================

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 
  (typeof window !== 'undefined' && window.location.hostname === 'localhost' ? 'http://localhost:8080' : '');

// ----------------------------------------------------------------
// Helper: call backend with timeout, return null on failure
// ----------------------------------------------------------------
async function apiCall(method, path, body = null) {
  if (!API_BASE_URL) return null;
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 6000);
    const opts = {
      method,
      signal: controller.signal,
      headers: { 'Content-Type': 'application/json' },
    };
    if (body) opts.body = JSON.stringify(body);
    const res = await fetch(`${API_BASE_URL}${path}`, opts);
    clearTimeout(timer);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    if (res.status === 204) return true;
    return res.json();
  } catch (err) {
    console.warn(`[SpendWise API] Fallback to LocalStorage for ${method} ${path}:`, err.message);
    return null;
  }
}

// ================================================================
// DEFAULT DATA
// ================================================================

export const DEFAULT_CATEGORIES = [
  { id: 1, name: "Food & Dining",    color: "#f59e0b", bg: "#fef3c7" },
  { id: 2, name: "Transportation",   color: "#3b82f6", bg: "#dbeafe" },
  { id: 3, name: "Shopping",         color: "#ec4899", bg: "#fce7f3" },
  { id: 4, name: "Bills & Utilities",color: "#8b5cf6", bg: "#ede9fe" },
  { id: 5, name: "Entertainment",    color: "#10b981", bg: "#d1fae5" },
  { id: 6, name: "Health & Fitness", color: "#ef4444", bg: "#fee2e2" },
  { id: 7, name: "Education",        color: "#06b6d4", bg: "#cffafe" },
  { id: 8, name: "Miscellaneous",    color: "#64748b", bg: "#f1f5f9" },
];

const today = new Date();
const offsetDate = (days) => {
  const d = new Date(today);
  d.setDate(d.getDate() - days);
  return d.toISOString().slice(0, 10);
};

const DEFAULT_USERS = [
  { id: 1, username: 'karan',  password: 'password',  fullName: 'Karan Student',        email: 'karan@example.com',        monthlyBudget: 30000 },
  { id: 2, username: 'admin',  password: 'admin123',  fullName: 'System Administrator',  email: 'admin@expensetracker.com', monthlyBudget: 50000 },
];

const DEFAULT_KARAN_EXPENSES = [
  { id: 1,  userId: 1, title: "Grocery Shopping at DMart",       amount: 2450, categoryId: 1, expenseDate: offsetDate(1),  paymentMethod: "UPI",         notes: "Monthly household rations and snacks" },
  { id: 2,  userId: 1, title: "Petrol Fill-up",                  amount: 1200, categoryId: 2, expenseDate: offsetDate(2),  paymentMethod: "Credit Card", notes: "Full tank for bike" },
  { id: 3,  userId: 1, title: "Electricity Bill Payment",        amount: 1850, categoryId: 4, expenseDate: offsetDate(4),  paymentMethod: "Net Banking", notes: "Mahavitaran electricity bill" },
  { id: 4,  userId: 1, title: "Cinema Tickets - IMAX",           amount:  750, categoryId: 5, expenseDate: offsetDate(5),  paymentMethod: "UPI",         notes: "Weekend movie with college friends" },
  { id: 5,  userId: 1, title: "Java & Spring Boot Books",        amount: 1400, categoryId: 7, expenseDate: offsetDate(7),  paymentMethod: "Debit Card",  notes: "Lab manual and text books" },
  { id: 6,  userId: 1, title: "Dinner with Group",               amount: 1820, categoryId: 1, expenseDate: offsetDate(9),  paymentMethod: "UPI",         notes: "Restaurant dinner celebration" },
  { id: 7,  userId: 1, title: "Gym Membership Monthly",          amount: 1500, categoryId: 6, expenseDate: offsetDate(12), paymentMethod: "UPI",         notes: "Monthly fitness subscription" },
  { id: 8,  userId: 1, title: "New Wireless Earbuds",            amount: 2299, categoryId: 3, expenseDate: offsetDate(15), paymentMethod: "Credit Card", notes: "Amazon Great Indian Festival sale" },
  { id: 9,  userId: 1, title: "Wi-Fi Broadband Recharge",        amount:  899, categoryId: 4, expenseDate: offsetDate(18), paymentMethod: "UPI",         notes: "JioFiber monthly plan" },
  { id: 10, userId: 1, title: "Metro Card Smart Recharge",       amount:  500, categoryId: 2, expenseDate: offsetDate(21), paymentMethod: "Cash",        notes: "Monthly commute card recharge" },
];

// ================================================================
// LOCAL STORAGE LAYER
// ================================================================
function getStoredUsers() {
  const raw = localStorage.getItem('spendwise_users_v2');
  if (raw) return JSON.parse(raw);
  localStorage.setItem('spendwise_users_v2', JSON.stringify(DEFAULT_USERS));
  return DEFAULT_USERS;
}
function saveStoredUsers(users) { localStorage.setItem('spendwise_users_v2', JSON.stringify(users)); }

export function getCurrentSession() {
  const raw = localStorage.getItem('spendwise_session_v2');
  return raw ? JSON.parse(raw) : null;
}
export function saveCurrentSession(user) {
  if (user) localStorage.setItem('spendwise_session_v2', JSON.stringify(user));
  else       localStorage.removeItem('spendwise_session_v2');
}
export function getStoredExpenses(userId) {
  const key = `spendwise_expenses_user_${userId}`;
  const raw = localStorage.getItem(key);
  if (raw) return JSON.parse(raw);
  const defaults = userId === 1 ? DEFAULT_KARAN_EXPENSES : [];
  localStorage.setItem(key, JSON.stringify(defaults));
  return defaults;
}
export function saveStoredExpenses(userId, expenses) {
  localStorage.setItem(`spendwise_expenses_user_${userId}`, JSON.stringify(expenses));
}

// ================================================================
// AUTHENTICATION & REGISTRATION
// ================================================================

export async function loginUser(username, password) {
  const users = getStoredUsers();
  const user = users.find(
    u => (u.username.toLowerCase() === username.toLowerCase() ||
          u.email.toLowerCase()    === username.toLowerCase()) &&
         u.password === password
  );
  if (!user) throw new Error('Invalid username or password.');
  saveCurrentSession(user);

  // Sync profile budget from live backend if available
  const profile = await apiCall('GET', '/api/user/profile');
  if (profile && user.id === 1) {
    user.monthlyBudget = profile.monthlyBudget ?? user.monthlyBudget;
    saveCurrentSession(user);
  }
  return user;
}

export async function registerUser({ fullName, username, email, password }) {
  const users = getStoredUsers();
  if (users.some(u => u.username.toLowerCase() === username.toLowerCase()))
    throw new Error('Username is already taken.');
  if (users.some(u => u.email.toLowerCase() === email.toLowerCase()))
    throw new Error('Email is already registered.');

  // MANDATORY: new user budget = 0
  const newUser = { id: Date.now(), username, fullName, email, password, monthlyBudget: 0 };

  // 1. Save in MySQL via Spring Boot REST API
  const backendUser = await apiCall('POST', '/api/user/register', {
    username,
    email,
    fullName,
    password,
    monthlyBudget: 0.0
  });

  if (backendUser && backendUser.id) {
    newUser.id = backendUser.id;
    console.log('[SpendWise] User successfully registered in MySQL with ID:', backendUser.id);
  }

  // 2. Save in LocalStorage session
  users.push(newUser);
  saveStoredUsers(users);
  saveCurrentSession(newUser);
  saveStoredExpenses(newUser.id, []);
  return newUser;
}

export async function logoutUser() { saveCurrentSession(null); }

// ================================================================
// EXPENSES — Syncs with MySQL backend
// ================================================================

function normaliseBackendExpense(e, currentUserId) {
  return {
    id:            e.id,
    userId:        e.user?.id || currentUserId || 1,
    title:         e.title,
    amount:        Number(e.amount),
    categoryId:    e.category?.id ?? e.categoryId ?? 1,
    expenseDate:   e.expenseDate,
    paymentMethod: e.paymentMethod || 'UPI',
    notes:         e.notes || '',
  };
}

export async function fetchExpenses(filters = {}) {
  const user = getCurrentSession();
  if (!user) throw new Error('Not authenticated');

  // Try live MySQL backend
  const params = new URLSearchParams();
  if (filters.search)     params.set('search',     filters.search);
  if (filters.categoryId && filters.categoryId !== 'all')
                          params.set('categoryId', filters.categoryId);
  const qs = params.toString();
  const raw = await apiCall('GET', `/api/expenses${qs ? `?${qs}` : ''}`);
  if (raw && Array.isArray(raw) && raw.length > 0) {
    const list = raw.map(e => normaliseBackendExpense(e, user.id));
    if (filters.sort === 'amount-desc') list.sort((a,b) => b.amount - a.amount);
    else if (filters.sort === 'amount-asc') list.sort((a,b) => a.amount - b.amount);
    else if (filters.sort === 'date-asc')   list.sort((a,b) => new Date(a.expenseDate) - new Date(b.expenseDate));
    else list.sort((a,b) => new Date(b.expenseDate) - new Date(a.expenseDate));
    return list;
  }

  // LocalStorage fallback
  let list = getStoredExpenses(user.id);
  if (filters.search) {
    const q = filters.search.toLowerCase();
    list = list.filter(e => (e.title||'').toLowerCase().includes(q) || (e.notes||'').toLowerCase().includes(q));
  }
  if (filters.categoryId && filters.categoryId !== 'all')
    list = list.filter(e => Number(e.categoryId) === Number(filters.categoryId));
  if (filters.paymentMethod && filters.paymentMethod !== 'all')
    list = list.filter(e => e.paymentMethod === filters.paymentMethod);
  if (filters.sort === 'date-asc')     list.sort((a,b) => new Date(a.expenseDate) - new Date(b.expenseDate));
  else if (filters.sort === 'amount-desc') list.sort((a,b) => Number(b.amount) - Number(a.amount));
  else if (filters.sort === 'amount-asc')  list.sort((a,b) => Number(a.amount) - Number(b.amount));
  else list.sort((a,b) => new Date(b.expenseDate) - new Date(a.expenseDate));
  return list;
}

export async function fetchExpenseById(id) {
  const user = getCurrentSession();
  if (!user) throw new Error('Not authenticated');

  const raw = await apiCall('GET', `/api/expenses/${id}`);
  if (raw) return normaliseBackendExpense(raw, user.id);

  const list = getStoredExpenses(user.id);
  const found = list.find(e => e.id === Number(id));
  if (!found) throw new Error('Expense not found');
  return found;
}

export async function createExpense(data) {
  const user = getCurrentSession();
  if (!user) throw new Error('Not authenticated');

  // Try saving to MySQL backend
  const payload = {
    title:         data.title,
    amount:        Number(data.amount),
    categoryId:    Number(data.categoryId),
    expenseDate:   data.expenseDate,
    paymentMethod: data.paymentMethod || 'UPI',
    notes:         data.notes || '',
  };
  const raw = await apiCall('POST', '/api/expenses', payload);
  if (raw) {
    const saved = normaliseBackendExpense(raw, user.id);
    const list = getStoredExpenses(user.id);
    list.unshift(saved);
    saveStoredExpenses(user.id, list);
    return saved;
  }

  // LocalStorage fallback
  const list = getStoredExpenses(user.id);
  const newExp = {
    id: Date.now(), userId: user.id,
    title: data.title, amount: Number(data.amount),
    categoryId: Number(data.categoryId), expenseDate: data.expenseDate,
    paymentMethod: data.paymentMethod || 'UPI', notes: data.notes || '',
  };
  list.unshift(newExp);
  saveStoredExpenses(user.id, list);
  return newExp;
}

export async function updateExpense(id, data) {
  const user = getCurrentSession();
  if (!user) throw new Error('Not authenticated');

  const payload = {
    title: data.title, amount: Number(data.amount),
    categoryId: Number(data.categoryId), expenseDate: data.expenseDate,
    paymentMethod: data.paymentMethod, notes: data.notes,
  };
  const raw = await apiCall('PUT', `/api/expenses/${id}`, payload);
  if (raw) return normaliseBackendExpense(raw, user.id);

  const list = getStoredExpenses(user.id);
  const index = list.findIndex(e => e.id === Number(id));
  if (index === -1) throw new Error('Expense not found');
  list[index] = { ...list[index], ...data, amount: Number(data.amount), categoryId: Number(data.categoryId) };
  saveStoredExpenses(user.id, list);
  return list[index];
}

export async function deleteExpense(id) {
  const user = getCurrentSession();
  if (!user) throw new Error('Not authenticated');

  const ok = await apiCall('DELETE', `/api/expenses/${id}`);
  if (ok !== null) return true;

  let list = getStoredExpenses(user.id);
  list = list.filter(e => e.id !== Number(id));
  saveStoredExpenses(user.id, list);
  return true;
}

// ================================================================
// DASHBOARD STATS
// ================================================================

export async function fetchDashboardStats() {
  const user = getCurrentSession();
  if (!user) throw new Error('Not authenticated');

  const raw = await apiCall('GET', '/api/dashboard/stats');
  if (raw && user.id === 1) {
    if (raw.categoryBreakdown) {
      raw.categoryBreakdown = raw.categoryBreakdown.map(c => {
        const meta = DEFAULT_CATEGORIES.find(dc => dc.name === c.categoryName) || {};
        return { ...c, color: meta.color || '#64748b', bg: meta.bg || '#f1f5f9', categoryId: c.categoryId };
      });
    }
    return { ...raw, currentUser: user };
  }

  // LocalStorage calculation
  const expenses = getStoredExpenses(user.id);
  const monthlyBudget = Number(user.monthlyBudget) || 0;
  const currentYearMonth = today.toISOString().slice(0, 7);
  let totalExpense = 0, currentMonthExpense = 0;

  expenses.forEach(e => {
    const amt = Number(e.amount) || 0;
    totalExpense += amt;
    if (e.expenseDate?.startsWith(currentYearMonth)) currentMonthExpense += amt;
  });

  const categoryBreakdown = DEFAULT_CATEGORIES.map(cat => {
    const matching = expenses.filter(e => Number(e.categoryId) === cat.id);
    const amount = matching.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
    return {
      categoryId: cat.id, categoryName: cat.name, color: cat.color, bg: cat.bg,
      amount, percentage: totalExpense > 0 ? Math.round((amount / totalExpense) * 100) : 0,
      transactionCount: matching.length,
    };
  });

  return {
    totalExpense, currentMonthExpense, monthlyBudget,
    remainingBudget: monthlyBudget - currentMonthExpense,
    budgetUsedPercentage: monthlyBudget > 0 ? Math.round((currentMonthExpense / monthlyBudget) * 100) : 0,
    totalTransactions: expenses.length,
    categoryBreakdown,
    recentExpenses: [...expenses].sort((a, b) => new Date(b.expenseDate) - new Date(a.expenseDate)).slice(0, 5),
    currentUser: user,
  };
}

// ================================================================
// BUDGET & CATEGORIES
// ================================================================

export async function updateMonthlyBudget(newBudget) {
  const user = getCurrentSession();
  if (!user) throw new Error('Not authenticated');

  await apiCall('PUT', '/api/user/budget', { monthlyBudget: Number(newBudget) });

  user.monthlyBudget = Number(newBudget);
  saveCurrentSession(user);
  const users = getStoredUsers();
  const idx = users.findIndex(u => u.id === user.id);
  if (idx !== -1) { users[idx].monthlyBudget = Number(newBudget); saveStoredUsers(users); }
  return { monthlyBudget: user.monthlyBudget };
}

export async function fetchCategories() {
  const raw = await apiCall('GET', '/api/categories');
  if (raw && Array.isArray(raw)) {
    return raw.map(c => {
      const meta = DEFAULT_CATEGORIES.find(dc => dc.name === c.name) || {};
      return { id: c.id, name: c.name, color: meta.color || '#64748b', bg: meta.bg || '#f1f5f9' };
    });
  }
  return DEFAULT_CATEGORIES;
}
