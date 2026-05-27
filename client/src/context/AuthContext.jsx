import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchMe, loginAdmin, logoutAdmin } from '../api/auth.js';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const data = await fetchMe();
      if (data.success) {
        setUser(data.user);
      }
    } catch (error) {
      // Unauthenticated, ignore
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (credentials) => {
    setIsLoading(true);
    try {
      const data = await loginAdmin(credentials);
      if (data.success) {
        setUser(data.user);
        toast.success('Welcome back, Admin!');
        return data;
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Login failed';
      toast.error(msg);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await logoutAdmin();
      setUser(null);
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error('Logout failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};
