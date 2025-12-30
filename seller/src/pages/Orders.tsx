import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  MoreHorizontal, 
  Eye, 
  Truck,
  Package,
  Download,
  ShoppingCart
} from 'lucide-react';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { EmptyState } from '@/components/ui/EmptyState';
import { mockOrders } from '@/services/mockData';
import { Order } from '@/types';
import { format } from 'date-fns';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const Orders: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [orders] = useState<Order[]>(mockOrders);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      new: 'bg-info',
      confirmed: 'bg-info',
      packed: 'bg-warning',
      shipped: 'bg-primary',
      delivered: 'bg-success',
      cancelled: 'bg-destructive',
      returned: 'bg-destructive',
    };
    return colors[status] || 'bg-muted';
  };

  const orderStatuses = ['new', 'confirmed', 'packed', 'shipped', 'delivered'];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="page-header mb-0">
          <h1 className="page-title">Orders</h1>
          <p className="page-description">
            Track and manage customer orders
          </p>
        </div>
        <button className="btn-secondary self-start">
          <Download className="w-4 h-4" />
          Export Orders
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-card rounded-xl border border-border p-4">
          <p className="text-sm text-muted-foreground">New</p>
          <p className="text-2xl font-bold text-foreground">
            {orders.filter(o => o.status === 'new').length}
          </p>
        </div>
        <div className="bg-card rounded-xl border border-border p-4">
          <p className="text-sm text-muted-foreground">Packed</p>
          <p className="text-2xl font-bold text-foreground">
            {orders.filter(o => o.status === 'packed').length}
          </p>
        </div>
        <div className="bg-card rounded-xl border border-border p-4">
          <p className="text-sm text-muted-foreground">Shipped</p>
          <p className="text-2xl font-bold text-foreground">
            {orders.filter(o => o.status === 'shipped').length}
          </p>
        </div>
        <div className="bg-card rounded-xl border border-border p-4">
          <p className="text-sm text-muted-foreground">Delivered</p>
          <p className="text-2xl font-bold text-foreground">
            {orders.filter(o => o.status === 'delivered').length}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by order number or customer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field pl-10"
          />
        </div>
        <div className="flex items-center gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input-field w-auto"
          >
            <option value="all">All Status</option>
            <option value="new">New</option>
            <option value="packed">Packed</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
            <option value="returned">Returned</option>
          </select>
          <button className="btn-secondary">
            <Filter className="w-4 h-4" />
            <span className="hidden sm:inline">More Filters</span>
          </button>
        </div>
      </div>

      {/* Orders Table */}
      {filteredOrders.length === 0 ? (
        <EmptyState
          icon={ShoppingCart}
          title="No orders found"
          description="Try adjusting your search or filters. Orders will appear here once customers place them."
        />
      ) : (
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Payment</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th className="w-12"></th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id}>
                    <td className="font-medium text-foreground">
                      {order.orderNumber}
                    </td>
                    <td>
                      <div>
                        <p className="font-medium text-foreground">{order.customerName}</p>
                        <p className="text-xs text-muted-foreground">{order.customerEmail}</p>
                      </div>
                    </td>
                    <td className="text-muted-foreground">
                      {order.items.length} item{order.items.length > 1 ? 's' : ''}
                    </td>
                    <td className="font-medium text-foreground">
                      {formatCurrency(order.total)}
                    </td>
                    <td>
                      <StatusBadge status={order.paymentStatus} />
                    </td>
                    <td>
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="text-muted-foreground">
                      {format(new Date(order.createdAt), 'MMM d, yyyy')}
                    </td>
                    <td>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="p-2 rounded-lg hover:bg-muted transition-colors">
                            <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem 
                            className="gap-2"
                            onClick={() => setSelectedOrder(order)}
                          >
                            <Eye className="w-4 h-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2">
                            <Package className="w-4 h-4" />
                            Update Status
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2">
                            <Truck className="w-4 h-4" />
                            Add Tracking
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="gap-2">
                            <Download className="w-4 h-4" />
                            Download Invoice
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          <div className="flex items-center justify-between px-4 py-3 border-t border-border">
            <p className="text-sm text-muted-foreground">
              Showing <span className="font-medium text-foreground">1</span> to{' '}
              <span className="font-medium text-foreground">{filteredOrders.length}</span> of{' '}
              <span className="font-medium text-foreground">{filteredOrders.length}</span> orders
            </p>
            <div className="flex items-center gap-2">
              <button className="btn-secondary" disabled>Previous</button>
              <button className="btn-secondary" disabled>Next</button>
            </div>
          </div>
        </div>
      )}

      {/* Order Details Modal */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Order Details - {selectedOrder?.orderNumber}</DialogTitle>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="space-y-6">
              {/* Order Status Timeline */}
              <div className="flex items-center justify-between overflow-x-auto pb-2">
                {orderStatuses.map((status, index) => {
                  const currentIndex = orderStatuses.indexOf(selectedOrder.status);
                  const isCompleted = index <= currentIndex;
                  const isCurrent = status === selectedOrder.status;
                  
                  return (
                    <div key={status} className="flex items-center">
                      <div className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                          isCompleted 
                            ? 'bg-success text-success-foreground' 
                            : 'bg-muted text-muted-foreground'
                        } ${isCurrent ? 'ring-2 ring-success ring-offset-2' : ''}`}>
                          {index + 1}
                        </div>
                        <span className="text-xs mt-1 capitalize">{status}</span>
                      </div>
                      {index < orderStatuses.length - 1 && (
                        <div className={`w-12 h-0.5 mx-2 ${
                          isCompleted ? 'bg-success' : 'bg-muted'
                        }`} />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Customer & Shipping */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-medium text-foreground mb-2">Customer</h4>
                  <p className="text-sm text-foreground">{selectedOrder.customerName}</p>
                  <p className="text-sm text-muted-foreground">{selectedOrder.customerEmail}</p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-medium text-foreground mb-2">Shipping Address</h4>
                  <p className="text-sm text-foreground">{selectedOrder.shippingAddress.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedOrder.shippingAddress.addressLine1}
                    {selectedOrder.shippingAddress.addressLine2 && `, ${selectedOrder.shippingAddress.addressLine2}`}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.pincode}
                  </p>
                </div>
              </div>

              {/* Items */}
              <div>
                <h4 className="font-medium text-foreground mb-3">Order Items</h4>
                <div className="space-y-3">
                  {selectedOrder.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                      <img 
                        src={item.productImage} 
                        alt={item.productName}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{item.productName}</p>
                        <p className="text-sm text-muted-foreground">
                          Qty: {item.quantity} × {formatCurrency(item.price)}
                        </p>
                      </div>
                      <p className="font-medium text-foreground">{formatCurrency(item.total)}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Summary */}
              <div className="border-t border-border pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="text-foreground">{formatCurrency(selectedOrder.subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="text-foreground">{formatCurrency(selectedOrder.shippingCharge)}</span>
                </div>
                {selectedOrder.discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Discount</span>
                    <span className="text-success">-{formatCurrency(selectedOrder.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax</span>
                  <span className="text-foreground">{formatCurrency(selectedOrder.tax)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t border-border">
                  <span className="text-foreground">Total</span>
                  <span className="text-foreground">{formatCurrency(selectedOrder.total)}</span>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Orders;
