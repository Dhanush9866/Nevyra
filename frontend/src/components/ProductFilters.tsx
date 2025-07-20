import { useState } from "react";
import { Star, Grid, List, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface ProductFiltersProps {
  sortBy: string;
  setSortBy: (value: string) => void;
  priceRange: number[];
  setPriceRange: (value: number[]) => void;
  minRating: number;
  setMinRating: (value: number) => void;
  showInStockOnly: boolean;
  setShowInStockOnly: (value: boolean) => void;
  resultsCount: number;
  viewMode: 'grid' | 'list';
  setViewMode: (mode: 'grid' | 'list') => void;
}

export const ProductFilters = ({
  sortBy,
  setSortBy,
  priceRange,
  setPriceRange,
  minRating,
  setMinRating,
  showInStockOnly,
  setShowInStockOnly,
  resultsCount,
  viewMode,
  setViewMode
}: ProductFiltersProps) => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            {resultsCount} {resultsCount === 1 ? 'product' : 'products'} found
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-8 w-8 p-0"
          >
            {isExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardHeader>
      
      {isExpanded && (
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center flex-1">
              {/* Sort By */}
              <div className="flex items-center space-x-2 min-w-0">
                <Label htmlFor="sort" className="text-sm font-medium whitespace-nowrap">
                  Sort by:
                </Label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="popular">Most Popular</SelectItem>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Price Range */}
              <div className="flex items-center space-x-3 min-w-0 flex-1 max-w-sm">
                <Label className="text-sm font-medium whitespace-nowrap">Price:</Label>
                <div className="flex-1">
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    max={500}
                    min={0}
                    step={10}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
                  </div>
                </div>
              </div>

              {/* Rating Filter */}
              <div className="flex items-center space-x-2">
                <Label className="text-sm font-medium whitespace-nowrap">Min Rating:</Label>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <Button
                      key={rating}
                      variant={minRating >= rating ? "default" : "outline"}
                      size="sm"
                      className="p-1 h-8 w-8"
                      onClick={() => setMinRating(rating === minRating ? 0 : rating)}
                    >
                      <Star className="h-3 w-3" />
                    </Button>
                  ))}
                </div>
              </div>

              {/* In Stock Filter */}
              <div className="flex items-center space-x-2">
                <Switch
                  id="in-stock"
                  checked={showInStockOnly}
                  onCheckedChange={setShowInStockOnly}
                />
                <Label htmlFor="in-stock" className="text-sm font-medium">
                  In Stock Only
                </Label>
              </div>
            </div>

            {/* View Mode Toggle */}
            <div className="hidden lg:flex items-center space-x-1 border rounded-lg p-1">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="h-8 w-8 p-0"
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="h-8 w-8 p-0"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
};