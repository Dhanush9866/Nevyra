import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, ShoppingCart, Shirt, Smartphone, Zap, Car, Trophy, Home as HomeIcon, ChevronRight, ChevronLeft } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { productAPI } from "@/lib/api";

export const CategoryGrid = () => {
  const scrollRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const scrollToDirection = (categoryId: number, direction: 'left' | 'right') => {
    const container = scrollRefs.current[categoryId];
    if (container) {
      const scrollAmount = 300; // Adjust scroll amount as needed
      const newScrollLeft = direction === 'left' 
        ? container.scrollLeft - scrollAmount 
        : container.scrollLeft + scrollAmount;
      
      container.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  };

  // Fetch products from API and group by category
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await productAPI.getAllProducts();
        
        if (response.success && Array.isArray(response.data)) {
          // Group products by category
          const groupedProducts = response.data.reduce((acc: any, product: any) => {
            const category = product.category || 'Other';
            if (!acc[category]) {
              acc[category] = [];
            }
            acc[category].push({
              id: product._id || product.id,
              name: product.title || product.name,
              price: product.price,
              image: product.images && product.images.length > 0 ? product.images[0] : "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=200&h=200&fit=crop&crop=center",
              discount: product.discount || "Up to 50% Off",
              rating: product.rating,
              reviews: product.reviews,
              inStock: product.inStock
            });
            return acc;
          }, {});

          // Convert to array format for rendering
          const categoryArray = Object.keys(groupedProducts).map((categoryName, index) => ({
            id: index + 1,
            name: categoryName,
            products: groupedProducts[categoryName]
          }));

          setCategories(categoryArray);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="py-8 bg-background">
        <div className="max-w-full mx-auto px-2 sm:px-4 lg:px-6">
          <div className="animate-pulse">
            {[1, 2, 3].map((i) => (
              <div key={i} className="mb-12">
                <div className="h-8 bg-gray-200 rounded mb-6 w-1/3"></div>
                <div className="flex gap-4 overflow-hidden">
                  {[1, 2, 3, 4, 5].map((j) => (
                    <div key={j} className="flex-shrink-0 w-48">
                      <div className="aspect-square bg-gray-200 rounded mb-3"></div>
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 bg-background">
      <div className="max-w-full mx-auto px-2 sm:px-4 lg:px-6">
        {categories.map((category, index) => (
          <div key={category.id} className={`mb-12 ${index > 0 ? 'border-t border-gray-200 pt-8' : ''}`}>
            {/* Category Heading */}
            <h2 className="text-2xl font-bold text-foreground mb-6">
              {category.name}
            </h2>
            
            {/* Horizontal Scrolling Products with Navigation Arrow */}
            <div className="relative w-full group">
              {/* Left Arrow */}
              <button
                onClick={() => scrollToDirection(category.id, 'left')}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white shadow-lg rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                aria-label="Scroll left"
              >
                <ChevronLeft className="h-5 w-5 text-gray-600" />
              </button>

              {/* Right Arrow */}
              <button
                onClick={() => scrollToDirection(category.id, 'right')}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white shadow-lg rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                aria-label="Scroll right"
              >
                <ChevronRight className="h-5 w-5 text-gray-600" />
              </button>

              <div 
                ref={(el) => scrollRefs.current[category.id] = el}
                className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 scroll-smooth whitespace-nowrap px-2"
              >
                {category.products.map((product: any) => (
                  <div key={product.id} className="flex-shrink-0 w-48 group">
                    <Link to={`/products/${product.id}`} className="block">
                      {/* Product Image - Borderless */}
                      <div className="aspect-square mb-3">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                      
                      {/* Product Info */}
                      <div className="text-center">
                        <h3 className="text-sm font-medium text-foreground line-clamp-2 mb-1">
                          {product.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {product.discount}
                        </p>
                      </div>
                    </Link>
                  </div>
                ))}
                
                {/* Navigation Arrow - Always visible at the end */}
                <div className="flex-shrink-0 w-48 flex items-center justify-center">
                  <Link 
                    to={`/products?category=${category.name}`}
                    className="flex flex-col items-center justify-center w-full h-full group"
                  >
                    {/* Arrow Container */}
                    <div className="w-16 h-16 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors duration-200 mb-3">
                      <ChevronRight className="h-6 w-6 text-gray-600 group-hover:text-gray-800" />
                    </div>
                    
                    {/* Text */}
                    <div className="text-center">
                      <p className="text-sm font-medium text-foreground mb-1">
                        View More
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {category.products.length}+ items
                      </p>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};