import React from 'react';
import { 
  CreditCard, 
  Calendar,
  CheckCircle,
  Clock,
  Download,
  Building
} from 'lucide-react';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { mockPayouts, mockSeller } from '@/services/mockData';
import { format } from 'date-fns';

const Payouts: React.FC = () => {
  const pendingAmount = mockPayouts
    .filter(p => p.status === 'pending')
    .reduce((sum, p) => sum + p.amount, 0);
  const completedAmount = mockPayouts
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="page-header">
        <h1 className="page-title">Payouts</h1>
        <p className="page-description">
          View your payout history and upcoming payments
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-lg bg-warning/10">
              <Clock className="w-5 h-5 text-warning" />
            </div>
            <span className="text-sm text-muted-foreground">Pending</span>
          </div>
          <p className="text-3xl font-bold text-warning">{formatCurrency(pendingAmount)}</p>
          <p className="text-sm text-muted-foreground mt-1">Scheduled for next payout</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-lg bg-success/10">
              <CheckCircle className="w-5 h-5 text-success" />
            </div>
            <span className="text-sm text-muted-foreground">Completed</span>
          </div>
          <p className="text-3xl font-bold text-success">{formatCurrency(completedAmount)}</p>
          <p className="text-sm text-muted-foreground mt-1">Total paid out</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-lg bg-primary/10">
              <Calendar className="w-5 h-5 text-primary" />
            </div>
            <span className="text-sm text-muted-foreground">Next Payout</span>
          </div>
          <p className="text-3xl font-bold text-foreground">Jan 1, 2025</p>
          <p className="text-sm text-muted-foreground mt-1">Every 1st & 15th</p>
        </div>
      </div>

      {/* Bank Account Info */}
      <div className="bg-card rounded-xl border border-border p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-muted">
              <Building className="w-5 h-5 text-foreground" />
            </div>
            <div>
              <h3 className="font-medium text-foreground">Bank Account</h3>
              <p className="text-sm text-muted-foreground">Where your payouts are sent</p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Bank Name</p>
            <p className="font-medium text-foreground mt-1">{mockSeller.bankName}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Account Number</p>
            <p className="font-medium text-foreground mt-1">{mockSeller.bankAccountNumber}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide">IFSC Code</p>
            <p className="font-medium text-foreground mt-1">{mockSeller.ifscCode}</p>
          </div>
        </div>
      </div>

      {/* Payout History */}
      <div className="bg-card rounded-xl border border-border">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h3 className="card-title">Payout History</h3>
          <button className="btn-secondary text-sm">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Payout ID</th>
                <th>Amount</th>
                <th>Payout Date</th>
                <th>Bank Account</th>
                <th>Reference</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {mockPayouts.map((payout) => (
                <tr key={payout.id}>
                  <td className="font-medium text-foreground font-mono text-sm">
                    {payout.id.toUpperCase()}
                  </td>
                  <td className="font-bold text-foreground">
                    {formatCurrency(payout.amount)}
                  </td>
                  <td className="text-muted-foreground">
                    {format(new Date(payout.payoutDate), 'MMM d, yyyy')}
                  </td>
                  <td className="text-muted-foreground font-mono">
                    {payout.bankAccount}
                  </td>
                  <td className="text-muted-foreground">
                    {payout.referenceNumber || '-'}
                  </td>
                  <td>
                    <StatusBadge status={payout.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Payouts;
