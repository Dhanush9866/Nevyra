import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingCart, Trash2, Eye, ArrowRight, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { getWishlist, removeFromWishlist } from "@/lib/wishlist";
import { addToCart } from "@/lib/cart";
// Removed mockProducts import

// Use the same Product type as ProductCard
interface Product {
  id: number;
  title: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  image: string;
  category: string;
  subcategory: string;
  inStock: boolean;
  isNew: boolean;
  popularity: number;
}

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);
  const [filteredItems, setFilteredItems] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { toast } = useToast();

  // Fetch all products from backend
  useEffect(() => {
    setLoading(true);
    setError("");
    fetch("http://localhost:8000/api/products/all")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch products");
        return res.json();
      })
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          setAllProducts(data.data);
        } else {
          setError("Invalid data format from server");
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Error fetching products");
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const updateWishlist = () => {
      const wishlistIds = getWishlist();
      const items = allProducts.filter((p) => wishlistIds.includes(p.id));
      setWishlistItems(items);
    };
    updateWishlist();
    window.addEventListener("storage", updateWishlist);
    return () => window.removeEventListener("storage", updateWishlist);
  }, [allProducts]);

  useEffect(() => {
    setFilteredItems(
      wishlistItems.filter(item => {
        const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.category.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
        return matchesSearch && matchesCategory;
      })
    );
  }, [wishlistItems, searchQuery, selectedCategory]);

  const categories = ["All", ...Array.from(new Set(wishlistItems.map(item => item.category)))];

  const handleRemoveFromWishlist = (itemId: number) => {
    removeFromWishlist(itemId);
    setWishlistItems(prev => prev.filter(item => item.id !== itemId));
    setFilteredItems(prev => prev.filter(item => item.id !== itemId));
    toast({
      title: "Removed from wishlist",
      description: "Item has been removed from your wishlist.",
    });
  };

  const addToCartHandler = (item: Product) => {
    addToCart(item.id, 1);
    toast({
      title: "Added to cart",
      description: `${item.title} has been added to your cart.`,
    });
  };

  const moveAllToCart = () => {
    const inStockItems = filteredItems.filter(item => item.inStock);
    if (inStockItems.length === 0) {
      toast({
        title: "No items available",
        description: "All items in your wishlist are currently out of stock.",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Items added to cart",
      description: `${inStockItems.length} items have been added to your cart.`,
    });
  };

  if (loading) {
    return <div className="text-center py-12">Loading wishlist...</div>;
  }
  if (error) {
    return <div className="text-center py-12 text-red-500">{error}</div>;
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-16">
            <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6">
              <Heart className="h-12 w-12 text-muted-foreground" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-4">Your wishlist is empty</h1>
            <p className="text-muted-foreground text-lg mb-8 max-w-md mx-auto">
              Start adding items to your wishlist to save them for later and get notified when prices drop.
            </p>
            <div className="space-x-4">
              <Button asChild>
                <Link to="/categories">
                  Start Shopping
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/products">Browse Products</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">My Wishlist</h1>
              <p className="text-muted-foreground mt-2">
                {wishlistItems.length} {wishlistItems.length === 1 ? "item" : "items"} saved
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" onClick={moveAllToCart}>
                <ShoppingCart className="mr-2 h-4 w-4" />
                Move All to Cart
              </Button>
              <Button variant="outline" asChild>
                <Link to="/categories">
                  Continue Shopping
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search your wishlist..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className="whitespace-nowrap"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Results */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-16">
            <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold text-foreground mb-2">No items found</h2>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search or filter criteria.
            </p>
            <Button variant="outline" onClick={() => {
              setSearchQuery("");
              setSelectedCategory("All");
            }}>
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item) => (
              <Card key={item.id} className="group hover:shadow-lg transition-all duration-300">
                <CardContent className="p-4">
                  {/* Image */}
                  <div className="relative mb-4">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    {item.originalPrice && item.originalPrice > item.price && (
                      <Badge className="absolute top-2 left-2 bg-red-500 text-white">
                        -{Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}%
                      </Badge>
                    )}
                    {!item.inStock && (
                      <Badge variant="secondary" className="absolute top-2 right-2">
                        Out of Stock
                      </Badge>
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <div className="flex space-x-2">
                        <Button size="sm" variant="secondary" asChild>
                          <Link to={`/products/${item.id}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleRemoveFromWishlist(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">{item.category}</p>
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center space-x-1">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(item.rating)
                              ? "text-yellow-400 fill-current"
                              : "text-gray-300"
                          }`}
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      ({item.reviews})
                    </span>
                  </div>

                  {/* Price */}
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-bold text-foreground">
                      ₹{item.price}
                    </span>
                    {item.originalPrice && (
                      <span className="text-sm text-muted-foreground line-through">
                        ₹{item.originalPrice}
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2 pt-2">
                    <Button
                      size="sm"
                      className="flex-1"
                      disabled={!item.inStock}
                      onClick={() => addToCartHandler(item)}
                    >
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Add to Cart
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleRemoveFromWishlist(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Summary */}
        {filteredItems.length > 0 && (
          <div className="mt-8 p-4 bg-muted/50 rounded-lg">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <p className="text-sm text-muted-foreground">
                  Showing {filteredItems.length} of {wishlistItems.length} items
                </p>
                <p className="text-sm font-medium">
                  Total value: ₹{filteredItems.reduce((sum, item) => sum + item.price, 0).toFixed(2)}
                </p>
              </div>
              <Button onClick={moveAllToCart} disabled={!filteredItems.some(item => item.inStock)}>
                <ShoppingCart className="mr-2 h-4 w-4" />
                Move All to Cart
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist; 