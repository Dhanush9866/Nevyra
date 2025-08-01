import { useState, useEffect } from "react";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProductCard } from "@/components/ProductCard";
import { Pagination } from "@/components/Pagination";
import { Loader2, AlertCircle } from "lucide-react";
import { productAPI } from "@/lib/api";

interface Product {
  id: number;
  title: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  emoji: string;
  isWishlisted?: boolean;
  inStock: boolean;
}

interface ProductGridProps {
  products?: any[];
  loading?: boolean;
  error?: string;
  showPagination?: boolean;
  itemsPerPage?: number;
}

export function ProductGrid({ 
  products: propProducts, 
  loading: propLoading, 
  error: propError,
  showPagination = true,
  itemsPerPage = 12 
}: ProductGridProps) {
  const [products, setProducts] = useState<any[]>([]);
  const [wishlistedItems, setWishlistedItems] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // If products are passed as props, use them; otherwise fetch from API
  useEffect(() => {
    if (propProducts) {
      setProducts(propProducts);
      setLoading(false);
      setError("");
      return;
    }

    setLoading(true);
    setError("");
    
    productAPI.getProducts(currentPage, itemsPerPage)
      .then((data) => {
        if (data.success && data.data) {
          setProducts(data.data.products || data.data);
          setTotalPages(data.data.totalPages || Math.ceil((data.data.total || data.data.length) / itemsPerPage));
        } else {
          setError("Invalid data format from server");
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Error fetching products");
        setLoading(false);
      });
  }, [propProducts, currentPage, itemsPerPage]);

  const toggleWishlist = (productId: string) => {
    setWishlistedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
  };

  const addToCart = (productId: string) => {
    // Mock add to cart functionality
    console.log(`Added product ${productId} to cart`);
  };

  return (
    <div className="py-12">
      <div className="max-w-full mx-auto px-2 sm:px-4 lg:px-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">Top Picks For You</h2>
          <p className="text-muted-foreground">Curated products based on your preferences</p>
        </div>

        {loading ? (
          <div className="text-center py-12">Loading products...</div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} viewMode="grid" />
              ))}
            </div>
            <div className="text-center mt-8">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};