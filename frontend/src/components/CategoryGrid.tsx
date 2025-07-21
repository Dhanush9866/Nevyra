import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, ShoppingCart, Shirt, Smartphone, Zap, Car, Trophy, Home as HomeIcon } from "lucide-react";

export const CategoryGrid = () => {
  const categories = [
    {
      id: 1,
      name: "Medical",
      description: "Personal Care, Skin Care, Hair Care, Makeup & more",
      icon: Heart,
      itemCount: 245,
      featured: true
    },
    {
      id: 2,
      name: "Groceries",
      description: "Fresh produce, pantry essentials & daily needs",
      icon: ShoppingCart,
      itemCount: 1200,
      featured: true
    },
    {
      id: 3,
      name: "FashionBeauty",
      description: "Menswear, Women's Wear, Kids Wear, Shoes & Accessories",
      icon: Shirt,
      itemCount: 850,
      featured: true
    },
    {
      id: 4,
      name: "Devices",
      description: "Phones, Laptops, TVs & latest gadgets",
      icon: Smartphone,
      itemCount: 320,
      featured: false
    },
    {
      id: 5,
      name: "Electrical",
      description: "Solar Panels, Wiring, Fans, Switches & electrical items",
      icon: Zap,
      itemCount: 180,
      featured: false
    },
    {
      id: 6,
      name: "Automotive",
      description: "Bike, Car & Maintenance Products",
      icon: Car,
      itemCount: 150,
      featured: false
    },
    {
      id: 7,
      name: "Sports",
      description: "Cricket, Volleyball & sports equipment",
      icon: Trophy,
      itemCount: 95,
      featured: false
    },
    {
      id: 8,
      name: "HomeInterior",
      description: "Ceiling, Doors, Paint, Curtains, Tiles & decor",
      icon: HomeIcon,
      itemCount: 420,
      featured: true
    }
  ];

  return (
    <div className="py-12 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">Shop by Category</h2>
          <p className="text-muted-foreground">Explore our diverse range of product categories</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link key={category.id} to={`/products?category=${category.name}`}>
              <Card className="card-hover cursor-pointer h-full">
                <CardHeader> 
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <category.icon className="h-6 w-6 text-primary" />
                    </div>
                    {category.featured && (
                      <Badge variant="secondary">Featured</Badge>
                    )}
                  </div>
                  <CardTitle className="text-xl">{category.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-4">
                    {category.description}
                  </CardDescription>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      {category.itemCount} items
                    </span>
                    <Badge variant="outline" className="bg-accent/10 text-accent border-accent/20">
                      View All
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};