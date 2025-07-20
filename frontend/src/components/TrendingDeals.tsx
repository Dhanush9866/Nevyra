import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Clock, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface TrendingItem {
  id: number;
  title: string;
  originalPrice: number;
  salePrice: number;
  discount: number;
  emoji: string;
}

const trendingItems: TrendingItem[] = [
  { id: 1, title: "Wireless Earbuds", originalPrice: 199, salePrice: 99, discount: 50, emoji: "🎧" },
  { id: 2, title: "Smart Watch", originalPrice: 599, salePrice: 399, discount: 33, emoji: "⌚" },
  { id: 3, title: "Phone Case", originalPrice: 49, salePrice: 19, discount: 61, emoji: "📱" },
  { id: 4, title: "Laptop Stand", originalPrice: 89, salePrice: 59, discount: 34, emoji: "💻" },
  { id: 5, title: "Coffee Mug", originalPrice: 29, salePrice: 15, discount: 48, emoji: "☕" },
  { id: 6, title: "Desk Lamp", originalPrice: 79, salePrice: 49, discount: 38, emoji: "💡" },
];

export const TrendingDeals = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 45,
    seconds: 30
  });

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const itemsToShow = () => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth >= 1024) return 4;
      if (window.innerWidth >= 768) return 3;
      if (window.innerWidth >= 640) return 2;
    }
    return 1;
  };

  const [itemsPerView, setItemsPerView] = useState(itemsToShow);

  useEffect(() => {
    const handleResize = () => setItemsPerView(itemsToShow());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const nextSlide = () => {
    setCurrentIndex(prev => 
      prev + itemsPerView >= trendingItems.length ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex(prev => 
      prev === 0 ? Math.max(0, trendingItems.length - itemsPerView) : prev - 1
    );
  };

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div className="flex items-center space-x-3 mb-4 sm:mb-0">
            <Flame className="h-6 w-6 text-accent" />
            <h2 className="text-2xl font-bold text-foreground">Flash Deals</h2>
            <Badge className="bg-accent text-accent-foreground">Limited Time</Badge>
          </div>
          
          {/* Countdown Timer */}
          <div className="flex items-center space-x-2 bg-destructive/10 px-4 py-2 rounded-lg">
            <Clock className="h-4 w-4 text-destructive" />
            <span className="text-sm font-medium">Ends in:</span>
            <div className="flex space-x-1 font-mono font-bold text-destructive">
              <span>{timeLeft.hours.toString().padStart(2, '0')}</span>
              <span>:</span>
              <span>{timeLeft.minutes.toString().padStart(2, '0')}</span>
              <span>:</span>
              <span>{timeLeft.seconds.toString().padStart(2, '0')}</span>
            </div>
          </div>
        </div>

        {/* Carousel */}
        <div className="relative">
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-300 ease-in-out"
              style={{ 
                transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`,
                width: `${(trendingItems.length / itemsPerView) * 100}%`
              }}
            >
              {trendingItems.map((item) => (
                <div 
                  key={item.id} 
                  className="flex-shrink-0 px-2"
                  style={{ width: `${100 / trendingItems.length}%` }}
                >
                  <Card className="card-hover cursor-pointer h-full">
                    <CardContent className="p-4">
                      <div className="text-center">
                        <div className="text-4xl mb-3">{item.emoji}</div>
                        <h3 className="font-semibold text-foreground mb-2 truncate">
                          {item.title}
                        </h3>
                        <div className="space-y-2">
                          <div className="flex items-center justify-center space-x-2">
                            <span className="text-lg font-bold text-foreground">
                              ₹{item.salePrice}
                            </span>
                            <span className="text-sm text-muted-foreground line-through">
                              ₹{item.originalPrice}
                            </span>
                          </div>
                          <Badge className="bg-destructive text-destructive-foreground">
                            {item.discount}% OFF
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1/2 bg-background shadow-lg border"
            onClick={prevSlide}
            disabled={currentIndex === 0}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-1/2 bg-background shadow-lg border"
            onClick={nextSlide}
            disabled={currentIndex + itemsPerView >= trendingItems.length}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};