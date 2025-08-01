import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, ShoppingCart, Shirt, Smartphone, Zap, Car, Trophy, Home as HomeIcon, ChevronRight } from "lucide-react";

export const CategoryGrid = () => {
  const categories = [
    {
      id: 1,
      name: "Beauty, Food, Toys & more",
      products: [
        { id: "med1", name: "Top Selling Stationery", price: 49, image: "https://images.unsplash.com/photo-1583485088034-697b5bc36d3c?w=200&h=200&fit=crop&crop=center", discount: "From ₹49" },
        { id: "med2", name: "Best of Action Toys", price: 299, image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop&crop=center", discount: "Up to 70% Off" },
        { id: "med3", name: "Geared Cycles", price: 1999, image: "https://images.unsplash.com/photo-1544191696-102dbdaeeaa5?w=200&h=200&fit=crop&crop=center", discount: "Up to 70% Off" },
        { id: "med4", name: "Remote Control Toys", price: 599, image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop&crop=center", discount: "Up to 80% Off" },
        { id: "med5", name: "Puzzles & Cubes", price: 79, image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop&crop=center", discount: "From ₹79" },
        { id: "med6", name: "Soft Toys", price: 399, image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop&crop=center", discount: "Upto 70% Off" },
        { id: "med7", name: "Dry Fruits", price: 199, image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=200&h=200&fit=crop&crop=center", discount: "Upto 75% Off" }
      ]
    },
    {
      id: 2,
      name: "Sports, Healthcare & more",
      products: [
        { id: "gro1", name: "Coffee Powder", price: 299, image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=200&h=200&fit=crop&crop=center", discount: "Upto 80% Off" },
        { id: "gro2", name: "Breakfast Cereal", price: 199, image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=200&h=200&fit=crop&crop=center", discount: "Upto 75% Off" },
        { id: "gro3", name: "Musical Toys", price: 199, image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop&crop=center", discount: "Under 199" },
        { id: "gro4", name: "Honey", price: 399, image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=200&h=200&fit=crop&crop=center", discount: "Upto 75% Off" },
        { id: "gro5", name: "Tea Powder", price: 149, image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=200&h=200&fit=crop&crop=center", discount: "Upto 75% Off" },
        { id: "gro6", name: "Learning & Education", price: 599, image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop&crop=center", discount: "Up to 80% Off" }
      ]
    },
    {
      id: 3,
      name: "Fashion & Beauty",
      products: [
        { id: "fash1", name: "Denim Jacket", price: 2499, image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200&h=200&fit=crop&crop=center", discount: "Up to 60% Off" },
        { id: "fash2", name: "Running Shoes", price: 1899, image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200&h=200&fit=crop&crop=center", discount: "Up to 50% Off" },
        { id: "fash3", name: "Leather Bag", price: 3999, image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200&h=200&fit=crop&crop=center", discount: "Up to 40% Off" },
        { id: "fash4", name: "Sunglasses", price: 899, image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200&h=200&fit=crop&crop=center", discount: "Up to 70% Off" },
        { id: "fash5", name: "Wrist Watch", price: 1299, image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200&h=200&fit=crop&crop=center", discount: "Up to 55% Off" },
        { id: "fash6", name: "Perfume", price: 799, image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200&h=200&fit=crop&crop=center", discount: "Up to 65% Off" }
      ]
    },
    {
      id: 4,
      name: "Electronics & Gadgets",
      products: [
        { id: "dev1", name: "Smartphone", price: 15999, image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=200&h=200&fit=crop&crop=center", discount: "Up to 30% Off" },
        { id: "dev2", name: "Laptop", price: 45999, image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=200&h=200&fit=crop&crop=center", discount: "Up to 25% Off" },
        { id: "dev3", name: "Wireless Earbuds", price: 2999, image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=200&h=200&fit=crop&crop=center", discount: "Up to 40% Off" },
        { id: "dev4", name: "Smart Watch", price: 3999, image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=200&h=200&fit=crop&crop=center", discount: "Up to 35% Off" },
        { id: "dev5", name: "Power Bank", price: 999, image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=200&h=200&fit=crop&crop=center", discount: "Up to 50% Off" },
        { id: "dev6", name: "Bluetooth Speaker", price: 1499, image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=200&h=200&fit=crop&crop=center", discount: "Up to 45% Off" }
      ]
    },
    {
      id: 5,
      name: "Home & Living",
      products: [
        { id: "home1", name: "Wall Clock", price: 799, image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=200&h=200&fit=crop&crop=center", discount: "Up to 60% Off" },
        { id: "home2", name: "Table Lamp", price: 1299, image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=200&h=200&fit=crop&crop=center", discount: "Up to 55% Off" },
        { id: "home3", name: "Curtain Set", price: 899, image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=200&h=200&fit=crop&crop=center", discount: "Up to 70% Off" },
        { id: "home4", name: "Bed Sheet", price: 599, image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=200&h=200&fit=crop&crop=center", discount: "Up to 65% Off" },
        { id: "home5", name: "Cushion Cover", price: 299, image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=200&h=200&fit=crop&crop=center", discount: "Up to 75% Off" },
        { id: "home6", name: "Wall Art", price: 499, image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=200&h=200&fit=crop&crop=center", discount: "Up to 50% Off" }
      ]
    }
  ];

  return (
    <div className="py-8 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {categories.map((category, index) => (
          <div key={category.id} className={`mb-12 ${index > 0 ? 'border-t border-gray-200 pt-8' : ''}`}>
            {/* Category Heading */}
            <h2 className="text-2xl font-bold text-foreground mb-6">
              {category.name}
            </h2>
            
            {/* Horizontal Scrolling Products with Navigation Arrow */}
            <div className="relative">
              <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4">
                {category.products.map((product) => (
                  <div key={product.id} className="flex-shrink-0 w-48 group">
                    <Link to={`/products?category=${category.name}&product=${product.name}`} className="block">
                      {/* Product Image - Borderless */}
                      <div className="aspect-square mb-3">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                      
                      {/* Product Info */}
                      <div className="text-center">
                        <h3 className="text-sm font-medium text-foreground line-clamp-2 mb-1">
                          {product.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {product.discount}
                        </p>
                      </div>
                    </Link>
                  </div>
                ))}
                
                {/* Navigation Arrow - Always visible at the end */}
                <div className="flex-shrink-0 w-48 flex items-center justify-center">
                  <Link 
                    to={`/products?category=${category.name}`}
                    className="flex flex-col items-center justify-center w-full h-full group"
                  >
                    {/* Arrow Container */}
                    <div className="w-16 h-16 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors duration-200 mb-3">
                      <ChevronRight className="h-6 w-6 text-gray-600 group-hover:text-gray-800" />
                    </div>
                    
                    {/* Text */}
                    <div className="text-center">
                      <p className="text-sm font-medium text-foreground mb-1">
                        View More
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {category.products.length}+ items
                      </p>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};