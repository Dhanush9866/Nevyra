import { Search, User, ShoppingCart, Menu, ChevronDown, ChevronRight, X, LogOut, Settings, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/hooks/useAuth";
import { apiService } from "@/lib/api";

interface SubCategoryGroup {
  name: string;
  items: string[];
}

type SubCategory = string | SubCategoryGroup;

interface Category {
  name: string;
  subcategories: SubCategory[];
}

const categories: Category[] = [
  {
    name: "Medical & Pharmacy",
    subcategories: [
      {
        name: "Personal Care",
        items: [
          "Oral Care",
          "Body Care",
          "Intimate Care",
          "Hand Wash & Sanitizers"
        ]
      },
      {
        name: "Skin Care",
        items: [
          "Face Wash & Cleansers",
          "Moisturizers & Creams",
          "Sunscreen",
          "Acne & Pimple Care",
          "Anti-Aging",
          "Serums & Toners"
        ]
      },
      {
        name: "Hair Care",
        items: [
          "Shampoo",
          "Conditioner",
          "Hair Oil",
          "Hair Serum",
          "Hair Fall Treatment",
          "Dandruff Care"
        ]
      },
      {
        name: "Makeup",
        items: [
          "Face Makeup",
          "Eye Makeup",
          "Lip Makeup",
          "Makeup Kits",
          "Makeup Tools & Brushes"
        ]
      },
      {
        name: "Foot, Hand & Nail Care",
        items: [
          "Foot Creams",
          "Hand Creams",
          "Nail Care",
          "Manicure & Pedicure Kits"
        ]
      },
      {
        name: "Salon Equipment",
        items: [
          "Hair Dryers",
          "Hair Straighteners",
          "Trimmers & Clippers",
          "Facial Machines",
          "Salon Chairs & Accessories"
        ]
      },
      {
        name: "Shave & Hair Removal",
        items: [
          "Razors",
          "Shaving Cream & Foam",
          "After Shave",
          "Hair Removal Creams",
          "Waxing Products",
          "Bleach Crems",
          "Epilator Devices",
          "Threading Tools"
        ]
      },
      {
        name: "Fragrance",
        items: [
          "Perfumes",
          "Deodorants",
          "Body Mists",
          "Roll-On"
        ]
      },
      {
        name: "Health & Wellness",
        items: [
          "Health Supplements",
          "Vitamins & Minerals",
          "Protein & Nutrition",
          "Immunity Boosters",
          "Herbal Supplements"
        ]
      },
      {
        name: "Medical Devices",
        items: [
          "Bp Monitors",
          "Glucometers",
          "Thermometers",
          "Nebulizers",
          "Pulse Oximeters",
          "Weighing Scales"
        ]
      },
      {
        name: "Fitness & Rehab",
        items: [
          "Orthopedic Supports",
          "Knee/Back/Wrist Supports",
          "Hot & Cold Packs",
          "Posture Correctors",
          "Physiotherapy Equipment"
        ]
      },
      {
        name: "First Aid & Emergency",
        items: [
          "First Aid Kits",
          "Bandages & Gauze",
          "Antiseptic Liquids",
          "Cotton & Medical Tapes",
          "Burn Care"
        ]
      },
      {
        name: "Women's Health",
        items: [
          "Sanitary Napkins",
          "Menstrual Cups",
          "Intimate Wash",
          "Maternity Care",
          "Pregnancy Test Kits"
        ]
      },
      {
        name: "Men's Health",
        items: [
          "Men's Grooming",
          "Hair Loss Solutions",
          "Sexual Wellness"
        ]
      },
      {
        name: "Ayurvedic & Herbal",
        items: [
          "Ayurvedic Medicines",
          "Herbal Oils",
          "Herbal Powders",
          "Traditional Remedies"
        ]
      },
      {
        name: "Elder Care",
        items: [
          "Adult Diapers",
          "Walking Sticks",
          "Hearing Aids",
          "Wheelchairs",
          "Pill Organizers"
        ]
      },
      {
        name: "Nutrition & Special Care",
        items: [
          "Diabetic Care",
          "Sugar Free Products",
          "Heart Care",
          "Weight Management"
        ]
      }
    ],
  },
  {
    name: "Groceries",
    subcategories: [
      {
        name: "General food items",
        items: [
          "Rice & Rice Products",
          "Atta, Flours & Sooji",
          "Pulses & Dals",
          "Cooking Oils & Ghee",
          "Sugar, Jaggery & Salt",
          "Snacks & Namkeen",
          "Biscuits & Cookies",
          "Breakfast Cereals",
          "Noodles, Pasta & Vermicelli",
          "Ready to Eat/ Ready to Cook",
          "Whole Spices",
          "Powdered Spices",
          "Masala Mixes",
          "Milk",
          "Curd & Yogurt",
          "Butter & Cheese",
          "Eggs",
          "Health Drinks",
          "Soft Drinks & Juices",
          "Chocolates",
          "Candies & Toffees",
          "Indian Sweets",
          "Pickles",
          "Sauces & Ketchup",
          "Jams & Spreads",
          "Dishwash & Cleaners",
          "Laundry Detergents",
          "Floor & Toilet Cleaners",
          "Garbage Bags"
        ]
      },
      {
        name: "Daily essentials",
        items: [
          "Tissues & Paper Towels",
          "Napkins",
          "Foils & Cling Wraps",
          "Organic Staples",
          "Dry Fruits & Nuts",
          "Seeds & Superfoods",
          "Vegetables",
          "Fruits",
          "Leafy Vegetables",
          "Herbs & Seasonings",
          "Chips",
          "Cookies",
          "Popcorn",
          "Instant Snacks",
          "Bread & Bakery"
        ]
      }
    ]
  },
  {
    name: "Fashion & Beauty",
    subcategories: [
      {
        name: "Men's wear",
        items: [
          "T-shirts",
          "Polo T-Shirts",
          "Hoodies",
          "Blazers",
          "Casual Shirts",
          "Formal Shirts",
          "Jeans",
          "Casual Trousers",
          "Formal Trousers",
          "Shorts",
          "Cargos",
          "Suits",
          "Ties, Socks",
          "Sweatshirts",
          "Jackets",
          "Sweater",
          "Track pants",
          "Joggers",
          "Pathani Suits",
          "Tracksuits",
          "Sherwanis",
          "Three Fourths",
          "Kurta",
          "Dhoti",
          "Lungi",
          "Vests",
          "Boxers",
          "Thermals",
          "Night Suits",
          "Briefs",
          "Trunks",
          "Gym wear",
          "Winter wear",
          "Rain wear",
          "Waistcoats"
        ]
      },
      {
        name: "Women's wear",
        items: [
          "Dresses",
          "Topwear",
          "Jeans",
          "Jumpsuits",
          "Shorts",
          "T-shirts",
          "Salwar Suits",
          "Anarkali",
          "Dupattas",
          "Petticoats",
          "Palazzos",
          "Camisoles",
          "Skirts",
          "Jeggings & Tights",
          "Trousers",
          "Bras",
          "Panties",
          "Night Dresses & Nighties",
          "Shapewear",
          "Swim & Beachwear",
          "Party Dresses",
          "Sports Wear",
          "Winter Wear",
          "Sarees",
          "Blouse",
          "Kurtis",
          "Kurtas",
          "Dress Material",
          "Lehenga",
          "Leggings",
          "Churidars",
          "Dhoti Pants",
          "Saree Shapewear"
        ]
      },
      {
        name: "Baby Care & Kids",
        items: [
          "Outdoor Toys",
          "Board Games",
          "Musical Toys",
          "Dolls",
          "Doll Houses",
          "Building Blocks & LEGO-type Toys",
          "STEM Toys",
          "Pretend Play",
          "Action Figures",
          "Art & Craft kits",
          "Ride-on Toys",
          "Puzzles",
          "Toy Guns",
          "Vehicles",
          "Soft Toys",
          "Remote Control Toys",
          "Educational Toys",
          "Helicopter",
          "Drones",
          "School Bags",
          "Pencil Boxes",
          "Stationery Sets",
          "Tiffin Bags",
          "Rain Covers for Bags",
          "Lunch box",
          "Bottle",
          "School Combo Sets",
          "Diapers",
          "Wipes",
          "Baby Rattles & Teethers",
          "Baby Medical & Health Care",
          "Baby Cleaners & Detergents",
          "Baby Food & Formula",
          "Baby Bibs",
          "Pacifiers & Soothers",
          "Baby Towels & Bedding",
          "Baby Clothes & Blankets",
          "Diper Bags",
          "Baby Grooming",
          "Baby Hair & Skin Care",
          "Baby Bathing",
          "Baby Feeding Bottle & Accessories",
          "Baby Safety Accessories"
        ]
      },
      {
        name: "Watches",
        items: [
          "Titan",
          "Fastrack",
          "Sonata",
          "Casio",
          "Timex",
          "boAt",
          "Noise",
          "Fire-Boltt",
          "Amazfit",
          "Fossil",
          "Daniel Wellington",
          "Armani Exchange",
          "Tommy Hilfiger",
          "Michael Kors"
        ]
      },
      {
        name: "Woman’s Bags",
        items: [
          "Handbags",
          "Shoulder Bags",
          "Sling Bags",
          "Tote Bags",
          "Clutches",
          "Hobo bags"
        ]
      },
      {
        name: "Utility & Travel",
        items: [
          "Backpacks",
          "Laptop Bags",
          "Office Bags",
          "Travel Bags",
          "Duffel Bags"
        ]
      },
      {
        name: "Small Accessories",
        items: [
          "Wallets & Belts",
          "Pouches",
          "Coin purses",
          "Sunglasses"
        ]
      },
      {
        name: "Jewellery",
        items: [
          "Earrings",
          "Necklaces",
          "Rings",
          "Bangles & Bracelets",
          "Anklets",
          "Noise Pins",
          "Bridal Jewelry",
          "Men’s Jewelry",
          "Kids Jewelry"
        ]
      },
      {
        name: "Luggage",
        items: [
          "Trolley Bags",
          "Suitcases",
          "Cabin Luggage",
          "Check-in Luggage"
        ]
      },
      {
        name: "Travel Bags",
        items: [
          "Duffle Bags",
          "Travel Backpacks",
          "Weekender Bags"
        ]
      },
      {
        name: "Utility Travel",
        items: [
          "Laptop Trolleys",
          "Office Travel Bags",
          "Garment Bags"
        ]
      }
    ],
  },
  {
    name: "Devices",
    subcategories: [
      {
        name: "Cell Phones & Accessories",
        items: [
          "Mobile Phones",
          "Mobile Covers & Cases",
          "Chargers & Cables",
          "Power Banks",
          "Screen Protectors",
          "Earphones & Headphones",
          "Bluetooth Speakers"
        ]
      },
      {
        name: "Laptops & Computers",
        items: [
          "Laptops",
          "Desktops",
          "Tablets",
          "Keyboards & Mouse",
          "Monitors",
          "Printers & Scanners"
        ]
      },
      {
        name: "Televisions & Audio",
        items: [
          "Smart TVs",
          "Streaming Devices",
          "Soundbars",
          "Home Theaters",
          "Projectors"
        ]
      },
      {
        name: "Home Appliances",
        items: [
          "Refrigerators",
          "Washing Machines",
          "Air conditioners",
          "Microwave Ovens",
          "Dishwashers",
          "Water Purifiers"
        ]
      },
      {
        name: "Smart Watches & Wearables",
        items: [
          "Smart Watches",
          "Fitness Bands",
          "VR Headsets",
          "Smart Glasses"
        ]
      },
      {
        name: "Cameras & Accessories",
        items: [
          "Digital Cameras",
          "DSLR Cameras",
          "Action Cameras",
          "Camera Lenses",
          "Tripods",
          "Memory Cards"
        ]
      },
      {
        name: "Gaming Devices",
        items: [
          "Gaming Consoles",
          "Game Controllers",
          "Gaming Headsets",
          "Gaming Accessories"
        ]
      },
      {
        name: "Smart Devices",
        items: [
          "Smart Lights",
          "Smart Plugs",
          "Smart Door Locks",
          "Security Cameras",
          "WiFi- Routers",
          "Smart Sensors"
        ]
      }
    ],
  },
  {
    name: "Electrical & Electronics",
    subcategories: [
      {
        name: "Power & Backup",
        items: [
          "Inverters & UPS",
          "Batteries",
          "Transformers",
          "Stabilizers",
          "UPS Systems",
          "Solar Inverters",
          "Battery Accessories"
        ]
      },
      {
        name: "Wiring & Protection",
        items: [
          "Wiring Cables & Wires",
          "Switches & Sockets",
          "MCBs, RCCBs & DB Boxes",
          "Extension Boards",
          "Plug Tops & Adaptors",
          "Control Switches",
          "Relays & Contractors"
        ]
      },
      {
        name: "Lighting",
        items: [
          "Ceiling Lights",
          "CFL Bulbs",
          "Wall Lights",
          "Outdoor Lights",
          "Street Lights",
          "Emergency Lights"
        ]
      },
      {
        name: "Fans & Appliances",
        items: [
          "Table Fans",
          "Pedestal Fans",
          "Exhaust Fans",
          "Ventilation Fans",
          "Water Heaters",
          "Room Heaters",
          "Irons",
          "Mixers & Grinders",
          "Electric Kettles",
          "Induction Cooktops"
        ]
      },
      {
        name: "Smart Home & Automation",
        items: [
          "Smart Switches",
          "Smart Plugs",
          "Smart Lights",
          "Smart Doorbells",
          "Home Automation Kits"
        ]
      },
      {
        name: "Tools & Industrial",
        items: [
          "Electrical Tools",
          "Testing Devices",
          "Tool kits",
          "Safety Gloves & Gear",
          "Industrial panels",
          "Heavy Duty Cables"
        ]
      }
    ],
  },
  {
    name: "Automotive & Automobile",
    subcategories: [
      {
        name: "Bike Accessories",
        items: [
          "Helmets",
          "Bike covers",
          "Bike Lights",
          "Bike Batteries",
          "Bike Engine Oil",
          "Bike Brake Oil",
          "Bike Air Filters",
          "Bike Cleaning & Care"
        ]
      },
      {
        name: "Car Accessories",
        items: [
          "Car Covers",
          "Car Seat Covers",
          "Car Mats",
          "Car Chargers & Holders",
          "Car Lights & Fog Lamps"
        ]
      },
      {
        name: "Lubricants & Fluids",
        items: [
          "Engine Oil",
          "Brake Fluid",
          "Coolant",
          "Gear Oil",
          "Power Steering Oil"
        ]
      },
      {
        name: "Spares & Parts",
        items: [
          "Air Filters",
          "Oil Filters",
          "Fuel Filters",
          "Spark Plugs",
          "Brake Pads",
          "Clutch Parts",
          "Horns",
          "Wipers",
          "Fuse & Relays"
        ]
      },
      {
        name: "Care & Cleaning",
        items: [
          "Car Wash & Shampoo",
          "Polish & Wax",
          "Interior Cleaners",
          "Tyre Cleaners",
          "Chain Lubes"
        ]
      },
      {
        name: "Tyres & Wheels",
        items: [
          "Car Tyres",
          "Bike Tyres",
          "Alloy Wheels",
          "Tyre Inflators"
        ]
      },
      {
        name: "Tools & Safety",
        items: [
          "Tool Kits",
          "Hydraulic Jacks",
          "First Aid Kits",
          "Warning Traingles"
        ]
      }
    ],
  },
  {
    name: "Sports",
    subcategories: [
      {
        name: "Cricket",
        items: [
          "Batting Gloves",
          "Batting Pads",
          "Helmets",
          "Wicket Keeping Gloves",
          "Wicket Keeping Pads",
          "Knee pads"
        ]
      },
      {
        name: "Football",
        items: [
          "Football",
          "Football Shoes",
          "Shin Guards",
          "Goal Posts"
        ]
      },
      {
        name: "Racquet Sports",
        items: [
          "Badminton Rackets",
          "Shuttlecocks",
          "Badminton Nets",
          "Grip Tapes",
          "Tennis Rackets",
          "Tennis Balls",
          "Tennis Nets",
          "Table Tennis Bats",
          "Table Tennis Balls",
          "TT Tables"
        ]
      },
      {
        name: "Basketball",
        items: [
          "Basketball",
          "Basketball Ring",
          "Basketball Net"
        ]
      },
      {
        name: "Indoor Games",
        items: [
          "Carrom Boards",
          "Chess Boards"
        ]
      },
      {
        name: "Fitness & Gym",
        items: [
          "Dumbbells",
          "Barbells",
          "Weight Plates",
          "Resistance Bands",
          "Skipping Ropes",
          "Yoga Mats",
          "Exercise Balls"
        ]
      },
      {
        name: "Cycling & Skating",
        items: [
          "Cycles",
          "Cycling Helmets",
          "Skates",
          "Skateboards"
        ]
      },
      {
        name: "Gear & Accessories",
        items: [
          "Sports Shoes",
          "Sports Gloves",
          "Sports Bags",
          "Water Bottles"
        ]
      }
    ],
  },
  {
    name: "Home Interior & Decor",
    subcategories: [
      {
        name: "Ceiling & Lighting",
        items: [
          "POP Ceiling",
          "LED Ceiling Lights",
          "Chandeliers",
          "Wall Lights",
          "Spot Lights"
        ]
      },
      {
        name: "Doors & Windows",
        items: [
          "Main Door",
          "Bedroom Doors",
          "PVC / UPVC Doors",
          "Door Frames",
          "Door Handles & Locks",
          "Windows & Grills"
        ]
      },
      {
        name: "Walls & Flooring",
        items: [
          "Texture Paint",
          "Wallpaper",
          "Wall Panels (PVC / WPC)",
          "Wall Stickers & Decals",
          "Floor Tiles",
          "Wooden Flooring",
          "Marble & Granite",
          "Tile Adhesives & Grout",
          "Paint Brushes & Rollers"
        ]
      },
      {
        name: "Curtains & Blinds",
        items: [
          "Curtains",
          "Curtain Rods & Tracks",
          "Blinds (Roller / Venetian)",
          "Window Sheers"
        ]
      },
      {
        name: "Furniture",
        items: [
          "Sofa Sets",
          "Beds",
          "Wardrobes",
          "TV Units",
          "Dining Tables"
        ]
      },
      {
        name: "Decor & Plants",
        items: [
          "Wall Art & Frames",
          "Mirrors",
          "Clocks",
          "Showpieces",
          "Indoor Plants & Pots"
        ]
      },
      {
        name: "Storage & Hardware",
        items: [
          "Shelves & Racks",
          "Shoe Racks",
          "Cabinets",
          "Storage Boxes",
          "Hardware Fittings"
        ]
      }
    ],
  },
];

// Helper function to convert category name to URL-safe slug
const categoryToSlug = (categoryName: string): string => {
  return categoryName
    .toLowerCase()
    .replace(/\s*&\s*/g, '-and-')  // Replace & with -and-
    .replace(/\s+/g, '-');          // Replace spaces with hyphens
};

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [activeSubCategory, setActiveSubCategory] = useState<string | null>(null);
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { user, isAuthenticated, logout } = useAuth();
  const [cartCount, setCartCount] = useState(0);

  const refreshCartCount = async () => {
    try {
      const res = await apiService.getCart();
      if (res.success) setCartCount(res.data?.length || 0);
    } catch {
      setCartCount(0);
    }
  };

  useEffect(() => {
    refreshCartCount();
    const handler = () => refreshCartCount();
    window.addEventListener("cart-updated", handler as EventListener);
    return () => window.removeEventListener("cart-updated", handler as EventListener);
  }, []);

  const toggleCategory = (categoryName: string) => {
    setExpandedCategory(expandedCategory === categoryName ? null : categoryName);
  };

  const handleSearchFocus = () => {
    if (isMobile) {
      navigate("/search-suggestions");
    }
  };

  return (
    <div className="bg-background border-b border-border/40 font-roboto sticky top-0 z-50">
      {/* Main Navbar */}
      <div className="container mx-auto px-2 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden text-gray-800 hover:bg-cyan-200 p-1"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            <Link to="/" className="flex items-center space-x-2">
              <img
                src="/zythova-logo.png"
                alt="Zythova Logo"
                className="h-10 w-auto object-contain"
              />
              <span className="text-2xl font-bold text-foreground tracking-tight">Zythova</span>
            </Link>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl mx-4 hidden md:block">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search for products, brands and more"
                className="w-full pl-4 pr-12 py-2 bg-background text-foreground border border-gray-300 rounded-md focus:border-primary"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    const target = e.target as HTMLInputElement;
                    if (target.value.trim()) {
                      navigate(`/search?q=${encodeURIComponent(target.value.trim())}`);
                    }
                  }
                }}
              />
              <Button
                size="sm"
                className="absolute right-0 top-0 h-full px-4 bg-primary hover:bg-primary/90 text-primary-foreground rounded-l-none rounded-r-md"
                onClick={() => {
                  const input = document.querySelector('input[placeholder="Search for products, brands and more"]') as HTMLInputElement;
                  if (input && input.value.trim()) {
                    navigate(`/search?q=${encodeURIComponent(input.value.trim())}`);
                  }
                }}
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>


          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            <Link to="/seller">
              <Button
                variant="ghost"
                className="text-gray-800 hover:bg-cyan-200 flex items-center space-x-1"
              >
                <Store className="h-4 w-4" />
                <span className="text-sm hidden md:inline">Seller Hub</span>
              </Button>
            </Link>
            {isAuthenticated ? (
              <Link to="/profile">
                <Button
                  variant="ghost"
                  className="text-gray-800 hover:bg-cyan-200 flex items-center space-x-1"
                >
                  <User className="h-4 w-4" />
                  <span className="text-sm hidden md:inline">{user?.firstName || 'Profile'}</span>
                </Button>
              </Link>
            ) : (
              <Link to="/auth">
                <Button
                  variant="ghost"
                  className="text-gray-800 hover:bg-cyan-200 flex items-center space-x-1"
                >
                  <User className="h-4 w-4" />
                  <span className="text-sm hidden md:inline">Login</span>
                </Button>
              </Link>
            )}
            <Link to="/cart">
              <Button
                className="bg-warning hover:bg-warning/90 text-warning-foreground flex items-center space-x-1 relative px-6 rounded-full font-medium"
              >
                <ShoppingCart className="h-4 w-4 mr-1" />
                <span className="text-sm hidden md:inline">Cart</span>
                {cartCount > 0 && (
                  <span className="ml-2 bg-white text-warning text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Button>
            </Link>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="mt-3 md:hidden">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search for products, brands and more"
              className="w-full pl-4 pr-12 py-2 bg-background text-foreground border border-gray-300 rounded-md focus:border-primary"
              onFocus={handleSearchFocus}
              readOnly
            />
            <Button
              size="sm"
              className="absolute right-0 top-0 h-full px-4 bg-primary hover:bg-primary/90 text-primary-foreground rounded-l-none rounded-r-md"
              onClick={handleSearchFocus}
            >
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Category Navigation */}
      <div className="bg-background border-t border-border">
        <div className="container mx-auto px-2">
          {/* Desktop Categories */}
          <div className="hidden md:flex items-center space-x-4 py-2 overflow-x-auto no-scrollbar whitespace-nowrap">
            {categories.map((category) => (
              <HoverCard
                key={category.name}
                openDelay={0}
                closeDelay={100}
                onOpenChange={(open) => {
                  if (open) {
                    // Reset to first item or keep null to let logic verify default
                    setActiveSubCategory(null);
                  }
                }}
              >
                <HoverCardTrigger asChild>
                  <Link to={`/category/${categoryToSlug(category.name)}`}>
                    <Button
                      variant="ghost"
                      className="text-foreground hover:bg-muted flex items-center space-x-1"
                    >
                      <span className="text-sm">{category.name}</span>
                      <ChevronDown className="h-3 w-3" />
                    </Button>
                  </Link>
                </HoverCardTrigger>
                <HoverCardContent
                  className={`bg-popover border border-border p-0 ${category.name === "Fashion & Beauty" || category.name === "Groceries" || category.name === "Devices" || category.name === "Electrical & Electronics" || category.name === "Automotive & Automobile" || category.name === "Sports" || category.name === "Home Interior & Decor" || category.name === "Medical & Pharmacy"
                    ? "w-auto min-w-[500px]"
                    : "w-64"
                    }`}
                >
                  <div className="py-2">
                    {category.name === "Fashion & Beauty" || category.name === "Groceries" || category.name === "Devices" || category.name === "Electrical & Electronics" || category.name === "Automotive & Automobile" || category.name === "Sports" || category.name === "Home Interior & Decor" || category.name === "Medical & Pharmacy" ? (
                      // Special layout for Mega Menus
                      <div className="flex w-[800px] h-[500px]">
                        {/* Left Side - Categories */}
                        <div className="w-1/3 border-r bg-muted/30 py-2 overflow-y-auto custom-scrollbar">
                          {(category.subcategories as SubCategoryGroup[]).map((section, sectionIndex) => (
                            <div
                              key={sectionIndex}
                              className={`px-4 py-3 cursor-pointer flex justify-between items-center transition-colors ${(activeSubCategory === section.name || (!activeSubCategory && sectionIndex === 0))
                                ? "bg-white text-primary font-medium border-l-4 border-l-primary"
                                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                                }`}
                              onMouseEnter={() => setActiveSubCategory(section.name)}
                            >
                              <span className="text-sm">{section.name}</span>
                              <ChevronRight className="h-4 w-4" />
                            </div>
                          ))}
                        </div>

                        {/* Right Side - Items */}
                        <div className="w-2/3 p-6 bg-white overflow-y-auto custom-scrollbar">
                          <h3 className="font-semibold text-gray-800 mb-4 text-lg">
                            {(activeSubCategory || (category.subcategories[0] as SubCategoryGroup).name)}
                          </h3>
                          <div className="grid grid-cols-2 gap-x-8 gap-y-3">
                            {(category.subcategories as SubCategoryGroup[])
                              .find((s) => s.name === (activeSubCategory || (category.subcategories[0] as SubCategoryGroup).name))
                              ?.items.map((item, itemIndex) => (
                                <Link
                                  key={itemIndex}
                                  to={`/category/${categoryToSlug(category.name)}`}
                                  className="text-sm text-gray-600 hover:text-primary hover:underline flex items-center"
                                  title={item}
                                >
                                  {item}
                                </Link>
                              ))
                            }
                          </div>

                          <div className="mt-8 pt-6 border-t">
                            <Link
                              to={`/category/${categoryToSlug(category.name)}`}
                              className="inline-flex items-center text-primary font-medium hover:underline"
                            >
                              View all in {(activeSubCategory || (category.subcategories[0] as SubCategoryGroup).name)}
                              <ChevronRight className="h-4 w-4 ml-1" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    ) : (
                      // Default layout for other categories
                      category.subcategories.map((subcategory, index) => (
                        <div
                          key={index}
                          className="px-4 py-2 text-popover-foreground hover:bg-accent cursor-pointer"
                        >
                          <Link
                            to={`/category/${categoryToSlug(category.name)}`}
                            className="w-full block"
                          >
                            {subcategory as string}
                          </Link>
                        </div>
                      ))
                    )}
                  </div>
                </HoverCardContent>
              </HoverCard>
            ))}
          </div>

          {/* Mobile Categories Quick Access */}
          <div className="md:hidden py-2 overflow-x-auto">
            <div className="flex space-x-2 min-w-max">
              {categories.map((category) => (
                <Link
                  key={category.name}
                  to={`/category/${categoryToSlug(category.name)}`}
                  className="whitespace-nowrap px-3 py-1 text-xs bg-muted hover:bg-muted/80 text-muted-foreground rounded-full transition-colors"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Mobile Category Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden py-4 space-y-2 max-h-[70vh] overflow-y-auto">
              {/* Mobile Login/User Links */}
              <div className="pb-4 border-b border-border">
                {isAuthenticated ? (
                  <>
                    <div className="px-4 py-2 text-sm text-muted-foreground">
                      Welcome, {user?.firstName} {user?.lastName}
                    </div>
                    <Link to="/profile">
                      <Button
                        variant="ghost"
                        className="text-gray-800 hover:bg-cyan-200 w-full justify-start"
                      >
                        <User className="h-4 w-4 mr-2" />
                        <span className="text-sm">Profile</span>
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      className="text-red-600 hover:bg-red-100 w-full justify-start"
                      onClick={() => {
                        logout();
                        navigate('/');
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      <span className="text-sm">Logout</span>
                    </Button>
                  </>
                ) : (
                  <Link to="/auth">
                    <Button
                      variant="ghost"
                      className="text-gray-800 hover:bg-cyan-200 w-full justify-start"
                    >
                      <User className="h-4 w-4 mr-2" />
                      <span className="text-sm">Login</span>
                    </Button>
                  </Link>
                )}
              </div>

              {/* Categories */}
              {categories.map((category) => (
                <div key={category.name} className="border-b border-border pb-2">
                  <div className="w-full flex items-center justify-between font-medium text-foreground mb-2 py-2 hover:bg-muted rounded px-2">
                    <Link
                      to={`/category/${categoryToSlug(category.name)}`}
                      className="flex-1"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <span>{category.name}</span>
                    </Link>
                    <button
                      onClick={() => toggleCategory(category.name)}
                      className="p-1"
                    >
                      <ChevronDown
                        className={`h-4 w-4 transition-transform ${expandedCategory === category.name ? 'rotate-180' : ''
                          }`}
                      />
                    </button>
                  </div>
                  {expandedCategory === category.name && (
                    <div className="space-y-1 pl-4 bg-muted/30 rounded p-2">
                      {category.name === "Fashion & Beauty" || category.name === "Groceries" || category.name === "Devices" || category.name === "Electrical & Electronics" || category.name === "Automotive & Automobile" || category.name === "Sports" || category.name === "Home Interior & Decor" || category.name === "Medical & Pharmacy" ? (
                        // Special mobile layout for Grouped Categories
                        (category.subcategories as SubCategoryGroup[]).map((section, sectionIndex) => (
                          <div key={sectionIndex} className="mb-3">
                            <div className="font-medium text-foreground mb-2 text-sm">
                              {section.name}
                            </div>
                            <div className="pl-4 space-y-1">
                              {section.items.map((item, itemIndex) => (
                                <Link
                                  key={itemIndex}
                                  to={`/category/${categoryToSlug(category.name)}`}
                                  className="block text-xs text-muted-foreground hover:text-foreground py-1 px-2 rounded hover:bg-muted flex items-center"
                                  onClick={() => setIsMobileMenuOpen(false)}
                                >
                                  <span className="w-1.5 h-1.5 bg-primary rounded-full mr-2"></span>
                                  {item}
                                </Link>
                              ))}
                            </div>
                          </div>
                        ))
                      ) : (
                        // Default mobile layout for other categories
                        category.subcategories.map((subcategory, index) => (
                          <Link
                            key={index}
                            to={`/category/${categoryToSlug(category.name)}`}
                            className="block text-sm text-muted-foreground hover:text-foreground py-2 px-2 rounded hover:bg-muted"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            {subcategory as string}
                          </Link>
                        ))
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
