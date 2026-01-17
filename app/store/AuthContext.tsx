import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';
import { User, Address } from '@/types';
import { apiService } from '@/services/api';

export const [AuthProvider, useAuth] = createContextHook(() => {
  const [user, setUser] = useState<User | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const userData = await AsyncStorage.getItem('user');

      if (token && userData) {
        setUser(JSON.parse(userData));
        setIsAuthenticated(true);

        // Optionally refresh profile from server to ensure it's up to date
        try {
          const profileResponse = await apiService.getProfile();
          if (profileResponse.success) {
            const freshUser = {
              id: profileResponse.data._id || profileResponse.data.id,
              name: `${profileResponse.data.firstName} ${profileResponse.data.lastName}`,
              email: profileResponse.data.email,
              phone: profileResponse.data.phone,
              avatar: profileResponse.data.avatar,
              createdAt: profileResponse.data.createdAt,
            };
            await AsyncStorage.setItem('user', JSON.stringify(freshUser));
            setUser(freshUser);
            // Fetch addresses as well
            await fetchAddresses();
          }
        } catch (err) {
          console.error('Failed to refresh profile:', err);
        }
      }
    } catch (error) {
      console.error('Failed to load user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAddresses = async () => {
    try {
      const response = await apiService.getAddresses();
      if (response.success) {
        setAddresses(response.data);
      }
    } catch (error) {
      console.error('Fetch addresses error:', error);
    }
  };

  const addAddress = async (addressData: Partial<Address>) => {
    try {
      const response = await apiService.addAddress(addressData);
      if (response.success) {
        setAddresses(response.data);
        return { success: true };
      }
      return { success: false, message: response.message || 'Failed to add address' };
    } catch (error: any) {
      console.error('Add address error:', error);
      return { success: false, message: error.message || 'An error occurred' };
    }
  };

  const updateAddress = async (index: number, addressData: Partial<Address>) => {
    try {
      const response = await apiService.updateAddress(index, addressData);
      if (response.success) {
        setAddresses(response.data);
        return { success: true };
      }
      return { success: false, message: response.message || 'Failed to update address' };
    } catch (error: any) {
      console.error('Update address error:', error);
      return { success: false, message: error.message || 'An error occurred' };
    }
  };

  const deleteAddress = async (index: number) => {
    try {
      const response = await apiService.deleteAddress(index);
      if (response.success) {
        setAddresses(response.data);
        return { success: true };
      }
      return { success: false, message: response.message || 'Failed to delete address' };
    } catch (error: any) {
      console.error('Delete address error:', error);
      return { success: false, message: error.message || 'An error occurred' };
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await apiService.login({ email, password });

      if (response.success) {
        // Fetch full profile after login
        const profileResponse = await apiService.getProfile();
        if (profileResponse.success) {
          const userData: User = {
            id: profileResponse.data._id || profileResponse.data.id,
            name: `${profileResponse.data.firstName} ${profileResponse.data.lastName}`,
            email: profileResponse.data.email,
            phone: profileResponse.data.phone,
            avatar: profileResponse.data.avatar,
            createdAt: profileResponse.data.createdAt,
          };

          await AsyncStorage.setItem('user', JSON.stringify(userData));
          setUser(userData);
          setIsAuthenticated(true);
          return { success: true };
        }
      }
      return { success: false, message: response.message || 'Login failed' };
    } catch (error: any) {
      console.error('Login error:', error);
      return { success: false, message: error.message || 'An error occurred during login' };
    }
  };

  const updateProfile = async (userData: { firstName?: string; lastName?: string; phone?: string; email?: string; avatar?: string }) => {
    try {
      const response = await apiService.updateProfile(userData);
      if (response.success) {
        // preserve existing user data if not returned fully, but usually response.data is full user
        const updatedUser: User = {
          id: response.data._id || response.data.id || user?.id,
          name: `${response.data.firstName} ${response.data.lastName}`,
          email: response.data.email,
          phone: response.data.phone,
          avatar: response.data.avatar,
          createdAt: response.data.createdAt || user?.createdAt,
        };
        await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        return { success: true };
      }
      return { success: false, message: response.message || 'Update failed' };
    } catch (error: any) {
      console.error('Update profile error:', error);
      return { success: false, message: error.message || 'An error occurred during profile update' };
    }
  };

  const uploadProfileImage = async (uri: string) => {
    try {
      const response = await apiService.uploadImage(uri);
      if (response.success && response.data?.url) {
        return await updateProfile({ avatar: response.data.url });
      }
      return { success: false, message: response.message || 'Upload failed' };
    } catch (error: any) {
      return { success: false, message: error.message || 'Upload error' };
    }
  };

  const changePassword = async (newPassword: string) => {
    try {
      const response = await apiService.changePassword(newPassword);
      return response;
    } catch (error: any) {
      return { success: false, message: error.message || 'Change password failed' };
    }
  };

  const signup = async (
    name: string,
    email: string,
    phone: string,
    password: string
  ) => {
    try {
      // Split name into firstName and lastName
      const nameParts = name.trim().split(' ');
      const firstName = nameParts[0];
      const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : nameParts[0];

      const response = await apiService.register({
        firstName,
        lastName,
        email,
        phone,
        password
      });

      if (response.success) {
        // After signup, we automatically login
        return await login(email, password);
      }
      return { success: false, message: response.message || 'Signup failed' };
    } catch (error: any) {
      console.error('Signup error:', error);
      return { success: false, message: error.message || 'An error occurred during signup' };
    }
  };

  const logout = async () => {
    await apiService.logout();
    await AsyncStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
  };

  return {
    user,
    addresses,
    isLoading,
    isAuthenticated,
    login,
    signup,
    logout,
    updateProfile,
    fetchAddresses,
    addAddress,
    updateAddress,
    deleteAddress,
    uploadProfileImage,
    changePassword,
  };
});
