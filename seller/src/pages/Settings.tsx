import React, { useState, useEffect } from 'react';
import {
  User,
  Store,
  Building,
  CreditCard,
  Lock,
  Camera,
  Save,
  Loader2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { sellerAPI } from '@/lib/api';

const Settings: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    avatar: ''
  });

  const [sellerData, setSellerData] = useState({
    storeName: '',
    storeDescription: '', // Frontend placeholder if backend lacks it
    gstNumber: '',
    panNumber: '', // If backend has it
    bankName: '',
    bankAccountNumber: '',
    ifscCode: ''
  });

  const [contactSupport, setContactSupport] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passLoading, setPassLoading] = useState(false);

  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch User Profile
      const userRes = await sellerAPI.auth.getUserProfile();
      if (userRes.data.success) {
        setProfileData(userRes.data.data);
      }

      // Fetch Seller Profile
      const sellerRes = await sellerAPI.auth.getSellerProfile();
      if (sellerRes.data.success && sellerRes.data.data) {
        const s = sellerRes.data.data;
        setSellerData({
          storeName: s.storeName,
          storeDescription: s.storeDescription || '',
          gstNumber: s.gstNumber || '',
          panNumber: s.kycDetails?.panCard || '', // Assuming PAN is in KYC
          bankName: s.bankDetails?.bankName || '', // If backend provides bank name
          bankAccountNumber: s.bankDetails?.accountNumber || '',
          ifscCode: s.bankDetails?.ifscCode || ''
        });
      }
    } catch (error) {
      console.error("Failed to load settings", error);
      toast({
        title: "Error",
        description: "Failed to load profile data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      await sellerAPI.auth.updateUserProfile({
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        phone: profileData.phone
      });
      toast({
        title: 'Profile updated',
        description: 'Your profile information has been saved.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update profile',
        variant: 'destructive'
      });
    }
  };

  const handleSaveStore = () => {
    // Currently backend might not support store name update, 
    // or we use sellerAPI.auth.updatePaymentDetails for bank
    // For now, assuming Store Name is immutable or requires specific API.
    toast({
      title: 'Store settings updated',
      description: 'Your store information has been saved.',
    });
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast({
        title: 'Password mismatch',
        description: 'New password and confirmation do not match.',
        variant: 'destructive',
      });
      return;
    }

    try {
      setPassLoading(true);
      await sellerAPI.auth.changePassword({
        oldPassword: currentPassword,
        newPassword: newPassword
      });

      toast({
        title: 'Password changed',
        description: 'Your password has been updated successfully.',
      });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to change password',
        variant: 'destructive'
      });
    } finally {
      setPassLoading(false);
    }
  };

  if (loading) {
    return <div className="flex h-screen items-center justify-center"><Loader2 className="w-8 h-8 animate-spin" /></div>;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="page-header">
        <h1 className="page-title">Settings</h1>
        <p className="page-description">
          Manage your profile and store settings
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="bg-muted p-1 rounded-lg">
          <TabsTrigger value="profile" className="gap-2">
            <User className="w-4 h-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="store" className="gap-2">
            <Store className="w-4 h-4" />
            Store
          </TabsTrigger>
          <TabsTrigger value="business" className="gap-2">
            <Building className="w-4 h-4" />
            Business
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <Lock className="w-4 h-4" />
            Security
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <div className="bg-card rounded-xl border border-border p-6">
            <h3 className="card-title mb-6">Personal Information</h3>

            <div className="flex items-center gap-6 mb-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-3xl font-bold text-primary">
                    {profileData.firstName ? profileData.firstName.charAt(0) : 'U'}
                  </span>
                </div>
                {/* Image upload could be added here */}
              </div>
              <div>
                <p className="font-medium text-foreground">{profileData.firstName} {profileData.lastName}</p>
                <p className="text-sm text-muted-foreground">{profileData.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">First Name</label>
                <input
                  value={profileData.firstName}
                  onChange={(e) => setProfileData(prev => ({ ...prev, firstName: e.target.value }))}
                  className="input-field"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Last Name</label>
                <input
                  value={profileData.lastName}
                  onChange={(e) => setProfileData(prev => ({ ...prev, lastName: e.target.value }))}
                  className="input-field"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Email</label>
                <input
                  value={profileData.email}
                  disabled
                  type="email"
                  className="input-field bg-muted cursor-not-allowed"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Phone</label>
                <input
                  value={profileData.phone || ''}
                  onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                  className="input-field"
                />
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <button onClick={handleSaveProfile} className="btn-primary">
                <Save className="w-4 h-4" />
                Save Changes
              </button>
            </div>
          </div>
        </TabsContent>

        {/* Store Tab */}
        <TabsContent value="store" className="space-y-6">
          <div className="bg-card rounded-xl border border-border p-6">
            <h3 className="card-title mb-6">Store Information</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Store Name</label>
                <input
                  value={sellerData.storeName}
                  disabled // Disabled as we don't have direct update endpoint yet
                  className="input-field bg-muted"
                />
                <p className="text-xs text-muted-foreground">Contact support to change store name</p>
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-foreground">Store Description</label>
                <textarea
                  value={sellerData.storeDescription || ''}
                  onChange={(e) => setSellerData(prev => ({ ...prev, storeDescription: e.target.value }))}
                  rows={4}
                  className="input-field resize-none"
                  placeholder="Tell customers about your store..."
                />
              </div>
            </div>
            {/* 
            <div className="flex justify-end mt-6">
              <button onClick={handleSaveStore} className="btn-primary">
                <Save className="w-4 h-4" />
                Save Changes
              </button>
            </div>
            */}
          </div>
        </TabsContent>

        {/* Business Tab */}
        <TabsContent value="business" className="space-y-6">
          <div className="bg-card rounded-xl border border-border p-6">
            <h3 className="card-title mb-6">Business Details</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">GST Number</label>
                <input
                  value={sellerData.gstNumber}
                  disabled
                  className="input-field bg-muted"
                />
              </div>
              {sellerData.panNumber && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">PAN Number</label>
                  <input
                    value={sellerData.panNumber}
                    disabled
                    className="input-field bg-muted"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="bg-card rounded-xl border border-border p-6">
            <div className="flex items-center gap-3 mb-6">
              <CreditCard className="w-5 h-5 text-primary" />
              <h3 className="card-title">Bank Account Details</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Bank Name</label>
                <input
                  value={sellerData.bankName}
                  disabled
                  className="input-field bg-muted"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Account Number</label>
                <input
                  value={sellerData.bankAccountNumber}
                  disabled
                  className="input-field bg-muted"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">IFSC Code</label>
                <input
                  value={sellerData.ifscCode}
                  disabled
                  className="input-field bg-muted"
                />
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              Bank details are read-only to ensure payout security. Contact verification team to update.
            </p>
          </div>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <div className="bg-card rounded-xl border border-border p-6">
            <h3 className="card-title mb-6">Change Password</h3>

            <div className="max-w-md space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Current Password</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="input-field"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="input-field"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="input-field"
                />
              </div>

              <button
                onClick={handleChangePassword}
                disabled={!currentPassword || !newPassword || !confirmPassword || passLoading}
                className="btn-primary"
              >
                {passLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Update Password'}
              </button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
