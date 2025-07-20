import { Button } from "@/components/ui/button";

export const PromoBanner = () => {
  return (
    <div className="py-16 bg-gradient-to-r from-primary via-primary/90 to-accent">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            🎉 Season's Biggest Sale!
          </h2>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Get up to 80% off on all categories. Limited time offer!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-primary hover:bg-gray-100 px-8 py-3 text-lg font-semibold"
            >
              Explore Deals
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-primary px-8 py-3 text-lg font-semibold"
            >
              Shop Categories
            </Button>
          </div>
          <p className="text-sm mt-6 opacity-75">
            *Valid until the end of this month. Terms and conditions apply.
          </p>
        </div>
      </div>
    </div>
  );
};