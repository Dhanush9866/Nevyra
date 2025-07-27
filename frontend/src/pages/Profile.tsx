import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Phone, MapPin, CreditCard, Shield, Bell, ShoppingCart, Heart, Package, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { getWishlist } from "@/lib/wishlist";
import { getCart } from "@/lib/cart";

export default function Profile() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [editProfile, setEditProfile] = useState<any>(null);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [cartItemCount, setCartItemCount] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    fetch("http://localhost:8000/api/auth/profile", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.success) {
          setError(data.message || "Failed to fetch profile");
        } else {
          setProfile(data.data);
          setEditProfile(data.data); // initialize editable state
        }
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch profile");
        setLoading(false);
      });
  }, [navigate]);

  // Update wishlist and cart counts
  useEffect(() => {
    const updateWishlistCount = () => {
      setWishlistCount(getWishlist().length);
    };
    const updateCartCount = () => {
      setCartItemCount(getCart().reduce((sum, item) => sum + item.quantity, 0));
    };
    
    updateWishlistCount();
    updateCartCount();
    
    window.addEventListener("storage", updateWishlistCount);
    window.addEventListener("wishlistUpdated", updateWishlistCount);
    window.addEventListener("storage", updateCartCount);
    window.addEventListener("cartUpdated", updateCartCount);
    
    return () => {
      window.removeEventListener("storage", updateWishlistCount);
      window.removeEventListener("wishlistUpdated", updateWishlistCount);
      window.removeEventListener("storage", updateCartCount);
      window.removeEventListener("cartUpdated", updateCartCount);
    };
  }, []);

  if (loading) return <div className="text-center py-12">Loading profile...</div>;
  if (error) return <div className="text-center py-12 text-destructive">{error}</div>;

  const userStats = [
    { label: "Total Orders", value: "24", icon: "📦" },
    { label: "Saved Items", value: wishlistCount.toString(), icon: "❤️" },
    { label: "Cart Items", value: cartItemCount.toString(), icon: "🛒" },
    { label: "Member Since", value: profile?.createdAt?.slice(0, 4) || "-", icon: "🎉" },
  ];

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditProfile({ ...editProfile, [e.target.id]: e.target.value });
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const response = await fetch("http://localhost:8000/api/auth/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          firstName: editProfile.firstName,
          lastName: editProfile.lastName,
          phone: editProfile.phone,
          email: editProfile.email,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        toast({ title: "Update failed", description: data.message || "Could not update profile", variant: "destructive" });
        return;
      }
      setProfile(data.data);
      setEditProfile(data.data);
      toast({ title: "Profile updated", description: "Your profile was updated successfully." });
    } catch {
      toast({ title: "Update failed", description: "Could not update profile", variant: "destructive" });
    }
  };

  return (
    <div className="page-transition">
      <PageHeader 
        title={`Welcome, ${profile?.firstName || "User"}`} 
        subtitle="Manage your account settings and preferences"
      />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* User Stats */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {userStats.map((stat, index) => (
                <Card key={index} className="text-center">
                  <CardContent className="p-6">
                    <div className="text-2xl mb-2">{stat.icon}</div>
                    <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <Card className="cursor-pointer hover:shadow-lg transition-all duration-300" onClick={() => navigate("/orders")}>
                <CardContent className="p-6 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <Package className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">My Orders</h3>
                      <p className="text-sm text-muted-foreground">Track your orders</p>
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground" />
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-lg transition-all duration-300" onClick={() => navigate("/wishlist")}>
                <CardContent className="p-6 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-pink-100 rounded-lg">
                      <Heart className="h-6 w-6 text-pink-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Wishlist</h3>
                      <p className="text-sm text-muted-foreground">{wishlistCount} saved items</p>
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground" />
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-lg transition-all duration-300" onClick={() => navigate("/cart")}>
                <CardContent className="p-6 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-green-100 rounded-lg">
                      <ShoppingCart className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Shopping Cart</h3>
                      <p className="text-sm text-muted-foreground">{cartItemCount} items</p>
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground" />
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Profile Information */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <form onSubmit={handleProfileUpdate} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" value={editProfile?.firstName || ""} onChange={handleProfileChange} />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" value={editProfile?.lastName || ""} onChange={handleProfileChange} />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" value={editProfile?.email || ""} onChange={handleProfileChange} />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" value={editProfile?.phone || ""} onChange={handleProfileChange} />
                  </div>
                  <Button className="w-full" type="submit">Update Profile</Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  Shipping Address
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="address">Street Address</Label>
                  <Input id="address" defaultValue="123 Main Street" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input id="city" defaultValue="New York" />
                  </div>
                  <div>
                    <Label htmlFor="zipCode">ZIP Code</Label>
                    <Input id="zipCode" defaultValue="10001" />
                  </div>
                </div>
                <Button variant="outline" className="w-full">Update Address</Button>
              </CardContent>
            </Card>
          </div>

          {/* Account Settings */}
          <div className="space-y-6">
            

            

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="h-5 w-5 mr-2" />
                  Notifications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Order Updates</span>
                  <Button variant="outline" size="sm">Enabled</Button>
                </div>
                <div className="flex items-center justify-between">
                  <span>Promotions</span>
                  <Button variant="outline" size="sm">Enabled</Button>
                </div>
                <div className="flex items-center justify-between">
                  <span>Newsletter</span>
                  <Button variant="outline" size="sm">Disabled</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}