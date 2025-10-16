import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Eye, 
  Download,
  Star,
  Truck,
  ArrowLeft,
  MapPin,
  Phone,
  Calendar,
  Package,
  CheckCircle,
  Clock,
  Truck as TruckIcon,
  User
} from "lucide-react";
import { apiService } from "@/lib/api";

const emptyOrder: any = null;

const OrderDetails = () => {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const [order, setOrder] = useState<any>(emptyOrder);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    (async () => {
      if (!orderId) return;
      try {
        const res = await apiService.getOrderById(orderId);
        if (res.success) setOrder(res.data);
      } catch {}
    })();
  }, [orderId]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "bg-green-500 text-white";
      case "shipped":
        return "bg-blue-500 text-white";
      case "processing":
        return "bg-yellow-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-background font-roboto">
      <Navbar />
      
      {/* Breadcrumbs */}
      <div className="bg-white border-b border-gray-200 px-3 py-2">
        <div className="text-xs text-gray-600">
          Home &gt; My Account &gt; My Orders &gt; {order?._id}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row bg-gray-50">
        {/* Left Section */}
        <div className="flex-1 p-4">
          {/* Order Tracking Info */}
          <div className="bg-white rounded-lg p-4 mb-4">
            <p className="text-sm text-gray-600 mb-2">Order ID: {order?._id}</p>
            <p className="text-sm text-gray-600 mb-4">Tracking link is shared via SMS.</p>
            <div className="flex items-center justify-between text-sm text-blue-600">
              <span>Manage who can access</span>
              <span>→</span>
            </div>
          </div>

          {/* Product Details */}
          <div className="bg-white rounded-lg p-4 mb-4">
            <div className="flex gap-4">
              <img
                src={order?.items?.[0]?.productId?.images?.[0] || '/placeholder.svg'}
                alt={order?.items?.[0]?.productId?.title || 'Product'}
                className="w-16 h-16 object-cover rounded"
              />
              <div className="flex-1">
                <h3 className="font-medium text-sm text-gray-900 line-clamp-2">
                  {order?.items?.[0]?.productId?.title}
                </h3>
                <div className="text-xs text-gray-600 mt-1">
                  {order?.items?.[0]?.selectedFeatures && Object.entries(order.items[0].selectedFeatures).map(([k,v]) => (
                    <span key={k} className="mr-2">{k}: {v as any}</span>
                  ))}
                </div>
                <p className="text-sm font-medium text-gray-900 mt-1">₹{order?.totalAmount}</p>
                <p className="text-xs text-gray-600">1 offer</p>
              </div>
            </div>
          </div>

          {/* Order Status Timeline */}
          <div className="bg-white rounded-lg p-4 mb-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-3 w-3 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium">Status: {order?.status}</p>
                </div>
              </div>
            </div>
            <div className="mt-3 flex gap-2">
              {['Pending','Shipped','Delivered','Cancelled'].map(s => (
                <Button key={s} size="sm" variant={order?.status===s? 'default':'outline'} disabled={updating}
                  onClick={async ()=>{ setUpdating(true); try{ const r=await apiService.updateOrderStatus(order._id,s); if(r.success){ setOrder({ ...order, status: s }); }} finally{ setUpdating(false);} }}>
                  {s}
                </Button>
              ))}
            </div>
          </div>

          {/* Support - removed chat button as requested */}
        </div>

        {/* Right Section */}
        <div className="lg:w-80 p-4">
          {/* Download Invoice */}
          <div className="bg-white rounded-lg p-4 mb-4">
            <Button variant="outline" className="w-full">
              Download Invoice →
            </Button>
          </div>

          {/* Delivery Details */}
          <div className="bg-white rounded-lg p-4 mb-4">
            <h3 className="font-semibold text-sm mb-3">Delivery Details</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-900">{order?.shippingAddress?.address || (order?.user && order?.user.address)}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <User className="h-4 w-4 text-gray-500 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-900">{order?.user?.firstName} {order?.user?.lastName}</p>
                  <p className="text-xs text-gray-600">{order?.user?.phone}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Price Details */}
          <div className="bg-white rounded-lg p-4">
            <h3 className="font-semibold text-sm mb-3">Price Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">List price</span>
                <span>₹{order?.totalAmount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Selling price</span>
                <span>₹{order?.totalAmount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Extra Discount</span>
                <span className="text-green-600">-₹0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Special Price</span>
                <span>₹{order?.totalAmount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Handling Fee</span>
                <span>₹0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Platform fee</span>
                <span>₹0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Get extra 15% off upto ₹75 on 50 item(s)</span>
                <span className="text-green-600">-₹0</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold">
                <span>Total Amount</span>
                <span>₹{order?.totalAmount}</span>
              </div>
              <p className="text-xs text-gray-600">1 coupon:</p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default OrderDetails; 