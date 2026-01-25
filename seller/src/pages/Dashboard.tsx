
import React, { useState, useEffect } from 'react';
import {
  DollarSign,
  ShoppingCart,
  Package,
  Clock,
  Wallet,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { KPICard } from '@/components/ui/KPICard';
import { StatusBadge } from '@/components/ui/StatusBadge';
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
import { mockSalesData } from '@/services/mockData'; // Keeping for charts
import { Loader2 } from 'lucide-react';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    totalProducts: 0,
    pendingOrders: 0,
    walletBalance: 0
  });

  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [lowStockItems, setLowStockItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      // 1. Dashboard Stats
      const statsRes = await sellerAPI.dashboard.stats();
      if (statsRes.data.success) {
        setStats(statsRes.data.data);
      }

      // 2. Recent Orders
      const ordersRes = await sellerAPI.orders.list();
      if (ordersRes.data.success) {
        // Sort by date desc and take 5
        const orders = ordersRes.data.data || [];
        // Backend should theoretically sort, but let's ensure
        const sorted = orders.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setRecentOrders(sorted.slice(0, 5));
      }

      // 3. Low Stock Items (Fetch all products and filter)
      const productsRes = await sellerAPI.products.list();
      if (productsRes.data.success) {
        const products = productsRes.data.data || [];
        const lowStock = products.filter((p: any) => p.stockQuantity <= (p.lowStockThreshold || 5));
        setLowStockItems(lowStock.slice(0, 5)); // Show max 5
      }

    } catch (error) {
      console.error("Failed to fetch dashboard data", error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  };

  const getCustomerName = (order: any) => {
    if (order.userId) {
      return `${order.userId.firstName} ${order.userId.lastName}`;
    }
    // Fallback if userId is populated, or check shipping address
    if (order.shippingAddress) {
      return `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`;
    }
    return 'Guest';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

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
            icon={DollarSign}
            variant="success"
          />
        </div>

        <div onClick={() => navigate('/orders')} className="cursor-pointer hover:opacity-90 transition-opacity">
          <KPICard
            title="Total Orders"
            value={stats.totalOrders}
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
            </select>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockSalesData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(234 89% 54%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(234 89% 54%)" stopOpacity={0} />
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
                {recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">
                      No recent orders.
                    </td>
                  </tr>
                ) : (
                  recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-muted/30">
                      <td className="px-4 py-3 font-medium text-foreground">
                        {order.orderNumber || order.id.slice(-6).toUpperCase()}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {getCustomerName(order)}
                      </td>
                      <td className="px-4 py-3 font-medium text-foreground">
                        {formatCurrency(order.totalAmount || 0)}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={order.status} />
                      </td>
                    </tr>
                  ))
                )}
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
            <div className="p-12 text-center items-center justify-center flex flex-col">
              <Package className="w-10 h-10 text-muted-foreground/30 mb-2" />
              <p className="text-muted-foreground">All products are well stocked!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted/50 border-b border-border text-muted-foreground font-medium">
                  <tr>
                    <th className="px-4 py-3">Product</th>
                    {/* <th className="px-4 py-3">SKU</th> */}
                    <th className="px-4 py-3">Stock</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {lowStockItems.map((item) => (
                    <tr key={item.id} className="hover:bg-muted/30">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {item.images && item.images[0] && (
                            <img
                              src={item.images[0]}
                              alt={item.title}
                              className="w-8 h-8 rounded object-cover"
                            />
                          )}
                          <span className="font-medium text-foreground truncate max-w-[150px]">
                            {item.title}
                          </span>
                        </div>
                      </td>
                      {/* <td className="px-4 py-3 text-muted-foreground">{item.sku || '-'}</td> */}
                      <td className="px-4 py-3 font-medium text-foreground">{item.stockQuantity}</td>
                      <td className="px-4 py-3">
                        <StatusBadge
                          status={item.stockQuantity === 0 ? 'Out of Stock' : 'Low Stock'}
                          variant={item.stockQuantity === 0 ? 'destructive' : 'warning'}
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
