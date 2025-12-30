import React, { useState } from 'react';
import { 
  User, 
  Store, 
  Building, 
  CreditCard, 
  Lock, 
  Camera,
  Save
} from 'lucide-react';
import { mockSeller } from '@/services/mockData';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Settings: React.FC = () => {
  const [seller, setSeller] = useState(mockSeller);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { toast } = useToast();

  const handleSaveProfile = () => {
    toast({
      title: 'Profile updated',
      description: 'Your profile information has been saved.',
    });
  };

  const handleSaveStore = () => {
    toast({
      title: 'Store settings updated',
      description: 'Your store information has been saved.',
    });
  };

  const handleChangePassword = () => {
    if (newPassword !== confirmPassword) {
      toast({
        title: 'Password mismatch',
        description: 'New password and confirmation do not match.',
        variant: 'destructive',
      });
      return;
    }
    toast({
      title: 'Password changed',
      description: 'Your password has been updated successfully.',
    });
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

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
                    {seller.name.charAt(0)}
                  </span>
                </div>
                <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                  <Camera className="w-4 h-4" />
                </button>
              </div>
              <div>
                <p className="font-medium text-foreground">{seller.name}</p>
                <p className="text-sm text-muted-foreground">{seller.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Full Name</label>
                <input
                  value={seller.name}
                  onChange={(e) => setSeller(prev => ({ ...prev, name: e.target.value }))}
                  className="input-field"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Email</label>
                <input
                  value={seller.email}
                  onChange={(e) => setSeller(prev => ({ ...prev, email: e.target.value }))}
                  type="email"
                  className="input-field"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Phone</label>
                <input
                  value={seller.phone || ''}
                  onChange={(e) => setSeller(prev => ({ ...prev, phone: e.target.value }))}
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
                  value={seller.storeName}
                  onChange={(e) => setSeller(prev => ({ ...prev, storeName: e.target.value }))}
                  className="input-field"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Store Logo URL</label>
                <input
                  value={seller.storeLogo || ''}
                  onChange={(e) => setSeller(prev => ({ ...prev, storeLogo: e.target.value }))}
                  className="input-field"
                  placeholder="https://..."
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-foreground">Store Description</label>
                <textarea
                  value={seller.storeDescription || ''}
                  onChange={(e) => setSeller(prev => ({ ...prev, storeDescription: e.target.value }))}
                  rows={4}
                  className="input-field resize-none"
                  placeholder="Tell customers about your store..."
                />
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <button onClick={handleSaveStore} className="btn-primary">
                <Save className="w-4 h-4" />
                Save Changes
              </button>
            </div>
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
                  value={seller.gstNumber || ''}
                  disabled
                  className="input-field bg-muted"
                />
                <p className="text-xs text-muted-foreground">Contact support to update</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">PAN Number</label>
                <input
                  value={seller.panNumber || ''}
                  disabled
                  className="input-field bg-muted"
                />
                <p className="text-xs text-muted-foreground">Contact support to update</p>
              </div>
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
                  value={seller.bankName || ''}
                  disabled
                  className="input-field bg-muted"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Account Number</label>
                <input
                  value={seller.bankAccountNumber || ''}
                  disabled
                  className="input-field bg-muted"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">IFSC Code</label>
                <input
                  value={seller.ifscCode || ''}
                  disabled
                  className="input-field bg-muted"
                />
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              Bank details are read-only. Contact support to make changes.
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
                disabled={!currentPassword || !newPassword || !confirmPassword}
                className="btn-primary"
              >
                Update Password
              </button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
