import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FloatingDock } from "@/components/FloatingDock";
import { Loader2, Eye, Edit } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { adminAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface Order {
  id: string;
  orderNumber: string;
  userId?: {
    firstName: string;
    lastName: string;
    email: string;
  };
  totalAmount: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  items?: Array<{
    productId: string;
    quantity: number;
    price: number;
  }>;
}

const statusColor = (status: string) => {
  switch (status) {
    case "Processing":
      return "bg-yellow-100 text-yellow-700";
    case "Shipped":
      return "bg-blue-100 text-blue-700";
    case "Delivered":
      return "bg-green-100 text-green-700";
    case "Cancelled":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string>('');
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Order | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Order | null>(null);
  const [updating, setUpdating] = useState(false);
  const [nextStatus, setNextStatus] = useState<string>("Processing");
  const { toast } = useToast();

  useEffect(() => {
    // Get token from localStorage
    const storedToken = localStorage.getItem('adminToken');
    if (storedToken) {
      setToken(storedToken);
      loadOrders(storedToken);
    } else {
      toast({
        title: "Authentication Required",
        description: "Please login to access orders",
        variant: "destructive",
      });
    }
  }, []);

  const loadOrders = async (authToken: string) => {
    try {
      setLoading(true);
      const response = await adminAPI.orders.getAll(authToken);
      if (response.success) {
        const normalized = (response.data || []).map((o: any) => ({
          id: o.id || o._id,
          orderNumber: o.orderNumber,
          userId: o.userId,
          totalAmount: o.totalAmount,
          status: o.status,
          createdAt: o.createdAt,
          updatedAt: o.updatedAt,
          items: o.items,
        }));
        setOrders(normalized);
      } else {
        throw new Error(response.message || 'Failed to load orders');
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to load orders",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const openEdit = (order: Order) => {
    setEditTarget(order);
    setNextStatus(order.status || "Processing");
    setEditOpen(true);
  };

  const updateOrderStatus = async () => {
    if (!editTarget) return;
    try {
      setUpdating(true);
      const response = await adminAPI.orders.updateStatus(editTarget.id, nextStatus, token);
      if (response.success) {
        toast({ title: "Success", description: "Order status updated" });
        setEditOpen(false);
        loadOrders(token);
      } else {
        throw new Error(response.message || 'Failed to update status');
      }
    } catch (error: any) {
      toast({ title: 'Error', description: error.message || 'Failed to update status', variant: 'destructive' });
    } finally {
      setUpdating(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getCustomerName = (order: Order) => {
    if (order.userId) {
      return `${order.userId.firstName} ${order.userId.lastName}`;
    }
    return 'Guest User';
  };

  if (loading) {
    return (
      <>
        <FloatingDock />
        <div className="min-h-screen bg-background py-8 sm:py-12 px-4 sm:px-6 md:px-12 pb-20 sm:pb-12">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin mr-2" />
              <span>Loading orders...</span>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <FloatingDock />
      <div className="min-h-screen bg-background py-8 sm:py-12 px-4 sm:px-6 md:px-12 pb-20 sm:pb-12">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 bg-gradient-primary bg-clip-text text-transparent">Orders</h1>
          <Card className="glass border-0 shadow-xl">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-border">
                  <thead className="bg-muted">
                    <tr>
                      <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Order ID</th>
                      <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Customer</th>
                      <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Date</th>
                      <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Total</th>
                      <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                      <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-card divide-y divide-border">
                    {orders.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                          No orders found.
                        </td>
                      </tr>
                    ) : (
                      orders.map((order) => (
                        <tr key={order.id} className="hover:bg-muted/50 transition-smooth">
                          <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-foreground">
                            {order.orderNumber || (order.id ? order.id.slice(-8) : '')}
                          </td>
                          <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-medium text-foreground">
                            {getCustomerName(order)}
                          </td>
                          <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-muted-foreground">
                            {order.createdAt ? formatDate(order.createdAt) : ''}
                          </td>
                          <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-foreground">
                            {formatCurrency(order.totalAmount || 0)}
                          </td>
                          <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm">
                            <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-semibold ${statusColor(order.status || 'Pending')}`}>
                              {order.status || 'Pending'}
                            </span>
                          </td>
                          <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm">
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="sm" onClick={() => { setSelected(order); setOpen(true); }}>
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => openEdit(order)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      {/* Order Details Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
          </DialogHeader>
          {!selected ? (
            <div className="py-8 text-center text-muted-foreground">No order selected</div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Order ID</p>
                  <p className="font-medium break-all">{selected.id}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Date</p>
                  <p className="font-medium">{selected.createdAt ? new Date(selected.createdAt).toLocaleString() : ''}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Customer</p>
                  <p className="font-medium">{getCustomerName(selected)}</p>
                  {selected.userId && (
                    <p className="text-xs text-muted-foreground">{selected.userId.email}</p>
                  )}
                </div>
                <div>
                  <p className="text-muted-foreground">Total</p>
                  <p className="font-medium">{formatCurrency(selected.totalAmount || 0)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Status</p>
                  <p className="font-medium">{selected.status || 'Pending'}</p>
                </div>
              </div>
              <Separator />
              <div>
                <p className="font-semibold mb-2">Items</p>
                <div className="space-y-2">
                  {(selected.items || []).map((it, idx) => (
                    <div key={idx} className="flex items-center justify-between text-sm">
                      <div className="flex-1">
                        <p className="font-medium">{(it as any).productId?.title || (it as any).productId}</p>
                        {(it as any).selectedFeatures && (
                          <div className="text-xs text-muted-foreground">
                            {Object.entries((it as any).selectedFeatures).map(([k,v]) => (
                              <span key={k} className="mr-2">{k}: {v as any}</span>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="w-28 text-right">Qty: {it.quantity}</div>
                      <div className="w-28 text-right">{formatCurrency(it.price)}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Order Status Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Order Status</DialogTitle>
          </DialogHeader>
          {!editTarget ? (
            <div className="py-8 text-center text-muted-foreground">No order selected</div>
          ) : (
            <div className="space-y-4">
              <div className="text-sm">
                <div className="text-muted-foreground">Order</div>
                <div className="font-medium">{editTarget.orderNumber || editTarget.id}</div>
              </div>
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Status</div>
                <Select value={nextStatus} onValueChange={setNextStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Processing">Processing</SelectItem>
                    <SelectItem value="Shipped">Shipped</SelectItem>
                    <SelectItem value="Delivered">Delivered</SelectItem>
                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button>
                <Button onClick={updateOrderStatus} disabled={updating}>
                  {updating ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    'Save'
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Orders; 