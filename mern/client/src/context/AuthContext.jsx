import { createContext, useState, useCallback, useEffect } from 'react';
import { getSessionToken, validateToken, removeSessionToken } from '../utils/cookieUtils';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Validate existing session on mount
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

  const login = useCallback((userData) => {
    setUser(userData);
    setIsAuthenticated(true);
  }, []);

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
