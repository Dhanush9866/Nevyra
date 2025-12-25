import { useRef } from "react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { apiService } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

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
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    (async () => {
      try {
        const res = await apiService.getProducts({ limit: 12 });
        if (res.success) {
          const mapped = res.data.map((p: any) => ({
            _id: p.id || p._id,
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
        console.error('TopDeals: Error fetching products:', e);
      }
    })();
  }, []);

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-4 bg-gray-50">
      <div className="w-full px-4">

        {/* Top Deals Carousel */}
        <div className="bg-white p-4 shadow-sm relative min-w-0">
          <h2 className="text-xl font-bold text-foreground mb-4 font-roboto">
            Top Deals
          </h2>

          <div className="relative">
            <div
              ref={scrollRef}
              className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide scroll-smooth"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {products.map((product) => (
                <Link
                  key={product._id}
                  to={`/product/${product._id}`}
                  className="min-w-[160px] w-[160px] flex-shrink-0 group cursor-pointer border border-transparent hover:border-border rounded-lg p-2 transition-all duration-300"
                >
                  <div className="w-full h-36 mb-3 flex items-center justify-center p-2">
                    <img
                      src={product.images?.[0] || '/placeholder.svg'}
                      alt={product.title}
                      className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  <div className="text-center">
                    <h3 className="font-medium text-xs text-gray-600 mb-1 line-clamp-2" title={product.title}>
                      {product.title}
                    </h3>
                    <p className="text-sm font-bold text-black">
                      From ₹{product.price.toLocaleString()}
                    </p>
                  </div>
                </Link>
              ))}
            </div>

            {/* Floating Scroll Button */}
            <Button
              variant="outline"
              size="icon"
              onClick={scrollRight}
              className="absolute top-1/2 -right-0 -mt-8 h-12 w-8 rounded-l-md rounded-r-none bg-white shadow-md border-l border-y border-r-0 z-10 hidden md:flex"
            >
              <ChevronRight className="h-6 w-6 text-gray-600" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TopDeals;
