import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, Store, ChevronLeft, HelpCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

const Signup: React.FC = () => {
  const [step, setStep] = useState(1);
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Step 2 State
  const [storeName, setStoreName] = useState('');
  const [sellerType, setSellerType] = useState('Individual');
  const [gstNumber, setGstNumber] = useState('');
  const [address, setAddress] = useState('');
  const [pincode, setPincode] = useState('');
  const [city, setCity] = useState('');

  // Step 3 State
  const [accountHolderName, setAccountHolderName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [chequeFile, setChequeFile] = useState<File | null>(null);

  // Step 4 State
  const [panCard, setPanCard] = useState<File | null>(null);
  const [addressProofDoc, setAddressProofDoc] = useState<File | null>(null);
  const [livePhoto, setLivePhoto] = useState<File | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  const { signup, createSellerProfile, savePaymentDetails, submitKYC, isLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleStep1Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signup(email, password, mobile);
      toast({
        title: 'Account Verified!',
        description: 'Verification complete. Please provide business details.',
      });
      setStep(2);
    } catch (error: any) {
      toast({
        title: 'Verification Failed',
        description: error.message || 'Please check your credentials.',
        variant: 'destructive'
      });
    }
  };

  const handleStep2Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createSellerProfile(storeName, sellerType, gstNumber, { address, city, pincode });
      toast({
        title: 'Business Details Saved!',
        description: 'Your store is ready. Now add bank details.',
      });
      setStep(3);
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to save details.', variant: 'destructive' });
    }
  };

  const handleStep3Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await savePaymentDetails(accountHolderName, accountNumber, ifscCode, chequeFile);
      toast({
        title: 'Payment Details Saved!',
        description: 'Please complete KYC verification.',
      });
      setStep(4);
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to save payment details.', variant: 'destructive' });
    }
  };

  const handleStep4Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirmed) {
      toast({ title: 'Confirmation required', description: 'Please confirm all details are correct.', variant: 'destructive' });
      return;
    }
    try {
      await submitKYC(panCard, addressProofDoc, livePhoto);
      toast({
        title: 'Verification Submitted!',
        description: 'Your account is under review.',
      });
      navigate('/pending-verification');
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to submit KYC.', variant: 'destructive' });
    }
  };

  return (
    <div className="min-h-screen bg-background flex overflow-hidden">

      {/* Left Panel - Signup Form (Inverted from Login) */}
      <motion.div
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
        className="flex-1 flex items-center justify-center p-6 lg:p-12 overflow-y-auto"
      >
        <div className="w-full max-w-md space-y-6">

          {/* Mobile Header */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <Store className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">Zythova</span>
          </div>

          {/* Form Header */}
          <div className="space-y-2 text-center lg:text-left">
            <h1 className="text-2xl font-bold text-foreground">
              {step === 1 ? 'Create Your Seller Account' : step === 2 ? 'Tell Us About Your Business' : step === 3 ? 'Payment Details' : 'Verify Your Identity'}
            </h1>
            <p className="text-muted-foreground">
              Step {step} of 4 &bull; {step === 1 ? 'Account Setup' : step === 2 ? 'Business Details' : step === 3 ? 'Bank Info' : 'KYC Verification'}
            </p>
          </div>

          {/* Progress Bar */}
          <div className="relative h-2 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="absolute top-0 left-0 h-full bg-primary"
              initial={{ width: `${((step - 1) / 4) * 100}%` }}
              animate={{ width: `${(step / 4) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          {step === 1 && (
            <form onSubmit={handleStep1Submit} className="space-y-4 animate-fade-in">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Mobile Number</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">+91</span>
                  <input
                    type="tel"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    placeholder="98765 43210"
                    className="input-field pl-12"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seller@example.com"
                  className="input-field"
                  required
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-baseline">
                  <label className="text-sm font-medium text-foreground">Create Password</label>
                  <span className="text-xs text-muted-foreground">Min. 6 characters</span>
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input-field"
                  required
                  minLength={6}
                />
              </div>

              <ul className="space-y-1 text-xs text-muted-foreground list-disc pl-4">
                <li>Choose a strong password with mixed case letters.</li>
                <li>Include special characters & symbols.</li>
              </ul>

              <button type="submit" disabled={isLoading} className="btn-primary w-full">
                {isLoading ? (
                  <><Loader2 className="animate-spin w-4 h-4 mr-2" /> Processing...</>
                ) : 'Continue'}
              </button>

              <div className="text-center">
                <Link to="/login" className="text-sm text-primary hover:underline">
                  Already have an account? Sign in
                </Link>
              </div>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleStep2Submit} className="space-y-4 animate-fade-in">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Business/Store Name</label>
                <input
                  type="text"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  className="input-field"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Seller Type</label>
                <div className="flex space-x-6 mt-2">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="sellerType"
                      value="Individual"
                      checked={sellerType === 'Individual'}
                      onChange={(e) => setSellerType(e.target.value)}
                      className="w-4 h-4 text-primary border-input focus:ring-primary"
                    />
                    <span className="text-foreground">Individual</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="sellerType"
                      value="Business"
                      checked={sellerType === 'Business'}
                      onChange={(e) => setSellerType(e.target.value)}
                      className="w-4 h-4 text-primary border-input focus:ring-primary"
                    />
                    <span className="text-foreground">Business</span>
                  </label>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">GST Number <span className="text-muted-foreground font-normal">(Optional)</span></label>
                <input
                  type="text"
                  value={gstNumber}
                  onChange={(e) => setGstNumber(e.target.value)}
                  className="input-field"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Full Address</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="input-field"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Pincode</label>
                  <input
                    type="text"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    className="input-field"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">City</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="input-field"
                    required
                  />
                </div>
              </div>

              <button type="submit" disabled={isLoading} className="btn-primary w-full mt-4">
                {isLoading ? <><Loader2 className="animate-spin w-4 h-4 mr-2" /> Processing...</> : 'Continue'}
              </button>

              <div className="flex justify-between items-center text-sm pt-2">
                <button type="button" onClick={() => setStep(step - 1)} className="text-muted-foreground hover:text-foreground flex items-center">
                  <ChevronLeft className="w-4 h-4 mr-1" /> Back
                </button>
                <Link to="/help" className="text-primary hover:underline">Need Help?</Link>
              </div>
            </form>
          )}

          {step === 3 && (
            <form onSubmit={handleStep3Submit} className="space-y-4 animate-fade-in">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Bank Account Holder Name</label>
                <input
                  type="text"
                  value={accountHolderName}
                  onChange={(e) => setAccountHolderName(e.target.value)}
                  className="input-field"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Bank Account Number</label>
                <input
                  type="password"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  className="input-field"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">IFSC Code</label>
                <input
                  type="text"
                  value={ifscCode}
                  onChange={(e) => setIfscCode(e.target.value.toUpperCase())}
                  className="input-field"
                  required
                />
              </div>

              <div className="space-y-2 p-4 border-2 border-dashed border-input rounded-xl flex flex-col items-center justify-center text-center bg-muted/20 hover:bg-muted/30 transition-colors">
                <label className="text-sm font-medium text-foreground mb-2">Upload Cancelled Cheque / Passbook</label>
                <div className="relative cursor-pointer">
                  <span className="text-primary font-medium">Click to Upload</span>
                  <input
                    type="file"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    accept=".jpg,.jpeg,.png,.pdf"
                    onChange={(e) => setChequeFile(e.target.files ? e.target.files[0] : null)}
                  />
                </div>
                {chequeFile && <p className="text-xs text-success mt-2">Selected: {chequeFile.name}</p>}
              </div>

              <button type="submit" disabled={isLoading} className="btn-primary w-full mt-4">
                {isLoading ? <><Loader2 className="animate-spin w-4 h-4 mr-2" /> Processing...</> : 'Continue'}
              </button>

              <div className="flex justify-between items-center text-sm pt-2">
                <button type="button" onClick={() => setStep(step - 1)} className="text-muted-foreground hover:text-foreground flex items-center">
                  <ChevronLeft className="w-4 h-4 mr-1" /> Back
                </button>
                <Link to="/help" className="text-primary hover:underline">Need Help?</Link>
              </div>
            </form>
          )}

          {step === 4 && (
            <form onSubmit={handleStep4Submit} className="space-y-4 animate-fade-in">
              <div className="space-y-3">
                <label className="text-sm font-medium text-foreground">Upload PAN Card <span className="text-destructive">*</span></label>
                <div className="border border-input rounded-lg p-3 bg-muted/20 flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{panCard ? panCard.name : "No file selected"}</span>
                  <label className="text-xs btn-secondary cursor-pointer">
                    Upload
                    <input type="file" className="hidden" accept="image/*,.pdf" onChange={(e) => setPanCard(e.target.files ? e.target.files[0] : null)} required />
                  </label>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium text-foreground">Address Proof <span className="text-destructive">*</span></label>
                <div className="border border-input rounded-lg p-3 bg-muted/20 flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{addressProofDoc ? addressProofDoc.name : "No file selected"}</span>
                  <label className="text-xs btn-secondary cursor-pointer">
                    Upload
                    <input type="file" className="hidden" accept="image/*,.pdf" onChange={(e) => setAddressProofDoc(e.target.files ? e.target.files[0] : null)} required />
                  </label>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium text-foreground">Live Photo (Selfie)</label>
                <div className="border border-input rounded-lg p-3 bg-muted/20 flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{livePhoto ? livePhoto.name : "No file selected"}</span>
                  <label className="text-xs btn-secondary cursor-pointer">
                    Capture
                    <input type="file" className="hidden" accept="image/*" capture="user" onChange={(e) => setLivePhoto(e.target.files ? e.target.files[0] : null)} />
                  </label>
                </div>
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <input type="checkbox" id="confirm" checked={confirmed} onChange={(e) => setConfirmed(e.target.checked)} className="w-4 h-4 rounded border-input text-primary focus:ring-primary" />
                <label htmlFor="confirm" className="text-sm text-muted-foreground">I confirm all the details are correct.</label>
              </div>

              <button type="submit" disabled={isLoading} className="btn-primary w-full mt-2">
                {isLoading ? <><Loader2 className="animate-spin w-4 h-4 mr-2" /> Processing...</> : 'Submit for Verification'}
              </button>

              <div className="flex justify-between items-center text-sm pt-2">
                <button type="button" onClick={() => setStep(step - 1)} className="text-muted-foreground hover:text-foreground flex items-center">
                  <ChevronLeft className="w-4 h-4 mr-1" /> Back
                </button>
                <Link to="/help" className="text-primary hover:underline">Need Help?</Link>
              </div>
            </form>
          )}

        </div>
      </motion.div>

      {/* Right Panel - Branding (Inverted from Login) */}
      <motion.div
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
        className="hidden lg:flex lg:w-1/2 bg-sidebar p-12 flex-col justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-sidebar-primary flex items-center justify-center">
            <Store className="w-5 h-5 text-sidebar-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-sidebar-foreground">Zythova</span>
        </div>

        <div className="space-y-6">
          <h1 className="text-4xl font-bold text-sidebar-foreground leading-tight">
            Join our community<br />
            of successful sellers.
          </h1>
          <p className="text-sidebar-muted text-lg max-w-md">
            Start your journey with us today. Reach millions of customers and grow your business with our powerful tools.
          </p>
        </div>

        <div className="text-sidebar-muted text-sm space-y-4">
          {/* Help Center Info in Branding Panel */}
          <div className="bg-white/5 rounded-xl p-4 backdrop-blur-sm border border-white/10">
            <h4 className="font-semibold text-sidebar-foreground mb-2 flex items-center gap-2">
              <HelpCircle className="w-4 h-4" /> Need Assistance?
            </h4>
            <p className="text-xs mb-3 opacity-80">Our support team is available 24/7 to help you with the onboarding process.</p>
            <Link to="/support" className="text-xs text-sidebar-primary hover:text-sidebar-primary-foreground transition-colors">Contact Support &rarr;</Link>
          </div>

          <p>© 2024 Zythova. All rights reserved.</p>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;
