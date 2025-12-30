import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Seller } from '@/types';
import { mockSeller } from '@/services/mockData';

interface AuthContextType {
  seller: Seller | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string, storeName: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [seller, setSeller] = useState<Seller | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, accept any credentials
      if (email && password) {
        setSeller(mockSeller);
      } else {
        throw new Error('Invalid credentials');
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signup = useCallback(async (email: string, password: string, name: string, storeName: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newSeller: Seller = {
        ...mockSeller,
        id: `seller-${Date.now()}`,
        email,
        name,
        storeName,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setSeller(newSeller);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setSeller(null);
  }, []);

  const value = {
    seller,
    isAuthenticated: !!seller,
    isLoading,
    login,
    signup,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
