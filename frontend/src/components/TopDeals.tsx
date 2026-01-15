import React, { useState, useEffect } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { apiService } from "@/lib/api";
import { useNavigate } from "react-router-dom";

const TopDeals = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTopDeals = async () => {
      try {
        const response = await apiService.getTopDeals(12);
        if (response.success) {
          setProducts(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch top deals:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTopDeals();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 bg-white my-4 shadow-sm rounded-none">
        <div className="h-64 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (products.length === 0) return null;
  return (
    <div className="w-full max-w-[98%] mx-auto px-2 py-8 bg-white my-4 shadow-sm rounded-none relative">
      <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-4">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900">Top Deals</h2>
        <Button
          variant="link"
          className="p-0 h-auto font-semibold text-primary hover:text-primary/90 hover:no-underline flex items-center gap-1 group/btn"
          onClick={() => navigate("/products")}
        >
          View All <ChevronRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
        </Button>
      </div>

      <Carousel
        opts={{
          align: "start",
          loop: true,
          slidesToScroll: 2,
        }}
        className="w-full relative group"
      >
        <CarouselPrevious className="absolute left-0 top-1/2 -translate-y-1/2 z-20 h-10 w-10 md:h-12 md:w-12 border-none shadow-lg bg-white/90 hover:bg-white text-gray-800 disabled:opacity-0 rounded-none opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <CarouselNext className="absolute right-0 top-1/2 -translate-y-1/2 z-20 h-10 w-10 md:h-12 md:w-12 border-none shadow-lg bg-white/90 hover:bg-white text-gray-800 disabled:opacity-0 rounded-none opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <CarouselContent className="-ml-2 md:-ml-4">
          {products.map((product) => (
            <CarouselItem key={product.id} className="basis-1/2 md:basis-1/4 lg:basis-1/5 pl-2 md:pl-4">
              <div
                className="group cursor-pointer flex flex-col items-center p-2 rounded-none hover:shadow-md transition-shadow duration-300 border border-transparent hover:border-gray-100 h-full"
                onClick={() => navigate(`/product/${product.id}`)}
              >
                {/* Image Container: Fixed aspect ratio to match HomeProductCarousel */}
                {/* Image Container: Fixed aspect ratio to match HomeProductCarousel */}
                <div className="w-full aspect-square overflow-hidden rounded-none flex items-center justify-center mb-3 bg-gray-50 relative">
                  {/* Discount Badge */}
                  {(product.discount && product.discount > 0) || (product.mrp && product.mrp > product.price) ? (
                    <div className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-sm">
                      {product.discount && product.discount > 0
                        ? `${product.discount}% OFF`
                        : `${Math.round(((product.mrp - product.price) / product.mrp) * 100)}% OFF`
                      }
                    </div>
                  ) : null}
                  <img
                    src={product.images && product.images[0] ? product.images[0] : "https://via.placeholder.com/300"}
                    alt={product.title}
                    className="max-h-full max-w-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300 rounded-none"
                  />
                </div>

                {/* Text Content */}
                <div className="text-center w-full space-y-1">
                  <h3 className="font-medium text-gray-900 text-sm line-clamp-1" title={product.title}>
                    {product.title}
                  </h3>
                  <div className="flex items-center justify-center gap-2 text-sm">
                    <span className="font-bold text-gray-900">₹{product.price}</span>
                    {product.mrp && product.mrp > product.price && (
                      <span className="text-xs text-gray-500 line-through">₹{Number(product.mrp).toLocaleString()}</span>
                    )}
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
};

export default TopDeals;
