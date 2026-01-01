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
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Initialize: Check for token
  React.useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      loadSellerProfile();
    }
  }, []);

  const loadSellerProfile = async () => {
    try {
      // First fetch user profile to ensure token is valid (optional but good)
      // Actually getSellerProfile returns null if no profile, or the profile
      const res = await sellerAPI.auth.getSellerProfile();
      if (res.data.success && res.data.data) {
        // Map backend seller to frontend Seller type if needed
        // Backend: _id, storeName, sellerType, verificationStatus
        // Frontend Seller type: id, email, name, storeName
        // We might need to fetch User details too for email/name
        // But for now let's set what we have.
        // Wait, fetching User profile for email/name
        // Let's assume we can get it or just set seller data

        // We should also fetch the User profile to get email/name if missing
        // For simplicity let's rely on seller data.
        const sData = res.data.data;
        const mappedSeller: Seller = {
          id: sData._id,
          email: sData.user?.email || '', // populate might have worked?
          name: sData.user ? `${sData.user.firstName} ${sData.user.lastName}` : '',
          storeName: sData.storeName,
          createdAt: sData.createdAt,
          updatedAt: sData.updatedAt,
          verificationStatus: sData.verificationStatus
        };
        setSeller(mappedSeller);
        setIsAuthenticated(true);
      } else if (res.data.success && !res.data.data) {
        // Logged in as user but no seller profile
        setIsAuthenticated(true);
        // potentially set user state if we had one
      }
    } catch (e) {
      console.error("Failed to load profile", e);
      localStorage.removeItem('token');
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
      // Step 1: Register User
      // Note: The UI asks for firstName/lastName too?
      // The signup function signature here only has email, password, phone.
      // We might need to adjust or send dummy names if UI doesn't provide them.
      // Current UI Step 1 just has Email, Password, Phone?
      // Let's check Signup.tsx.
      // Assuming standard register
      const payload = {
        email, password, phone,
        firstName: 'Seller', // Placeholder
        lastName: 'User',
        address: 'N/A'
      };
      const res = await sellerAPI.auth.signup(payload);
      if (!res.data.success) {
        throw new Error(res.data.message);
      }
      // Auto login? Or ask to login?
      // Usually we auto-login.
      await login(email, password);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Signup failed');
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
