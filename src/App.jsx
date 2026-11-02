import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ExpensesPage from './pages/ExpensesPage';
import ExpenseFormPage from './pages/ExpenseFormPage';
import ReportsPage from './pages/ReportsPage';
import SpecsPage from './pages/SpecsPage';
import './styles/App.css';

function ProtectedRoute({ children }) {
  const { currentUser } = useAuth();
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function AppContent() {
  const { currentUser } = useAuth();

  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/login" element={currentUser ? <Navigate to="/" replace /> : <LoginPage />} />
          <Route path="/" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/expenses" element={<ProtectedRoute><ExpensesPage /></ProtectedRoute>} />
          <Route path="/add" element={<ProtectedRoute><ExpenseFormPage /></ProtectedRoute>} />
          <Route path="/edit/:id" element={<ProtectedRoute><ExpenseFormPage /></ProtectedRoute>} />
          <Route path="/reports" element={<ProtectedRoute><ReportsPage /></ProtectedRoute>} />
          <Route path="/specs" element={<ProtectedRoute><SpecsPage /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <footer className="footer">
        <p>
          <strong>SpendWise | Full Stack Java Mini Project</strong> — React + Spring Boot / Servlet-JSP + MySQL
        </p>
        <p style={{ marginTop: '0.25rem', fontSize: '0.8rem' }}>
          Course Outcome: <code>CO5 & CO6 Evaluation</code> | Subject Code: <code>CE-JWP-LAB</code> | Scheme: <code>DB25-V1</code>
        </p>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}
