import { useEffect, useState } from "react";

interface Brand {
  id: number;
  name: string;
  logo: string;
}

const brands: Brand[] = [
  { id: 1, name: "TechCorp", logo: "🔥" },
  { id: 2, name: "StyleCo", logo: "✨" },
  { id: 3, name: "HomeMax", logo: "🏆" },
  { id: 4, name: "SportsPro", logo: "⚡" },
  { id: 5, name: "LifeStyle", logo: "🌟" },
  { id: 6, name: "GadgetHub", logo: "🚀" },
  { id: 7, name: "FashionForward", logo: "💎" },
  { id: 8, name: "TechWave", logo: "🌊" },
];

export const BrandCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % (brands.length - 3));
    }, 2000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="py-12">
      <div className="w-full px-1 sm:px-2 lg:px-3">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">Featured Brands</h2>
          <p className="text-muted-foreground">Trusted by millions worldwide</p>
        </div>

        <div className="overflow-hidden">
          <div 
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * (100 / 4)}%)` }}
          >
            {brands.concat(brands).map((brand, index) => (
              <div 
                key={`${brand.id}-${index}`}
                className="flex-shrink-0 w-1/4 px-4"
              >
                <div className="bg-background border border-border rounded-lg p-8 text-center hover:shadow-lg transition-shadow cursor-pointer group">
                  <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
                    {brand.logo}
                  </div>
                  <h3 className="font-semibold text-foreground">{brand.name}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};