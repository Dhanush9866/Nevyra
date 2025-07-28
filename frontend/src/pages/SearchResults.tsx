import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { ProductCard } from "@/components/ProductCard";
import { Pagination } from "@/components/Pagination";
import { Button } from "@/components/ui/button";
import { productAPI } from "@/lib/api";

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const query = searchParams.get("q") || "";
  const category = searchParams.get("category");
  const subcategory = searchParams.get("subcategory");

  useEffect(() => {
    setLoading(true);
    setError("");
    
    productAPI.getAllProducts()
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
  }, [searchParams]);

  useEffect(() => {
    let filtered = [...allProducts];
    if (query) {
      const q = query.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.title?.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q) ||
          p.subcategory?.toLowerCase().includes(q)
      );
    }
    if (category && category !== "undefined") {
      filtered = filtered.filter(
        (p) => p.category?.toLowerCase() === category.toLowerCase()
      );
    }
    if (subcategory && subcategory !== "undefined") {
      filtered = filtered.filter(
        (p) => p.subcategory?.toLowerCase() === subcategory.toLowerCase()
      );
    }
    setFilteredProducts(filtered);
    setCurrentPage(1);
  }, [allProducts, query, category, subcategory]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Search Results for "{query}"
        </h1>
        <div className="text-muted-foreground mb-6">
          {filteredProducts.length} product{filteredProducts.length !== 1 ? "s" : ""} found
        </div>
        {loading && <div className="py-12 text-center">Loading products...</div>}
        {error && <div className="py-12 text-center text-red-500">{error}</div>}
        {!loading && !error && (
          <>
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold mb-2">No products found</h3>
                <p className="text-muted-foreground mb-4">
                  Try a different search term or adjust your filters.
                </p>
                <Button onClick={() => window.history.back()}>Go Back</Button>
              </div>
            ) : (
              <>
                <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {currentProducts.map((product) => (
                    <ProductCard key={product.id} product={product} viewMode="grid" />
                  ))}
                </div>
                {filteredProducts.length > itemsPerPage && (
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
          </>
        )}
      </div>
    </div>
  );
} 