import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Heart, Share2, Star, ShoppingCart } from "lucide-react";
import { addToCart, getCart } from "@/lib/cart";
import { addToWishlist, removeFromWishlist, isWishlisted } from "@/lib/wishlist";
import { useToast } from "@/hooks/use-toast";
import { productAPI } from "@/lib/api";

export default function ProductDetails() {
  const { id } = useParams();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [inCart, setInCart] = useState(() => product ? getCart().some(item => item.id === product.id) : false);
  const [wishlisted, setWishlisted] = useState(() => (product ? isWishlisted(product.id) : false));

  useEffect(() => {
    setLoading(true);
    setError("");
    
    productAPI.getProductById(id)
      .then((data) => {
        if (data.success && data.data) {
          console.log(data.data);
          setProduct(data.data);
        } else {
          setError("Product not found");
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Error fetching product");
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    if (!product) return;
    setWishlisted(isWishlisted(product.id));
    function updateInCart() {
      setInCart(getCart().some(item => item.id === product.id));
    }
    window.addEventListener("cartUpdated", updateInCart);
    return () => window.removeEventListener("cartUpdated", updateInCart);
  }, [product]);

  useEffect(() => {
    if (!product) return;
    setWishlisted(isWishlisted(product.id));
    function updateWishlist() {
      setWishlisted(isWishlisted(product.id));
    }
    window.addEventListener("wishlistUpdated", updateWishlist);
    return () => window.removeEventListener("wishlistUpdated", updateWishlist);
  }, [product]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product.id, 1);
    toast({
      title: "Added to cart!",
      description: `${product.title} has been added to your cart.`,
    });
    setInCart(true);
  };

  const handleWishlist = () => {
    if (!product) return;
    if (wishlisted) {
      removeFromWishlist(product.id);
      toast({
        title: "Removed from wishlist",
        description: `${product.title} has been removed from your wishlist.`,
      });
      setWishlisted(false);
    } else {
      addToWishlist(product.id);
      toast({
        title: "Added to wishlist",
        description: `${product.title} has been added to your wishlist.`,
      });
      setWishlisted(true);
    }
  };

  if (loading) {
    return (
      <div className="page-transition">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
          Loading product details...
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="page-transition">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-red-500">
          {error || "Product not found"}
        </div>
      </div>
    );
  }

  return (
    <div className="page-transition">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back to Products */}
        <div className="mb-6 flex items-center gap-4">
          <Button variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Products
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div>
            <Card>
              <CardContent className="p-8">
                <div className="aspect-square rounded-lg flex items-center justify-center bg-white">
                  {product.images && product.images.length > 0 ? (
                    <img
                      src={product.images[0]}
                      alt={product.title}
                      className="object-cover w-full h-full rounded-lg"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = "/placeholder.svg";
                      }}
                    />
                  ) : (
                    <img
                      src="/placeholder.svg"
                      alt="No product image"
                      className="object-cover w-full h-full rounded-lg"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.style.display = "none";
                        // fallback to icon if even placeholder fails
                        const parent = e.currentTarget.parentElement;
                        if (parent) {
                          parent.innerHTML =
                            '<span style="font-size:2rem;display:flex;align-items:center;justify-content:center;width:100%;height:100%;">🖼️</span>';
                        }
                      }}
                    />
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                {product.inStock ? (
                  <Badge variant="secondary">In Stock</Badge>
                ) : (
                  <Badge variant="destructive">Out of Stock</Badge>
                )}
                {product.rating && (
                  <div className="flex items-center">
                    <Star className="h-4 w-4 fill-accent text-accent" />
                    <span className="ml-1 text-sm font-medium">
                      {product.rating}
                    </span>
                    {product.reviews && (
                      <span className="ml-1 text-sm text-muted-foreground">
                        ({product.reviews} reviews)
                      </span>
                    )}
                  </div>
                )}
              </div>
              <h1 className="text-3xl font-bold text-foreground mb-4">
                {product.title}
              </h1>
              <div className="flex items-center gap-4 mb-6">
                <span className="text-3xl font-bold text-foreground">
                  ₹{product.price}
                </span>
                {product.originalPrice && (
                  <span className="text-xl text-muted-foreground line-through">
                    ₹{product.originalPrice}
                  </span>
                )}
                {product.originalPrice && product.price && (
                  <Badge className="bg-accent text-accent-foreground">
                    {Math.round(
                      100 - (product.price / product.originalPrice) * 100
                    )}
                    % OFF
                  </Badge>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-4 mb-4">
              <Badge variant="outline">Category: {product.category}</Badge>
              {product.subCategory && (
                <Badge variant="outline">
                  Subcategory: {product.subCategory}
                </Badge>
              )}
            </div>

            {product.description && (
              <p className="text-muted-foreground text-lg mb-4">
                {product.description}
              </p>
            )}

            <div className="flex gap-4 mb-6">
              {inCart ? (
                <Button
                  className="btn-primary flex-1"
                  onClick={() => navigate("/cart")}
                  disabled={!product.inStock}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Go to Cart
                </Button>
              ) : (
                <Button
                  className="btn-primary flex-1"
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>
              )}
              <Button variant={wishlisted ? "secondary" : "outline"} size="icon" onClick={handleWishlist} aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}>
                <Heart className={`h-4 w-4 ${wishlisted ? "fill-red-500 text-red-500" : ""}`} />
              </Button>
              <Button variant="outline" size="icon">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>

            {/* Attributes */}
            {product.attributes &&
              Object.keys(product.attributes).length > 0 && (
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-foreground mb-4">
                      Product Attributes
                    </h3>
                    <ul className="space-y-2">
                      {Object.entries(product.attributes).map(
                        ([key, value]) => (
                          <li
                            key={key}
                            className="flex items-center text-muted-foreground"
                          >
                            <div className="w-2 h-2 bg-accent rounded-full mr-3"></div>
                            <span className="font-medium mr-2">{key}:</span>{" "}
                            {String(value)}
                          </li>
                        )
                      )}
                    </ul>
                  </CardContent>
                </Card>
              )}
          </div>
        </div>
      </div>
    </div>
  );
}
