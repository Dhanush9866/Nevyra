import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Banner {
  id: number;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  bgColor: string;
}

const banners: Banner[] = [
  {
    id: 1,
    title: "Winter Collection 2024",
    subtitle: "Up to 70% off on trending fashion",
    ctaText: "Shop Now",
    ctaLink: "/categories",
    bgColor: "from-blue-600 to-purple-600"
  },
  {
    id: 2,
    title: "Electronics Mega Sale",
    subtitle: "Latest gadgets at unbeatable prices",
    ctaText: "Explore Deals",
    ctaLink: "/categories",
    bgColor: "from-green-500 to-teal-600"
  },
  {
    id: 3,
    title: "Home & Lifestyle",
    subtitle: "Transform your space with premium products",
    ctaText: "Discover More",
    ctaLink: "/categories",
    bgColor: "from-orange-500 to-red-500"
  },
  {
    id: 4,
    title: "Premium Watches",
    subtitle: "Luxury timepieces for every occasion",
    ctaText: "View Collection",
    ctaLink: "/categories",
    bgColor: "from-gray-700 to-gray-900"
  }
];

export const HeroCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % banners.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <div className="relative w-full h-44 md:h-48 lg:h-56 overflow-hidden rounded-lg">
      {/* Banners */}
      <div 
        className="flex transition-transform duration-500 ease-in-out h-full"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {banners.map((banner) => (
          <div
            key={banner.id}
            className={`w-full h-full flex-shrink-0 bg-gradient-to-r ${banner.bgColor} flex items-center justify-center relative`}
          >
            <div className="text-center text-white z-10 px-4">
              <h1 className="text-lg md:text-4xl lg:text-5xl font-bold mb-2 md:mb-4">
                {banner.title}
              </h1>
              <p className="text-xs md:text-xl mb-3 md:mb-6 opacity-90">
                {banner.subtitle}
              </p>
              <Button 
                className="bg-white text-gray-900 hover:bg-gray-100 px-4 py-2 md:px-8 md:py-3 text-xs md:text-lg font-semibold rounded-lg transition-colors"
                asChild
              >
                <a href={banner.ctaLink}>{banner.ctaText}</a>
              </Button>
            </div>
            {/* Overlay for better text readability */}
            <div className="absolute inset-0 bg-black/20"></div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-2 md:left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white border-0"
        onClick={prevSlide}
      >
        <ChevronLeft className="h-4 w-4 md:h-6 md:w-6" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-2 md:right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white border-0"
        onClick={nextSlide}
      >
        <ChevronRight className="h-4 w-4 md:h-6 md:w-6" />
      </Button>

      {/* Dot Indicators */}
      <div className="absolute bottom-2 md:bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-1 md:space-x-2">
        {banners.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-colors ${
              index === currentSlide ? 'bg-white' : 'bg-white/50'
            }`}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>
    </div>
  );
};