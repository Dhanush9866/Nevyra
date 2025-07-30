import { Link } from "react-router-dom";
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

  const categories = [
    {
      id: 1,
      name: "Medical",
      icon: "/images/categories/medical-realistic.png",
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
      icon: "/images/categories/groceries-realistic.png",
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
      icon: "/images/categories/fashion-realistic.png",
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
      icon: "/images/categories/devices-realistic.png",
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
      icon: "/images/categories/electrical-realistic.png",
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
      icon: "/images/categories/automotive-realistic.png",
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
        { name: "Bike Parts & Accessories", link: "/products?category=Automotive&subcategory=BikePartsAccessories" },
        { name: "Car Parts & Spares", link: "/products?category=Automotive&subcategory=CarPartsSpares" },
        { name: "Maintenance & Service", link: "/products?category=Automotive&subcategory=MaintenanceService" },
        { name: "Car Accessories", link: "/products?category=Automotive&subcategory=CarAccessories" },
        { name: "Tools & Equipment", link: "/products?category=Automotive&subcategory=ToolsEquipment" }
      ]
    },
    {
      id: 7,
      name: "Sports",
      icon: "/images/categories/sports-realistic.png",
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
        { name: "Cricket Equipment", link: "/products?category=Sports&subcategory=CricketEquipment" },
        { name: "Volleyball & Team Sports", link: "/products?category=Sports&subcategory=VolleyballTeamSports" },
        { name: "Football & Soccer", link: "/products?category=Sports&subcategory=FootballSoccer" },
        { name: "Fitness & Gym Equipment", link: "/products?category=Sports&subcategory=FitnessGymEquipment" },
        { name: "Outdoor Sports & Adventure", link: "/products?category=Sports&subcategory=OutdoorSportsAdventure" }
      ]
    },
    {
      id: 8,
      name: "HomeInterior",
      icon: "/images/categories/home-realistic.png",
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
        { name: "Ceiling & Wall Decor", link: "/products?category=HomeInterior&subcategory=CeilingWallDecor" },
        { name: "Doors & Windows", link: "/products?category=HomeInterior&subcategory=DoorsWindows" },
        { name: "Paint & Wall Coverings", link: "/products?category=HomeInterior&subcategory=PaintWallCoverings" },
        { name: "Curtains & Blinds", link: "/products?category=HomeInterior&subcategory=CurtainsBlinds" },
        { name: "Tiles & Flooring", link: "/products?category=HomeInterior&subcategory=TilesFlooring" }
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
      <div className="bg-white border-b border-gray-200 shadow-sm relative z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-3 overflow-x-auto scrollbar-hide">
            {categories.map((category) => (
              <div
                key={category.id}
                className="relative group"
                ref={(el) => (categoryRefs.current[category.id] = el)}
                onMouseEnter={() => handleMouseEnter(category.id)}
                onMouseLeave={handleMouseLeave}
              >
                <Link
                  to={category.link}
                  className={`flex flex-col items-center justify-center min-w-[80px] px-3 py-2 rounded-lg transition-colors duration-200 ${
                    hoveredCategory === category.id ? category.theme.bg : `hover:${category.theme.bg}`
                  }`}
                >
                  <div className="w-12 h-12 mb-2 flex items-center justify-center">
                    <img 
                      src={category.icon} 
                      alt={category.name}
                      className="h-8 w-8 object-contain transition-transform duration-200 group-hover:scale-110"
                      onError={(e) => {
                        // Fallback to a default icon if image fails to load
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                    {/* Fallback icon - hidden by default */}
                    <div className={`hidden w-8 h-8 text-2xl flex items-center justify-center ${category.theme.icon} group-hover:${category.theme.icon}`}>
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
                    <span className={`text-xs font-medium text-gray-700 group-hover:${category.theme.icon} transition-colors duration-200 whitespace-nowrap`}>
                      {category.name}
                    </span>
                    {category.hasDropdown && (
                      <ChevronDown className={`h-3 w-3 text-gray-500 group-hover:${category.theme.icon} transition-colors duration-200`} />
                    )}
                  </div>
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
          className={`fixed z-[99999999] w-80 bg-white border ${getCurrentCategory()?.theme.border} rounded-lg shadow-xl py-4`}
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
              <div className={`px-4 py-2 border-b ${getCurrentCategory()?.theme.border} mb-3`}>
                <span className={`text-sm font-semibold ${getCurrentCategory()?.theme.text}`}>
                  {getCurrentCategory()?.name}
                </span>
              </div>
              <div className="space-y-1">
                {getCurrentCategory()?.subcategories?.slice(0, Math.ceil((getCurrentCategory()?.subcategories?.length || 0) / 2)).map((subcategory, index) => (
                  <Link
                    key={index}
                    to={subcategory.link}
                    className={`block px-4 py-2 text-sm text-gray-700 ${getCurrentCategory()?.theme.hover} hover:${getCurrentCategory()?.theme.text} transition-colors duration-200`}
                  >
                    {subcategory.name}
                  </Link>
                ))}
              </div>
            </div>
            
            {/* Right Column */}
            <div>
              <div className={`px-4 py-2 border-b ${getCurrentCategory()?.theme.border} mb-3`}>
                <span className={`text-sm font-semibold ${getCurrentCategory()?.theme.text}`}>
                  More in {getCurrentCategory()?.name}
                </span>
              </div>
              <div className="space-y-1">
                {getCurrentCategory()?.subcategories?.slice(Math.ceil((getCurrentCategory()?.subcategories?.length || 0) / 2)).map((subcategory, index) => (
                  <Link
                    key={index + Math.ceil((getCurrentCategory()?.subcategories?.length || 0) / 2)}
                    to={subcategory.link}
                    className={`block px-4 py-2 text-sm text-gray-700 ${getCurrentCategory()?.theme.hover} hover:${getCurrentCategory()?.theme.text} transition-colors duration-200`}
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