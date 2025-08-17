import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiService } from "@/lib/api";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Package, 
  Eye, 
  X, 
  Truck,
  CheckCircle, 
  Clock,
  MapPin,
  CreditCard,
  Wallet,
  Smartphone,
  Building
} from "lucide-react";

interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  quantity: number;
  price: number;
  totalPrice: number;
}

interface Order {
  _id: string;
  orderNumber: string;
  items: OrderItem[];
  shippingAddress: {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    zipCode: string;
    phone: string;
  };
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  subtotal: number;
  shippingCost: number;
  tax: number;
  totalAmount: number;
  estimatedDelivery: string;
  createdAt: string;
  notes?: string;
}

const Orders = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();

  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/auth", { state: { from: location.pathname } });
      return;
    }

    fetchOrders();

    // Show success message if redirected from checkout
    if (location.state?.message) {
      toast({
        title: "Success",
        description: location.state.message,
      });
    }
  }, [isAuthenticated, navigate, location.state, toast]);

  const fetchOrders = async () => {
    try {
      const response = await apiService.getUserOrders();
      if (response.success) {
        setOrders(response.data);
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to fetch orders",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch orders. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "bg-success text-success-foreground";
      case "shipped":
        return "bg-primary text-primary-foreground";
      case "confirmed":
        return "bg-blue-500 text-white";
      case "processing":
        return "bg-warning text-warning-foreground";
      case "cancelled":
        return "bg-destructive text-destructive-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return <CheckCircle className="h-4 w-4" />;
      case "shipped":
        return <Truck className="h-4 w-4" />;
      case "confirmed":
        return <CheckCircle className="h-4 w-4" />;
      case "processing":
        return <Clock className="h-4 w-4" />;
      case "cancelled":
        return <X className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case "cod":
        return <Wallet className="h-4 w-4" />;
      case "card":
        return <CreditCard className="h-4 w-4" />;
      case "upi":
        return <Smartphone className="h-4 w-4" />;
      case "netbanking":
        return <Building className="h-4 w-4" />;
      default:
        return <CreditCard className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
  };

  const handleCloseOrderDetails = () => {
    setSelectedOrder(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background font-roboto">
        <Navbar />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading orders...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background font-roboto">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">My Orders</h1>
          <p className="text-muted-foreground">Track your order status and history</p>
      </div>

        {orders.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No orders yet</h3>
              <p className="text-muted-foreground mb-6">
                Start shopping to see your orders here
              </p>
              <Button onClick={() => navigate("/")}>
                Start Shopping
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <Card key={order._id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Package className="h-5 w-5 text-primary" />
                        <span className="font-semibold">#{order.orderNumber}</span>
               </div>
                      <Badge className={getStatusColor(order.orderStatus)}>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(order.orderStatus)}
                          {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
               </div>
                      </Badge>
               </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">
                        {formatDate(order.createdAt)}
                      </p>
                      <p className="font-semibold text-lg">
                        ₹{order.totalAmount.toLocaleString()}
                      </p>
               </div>
             </div>
                </CardHeader>
                
                <CardContent>
                  {/* Order Items Preview */}
                  <div className="mb-4">
                    <div className="flex items-center gap-4 mb-3">
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          {getPaymentMethodIcon(order.paymentMethod)}
                          {order.paymentMethod.toUpperCase()}
                        </span>
               </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          {order.shippingAddress.city}, {order.shippingAddress.zipCode}
                        </span>
               </div>
               </div>
                    
                    <div className="flex items-center gap-4">
                      {order.items.slice(0, 3).map((item, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <img
                            src={item.productImage}
                            alt={item.productName}
                            className="w-12 h-12 object-cover rounded-lg"
                          />
                          <div className="text-sm">
                            <p className="font-medium line-clamp-1">{item.productName}</p>
                            <p className="text-muted-foreground">Qty: {item.quantity}</p>
               </div>
               </div>
                      ))}
                      {order.items.length > 3 && (
                        <div className="text-sm text-muted-foreground">
                          +{order.items.length - 3} more items
               </div>
                      )}
             </div>
           </div>

                  <Separator className="my-4" />

                  {/* Order Actions */}
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      <p>Estimated delivery: {formatDate(order.estimatedDelivery)}</p>
                      <p>{order.items.length} item{order.items.length !== 1 ? 's' : ''}</p>
                    </div>
               <Button 
                 variant="outline" 
                      onClick={() => handleViewOrder(order)}
               >
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
               </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
             </div>
           )}
        </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-background rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Order #{selectedOrder.orderNumber}</h2>
                 <Button 
                   variant="ghost" 
                   size="sm"
                  onClick={handleCloseOrderDetails}
                 >
                   <X className="h-4 w-4" />
                 </Button>
              </div>

              {/* Order Status */}
              <div className="mb-6">
                <Badge className={`${getStatusColor(selectedOrder.orderStatus)} text-lg px-4 py-2`}>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(selectedOrder.orderStatus)}
                    {selectedOrder.orderStatus.charAt(0).toUpperCase() + selectedOrder.orderStatus.slice(1)}
             </div>
                   </Badge>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Order Items */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Order Items</h3>
                  <div className="space-y-3">
                    {selectedOrder.items.map((item, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                        <img
                          src={item.productImage}
                          alt={item.productName}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium">{item.productName}</h4>
                          <p className="text-sm text-muted-foreground">
                            Quantity: {item.quantity} × ₹{item.price.toLocaleString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">₹{item.totalPrice.toLocaleString()}</p>
                        </div>
                      </div>
                 ))}
               </div>
           </div>

                {/* Order Details */}
                <div className="space-y-6">
                  {/* Shipping Address */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Shipping Address</h3>
                    <div className="p-3 border rounded-lg">
                      <p className="font-medium">
                        {selectedOrder.shippingAddress.firstName} {selectedOrder.shippingAddress.lastName}
                      </p>
                      <p className="text-muted-foreground">{selectedOrder.shippingAddress.address}</p>
                      <p className="text-muted-foreground">
                        {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.zipCode}
                      </p>
                      <p className="text-muted-foreground">{selectedOrder.shippingAddress.phone}</p>
                 </div>
                   </div>

                  {/* Payment & Order Info */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Order Information</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Order Date:</span>
                        <span>{formatDate(selectedOrder.createdAt)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Payment Method:</span>
                        <span className="flex items-center gap-1">
                          {getPaymentMethodIcon(selectedOrder.paymentMethod)}
                          {selectedOrder.paymentMethod.toUpperCase()}
                          </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Payment Status:</span>
                        <Badge variant={selectedOrder.paymentStatus === 'completed' ? 'default' : 'secondary'}>
                          {selectedOrder.paymentStatus.charAt(0).toUpperCase() + selectedOrder.paymentStatus.slice(1)}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Estimated Delivery:</span>
                        <span>{formatDate(selectedOrder.estimatedDelivery)}</span>
                      </div>
                    </div>
                        </div>
                        
                  {/* Order Notes */}
                  {selectedOrder.notes && (
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Order Notes</h3>
                      <p className="text-muted-foreground p-3 border rounded-lg">
                        {selectedOrder.notes}
                      </p>
                    </div>
                        )}
                      </div>
                    </div>

              {/* Order Summary */}
              <div className="mt-6 p-4 bg-muted rounded-lg">
                <h3 className="text-lg font-semibold mb-3">Order Summary</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>₹{selectedOrder.subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping:</span>
                    <span>₹{selectedOrder.shippingCost.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax:</span>
                    <span>₹{selectedOrder.tax.toLocaleString()}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total:</span>
                    <span>₹{selectedOrder.totalAmount.toLocaleString()}</span>
                  </div>
                </div>
                      </div>
             </div>
        </div>
      </div>
      )}

      <Footer />
    </div>
  );
};

export default Orders; 
