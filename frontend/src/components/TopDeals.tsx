
import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

const topDealsData = [
  { id: "td1", title: "Wireless Earbuds", price: "$29.99", image: "https://images.unsplash.com/photo-1572569028738-411a56111005?auto=format&fit=crop&w=300&q=80" },
  { id: "td2", title: "Smart Speaker", price: "$49.99", image: "https://images.unsplash.com/photo-1589492477829-5e65395b66cc?auto=format&fit=crop&w=300&q=80" },
  { id: "td3", title: "Gaming Mouse", price: "$39.99", image: "https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=300&q=80" },
  { id: "td4", title: "Mechanical Keyboard", price: "$89.99", image: "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&w=300&q=80" },
  { id: "td5", title: "4K Monitor", price: "$299.99", image: "https://images.unsplash.com/photo-1586210579191-33b45e38fa2c?auto=format&fit=crop&w=300&q=80" },
  { id: "td6", title: "External SSD", price: "$79.99", image: "https://images.unsplash.com/photo-1597872223015-a44784d4b8aa?auto=format&fit=crop&w=300&q=80" },
  { id: "td7", title: "Graphics Tablet", price: "$59.99", image: "https://images.unsplash.com/photo-1563203369-26f2e4a5ccf7?auto=format&fit=crop&w=300&q=80" },
  { id: "td8", title: "Webcam HD", price: "$45.00", image: "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?auto=format&fit=crop&w=300&q=80" },
  { id: "td9", title: "USB-C Hub", price: "$34.99", image: "https://images.unsplash.com/photo-1616410011236-7a421b19a586?auto=format&fit=crop&w=300&q=80" },
  { id: "td10", title: "Laptop Stand", price: "$25.50", image: "https://images.unsplash.com/photo-1593642702749-b7d2a804fbcf?auto=format&fit=crop&w=300&q=80" },
  { id: "td11", title: "Noise Cancelling Headphones", price: "$199.99", image: "https://images.unsplash.com/photo-1546435770-a3e2feadf72c?auto=format&fit=crop&w=300&q=80" },
  { id: "td12", title: "Smart Watch Strap", price: "$15.99", image: "https://images.unsplash.com/photo-1551816230-ef5deaed4a26?auto=format&fit=crop&w=300&q=80" },
];

const TopDeals = () => {
  return (
    <div className="container mx-auto px-4 py-8 bg-white my-4 shadow-sm rounded-none relative">
      <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-4">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900">Top Deals</h2>
        <Button variant="link" className="p-0 h-auto font-semibold text-primary hover:text-primary/90 hover:no-underline flex items-center gap-1 group/btn">
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
        <CarouselPrevious className="absolute left-0 top-1/2 -translate-y-1/2 z-20 h-10 w-10 md:h-12 md:w-12 border-none shadow-lg bg-white/90 hover:bg-white text-gray-800 disabled:opacity-0 rounded-none" />
        <CarouselNext className="absolute right-0 top-1/2 -translate-y-1/2 z-20 h-10 w-10 md:h-12 md:w-12 border-none shadow-lg bg-white/90 hover:bg-white text-gray-800 disabled:opacity-0 rounded-none" />

        <CarouselContent className="-ml-2 md:-ml-4">
          {topDealsData.map((product) => (
            <CarouselItem key={product.id} className="basis-1/2 md:basis-1/4 lg:basis-1/5 pl-2 md:pl-4">
              <div className="group cursor-pointer flex flex-col items-center p-2 rounded-none hover:shadow-md transition-shadow duration-300 border border-transparent hover:border-gray-100 h-full">
                {/* Image Container: Fixed aspect ratio to match HomeProductCarousel */}
                <div className="w-full aspect-square overflow-hidden rounded-none flex items-center justify-center mb-3 bg-gray-50">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="max-h-full max-w-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300 rounded-none"
                  />
                </div>
                
                {/* Text Content */}
                <div className="text-center w-full space-y-1">
                    <h3 className="font-medium text-gray-900 text-sm line-clamp-1" title={product.title}>
                        {product.title}
                    </h3>
                    <div className="text-sm font-bold text-green-600">
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

export default TopDeals;
