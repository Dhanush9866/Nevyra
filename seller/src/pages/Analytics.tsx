import React, { useState } from 'react';
import { 
  TrendingUp, 
  ShoppingCart, 
  DollarSign, 
  Eye,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { KPICard } from '@/components/ui/KPICard';
import { mockSalesData, mockCategoryRevenue, mockProductPerformance } from '@/services/mockData';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend
} from 'recharts';
import { format } from 'date-fns';

const Analytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState('7d');

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  const totalRevenue = mockSalesData.reduce((sum, d) => sum + d.revenue, 0);
  const totalOrders = mockSalesData.reduce((sum, d) => sum + d.orders, 0);
  const avgOrderValue = totalRevenue / totalOrders;
  const conversionRate = 4.8; // Mock conversion rate

  const COLORS = ['hsl(234 89% 54%)', 'hsl(160 84% 39%)', 'hsl(38 92% 50%)', 'hsl(173 80% 40%)'];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="page-header mb-0">
          <h1 className="page-title">Analytics</h1>
          <p className="page-description">
            Track your store performance and insights
          </p>
        </div>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="input-field w-auto"
        >
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
          <option value="1y">Last year</option>
        </select>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Total Revenue"
          value={formatCurrency(totalRevenue)}
          change={12.5}
          changeLabel="vs last period"
          icon={DollarSign}
          variant="success"
        />
        <KPICard
          title="Total Orders"
          value={totalOrders}
          change={8.3}
          changeLabel="vs last period"
          icon={ShoppingCart}
          variant="primary"
        />
        <KPICard
          title="Avg. Order Value"
          value={formatCurrency(avgOrderValue)}
          change={3.2}
          changeLabel="vs last period"
          icon={TrendingUp}
          variant="default"
        />
        <KPICard
          title="Conversion Rate"
          value={`${conversionRate}%`}
          change={-0.5}
          changeLabel="vs last period"
          icon={Eye}
          variant="warning"
        />
      </div>

      {/* Revenue & Orders Chart */}
      <div className="bg-card rounded-xl border border-border p-6">
        <h3 className="card-title mb-6">Revenue & Orders Trend</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={mockSalesData}>
              <defs>
                <linearGradient id="colorRevenueAnalytics" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(234 89% 54%)" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(234 89% 54%)" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorOrdersAnalytics" x1="0" y1="0" x2="0" y2="1">
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
                yAxisId="left"
                tickFormatter={(value) => `$${value}`}
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <YAxis 
                yAxisId="right"
                orientation="right"
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
                labelFormatter={(label) => format(new Date(label), 'MMMM d, yyyy')}
              />
              <Legend />
              <Area 
                yAxisId="left"
                type="monotone" 
                dataKey="revenue" 
                name="Revenue"
                stroke="hsl(234 89% 54%)" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorRevenueAnalytics)" 
              />
              <Area 
                yAxisId="right"
                type="monotone" 
                dataKey="orders" 
                name="Orders"
                stroke="hsl(160 84% 39%)" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorOrdersAnalytics)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category Revenue & Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Revenue */}
        <div className="bg-card rounded-xl border border-border p-6">
          <h3 className="card-title mb-6">Revenue by Category</h3>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={mockCategoryRevenue}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="revenue"
                  nameKey="category"
                >
                  {mockCategoryRevenue.map((entry, index) => (
                    <Cell key={entry.category} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                  formatter={(value: number) => formatCurrency(value)}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-3 mt-4">
            {mockCategoryRevenue.map((cat, index) => (
              <div key={cat.category} className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="text-sm text-muted-foreground">{cat.category}</span>
                <span className="text-sm font-medium text-foreground ml-auto">{cat.percentage}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-card rounded-xl border border-border p-6">
          <h3 className="card-title mb-6">Product Performance</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={mockProductPerformance}
                layout="vertical"
              >
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  type="number"
                  tickFormatter={(value) => `$${value / 1000}k`}
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis 
                  type="category"
                  dataKey="name"
                  width={120}
                  tick={{ fontSize: 11 }}
                  stroke="hsl(var(--muted-foreground))"
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                  formatter={(value: number) => formatCurrency(value)}
                />
                <Bar 
                  dataKey="revenue" 
                  fill="hsl(234 89% 54%)" 
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Product Performance Table */}
      <div className="bg-card rounded-xl border border-border">
        <div className="p-6 border-b border-border">
          <h3 className="card-title">Detailed Product Performance</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Units Sold</th>
                <th>Revenue</th>
                <th>Page Views</th>
                <th>Conversion Rate</th>
                <th>Trend</th>
              </tr>
            </thead>
            <tbody>
              {mockProductPerformance.map((product) => (
                <tr key={product.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                      <span className="font-medium text-foreground line-clamp-1">
                        {product.name}
                      </span>
                    </div>
                  </td>
                  <td className="font-medium text-foreground">{product.sold}</td>
                  <td className="font-medium text-success">{formatCurrency(product.revenue)}</td>
                  <td className="text-muted-foreground">{product.views.toLocaleString()}</td>
                  <td className="font-medium text-foreground">{product.conversionRate}%</td>
                  <td>
                    <div className="flex items-center gap-1 text-success">
                      <ArrowUpRight className="w-4 h-4" />
                      <span className="text-sm">12%</span>
                    </div>
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

export default Analytics;
