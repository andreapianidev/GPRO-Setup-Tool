// GPRO Setup Tool - Authentication Hook

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { GPROProfile } from '../types/gpro';
import { mockAPI } from '../services/mockData';

interface AuthContextType {
  user: GPROProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<GPROProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isAuthenticated = !!user;

  // Check for existing session on mount
  useEffect(() => {
    const checkExistingSession = () => {
      const savedUser = localStorage.getItem('gpro_user');
      if (savedUser) {
        try {
          const parsedUser = JSON.parse(savedUser);
          setUser(parsedUser);
        } catch (error) {
          console.error('Error parsing saved user:', error);
          localStorage.removeItem('gpro_user');
        }
      }
      setIsLoading(false);
    };

    checkExistingSession();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const userData = await mockAPI.login(email, password);
      setUser(userData);
      localStorage.setItem('gpro_user', JSON.stringify(userData));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore durante il login');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setError(null);
    localStorage.removeItem('gpro_user');
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    logout,
    error
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook for demo login (bypasses actual authentication)
export const useDemoLogin = () => {
  const { login } = useAuth();
  
  const loginAsDemo = async () => {
    try {
      await login('demo@gpro.net', 'demo123');
    } catch (error) {
      console.error('Demo login failed:', error);
    }
  };

  return { loginAsDemo };
};