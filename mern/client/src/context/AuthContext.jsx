/**
 * AuthContext - Global authentication state management
 * 
 * Manages user authentication state across the entire application.
 * Provides methods to login, logout, and validate user sessions.
 * Automatically validates existing session tokens on app startup.
 */

import { createContext, useState, useCallback, useEffect } from 'react';
import { getSessionToken, validateToken, removeSessionToken } from '../utils/cookieUtils';

// Create authentication context
export const AuthContext = createContext();

/**
 * AuthProvider Component
 * 
 * Wraps the application to provide authentication context to all child components.
 * Handles session validation on mount and provides login/logout methods.
 * 
 * @param {React.ReactNode} children - Child components to wrap
 * @returns {JSX.Element} Context provider wrapping children
 */
export function AuthProvider({ children }) {
  // State for storing authenticated user data
  const [user, setUser] = useState(null);
  
  // State tracking if user is currently authenticated
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Loading state while validating session on mount
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Validate existing session token on application mount
   * Checks stored session token and verifies it with backend
   * If valid, restores user session; if invalid, clears token
   */
  useEffect(() => {
    async function validateSession() {
      const token = getSessionToken();
      if (!token) {
        setIsLoading(false);
        return;
      }

      const { valid, user: userData } = await validateToken(token);
      if (valid && userData) {
        setUser(userData);
        setIsAuthenticated(true);
      } else {
        removeSessionToken();
        setIsAuthenticated(false);
      }
      setIsLoading(false);
    }

    validateSession();
  }, []);

  /**
   * Mark user as logged in
   * 
   * @param {Object} userData - User data (id, first_name, last_name)
   */
  const login = useCallback((userData) => {
    setUser(userData);
    setIsAuthenticated(true);
  }, []);

  /**
   * Logout current user and clear session
   * Removes user data and session token from storage
   */
  const logout = useCallback(() => {
    setUser(null);
    setIsAuthenticated(false);
    removeSessionToken();
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
