import { Link, useLocation } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

export const CategoryNavBar = () => {
  const [hoveredCategory, setHoveredCategory] = useState<number | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const categoryRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const location = useLocation();
  
  // Check if we're on the home page
  const isHomePage = location.pathname === "/";

  const categories = [
    {
      id: 1,
      name: "Medical",
      icon: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=120&h=120&fit=crop&crop=center",
      hasDropdown: true,
      link: "/products?category=Medical",
      theme: {
        primary: "red",
        bg: "bg-red-50",
        border: "border-red-200",
        text: "text-red-700",
        hover: "hover:bg-red-100",
        icon: "text-red-600"
      },
      subcategories: [
        { name: "Personal Care", link: "/products?category=Medical&subcategory=PersonalCare" },
        { name: "Skin Care", link: "/products?category=Medical&subcategory=SkinCare" },
        { name: "Hair Care", link: "/products?category=Medical&subcategory=HairCare" },
        { name: "Makeup & Cosmetics", link: "/products?category=Medical&subcategory=Makeup" },
        { name: "Health Supplements", link: "/products?category=Medical&subcategory=HealthSupplements" }
      ]
    },
    {
      id: 2,
      name: "Groceries",
      icon: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=120&h=120&fit=crop&crop=center",
      hasDropdown: true,
      link: "/products?category=Groceries",
      theme: {
        primary: "green",
        bg: "bg-green-50",
        border: "border-green-200",
        text: "text-green-700",
        hover: "hover:bg-green-100",
        icon: "text-green-600"
      },
      subcategories: [
        { name: "Fresh Produce", link: "/products?category=Groceries&subcategory=FreshProduce" },
        { name: "Pantry Essentials", link: "/products?category=Groceries&subcategory=PantryEssentials" },
        { name: "Dairy & Beverages", link: "/products?category=Groceries&subcategory=DairyBeverages" },
        { name: "Snacks & Chips", link: "/products?category=Groceries&subcategory=SnacksChips" },
        { name: "Organic Foods", link: "/products?category=Groceries&subcategory=OrganicFoods" }
      ]
    },
    {
      id: 3,
      name: "FashionBeauty",
      icon: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=120&h=120&fit=crop&crop=center",
      hasDropdown: true,
      link: "/products?category=FashionBeauty",
      theme: {
        primary: "pink",
        bg: "bg-pink-50",
        border: "border-pink-200",
        text: "text-pink-700",
        hover: "hover:bg-pink-100",
        icon: "text-pink-600"
      },
      subcategories: [
        { name: "Men's Clothing", link: "/products?category=FashionBeauty&subcategory=MensClothing" },
        { name: "Women's Clothing", link: "/products?category=FashionBeauty&subcategory=WomensClothing" },
        { name: "Kids & Baby Wear", link: "/products?category=FashionBeauty&subcategory=KidsBabyWear" },
        { name: "Footwear & Shoes", link: "/products?category=FashionBeauty&subcategory=FootwearShoes" },
        { name: "Accessories & Jewelry", link: "/products?category=FashionBeauty&subcategory=AccessoriesJewelry" }
      ]
    },
    {
      id: 4,
      name: "Devices",
      icon: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=120&h=120&fit=crop&crop=center",
      hasDropdown: true,
      link: "/products?category=Devices",
      theme: {
        primary: "blue",
        bg: "bg-blue-50",
        border: "border-blue-200",
        text: "text-blue-700",
        hover: "hover:bg-blue-100",
        icon: "text-blue-600"
      },
      subcategories: [
        { name: "Smartphones & Mobiles", link: "/products?category=Devices&subcategory=SmartphonesMobiles" },
        { name: "Laptops & Computers", link: "/products?category=Devices&subcategory=LaptopsComputers" },
        { name: "Tablets & iPads", link: "/products?category=Devices&subcategory=TabletsiPads" },
        { name: "TVs & Entertainment", link: "/products?category=Devices&subcategory=TVsEntertainment" },
        { name: "Gadgets & Accessories", link: "/products?category=Devices&subcategory=GadgetsAccessories" }
      ]
    },
    {
      id: 5,
      name: "Electrical",
      icon: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=120&h=120&fit=crop&crop=center",
      hasDropdown: true,
      link: "/products?category=Electrical",
      theme: {
        primary: "yellow",
        bg: "bg-yellow-50",
        border: "border-yellow-200",
        text: "text-yellow-700",
        hover: "hover:bg-yellow-100",
        icon: "text-yellow-600"
      },
      subcategories: [
        { name: "Solar Panels", link: "/products?category=Electrical&subcategory=SolarPanels" },
        { name: "Wiring & Cables", link: "/products?category=Electrical&subcategory=WiringCables" },
        { name: "Fans", link: "/products?category=Electrical&subcategory=Fans" },
        { name: "Switches & Sockets", link: "/products?category=Electrical&subcategory=SwitchesSockets" },
        { name: "Lighting", link: "/products?category=Electrical&subcategory=Lighting" }
      ]
    },
    {
      id: 6,
      name: "Automotive",
      icon: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=120&h=120&fit=crop&crop=center",
      hasDropdown: true,
      link: "/products?category=Automotive",
      theme: {
        primary: "gray",
        bg: "bg-gray-50",
        border: "border-gray-200",
        text: "text-gray-700",
        hover: "hover:bg-gray-100",
        icon: "text-gray-600"
      },
      subcategories: [
        { name: "Bike Parts", link: "/products?category=Automotive&subcategory=BikeParts" },
        { name: "Car Parts", link: "/products?category=Automotive&subcategory=CarParts" },
        { name: "Maintenance Products", link: "/products?category=Automotive&subcategory=MaintenanceProducts" },
        { name: "Engine Oil", link: "/products?category=Automotive&subcategory=EngineOil" },
        { name: "Tire Sets", link: "/products?category=Automotive&subcategory=TireSets" }
      ]
    },
    {
      id: 7,
      name: "Sports",
      icon: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=120&h=120&fit=crop&crop=center",
      hasDropdown: true,
      link: "/products?category=Sports",
      theme: {
        primary: "orange",
        bg: "bg-orange-50",
        border: "border-orange-200",
        text: "text-orange-700",
        hover: "hover:bg-orange-100",
        icon: "text-orange-600"
      },
      subcategories: [
        { name: "Cricket", link: "/products?category=Sports&subcategory=Cricket" },
        { name: "Volleyball", link: "/products?category=Sports&subcategory=Volleyball" },
        { name: "Fitness Equipment", link: "/products?category=Sports&subcategory=FitnessEquipment" },
        { name: "Outdoor Sports", link: "/products?category=Sports&subcategory=OutdoorSports" },
        { name: "Football", link: "/products?category=Sports&subcategory=Football" }
      ]
    },
    {
      id: 8,
      name: "HomeInterior",
      icon: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=120&h=120&fit=crop&crop=center",
      hasDropdown: true,
      link: "/products?category=HomeInterior",
      theme: {
        primary: "purple",
        bg: "bg-purple-50",
        border: "border-purple-200",
        text: "text-purple-700",
        hover: "hover:bg-purple-100",
        icon: "text-purple-600"
      },
      subcategories: [
        { name: "Ceiling", link: "/products?category=HomeInterior&subcategory=Ceiling" },
        { name: "Doors", link: "/products?category=HomeInterior&subcategory=Doors" },
        { name: "Paint", link: "/products?category=HomeInterior&subcategory=Paint" },
        { name: "Curtains", link: "/products?category=HomeInterior&subcategory=Curtains" },
        { name: "Tiles", link: "/products?category=HomeInterior&subcategory=Tiles" }
      ]
    }
  ];

  const updateDropdownPosition = (categoryId: number) => {
    const element = categoryRefs.current[categoryId];
    if (element) {
      const rect = element.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX
      });
    }
  };

  const handleMouseEnter = (categoryId: number) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setHoveredCategory(categoryId);
    updateDropdownPosition(categoryId);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setHoveredCategory(null);
    }, 150); // 150ms delay
  };

  const handleDropdownMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  const handleDropdownMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setHoveredCategory(null);
    }, 150); // 150ms delay
  };

  const getCurrentCategory = () => categories.find(c => c.id === hoveredCategory);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <>
      <div className="bg-gradient-to-r from-white via-gray-50 to-white border-b border-gray-200 shadow-lg relative z-50">
        <div className="w-full px-1 sm:px-2 lg:px-3">
          <div className="flex items-center justify-between py-4 overflow-x-auto scrollbar-hide gap-2">
            {categories.map((category) => (
              <div
                key={category.id}
                className="relative group flex-shrink-0"
                ref={(el) => (categoryRefs.current[category.id] = el)}
                onMouseEnter={() => handleMouseEnter(category.id)}
                onMouseLeave={handleMouseLeave}
              >
                <Link
                  to={category.link}
                  className={`flex ${isHomePage ? 'flex-col items-center justify-center min-w-[100px] px-3 py-3' : 'flex-row items-center justify-center min-w-[80px] px-4 py-2'} rounded-xl transition-all duration-300 hover:shadow-xl hover:scale-105 ${
                    hoveredCategory === category.id ? category.theme.bg : `hover:${category.theme.bg}`
                  }`}
                >
                  {isHomePage ? (
                    // Home page - Show images
                    <>
                      <div className="w-16 h-16 mb-3 flex items-center justify-center relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <img 
                          src={category.icon} 
                          alt={category.name}
                          className="h-16 w-16 object-cover rounded-xl transition-all duration-300 group-hover:scale-110 relative z-10 shadow-sm"
                          onError={(e) => {
                            // Fallback to a default icon if image fails to load
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.nextElementSibling?.classList.remove('hidden');
                          }}
                        />
                        {/* Fallback icon - hidden by default */}
                        <div className={`hidden w-16 h-16 text-3xl flex items-center justify-center ${category.theme.icon} group-hover:${category.theme.icon} relative z-10`}>
                          {category.name === "Medical" && "❤️"}
                          {category.name === "Groceries" && "🛒"}
                          {category.name === "FashionBeauty" && "👕"}
                          {category.name === "Devices" && "📱"}
                          {category.name === "Electrical" && "⚡"}
                          {category.name === "Automotive" && "🚗"}
                          {category.name === "Sports" && "🏆"}
                          {category.name === "HomeInterior" && "🏠"}
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span className={`text-sm font-semibold text-gray-800 group-hover:${category.theme.icon} transition-colors duration-300 whitespace-nowrap`}>
                          {category.name}
                        </span>
                        {category.hasDropdown && (
                          <ChevronDown className={`h-4 w-4 text-gray-500 group-hover:${category.theme.icon} transition-all duration-300 group-hover:rotate-180`} />
                        )}
                      </div>
                    </>
                  ) : (
                    // Other pages - Show only names (Flipkart style)
                    <div className="flex items-center space-x-1">
                      <span className={`text-sm font-medium text-gray-700 group-hover:${category.theme.icon} transition-colors duration-300 whitespace-nowrap`}>
                        {category.name}
                      </span>
                      {category.hasDropdown && (
                        <ChevronDown className={`h-3 w-3 text-gray-500 group-hover:${category.theme.icon} transition-all duration-300 group-hover:rotate-180`} />
                      )}
                    </div>
                  )}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Dropdown Portal - Rendered at document body level */}
      {hoveredCategory && getCurrentCategory()?.hasDropdown && createPortal(
        <div 
          ref={dropdownRef}
          className={`fixed z-[99999999] w-80 bg-white border ${getCurrentCategory()?.theme.border} rounded-xl shadow-2xl py-4 backdrop-blur-sm bg-white/95`}
          style={{
            top: dropdownPosition.top,
            left: dropdownPosition.left,
          }}
          onMouseEnter={handleDropdownMouseEnter}
          onMouseLeave={handleDropdownMouseLeave}
        >
          <div className="grid grid-cols-2 gap-6">
            {/* Left Column */}
            <div>
              <div className={`px-4 py-3 border-b ${getCurrentCategory()?.theme.border} mb-3`}>
                <span className={`text-sm font-bold ${getCurrentCategory()?.theme.text}`}>
                  {getCurrentCategory()?.name}
                </span>
              </div>
              <div className="space-y-1">
                {getCurrentCategory()?.subcategories?.slice(0, Math.ceil((getCurrentCategory()?.subcategories?.length || 0) / 2)).map((subcategory, index) => (
                  <Link
                    key={index}
                    to={subcategory.link}
                    className={`block px-4 py-2.5 text-sm text-gray-700 ${getCurrentCategory()?.theme.hover} hover:${getCurrentCategory()?.theme.text} transition-all duration-200 rounded-lg mx-2 hover:shadow-sm`}
                  >
                    {subcategory.name}
                  </Link>
                ))}
              </div>
            </div>
            
            {/* Right Column */}
            <div>
              <div className={`px-4 py-3 border-b ${getCurrentCategory()?.theme.border} mb-3`}>
                <span className={`text-sm font-bold ${getCurrentCategory()?.theme.text}`}>
                  More in {getCurrentCategory()?.name}
                </span>
              </div>
              <div className="space-y-1">
                {getCurrentCategory()?.subcategories?.slice(Math.ceil((getCurrentCategory()?.subcategories?.length || 0) / 2)).map((subcategory, index) => (
                  <Link
                    key={index + Math.ceil((getCurrentCategory()?.subcategories?.length || 0) / 2)}
                    to={subcategory.link}
                    className={`block px-4 py-2.5 text-sm text-gray-700 ${getCurrentCategory()?.theme.hover} hover:${getCurrentCategory()?.theme.text} transition-all duration-200 rounded-lg mx-2 hover:shadow-sm`}
                  >
                    {subcategory.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}; 