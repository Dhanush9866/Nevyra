import { HeroCarousel } from "@/components/HeroCarousel";
//import { LocationSelector } from "@/components/LocationSelector";
import { TrendingDeals } from "@/components/TrendingDeals";
import { ProductGrid } from "@/components/ProductGrid";
import { CategoryGrid } from "@/components/CategoryGrid";
import { CategoryNavBar } from "@/components/CategoryNavBar";
import { BrandCarousel } from "@/components/BrandCarousel";
import { PromoBanner } from "@/components/PromoBanner";
import { NewsletterSignup } from "@/components/NewsletterSignup";

export default function Home() {
  return (
    <div className="page-transition">
      {/* Category Navigation Bar - Flipkart Style */}
      <CategoryNavBar />

      {/* Hero Banner Carousel */}
      <section className="px-1 sm:px-2 lg:px-3 py-8">
        <div className="w-full">
          <HeroCarousel />
        </div>
      </section>

      {/* Location Selector */}
     

      {/* Trending Now / Flash Deals */}
      <section className="bg-background">
        <TrendingDeals />
      </section>

      {/* Category Highlights */}
      <section>
        <CategoryGrid />
      </section>

      {/* Top Picks For You */}
      <section className="bg-background">
        <ProductGrid />
        
      </section>

      {/* Featured Brands */}
      <section className="bg-muted/30">
        <BrandCarousel />
      </section>
    </div>
  );
}