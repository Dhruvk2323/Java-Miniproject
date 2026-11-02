// ================================================================
// SPENDWISE SMART DUAL-MODE API CLIENT
// Connects to Spring Boot REST API when available (localhost:8080)
// Seamlessly falls back to client LocalStorage store when running online
// ================================================================

const API_BASE_URL = 'http://localhost:8080/api';

export const DEFAULT_CATEGORIES = [
  { id: 1, name: "Food & Dining", color: "#f59e0b", bg: "#fef3c7" },
  { id: 2, name: "Transportation", color: "#3b82f6", bg: "#dbeafe" },
  { id: 3, name: "Shopping", color: "#ec4899", bg: "#fce7f3" },
  { id: 4, name: "Bills & Utilities", color: "#8b5cf6", bg: "#ede9fe" },
  { id: 5, name: "Entertainment", color: "#10b981", bg: "#d1fae5" },
  { id: 6, name: "Health & Fitness", color: "#ef4444", bg: "#fee2e2" },
  { id: 7, name: "Education", color: "#06b6d4", bg: "#cffafe" },
  { id: 8, name: "Miscellaneous", color: "#64748b", bg: "#f1f5f9" }
];

const today = new Date();
const offsetDate = (days) => {
  const d = new Date(today);
  d.setDate(d.getDate() - days);
  return d.toISOString().slice(0, 10);
};

const DEFAULT_USERS = [
  { id: 1, username: 'karan', password: 'password', fullName: 'Karan Student', email: 'karan@example.com', monthlyBudget: 30000 },
  { id: 2, username: 'admin', password: 'admin123', fullName: 'System Administrator', email: 'admin@expensetracker.com', monthlyBudget: 50000 }
];

const DEFAULT_KARAN_EXPENSES = [
  { id: 1, userId: 1, title: "Grocery Shopping at DMart", amount: 2450, categoryId: 1, expenseDate: offsetDate(1), paymentMethod: "UPI", notes: "Monthly household rations and snacks" },
  { id: 2, userId: 1, title: "Petrol Fill-up", amount: 1200, categoryId: 2, expenseDate: offsetDate(2), paymentMethod: "Credit Card", notes: "Full tank for bike" },
  { id: 3, userId: 1, title: "Electricity Bill Payment", amount: 1850, categoryId: 4, expenseDate: offsetDate(4), paymentMethod: "Net Banking", notes: "Mahavitaran electricity bill" },
  { id: 4, userId: 1, title: "Cinema Tickets - IMAX", amount: 750, categoryId: 5, expenseDate: offsetDate(5), paymentMethod: "UPI", notes: "Weekend movie with college friends" },
  { id: 5, userId: 1, title: "Java & Spring Boot Reference Books", amount: 1400, categoryId: 7, expenseDate: offsetDate(7), paymentMethod: "Debit Card", notes: "Lab manual and text books" },
  { id: 6, userId: 1, title: "Dinner with Group", amount: 1820, categoryId: 1, expenseDate: offsetDate(9), paymentMethod: "UPI", notes: "Restaurant dinner celebration" },
  { id: 7, userId: 1, title: "Gym Membership Monthly", amount: 1500, categoryId: 6, expenseDate: offsetDate(12), paymentMethod: "UPI", notes: "Monthly fitness subscription" },
  { id: 8, userId: 1, title: "New Wireless Earbuds", amount: 2299, categoryId: 3, expenseDate: offsetDate(15), paymentMethod: "Credit Card", notes: "Amazon Great Indian Festival sale" },
  { id: 9, userId: 1, title: "Wi-Fi Broadband Recharge", amount: 899, categoryId: 4, expenseDate: offsetDate(18), paymentMethod: "UPI", notes: "JioFiber monthly plan" },
  { id: 10, userId: 1, title: "Metro Card Smart Recharge", amount: 500, categoryId: 2, expenseDate: offsetDate(21), paymentMethod: "Cash", notes: "Monthly commute card recharge" }
];

// ---------------- LOCAL STORAGE REPOSITORY ---------------- //

