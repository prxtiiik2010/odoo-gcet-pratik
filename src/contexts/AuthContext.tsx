import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { User, employees } from '@/lib/mock-data';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  loginWithGoogle: (email: string, name: string, picture: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('dayflow_user');
    return saved ? JSON.parse(saved) : null;
  });

  const login = useCallback(async (email: string, _password: string): Promise<boolean> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Find user by email (mock authentication - any password works)
    const foundUser = employees.find(emp => emp.email.toLowerCase() === email.toLowerCase());
    
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('dayflow_user', JSON.stringify(foundUser));
      return true;
    }
    
    return false;
  }, []);

  const loginWithGoogle = useCallback(async (email: string, name: string, picture: string): Promise<boolean> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Check if user exists in our system
    let foundUser = employees.find(emp => emp.email.toLowerCase() === email.toLowerCase());
    
    // If user doesn't exist, create a new user profile (demo mode)
    if (!foundUser) {
      foundUser = {
        id: `google-${Date.now()}`,
        name: name,
        email: email,
        role: 'employee' as const,
        department: 'General',
        avatar: picture,
      };
    }
    
    setUser(foundUser);
    localStorage.setItem('dayflow_user', JSON.stringify(foundUser));
    return true;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('dayflow_user');
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
