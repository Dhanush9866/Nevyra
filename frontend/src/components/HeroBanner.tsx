import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { apiService } from "@/lib/api";
import { useNavigate } from "react-router-dom";

const defaultSlides = [
  {
    id: 1,
    title: "Everything You Need, One Platform",
    subtitle: "Groceries • Fashion • Electronics • Home & More",
    description: "Shop millions of products with fast delivery and easy returns.",
    image: "/hero/hero-main-real.png",
    buttonText: "Shop Now",
    buttonColor: "bg-primary hover:bg-primary/90",
    bgColor: "bg-white", // Changed to white as requested
    useBlend: true
  },
  {
    id: 2,
    title: "Latest Smartphones",
    subtitle: "Get the newest technology",
    description: "Upgrade to the latest smartphones with amazing features.",
    image: "/hero/hero-phones.png",
    buttonText: "Shop Phones",
    buttonColor: "bg-primary hover:bg-primary/90",
    bgColor: "bg-white", // Changed to white as requested
    useBlend: true
  },
  {
    id: 3,
    title: "Fashion & Style",
    subtitle: "Express yourself with style",
    description: "Discover trendy fashion items that match your personality.",
    image: "/hero/hero-fashion.png",
    buttonText: "Shop Fashion",
    buttonColor: "bg-primary hover:bg-primary/90",
    bgColor: "bg-[#fff1f2]", // Light Rose
    useBlend: true
  },
  {
    id: 4,
    title: "Premium Electronics",
    subtitle: "Cutting-edge technology",
    description: "Experience the future with our premium electronics collection.",
    image: "/hero/hero-electronics.png",
    buttonText: "Shop Electronics",
    buttonColor: "bg-primary hover:bg-primary/90",
    bgColor: "bg-white", // Changed to white as requested
    useBlend: true
  },
  {
    id: 5,
    title: "DESIGN FOR YOUR HOUSE",
    subtitle: "Modern Interior Collection",
    description: "Transform your living space with our exclusive furniture and decor.",
    image: "/categories/home-real.png",
    buttonText: "Discover More",
    buttonColor: "bg-white text-blue-600 hover:bg-gray-100",
    bgColor: "bg-[#38bdf8]", // Sky blue similar to reference
    textColor: "text-white",
    descriptionColor: "text-white/90"
  },
  {
    id: 6,
    title: "Organic Foods at your Doorsteps",
    subtitle: "Dignissim massa diam elementum",
    description: "Fresh from farm • 100% Organic • Free delivery at your doorsteps.",
    image: "/categories/groceries-real.jpg",
    buttonText: "Start Shopping",
    buttonColor: "bg-green-600 hover:bg-green-700",
    bgColor: "bg-[#fcd34d]", // Warm yellow/orange
    textColor: "text-gray-900",
    descriptionColor: "text-gray-800",
    useBlend: true // Enable blending for this specific white-bg-on-color case
  }
];

const HeroBanner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slides, setSlides] = useState(defaultSlides);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await apiService.getSettings();
        if (response.success && response.data.heroBanners && response.data.heroBanners.length > 0) {
          const fetchedSlides = response.data.heroBanners.map((banner: any, index: number) => ({
            id: index + 1,
            title: banner.title || "Special Offer",
            subtitle: banner.subtitle || "Limited time only",
            description: "",
            image: banner.url,
            buttonText: banner.buttonText || "Shop Now",
            link: banner.link || "/products",
            buttonColor: "bg-primary hover:bg-primary/90",
            bgColor: "bg-white",
            useBlend: true
          }));
          setSlides(fetchedSlides);
        }
      } catch (error) {
        console.error("Failed to fetch hero settings:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  // Auto-advance slides
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 relative bg-gray-50 overflow-hidden min-h-[400px] md:h-[500px] flex items-center my-4 shadow-sm rounded-none">
        <div className="container px-8 md:px-16 animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <div className="h-12 md:h-16 bg-gray-200 rounded-lg w-3/4"></div>
              <div className="h-6 bg-gray-200 rounded-lg w-1/2"></div>
              <div className="h-24 bg-gray-200 rounded-lg w-full hidden sm:block"></div>
              <div className="h-12 bg-gray-200 rounded-lg w-32"></div>
            </div>
            <div className="flex justify-center md:justify-end">
              <div className="w-64 h-64 bg-gray-200 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden h-[450px] md:h-[600px] w-full shadow-lg">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`transition-all duration-1000 absolute inset-0 ${index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"}`}
        >
          {/* Background Image - Clean and Clear */}
          <div className="absolute inset-0 w-full h-full">
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="container relative h-full px-6 md:px-12 flex items-center">
            <div className="max-w-2xl text-left z-10 space-y-6">
              {/* Text Content with Strong Shadows for Clarity */}
              <div className="animate-slide-in-up">
                <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold leading-tight text-white mb-4 drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)]">
                  {slide.title}
                </h1>
                <p className="text-xl md:text-2xl font-medium tracking-wide text-white mb-2 drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)]">
                  {slide.subtitle}
                </p>
                {slide.description && (
                  <p className="max-w-lg hidden sm:block text-white/90 text-lg drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)]">
                    {slide.description}
                  </p>
                )}

                <div className="mt-8">
                  <Button
                    size="lg"
                    className="bg-primary hover:bg-primary/90 text-white px-10 py-7 rounded-full text-xl shadow-2xl transition-all hover:scale-105 active:scale-95 border border-white/30 backdrop-blur-sm"
                    onClick={() => navigate((slide as any).link || "/products")}
                  >
                    {slide.buttonText}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-4 rounded-full backdrop-blur-md transition-all z-20 hover:scale-110 active:scale-95 border border-white/30"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-4 rounded-full backdrop-blur-md transition-all z-20 hover:scale-110 active:scale-95 border border-white/30"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentSlide
              ? "bg-white w-10"
              : "bg-white/30 hover:bg-white/60"
              }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroBanner;
