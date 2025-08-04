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

const orders = [
  {
    id: "NVR001234",
    date: "2023-12-15",
    status: "Delivered",
    total: 29999,
    items: [
      {
        name: "Latest Smartphone Pro Max",
        image: phoneProduct,
        quantity: 1,
        price: 29999
      }
    ]
  },
  {
    id: "NVR001235",
    date: "2023-12-10",
    status: "Shipped",
    total: 5998,
    items: [
      {
        name: "Premium Running Shoes",
        image: shoesProduct,
        quantity: 2,
        price: 2999
      }
    ]
  },
  {
    id: "NVR001236",
    date: "2023-12-05",
    status: "Processing",
    total: 69999,
    items: [
      {
        name: "Gaming Laptop Ultra",
        image: phoneProduct,
        quantity: 1,
        price: 69999
      }
    ]
  }
];

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
      
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-3">
                    <User className="h-10 w-10 text-primary-foreground" />
                  </div>
                  <h2 className="text-xl font-semibold text-foreground">Rajesh Kumar</h2>
                  <p className="text-muted-foreground">rajesh.kumar@email.com</p>
                </div>

                <nav className="space-y-2">
                  <Button
                    variant={activeTab === "orders" ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setActiveTab("orders")}
                  >
                    <Package className="h-4 w-4 mr-2" />
                    My Orders
                  </Button>
                  <Button
                    variant={activeTab === "wishlist" ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => navigate("/wishlist")}
                  >
                    <Heart className="h-4 w-4 mr-2" />
                    Wishlist
                  </Button>
                  <Button
                    variant={activeTab === "addresses" ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setActiveTab("addresses")}
                  >
                    <MapPin className="h-4 w-4 mr-2" />
                    Saved Addresses
                  </Button>
                  <Button
                    variant={activeTab === "profile" ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setActiveTab("profile")}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Account Settings
                  </Button>
                  <Separator className="my-4" />
                  <Button variant="ghost" className="w-full justify-start text-destructive">
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Orders Tab */}
            {activeTab === "orders" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h1 className="text-2xl font-bold text-foreground">My Orders</h1>
                  <span className="text-muted-foreground">{orders.length} orders</span>
                </div>

                <div className="space-y-4">
                  {orders.map((order) => (
                    <Card key={order.id}>
                      <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                          <div>
                            <h3 className="font-semibold text-foreground">Order #{order.id}</h3>
                            <p className="text-sm text-muted-foreground">Placed on {order.date}</p>
                          </div>
                          <div className="flex items-center gap-3 mt-2 md:mt-0">
                            <Badge className={getStatusColor(order.status)}>
                              {order.status}
                            </Badge>
                            <span className="font-medium">₹{order.total.toLocaleString()}</span>
                          </div>
                        </div>

                        <div className="space-y-3">
                          {order.items.map((item, index) => (
                            <div key={index} className="flex gap-4">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-16 h-16 object-cover rounded"
                              />
                              <div className="flex-1">
                                <h4 className="font-medium text-foreground">{item.name}</h4>
                                <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                                <p className="text-sm font-medium">₹{item.price.toLocaleString()}</p>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="flex gap-2 mt-4">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            View Details
                          </Button>
                          {order.status === "Delivered" && (
                            <>
                              <Button variant="outline" size="sm">
                                <Download className="h-4 w-4 mr-1" />
                                Invoice
                              </Button>
                              <Button variant="outline" size="sm">
                                <Star className="h-4 w-4 mr-1" />
                                Rate & Review
                              </Button>
                            </>
                          )}
                          {order.status === "Shipped" && (
                            <Button variant="outline" size="sm">
                              <Truck className="h-4 w-4 mr-1" />
                              Track Order
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Wishlist Tab */}
            {activeTab === "wishlist" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h1 className="text-2xl font-bold text-foreground">My Wishlist</h1>
                  <span className="text-muted-foreground">{wishlistItems.length} items</span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {wishlistItems.map((item) => (
                    <Card key={item.id} className="group hover:shadow-lg transition-shadow">
                      <CardContent className="p-4">
                        <div className="relative mb-4">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-48 object-cover rounded-lg"
                          />
                          <Badge className="absolute top-2 left-2 bg-discount text-white">
                            {item.discount}% OFF
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="absolute top-2 right-2 text-red-500 hover:text-red-600"
                          >
                            <Heart className="h-4 w-4 fill-current" />
                          </Button>
                        </div>

                        <h3 className="font-semibold text-foreground mb-2 line-clamp-2">
                          {item.name}
                        </h3>

                        <div className="flex items-center gap-2 mb-2">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">{item.rating}</span>
                        </div>

                        <div className="flex items-center gap-2 mb-4">
                          <span className="text-lg font-bold text-price">₹{item.price.toLocaleString()}</span>
                          <span className="text-sm text-muted-foreground line-through">₹{item.originalPrice.toLocaleString()}</span>
                        </div>

                        <Button className="w-full bg-primary hover:bg-primary-hover text-primary-foreground">
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
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h1 className="text-2xl font-bold text-foreground">Saved Addresses</h1>
                  <Button>Add New Address</Button>
                </div>

                <div className="space-y-4">
                  {addresses.map((address) => (
                    <Card key={address.id}>
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold text-foreground">{address.name}</h3>
                              {address.isDefault && (
                                <Badge variant="secondary">Default</Badge>
                              )}
                            </div>
                            <p className="text-muted-foreground mb-1">{address.address}</p>
                            <p className="text-muted-foreground">{address.phone}</p>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">Edit</Button>
                            <Button variant="outline" size="sm" className="text-destructive">Delete</Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Profile Tab */}
            {activeTab === "profile" && (
              <div className="space-y-6">
                <h1 className="text-2xl font-bold text-foreground">Account Settings</h1>

                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-xl font-semibold text-foreground mb-4">Personal Information</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="first-name">First Name</Label>
                        <Input id="first-name" defaultValue="Rajesh" />
                      </div>
                      <div>
                        <Label htmlFor="last-name">Last Name</Label>
                        <Input id="last-name" defaultValue="Kumar" />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" defaultValue="rajesh.kumar@email.com" />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input id="phone" type="tel" defaultValue="+91 9876543210" />
                      </div>
                      <div>
                        <Label htmlFor="dob">Date of Birth</Label>
                        <Input id="dob" type="date" defaultValue="1990-05-15" />
                      </div>
                      <div>
                        <Label htmlFor="gender">Gender</Label>
                        <Input id="gender" defaultValue="Male" />
                      </div>
                    </div>

                    <Button className="mt-6">Save Changes</Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-xl font-semibold text-foreground mb-4">Change Password</h2>
                    
                    <div className="space-y-4 max-w-md">
                      <div>
                        <Label htmlFor="current-password">Current Password</Label>
                        <Input id="current-password" type="password" />
                      </div>
                      <div>
                        <Label htmlFor="new-password">New Password</Label>
                        <Input id="new-password" type="password" />
                      </div>
                      <div>
                        <Label htmlFor="confirm-new-password">Confirm New Password</Label>
                        <Input id="confirm-new-password" type="password" />
                      </div>
                    </div>

                    <Button className="mt-6">Update Password</Button>
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