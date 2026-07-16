import React, { createContext, useState, useEffect } from 'react';
import authService from '../services/authService';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore user session from localStorage on application load / page refresh
  useEffect(() => {
    const restoreSession = async () => {
      const storedToken = localStorage.getItem('token');
      if (!storedToken) {
        setLoading(false);
        return;
      }

      try {
        setToken(storedToken);
        const result = await authService.getCurrentUser();
        if (result && result.success && result.data && result.data.user) {
          setUser(result.data.user);
        } else {
          throw new Error('Invalid user session response format');
        }
      } catch (error) {
        console.error('[AuthContext] Session restoration failed:', error);
        // Clear invalid token from localStorage
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  // Listen to global auth-unauthorized event from Axios interceptors
  useEffect(() => {
    const handleUnauthorized = () => {
      setUser(null);
      setToken(null);
    };

    window.addEventListener('auth-unauthorized', handleUnauthorized);
    return () => {
      window.removeEventListener('auth-unauthorized', handleUnauthorized);
    };
  }, []);

  /**
   * Log in user
   * @param {Object} credentials - { email, username, password }
   */
  const login = async (credentials) => {
    setLoading(true);
    try {
      const result = await authService.login(credentials);
      if (result && result.success && result.data) {
        const { token: receivedToken, user: receivedUser } = result.data;
        localStorage.setItem('token', receivedToken);
        setToken(receivedToken);
        setUser(receivedUser);
        return result.data;
      } else {
        throw new Error('Invalid login response format');
      }
    } catch (error) {
      console.error('[AuthContext] Login failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Register a new user
   * @param {Object} userData - { name, username, email, password }
   */
  const register = async (userData) => {
    setLoading(true);
    try {
      const result = await authService.register(userData);
      if (result && result.success && result.data) {
        const { token: receivedToken, user: receivedUser } = result.data;
        localStorage.setItem('token', receivedToken);
        setToken(receivedToken);
        setUser(receivedUser);
        return result.data;
      } else {
        throw new Error('Invalid registration response format');
      }
    } catch (error) {
      console.error('[AuthContext] Registration failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Log out current user
   */
  const logout = async () => {
    setLoading(true);
    try {
      await authService.logout();
    } catch (error) {
      console.error('[AuthContext] Server logout failed:', error);
    } finally {
      // Clear token and user state client-side regardless of whether API endpoint call succeeds
      localStorage.removeItem('token');
      setToken(null);
      setUser(null);
      setLoading(false);
    }
  };

  // Derived state indicating if a user session is active
  const isAuthenticated = !!user && !!token;

  const value = {
    user,
    token,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
