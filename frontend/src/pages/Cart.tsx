import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Minus, Trash2, ShoppingBag, Truck, Shield } from "lucide-react";
import { apiService } from "@/lib/api";

type CartItem = any;

const Cart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [promoCode, setPromoCode] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await apiService.getCart();
        if (res.success) setCartItems(res.data);
      } catch {}
    })();
  }, []);

  const updateQuantity = async (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      await removeItem(id);
      return;
    }
    try {
      await apiService.updateCartItem(id, newQuantity);
      setCartItems((items) =>
        items.map((item: any) =>
          item._id === id ? { ...item, quantity: newQuantity } : item
        )
      );
    } catch {}
  };

  const removeItem = async (id: string) => {
    try {
      await apiService.removeCartItem(id);
      setCartItems((items) => items.filter((item: any) => item._id !== id));
    } catch {}
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + ((item.productId?.price || 0) * (item.quantity || 0)),
    0
  );
  const originalTotal = cartItems.reduce(
    (sum, item) => {
      const price = item.productId?.price || 0;
      const mrp = item.productId?.mrp || price * 1.5; // fallback if mrp not present
      return sum + (mrp * (item.quantity || 0));
    },
    0
  );
  const totalSavings = originalTotal - subtotal;
  const shippingFee = subtotal > 499 ? 0 : 99;
  const finalTotal = subtotal + shippingFee;

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-background font-roboto">
        <Navbar />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <ShoppingBag className="h-24 w-24 text-muted-foreground mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Your cart is empty
            </h1>
            <p className="text-muted-foreground mb-6">
              Add some products to get started!
            </p>
            <Link to="/">
              <Button className="bg-primary hover:bg-primary-hover text-primary-foreground">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background font-roboto">
      <Navbar />

      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
          Shopping Cart ({cartItems.length} items)
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item: any) => (
              <Card key={item._id} className="p-4">
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row gap-4">
                    <img
                      src={item.productId?.images?.[0] || '/placeholder.svg'}
                      alt={item.productId?.title}
                      className="w-full md:w-32 h-32 object-cover rounded-lg"
                    />

                    <div className="flex-1 space-y-2">
                      <h3 className="font-semibold text-foreground text-lg">
                        {item.productId?.title}
                      </h3>

                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        {item.color && <span>Color: {item.color}</span>}
                        {item.size && <span>Size: {item.size}</span>}
                      </div>

                      {item.selectedFeatures && Object.keys(item.selectedFeatures).length > 0 && (
                        <div className="mt-2">
                          <p className="text-sm font-medium text-foreground mb-1">Selected Options:</p>
                          <div className="flex flex-wrap gap-2">
                            {Object.entries(item.selectedFeatures).map(([key, value]) => (
                              <span key={key} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                                {key}: {value}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex items-center gap-2">
                        <span className="text-xl font-bold text-price">
                          ₹{(item.productId?.price || 0).toLocaleString()}
                        </span>
                        <span className="text-sm text-muted-foreground line-through">
                          ₹{(item.productId?.mrp || item.productId?.price || 0).toLocaleString()}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center border border-border rounded">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              updateQuantity(item._id, item.quantity - 1)
                            }
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="px-4 py-2 border-x border-border">
                            {item.quantity}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              updateQuantity(item._id, item.quantity + 1)
                            }
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(item._id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Remove
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Promo Code */}
            <Card className="p-4">
              <CardContent className="p-0">
                <h3 className="font-semibold text-foreground mb-3">
                  Apply Promo Code
                </h3>
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter promo code"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="flex-1"
                  />
                  <Button variant="outline">Apply</Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Price Summary */}
          <div className="space-y-4">
            <Card className="sticky top-4">
              <CardContent className="p-6">
                <h3 className="font-semibold text-foreground mb-4">
                  Order Summary
                </h3>

                <div className="space-y-3 mb-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Subtotal ({cartItems.length} items)
                    </span>
                    <span className="font-medium">
                      ₹{subtotal.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping Fee</span>
                    <span className="font-medium">
                      {shippingFee === 0 ? (
                        <span className="text-success">FREE</span>
                      ) : (
                        `₹${shippingFee}`
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between text-success">
                    <span>Total Savings</span>
                    <span className="font-medium">
                      -₹{totalSavings.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="border-t border-border pt-3 mb-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>₹{finalTotal.toLocaleString()}</span>
                  </div>
                </div>

                <Link to="/checkout">
                  <Button className="w-full bg-primary hover:bg-primary-hover text-primary-foreground font-medium text-lg py-6 mb-4">
                    Proceed to Checkout
                  </Button>
                </Link>

                {/* Delivery Info */}
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Truck className="h-4 w-4 text-success" />
                    <span>
                      {shippingFee === 0
                        ? "Free delivery on this order"
                        : "Free delivery on orders above ₹499"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Shield className="h-4 w-4 text-primary" />
                    <span>Secure checkout with multiple payment options</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Continue Shopping */}
            <Link to="/">
              <Button variant="outline" className="w-full">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Cart;
