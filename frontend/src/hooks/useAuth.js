import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

/**
 * Custom hook to easily consume AuthContext in React UI components.
 * Throws an error if used outside an AuthProvider.
 * @returns {Object} Authentication context values: user, token, loading, isAuthenticated, login, register, logout
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default useAuth;
