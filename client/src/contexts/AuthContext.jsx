import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  getMe, 
  loginWithGoogle as apiLoginGoogle, 
  loginWithPassword as apiLoginPassword,
  registerUser as apiRegister,
  devLogin as apiDevLogin, 
  logout as apiLogout 
} from '../api/auth.js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUser = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getMe();
      if (res?.data?.user) {
        setUser(res.data.user);
      } else {
        setUser(null);
      }
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const loginWithPassword = async (identifier, password) => {
    try {
      setError(null);
      const res = await apiLoginPassword(identifier, password);
      setUser(res.data.user);
      return res;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const register = async (userData) => {
    try {
      setError(null);
      const res = await apiRegister(userData);
      setUser(res.data.user);
      return res;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const loginWithGoogle = async (credential) => {
    try {
      setError(null);
      const res = await apiLoginGoogle(credential);
      setUser(res.data.user);
      return res;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const devLogin = async (role = 'USER', email = null) => {
    try {
      setError(null);
      const res = await apiDevLogin(role, email);
      setUser(res.data.user);
      return res;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const logout = async () => {
    try {
      await apiLogout();
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        loginWithPassword,
        register,
        loginWithGoogle,
        devLogin,
        logout,
        refreshUser: fetchUser,
        isAuthenticated: Boolean(user),
        isAdmin: user?.role === 'ADMIN',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
