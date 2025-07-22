import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, ShoppingCart, User, Heart, Search, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { getWishlist } from "@/lib/wishlist";
import { getCart } from "@/lib/cart";
import { useRef } from "react";

const navItems = [
  { name: "Home", path: "/" },
  { name: "Products", path: "/categories" },
  { name: "Orders", path: "/orders" },
];

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("Select Location");
  const [wishlistCount, setWishlistCount] = useState(0);
  const [cartItemCount, setCartItemCount] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [allProducts, setAllProducts] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const searchInputRefDesktop = useRef(null);
  const searchInputRefMobile = useRef(null);

  const isActive = (path: string) => location.pathname === path;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const updateWishlistCount = () => {
      setWishlistCount(getWishlist().length);
    };
    updateWishlistCount();
    window.addEventListener("storage", updateWishlistCount);
    window.addEventListener("wishlistUpdated", updateWishlistCount);
    return () => {
      window.removeEventListener("storage", updateWishlistCount);
      window.removeEventListener("wishlistUpdated", updateWishlistCount);
    };
  }, []);

  useEffect(() => {
    const updateCartCount = () => {
      setCartItemCount(getCart().reduce((sum, item) => sum + item.quantity, 0));
    };
    updateCartCount();
    window.addEventListener("storage", updateCartCount);
    window.addEventListener("cartUpdated", updateCartCount);
    return () => {
      window.removeEventListener("storage", updateCartCount);
      window.removeEventListener("cartUpdated", updateCartCount);
    };
  }, []);

  useEffect(() => {
    const onStorage = () => setIsLoggedIn(!!localStorage.getItem("token"));
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // Fetch all products on mount
  useEffect(() => {
    setSearchLoading(true);
    fetch("http://localhost:8000/api/products/all")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          setAllProducts(data.data);
        }
        setSearchLoading(false);
      })
      .catch(() => setSearchLoading(false));
  }, []);

  // Filter products as user types
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }
    setIsSearching(true);
    const q = searchQuery.toLowerCase();
    const results = allProducts.filter(
      (p) =>
        p.title?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q) ||
        p.subcategory?.toLowerCase().includes(q)
    );
    setSearchResults(results.slice(0, 8)); // limit to 8 results
  }, [searchQuery, allProducts]);

  // Hide dropdown on outside click
  useEffect(() => {
    function handleClick(e) {
      if (
        searchInputRefDesktop.current &&
        !searchInputRefDesktop.current.contains(e.target)
      ) {
        setSearchFocused(false);
      }
      if (
        searchInputRefMobile.current &&
        !searchInputRefMobile.current.contains(e.target)
      ) {
        setSearchFocused(false);
      }
    }
    if (searchFocused) {
      document.addEventListener("mousedown", handleClick);
    } else {
      document.removeEventListener("mousedown", handleClick);
    }
    return () => document.removeEventListener("mousedown", handleClick);
  }, [searchFocused]);

  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    setIsLoggedIn(false);
    navigate("/");
  };

  return (
    <nav className={`bg-background border-b border-border sticky top-0 z-50 transition-all duration-300 ${
      isScrolled ? "shadow-lg bg-background/95 backdrop-blur-sm" : ""
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 flex-shrink-0">
            <img src="/logo.jpg" alt="Nevyra Logo" className="w-8 h-8 rounded-lg object-contain" />
            <span className="text-xl font-bold text-foreground hidden sm:block">Nevyra</span>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8 relative">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                ref={searchInputRefDesktop}
                type="search"
                placeholder="Search products, brands, categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 w-full"
                onFocus={() => setSearchFocused(true)}
                autoComplete="off"
              />
              {/* Dropdown */}
              {searchFocused && searchQuery && (
                <div className="absolute left-0 right-0 mt-2 bg-background border border-border rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
                  {searchLoading ? (
                    <div className="p-4 text-center text-muted-foreground">Loading...</div>
                  ) : isSearching && searchResults.length === 0 ? (
                    <div className="p-4 text-center text-muted-foreground">No products found</div>
                  ) : (
                    searchResults.map((product) => (
                      <div
                        key={product.id}
                        className="flex items-center gap-3 px-4 py-2 hover:bg-muted transition-colors border-b last:border-b-0"
                      >
                        <img
                          src={product.image}
                          alt={product.title}
                          className="w-10 h-10 object-cover rounded cursor-pointer"
                          onClick={() => {
                            navigate(`/products/${product.id}`);
                            setTimeout(() => setSearchFocused(false), 200);
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <span
                            className="font-medium truncate text-primary hover:underline cursor-pointer"
                            onMouseDown={e => {
                              e.preventDefault();
                              e.stopPropagation();
                              const params = new URLSearchParams();
                              params.set("q", product.title);
                              if (product.category) params.set("category", product.category);
                              if (product.subcategory) params.set("subcategory", product.subcategory);
                              console.log("Navigating to search:", params.toString());
                              navigate(`/search?${params.toString()}`);
                              setSearchFocused(false);
                              setSearchQuery(""); // Clear the search bar
                              if (searchInputRefDesktop.current) searchInputRefDesktop.current.blur();
                              if (searchInputRefMobile.current) searchInputRefMobile.current.blur();
                            }}
                          >
                            {product.title}
                          </span>
                          <div className="text-xs text-muted-foreground truncate">{product.category}</div>
                        </div>
                        <div
                          className="font-semibold whitespace-nowrap cursor-pointer"
                          onClick={() => {
                            navigate(`/products/${product.id}`);
                            setTimeout(() => setSearchFocused(false), 200);
                          }}
                        >
                          ₹{product.price}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>

          

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-link ${
                  isActive(item.path) ? "nav-link-active" : "nav-link-inactive"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-3">
            <Link to="/wishlist" className="relative p-2 hover:bg-muted rounded-lg transition-colors">
              <Heart className="h-5 w-5" />
              {wishlistCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs">
                  {wishlistCount}
                </Badge>
              )}
            </Link>
            <Link to="/cart" className="relative p-2 hover:bg-muted rounded-lg transition-colors">
              <ShoppingCart className="h-5 w-5" />
              {cartItemCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs">
                  {cartItemCount}
                </Badge>
              )}
            </Link>
            <Link to="/profile" className="p-2 hover:bg-muted rounded-lg transition-colors">
              <User className="h-5 w-5" />
            </Link>
            {isLoggedIn ? (
              <Button size="sm" variant="outline" onClick={handleSignOut}>
                Sign Out
              </Button>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/login">Sign In</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link to="/signup">Sign Up</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <Link to="/cart" className="relative p-2">
              <ShoppingCart className="h-5 w-5" />
              {cartItemCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center text-xs">
                  {cartItemCount}
                </Badge>
              )}
            </Link>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              className="p-2"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden pb-3 relative">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              ref={searchInputRefMobile}
              type="search"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 w-full"
              onFocus={() => setSearchFocused(true)}
              autoComplete="off"
            />
            {/* Dropdown */}
            {searchFocused && searchQuery && (
              <div className="absolute left-0 right-0 mt-2 bg-background border border-border rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
                {searchLoading ? (
                  <div className="p-4 text-center text-muted-foreground">Loading...</div>
                ) : isSearching && searchResults.length === 0 ? (
                  <div className="p-4 text-center text-muted-foreground">No products found</div>
                ) : (
                  searchResults.map((product) => (
                    <Link
                      to={`/products/${product.id}`}
                      key={product.id}
                      className="flex items-center gap-3 px-4 py-2 hover:bg-muted transition-colors border-b last:border-b-0"
                      onClick={() => {
                        navigate(`/products/${product.id}`);
                        setTimeout(() => setSearchFocused(false), 100);
                      }}
                    >
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-10 h-10 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{product.title}</div>
                        <div className="text-xs text-muted-foreground truncate">{product.category}</div>
                      </div>
                      <div className="font-semibold whitespace-nowrap">₹{product.price}</div>
                    </Link>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden border-t border-border">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive(item.path)
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="border-t pt-2 mt-2">
              <Link
                to="/wishlist"
                className="flex items-center px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:text-foreground hover:bg-muted"
                onClick={() => setIsOpen(false)}
              >
                <Heart className="h-5 w-5 mr-3" />
                Wishlist ({wishlistCount})
              </Link>
              <Link
                to="/profile"
                className="flex items-center px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:text-foreground hover:bg-muted"
                onClick={() => setIsOpen(false)}
              >
                <User className="h-5 w-5 mr-3" />
                Profile
              </Link>
            </div>
            <div className="border-t pt-2 mt-2 space-y-2">
              <Link
                to="/login"
                className="flex items-center px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:text-foreground hover:bg-muted"
                onClick={() => setIsOpen(false)}
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="flex items-center px-3 py-2 rounded-md text-base font-medium bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={() => setIsOpen(false)}
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};