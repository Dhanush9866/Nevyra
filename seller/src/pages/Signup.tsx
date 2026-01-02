import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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
        title: 'Account created!',
        description: 'Account setup complete. Please provide business details.',
      });
      setStep(2);
    } catch (error) {
      toast({ title: 'Signup failed', description: 'Please try again.', variant: 'destructive' });
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
    <div className="min-h-screen bg-[#F8F9FE] flex flex-col items-center justify-center p-4 font-sans">

      <div className="w-full max-w-md bg-white rounded-3xl shadow-sm p-8 md:p-10">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          {step > 1 && (
            <button onClick={() => setStep(step - 1)} className="text-gray-500 hover:text-gray-800">
              <span className="sr-only">Back</span>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
          )}
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex-1 text-center md:text-left ml-2">
            {step === 1 ? 'Create Your Seller Account' : step === 2 ? 'Tell Us About Your Business' : step === 3 ? 'Payment Details' : 'Verify Your Identity'}
          </h1>
          {step >= 2 && (
            <span className="text-gray-400 text-2xl tracking-widest">•••</span>
          )}
        </div>

        {/* Progress Step */}
        <div className="flex items-center space-x-4 mb-8">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#2563EB] text-white font-bold text-sm">
            {step}
          </div>
          <span className="text-gray-700 font-medium whitespace-nowrap">
            {step === 1 ? 'Account Setup' : step === 2 ? 'Business Details' : step === 3 ? 'Payment Details' : 'KYC & Verification'}
          </span>
          <div className="h-0.5 w-full bg-gray-200"></div>
          <span className="text-gray-400 text-sm whitespace-nowrap">{step} of 4</span>
        </div>

        {step === 1 ? (
          <form onSubmit={handleStep1Submit} className="space-y-6">

            {/* Mobile Number */}
            <div className="space-y-2">
              <label className="text-lg font-medium text-gray-900">
                Mobile Number
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                  +91
                </span>
                <input
                  type="tel"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder=" | | | | | | | | |"
                  className="w-full bg-[#F3F4F6] border border-gray-200 rounded-lg py-3 pl-14 pr-4 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/50 focus:border-[#2563EB] transition-all"
                  required
                />
              </div>
            </div>

            {/* Email Address */}
            <div className="space-y-2">
              <label className="text-lg font-medium text-gray-900">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email email"
                className="w-full bg-[#F3F4F6] border border-gray-200 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/50 focus:border-[#2563EB] transition-all"
                required
              />
            </div>

            {/* Create Password */}
            <div className="space-y-2">
              <div className="flex justify-between items-baseline">
                <label className="text-lg font-medium text-gray-900">
                  Create Password
                </label>
                <span className="text-sm text-gray-500">Min. 6 characters</span>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="● ● ● ● ● ● ● ● ●"
                className="w-full bg-[#F3F4F6] border border-gray-200 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/50 focus:border-[#2563EB] transition-all"
                required
                minLength={6}
              />
            </div>

            {/* Password Requirements */}
            <ul className="space-y-2 text-sm text-gray-600 pl-1">
              <li className="flex items-start">
                <span className="mr-2 text-[#2563EB]">•</span> Choose a strong password, Capital letter,
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-[#2563EB]">•</span> special characters & symbols.
              </li>
              {/* Note: The mock text in image was garbled/lorem ipsum-like, using sensible defaults */}
            </ul>

            <button type="submit" disabled={isLoading} className="w-full bg-[#6B46C1] hover:bg-[#5a39a3] text-white font-bold text-lg py-4 rounded-xl shadow-lg transition-all transform active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed mt-4">
              {isLoading ? <div className="flex items-center justify-center space-x-2"><Loader2 className="animate-spin h-5 w-5" /><span>Processing...</span></div> : 'Continue'}
            </button>

            <div className="flex justify-start items-center text-gray-500 pt-4">
              <Link to="/login" className="hover:text-gray-800 transition-colors">Back</Link>
            </div>

          </form>
        ) : step === 2 ? (
          <form onSubmit={handleStep2Submit} className="space-y-6">

            {/* Business/Store Name */}
            <div className="space-y-2">
              <label className="text-lg font-medium text-gray-900">Business/Store Name</label>
              <input
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="w-full bg-[#F3F4F6] border border-gray-200 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/50 focus:border-[#2563EB] transition-all"
                required
              />
            </div>

            {/* Seller Type */}
            <div className="space-y-2">
              <label className="text-lg font-medium text-gray-900">Seller Type</label>
              <div className="flex space-x-6 mt-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="sellerType"
                    value="Individual"
                    checked={sellerType === 'Individual'}
                    onChange={(e) => setSellerType(e.target.value)}
                    className="w-5 h-5 text-[#6B46C1] border-gray-300 focus:ring-[#6B46C1]"
                  />
                  <span className="text-gray-800">Individual</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="sellerType"
                    value="Business"
                    checked={sellerType === 'Business'}
                    onChange={(e) => setSellerType(e.target.value)}
                    className="w-5 h-5 text-[#6B46C1] border-gray-300 focus:ring-[#6B46C1]"
                  />
                  <span className="text-gray-800">Business</span>
                </label>
              </div>
            </div>

            {/* GST Number */}
            <div className="space-y-2">
              <label className="text-lg font-medium text-gray-900">GST Number <span className="text-gray-500 text-sm font-normal">(Optional)</span></label>
              <input
                type="text"
                value={gstNumber}
                onChange={(e) => setGstNumber(e.target.value)}
                className="w-full bg-[#F3F4F6] border border-gray-200 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/50 focus:border-[#2563EB] transition-all"
              />
            </div>

            {/* Full Address */}
            <div className="space-y-2">
              <label className="text-lg font-medium text-gray-900">Full Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full bg-[#F3F4F6] border border-gray-200 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/50 focus:border-[#2563EB] transition-all"
                required
              />
            </div>

            {/* Pincode & City */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-lg font-medium text-gray-900">Pincode</label>
                <input
                  type="text"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className="w-full bg-[#F3F4F6] border border-gray-200 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/50 focus:border-[#2563EB] transition-all"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-lg font-medium text-gray-900">City</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-[#F3F4F6] border border-gray-200 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/50 focus:border-[#2563EB] transition-all"
                  required
                />
              </div>
            </div>

            <button type="submit" disabled={isLoading} className="w-full bg-[#6B46C1] hover:bg-[#5a39a3] text-white font-bold text-lg py-4 rounded-xl shadow-lg transition-all transform active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed mt-4">
              {isLoading ? <div className="flex items-center justify-center space-x-2"><Loader2 className="animate-spin h-5 w-5" /><span>Processing...</span></div> : 'Continue'}
            </button>

            <div className="flex justify-between items-center text-gray-500 pt-4">
              <button type="button" onClick={() => setStep(step - 1)} className="hover:text-gray-800 transition-colors">Back</button>
              <Link to="/help" className="hover:text-gray-800 transition-colors">Help</Link>
            </div>

            {/* Help Center Section */}
            <div className="mt-8 pt-8 border-t border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Help Center</h3>
              <div className="space-y-2 bg-[#F3F0FF] rounded-xl overflow-hidden text-gray-800">
                <div className="px-4 py-3 flex justify-between items-center hover:bg-[#EBE5FF] cursor-pointer">
                  <div className="flex items-center space-x-3">
                    <div className="w-5 h-5 rounded-full border border-gray-500 flex items-center justify-center text-xs">?</div>
                    <span>Help Center</span>
                  </div>
                  <span>›</span>
                </div>
                <div className="px-4 py-3 flex justify-between items-center hover:bg-[#EBE5FF] cursor-pointer border-t border-white/50">
                  <div className="flex items-center space-x-3">
                    <div className="w-5 h-5 rounded bg-gray-500/20 flex items-center justify-center text-xs">Q</div>
                    <span>Seller FAQs</span>
                  </div>
                  <span>›</span>
                </div>
                <div className="px-4 py-3 flex justify-between items-center hover:bg-[#EBE5FF] cursor-pointer border-t border-white/50">
                  <div className="flex items-center space-x-3">
                    <div className="w-5 h-5 rounded bg-gray-500/20 flex items-center justify-center text-xs">@</div>
                    <span>Contact Support</span>
                  </div>
                  <span>›</span>
                </div>
              </div>
            </div>
          </form>
        ) : step === 3 ? (
          <form onSubmit={handleStep3Submit} className="space-y-6">

            {/* Bank Account Holder Name */}
            <div className="space-y-2">
              <label className="text-lg font-medium text-gray-900">Bank Account Holder Name</label>
              <input
                type="text"
                value={accountHolderName}
                onChange={(e) => setAccountHolderName(e.target.value)}
                className="w-full bg-[#F3F4F6] border border-gray-200 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/50 focus:border-[#2563EB] transition-all"
                required
              />
            </div>

            {/* Bank Account Number */}
            <div className="space-y-2">
              <label className="text-lg font-medium text-gray-900">Bank Account Number</label>
              <div className="relative">
                <input
                  type="password"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  className="w-full bg-[#F3F4F6] border border-gray-200 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/50 focus:border-[#2563EB] transition-all"
                  required
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex space-x-1">
                  {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-gray-400"></div>)}
                </div>
              </div>
            </div>

            {/* Bank IFSC Code */}
            <div className="space-y-2">
              <label className="text-lg font-medium text-gray-900">Bank IFSC Code</label>
              <input
                type="text"
                value={ifscCode}
                onChange={(e) => setIfscCode(e.target.value.toUpperCase())}
                className="w-full bg-[#F3F4F6] border border-gray-200 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/50 focus:border-[#2563EB] transition-all"
                required
              />
            </div>

            {/* Upload Cancelled Cheque */}
            <div className="space-y-2 p-4 bg-[#F8F9FE] border-2 border-dashed border-[#B8B5FF] rounded-xl flex flex-col items-center justify-center text-center">
              <label className="text-lg font-medium text-gray-900 mb-2 w-full text-left ml-4">Upload Cancelled Cheque <br /><span className="text-sm font-normal text-gray-500">OR Bank Passbook</span></label>

              <div className="relative w-full max-w-[280px] h-32 bg-[#EBE5FF] rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                {/* Decorative placeholder for cheque image */}
                <div className="w-4/5 h-3/5 bg-white shadow-sm rounded flex flex-col p-2 space-y-1 opacity-70">
                  <div className="w-1/3 h-1 bg-gray-200 rounded"></div>
                  <div className="w-2/3 h-1 bg-gray-200 rounded"></div>
                  <div className="w-full h-1 bg-gray-200 rounded mt-2"></div>
                </div>
              </div>

              <div className="flex items-center space-x-2 text-[#6B46C1] font-medium cursor-pointer relative">
                <span className="text-xl">★</span>
                <span>Upload File (JPEG, PNG, PDF)</span>
                <input
                  type="file"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  accept=".jpg,.jpeg,.png,.pdf"
                  onChange={(e) => setChequeFile(e.target.files ? e.target.files[0] : null)}
                />
              </div>
              {chequeFile && <p className="text-sm text-green-600 mt-2">Selected: {chequeFile.name}</p>}
            </div>

            <button type="submit" disabled={isLoading} className="w-full bg-[#6B46C1] hover:bg-[#5a39a3] text-white font-bold text-lg py-4 rounded-xl shadow-lg transition-all transform active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed mt-4">
              {isLoading ? <div className="flex items-center justify-center space-x-2"><Loader2 className="animate-spin h-5 w-5" /><span>Processing...</span></div> : 'Submit'}
            </button>

            <div className="flex justify-between items-center text-gray-500 pt-4">
              <button type="button" onClick={() => setStep(step - 1)} className="hover:text-gray-800 transition-colors">Back</button>
              <Link to="/help" className="hover:text-gray-800 transition-colors">Help</Link>
            </div>

          </form>
        ) : (
          <form onSubmit={handleStep4Submit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-base font-medium text-gray-900">Upload PAN Card <span className="text-gray-500 font-normal">(Mandatory)</span></label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center bg-[#F8F9FE] hover:bg-[#F3F0FF] transition-colors cursor-pointer relative group">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-2">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                </div>
                <span className="text-sm font-medium text-[#6B46C1] group-hover:underline">Upload PAN Card</span>
                <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*,.pdf" onChange={(e) => setPanCard(e.target.files ? e.target.files[0] : null)} required />
              </div>
              {panCard && <p className="text-sm text-green-600 text-center">Selected: {panCard.name}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-base font-medium text-gray-900">Upload Address Proof <span className="text-gray-500 font-normal">(Aadhaar / Voter ID / DL)</span></label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center bg-[#F8F9FE] hover:bg-[#F3F0FF] transition-colors cursor-pointer relative group">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-2">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                </div>
                <span className="text-sm font-medium text-[#6B46C1] group-hover:underline">Upload Address Proof</span>
                <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*,.pdf" onChange={(e) => setAddressProofDoc(e.target.files ? e.target.files[0] : null)} required />
              </div>
              {addressProofDoc && <p className="text-sm text-green-600 text-center">Selected: {addressProofDoc.name}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-base font-medium text-gray-900">Take a Selfie / Live Photo <span className="text-gray-500 font-normal">(Optional)</span></label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center bg-[#F8F9FE] hover:bg-[#F3F0FF] transition-colors cursor-pointer relative group">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-2">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                </div>
                <span className="text-sm font-medium text-[#6B46C1] group-hover:underline">Take Live Photo</span>
                <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" capture="user" onChange={(e) => setLivePhoto(e.target.files ? e.target.files[0] : null)} />
              </div>
              {livePhoto && <p className="text-sm text-green-600 text-center">Selected: {livePhoto.name}</p>}
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <input type="checkbox" id="confirm" checked={confirmed} onChange={(e) => setConfirmed(e.target.checked)} className="w-4 h-4 text-[#6B46C1] border-gray-300 rounded focus:ring-[#6B46C1]" />
              <label htmlFor="confirm" className="text-gray-700 text-sm">I confirm all the details are correct.</label>
            </div>

            <button type="submit" disabled={isLoading} className="w-full bg-[#6B46C1] hover:bg-[#5a39a3] text-white font-bold text-lg py-4 rounded-xl shadow-lg transition-all transform active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed mt-4">
              {isLoading ? <div className="flex items-center justify-center space-x-2"><Loader2 className="animate-spin h-5 w-5" /><span>Processing...</span></div> : 'Submit for Verification'}
            </button>
            <div className="flex justify-between items-center text-gray-500 pt-4"><button type="button" onClick={() => setStep(step - 1)} className="hover:text-gray-800 transition-colors">Back</button><Link to="/help" className="hover:text-gray-800 transition-colors">Help</Link></div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Signup;

