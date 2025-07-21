import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { ProductSidebar } from "@/components/ProductSidebar";
import { ProductFilters } from "@/components/ProductFilters";
import { ProductCard } from "@/components/ProductCard";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Pagination } from "@/components/Pagination";
import { Button } from "@/components/ui/button";
import { Filter, Grid, List } from "lucide-react";

// Removed mockProducts

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [selectedSubcategory, setSelectedSubcategory] = useState(searchParams.get('subcategory') || '');
  const [sortBy, setSortBy] = useState('popular');
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [minRating, setMinRating] = useState(0);
  const [showInStockOnly, setShowInStockOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const itemsPerPage = 12;

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
          setProducts(data.data);
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
    let filtered = [...products];

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Subcategory filter
    if (selectedSubcategory) {
      filtered = filtered.filter(product => product.subcategory === selectedSubcategory);
    }

    // Price range filter
    filtered = filtered.filter(product => 
      product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    // Rating filter
    filtered = filtered.filter(product => (product.rating ?? 0) >= minRating);

    // Stock filter
    if (showInStockOnly) {
      filtered = filtered.filter(product => product.inStock);
    }

    // Sort products
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        filtered.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
      case 'popular':
        filtered.sort((a, b) => (b.popularity ?? 0) - (a.popularity ?? 0));
        break;
      case 'rating':
        filtered.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
        break;
    }

    setFilteredProducts(filtered);
    setCurrentPage(1);
  }, [selectedCategory, selectedSubcategory, sortBy, priceRange, minRating, showInStockOnly, products]);

  // Update URL params
  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedCategory !== 'all') params.set('category', selectedCategory);
    if (selectedSubcategory) params.set('subcategory', selectedSubcategory);
    setSearchParams(params);
  }, [selectedCategory, selectedSubcategory, setSearchParams]);

  const handleCategoryChange = (category: string, subcategory?: string) => {
    setSelectedCategory(category);
    setSelectedSubcategory(subcategory || '');
    setIsSidebarOpen(false); // Close sidebar on mobile after selection
  };

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Browse Products</h1>
            <Breadcrumb 
              category={selectedCategory} 
              subcategory={selectedSubcategory} 
            />
          </div>
          
          {/* Mobile Filter Toggle */}
          <div className="flex items-center space-x-2 lg:hidden">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            >
              {viewMode === 'grid' ? <List className="h-4 w-4" /> : <Grid className="h-4 w-4" />}
            </Button>
            <Button
              variant="outline"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="flex items-center space-x-2"
            >
              <Filter className="h-4 w-4" />
              <span>Filters</span>
            </Button>
          </div>
        </div>
        
        <ProductFilters
          sortBy={sortBy}
          setSortBy={setSortBy}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          minRating={minRating}
          setMinRating={setMinRating}
          showInStockOnly={showInStockOnly}
          setShowInStockOnly={setShowInStockOnly}
          resultsCount={filteredProducts.length}
          viewMode={viewMode}
          setViewMode={setViewMode}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6">
          {/* Sidebar */}
          <ProductSidebar
            selectedCategory={selectedCategory}
            selectedSubcategory={selectedSubcategory}
            onCategoryChange={handleCategoryChange}
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
          />

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Loading & Error */}
            {loading && (
              <div className="text-center py-12">Loading products...</div>
            )}
            {error && (
              <div className="text-center py-12 text-red-500">{error}</div>
            )}
            {/* Product Grid */}
            {!loading && !error && (
              <>
                <div className={`grid gap-6 ${
                  viewMode === 'grid'
                    ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                    : 'grid-cols-1'
                }`}>
                  {currentProducts.map((product, index) => (
                    <div
                      key={product.id}
                      className="animate-fade-in"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <ProductCard 
                        product={product} 
                        viewMode={viewMode}
                      />
                    </div>
                  ))}
                </div>

                {/* No Results */}
                {filteredProducts.length === 0 && (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">🔍</div>
                    <h3 className="text-xl font-semibold mb-2">No products found</h3>
                    <p className="text-muted-foreground mb-4">
                      Try adjusting your filters or search criteria
                    </p>
                    <Button onClick={() => {
                      setSelectedCategory('all');
                      setSelectedSubcategory('');
                      setPriceRange([0, 500]);
                      setMinRating(0);
                      setShowInStockOnly(false);
                    }}>
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
      </div>
    </div>
  );
}