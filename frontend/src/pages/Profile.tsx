import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useIsMobile } from "@/hooks/use-mobile";
import { 
  User, 
  Package, 
  Heart, 
  MapPin, 
  Settings, 
  LogOut, 
  Eye, 
  Download,
  Star,
  Truck
} from "lucide-react";
import phoneProduct from "@/assets/phone-product.jpg";
import shoesProduct from "@/assets/shoes-product.jpg";



const wishlistItems = [
  {
    id: 1,
    name: "Wireless Earbuds Pro",
    image: phoneProduct,
    price: 4999,
    originalPrice: 7999,
    discount: 38,
    rating: 4.5,
    inStock: true
  },
  {
    id: 2,
    name: "Smart Watch Series 8",
    image: shoesProduct,
    price: 15999,
    originalPrice: 19999,
    discount: 20,
    rating: 4.3,
    inStock: true
  }
];

const addresses = [
  {
    id: 1,
    name: "Rajesh Kumar",
    address: "Flat 204, Sunrise Apartments, MG Road, Bengaluru - 560001",
    phone: "+91 9876543210",
    isDefault: true
  },
  {
    id: 2,
    name: "Rajesh Kumar (Office)",
    address: "Tech Park, Sector 5, Electronic City, Bengaluru - 560100",
    phone: "+91 9876543210",
    isDefault: false
  }
];

const Profile = () => {
  const [activeTab, setActiveTab] = useState("orders");
  const navigate = useNavigate();
  

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "bg-success text-success-foreground";
      case "shipped":
        return "bg-primary text-primary-foreground";
      case "processing":
        return "bg-warning text-warning-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="min-h-screen bg-background font-roboto">
      <Navbar />
      
      <div className="container mx-auto px-3 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-4">
                <div className="text-center mb-4">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-3">
                    <User className="h-8 w-8 text-primary-foreground" />
                  </div>
                </div>

                <nav className="space-y-2">
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-sm"
                    onClick={() => navigate("/orders")}
                  >
                    <Package className="h-4 w-4 mr-2" />
                    My Orders
                  </Button>
                  <Button
                    variant={activeTab === "wishlist" ? "default" : "ghost"}
                    className="w-full justify-start text-sm"
                    onClick={() => navigate("/wishlist")}
                  >
                    <Heart className="h-4 w-4 mr-2" />
                    Wishlist
                  </Button>
                  <Button
                    variant={activeTab === "addresses" ? "default" : "ghost"}
                    className="w-full justify-start text-sm"
                    onClick={() => setActiveTab("addresses")}
                  >
                    <MapPin className="h-4 w-4 mr-2" />
                    Saved Addresses
                  </Button>
                  <Button
                    variant={activeTab === "profile" ? "default" : "ghost"}
                    className="w-full justify-start text-sm"
                    onClick={() => setActiveTab("profile")}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Account Settings
                  </Button>
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">


            {/* Wishlist Tab */}
            {activeTab === "wishlist" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h1 className="text-xl font-bold text-foreground">My Wishlist</h1>
                  <span className="text-xs text-muted-foreground">{wishlistItems.length} items</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {wishlistItems.map((item) => (
                    <Card key={item.id} className="group hover:shadow-lg transition-shadow">
                      <CardContent className="p-3">
                        <div className="relative mb-3">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-32 object-cover rounded-lg"
                          />
                          <Badge className="absolute top-2 left-2 bg-discount text-white text-xs">
                            {item.discount}% OFF
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="absolute top-2 right-2 text-red-500 hover:text-red-600 p-1"
                          >
                            <Heart className="h-3 w-3 fill-current" />
                          </Button>
                        </div>

                        <h3 className="font-semibold text-sm text-foreground mb-2 line-clamp-2">
                          {item.name}
                        </h3>

                        <div className="flex items-center gap-1 mb-2">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs font-medium">{item.rating}</span>
                        </div>

                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-sm font-bold text-price">₹{item.price.toLocaleString()}</span>
                          <span className="text-xs text-muted-foreground line-through">₹{item.originalPrice.toLocaleString()}</span>
                        </div>

                        <Button className="w-full bg-primary hover:bg-primary-hover text-primary-foreground text-xs py-2">
                          Add to Cart
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Addresses Tab */}
            {activeTab === "addresses" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">

                        
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Profile Tab */}
            {activeTab === "profile" && (


                <Card>
                  <CardContent className="p-4">
                    <h2 className="text-lg font-semibold text-foreground mb-4">Personal Information</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                 
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <h2 className="text-lg font-semibold text-foreground mb-4">Change Password</h2>
                    
                    <div className="space-y-3 max-w-md">
                      <div>
                        <Label htmlFor="current-password" className="text-xs">Current Password</Label>
                        <Input id="current-password" type="password" className="text-sm" />
                      </div>
                      <div>
                        <Label htmlFor="new-password" className="text-xs">New Password</Label>
                        <Input id="new-password" type="password" className="text-sm" />
                      </div>
                      <div>
                        <Label htmlFor="confirm-new-password" className="text-xs">Confirm New Password</Label>
                        <Input id="confirm-new-password" type="password" className="text-sm" />
                      </div>
                    </div>

                    <Button className="mt-4 text-sm">Update Password</Button>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Profile;
