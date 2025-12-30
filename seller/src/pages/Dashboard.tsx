import React from 'react';
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
import { Link } from 'react-router-dom';
import { KPICard } from '@/components/ui/KPICard';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { 
  mockDashboardStats, 
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

const Dashboard: React.FC = () => {
  const stats = mockDashboardStats;
  const recentOrders = mockOrders.slice(0, 5);
  const lowStockItems = mockInventory.filter(item => item.stock <= item.lowStockThreshold);
  const topProducts = mockProductPerformance.slice(0, 5);

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
        <h1 className="page-title">Dashboard</h1>
        <p className="page-description">
          Welcome back! Here's an overview of your store performance.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <KPICard
          title="Total Sales"
          value={formatCurrency(stats.totalSales)}
          change={stats.salesGrowth}
          changeLabel="vs last month"
          icon={DollarSign}
          variant="success"
        />
        <KPICard
          title="Total Orders"
          value={stats.totalOrders}
          change={stats.ordersGrowth}
          changeLabel="vs last month"
          icon={ShoppingCart}
          variant="primary"
        />
        <KPICard
          title="Total Products"
          value={stats.totalProducts}
          icon={Package}
          variant="default"
        />
        <KPICard
          title="Pending Orders"
          value={stats.pendingOrders}
          icon={Clock}
          variant="warning"
        />
        <KPICard
          title="Returns"
          value={stats.returnedOrders}
          icon={RotateCcw}
          variant="destructive"
        />
        <KPICard
          title="Wallet Balance"
          value={formatCurrency(stats.walletBalance)}
          icon={Wallet}
          variant="success"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Chart */}
        <div className="bg-card rounded-xl border border-border p-6">
          <div className="card-header">
            <h3 className="card-title">Sales Overview</h3>
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
                  tickFormatter={(value) => `$${value}`}
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
        <div className="bg-card rounded-xl border border-border p-6">
          <div className="card-header">
            <h3 className="card-title">Daily Orders</h3>
            <select className="text-sm border border-input rounded-lg px-3 py-1.5 bg-background">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
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
        <div className="bg-card rounded-xl border border-border">
          <div className="p-6 border-b border-border flex items-center justify-between">
            <h3 className="card-title">Recent Orders</h3>
            <Link 
              to="/orders" 
              className="text-sm text-primary hover:underline flex items-center gap-1"
            >
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Customer</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td className="font-medium text-foreground">
                      {order.orderNumber}
                    </td>
                    <td className="text-muted-foreground">
                      {order.customerName}
                    </td>
                    <td className="font-medium text-foreground">
                      {formatCurrency(order.total)}
                    </td>
                    <td>
                      <StatusBadge status={order.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-card rounded-xl border border-border">
          <div className="p-6 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-warning" />
              <h3 className="card-title">Low Stock Alerts</h3>
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
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>SKU</th>
                    <th>Stock</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {lowStockItems.map((item) => (
                    <tr key={item.id}>
                      <td>
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
                      <td className="text-muted-foreground">{item.sku}</td>
                      <td className="font-medium text-foreground">{item.stock}</td>
                      <td>
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

      {/* Top Selling Products */}
      <div className="bg-card rounded-xl border border-border">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-success" />
            <h3 className="card-title">Top Selling Products</h3>
          </div>
          <Link 
            to="/analytics" 
            className="text-sm text-primary hover:underline flex items-center gap-1"
          >
            View analytics <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Units Sold</th>
                <th>Revenue</th>
                <th>Views</th>
                <th>Conversion</th>
              </tr>
            </thead>
            <tbody>
              {topProducts.map((product) => (
                <tr key={product.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                      <span className="font-medium text-foreground">
                        {product.name}
                      </span>
                    </div>
                  </td>
                  <td className="font-medium text-foreground">{product.sold}</td>
                  <td className="font-medium text-success">
                    {formatCurrency(product.revenue)}
                  </td>
                  <td className="text-muted-foreground">
                    {product.views.toLocaleString()}
                  </td>
                  <td>
                    <span className="font-medium text-foreground">
                      {product.conversionRate.toFixed(2)}%
                    </span>
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

export default Dashboard;
