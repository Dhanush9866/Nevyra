import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star, Heart, Share2, ShoppingCart, Truck, Shield, RotateCcw, Plus, Minus } from "lucide-react";
import phoneProduct from "@/assets/phone-product.jpg";

const product = {
  id: 1,
  name: "Latest Smartphone Pro Max 256GB",
  images: [phoneProduct, phoneProduct, phoneProduct, phoneProduct],
  originalPrice: 35999,
  salePrice: 29999,
  discount: 17,
  rating: 4.5,
  totalReviews: 1250,
  inStock: true,
  seller: "TechCorp Official Store",
  warranty: "1 Year Manufacturer Warranty",
  specifications: {
    "Display": "6.7-inch Super Retina XDR",
    "Processor": "A17 Pro Chip",
    "Storage": "256GB",
    "Camera": "48MP Triple Camera System",
    "Battery": "4323mAh",
    "OS": "iOS 17",
    "Color": "Space Black",
    "Weight": "240g"
  }
};

const reviews = [
  {
    id: 1,
    user: "Rajesh K.",
    rating: 5,
    date: "15 Dec 2023",
    comment: "Excellent phone! Camera quality is outstanding and battery lasts all day.",
    helpful: 12
  },
  {
    id: 2,
    user: "Priya S.",
    rating: 4,
    date: "12 Dec 2023",
    comment: "Good performance but a bit expensive. Overall satisfied with the purchase.",
    helpful: 8
  },
  {
    id: 3,
    user: "Amit M.",
    rating: 5,
    date: "10 Dec 2023",
    comment: "Fast delivery and genuine product. Highly recommend this seller.",
    helpful: 15
  }
];

const ProductDetail = () => {
  const { productId } = useParams();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [pincode, setPincode] = useState("");
  const [isWishlisted, setIsWishlisted] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };

  const handleBuyNow = () => {
    if (!user) {
      toast({
        title: "Login required",
        description: "Please log in to buy now.",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }
    navigate("/checkout", { state: { product } });
  };

  return (
    <div className="min-h-screen bg-background font-roboto">
      <Navbar />
      
      <div className="container mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <nav className="text-sm text-muted-foreground mb-6">
          Home / Mobiles / Smartphones / {product.name}
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative">
              <img 
                src={product.images[selectedImage]} 
                alt={product.name}
                className="w-full h-96 object-cover rounded-lg border border-border"
              />
              <Badge className="absolute top-4 left-4 bg-discount text-white text-lg px-3 py-1">
                {product.discount}% OFF
              </Badge>
            </div>
            <div className="flex gap-2 overflow-x-auto">
              {product.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`${product.name} ${index + 1}`}
                  className={`w-20 h-20 object-cover rounded-lg border-2 cursor-pointer ${
                    selectedImage === index ? 'border-primary' : 'border-border'
                  }`}
                  onClick={() => setSelectedImage(index)}
                />
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                {product.name}
              </h1>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <div className="flex items-center bg-success text-success-foreground px-2 py-1 rounded text-sm font-medium">
                    {product.rating}
                    <Star className="h-3 w-3 fill-current ml-1" />
                  </div>
                  <span className="text-muted-foreground text-sm">
                    {product.totalReviews.toLocaleString()} reviews
                  </span>
                </div>
                <Badge variant="outline" className="text-success border-success">
                  In Stock
                </Badge>
              </div>
            </div>

            {/* Pricing */}
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-price">₹{product.salePrice.toLocaleString()}</span>
                <span className="text-xl text-muted-foreground line-through">₹{product.originalPrice.toLocaleString()}</span>
                <Badge className="bg-discount text-white">{product.discount}% off</Badge>
              </div>
              <p className="text-sm text-muted-foreground">Inclusive of all taxes</p>
            </div>

            {/* Delivery Check */}
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold text-foreground mb-3">Delivery Options</h3>
                <div className="flex gap-2 mb-3">
                  <Input
                    placeholder="Enter pincode"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    className="flex-1"
                  />
                  <Button variant="outline">Check</Button>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Truck className="h-4 w-4 text-success" />
                    <span>Free delivery by tomorrow</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <RotateCcw className="h-4 w-4 text-primary" />
                    <span>7 days replacement policy</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-primary" />
                    <span>2 year warranty</span>
                  </div>
                </div>
              </CardContent>
            </Card>

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
                <Button className="flex-1 bg-warning hover:bg-warning/90 text-warning-foreground font-medium text-lg py-6">
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Add to Cart
                </Button>
                <Button className="flex-1 bg-primary hover:bg-primary-hover text-primary-foreground font-medium text-lg py-6" onClick={handleBuyNow}>
                  Buy Now
                </Button>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setIsWishlisted(!isWishlisted)}
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

        {/* Product Details Tabs */}
        <Tabs defaultValue="description" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="reviews">Reviews ({product.totalReviews})</TabsTrigger>
          </TabsList>
          

          
          <TabsContent value="description" className="space-y-4">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-foreground mb-4">Product Description</h3>
                <div className="prose prose-gray max-w-none">
                  <p className="text-muted-foreground">
                    Experience the future of mobile technology with the Latest Smartphone Pro Max. 
                    Featuring cutting-edge A17 Pro chip technology, this device delivers unprecedented 
                    performance for gaming, photography, and productivity.
                  </p>
                  <p className="text-muted-foreground">
                    The 48MP camera system captures stunning photos and videos in any lighting condition, 
                    while the 6.7-inch Super Retina XDR display provides vibrant colors and crystal-clear detail.
                  </p>
                  <p className="text-muted-foreground">
                    With 256GB of storage and all-day battery life, this smartphone is perfect for users 
                    who demand the best in mobile technology.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="reviews" className="space-y-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-semibold text-foreground">Customer Reviews</h3>
                  <Button variant="outline">Write a Review</Button>
                </div>
                
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <div key={review.id} className="border-b border-border pb-4 last:border-b-0">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex items-center bg-success text-success-foreground px-2 py-1 rounded text-sm">
                          {review.rating}
                          <Star className="h-3 w-3 fill-current ml-1" />
                        </div>
                        <span className="font-medium text-foreground">{review.user}</span>
                        <span className="text-sm text-muted-foreground">{review.date}</span>
                      </div>
                      <p className="text-muted-foreground mb-2">{review.comment}</p>
                      <p className="text-sm text-muted-foreground">
                        {review.helpful} people found this helpful
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
};

export default ProductDetail;