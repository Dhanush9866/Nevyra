import { useEffect, useState } from "react";
import { Heart, Star, MoreVertical, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { apiService } from "@/lib/api";

// We'll map server wishlist items to displayable data using product info

const Wishlist = () => {
  const [items, setItems] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const res = await apiService.request<any>("/users/wishlist");
        if ((res as any).success && Array.isArray((res as any).data)) {
          // Each wishlist entry should include productId; fetch details already populated by backend if possible
          const mapped = (res as any).data.map((entry: any) => {
            const p = entry.product || entry.productId || {};
            return {
              id: entry._id || p.id,
              name: p.title,
              image: (p.images && p.images[0]) || "/placeholder.svg",
              price: p.price,
              originalPrice: Math.round(p.price * 1.5),
              discount: Math.max(0, Math.round(((p.price * 1.5 - p.price) / (p.price * 1.5)) * 100)),
              rating: p.rating || 0,
              inStock: p.inStock !== false,
              assured: true,
            };
          });
          setItems(mapped);
        }
      } catch (e) {
        // Fallback: no wishlist
        setItems([]);
      }
    })();
  }, []);

  const addToCart = async (id: string) => {
    const item = items.find((i) => i.id === id);
    if (!item) return;
    try {
      await apiService.addToCart(id, 1);
    } catch {}
  };

  return (
    <div className="min-h-screen bg-background font-roboto">
      <Navbar />
      
      {/* Page Title and Status */}
      <div className="p-4 border-b border-border">
        <h1 className="text-2xl font-bold text-foreground mb-2">My Wishlist</h1>
        <div className="flex items-center space-x-2 text-muted-foreground">
          <div className="w-4 h-4 bg-muted rounded-full flex items-center justify-center">
            <span className="text-xs">🔒</span>
          </div>
          <span className="text-sm">Private · {items.length} items</span>
        </div>
      </div>

      {/* Wishlist Items */}
      <div className="p-4">
        <div className="grid grid-cols-2 gap-4">
          {items.map((item) => (
            <Card key={item.id} className="group hover:shadow-lg transition-shadow">
              <CardContent className="p-3">
                <div className="relative mb-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-40 object-cover rounded-lg"
                  />
                  
                  {/* Discount Badge */}
                  <Badge className="absolute top-2 left-2 bg-green-500 text-white text-xs">
                    {item.discount}% ₹{item.originalPrice} ₹{item.price}
                  </Badge>
                  
                  {/* More Options */}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 bg-white/80 hover:bg-white"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>

                {/* Delivery Status */}
                {!item.inStock && (
                  <p className="text-red-500 text-sm font-medium mb-2">Not deliverable</p>
                )}

                {/* Product Name */}
                <h3 className="font-medium text-foreground mb-2 line-clamp-2 text-sm">
                  {item.name}
                </h3>

                {/* Rating */}
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3 w-3 ${
                        i < Math.floor(item.rating)
                          ? "fill-green-500 text-green-500"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>

                {/* Assured Badge */}
                {item.assured && (
                  <div className="flex items-center gap-1 mb-3">
                    <Shield className="h-3 w-3 text-blue-500" />
                    <span className="text-xs text-blue-500 font-medium">Assured</span>
                  </div>
                )}

                {/* Add to Cart Button */}
                <Button 
                  className="w-full border border-gray-300 bg-white text-black hover:bg-gray-50 text-sm"
                  onClick={() => addToCart(item.id)}
                >
                  Add to Cart
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {items.length === 0 && (
          <div className="text-center py-12">
            <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Your wishlist is empty</h2>
            <p className="text-muted-foreground mb-4">
              Start adding products to your wishlist to see them here
            </p>
            <Button onClick={() => navigate("/")}>
              Start Shopping
            </Button>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default Wishlist; 