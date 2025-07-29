import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { initializeDummyPayment } from "@/lib/dummyRazorpay";
import { useToast } from "@/hooks/use-toast";
import { getCart, setCart } from "@/lib/cart";

interface CartItem {
  id: string;
  quantity: number;
  title: string;
  price: number;
  image: string;
}

export default function Payment() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  // Payment & coupon state
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponError, setCouponError] = useState("");
  const [isPaying, setIsPaying] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Get cart data and fetch product details
  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const cart = getCart();
        if (cart.length === 0) {
          setCartItems([]);
          setLoading(false);
          return;
        }

        // Fetch all products to get details for cart items
        const response = await fetch('http://localhost:8000/api/products/all');
        const data = await response.json();
        
        if (data.success && Array.isArray(data.data)) {
          const products = data.data;
          const itemsWithDetails: CartItem[] = cart.map(cartItem => {
            const product = products.find((p: any) => p.id === cartItem.id);
            return {
              id: cartItem.id,
              quantity: cartItem.quantity,
              title: product?.title || 'Unknown Product',
              price: product?.price || 0,
              image: product?.image || '/placeholder.svg'
            };
          });
          setCartItems(itemsWithDetails);
        }
      } catch (error) {
        console.error('Error fetching cart items:', error);
        toast({
          title: "Error",
          description: "Failed to load cart items",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, [toast]);

  const cartTotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = 15;
  const tax = Math.round(cartTotal * 0.08); // 8% tax
  const total = cartTotal + shipping + tax;

  function handleApplyCoupon() {
    if (!couponCode.trim()) {
      setCouponError("Please enter a coupon code");
      return;
    }
    setAppliedCoupon(couponCode.trim());
    setCouponError("");
  }

  // Handle Dummy Razorpay payment
  const handleDummyRazorpayPayment = async () => {
    if (!paymentMethod) {
      toast({
        title: "Payment Method Required",
        description: "Please select a payment method",
        variant: "destructive",
      });
      return;
    }

    if (paymentMethod === "cod") {
      handleCODOrder();
      return;
    }

    setIsPaying(true);

    try {
      await initializeDummyPayment(
        total,
        'INR',
        {
          name: location.state?.address?.firstName + ' ' + location.state?.address?.lastName || 'Customer',
          email: location.state?.address?.email || '',
          contact: location.state?.address?.phone || '',
        },
        // Success handler
        async (response) => {
          toast({
            title: "Payment Successful!",
            description: `Dummy Payment ID: ${response.razorpay_payment_id}`,
          });
          
          // Clear cart and redirect to orders page
          setCart([]);
          navigate("/orders", { 
            state: { 
              paymentId: response.razorpay_payment_id,
              orderId: response.razorpay_order_id,
              paymentMethod: "dummy_razorpay",
              showSuccessMessage: true
            } 
          });
        },
        // Failure handler
        (error) => {
          toast({
            title: "Payment Failed",
            description: error.message || "Something went wrong with the payment",
            variant: "destructive",
          });
        },
        // Dismiss handler
        () => {
          setIsPaying(false);
        }
      );
    } catch (error: any) {
      toast({
        title: "Payment Error",
        description: error.message || "Failed to initialize payment",
        variant: "destructive",
      });
      setIsPaying(false);
    }
  };

  // Handle Cash on Delivery
  const handleCODOrder = async () => {
    setIsPaying(true);
    
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast({
          title: "Authentication Required",
          description: "Please login to place an order",
          variant: "destructive",
        });
        return;
      }

      // First, sync local cart items to backend
      const localCart = getCart();
      if (localCart.length === 0) {
        toast({
          title: "Cart is Empty",
          description: "Please add items to your cart before placing an order",
          variant: "destructive",
        });
        return;
      }

      // Sync each cart item to backend
      console.log("Syncing cart items to backend:", localCart);
      for (const cartItem of localCart) {
        console.log("Syncing item:", cartItem);
        const cartResponse = await fetch("http://localhost:8000/api/cart", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            productId: cartItem.id,
            quantity: cartItem.quantity,
          }),
        });
        
        if (!cartResponse.ok) {
          const errorData = await cartResponse.json();
          console.error("Cart sync error:", errorData);
          throw new Error(`Failed to sync cart items to backend: ${errorData.message || 'Unknown error'}`);
        }
        
        const cartData = await cartResponse.json();
        console.log("Cart sync response:", cartData);
      }

      // Now place the order
      const response = await fetch("http://localhost:8000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          payment: {
            method: "cod",
            coupon: appliedCoupon,
          },
          shipping: location.state?.address || {},
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Order failed. Please try again.");
      }

      // Clear cart and redirect to orders page
      setCart([]);
      navigate("/orders", { 
        state: { 
          paymentMethod: "cod",
          orderId: data.orderId,
          showSuccessMessage: true
        } 
      });

    } catch (error: any) {
      toast({
        title: "Order Failed",
        description: error.message || "Failed to place order",
        variant: "destructive",
      });
    } finally {
      setIsPaying(false);
    }
  };

  function handleCompleteOrder() {
    if (paymentMethod === "razorpay") {
      handleDummyRazorpayPayment();
    } else if (paymentMethod === "cod") {
      handleCODOrder();
    } else {
      toast({
        title: "Payment Method Required",
        description: "Please select a payment method",
        variant: "destructive",
      });
    }
  }

  if (loading) {
    return (
      <div className="page-transition">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading payment details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="page-transition">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
            <p className="text-muted-foreground mb-6">Add some products to your cart to proceed with payment.</p>
            <Button onClick={() => navigate("/categories")}>
              Continue Shopping
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-transition">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Payment & Offers */}
          <div>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Payment & Offers</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Coupon code */}
                <div>
                  <Label htmlFor="coupon">Coupon Code</Label>
                  <div className="flex gap-2 mt-1">
                    <Input 
                      id="coupon" 
                      placeholder="Enter coupon code" 
                      value={couponCode} 
                      onChange={e => setCouponCode(e.target.value)} 
                      disabled={!!appliedCoupon} 
                    />
                    <Button 
                      type="button" 
                      onClick={handleApplyCoupon} 
                      disabled={!!appliedCoupon}
                    >
                      Apply
                    </Button>
                  </div>
                  {appliedCoupon && (
                    <div className="text-green-600 text-xs mt-1">
                      Coupon "{appliedCoupon}" applied!
                    </div>
                  )}
                  {couponError && (
                    <div className="text-red-600 text-xs mt-1">{couponError}</div>
                  )}
                </div>
                
                {/* Payment method */}
                <div>
                  <Label className="mb-2 block">Select Payment Method</Label>
                  <div className="flex flex-col gap-2">
                    <label className="flex items-center gap-2 p-3 border rounded-lg hover:bg-muted cursor-pointer">
                      <input 
                        type="radio" 
                        name="paymentMethod" 
                        value="razorpay" 
                        checked={paymentMethod === "razorpay"} 
                        onChange={() => setPaymentMethod("razorpay")} 
                      />
                      <div>
                        <div className="font-medium">Razorpay (Dummy Mode)</div>
                        <div className="text-sm text-muted-foreground">
                          Simulated payment for testing
                        </div>
                      </div>
                    </label>
                    <label className="flex items-center gap-2 p-3 border rounded-lg hover:bg-muted cursor-pointer">
                      <input 
                        type="radio" 
                        name="paymentMethod" 
                        value="cod" 
                        checked={paymentMethod === "cod"} 
                        onChange={() => setPaymentMethod("cod")} 
                      />
                      <div>
                        <div className="font-medium">Cash on Delivery</div>
                        <div className="text-sm text-muted-foreground">
                          Pay when you receive your order
                        </div>
                      </div>
                    </label>
                  </div>
                </div>
                
                <Button 
                  className="w-full btn-accent text-lg py-3" 
                  type="button" 
                  disabled={!paymentMethod || isPaying} 
                  onClick={handleCompleteOrder}
                >
                  {isPaying ? "Processing..." : "Complete Order"}
                </Button>
              </CardContent>
            </Card>
          </div>
          
          {/* Right: Order Summary */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Order Items */}
                <div className="space-y-4">
                  {cartItems.map((item, idx) => (
                    <div key={idx} className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                        <img 
                          src={item.image} 
                          alt={item.title} 
                          className="w-8 h-8 object-cover rounded"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{item.title}</p>
                        <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                      <span className="font-medium">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
                
                <Separator />
                
                {/* Pricing Breakdown */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>₹{cartTotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>₹{shipping}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax</span>
                    <span>₹{tax}</span>
                  </div>
                  {appliedCoupon && (
                    <div className="flex justify-between text-green-600">
                      <span>Coupon Discount</span>
                      <span>-₹{Math.round(total * 0.1)}</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span>₹{appliedCoupon ? total - Math.round(total * 0.1) : total}</span>
                  </div>
                </div>
                
                <p className="text-xs text-muted-foreground text-center">
                  By placing your order, you agree to our Terms of Service and Privacy Policy
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
} 