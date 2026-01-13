
import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useNavigate } from "react-router-dom";

interface ProductItem {
  id: string;
  image: string;
  title: string;
  price: string;
  description?: string;
}

interface HomeProductCarouselProps {
  title: string;
  products: ProductItem[];
}

const HomeProductCarousel: React.FC<HomeProductCarouselProps> = ({ title, products }) => {
  const navigate = useNavigate();
  return (
    <div className="container mx-auto px-4 py-8 bg-white my-4 shadow-sm rounded-none relative">
      <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-4">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900">{title}</h2>
        {/* We can add a View All button here later if needed to balance the header */}
      </div>

      <Carousel
        opts={{
          align: "start",
          loop: true,
          slidesToScroll: 2,
        }}
        className="w-full relative group"
      >
        {/* 
            Buttons positioned absolute relative to the container, not inside the scroll area.
            Used 'top-1/3' or similar to align with image center, 
            or keep centered vertically relative to the carousel track.
            Added standard z-index and background.
        */}
        <CarouselPrevious className="absolute left-0 top-1/2 -translate-y-1/2 z-20 h-10 w-10 md:h-12 md:w-12 border-none shadow-lg bg-white/90 hover:bg-white text-gray-800 disabled:opacity-0 rounded-none" />
        <CarouselNext className="absolute right-0 top-1/2 -translate-y-1/2 z-20 h-10 w-10 md:h-12 md:w-12 border-none shadow-lg bg-white/90 hover:bg-white text-gray-800 disabled:opacity-0 rounded-none" />

        <CarouselContent className="-ml-2 md:-ml-4">
          {products.map((product) => (
            <CarouselItem key={product.id} className="basis-1/2 md:basis-1/4 lg:basis-1/5 pl-2 md:pl-4">
              <div
                className="group cursor-pointer flex flex-col items-center p-2 rounded-none hover:shadow-md transition-shadow duration-300 border border-transparent hover:border-gray-100 h-full"
                onClick={() => navigate(`/product/${product.id}`)}
              >
                {/* Image Container: Fixed aspect ratio to prevent height jumping */}
                <div className="w-full aspect-square overflow-hidden rounded-none flex items-center justify-center mb-3 bg-gray-50">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="max-h-full max-w-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300 rounded-none"
                  />
                </div>

                {/* Text Content: Centered and concise */}
                <div className="text-center w-full space-y-1">
                  <h3 className="font-medium text-gray-900 text-sm line-clamp-1" title={product.title}>
                    {product.title}
                  </h3>
                  {/* Optional: Add price back if desired for "Best Sellers" look, or keep minimal */}
                  <div className="text-sm font-bold text-gray-900">
                    {product.price}
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

export default HomeProductCarousel;
