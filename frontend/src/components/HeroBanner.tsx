import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    id: 1,
    title: "Everything You Need, One Platform",
    subtitle: "Groceries • Fashion • Electronics • Home & More",
    description: "Shop millions of products with fast delivery and easy returns.",
    image: "/hero/hero-main-real.png",
    buttonText: "Shop Now",
    buttonColor: "bg-primary hover:bg-primary/90",
    bgColor: "bg-[#f3e8ff]", // Light Purple
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
    bgColor: "bg-[#eff6ff]", // Light Blue
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
    bgColor: "bg-[#e0e7ff]", // Soft Indigo for premium look
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

  return (
    <div className="relative bg-white overflow-hidden min-h-[400px] md:h-[500px] flex items-center">
      <div className="container mx-auto px-4 h-full relative z-10">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`transition-all duration-1000 absolute inset-0 flex items-center justify-center ${slide.bgColor || "bg-white"
              } ${index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"}`}
          >
            <div className="container px-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">

                {/* Text Content */}
                <div className="text-left z-10 space-y-6">
                  <h1 className={`text-4xl md:text-5xl lg:text-6xl font-bold leading-tight ${slide.textColor || "text-primary"}`}>
                    {slide.title}
                  </h1>
                  <p className={`text-lg md:text-xl font-medium tracking-wide ${slide.textColor || "text-gray-600"}`}>
                    {slide.subtitle}
                  </p>
                  {/* Description - Optional to hide on mobile if cluttered */}
                  <p className={`max-w-lg hidden sm:block ${slide.descriptionColor || "text-gray-500"}`}>
                    {slide.description}
                  </p>

                  <div>
                    <Button
                      size="lg"
                      className={`${slide.buttonColor} px-8 py-6 rounded-lg text-lg shadow-lg transition-all hover:scale-105`}
                    >
                      {slide.buttonText}
                    </Button>
                  </div>
                </div>

                {/* Image Content */}
                <div className="relative flex justify-center md:justify-end">
                  {/* Background blob for depth */}
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className={`relative w-full max-w-[400px] md:max-w-[500px] h-auto object-contain hover:scale-105 transition-transform duration-500 ${(!slide.bgColor || slide.useBlend) ? "mix-blend-multiply" : "rounded-2xl shadow-2xl"
                      }`}
                    style={{
                      filter: (!slide.bgColor || slide.useBlend) ? "contrast(1.15) brightness(1.15)" : "",
                      ...(slide.id === 2 ? {
                        maskImage: 'radial-gradient(closest-side, black 55%, transparent 100%)',
                        WebkitMaskImage: 'radial-gradient(closest-side, black 55%, transparent 100%)'
                      } : {})
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-primary p-3 rounded-full shadow-md transition-all z-20 hover:scale-110"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-primary p-3 rounded-full shadow-md transition-all z-20 hover:scale-110"
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
              ? "bg-primary w-8"
              : "bg-gray-300 hover:bg-primary/50"
              }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroBanner;
