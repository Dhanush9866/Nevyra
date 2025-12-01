import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Star, ShoppingCart, SlidersHorizontal } from "lucide-react";
import { apiService } from "@/lib/api";

type ProductItem = {
  _id: string;
  title: string;
  price: number;
  mrp?: number;
  images?: string[];
  rating?: number;
  reviewsCount?: number;
  brand?: string;
};

const brands = ["TechCorp", "SportBrand", "GameTech", "FashionHub"];

const ProductListing = () => {
  const { categoryName } = useParams();
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [priceRange, setPriceRange] = useState([0, 100000]);
  useEffect(() => {
    (async () => {
      const params: any = { limit: 40 };
      if (categoryName) {
        // Map URL slug to actual category name
        const categoryMap: Record<string, string> = {
          'medical-and-pharmacy': 'Medical & Pharmacy',
          'groceries': 'Groceries',
          'fashion-and-beauty': 'Fashion & Beauty',
          'devices': 'Devices',
          'electrical': 'Electrical',
          'automotive': 'Automotive',
          'sports': 'Sports',
          'home-interior': 'Home Interior',
        };
        params.category = categoryMap[categoryName] || categoryName;
      }
      try {
        console.log('Fetching products with params:', params);
        const res = await apiService.getProducts(params);
        console.log('Product fetch response:', res);
        if (res.success) {
          const mappedProducts = res.data.map((p: any) => ({
            _id: p.id || p._id,
            title: p.title,
            price: p.price,
            mrp: p.mrp || p.price,
            images: p.images || [],
            rating: p.rating || 4.5,
            reviewsCount: p.reviewsCount || 0,
            brand: p.brand || p.category,
          }));
          console.log('Mapped products:', mappedProducts);
          setProducts(mappedProducts);
        } else {
          console.error('Failed to fetch products:', res.message);
        }
      } catch (err) {
        console.error('Error fetching products:', err);
      }
    })();
  }, [categoryName]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("popularity");
  const [showFilters, setShowFilters] = useState(false);

  const handleBrandChange = (brand: string, checked: boolean) => {
    if (checked) {
      setSelectedBrands([...selectedBrands, brand]);
    } else {
      setSelectedBrands(selectedBrands.filter((b) => b !== brand));
    }
  };

  const filteredProducts = products.filter((product) => {
    const inPriceRange =
      product.price >= priceRange[0] && product.price <= priceRange[1];
    const inSelectedBrands =
      selectedBrands.length === 0 || selectedBrands.includes(product.brand || "");
    return inPriceRange && inSelectedBrands;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low-high":
        return a.price - b.price;
      case "price-high-low":
        return b.price - a.price;
      case "rating":
        return (b.rating || 0) - (a.rating || 0);
      case "newest":
        return 0;
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-screen bg-background font-roboto">
      <Navbar />

      <div className="w-full px-4 py-6">
        {/* Breadcrumb and Header */}
        <div className="mb-6">
          <nav className="text-sm text-muted-foreground mb-2">
            Home / {categoryName || "Category"}
          </nav>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h1 className="text-2xl font-bold text-foreground capitalize">
              {categoryName || "Products"} ({sortedProducts.length} items)
            </h1>
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                className="md:hidden"
                onClick={() => setShowFilters(!showFilters)}
              >
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Filters
              </Button>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popularity">Popularity</SelectItem>
                  <SelectItem value="price-low-high">
                    Price: Low to High
                  </SelectItem>
                  <SelectItem value="price-high-low">
                    Price: High to Low
                  </SelectItem>
                  <SelectItem value="rating">Customer Rating</SelectItem>
                  <SelectItem value="newest">Newest First</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Sidebar Filters */}
          <div className={`w-64 ${showFilters ? "block" : "hidden"} md:block`}>
            <Card className="sticky top-4">
              <CardContent className="p-6">
                <h3 className="font-semibold text-foreground mb-4">Filters</h3>

                {/* Price Range */}
                <div className="mb-6">
                  <h4 className="font-medium text-foreground mb-3">
                    Price Range
                  </h4>
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    max={100000}
                    min={0}
                    step={1000}
                    className="mb-2"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>₹{priceRange[0].toLocaleString()}</span>
                    <span>₹{priceRange[1].toLocaleString()}</span>
                  </div>
                </div>

                {/* Brand Filter */}
                <div className="mb-6">
                  <h4 className="font-medium text-foreground mb-3">Brand</h4>
                  <div className="space-y-2">
                    {brands.map((brand) => (
                      <div key={brand} className="flex items-center space-x-2">
                        <Checkbox
                          id={brand}
                          checked={selectedBrands.includes(brand)}
                          onCheckedChange={(checked) =>
                            handleBrandChange(brand, checked as boolean)
                          }
                        />
                        <label
                          htmlFor={brand}
                          className="text-sm text-foreground cursor-pointer"
                        >
                          {brand}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Rating Filter */}
                <div className="mb-6">
                  <h4 className="font-medium text-foreground mb-3">
                    Customer Rating
                  </h4>
                  <div className="space-y-2">
                    {[4, 3, 2, 1].map((rating) => (
                      <div key={rating} className="flex items-center space-x-2">
                        <Checkbox id={`rating-${rating}`} />
                        <label
                          htmlFor={`rating-${rating}`}
                          className="text-sm text-foreground cursor-pointer flex items-center"
                        >
                          {rating}
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 ml-1" />
                          & above
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Availability */}
                <div>
                  <h4 className="font-medium text-foreground mb-3">
                    Availability
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="in-stock" />
                      <label
                        htmlFor="in-stock"
                        className="text-sm text-foreground cursor-pointer"
                      >
                        In Stock
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="fast-delivery" />
                      <label
                        htmlFor="fast-delivery"
                        className="text-sm text-foreground cursor-pointer"
                      >
                        Fast Delivery
                      </label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Product Grid */}
          <div className="flex-1">
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
              {sortedProducts.map((product) => (
                <Card
                  key={product._id}
                  className="group hover:shadow-lg transition-shadow duration-300 bg-card border border-border"
                >
                  <CardContent className="p-3 md:p-4">
                    <Link to={`/product/${product._id}`}>
                      <div className="relative mb-3 md:mb-4">
                        <img
                          src={product.images?.[0] || '/placeholder.svg'}
                          alt={product.title}
                          className="w-full h-32 md:h-48 object-cover rounded-lg"
                        />
                        <Badge className="absolute top-1 md:top-2 left-1 md:left-2 bg-discount text-white text-xs md:text-sm">
                          {product.mrp && product.mrp > product.price ? Math.round(((product.mrp - product.price)/product.mrp)*100) : 0}% OFF
                        </Badge>
                      </div>

                      <h3 className="font-semibold text-card-foreground mb-2 font-roboto group-hover:text-primary transition-colors line-clamp-2 text-sm md:text-base">
                        {product.title}
                      </h3>

                      <div className="flex items-center gap-1 md:gap-2 mb-2">
                        <div className="flex items-center">
                          <Star className="h-3 w-3 md:h-4 md:w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs md:text-sm font-medium ml-1">
                            {product.rating || 4.5}
                          </span>
                        </div>
                        <span className="text-xs md:text-sm text-muted-foreground">
                          ({product.reviewsCount || 0})
                        </span>
                      </div>

                      <div className="flex items-center gap-1 md:gap-2 mb-3 md:mb-4">
                        <span className="text-lg md:text-xl font-bold text-price">
                          ₹{product.price.toLocaleString()}
                        </span>
                        <span className="text-xs md:text-sm text-muted-foreground line-through">
                          ₹{(product.mrp || product.price).toLocaleString()}
                        </span>
                      </div>
                    </Link>

                    <Button className="w-full bg-primary hover:bg-primary-hover text-primary-foreground text-xs md:text-sm py-2 md:py-2">
                      <ShoppingCart className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                      Add to Cart
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Load More */}
            <div className="text-center mt-8">
              <Button
                variant="outline"
                size="lg"
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
              >
                Load More Products
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProductListing;
