import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, Star, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { apiService } from "@/lib/api";
import { useState, useEffect } from "react";

// Product interface
interface Product {
  id: string;
  title: string;
  price: number;
  category: string;
  subCategory: string;
  images: string[];
  inStock: boolean;
  rating: number;
  reviews: number;
  stockQuantity: number;
  soldCount: number;
  attributes?: Record<string, any>;
  additionalSpecifications?: Record<string, any>;
}

// Category configuration
const categories = [
  { name: "Medical & Pharmacy", slug: "medical-and-pharmacy", limit: 4 },
  { name: "Groceries", slug: "groceries", limit: 4 },
  { name: "Fashion & Beauty", slug: "fashion-and-beauty", limit: 4 },
  { name: "Devices", slug: "devices", limit: 4 },
  { name: "Electrical", slug: "electrical", limit: 4 },
  { name: "Automotive", slug: "automotive", limit: 4 },
  { name: "Sports", slug: "sports", limit: 4 },
  { name: "Home Interior", slug: "home-interior", limit: 4 },
];

const CategoryCards = () => {
  const isMobile = useIsMobile();
  const [productsByCategory, setProductsByCategory] = useState<Record<string, Product[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const promises = categories.map(async (category) => {
          try {
            console.log(`CategoryCards: Fetching products for ${category.name}`);
            const response = await apiService.getProductsByCategory(category.name, category.limit);
            console.log(`CategoryCards: Response for ${category.name}:`, response);
            const products = response.data || [];
            console.log(`CategoryCards: Products for ${category.name}:`, products.length, 'items');
            return { category: category.name, products };
          } catch (error) {
            console.error(`Error fetching ${category.name} products:`, error);
            return { category: category.name, products: [] };
          }
        });

        const results = await Promise.all(promises);
        const productsMap: Record<string, Product[]> = {};

        results.forEach(({ category, products }) => {
          // Map products to ensure they have the correct id field
          const mappedProducts = products.map((p: any) => ({
            id: p.id || p._id,
            title: p.title,
            price: p.price,
            category: p.category,
            subCategory: p.subCategory,
            images: p.images || [],
            inStock: p.inStock !== undefined ? p.inStock : true,
            rating: p.rating || 0,
            reviews: p.reviews || 0,
            stockQuantity: p.stockQuantity || 0,
            soldCount: p.soldCount || 0,
            attributes: p.attributes,
            additionalSpecifications: p.additionalSpecifications,
          }));
          productsMap[category] = mappedProducts;
          console.log(`CategoryCards: Mapped ${mappedProducts.length} products for ${category}`);
        });

        setProductsByCategory(productsMap);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const calculateDiscount = (price: number, originalPrice?: number) => {
    if (!originalPrice || originalPrice <= price) return 0;
    return Math.round(((originalPrice - price) / originalPrice) * 100);
  };

  const getProductImage = (product: Product) => {
    return product.images && product.images.length > 0
      ? product.images[0]
      : "https://via.placeholder.com/200x200?text=No+Image";
  };

  const renderProductCard = (product: Product, isTopPicks = false) => {
    const discount = calculateDiscount(product.price);
    const displayPrice = product.price;
    const originalPrice = product.price * 1.5; // Simulate original price for discount display

    return (
      <Link key={product.id} to={`/product/${product.id}`}>
        <Card className={`${isMobile ? 'w-full' : 'min-w-[200px] flex-shrink-0'} ${isTopPicks
            ? 'bg-white border-2 border-primary/20 hover:border-primary hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:-translate-y-1'
            : 'bg-card border border-border hover:shadow-md transition-shadow cursor-pointer'
          }`}>
          <CardContent className="p-4">
            <div className="relative mb-3">
              <img
                src={getProductImage(product)}
                alt={product.title}
                className="w-full h-32 object-cover rounded-lg"
              />
              {discount > 0 && (
                <Badge className={`absolute top-2 left-2 ${isTopPicks ? 'bg-discount text-white text-xs font-semibold px-2 py-0.5' : 'bg-discount text-white text-xs'
                  }`}>
                  {discount}% OFF
                </Badge>
              )}
              {isTopPicks && (
                <div className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-1.5 py-0.5 rounded-full">
                  ⭐ TOP
                </div>
              )}
            </div>
            <h3 className={`font-medium text-sm mb-1 line-clamp-2 ${isTopPicks ? 'text-gray-800' : 'text-card-foreground'
              }`}>
              {product.title}
            </h3>
            {isTopPicks ? (
              <>
                <div className="flex items-center gap-1 mb-2">
                  <span className="text-sm font-bold text-primary">₹{displayPrice.toLocaleString()}</span>
                  {discount > 0 && (
                    <span className="text-xs text-gray-500 line-through">₹{originalPrice.toLocaleString()}</span>
                  )}
                </div>
                <div className="flex items-center gap-1 mb-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`h-3 w-3 ${i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                    ))}
                  </div>
                  <span className="text-xs text-gray-600 ml-1">({product.rating})</span>
                </div>
                <Button className="w-full bg-primary hover:bg-primary/90 text-white font-medium text-xs py-1.5">
                  <ShoppingCart className="h-3 w-3 mr-1" />
                  Add to Cart
                </Button>
              </>
            ) : (
              <p className="text-xs text-muted-foreground">
                {discount > 0 ? `Up to ${discount}% Off` : 'In Stock'}
              </p>
            )}
          </CardContent>
        </Card>
      </Link>
    );
  };

  if (loading) {
    return (
      <section className="py-16 bg-background">
        <div className="w-full px-4 space-y-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading products...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-background">
      <div className="w-full px-4 space-y-12">

        {/* Render each category */}
        {categories.map((category) => {
          const products = productsByCategory[category.name] || [];

          return (
            <div key={category.name}>
              <div className="flex justify-between items-center mb-6">
                <Link
                  to={`/category/${category.slug}`}
                  className="text-2xl font-bold text-foreground font-roboto hover:text-primary transition-colors cursor-pointer"
                >
                  {category.name}
                </Link>
                <Link
                  to={`/category/${category.slug}`}
                  className="text-primary hover:text-primary-hover flex items-center gap-1"
                >
                  View More <ChevronRight className="h-4 w-4" /> {products.length}+
                </Link>
              </div>
              <div className={`${isMobile ? 'grid grid-cols-2 gap-3' : 'flex gap-4 overflow-x-auto pb-4 scrollbar-hide scroll-smooth'}`}
                style={!isMobile ? { scrollbarWidth: 'none', msOverflowStyle: 'none' } : {}}>
                {(isMobile ? products.slice(0, 4) : products).map((product) =>
                  renderProductCard(product)
                )}
              </div>
            </div>
          );
        })}

        {/* Top Picks for You Section */}
        <div className="bg-gradient-to-r from-purple-50 to-orange-50 rounded-xl p-6 border border-primary/10">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground font-roboto mb-1">Top Picks for You</h2>
              <p className="text-primary text-xs">Handpicked products just for you</p>
            </div>
            <Link to="/category/top-picks" className="bg-primary hover:bg-primary/90 text-white px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors text-sm">
              View More <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
          <div className={`${isMobile ? 'grid grid-cols-2 gap-3' : 'flex gap-4 overflow-x-auto pb-4 scrollbar-hide scroll-smooth'}`}
            style={!isMobile ? { scrollbarWidth: 'none', msOverflowStyle: 'none' } : {}}>
            {/* Get top rated products from all categories for top picks */}
            {Object.values(productsByCategory)
              .flat()
              .sort((a, b) => b.rating - a.rating)
              .slice(0, isMobile ? 4 : 8)
              .map((product) => renderProductCard(product, true))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default CategoryCards;