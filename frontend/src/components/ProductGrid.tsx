import { useState } from "react";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Product {
  id: number;
  title: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  emoji: string;
  isWishlisted?: boolean;
  inStock: boolean;
}

const products: Product[] = [
  { 
    id: 1, 
    title: "Premium Wireless Headphones", 
    price: 299, 
    originalPrice: 399, 
    rating: 4.8, 
    reviews: 124, 
    emoji: "🎧",
    inStock: true
  },
  { 
    id: 2, 
    title: "Smart Fitness Watch", 
    price: 249, 
    rating: 4.6, 
    reviews: 89, 
    emoji: "⌚",
    inStock: true
  },
  { 
    id: 3, 
    title: "Wireless Charging Pad", 
    price: 59, 
    originalPrice: 79, 
    rating: 4.4, 
    reviews: 203, 
    emoji: "📱",
    inStock: true
  },
  { 
    id: 4, 
    title: "Bluetooth Speaker", 
    price: 89, 
    rating: 4.7, 
    reviews: 156, 
    emoji: "🔊",
    inStock: false
  },
  { 
    id: 5, 
    title: "Gaming Mouse", 
    price: 79, 
    originalPrice: 99, 
    rating: 4.5, 
    reviews: 67, 
    emoji: "🖱️",
    inStock: true
  },
  { 
    id: 6, 
    title: "USB-C Hub", 
    price: 45, 
    rating: 4.3, 
    reviews: 91, 
    emoji: "🔌",
    inStock: true
  },
  { 
    id: 7, 
    title: "Wireless Keyboard", 
    price: 129, 
    originalPrice: 159, 
    rating: 4.6, 
    reviews: 78, 
    emoji: "⌨️",
    inStock: true
  },
  { 
    id: 8, 
    title: "Phone Stand", 
    price: 25, 
    rating: 4.2, 
    reviews: 145, 
    emoji: "📱",
    inStock: true
  },
];

export const ProductGrid = () => {
  const [wishlistedItems, setWishlistedItems] = useState<Set<number>>(new Set());

  const toggleWishlist = (productId: number) => {
    setWishlistedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
  };

  const addToCart = (productId: number) => {
    // Mock add to cart functionality
    console.log(`Added product ${productId} to cart`);
  };

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">Top Picks For You</h2>
          <p className="text-muted-foreground">Curated products based on your preferences</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="card-hover group">
              <CardContent className="p-0">
                {/* Product Image */}
                <div className="relative aspect-square bg-gradient-to-br from-muted to-accent/20 flex items-center justify-center rounded-t-lg">
                  <span className="text-6xl">{product.emoji}</span>
                  
                  {/* Wishlist Button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 bg-background/80 hover:bg-background opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => toggleWishlist(product.id)}
                  >
                    <Heart 
                      className={`h-4 w-4 ${
                        wishlistedItems.has(product.id) 
                          ? 'fill-red-500 text-red-500' 
                          : 'text-muted-foreground'
                      }`} 
                    />
                  </Button>

                  {/* Sale Badge */}
                  {product.originalPrice && (
                    <Badge className="absolute top-2 left-2 bg-accent text-accent-foreground">
                      SALE
                    </Badge>
                  )}

                  {/* Stock Badge */}
                  {!product.inStock && (
                    <Badge className="absolute bottom-2 left-2 bg-destructive text-destructive-foreground">
                      Out of Stock
                    </Badge>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-4 space-y-3">
                  <h3 className="font-semibold text-foreground line-clamp-2 leading-tight">
                    {product.title}
                  </h3>
                  
                  {/* Rating */}
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 fill-accent text-accent" />
                      <span className="ml-1 text-sm font-medium">{product.rating}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">({product.reviews})</span>
                  </div>

                  {/* Price */}
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-bold text-foreground">${product.price}</span>
                    {product.originalPrice && (
                      <span className="text-sm text-muted-foreground line-through">
                        ${product.originalPrice}
                      </span>
                    )}
                  </div>

                  {/* Add to Cart Button */}
                  <Button 
                    className="w-full"
                    disabled={!product.inStock}
                    onClick={() => addToCart(product.id)}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More Button */}
        <div className="text-center mt-8">
          <Button variant="outline" size="lg">
            View All Products
          </Button>
        </div>
      </div>
    </div>
  );
};