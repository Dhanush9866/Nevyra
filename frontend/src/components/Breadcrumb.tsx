import { Link } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbProps {
  category: string;
  subcategory: string;
}

const categoryNames: Record<string, string> = {
  'all': 'All Products',
  'medical': 'Medical & Pharmacy',
  'groceries': 'Groceries',
  'fashion': 'Fashion & Beauty',
  'devices': 'Devices',
  'electrical': 'Electrical',
  'automotive': 'Automotive',
  'sports': 'Sports',
  'interior': 'Home Interior',
};

const subcategoryNames: Record<string, string> = {
  // Medical & Pharmacy
  'personal-care': 'Personal Care',
  'skincare': 'Skin Care',
  'haircare': 'Hair Care',
  'makeup': 'Makeup',
  'supplements': 'Supplements',
  
  // Groceries
  'fruits': 'Fruits & Vegetables',
  'dairy': 'Dairy Products',
  'snacks': 'Snacks & Beverages',
  'organic': 'Organic Foods',
  
  // Fashion & Beauty
  'menswear': "Men's Wear",
  'womenswear': "Women's Wear",
  'kidswear': 'Kids Wear',
  'shoes': 'Shoes',
  'accessories': 'Accessories',
  
  // Devices
  'phones': 'Mobile Phones',
  'laptops': 'Laptops',
  'tvs': 'TVs & Entertainment',
  'wearables': 'Wearables',
  
  // Electrical
  'solar': 'Solar Panels',
  'wiring': 'Wiring & Cables',
  'fans': 'Fans',
  'switches': 'Switches & Sockets',
  'lighting': 'Lighting',
  
  // Automotive
  'bike': 'Bike Parts',
  'car': 'Car Parts',
  'maintenance': 'Maintenance Products',
  
  // Sports
  'cricket': 'Cricket',
  'volleyball': 'Volleyball',
  'fitness': 'Fitness Equipment',
  'outdoor': 'Outdoor Sports',
  
  // Home Interior
  'ceiling': 'Ceiling',
  'doors': 'Doors',
  'paint': 'Paint',
  'curtains': 'Curtains',
  'tiles': 'Tiles',
};

export const Breadcrumb = ({ category, subcategory }: BreadcrumbProps) => {
  return (
    <nav className="flex items-center space-x-2 text-sm text-muted-foreground mt-2">
      <Link
        to="/"
        className="flex items-center hover:text-foreground transition-colors"
      >
        <Home className="h-4 w-4" />
      </Link>
      
      <ChevronRight className="h-4 w-4" />
      
      <Link
        to="/categories"
        className="hover:text-foreground transition-colors"
      >
        Categories
      </Link>
      
      {category && category !== 'all' && (
        <>
          <ChevronRight className="h-4 w-4" />
          <Link
            to={`/products?category=${category}`}
            className="hover:text-foreground transition-colors"
          >
            {categoryNames[category] || category}
          </Link>
        </>
      )}
      
      {subcategory && (
        <>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground font-medium">
            {subcategoryNames[subcategory] || subcategory}
          </span>
        </>
      )}
    </nav>
  );
};