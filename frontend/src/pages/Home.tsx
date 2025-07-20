import { HeroCarousel } from "@/components/HeroCarousel";
import { LocationSelector } from "@/components/LocationSelector";
import { TrendingDeals } from "@/components/TrendingDeals";
import { ProductGrid } from "@/components/ProductGrid";
import { CategoryGrid } from "@/components/CategoryGrid";
import { BrandCarousel } from "@/components/BrandCarousel";
import { PromoBanner } from "@/components/PromoBanner";
import { NewsletterSignup } from "@/components/NewsletterSignup";

export default function Home() {
  return (
    <div className="page-transition">
      {/* Hero Banner Carousel */}
      <section className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          <HeroCarousel />
        </div>
      </section>

      {/* Location Selector */}
      <section>
        <LocationSelector />
      </section>

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

      {/* Promotional Section */}
      <section>
        <PromoBanner />
      </section>

      {/* Newsletter Signup */}
      <section>
        <NewsletterSignup />
      </section>
    </div>
  );
}