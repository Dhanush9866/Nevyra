import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Seller } from '@/types';
import { sellerAPI } from '@/lib/api';
import { mockSeller } from '@/services/mockData';

interface AuthContextType {
  seller: Seller | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, phone: string) => Promise<void>;
  createSellerProfile: (storeName: string, sellerType: string, gstNumber: string, address: { address: string, city: string, pincode: string }) => Promise<void>;
  savePaymentDetails: (accountHolderName: string, accountNumber: string, ifscCode: string, cancelledCheque: File | null) => Promise<void>;
  submitKYC: (panCard: File | null, addressProof: File | null, livePhoto: File | null) => Promise<void>;
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
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Initialize: Check for token
  React.useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        await loadSellerProfile();
      } else {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, []);

  const loadSellerProfile = async () => {
    try {
      // First fetch user profile to ensure token is valid (optional but good)
      // Actually getSellerProfile returns null if no profile, or the profile
      const res = await sellerAPI.auth.getSellerProfile();
      if (res.data.success && res.data.data) {
        const sData = res.data.data;
        const mappedSeller: Seller = {
          id: sData._id,
          email: sData.user?.email || '', 
          name: sData.user ? `${sData.user.firstName} ${sData.user.lastName}` : '',
          storeName: sData.storeName,
          sellerType: sData.sellerType,
          isVerified: sData.isVerified,
          createdAt: sData.createdAt,
          updatedAt: sData.updatedAt,
          verificationStatus: sData.verificationStatus
        };
        setSeller(mappedSeller);
        setIsAuthenticated(true);
      } else if (res.data.success && !res.data.data) {
        // Logged in as user but no seller profile
        setIsAuthenticated(true);
      }
    } catch (e) {
      console.error("Failed to load profile", e);
      localStorage.removeItem('token');
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await sellerAPI.auth.login({ email, password });
      if (res.data.success) {
        localStorage.setItem('token', res.data.data.token);
        await loadSellerProfile();
      } else {
        throw new Error(res.data.message || 'Login failed');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signup = useCallback(async (email: string, password: string, phone: string) => {
    setIsLoading(true);
    try {
      const payload = {
        email, password, phone,
        firstName: 'Seller',
        lastName: 'User',
        address: 'N/A'
      };
      
      try {
        const res = await sellerAPI.auth.signup(payload);
        if (!res.data.success) {
          throw new Error(res.data.message);
        }
      } catch (error: any) {
        // If user already exists (409), try to login
        if (error.response && error.response.status === 409) {
          console.log("User exists, attempting login...");
          // Fall through to login
        } else {
          throw error;
        }
      }
      
      // Login (either new user or existing user)
      await login(email, password);
      
      // Check if they are already a seller?
      // loadSellerProfile is called inside login.
      
    } catch (error: any) {
      console.error("Signup/Login error:", error);
      throw new Error(error.response?.data?.message || error.message || 'Signup failed');
    } finally {
      setIsLoading(false);
    }
  }, [login]);

  const createSellerProfile = useCallback(async (storeName: string, sellerType: string, gstNumber: string, address: { address: string, city: string, pincode: string }) => {
    setIsLoading(true);
    try {
      const payload = {
        storeName, sellerType, gstNumber,
        businessAddress: address // Match backend schema
      };
      const res = await sellerAPI.auth.createSellerProfile(payload);
      if (res.data.success) {
        await loadSellerProfile();
      } else {
        throw new Error(res.data.message);
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Create Profile failed');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const savePaymentDetails = useCallback(async (accountHolderName: string, accountNumber: string, ifscCode: string, cancelledCheque: File | null) => {
    setIsLoading(true);
    try {
      // Upload cheque? Backend expects URL string in body for cancelledCheque?
      // seller-payment-details endpoint:
      // const { accountHolderName, accountNumber, ifscCode, cancelledCheque } = req.body;
      // So yes, it expects string.
      // We mock upload
      const chequeUrl = "https://placehold.co/600x400?text=Cheque";

      const payload = {
        accountHolderName, accountNumber, ifscCode,
        cancelledCheque: chequeUrl
      };
      const res = await sellerAPI.auth.updatePaymentDetails(payload);
      if (res.data.success) {
        await loadSellerProfile();
      } else {
        throw new Error(res.data.message);
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Save Payment failed');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const submitKYC = useCallback(async (panCard: File | null, addressProof: File | null, livePhoto: File | null) => {
    setIsLoading(true);
    try {
      // Mock uploads for now as upload endpoint is admin-only/unavailable
      const panUrl = "https://placehold.co/600x400?text=PAN+Card";
      const addressUrl = "https://placehold.co/600x400?text=Address+Proof";
      const photoUrl = "https://placehold.co/400x400?text=Live+Photo";

      const payload = {
        panCard: panUrl,
        addressProof: addressUrl,
        livePhoto: photoUrl
      };
      const res = await sellerAPI.auth.submitKYC(payload);
      if (res.data.success) {
        await loadSellerProfile();
      } else {
        throw new Error(res.data.message);
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'KYC Submission failed');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setSeller(null);
    setIsAuthenticated(false);
  }, []);

  const value = {
    seller,
    isAuthenticated,
    isLoading,
    login,
    signup,
    createSellerProfile,
    savePaymentDetails,
    submitKYC,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
