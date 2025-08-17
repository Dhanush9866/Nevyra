import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiService } from "@/lib/api";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  MapPin, 
  CreditCard, 
  Wallet, 
  Smartphone,
  Building,
  Truck,
  CheckCircle
} from "lucide-react";

interface CheckoutItem {
  productId: string;
  productName: string;
  productImage: string;
  quantity: number;
  price: number;
  totalPrice: number;
}

interface CheckoutData {
  items: CheckoutItem[];
  subtotal: number;
  shippingCost: number;
  tax: number;
  totalAmount: number;
}

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(false);
  const [checkoutData, setCheckoutData] = useState<CheckoutData | null>(null);
  const [shippingAddress, setShippingAddress] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zipCode: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [notes, setNotes] = useState("");

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/auth", { state: { from: location.pathname } });
      return;
    }

    // Get checkout data from location state
    const data = location.state?.checkoutData;
    const product = location.state?.product;
    
    if (!data && !product) {
      navigate("/");
      return;
    }

    if (product) {
      // Single product buy now
      const singleItem = {
        productId: product.id.toString(),
        productName: product.name,
        productImage: product.images[0],
        quantity: 1,
        price: product.salePrice || product.originalPrice,
        totalPrice: product.salePrice || product.originalPrice,
      };
      
      const singleCheckoutData = {
        items: [singleItem],
        subtotal: singleItem.totalPrice,
        shippingCost: 0,
        tax: Math.round(singleItem.totalPrice * 0.18), // 18% GST
        totalAmount: singleItem.totalPrice + Math.round(singleItem.totalPrice * 0.18),
      };
      
      setCheckoutData(singleCheckoutData);
    } else {
      setCheckoutData(data);
    }

    // Pre-fill shipping address with user data
    if (user) {
      setShippingAddress({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
        city: "",
        zipCode: "",
      });
    }
  }, [isAuthenticated, navigate, location.state, user]);

  const handleInputChange = (field: string, value: string) => {
    setShippingAddress(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    const requiredFields = ["firstName", "lastName", "email", "phone", "address", "city", "zipCode"];
    for (const field of requiredFields) {
      if (!shippingAddress[field as keyof typeof shippingAddress]?.trim()) {
        toast({
          title: "Error",
          description: `${field.charAt(0).toUpperCase() + field.slice(1)} is required`,
          variant: "destructive",
        });
        return false;
      }
    }

    if (!paymentMethod) {
      toast({
        title: "Error",
        description: "Please select a payment method",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handlePlaceOrder = async () => {
    if (!validateForm() || !checkoutData) return;

    setIsLoading(true);
    try {
      const orderData = {
        items: checkoutData.items,
        shippingAddress,
        paymentMethod,
        notes,
        subtotal: checkoutData.subtotal,
        shippingCost: checkoutData.shippingCost,
        tax: checkoutData.tax,
      };

      console.log("Sending order data to backend:", orderData);

      const response = await apiService.createOrder(orderData);
      
      console.log("Backend response:", response);
      
      if (response.success) {
        toast({
          title: "Success",
          description: "Order placed successfully!",
        });
        
        // Redirect to orders page
        navigate("/orders", { 
          state: { 
            newOrder: response.data,
            message: "Order placed successfully!" 
          } 
        });
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to place order",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Frontend error placing order:", error);
      toast({
        title: "Error",
        description: "Failed to place order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!checkoutData) {
    return (
      <div className="min-h-screen bg-background font-roboto">
        <Navbar />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading checkout...</p>
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
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Checkout</h1>
            <p className="text-muted-foreground">Complete your purchase</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Summary */}
              <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {checkoutData.items.map((item, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 border rounded-lg">
                    <img
                      src={item.productImage}
                      alt={item.productName}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                                <div className="flex-1">
                      <h3 className="font-semibold text-foreground">{item.productName}</h3>
                      <p className="text-sm text-muted-foreground">
                        Quantity: {item.quantity} × ₹{item.price.toLocaleString()}
                      </p>
                                  </div>
                    <div className="text-right">
                      <p className="font-semibold text-foreground">
                        ₹{item.totalPrice.toLocaleString()}
                      </p>
                                </div>
                              </div>
                            ))}
              </CardContent>
            </Card>

            {/* Shipping Address */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Shipping Address
                </CardTitle>
              </CardHeader>
              <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                    <Label htmlFor="firstName">First Name *</Label>
                                <Input 
                      id="firstName"
                      value={shippingAddress.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      required
                                />
                              </div>
                              <div>
                    <Label htmlFor="lastName">Last Name *</Label>
                                <Input 
                      id="lastName"
                      value={shippingAddress.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      required
                                />
                              </div>
                              <div>
                    <Label htmlFor="email">Email *</Label>
                                <Input 
                      id="email"
                                  type="email"
                      value={shippingAddress.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      required
                                />
                              </div>
                              <div>
                    <Label htmlFor="phone">Phone *</Label>
                                <Input 
                      id="phone"
                                  type="tel"
                      value={shippingAddress.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      required
                                />
                              </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="address">Address *</Label>
                    <Input
                      id="address"
                      value={shippingAddress.address}
                      onChange={(e) => handleInputChange("address", e.target.value)}
                      required
                              />
                            </div>
                              <div>
                    <Label htmlFor="city">City *</Label>
                                <Input 
                      id="city"
                      value={shippingAddress.city}
                      onChange={(e) => handleInputChange("city", e.target.value)}
                      required
                                />
                              </div>
                              <div>
                    <Label htmlFor="zipCode">ZIP Code *</Label>
                                <Input 
                      id="zipCode"
                      value={shippingAddress.zipCode}
                      onChange={(e) => handleInputChange("zipCode", e.target.value)}
                      required
                                />
                              </div>
                            </div>
                          </CardContent>
                        </Card>

            {/* Payment Method */}
              <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                      Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={paymentMethod}
                  onValueChange={setPaymentMethod}
                  className="space-y-3"
                >
                  <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-muted/50 cursor-pointer">
                    <RadioGroupItem value="cod" id="cod" />
                    <Label htmlFor="cod" className="flex items-center gap-2 cursor-pointer">
                      <Wallet className="h-4 w-4" />
                      Cash on Delivery
                            </Label>
                          </div>
                  <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-muted/50 cursor-pointer">
                            <RadioGroupItem value="card" id="card" />
                    <Label htmlFor="card" className="flex items-center gap-2 cursor-pointer">
                      <CreditCard className="h-4 w-4" />
                              Credit/Debit Card
                            </Label>
                          </div>
                  <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-muted/50 cursor-pointer">
                    <RadioGroupItem value="upi" id="upi" />
                    <Label htmlFor="upi" className="flex items-center gap-2 cursor-pointer">
                      <Smartphone className="h-4 w-4" />
                      UPI
                            </Label>
                          </div>
                  <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-muted/50 cursor-pointer">
                    <RadioGroupItem value="netbanking" id="netbanking" />
                    <Label htmlFor="netbanking" className="flex items-center gap-2 cursor-pointer">
                      <Building className="h-4 w-4" />
                      Net Banking
                    </Label>
                        </div>
                      </RadioGroup>
                </CardContent>
              </Card>

            {/* Order Notes */}
              <Card>
              <CardHeader>
                <CardTitle>Order Notes (Optional)</CardTitle>
              </CardHeader>
              <CardContent>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add any special instructions or notes for your order..."
                  className="w-full p-3 border rounded-lg resize-none h-24 focus:outline-none focus:ring-2 focus:ring-primary"
                />
                </CardContent>
              </Card>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>₹{checkoutData.subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>₹{checkoutData.shippingCost.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax</span>
                    <span>₹{checkoutData.tax.toLocaleString()}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span>₹{checkoutData.totalAmount.toLocaleString()}</span>
                  </div>
                </div>

                <Button
                  onClick={handlePlaceOrder}
                  disabled={isLoading}
                  className="w-full"
                  size="lg"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Placing Order...
                  </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4" />
                      Place Order
                </div>
                  )}
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  By placing this order, you agree to our Terms of Service and Privacy Policy
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Checkout;