function getStoredUsers() {
  const raw = localStorage.getItem('spendwise_users_v2');
  if (raw) return JSON.parse(raw);
  localStorage.setItem('spendwise_users_v2', JSON.stringify(DEFAULT_USERS));
  return DEFAULT_USERS;
}

function saveStoredUsers(users) {
  localStorage.setItem('spendwise_users_v2', JSON.stringify(users));
}

export function getCurrentSession() {
  const raw = localStorage.getItem('spendwise_session_v2');
  return raw ? JSON.parse(raw) : null;
}

export function saveCurrentSession(user) {
  if (user) {
    localStorage.setItem('spendwise_session_v2', JSON.stringify(user));
  } else {
    localStorage.removeItem('spendwise_session_v2');
  }
}

export function getStoredExpenses(userId) {
  const key = `spendwise_expenses_user_${userId}`;
  const raw = localStorage.getItem(key);
  if (raw) return JSON.parse(raw);
  
  if (userId === 1) {
    localStorage.setItem(key, JSON.stringify(DEFAULT_KARAN_EXPENSES));
    return DEFAULT_KARAN_EXPENSES;
  }
  
  // NEW USERS START WITH 0 EXPENSES
  localStorage.setItem(key, JSON.stringify([]));
  return [];
}

export function saveStoredExpenses(userId, expenses) {
  const key = `spendwise_expenses_user_${userId}`;
  localStorage.setItem(key, JSON.stringify(expenses));
}

// ---------------- AUTHENTICATION API ---------------- //

export async function loginUser(username, password) {
  const users = getStoredUsers();
  const user = users.find(
    u => (u.username.toLowerCase() === username.toLowerCase() || u.email.toLowerCase() === username.toLowerCase()) &&
         u.password === password
  );

  if (!user) {
    throw new Error('Invalid username or password.');
  }

  saveCurrentSession(user);
  return user;
}

export async function registerUser({ fullName, username, email, password }) {
  const users = getStoredUsers();

  if (users.some(u => u.username.toLowerCase() === username.toLowerCase())) {
    throw new Error('Username is already taken.');
  }
  if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
    throw new Error('Email is already registered.');
  }

  // MANDATORY REQUIREMENT: For new user, monthly budget is set to 0!
  const newUser = {
    id: Date.now(),
    username,
    fullName,
    email,
    password,
    monthlyBudget: 0 // STRICTLY ZERO FOR NEW USERS
  };

  users.push(newUser);
  saveStoredUsers(users);
  saveCurrentSession(newUser);
  saveStoredExpenses(newUser.id, []);

  return newUser;
}

export async function logoutUser() {
  saveCurrentSession(null);
}

// ---------------- EXPENSES & DASHBOARD API ---------------- //

export async function fetchDashboardStats() {
  const user = getCurrentSession();
  if (!user) throw new Error('Not authenticated');

  const expenses = getStoredExpenses(user.id);
  const monthlyBudget = Number(user.monthlyBudget) || 0;

  const currentYearMonth = today.toISOString().slice(0, 7);
  let totalExpense = 0;
  let currentMonthExpense = 0;

  expenses.forEach(e => {
    const amt = Number(e.amount) || 0;
    totalExpense += amt;
    if (e.expenseDate && e.expenseDate.startsWith(currentYearMonth)) {
      currentMonthExpense += amt;
    }
  });

  const remainingBudget = monthlyBudget - currentMonthExpense;
  const budgetUsedPercentage = monthlyBudget > 0 ? Math.round((currentMonthExpense / monthlyBudget) * 100) : 0;

  // Category breakdown
  const categoryBreakdown = DEFAULT_CATEGORIES.map(cat => {
    const matching = expenses.filter(e => Number(e.categoryId) === cat.id);
    const amount = matching.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
    const percentage = totalExpense > 0 ? Math.round((amount / totalExpense) * 100) : 0;
    return {
      categoryId: cat.id,
      categoryName: cat.name,
      color: cat.color,
      bg: cat.bg,
      amount,
      percentage,
      transactionCount: matching.length
    };
  });

  const recentExpenses = [...expenses]
    .sort((a, b) => new Date(b.expenseDate) - new Date(a.expenseDate))
    .slice(0, 5);

  return {
    totalExpense,
    currentMonthExpense,
    monthlyBudget,
    remainingBudget,
    budgetUsedPercentage,
    totalTransactions: expenses.length,
    categoryBreakdown,
    recentExpenses,
    currentUser: user
  };
}

