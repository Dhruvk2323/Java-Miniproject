import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCurrentSession, loginUser, registerUser, logoutUser } from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const session = getCurrentSession();
    if (session) {
      setCurrentUser(session);
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    const user = await loginUser(username, password);
    setCurrentUser(user);
    return user;
  };

  const register = async (userData) => {
    const user = await registerUser(userData);
    setCurrentUser(user);
    return user;
  };

  const logout = async () => {
    await logoutUser();
    setCurrentUser(null);
  };

  const updateBudgetLocally = (newBudget) => {
    if (currentUser) {
      setCurrentUser({
        ...currentUser,
        monthlyBudget: Number(newBudget)
      });
    }
  };

  return (
    <AuthContext.Provider value={{ currentUser, loading, login, register, logout, updateBudgetLocally }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
