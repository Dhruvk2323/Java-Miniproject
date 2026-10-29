import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import DashboardPage from './pages/DashboardPage';
import ExpensesPage from './pages/ExpensesPage';
import ExpenseFormPage from './pages/ExpenseFormPage';
import ReportsPage from './pages/ReportsPage';
import './styles/App.css';

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/expenses" element={<ExpensesPage />} />
            <Route path="/add" element={<ExpenseFormPage />} />
            <Route path="/edit/:id" element={<ExpenseFormPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <footer className="footer">
          <p>
            <strong>Full Stack Java Mini Project: Expense Tracker</strong> | Subject Code: <code>CE-JWP-LAB</code> | Scheme: <code>DB25-V1</code>
          </p>
          <p style={{ marginTop: '0.25rem', fontSize: '0.8rem' }}>
            Built with Spring Boot 3 (REST API, JPA, Hibernate, MySQL) & React 18 SPA (Hooks, Router, Modern CSS)
          </p>
        </footer>
      </div>
    </BrowserRouter>
  );
}
