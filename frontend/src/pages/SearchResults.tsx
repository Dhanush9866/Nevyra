import { useState, useEffect } from "react";
import { Search, ArrowLeft, Filter, Grid, List, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";
import { apiService } from "@/lib/api";
import { Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";

// No mock data needed anymore

const SearchResults = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

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
      const response = await apiService.getProducts({ search: query, limit: 50 });
      if (response.success) {
        setResults(response.data);
      }
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleProductClick = (productId: number) => {
    navigate(`/product/${productId}`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background border-b border-border">
        <div className="flex items-center p-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="mr-2 p-1"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>

          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search for products, brands and more"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border-none focus-visible:ring-primary/20 rounded-xl"
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleSearch(searchQuery);
                }
              }}
            />
          </div>

          {/* Logo */}
          <Link to="/" className="ml-2 flex items-center">
            <img
              src="/zythova-logo.png"
              alt="Zythova Logo"
              className="h-8 w-auto object-contain"
            />
          </Link>
        </div>
      </div>

      {/* Results Header */}
      <div className="px-3 py-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h1 className="text-base font-semibold text-foreground">
              Search Results for "{searchQuery}"
            </h1>
            <p className="text-xs text-muted-foreground mt-1">
              {results.length} results found
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center space-x-1 text-xs px-2 py-1"
            >
              <Filter className="h-3 w-3" />
              <span className="hidden sm:inline">Filter</span>
            </Button>

            <div className="flex border border-border rounded-md">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="rounded-r-none p-1"
              >
                <Grid className="h-3 w-3" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="rounded-l-none p-1"
              >
                <List className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="p-3 max-w-7xl mx-auto">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
            <p className="text-slate-500 font-medium">Scanning catalog for "{searchQuery}"...</p>
          </div>
        ) : results.length > 0 ? (
          <div className={viewMode === "grid" ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4" : "space-y-3"}>
            {results.map((product) => (
              <Card
                key={product.id}
                className="cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-slate-100 overflow-hidden group"
                onClick={() => handleProductClick(product.id)}
              >
                <CardContent className="p-0">
                  <div className={viewMode === "grid" ? "flex flex-col" : "flex p-3 gap-4"}>
                    <div className={viewMode === "grid" ? "aspect-square w-full relative overflow-hidden bg-slate-50" : "w-32 h-32 flex-shrink-0 relative overflow-hidden bg-slate-50 rounded-xl"}>
                      <img
                        src={product.images?.[0] || "https://via.placeholder.com/300"}
                        alt={product.title}
                        className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>

                    <div className={viewMode === "grid" ? "p-4 space-y-2" : "flex-1 py-2 space-y-2"}>
                      <h3 className="font-bold text-sm line-clamp-2 text-slate-800 leading-tight h-10 group-hover:text-primary transition-colors">
                        {product.title}
                      </h3>

                      <div className="flex items-center gap-1">
                        <div className="flex items-center px-1.5 py-0.5 rounded bg-green-600 text-[10px] font-bold text-white">
                          <span>{product.rating || "4.1"}</span>
                          <Star className="h-2 w-2 ml-0.5 fill-current" />
                        </div>
                        <span className="text-[10px] text-slate-400 font-medium whitespace-nowrap">
                          ({product.reviews?.length || 0} reviews)
                        </span>
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <p className="font-black text-lg text-slate-900">
                          ₹{product.price}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 px-4">
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <h2 className="text-lg font-semibold mb-2 text-foreground">No results found</h2>
            <p className="text-sm text-muted-foreground mb-4">
              We couldn't find any products matching "{searchQuery}"
            </p>
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Try:</p>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Using different keywords</li>
                <li>• Checking your spelling</li>
                <li>• Using more general terms</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults; 