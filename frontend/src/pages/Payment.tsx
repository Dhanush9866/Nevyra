import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";

// Razorpay types (for TypeScript users, otherwise ignore)
declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function Payment() {
  // Payment & coupon state
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponError, setCouponError] = useState("");
  const [isPaying, setIsPaying] = useState(false);

  function handleApplyCoupon() {
    if (!couponCode.trim()) {
      setCouponError("Please enter a coupon code");
      return;
    }
    setAppliedCoupon(couponCode.trim());
    setCouponError("");
  }

  // Placeholder order summary and address (replace with real data via props or navigation state)
  const orderSummary = {
    items: [
      { name: "Premium Wireless Headphones", qty: 1, price: 299 },
      { name: "Smart Watch Pro", qty: 2, price: 449 },
    ],
    subtotal: 1197,
    shipping: 15,
    tax: 96,
    total: 1308,
  };

  // Razorpay integration (test mode)
  function loadRazorpayScript() {
    return new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  }

  async function handleRazorpayPayment() {
    setIsPaying(true);
    const res = await loadRazorpayScript();
    if (!res) {
      alert("Razorpay SDK failed to load. Are you online?");
      setIsPaying(false);
      return;
    }
    // Placeholder test credentials (replace with real ones later)
    const options = {
      key: "rzp_test_1234567890abcdef", // Replace with your Razorpay Test Key
      amount: orderSummary.total * 100, // in paise
      currency: "INR",
      name: "Nevyra Shopping",
      description: "Order Payment",
      image: "/logo.jpg",
      handler: function (response: any) {
        alert("Payment successful! Payment ID: " + response.razorpay_payment_id);
      },
      prefill: {
        name: "Nevyra Customer",
        email: "customer@example.com",
        contact: "9999999999",
      },
      notes: {
        address: "Krosuru, Palnadu District, AP",
      },
      theme: {
        color: "#2563eb",
      },
      modal: {
        ondismiss: function () {
          alert("Payment popup closed.");
        },
      },
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
    setIsPaying(false);
  }

  function handleCompleteOrder() {
    if (paymentMethod === "razorpay") {
      handleRazorpayPayment();
    } else {
      alert("Order placed with Cash on Delivery!");
    }
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
                    <Input id="coupon" placeholder="Enter coupon code" value={couponCode} onChange={e => setCouponCode(e.target.value)} disabled={!!appliedCoupon} />
                    <Button type="button" onClick={handleApplyCoupon} disabled={!!appliedCoupon}>Apply</Button>
                  </div>
                  {appliedCoupon && <div className="text-success text-xs mt-1">Coupon "{appliedCoupon}" applied!</div>}
                  {couponError && <div className="text-destructive text-xs mt-1">{couponError}</div>}
                </div>
                {/* Payment method */}
                <div>
                  <Label className="mb-2 block">Select Payment Method</Label>
                  <div className="flex flex-col gap-2">
                    <label className="flex items-center gap-2">
                      <input type="radio" name="paymentMethod" value="razorpay" checked={paymentMethod === "razorpay"} onChange={() => setPaymentMethod("razorpay")} />
                      Razorpay (UPI, Card, Netbanking)
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="radio" name="paymentMethod" value="cod" checked={paymentMethod === "cod"} onChange={() => setPaymentMethod("cod")} />
                      Cash on Delivery
                    </label>
                  </div>
                </div>
                <Button className="w-full btn-accent text-lg py-3" type="button" disabled={!paymentMethod || isPaying} onClick={handleCompleteOrder}>
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
                  {orderSummary.items.map((item, idx) => (
                    <div key={idx} className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                        <span className="text-lg">🎧</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">Qty: {item.qty}</p>
                      </div>
                      <span className="font-medium">₹{item.price * item.qty}</span>
                    </div>
                  ))}
                </div>
                <Separator />
                {/* Pricing Breakdown */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>₹{orderSummary.subtotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>₹{orderSummary.shipping}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax</span>
                    <span>₹{orderSummary.tax}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span>₹{orderSummary.total}</span>
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