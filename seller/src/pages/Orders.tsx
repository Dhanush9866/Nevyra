import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  MoreHorizontal, 
  Eye, 
  Clock,
  Package,
  CheckCircle,
  Truck,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { StatusBadge } from '@/components/ui/StatusBadge'; 
import { EmptyState } from '@/components/ui/EmptyState';
import { sellerAPI } from '@/lib/api';
import { toast } from 'sonner';
import { Order, OrderItem } from '@/types'; // Using existing types
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Orders: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await sellerAPI.orders.list();
      if (response.data.success) {
        // Map backend response to Frontend Order Type
        const mappedOrders: Order[] = response.data.data.map((order: any) => {
          // Calculate subtotal for THIS seller's items
          const sellerItems = order.items || [];
          const subtotal = sellerItems.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
          
          return {
            id: order._id,
            orderNumber: order._id.substring(0, 8).toUpperCase(), // Using ID as mock order number
            customerId: order.userId?._id || 'guest',
            customerName: order.userId ? `${order.userId.firstName} ${order.userId.lastName}` : 'Guest User',
            customerEmail: order.userId?.email || '',
            items: sellerItems.map((item: any) => ({
              id: item._id,
              productId: item.productId._id,
              productName: item.productId.title,
              productImage: item.productId.images?.[0] || 'https://placehold.co/100?text=No+Image',
              quantity: item.quantity,
              price: item.price,
              total: item.price * item.quantity
            })),
            subtotal: subtotal,
            shippingCharge: 0, // Not tracked per seller yet
            discount: 0,
            tax: 0,
            total: subtotal, // Showing only seller's share
            status: order.status || 'Pending',
            shippingAddress: { // Default empty or map if backend provides
              addressLine1: order.userId?.addresses?.[0]?.street || 'N/A', 
              city: order.userId?.addresses?.[0]?.city || '', 
              state: '', 
              pincode: '', 
              country: '',
              name: '',
              phone: ''
            },
            billingAddress: { addressLine1: '', city: '', state: '', pincode: '', country: '', name: '', phone: '' },
            paymentMethod: order.paymentMethod,
            paymentStatus: order.paymentStatus,
            createdAt: order.createdAt,
            updatedAt: order.createdAt
          };
        });
        setOrders(mappedOrders);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      await sellerAPI.orders.updateStatus(orderId, newStatus);
      toast.success(`Order status updated to ${newStatus}`);
      fetchOrders(); // Refresh list
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update order status');
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status: string) => {
    switch(status.toLowerCase()) {
      case 'delivered': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'shipped': return <Truck className="w-4 h-4 text-blue-500" />;
      case 'cancelled': return <XCircle className="w-4 h-4 text-red-500" />;
      case 'pending': return <Clock className="w-4 h-4 text-orange-500" />;
      default: return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header mb-0">
        <h1 className="page-title">Orders</h1>
        <p className="page-description">Manage and track your customer orders</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by order ID or customer name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field pl-10"
          />
        </div>
        <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input-field w-auto"
          >
            <option value="all">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Processing">Processing</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      {/* Orders Table */}
      {loading ? (
        <div className="flex justify-center py-8">Loading orders...</div>
      ) : filteredOrders.length === 0 ? (
        <EmptyState
          icon={Package}
          title="No orders found"
          description="When customers place orders, they will appear here."
        />
      ) : (
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                   <th>Order ID</th>
                   <th>Date</th>
                   <th>Customer</th>
                   <th>Items</th>
                   <th>Total</th>
                   <th>Status</th>
                   <th className="w-12"></th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id}>
                    <td className="font-medium text-foreground">#{order.orderNumber}</td>
                    <td className="text-muted-foreground">{formatDate(order.createdAt)}</td>
                    <td>
                      <div className="flex flex-col">
                        <span className="font-medium text-foreground">{order.customerName}</span>
                        {/* <span className="text-xs text-muted-foreground">{order.customerEmail}</span> */}
                      </div>
                    </td>
                    <td>
                      <div className="flex flex-col gap-1">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-sm">
                             <img src={item.productImage} alt="" className="w-6 h-6 rounded object-cover" />
                             <span className="text-foreground">{item.quantity}x {item.productName}</span>
                          </div>
                        ))}
                        {order.items.length > 2 && (
                          <span className="text-xs text-muted-foreground">+{order.items.length - 2} more</span>
                        )}
                      </div>
                    </td>
                    <td className="font-medium text-foreground">
                       {formatCurrency(order.total)}
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(order.status)}
                        <span className="capitalize">{order.status}</span>
                      </div>
                    </td>
                    <td>
                       <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="p-2 rounded-lg hover:bg-muted transition-colors">
                            <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem className="gap-2" onClick={() => handleUpdateStatus(order.id, 'Processing')}>
                             Mark Processing
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2" onClick={() => handleUpdateStatus(order.id, 'Shipped')}>
                             Mark Shipped
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2" onClick={() => handleUpdateStatus(order.id, 'Delivered')}>
                             Mark Delivered
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2 text-red-600" onClick={() => handleUpdateStatus(order.id, 'Cancelled')}>
                             Cancel Order
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