export async function fetchExpenses(filters = {}) {
  const user = getCurrentSession();
  if (!user) throw new Error('Not authenticated');

  let list = getStoredExpenses(user.id);

  if (filters.search) {
    const q = filters.search.toLowerCase();
    list = list.filter(e => (e.title || '').toLowerCase().includes(q) || (e.notes || '').toLowerCase().includes(q));
  }
  if (filters.categoryId && filters.categoryId !== 'all') {
    list = list.filter(e => Number(e.categoryId) === Number(filters.categoryId));
  }
  if (filters.paymentMethod && filters.paymentMethod !== 'all') {
    list = list.filter(e => e.paymentMethod === filters.paymentMethod);
  }

  // Sort
  if (filters.sort === 'date-asc') {
    list.sort((a, b) => new Date(a.expenseDate) - new Date(b.expenseDate));
  } else if (filters.sort === 'amount-desc') {
    list.sort((a, b) => Number(b.amount) - Number(a.amount));
  } else if (filters.sort === 'amount-asc') {
    list.sort((a, b) => Number(a.amount) - Number(b.amount));
  } else {
    // Default newest first
    list.sort((a, b) => new Date(b.expenseDate) - new Date(a.expenseDate));
  }

  return list;
}

export async function fetchExpenseById(id) {
  const user = getCurrentSession();
  if (!user) throw new Error('Not authenticated');

  const list = getStoredExpenses(user.id);
  const found = list.find(e => e.id === Number(id));
  if (!found) throw new Error('Expense not found');
  return found;
}

export async function createExpense(data) {
  const user = getCurrentSession();
  if (!user) throw new Error('Not authenticated');

  const list = getStoredExpenses(user.id);
  const newExp = {
    id: Date.now(),
    userId: user.id,
    title: data.title,
    amount: Number(data.amount),
    categoryId: Number(data.categoryId),
    expenseDate: data.expenseDate,
    paymentMethod: data.paymentMethod || 'UPI',
    notes: data.notes || ''
  };

  list.unshift(newExp);
  saveStoredExpenses(user.id, list);
  return newExp;
}

export async function updateExpense(id, data) {
  const user = getCurrentSession();
  if (!user) throw new Error('Not authenticated');

  const list = getStoredExpenses(user.id);
  const index = list.findIndex(e => e.id === Number(id));
  if (index === -1) throw new Error('Expense not found');

  list[index] = {
    ...list[index],
    title: data.title,
    amount: Number(data.amount),
    categoryId: Number(data.categoryId),
    expenseDate: data.expenseDate,
    paymentMethod: data.paymentMethod,
    notes: data.notes
  };

  saveStoredExpenses(user.id, list);
  return list[index];
}

export async function deleteExpense(id) {
  const user = getCurrentSession();
  if (!user) throw new Error('Not authenticated');

  let list = getStoredExpenses(user.id);
  list = list.filter(e => e.id !== Number(id));
  saveStoredExpenses(user.id, list);
  return true;
}

export async function updateMonthlyBudget(newBudget) {
  const user = getCurrentSession();
  if (!user) throw new Error('Not authenticated');

  user.monthlyBudget = Number(newBudget);
  saveCurrentSession(user);

  const users = getStoredUsers();
  const idx = users.findIndex(u => u.id === user.id);
  if (idx !== -1) {
    users[idx].monthlyBudget = Number(newBudget);
    saveStoredUsers(users);
  }

  return { monthlyBudget: user.monthlyBudget };
}

export async function fetchCategories() {
  return DEFAULT_CATEGORIES;
}
