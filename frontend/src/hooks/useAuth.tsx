import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiService, authUtils, UserProfile } from '@/lib/api';

interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  register: (userData: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    password: string;
    address?: string;
  }) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  isAuthenticated: boolean;
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

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;

  useEffect(() => {
    const initializeAuth = async () => {
      const token = authUtils.getToken();
      if (token) {
        try {
          const response = await apiService.getProfile();
          if (response.success) {
            setUser(response.data);
          } else {
            authUtils.removeToken();
          }
        } catch (error) {
          authUtils.removeToken();
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await apiService.login({ email, password });
      if (response.success && response.data?.token) {
        authUtils.setToken(response.data.token);
        // Fetch user profile after successful login
        const profileResponse = await apiService.getProfile();
        if (profileResponse.success) {
          setUser(profileResponse.data);
        }
        return { success: true, message: response.message };
      } else {
        return { success: false, message: response.message };
      }
    } catch (error) {
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'Login failed' 
      };
    }
  };

  const register = async (userData: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    password: string;
    address?: string;
  }) => {
    try {
      const response = await apiService.register(userData);
      if (response.success && response.data?.token) {
        authUtils.setToken(response.data.token);
        // Fetch user profile after successful registration
        const profileResponse = await apiService.getProfile();
        if (profileResponse.success) {
          setUser(profileResponse.data);
        }
        return { success: true, message: response.message };
      } else {
        return { success: false, message: response.message };
      }
    } catch (error) {
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'Registration failed' 
      };
    }
  };

  const logout = () => {
    authUtils.removeToken();
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    register,
    logout,
    isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 