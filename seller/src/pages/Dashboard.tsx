
import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  ShoppingCart, 
  Package, 
  Clock, 
  RotateCcw, 
  Wallet,
  AlertTriangle,
  TrendingUp,
  ArrowRight
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { KPICard } from '@/components/ui/KPICard';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { 
  mockSalesData, 
  mockOrders, 
  mockInventory,
  mockProductPerformance 
} from '@/services/mockData';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import { format } from 'date-fns';
import { sellerAPI } from '@/lib/api';
import { toast } from 'sonner';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    totalProducts: 0,
    pendingOrders: 0,
    walletBalance: 0
  });
  const [loading, setLoading] = useState(true);

  // Mocks for charts/tables until real APIs exist
  const recentOrders = mockOrders.slice(0, 5);
  const lowStockItems = mockInventory.filter(item => item.stock <= item.lowStockThreshold);
  const topProducts = mockProductPerformance.slice(0, 5);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
        const res = await sellerAPI.dashboard.stats();
        if (res.data.success) {
            setStats(res.data.data);
        }
    } catch (error) {
        console.error("Failed to fetch dashboard stats", error);
        // toast.error("Failed to load dashboard stats"); // Optional, maybe silent fail
    } finally {
        setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(value);
  };

  return (
    <div className="space-y-6 animate-fade-in p-6">
      {/* Page Header */}
      <div className="page-header">
        <h1 className="page-title text-2xl font-bold">Dashboard</h1>
        <p className="page-description text-muted-foreground">
          Welcome back! Here's an overview of your store performance.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        <div onClick={() => navigate('/orders')} className="cursor-pointer hover:opacity-90 transition-opacity">
            <KPICard
            title="Total Sales"
            value={formatCurrency(stats.totalSales)}
            // change={12.5}
            // changeLabel="vs last month"
            icon={DollarSign}
            variant="success"
            />
        </div>

        <div onClick={() => navigate('/orders')} className="cursor-pointer hover:opacity-90 transition-opacity">
            <KPICard
            title="Total Orders"
            value={stats.totalOrders}
            // change={8.2}
            // changeLabel="vs last month"
            icon={ShoppingCart}
            variant="primary"
            />
        </div>

        <div onClick={() => navigate('/products')} className="cursor-pointer hover:opacity-90 transition-opacity">
            <KPICard
            title="Total Products"
            value={stats.totalProducts}
            icon={Package}
            variant="default"
            />
        </div>

        <div onClick={() => navigate('/orders')} className="cursor-pointer hover:opacity-90 transition-opacity">
            <KPICard
            title="Pending Orders"
            value={stats.pendingOrders}
            icon={Clock}
            variant="warning"
            />
        </div>

        <div onClick={() => navigate('/payouts')} className="cursor-pointer hover:opacity-90 transition-opacity">
            <KPICard
            title="Wallet Balance"
            value={formatCurrency(stats.walletBalance)}
            icon={Wallet}
            variant="success"
            />
        </div>
      </div>

      {/* Charts Row - Using Mocks for Layout Consistency */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Chart */}
        <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg">Sales Overview</h3>
            <select className="text-sm border border-input rounded-lg px-3 py-1.5 bg-background">
              <option>Last 7 days</option>
              {/* <option>Last 30 days</option> */}
            </select>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockSalesData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(234 89% 54%)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(234 89% 54%)" stopOpacity={0}/>
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
                  formatter={(value: number) => [formatCurrency(value), 'Revenue']}
                  labelFormatter={(label) => format(new Date(label), 'MMMM d, yyyy')}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="hsl(234 89% 54%)" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorRevenue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Orders Chart */}
        <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg">Daily Orders</h3>
            <select className="text-sm border border-input rounded-lg px-3 py-1.5 bg-background">
              <option>Last 7 days</option>
            </select>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockSalesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(value) => format(new Date(value), 'MMM d')}
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis 
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
                <Bar 
                  dataKey="orders" 
                  fill="hsl(160 84% 39%)" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Tables Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-card rounded-xl border border-border shadow-sm">
          <div className="p-6 border-b border-border flex items-center justify-between">
            <h3 className="font-semibold text-lg">Recent Orders</h3>
            <Link 
              to="/orders" 
              className="text-sm text-primary hover:underline flex items-center gap-1"
            >
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/50 border-b border-border text-muted-foreground font-medium">
                <tr>
                  <th className="px-4 py-3">Order</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-muted/30">
                    <td className="px-4 py-3 font-medium text-foreground">
                      {order.orderNumber}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {order.customerName}
                    </td>
                    <td className="px-4 py-3 font-medium text-foreground">
                      {formatCurrency(order.total)}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={order.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-card rounded-xl border border-border shadow-sm">
          <div className="p-6 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-warning" />
              <h3 className="font-semibold text-lg">Low Stock Alerts</h3>
            </div>
            <Link 
              to="/inventory" 
              className="text-sm text-primary hover:underline flex items-center gap-1"
            >
              Manage <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          {lowStockItems.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-muted-foreground">All products are well stocked!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted/50 border-b border-border text-muted-foreground font-medium">
                  <tr>
                    <th className="px-4 py-3">Product</th>
                    <th className="px-4 py-3">SKU</th>
                    <th className="px-4 py-3">Stock</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {lowStockItems.map((item) => (
                    <tr key={item.id} className="hover:bg-muted/30">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <img 
                            src={item.productImage} 
                            alt={item.productName}
                            className="w-10 h-10 rounded-lg object-cover"
                          />
                          <span className="font-medium text-foreground truncate max-w-[150px]">
                            {item.productName}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{item.sku}</td>
                      <td className="px-4 py-3 font-medium text-foreground">{item.stock}</td>
                      <td className="px-4 py-3">
                        <StatusBadge 
                          status={item.stock === 0 ? 'Out of Stock' : 'Low Stock'} 
                          variant={item.stock === 0 ? 'destructive' : 'warning'}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
