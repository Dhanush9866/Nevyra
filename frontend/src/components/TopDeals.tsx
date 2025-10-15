import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { apiService } from "@/lib/api";

type DealProduct = {
  _id: string;
  title: string;
  price: number;
  mrp?: number;
  images?: string[];
  rating?: number;
  reviewsCount?: number;
  discount?: number;
};

const TopDeals = () => {
  const [products, setProducts] = useState<DealProduct[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await apiService.getProducts({ limit: 12 });
        if (res.success) {
          const mapped = res.data.map((p: any) => ({
            _id: p._id,
            title: p.title,
            price: p.price,
            mrp: p.mrp || p.price,
            images: p.images || [],
            rating: p.rating || 4.5,
            reviewsCount: p.reviewsCount || 0,
            discount: p.mrp && p.mrp > p.price ? Math.round(((p.mrp - p.price) / p.mrp) * 100) : undefined,
          }));
          setProducts(mapped);
        }
      } catch (e) {
        // ignore for homepage
      }
    })();
  }, []);

  return (
    <section className="py-16 bg-muted">
      <div className="w-full px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2 font-roboto">
              Top Deals of the Day
            </h2>
            <p className="text-muted-foreground">
              Limited time offers on bestselling products
            </p>
          </div>
          <Button
            variant="outline"
            className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
          >
            View All Deals
          </Button>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide scroll-smooth" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {products.slice(0, 8).map((product) => (
            <Card
              key={product._id}
              className="min-w-[200px] flex-shrink-0 group hover:shadow-xl hover:scale-105 transition-all duration-300 bg-card border border-border transform hover:-translate-y-1 cursor-pointer"
            >
              <CardContent className="p-3">
                <Link to={`/product/${product._id}`}>
                  <div className="relative mb-2">
                    <img
                      src={product.images?.[0] || '/placeholder.svg'}
                      alt={product.title}
                      className="w-full h-32 object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                    />
                    {product.discount && (
                      <Badge className="absolute top-1 left-1 bg-discount text-white text-xs px-1.5 py-0.5 group-hover:scale-110 transition-transform duration-300">
                        {product.discount}% OFF
                      </Badge>
                    )}
                  </div>

                  <h3 className="font-semibold text-card-foreground mb-1.5 font-roboto group-hover:text-primary transition-colors line-clamp-2 text-sm">
                    {product.title}
                  </h3>

                  <div className="flex items-center gap-1 mb-1.5">
                    <div className="flex items-center">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 group-hover:scale-110 transition-transform duration-200" />
                      <span className="text-xs font-medium ml-1">
                        {product.rating || 4.5}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      ({product.reviewsCount || 0})
                    </span>
                  </div>

                  <div className="flex items-center gap-1 mb-2">
                    <span className="text-sm font-bold text-price group-hover:text-primary transition-colors duration-200">
                      ₹{product.price.toLocaleString()}
                    </span>
                    {product.mrp && product.mrp > product.price && (
                      <span className="text-xs text-muted-foreground line-through">
                        ₹{product.mrp.toLocaleString()}
                      </span>
                    )}
                  </div>
                </Link>

                <Button className="w-full bg-primary hover:bg-primary-hover text-primary-foreground text-xs py-1.5 group-hover:scale-105 transition-all duration-200 hover:shadow-md">
                  <ShoppingCart className="h-3 w-3 mr-1 group-hover:scale-110 transition-transform duration-200" />
                  Add to Cart
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TopDeals;
