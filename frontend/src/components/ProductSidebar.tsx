import { useState } from "react";
import { ChevronDown, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface Category {
  id: string;
  name: string;
  icon: string;
  subcategories?: Subcategory[];
}

interface Subcategory {
  id: string;
  name: string;
  count?: number;
}

const categories: Category[] = [
  {
    id: "Medical",
    name: "Medical & Pharmacy",
    icon: "🏥",
    subcategories: [
      { id: "personal-care", name: "Personal Care", count: 45 },
      { id: "skincare", name: "Skin Care", count: 32 },
      { id: "haircare", name: "Hair Care", count: 28 },
      { id: "makeup", name: "Makeup", count: 56 },
      { id: "supplements", name: "Supplements", count: 23 },
    ]
  },
  {
    id: "Groceries",
    name: "Groceries",
    icon: "🛒",
    subcategories: [
      { id: "fruits", name: "Fruits & Vegetables", count: 67 },
      { id: "dairy", name: "Dairy Products", count: 34 },
      { id: "snacks", name: "Snacks & Beverages", count: 89 },
      { id: "organic", name: "Organic Foods", count: 43 },
    ]
  },
  {
    id: "FashionBeauty",
    name: "Fashion & Beauty",
    icon: "👗",
    subcategories: [
      { id: "menswear", name: "Men's Wear", count: 78 },
      { id: "womenswear", name: "Women's Wear", count: 124 },
      { id: "kidswear", name: "Kids Wear", count: 56 },
      { id: "shoes", name: "Shoes", count: 91 },
      { id: "accessories", name: "Accessories", count: 67 },
    ]
  },
  {
    id: "Devices",
    name: "Devices",
    icon: "📱",
    subcategories: [
      { id: "phones", name: "Mobile Phones", count: 45 },
      { id: "laptops", name: "Laptops", count: 32 },
      { id: "tvs", name: "TVs & Entertainment", count: 28 },
      { id: "wearables", name: "Wearables", count: 19 },
      { id: "accessories", name: "Tech Accessories", count: 76 },
    ]
  },
  {
    id: "Electrical",
    name: "Electrical",
    icon: "⚡",
    subcategories: [
      { id: "solar", name: "Solar Panels", count: 23 },
      { id: "wiring", name: "Wiring & Cables", count: 34 },
      { id: "fans", name: "Fans", count: 45 },
      { id: "switches", name: "Switches & Sockets", count: 56 },
      { id: "lighting", name: "Lighting", count: 67 },
    ]
  },
  {
    id: "Automotive",
    name: "Automotive",
    icon: "🚗",
    subcategories: [
      { id: "bike", name: "Bike Parts", count: 43 },
      { id: "car", name: "Car Parts", count: 67 },
      { id: "maintenance", name: "Maintenance Products", count: 34 },
      { id: "accessories", name: "Car Accessories", count: 56 },
    ]
  },
  {
    id: "Sports",
    name: "Sports",
    icon: "⚽",
    subcategories: [
      { id: "cricket", name: "Cricket", count: 23 },
      { id: "volleyball", name: "Volleyball", count: 18 },
      { id: "fitness", name: "Fitness Equipment", count: 45 },
      { id: "outdoor", name: "Outdoor Sports", count: 32 },
    ]
  },
  {
    id: "HomeInterior",
    name: "Home Interior",
    icon: "🏠",
    subcategories: [
      { id: "ceiling", name: "Ceiling", count: 23 },
      { id: "doors", name: "Doors", count: 34 },
      { id: "paint", name: "Paint", count: 45 },
      { id: "curtains", name: "Curtains", count: 56 },
      { id: "tiles", name: "Tiles", count: 67 },
    ]
  },
];

interface ProductSidebarProps {
  selectedCategory: string;
  selectedSubcategory: string;
  onCategoryChange: (category: string, subcategory?: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const ProductSidebar = ({
  selectedCategory,
  selectedSubcategory,
  onCategoryChange,
  isOpen,
  onClose
}: ProductSidebarProps) => {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set([selectedCategory])
  );

  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const handleCategoryClick = (categoryId: string) => {
    if (categoryId === selectedCategory) {
      // If clicking the same category, just toggle it
      toggleCategory(categoryId);
    } else {
      // If clicking a different category, select it and expand it
      onCategoryChange(categoryId);
      setExpandedCategories(new Set([categoryId]));
    }
  };

  const handleSubcategoryClick = (categoryId: string, subcategoryId: string) => {
    onCategoryChange(categoryId, subcategoryId);
  };

  const sidebarContent = (
    <div className="space-y-2">
      {/* All Products Option */}
      <Button
        variant={selectedCategory === 'all' ? 'default' : 'ghost'}
        className="w-full justify-start"
        onClick={() => onCategoryChange('all')}
      >
        <span className="mr-3">🏪</span>
        All Products
      </Button>

      {/* Categories */}
      {categories.map((category) => (
        <div key={category.id} className="space-y-1">
          <Button
            variant={selectedCategory === category.id ? 'default' : 'ghost'}
            className="w-full justify-start group"
            onClick={() => handleCategoryClick(category.id)}
          >
            <span className="mr-3">{category.icon}</span>
            <span className="flex-1 text-left">{category.name}</span>
            {category.subcategories && (
              <div className="ml-auto transition-transform">
                {expandedCategories.has(category.id) ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </div>
            )}
          </Button>

          {/* Subcategories */}
          {category.subcategories && expandedCategories.has(category.id) && (
            <div className="ml-6 space-y-1 animate-accordion-down">
              {category.subcategories.map((subcategory) => (
                <Button
                  key={subcategory.id}
                  variant={
                    selectedCategory === category.id && selectedSubcategory === subcategory.id
                      ? 'secondary'
                      : 'ghost'
                  }
                  size="sm"
                  className="w-full justify-start text-sm"
                  onClick={() => handleSubcategoryClick(category.id, subcategory.id)}
                >
                  <span className="flex-1 text-left">{subcategory.name}</span>
                  {subcategory.count && (
                    <span className="text-xs text-muted-foreground">
                      ({subcategory.count})
                    </span>
                  )}
                </Button>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-64 flex-shrink-0">
        <Card className="sticky top-32">
          <CardContent className="p-4">
            <h3 className="font-semibold text-foreground mb-4 flex items-center">
              <span className="mr-2">📂</span>
              Categories
            </h3>
            {sidebarContent}
          </CardContent>
        </Card>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div 
            className="absolute inset-0 bg-black/50" 
            onClick={onClose}
          />
          <div className="absolute left-0 top-0 bottom-0 w-80 max-w-[90vw] bg-background border-r border-border animate-slide-in-right">
            <div className="p-4 border-b border-border">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-foreground flex items-center">
                  <span className="mr-2">📂</span>
                  Categories
                </h3>
                <Button variant="ghost" size="icon" onClick={onClose}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="p-4 overflow-y-auto h-full pb-20">
              {sidebarContent}
            </div>
          </div>
        </div>
      )}
    </>
  );
};