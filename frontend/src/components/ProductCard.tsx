import { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingCart, Star, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";

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

interface ProductCardProps {
  product: Product;
  viewMode: "grid" | "list";
}

export const ProductCard = ({ product, viewMode }: ProductCardProps) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleAddToCart = async () => {
    if (!product.inStock) return;

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Added to cart!",
        description: `${product.title} has been added to your cart.`,
      });
      setIsLoading(false);
    }, 500);
  };

  const handleWishlistToggle = () => {
    setIsWishlisted(!isWishlisted);
    toast({
      title: isWishlisted ? "Removed from wishlist" : "Added to wishlist",
      description: `${product.title} ${
        isWishlisted ? "removed from" : "added to"
      } your wishlist.`,
    });
  };

  const discountPercentage = product.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100
      )
    : 0;

  if (viewMode === "list") {
    return (
      <Card className="card-hover group">
        <Link
          to={`/products/${product.id}`}
          className="block focus:outline-none focus:ring-2 focus:ring-blue-400 rounded-lg"
        >
          <CardContent className="p-0">
            <div className="flex">
              {/* Product Image */}
              <div className="relative w-48 h-48 bg-gradient-to-br from-muted to-accent/20 flex items-center justify-center flex-shrink-0 overflow-hidden rounded-lg">
                <Link
                  to={`/products/${product.id}`}
                  className="block w-full h-full"
                >
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.title}
                      className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <span className="text-6xl">🖼️</span>
                  )}
                </Link>

                {/* Badges */}
                <div className="absolute top-2 left-2 space-y-1">
                  {product.isNew && (
                    <Badge className="bg-success text-success-foreground">
                      NEW
                    </Badge>
                  )}
                  {discountPercentage > 0 && (
                    <Badge className="bg-destructive text-destructive-foreground">
                      {discountPercentage}% OFF
                    </Badge>
                  )}
                </div>

                {!product.inStock && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <Badge className="bg-destructive text-destructive-foreground">
                      Out of Stock
                    </Badge>
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="flex-1 p-6 flex flex-col justify-between">
                <div>
                  <Link
                    to={`/products/${product.id}`}
                    className="hover:underline"
                  >
                    <h3 className="font-semibold text-lg text-foreground mb-2 line-clamp-2">
                      {product.title}
                    </h3>
                  </Link>

                  {/* Rating */}
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(product.rating)
                              ? "fill-accent text-accent"
                              : "text-muted-foreground"
                          }`}
                        />
                      ))}
                      <span className="ml-2 text-sm font-medium">
                        {product.rating}
                      </span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      ({product.reviews} reviews)
                    </span>
                  </div>

                  {/* Price */}
                  <div className="flex items-center space-x-2 mb-4">
                    <span className="text-2xl font-bold text-foreground">
                      ${product.price}
                    </span>
                    {product.originalPrice && (
                      <span className="text-lg text-muted-foreground line-through">
                        ${product.originalPrice}
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2">
                  <Button
                    className="flex-1"
                    disabled={!product.inStock || isLoading}
                    onClick={handleAddToCart}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    {isLoading
                      ? "Adding..."
                      : product.inStock
                      ? "Add to Cart"
                      : "Out of Stock"}
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleWishlistToggle}
                  >
                    <Heart
                      className={`h-4 w-4 ${
                        isWishlisted ? "fill-red-500 text-red-500" : ""
                      }`}
                    />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Link>
      </Card>
    );
  }

  return (
    <Card className="card-hover group h-full">
      <Link
        to={`/products/${product.id}`}
        className="block focus:outline-none focus:ring-2 focus:ring-blue-400 rounded-lg h-full"
      >
        <CardContent className="p-0 h-full">
          {/* Product Image */}
          <div className="relative aspect-square bg-gradient-to-br from-muted to-accent/20 flex items-center justify-center rounded-t-lg overflow-hidden">
            {product.image ? (
              <img
                src={product.image}
                alt={product.title}
                className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
              />
            ) : (
              <span className="text-6xl">🖼️</span>
            )}
            {/* Quick Actions - Show on Hover */}
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="flex space-x-2">
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={(e) => {
                    e.preventDefault();
                    handleWishlistToggle();
                  }}
                >
                  <Heart
                    className={`h-4 w-4 ${
                      isWishlisted ? "fill-red-500 text-red-500" : ""
                    }`}
                  />
                </Button>
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={(e) => e.preventDefault()}
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
            </div>
            {/* Badges */}
            <div className="absolute top-2 left-2 space-y-1">
              {product.isNew && (
                <Badge className="bg-success text-success-foreground">
                  NEW
                </Badge>
              )}
              {discountPercentage > 0 && (
                <Badge className="bg-destructive text-destructive-foreground">
                  {discountPercentage}% OFF
                </Badge>
              )}
            </div>
            {/* Wishlist Button - Always Visible */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 bg-background/80 hover:bg-background"
              onClick={(e) => {
                e.preventDefault();
                handleWishlistToggle();
              }}
            >
              <Heart
                className={`h-4 w-4 ${
                  isWishlisted
                    ? "fill-red-500 text-red-500"
                    : "text-muted-foreground"
                }`}
              />
            </Button>
            {/* Out of Stock Overlay */}
            {!product.inStock && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <Badge className="bg-destructive text-destructive-foreground">
                  Out of Stock
                </Badge>
              </div>
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
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(product.rating)
                        ? "fill-accent text-accent"
                        : "text-muted-foreground"
                    }`}
                  />
                ))}
                <span className="ml-1 text-sm font-medium">
                  {product.rating}
                </span>
              </div>
              <span className="text-sm text-muted-foreground">
                ({product.reviews})
              </span>
            </div>
            {/* Price */}
            <div className="flex items-center space-x-2">
              <span className="text-lg font-bold text-foreground">
                ${product.price}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-muted-foreground line-through">
                  ${product.originalPrice}
                </span>
              )}
            </div>
            {/* Add to Cart Button */}
            <Button
              className="w-full group-hover:scale-105 transition-transform duration-200"
              disabled={!product.inStock || isLoading}
              onClick={(e) => {
                e.preventDefault();
                handleAddToCart();
              }}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              {isLoading
                ? "Adding..."
                : product.inStock
                ? "Add to Cart"
                : "Out of Stock"}
            </Button>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
};
