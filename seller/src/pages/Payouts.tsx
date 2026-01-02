
import React, { useState, useEffect } from 'react';
import { 
  CreditCard,
  Target,
  ArrowUpRight,
  Clock,
  CheckCircle,
  AlertCircle,
  Building2,
  Wallet,
  Edit2
} from 'lucide-react';
import { sellerAPI } from '@/lib/api';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface PayoutRecord {
  _id: string;
  amount: number;
  status: string;
  requestedAt: string;
  processedAt?: string;
  transactionId?: string;
}

interface BankDetails {
    accountHolderName: string;
    accountNumber: string;
    ifscCode: string;
}

interface WalletData {
    balance: number;
    pendingPayouts: number;
    totalPaid: number;
    recentPayouts: PayoutRecord[];
    bankDetails?: BankDetails;
}

const Payouts: React.FC = () => {
  const { seller } = useAuth(); // Fallback if API fails or for initial render
  const [loading, setLoading] = useState(true);
  const [wallet, setWallet] = useState<WalletData>({
     balance: 0,
     pendingPayouts: 0,
     totalPaid: 0,
     recentPayouts: [],
     bankDetails: undefined
  });
  
  // Payout Request State
  const [isRequestDialogOpen, setIsRequestDialogOpen] = useState(false);
  const [requestAmount, setRequestAmount] = useState<string>('');
  const [requesting, setRequesting] = useState(false);

  // Bank Update State
  const [isBankDialogOpen, setIsBankDialogOpen] = useState(false);
  const [bankForm, setBankForm] = useState<BankDetails>({ accountHolderName: '', accountNumber: '', ifscCode: '' });
  const [updatingBank, setUpdatingBank] = useState(false);

  useEffect(() => {
    fetchWalletData();
  }, []);

  const fetchWalletData = async () => {
    try {
      setLoading(true);
      const res = await sellerAPI.payouts.getWallet();
      if (res.data.success) {
        setWallet(res.data.data);
        if (res.data.data.bankDetails) {
            setBankForm(res.data.data.bankDetails);
        }
      }
    } catch (error) {
       console.error("Fetch wallet error", error);
       toast.error("Failed to load wallet data");
    } finally {
      setLoading(false);
    }
  };

  const handleRequestPayout = async () => {
    const amount = parseFloat(requestAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    if (amount > wallet.balance) {
      toast.error("Insufficient balance");
      return;
    }

    try {
      setRequesting(true);
      await sellerAPI.payouts.request(amount);
      toast.success("Payout requested successfully");
      setIsRequestDialogOpen(false);
      setRequestAmount('');
      fetchWalletData(); // Refresh
    } catch (error: any) {
      console.error("Payout request error", error);
      toast.error(error.response?.data?.message || "Failed to request payout");
    } finally {
      setRequesting(false);
    }
  };

  const handleUpdateBank = async () => {
      if (!bankForm.accountHolderName || !bankForm.accountNumber || !bankForm.ifscCode) {
          toast.error("All bank fields are required");
          return;
      }

      try {
          setUpdatingBank(true);
          await sellerAPI.payouts.updateBank(bankForm);
          toast.success("Bank details updated successfully");
          setIsBankDialogOpen(false);
          fetchWalletData(); // Refresh to ensure sync
      } catch (error: any) {
          console.error("Update bank error", error);
          toast.error(error.response?.data?.message || "Failed to update bank details");
      } finally {
          setUpdatingBank(false);
      }
  };

  const formatCurrency = (val: number) => 
     new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(val);

  const formatDate = (dateString: string) => 
     new Date(dateString).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  const getStatusBadge = (status: string) => {
     switch(status.toLowerCase()) {
       case 'paid': return <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 flex items-center gap-1"><CheckCircle className="w-3 h-3"/> Paid</span>;
       case 'processing': return <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 flex items-center gap-1"><Clock className="w-3 h-3"/> Processing</span>;
       case 'pending': return <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700 flex items-center gap-1"><Clock className="w-3 h-3"/> Pending</span>;
       case 'failed': return <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700 flex items-center gap-1"><AlertCircle className="w-3 h-3"/> Failed</span>;
       case 'rejected': return <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700 flex items-center gap-1"><AlertCircle className="w-3 h-3"/> Rejected</span>;
       default: return <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">{status}</span>;
     }
  };

  const currentBank = wallet.bankDetails || seller?.bankDetails;

  return (
    <div className="space-y-6 animate-fade-in p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
           <h1 className="text-2xl font-bold text-foreground">Payouts</h1>
           <p className="text-muted-foreground">Manage your earnings and withdrawals</p>
        </div>
        <button 
           onClick={() => setIsRequestDialogOpen(true)}
           disabled={wallet.balance <= 0}
           className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
           <CreditCard className="w-4 h-4 mr-2" />
           Request Payout
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl p-6 border border-primary/10">
           <div className="flex items-start justify-between">
              <div>
                 <p className="text-sm font-medium text-muted-foreground mb-1">Available Balance</p>
                 <h3 className="text-3xl font-bold text-foreground">{formatCurrency(wallet.balance)}</h3>
              </div>
              <div className="p-3 bg-primary/10 rounded-lg">
                 <Wallet className="w-6 h-6 text-primary" />
              </div>
           </div>
        </div>

        <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
           <div className="flex items-start justify-between">
              <div>
                 <p className="text-sm font-medium text-muted-foreground mb-1">Processing</p>
                 <h3 className="text-2xl font-bold text-foreground">{formatCurrency(wallet.pendingPayouts)}</h3>
              </div>
              <div className="p-3 bg-yellow-50 rounded-lg">
                 <Clock className="w-6 h-6 text-yellow-500" />
              </div>
           </div>
        </div>

        <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
           <div className="flex items-start justify-between">
              <div>
                 <p className="text-sm font-medium text-muted-foreground mb-1">Total Withdrawn</p>
                 <h3 className="text-2xl font-bold text-foreground">{formatCurrency(wallet.totalPaid)}</h3>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                 <CheckCircle className="w-6 h-6 text-green-500" />
              </div>
           </div>
        </div>

        <div className="bg-card rounded-xl p-6 border border-border shadow-sm relative group">
           <div className="flex items-start justify-between">
              <div>
                 <p className="text-sm font-medium text-muted-foreground mb-1">Linked Account</p>
                 <div className="mt-1">
                    <p className="font-medium text-foreground truncate max-w-[120px]">
                        {currentBank?.accountHolderName || 'N/A'}
                    </p>
                    <p className="text-sm text-muted-foreground font-mono">
                      {currentBank?.accountNumber ? `••••${currentBank.accountNumber.slice(-4)}` : 'No Account'}
                    </p>
                 </div>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                 <Building2 className="w-6 h-6 text-blue-500" />
              </div>
           </div>
           
           <button 
                onClick={() => {
                    if (currentBank) setBankForm(currentBank);
                    setIsBankDialogOpen(true);
                }}
                className="absolute top-2 right-2 p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                title="Edit Bank Details"
           >
               <Edit2 className="w-4 h-4" />
           </button>
        </div>
      </div>

      {/* Recent Payouts Table */}
      <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
           <h3 className="font-semibold text-lg">Recent Payouts</h3>
           {/* <button className="text-sm text-primary hover:underline">View All</button> */}
        </div>
        
        {loading ? (
             <div className="p-8 text-center text-muted-foreground">Loading...</div>
        ) : wallet.recentPayouts.length === 0 ? (
             <div className="p-12 text-center">
                 <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
                    <Target className="w-6 h-6 text-muted-foreground" />
                 </div>
                 <h4 className="text-lg font-medium">No payouts yet</h4>
                 <p className="text-muted-foreground mt-1">Your payout history will appear here once you make a withdrawal.</p>
             </div>
        ) : (
           <table className="w-full">
             <thead className="bg-muted/50 border-b border-border">
               <tr>
                 <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Date</th>
                 <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Amount</th>
                 <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                 <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Transaction ID</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-border">
               {wallet.recentPayouts.map((payout) => (
                 <tr key={payout._id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 text-sm text-muted-foreground">{formatDate(payout.requestedAt)}</td>
                    <td className="px-6 py-4 text-sm font-medium text-foreground">{formatCurrency(payout.amount)}</td>
                    <td className="px-6 py-4">{getStatusBadge(payout.status)}</td>
                    <td className="px-6 py-4 text-sm font-mono text-muted-foreground">{payout.transactionId || '-'}</td>
                 </tr>
               ))}
             </tbody>
           </table>
        )}
      </div>

      {/* Request Payout Dialog */}
      <Dialog open={isRequestDialogOpen} onOpenChange={setIsRequestDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request Payout</DialogTitle>
            <DialogDescription>
               Withdraw funds from your wallet to your linked bank account.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="bg-muted rounded-lg p-4 flex justify-between items-center">
               <span className="text-sm font-medium">Available Balance</span>
               <span className="text-lg font-bold">{formatCurrency(wallet.balance)}</span>
            </div>
            
            <div className="space-y-2">
               <label className="text-sm font-medium">Amount to Withdraw</label>
               <input 
                  type="number" 
                  value={requestAmount}
                  onChange={(e) => setRequestAmount(e.target.value)}
                  placeholder="Enter amount" 
                  className="input-field"
               />
               <p className="text-xs text-muted-foreground">Min withdrawal: ₹10,000.00</p>
            </div>
          </div>

          <DialogFooter>
             <button 
               className="btn-secondary" 
               onClick={() => setIsRequestDialogOpen(false)}
             >
               Cancel
             </button>
             <button 
               className="btn-primary"
               onClick={handleRequestPayout}
               disabled={requesting}
             >
               {requesting ? 'Processing...' : 'Confirm Withdrawal'}
             </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Update Bank Details Dialog */}
      <Dialog open={isBankDialogOpen} onOpenChange={setIsBankDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Bank Details</DialogTitle>
            <DialogDescription>
               Update the bank account for receiving payouts.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
             <div className="space-y-2">
                 <label className="text-sm font-medium">Account Holder Name</label>
                 <input 
                    type="text" 
                    value={bankForm.accountHolderName}
                    onChange={(e) => setBankForm({...bankForm, accountHolderName: e.target.value})}
                    placeholder="E.g. John Doe" 
                    className="input-field"
                 />
             </div>
             <div className="space-y-2">
                 <label className="text-sm font-medium">Account Number</label>
                 <input 
                    type="text" 
                    value={bankForm.accountNumber}
                    onChange={(e) => setBankForm({...bankForm, accountNumber: e.target.value})}
                    placeholder="Enter Account Number" 
                    className="input-field"
                 />
             </div>
             <div className="space-y-2">
                 <label className="text-sm font-medium">IFSC Code</label>
                 <input 
                    type="text" 
                    value={bankForm.ifscCode}
                    onChange={(e) => setBankForm({...bankForm, ifscCode: e.target.value})}
                    placeholder="Enter IFSC Code" 
                    className="input-field"
                 />
             </div>
          </div>

          <DialogFooter>
             <button 
               className="btn-secondary" 
               onClick={() => setIsBankDialogOpen(false)}
             >
               Cancel
             </button>
             <button 
               className="btn-primary"
               onClick={handleUpdateBank}
               disabled={updatingBank}
             >
               {updatingBank ? 'Updating...' : 'Save Changes'}
             </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
};

export default Payouts;
