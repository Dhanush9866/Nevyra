import { useState, useEffect } from "react";
import { Search, ArrowLeft, Filter, Grid, List, Star, ShoppingCart, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { useIsMobile } from "@/hooks/use-mobile";
import { apiService } from "@/lib/api";
import Navbar from "@/components/Navbar";
import { useToast } from "@/hooks/use-toast";

const SearchResults = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [addingId, setAddingId] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isMobile = useIsMobile();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState([0, 1000000]);

  useEffect(() => {
    const query = searchParams.get("q");
    if (query) {
      setSearchQuery(query);
      fetchResults(query);
    }
  }, [searchParams]);

  const fetchResults = async (query: string) => {
    setLoading(true);
    try {
      const response = await apiService.getProducts({ search: query, limit: 100 });
      if (response.success) {
        const mappedResults = response.data.map((p: any) => ({
          ...p,
          id: p.id || p._id,
          mrp: p.originalPrice || p.price
        }));
        setResults(mappedResults);
      }
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (e: React.MouseEvent, productId: string) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      setAddingId(productId);
      const res = await apiService.addToCart(productId, 1);
      if (res.success) {
        window.dispatchEvent(new Event("cart-updated"));
        toast({
          title: "Success",
          description: "Added to cart successfully",
        });
      } else {
        throw new Error(res.message || "Failed to add to cart");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add to cart",
        variant: "destructive",
      });
    } finally {
      setAddingId(null);
    }
  };

  const availableCategories = Array.from(new Set(results.map(r => r.category))).filter(Boolean);

  const filteredResults = results.filter(product => {
    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(product.category);
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
    return matchesCategory && matchesPrice;
  });

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleSearch = (query: string) => {
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <div className="min-h-screen bg-background font-roboto">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Sidebar Filters */}
          {!isMobile && (
            <div className="w-64 flex-shrink-0 space-y-6">
              <div className="bg-card border-b pb-4">
                <h3 className="font-bold text-lg mb-3">Categories</h3>
                <div className="space-y-2">
                  {availableCategories.length > 0 ? availableCategories.map(cat => (
                    <div key={cat} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={cat}
                        checked={selectedCategories.includes(cat)}
                        onChange={() => handleCategoryToggle(cat)}
                        className="rounded border-gray-300 text-primary focus:ring-primary h-4 w-4"
                      />
                      <label htmlFor={cat} className="text-sm cursor-pointer hover:text-primary transition-colors">
                        {cat}
                      </label>
                    </div>
                  )) : (
                    <p className="text-xs text-muted-foreground italic">No category filters</p>
                  )}
                </div>
              </div>

              <div className="bg-card">
                <h3 className="font-bold text-lg mb-3">Price Range</h3>
                <div className="px-2">
                  <input
                    type="range"
                    min="0"
                    max="1000000"
                    step="1000"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                  <div className="flex justify-between text-xs mt-2 text-muted-foreground">
                    <span>₹0</span>
                    <span>₹{priceRange[1].toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Main Content */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  Search Results for "{searchQuery}"
                </h1>
                <p className="text-sm text-muted-foreground">
                  Showing {filteredResults.length} of {results.length} products
                </p>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex border rounded-md overflow-hidden bg-background shadow-sm">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className="rounded-none h-8 px-2"
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className="rounded-none h-8 px-2"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
                <p className="text-muted-foreground font-medium">Searching our catalog...</p>
              </div>
            ) : filteredResults.length > 0 ? (
              <div className={viewMode === "grid"
                ? "grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
                : "space-y-4"}>
                {filteredResults.map((product) => (
                  <div
                    key={product.id}
                    className={`group hover:shadow-xl transition-all duration-300 bg-card border border-border overflow-hidden rounded-sm ${viewMode === "list" ? "p-0" : ""
                      }`}
                  >
                    <div className={viewMode === "grid" ? "flex flex-col" : "flex p-4 gap-6"}>
                      <Link to={`/product/${product.id}`} className={viewMode === "grid" ? "block" : "flex flex-1 gap-6"}>
                        <div className={viewMode === "grid"
                          ? "relative aspect-square overflow-hidden bg-slate-50"
                          : "w-40 h-40 flex-shrink-0 relative bg-slate-50 overflow-hidden"}>
                          <img
                            src={product.images?.[0] || "/placeholder.svg"}
                            alt={product.title}
                            className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>

                        <div className={viewMode === "grid" ? "p-3 pb-0" : "flex-1"}>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] font-bold text-primary uppercase bg-primary/5 px-1.5 py-0.5 rounded leading-none">
                              {product.category}
                            </span>
                          </div>

                          <h3 className="font-semibold text-foreground mb-1 font-roboto group-hover:text-primary transition-colors line-clamp-2 text-sm leading-snug h-10">
                            {product.title}
                          </h3>

                          <div className="flex items-center gap-2 mb-2">
                            <div className="flex items-center px-1.5 py-0.5 rounded bg-green-600 text-[10px] font-bold text-white">
                              {product.rating || 4.5} <Star className="h-2 w-2 ml-0.5 fill-current" />
                            </div>
                            <span className="text-xs text-muted-foreground font-medium">
                              ({(product.reviewsCount || product.reviews?.length || 0).toLocaleString()} reviews)
                            </span>
                          </div>

                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-lg font-bold text-foreground">
                              ₹{product.price.toLocaleString()}
                            </span>
                            {product.mrp && product.mrp > product.price && (
                              <>
                                <span className="text-xs text-muted-foreground line-through">
                                  ₹{product.mrp.toLocaleString()}
                                </span>
                                <span className="text-[10px] font-bold text-discount">
                                  {Math.round(((product.mrp - product.price) / product.mrp) * 100)}% off
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </Link>

                      <div className={viewMode === "grid" ? "p-3 pt-0" : "w-48 self-center"}>
                        <Button
                          className="w-full bg-primary hover:bg-primary-hover text-white text-xs font-bold py-2 rounded-none transition-all"
                          onClick={(e) => handleAddToCart(e, product.id)}
                          disabled={addingId === product.id}
                        >
                          {addingId === product.id ? (
                            <>
                              <Loader2 className="h-3 w-3 animate-spin mr-2" />
                              Adding...
                            </>
                          ) : (
                            <>
                              <ShoppingCart className="h-3 w-3 mr-1.5" />
                              Add to Cart
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-muted/20 rounded-xl border border-dashed">
                <Search className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2">No matching products</h2>
                <p className="text-muted-foreground max-w-sm mx-auto">
                  We couldn't find anything for "{searchQuery}". Try different keywords or check out our best sellers.
                </p>
                <Button variant="outline" className="mt-6" onClick={() => navigate("/")}>
                  Go back home
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResults;