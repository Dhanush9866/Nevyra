import { Search, User, ShoppingCart, Menu, ChevronDown, X, LogOut, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/hooks/useAuth";
import { apiService } from "@/lib/api";

const categories = [
  {
    name: "Medical & Pharmacy",
    subcategories: [
      "Personal Care",
      "Skin Care",
      "Hair Care",
      "Makeup",
      "Foot, Hand & Nail Care",
      "Salon Equipment",
      "Shave & Hair Removal",
      "Fragrance",
    ],
  },
  {
    name: "Groceries",
    subcategories: ["General food items", "Daily essentials"],
  },
  {
    name: "Fashion & Beauty",
    subcategories: [
      {
        name: "Clothing",
        items: ["Menswear", "Women's Wear", "Kids Wear"]
      },
      {
        name: "Shoes",
        items: ["Men's", "Women's", "Kids"]
      },
      {
        name: "Accessories",
        items: ["Watches", "Luggage"]
      }
    ],
  },
  {
    name: "Devices",
    subcategories: [
      "Cell Phones & Accessories",
      "Laptops",
      "Televisions",
      "Refrigerators",
      "Smart Watches",
    ],
  },
  {
    name: "Electrical",
    subcategories: [
      "Solar Panels",
      "Solar Fencing Kit",
      "Batteries",
      "Transformers",
      "Wiring Cables",
      "LED Bulbs",
      "Tube Lights",
      "Ceiling Fan",
    ],
  },
  {
    name: "Automotive",
    subcategories: [
      "Bike Accessories",
      "Car Accessories",
      "Engine Oil",
      "Brake Fluid",
      "Air Filter",
    ],
  },
  {
    name: "Sports",
    subcategories: [
      "Cricket Bats",
      "Cricket Balls",
      "Stumps",
      "Cricket Kit",
      "Volleyball",
      "Volleyball Net",
    ],
  },
  {
    name: "Home Interior",
    subcategories: [
      "Gypsum False Ceiling",
      "Cove Lights",
      "Main Door",
      "Wall Paint",
      "Wallpaper",
      "Curtains",
      "Wall Tiles",
    ],
  },
];

// Helper function to convert category name to URL-safe slug
const categoryToSlug = (categoryName: string): string => {
  return categoryName
    .toLowerCase()
    .replace(/\s*&\s*/g, '-and-')  // Replace & with -and-
    .replace(/\s+/g, '-');          // Replace spaces with hyphens
};

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { user, isAuthenticated, logout } = useAuth();
  const [cartCount, setCartCount] = useState(0);

  const refreshCartCount = async () => {
    try {
      const res = await apiService.getCart();
      if (res.success) setCartCount(res.data?.length || 0);
    } catch {
      setCartCount(0);
    }
  };

  useEffect(() => {
    refreshCartCount();
    const handler = () => refreshCartCount();
    window.addEventListener("cart-updated", handler as EventListener);
    return () => window.removeEventListener("cart-updated", handler as EventListener);
  }, []);

  const toggleCategory = (categoryName: string) => {
    setExpandedCategory(expandedCategory === categoryName ? null : categoryName);
  };

  const handleSearchFocus = () => {
    if (isMobile) {
      navigate("/search-suggestions");
    }
  };

  return (
    <div className="bg-background border-b border-border/40 font-roboto sticky top-0 z-50">
      {/* Main Navbar */}
      <div className="container mx-auto px-2 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden text-gray-800 hover:bg-cyan-200 p-1"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            <Link to="/" className="flex items-center space-x-2">
              <img
                src="/zythova-logo.png"
                alt="Zythova Logo"
                className="h-10 w-auto object-contain"
              />
              <span className="text-2xl font-bold text-foreground tracking-tight">Zythova</span>
            </Link>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl mx-4 hidden md:block">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search for products, brands and more"
                className="w-full pl-4 pr-12 py-2 bg-background text-foreground border border-gray-300 rounded-md focus:border-primary"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    const target = e.target as HTMLInputElement;
                    if (target.value.trim()) {
                      navigate(`/search?q=${encodeURIComponent(target.value.trim())}`);
                    }
                  }
                }}
              />
              <Button
                size="sm"
                className="absolute right-0 top-0 h-full px-4 bg-primary hover:bg-primary/90 text-primary-foreground rounded-l-none rounded-r-md"
                onClick={() => {
                  const input = document.querySelector('input[placeholder="Search for products, brands and more"]') as HTMLInputElement;
                  if (input && input.value.trim()) {
                    navigate(`/search?q=${encodeURIComponent(input.value.trim())}`);
                  }
                }}
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>


          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <Link to="/profile">
                <Button
                  variant="ghost"
                  className="text-gray-800 hover:bg-cyan-200 flex items-center space-x-1"
                >
                  <User className="h-4 w-4" />
                  <span className="text-sm hidden md:inline">{user?.firstName || 'Profile'}</span>
                </Button>
              </Link>
            ) : (
              <Link to="/auth">
                <Button
                  variant="ghost"
                  className="text-gray-800 hover:bg-cyan-200 flex items-center space-x-1"
                >
                  <User className="h-4 w-4" />
                  <span className="text-sm hidden md:inline">Login</span>
                </Button>
              </Link>
            )}
            <Link to="/cart">
              <Button
                className="bg-warning hover:bg-warning/90 text-warning-foreground flex items-center space-x-1 relative px-6 rounded-full font-medium"
              >
                <ShoppingCart className="h-4 w-4 mr-1" />
                <span className="text-sm hidden md:inline">Cart</span>
                {cartCount > 0 && (
                  <span className="ml-2 bg-white text-warning text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Button>
            </Link>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="mt-3 md:hidden">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search for products, brands and more"
              className="w-full pl-4 pr-12 py-2 bg-background text-foreground border border-gray-300 rounded-md focus:border-primary"
              onFocus={handleSearchFocus}
              readOnly
            />
            <Button
              size="sm"
              className="absolute right-0 top-0 h-full px-4 bg-primary hover:bg-primary/90 text-primary-foreground rounded-l-none rounded-r-md"
              onClick={handleSearchFocus}
            >
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Category Navigation */}
      <div className="bg-background border-t border-border">
        <div className="container mx-auto px-2">
          {/* Desktop Categories */}
          <div className="hidden md:flex items-center space-x-8 py-2">
            {categories.map((category) => (
              <HoverCard key={category.name} openDelay={0} closeDelay={0}>
                <HoverCardTrigger asChild>
                  <Link to={`/category/${categoryToSlug(category.name)}`}>
                    <Button
                      variant="ghost"
                      className="text-foreground hover:bg-muted flex items-center space-x-1"
                    >
                      <span className="text-sm">{category.name}</span>
                      <ChevronDown className="h-3 w-3" />
                    </Button>
                  </Link>
                </HoverCardTrigger>
                <HoverCardContent className="w-64 bg-popover border border-border p-0">
                  <div className="py-2">
                    {category.name === "Fashion & Beauty" ? (
                      // Special layout for Fashion & Beauty
                      <div className="px-4 py-2">
                        {category.subcategories.map((section, sectionIndex) => (
                          <div key={sectionIndex} className="mb-4">
                            <div className="font-medium text-popover-foreground mb-2 text-sm">
                              {section.name}
                            </div>
                            <div className="pl-4 space-y-1">
                              {section.items.map((item, itemIndex) => (
                                <div key={itemIndex} className="flex items-center">
                                  <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
                                  <Link
                                    to={`/category/${categoryToSlug(category.name)}`}
                                    className="text-xs text-popover-foreground hover:text-primary cursor-pointer"
                                  >
                                    {item}
                                  </Link>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      // Default layout for other categories
                      category.subcategories.map((subcategory, index) => (
                        <div
                          key={index}
                          className="px-4 py-2 text-popover-foreground hover:bg-accent cursor-pointer"
                        >
                          <Link
                            to={`/category/${categoryToSlug(category.name)}`}
                            className="w-full block"
                          >
                            {subcategory}
                          </Link>
                        </div>
                      ))
                    )}
                  </div>
                </HoverCardContent>
              </HoverCard>
            ))}
          </div>

          {/* Mobile Categories Quick Access */}
          <div className="md:hidden py-2 overflow-x-auto">
            <div className="flex space-x-2 min-w-max">
              {categories.map((category) => (
                <Link
                  key={category.name}
                  to={`/category/${categoryToSlug(category.name)}`}
                  className="whitespace-nowrap px-3 py-1 text-xs bg-muted hover:bg-muted/80 text-muted-foreground rounded-full transition-colors"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Mobile Category Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden py-4 space-y-2 max-h-[70vh] overflow-y-auto">
              {/* Mobile Login/User Links */}
              <div className="pb-4 border-b border-border">
                {isAuthenticated ? (
                  <>
                    <div className="px-4 py-2 text-sm text-muted-foreground">
                      Welcome, {user?.firstName} {user?.lastName}
                    </div>
                    <Link to="/profile">
                      <Button
                        variant="ghost"
                        className="text-gray-800 hover:bg-cyan-200 w-full justify-start"
                      >
                        <User className="h-4 w-4 mr-2" />
                        <span className="text-sm">Profile</span>
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      className="text-red-600 hover:bg-red-100 w-full justify-start"
                      onClick={() => {
                        logout();
                        navigate('/');
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      <span className="text-sm">Logout</span>
                    </Button>
                  </>
                ) : (
                  <Link to="/auth">
                    <Button
                      variant="ghost"
                      className="text-gray-800 hover:bg-cyan-200 w-full justify-start"
                    >
                      <User className="h-4 w-4 mr-2" />
                      <span className="text-sm">Login</span>
                    </Button>
                  </Link>
                )}
              </div>

              {/* Categories */}
              {categories.map((category) => (
                <div key={category.name} className="border-b border-border pb-2">
                  <div className="w-full flex items-center justify-between font-medium text-foreground mb-2 py-2 hover:bg-muted rounded px-2">
                    <Link
                      to={`/category/${categoryToSlug(category.name)}`}
                      className="flex-1"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <span>{category.name}</span>
                    </Link>
                    <button
                      onClick={() => toggleCategory(category.name)}
                      className="p-1"
                    >
                      <ChevronDown
                        className={`h-4 w-4 transition-transform ${expandedCategory === category.name ? 'rotate-180' : ''
                          }`}
                      />
                    </button>
                  </div>
                  {expandedCategory === category.name && (
                    <div className="space-y-1 pl-4 bg-muted/30 rounded p-2">
                      {category.name === "Fashion & Beauty" ? (
                        // Special mobile layout for Fashion & Beauty
                        category.subcategories.map((section, sectionIndex) => (
                          <div key={sectionIndex} className="mb-3">
                            <div className="font-medium text-foreground mb-2 text-sm">
                              {section.name}
                            </div>
                            <div className="pl-4 space-y-1">
                              {section.items.map((item, itemIndex) => (
                                <Link
                                  key={itemIndex}
                                  to={`/category/${categoryToSlug(category.name)}`}
                                  className="block text-xs text-muted-foreground hover:text-foreground py-1 px-2 rounded hover:bg-muted flex items-center"
                                  onClick={() => setIsMobileMenuOpen(false)}
                                >
                                  <span className="w-1.5 h-1.5 bg-primary rounded-full mr-2"></span>
                                  {item}
                                </Link>
                              ))}
                            </div>
                          </div>
                        ))
                      ) : (
                        // Default mobile layout for other categories
                        category.subcategories.map((subcategory, index) => (
                          <Link
                            key={index}
                            to={`/category/${categoryToSlug(category.name)}`}
                            className="block text-sm text-muted-foreground hover:text-foreground py-2 px-2 rounded hover:bg-muted"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            {subcategory}
                          </Link>
                        ))
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
