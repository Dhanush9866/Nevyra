
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

interface GridItem {
  title: string;
  image: string;
  offer: string;
}

interface CategoryGroup {
  title: string;
  items: GridItem[];
}

interface HomeCategoryGridProps {
  groups: CategoryGroup[];
}

const HomeCategoryGrid: React.FC<HomeCategoryGridProps> = ({ groups }) => {
  return (
    <div className="container mx-auto px-4 py-8 bg-white my-4 shadow-sm rounded-none">
      {/* 
        Grid layout: 
        cols-1 on small
        cols-2 on medium 
        cols-3 on large screens (to create that row of 3 distinct groups as requested) 
      */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {groups.map((group, idx) => (
          <Card key={idx} className="bg-white border text-card-foreground shadow-sm rounded-none overflow-hidden h-full flex flex-col hover:shadow-md transition-all duration-300">
            <CardHeader className="p-4 pb-0">
              <CardTitle className="text-lg md:text-xl font-bold text-primary line-clamp-2">
                {group.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 flex-grow flex flex-col">
              <div className="grid grid-cols-2 gap-4 flex-grow">
                {group.items.slice(0, 4).map((item, itemIdx) => (
                  <div key={itemIdx} className="group cursor-pointer flex flex-col">
                    {/* Image Container - Aspect Square & Consistent Size & No Border Radius */}
                    <div className="w-full h-32 md:h-40 overflow-hidden mb-2 rounded-none flex items-center justify-center p-1">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300 rounded-none"
                      />
                    </div>
                    {/* Text Below Image */}
                    <div className="text-[13px] font-medium text-gray-800 leading-tight line-clamp-2">
                      {item.title}
                    </div>
                    {/* Removed Green Offer Text */}
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-2">
                {/* Replaced 'See all offers' link with 'Shop Now' button & No Border Radius */}
                <Button className="w-full rounded-none bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
                  Shop Now
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default HomeCategoryGrid;
