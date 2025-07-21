import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { PageHeader } from "@/components/PageHeader";
import { ProductCard } from "@/components/ProductCard";
import { Pagination } from "@/components/Pagination";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Filter, Grid, List, Star } from "lucide-react";

export default function Categories() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [allProducts, setAllProducts] = useState([]); // fetched from API
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || "all"
  );
  const [sortBy, setSortBy] = useState("popular");
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [minRating, setMinRating] = useState(0);
  const [showInStockOnly, setShowInStockOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const itemsPerPage = 12;

  // Categories for filter
  const categories = [
    { value: "all", label: "All Categories" },
    { value: "Medical", label: "Medical & Pharmacy" },
    { value: "Groceries", label: "Groceries" },
    { value: "FashionBeauty", label: "Fashion & Beauty" },
    { value: "Devices", label: "Devices" },
    { value: "Electrical", label: "Electrical" },
    { value: "Automotive", label: "Automotive" },
    { value: "Sports", label: "Sports" },
    { value: "HomeInterior", label: "Home Interior" },
  ];

  // Fetch products from backend API on mount
  useEffect(() => {
    setLoading(true);
    setError("");
    fetch("http://localhost:8000/api/products/all")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch products");
        return res.json();
      })
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          setAllProducts(data.data);
        } else {
          setError("Invalid data format from server");
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Error fetching products");
        setLoading(false);
      });
  }, []);

  // Filter and sort products
  useEffect(() => {
    let filtered = [...allProducts];

    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter((product) => {
        // Normalize category for comparison
        let cat = product.category?.toLowerCase();
        switch (selectedCategory) {
          case "Medical":
            return cat === "medical";
          case "Groceries":
            return cat === "groceries";
          case "FashionBeauty":
            return (
              cat === "fashion" ||
              cat === "beauty" ||
              cat === "fashion & beauty"
            );
          case "Devices":
            return cat === "devices";
          case "Electrical":
            return cat === "electrical";
          case "Automotive":
            return cat === "automotive";
          case "Sports":
            return cat === "sports";
          case "HomeInterior":
            return cat === "interior" || cat === "home interior";
          default:
            return true;
        }
      });
    }

    // Price range filter
    filtered = filtered.filter(
      (product) =>
        product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    // Rating filter
    filtered = filtered.filter((product) => (product.rating ?? 0) >= minRating);

    // Stock filter
    if (showInStockOnly) {
      filtered = filtered.filter((product) => product.inStock);
    }

    // Sort products
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        filtered.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
      case "popular":
        filtered.sort((a, b) => (b.popularity ?? 0) - (a.popularity ?? 0));
        break;
      case "rating":
        filtered.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
        break;
    }

    setFilteredProducts(filtered);
    setCurrentPage(1);
  }, [
    allProducts,
    selectedCategory,
    sortBy,
    priceRange,
    minRating,
    showInStockOnly,
  ]);

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  return (
    <div className="page-transition">
      <PageHeader
        title="All Products"
        subtitle="Discover our complete product collection"
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {loading && (
          <div className="text-center py-12">Loading products...</div>
        )}
        {error && <div className="text-center py-12 text-red-500">{error}</div>}
        {!loading && !error && (
          <>
            {/* Filter Bar */}
            <Card className="mb-6">
              <CardContent className="p-4">
                <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
                  {/* Results Count */}
                  <div className="text-sm text-muted-foreground">
                    {filteredProducts.length}{" "}
                    {filteredProducts.length === 1 ? "product" : "products"}{" "}
                    found
                  </div>
                  <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center flex-1">
                    {/* Category Filter */}
                    <div className="flex items-center space-x-2 min-w-0">
                      <Label className="text-sm font-medium whitespace-nowrap">
                        Category:
                      </Label>
                      <Select
                        value={selectedCategory}
                        onValueChange={setSelectedCategory}
                      >
                        <SelectTrigger className="w-48">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem
                              key={category.value}
                              value={category.value}
                            >
                              {category.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    {/* Sort By */}
                    <div className="flex items-center space-x-2 min-w-0">
                      <Label className="text-sm font-medium whitespace-nowrap">
                        Sort by:
                      </Label>
                      <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger className="w-40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="popular">Most Popular</SelectItem>
                          <SelectItem value="newest">Newest First</SelectItem>
                          <SelectItem value="price-low">
                            Price: Low to High
                          </SelectItem>
                          <SelectItem value="price-high">
                            Price: High to Low
                          </SelectItem>
                          <SelectItem value="rating">Highest Rated</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {/* Advanced Filters */}
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="flex items-center space-x-2"
                        >
                          <Filter className="h-4 w-4" />
                          <span>More Filters</span>
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-80 bg-background border shadow-lg z-50">
                        <div className="space-y-4">
                          {/* Price Range */}
                          <div>
                            <Label className="text-sm font-medium">
                              Price Range
                            </Label>
                            <Slider
                              value={priceRange}
                              onValueChange={setPriceRange}
                              max={500}
                              min={0}
                              step={10}
                              className="w-full mt-2"
                            />
                            <div className="flex justify-between text-xs text-muted-foreground mt-1">
                              <span>₹{priceRange[0]}</span>
                              <span>₹{priceRange[1]}</span>
                            </div>
                          </div>
                          {/* Rating Filter */}
                          <div>
                            <Label className="text-sm font-medium mb-2 block">
                              Minimum Rating
                            </Label>
                            <div className="flex space-x-1">
                              {[1, 2, 3, 4, 5].map((rating) => (
                                <Button
                                  key={rating}
                                  variant={
                                    minRating >= rating ? "default" : "outline"
                                  }
                                  size="sm"
                                  className="p-1 h-8 w-8"
                                  onClick={() =>
                                    setMinRating(
                                      rating === minRating ? 0 : rating
                                    )
                                  }
                                >
                                  <Star className="h-3 w-3" />
                                </Button>
                              ))}
                            </div>
                          </div>
                          {/* In Stock Filter */}
                          <div className="flex items-center space-x-2">
                            <Switch
                              id="in-stock"
                              checked={showInStockOnly}
                              onCheckedChange={setShowInStockOnly}
                            />
                            <Label
                              htmlFor="in-stock"
                              className="text-sm font-medium"
                            >
                              In Stock Only
                            </Label>
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                  {/* View Mode Toggle */}
                  <div className="flex items-center space-x-1 border rounded-lg p-1">
                    <Button
                      variant={viewMode === "grid" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("grid")}
                      className="h-8 w-8 p-0"
                    >
                      <Grid className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === "list" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("list")}
                      className="h-8 w-8 p-0"
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            {/* Product Grid */}
            <div
              className={`grid gap-6 ${
                viewMode === "grid"
                  ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                  : "grid-cols-1"
              }`}
            >
              {currentProducts.map((product, index) => (
                <div
                  key={product._id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <ProductCard product={product} viewMode={viewMode} />
                </div>
              ))}
            </div>
            {/* No Results */}
            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold mb-2">
                  No products found
                </h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your filters or search criteria
                </p>
                <Button
                  onClick={() => {
                    setSelectedCategory("all");
                    setPriceRange([0, 500]);
                    setMinRating(0);
                    setShowInStockOnly(false);
                  }}
                >
                  Clear All Filters
                </Button>
              </div>
            )}
            {/* Pagination */}
            {filteredProducts.length > 0 && (
              <div className="mt-8">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
