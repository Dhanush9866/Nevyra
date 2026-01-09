import React from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  Percent,
  Receipt,
  Download
} from 'lucide-react';
import { KPICard } from '@/components/ui/KPICard';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { mockEarnings, mockSalesData } from '@/services/mockData';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { format } from 'date-fns';

const Earnings: React.FC = () => {
  const totalGross = mockEarnings.reduce((sum, e) => sum + e.grossAmount, 0);
  const totalCommission = mockEarnings.reduce((sum, e) => sum + e.platformCommission, 0);
  const totalTax = mockEarnings.reduce((sum, e) => sum + e.taxDeduction, 0);
  const totalNet = mockEarnings.reduce((sum, e) => sum + e.netAmount, 0);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(value);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="page-header mb-0">
          <h1 className="page-title">Earnings</h1>
          <p className="page-description">
            Track your revenue and earnings breakdown
          </p>
        </div>
        <button className="btn-secondary self-start">
          <Download className="w-4 h-4" />
          Download Report
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Gross Earnings"
          value={formatCurrency(totalGross)}
          icon={DollarSign}
          variant="success"
        />
        <KPICard
          title="Platform Commission"
          value={formatCurrency(totalCommission)}
          icon={Percent}
          variant="warning"
        />
        <KPICard
          title="Tax Deductions"
          value={formatCurrency(totalTax)}
          icon={Receipt}
          variant="destructive"
        />
        <KPICard
          title="Net Earnings"
          value={formatCurrency(totalNet)}
          change={15.2}
          changeLabel="vs last month"
          icon={TrendingUp}
          variant="primary"
        />
      </div>

      {/* Earnings Chart */}
      <div className="bg-card rounded-xl border border-border p-6">
        <div className="card-header">
          <h3 className="card-title">Earnings Trend</h3>
          <select className="text-sm border border-input rounded-lg px-3 py-1.5 bg-background">
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>Last 90 days</option>
          </select>
        </div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={mockSalesData}>
              <defs>
                <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(160 84% 39%)" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(160 84% 39%)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="date" 
                tickFormatter={(value) => format(new Date(value), 'MMM d')}
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <YAxis 
                tickFormatter={(value) => `₹${value}`}
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
                formatter={(value: number) => [formatCurrency(value), 'Earnings']}
                labelFormatter={(label) => format(new Date(label), 'MMMM d, yyyy')}
              />
              <Area 
                type="monotone" 
                dataKey="revenue" 
                stroke="hsl(160 84% 39%)" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorEarnings)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Earnings Table */}
      <div className="bg-card rounded-xl border border-border">
        <div className="p-6 border-b border-border">
          <h3 className="card-title">Earnings Breakdown</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Gross Amount</th>
                <th>Commission (10%)</th>
                <th>Tax</th>
                <th>Net Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {mockEarnings.map((earning) => (
                <tr key={earning.id}>
                  <td className="font-medium text-foreground">
                    {earning.orderNumber}
                  </td>
                  <td className="text-foreground">
                    {formatCurrency(earning.grossAmount)}
                  </td>
                  <td className="text-warning">
                    -{formatCurrency(earning.platformCommission)}
                  </td>
                  <td className="text-muted-foreground">
                    -{formatCurrency(earning.taxDeduction)}
                  </td>
                  <td className="font-medium text-success">
                    {formatCurrency(earning.netAmount)}
                  </td>
                  <td>
                    <StatusBadge status={earning.status} />
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

export default Earnings;
