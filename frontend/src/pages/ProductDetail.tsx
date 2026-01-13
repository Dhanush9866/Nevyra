import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Star, Heart, Share2, ShoppingCart, Truck, Shield, RotateCcw, Plus, Minus, Loader2, MessageSquare, Trash2 } from "lucide-react";
import { apiService } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";

interface Product {
  id: string;
  title: string;
  price: number;
  category: string;
  subCategory: string;
  images: string[];
  inStock: boolean;
  rating: number;
  reviews: number;
  stockQuantity: number;
  soldCount: number;
  attributes?: Record<string, any>;
  additionalSpecifications?: Record<string, any>;
}

interface SelectedFeatures {
  [key: string]: string;
}

interface Review {
  _id: string;
  user: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  product: string;
  rating: number;
  title?: string;
  comment: string;
  createdAt: string;
}

const ProductDetail = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [pincode, setPincode] = useState("");
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [selectedFeatures, setSelectedFeatures] = useState<SelectedFeatures>({});
  const [addingToCart, setAddingToCart] = useState(false);

  // Reviews state
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 5,
    title: "",
    comment: ""
  });

  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (productId) {
      fetchProduct();
      checkWishlistStatus();
      fetchReviews();
    }
  }, [productId]);

  const checkWishlistStatus = async () => {
    try {
      const res = await apiService.getWishlist();
      if (res.success && Array.isArray(res.data)) {
        // Check if current product is in wishlist
        const exists = res.data.some((item: any) =>
          (item.productId?._id === productId) || (item.productId === productId) || (item._id === productId)
        );
        setIsWishlisted(exists);
      }
    } catch { }
  };

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await apiService.getProductById(productId!);
      if (response.success) {
        setProduct(response.data);
        // Initialize selected features with first available option for each feature
        const initialFeatures: SelectedFeatures = {};
        if (response.data.additionalSpecifications) {
          Object.entries(response.data.additionalSpecifications).forEach(([key, value]) => {
            if (Array.isArray(value) && value.length > 0) {
              initialFeatures[key] = value[0];
            }
          });
        }
        setSelectedFeatures(initialFeatures);
      } else {
        toast({
          title: "Error",
          description: response.message || "Product not found",
          variant: "destructive",
        });
        navigate("/");
      }
    } catch (error) {
      console.error("Error fetching product:", error);
      toast({
        title: "Error",
        description: "Failed to fetch product details",
        variant: "destructive",
      });
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };

  const handleFeatureChange = (featureKey: string, value: string) => {
    setSelectedFeatures(prev => ({
      ...prev,
      [featureKey]: value
    }));
  };

  const handleAddToCart = async () => {
    if (!product) return;

    try {
      setAddingToCart(true);
      const response = await apiService.addToCart(product.id, quantity, selectedFeatures);

      if (response.success) {
        // notify navbar to refresh cart count
        window.dispatchEvent(new Event("cart-updated"));
        toast({
          title: "Success",
          description: "Product added to cart successfully!",
        });
      } else {
        throw new Error(response.message || "Failed to add to cart");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add to cart",
        variant: "destructive",
      });
    } finally {
      setAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    if (!product) return;

    try {
      setAddingToCart(true); // Show loading state on Buy Now too if desired, or duplicate state
      const response = await apiService.addToCart(product.id, quantity, selectedFeatures);

      if (response.success) {
        window.dispatchEvent(new Event("cart-updated"));
        navigate("/checkout");
      } else {
        throw new Error(response.message || "Failed to process request");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to proceed to checkout",
        variant: "destructive",
      });
    } finally {
      setAddingToCart(false);
    }
  };

  const handleWishlistToggle = async () => {
    if (!product) return;

    const newState = !isWishlisted;
    setIsWishlisted(newState); // Optimistic UI update

    try {
      if (newState) {
        await apiService.addToWishlist(product.id);
        toast({ title: "Added to Wishlist", description: "Product saved for later" });
      } else {
        await apiService.removeFromWishlist(product.id);
        toast({ title: "Removed from Wishlist" });
      }
    } catch (error) {
      setIsWishlisted(!newState); // Revert on failure
      toast({
        title: "Error",
        description: "Failed to update wishlist",
        variant: "destructive"
      });
    }
  };

  const getProductImage = (images: string[]) => {
    return images && images.length > 0
      ? images[0]
      : "https://via.placeholder.com/400x400?text=No+Image";
  };

  const calculateDiscount = (price: number) => {
    // Simulate original price for discount calculation
    const originalPrice = price * 1.5;
    return Math.round(((originalPrice - price) / originalPrice) * 100);
  };

  const fetchReviews = async () => {
    if (!productId) return;
    try {
      setLoadingReviews(true);
      const response = await apiService.getReviews(productId);
      if (response.success) {
        setReviews(response.data);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoadingReviews(false);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productId || !isAuthenticated) return;

    try {
      setSubmittingReview(true);
      const response = await apiService.createReview(productId, newReview);
      if (response.success) {
        toast({
          title: "Success",
          description: "Review submitted successfully!",
        });
        setNewReview({ rating: 5, title: "", comment: "" });
        fetchReviews();
        fetchProduct(); // Re-fetch product to get updated rating
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to submit review",
        variant: "destructive",
      });
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    try {
      const response = await apiService.deleteReview(reviewId);
      if (response.success) {
        toast({
          title: "Success",
          description: "Review deleted successfully",
        });
        fetchReviews();
        fetchProduct();
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete review",
        variant: "destructive",
      });
    }
  };

  const getRatingDistribution = () => {
    const distribution = [0, 0, 0, 0, 0];
    if (reviews.length === 0) return distribution;

    reviews.forEach(review => {
      if (review.rating >= 1 && review.rating <= 5) {
        distribution[5 - review.rating]++;
      }
    });

    return distribution.map(count => (count / reviews.length) * 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background font-roboto">
        <Navbar />
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">Loading product details...</p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background font-roboto">
        <Navbar />
        <div className="container mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Product not found</h1>
            <Button onClick={() => navigate("/")}>Go back to home</Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const discount = calculateDiscount(product.price);
  const originalPrice = product.price * 1.5;

  return (
    <div className="min-h-screen bg-background font-roboto">
      <Navbar />

      <div className="container mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <nav className="text-sm text-muted-foreground mb-6">
          Home / {product.category} / {product.subCategory} / {product.title}
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative">
              <img
                src={(product.images && product.images[selectedImage]) || getProductImage(product.images)}
                alt={product.title}
                className="w-full h-96 object-cover rounded-lg border border-border"
              />
            </div>
            {product.images && product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {product.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`${product.title} ${index + 1}`}
                    className={`w-20 h-20 object-cover rounded-lg border-2 cursor-pointer ${selectedImage === index ? 'border-primary' : 'border-border'
                      }`}
                    onClick={() => setSelectedImage(index)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                {product.title}
              </h1>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <div className="flex items-center bg-success text-success-foreground px-2 py-1 rounded text-sm font-medium">
                    {product.rating}
                    <Star className="h-3 w-3 fill-current ml-1" />
                  </div>
                  <span className="text-muted-foreground text-sm">
                    {product.reviews.toLocaleString()} reviews
                  </span>
                </div>
                <Badge variant={product.inStock ? "default" : "destructive"} className={product.inStock ? "text-success border-success" : ""}>
                  {product.inStock ? "In Stock" : "Out of Stock"}
                </Badge>
              </div>
            </div>

            {/* Pricing */}
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-price">₹{product.price.toLocaleString()}</span>
                {discount > 0 && (
                  <span className="text-xl text-muted-foreground line-through">₹{originalPrice.toLocaleString()}</span>
                )}
              </div>
              <p className="text-sm text-muted-foreground">Inclusive of all taxes</p>
            </div>

            {/* Additional Features Selection */}
            {product.additionalSpecifications && Object.keys(product.additionalSpecifications).length > 0 && (
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-foreground mb-4">Select Options</h3>
                  <div className="space-y-4">
                    {Object.entries(product.additionalSpecifications).map(([key, value]) => {
                      // If value is an array -> render selectable chips
                      if (Array.isArray(value) && value.length > 0) {
                        return (
                          <div key={key} className="space-y-2">
                            <label className="text-sm font-medium text-foreground capitalize">
                              {key.replace(/([A-Z])/g, ' $1').trim()}
                            </label>
                            <div className="flex flex-wrap gap-2">
                              {value.map((option: string) => {
                                const isActive = (selectedFeatures[key] || value[0]) === option;
                                return (
                                  <button
                                    type="button"
                                    key={option}
                                    onClick={() => handleFeatureChange(key, option)}
                                    className={`px-3 py-1.5 rounded-md border text-sm transition-colors ${isActive
                                      ? 'border-primary bg-primary/10 text-primary'
                                      : 'border-border hover:border-primary/50'
                                      }`}
                                  >
                                    {option}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        );
                      }
                      // Non-array -> show as a badge in a Special Features row
                      return (
                        <div key={key} className="space-y-2">
                          <label className="text-sm font-medium text-foreground capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </label>
                          <div className="flex flex-wrap gap-2">
                            <Badge variant="secondary" className="capitalize">
                              {String(value)}
                            </Badge>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}


            {/* Quantity and Actions */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="font-medium">Quantity:</span>
                <div className="flex items-center border border-border rounded">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="px-4 py-2 border-x border-border">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= 10}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  className="flex-1 bg-warning hover:bg-warning/90 text-warning-foreground font-medium text-lg py-6"
                  onClick={handleAddToCart}
                  disabled={!product.inStock || addingToCart}
                >
                  {addingToCart ? (
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  ) : (
                    <ShoppingCart className="h-5 w-5 mr-2" />
                  )}
                  {addingToCart ? "Adding..." : "Add to Cart"}
                </Button>
                <Button
                  className="flex-1 bg-primary hover:bg-primary-hover text-primary-foreground font-medium text-lg py-6"
                  onClick={handleBuyNow}
                  disabled={!product.inStock}
                >
                  Buy Now
                </Button>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={handleWishlistToggle}
                >
                  <Heart className={`h-4 w-4 mr-2 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
                  Wishlist
                </Button>
                <Button variant="outline" className="flex-1">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Sections Stacked */}
        <div className="w-full space-y-12 mt-16 mb-20">
          {/* Description Section */}
          <section id="description" className="space-y-6">
            <h2 className="text-3xl font-black text-slate-900 border-b-2 border-primary w-fit pb-1">Description</h2>
            <Card className="border-none shadow-none bg-slate-50/50 rounded-3xl">
              <CardContent className="p-6">
                <h3 className="font-semibold text-foreground mb-4">Product Description</h3>
                <div className="prose prose-gray max-w-none">
                  <p className="text-muted-foreground">
                    {product.title} - A high-quality product from the {product.category} category.
                    This {product.subCategory} offers excellent value and performance.
                  </p>
                  <p className="text-muted-foreground">
                    With a rating of {product.rating} stars and {product.reviews} reviews,
                    this product has been well-received by customers.
                  </p>
                  <p className="text-muted-foreground">
                    Currently in stock with {product.stockQuantity} units available.
                    {product.soldCount} units have been sold.
                  </p>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Specifications Section */}
          <section id="specifications" className="space-y-6">
            <h2 className="text-3xl font-black text-slate-900 border-b-2 border-primary w-fit pb-1">Specifications</h2>
            <Card className="border-none shadow-none bg-slate-50/50 rounded-3xl">
              <CardContent className="p-8">
                <h3 className="font-semibold text-foreground mb-4">Product Specifications</h3>
                <div className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="font-medium text-foreground">Category:</span>
                      <span className="ml-2 text-muted-foreground">{product.category}</span>
                    </div>
                    <div>
                      <span className="font-medium text-foreground">Sub Category:</span>
                      <span className="ml-2 text-muted-foreground">{product.subCategory}</span>
                    </div>
                    <div>
                      <span className="font-medium text-foreground">Price:</span>
                      <span className="ml-2 text-muted-foreground">₹{product.price.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="font-medium text-foreground">Rating:</span>
                      <span className="ml-2 text-muted-foreground">{product.rating} stars</span>
                    </div>
                    <div>
                      <span className="font-medium text-foreground">Reviews:</span>
                      <span className="ml-2 text-muted-foreground">{product.reviews}</span>
                    </div>
                    <div>
                      <span className="font-medium text-foreground">Stock:</span>
                      <span className="ml-2 text-muted-foreground">{product.stockQuantity} units</span>
                    </div>
                  </div>

                  {product.attributes && Object.keys(product.attributes).length > 0 && (
                    <div className="mt-6">
                      <h4 className="font-medium text-foreground mb-3">Product Attributes</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Object.entries(product.attributes).map(([key, value]) => (
                          <div key={key}>
                            <span className="font-medium text-foreground capitalize">
                              {key.replace(/([A-Z])/g, ' $1').trim()}:
                            </span>
                            <span className="ml-2 text-muted-foreground">
                              {Array.isArray(value) ? value.join(', ') : String(value)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Reviews Section */}
          <section id="reviews" className="space-y-8">
            <h2 className="text-3xl font-black text-slate-900 border-b-2 border-primary w-fit pb-1">Reviews ({reviews.length})</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Ratings Summary */}
              <Card className="lg:col-span-1">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-4">Customer Ratings</h3>
                  <div className="text-center mb-6">
                    <div className="text-4xl font-bold text-foreground mb-1">{product.rating}</div>
                    <div className="flex justify-center mb-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-5 w-5 ${star <= Math.round(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                        />
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground">{reviews.length} total reviews</p>
                  </div>

                  <div className="space-y-2">
                    {getRatingDistribution().map((percentage, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <span className="text-sm w-4">{5 - index}</span>
                        <Star className="h-3 w-3 fill-current text-gray-400" />
                        <Progress value={percentage} className="h-2 flex-1" />
                        <span className="text-xs text-muted-foreground w-8">{Math.round(percentage)}%</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Reviews List and Write Review Form */}
              <div className="lg:col-span-2 space-y-6">
                {/* Write Review Form */}
                {isAuthenticated ? (
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="font-semibold text-lg mb-4">Write a Review</h3>
                      <form onSubmit={handleSubmitReview} className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Rating</label>
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                onClick={() => setNewReview(prev => ({ ...prev, rating: star }))}
                                className="focus:outline-none"
                              >
                                <Star
                                  className={`h-6 w-6 ${star <= newReview.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                                />
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Review Title (Optional)</label>
                          <Input
                            placeholder="Summarize your experience"
                            value={newReview.title}
                            onChange={(e) => setNewReview(prev => ({ ...prev, title: e.target.value }))}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Your Review</label>
                          <Textarea
                            placeholder="What did you like or dislike?"
                            rows={4}
                            value={newReview.comment}
                            onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                            required
                          />
                        </div>
                        <Button type="submit" disabled={submittingReview}>
                          {submittingReview ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                          Submit Review
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="bg-muted/50 border-dashed">
                    <CardContent className="p-8 text-center">
                      <MessageSquare className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />
                      <p className="font-medium">Sign in to write a review</p>
                      <Button variant="outline" className="mt-4" onClick={() => navigate("/login")}>
                        Sign In
                      </Button>
                    </CardContent>
                  </Card>
                )}

                {/* Individual Reviews */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Recent Reviews</h3>
                  {loadingReviews ? (
                    <div className="py-8 text-center">
                      <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">Loading reviews...</p>
                    </div>
                  ) : reviews.length > 0 ? (
                    reviews.map((review) => (
                      <Card key={review._id}>
                        <CardContent className="p-6">
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                                {review.user.firstName[0]}{review.user.lastName[0]}
                              </div>
                              <div>
                                <p className="font-medium">{review.user.firstName} {review.user.lastName}</p>
                                <p className="text-xs text-muted-foreground">
                                  {new Date(review.createdAt).toLocaleDateString(undefined, {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                  })}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center bg-success/10 text-success px-2 py-0.5 rounded text-sm font-medium">
                              {review.rating}
                              <Star className="h-3 w-3 fill-current ml-1" />
                            </div>
                          </div>
                          {review.title && <h4 className="font-bold mb-2">{review.title}</h4>}
                          <p className="text-muted-foreground whitespace-pre-wrap">{review.comment}</p>

                          {user && (user._id === review.user._id || (user as any).isAdmin) && (
                            <div className="mt-4 flex justify-end">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                onClick={() => handleDeleteReview(review._id)}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </Button>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <div className="py-12 text-center border rounded-lg border-dashed">
                      <p className="text-muted-foreground">No reviews yet. Be the first to review this product!</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProductDetail;