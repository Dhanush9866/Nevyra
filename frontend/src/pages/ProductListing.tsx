import { useEffect, useState } from "react";
import { useParams, Link, useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Star, ShoppingCart, SlidersHorizontal, ChevronLeft, ChevronRight } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { apiService } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

type ProductItem = {
  _id: string;
  title: string;
  price: number;
  mrp?: number;
  discount?: number;
  images?: string[];
  rating?: number;
  reviewsCount?: number;
  brand?: string;
};

// Category structure with subcategories (matching Navbar hover menu)
const categories: Record<string, string[]> = {
  "Medical & Pharmacy": [
    "Oral Care", "Body Care", "Intimate Care", "Hand Wash & Sanitizers",
    "Face Wash & Cleansers", "Moisturizers & Creams", "Sunscreen", "Acne & Pimple Care", "Anti-Aging", "Serums & Toners",
    "Shampoo", "Conditioner", "Hair Oil", "Hair Serum", "Hair Fall Treatment", "Dandruff Care",
    "Face Makeup", "Eye Makeup", "Lip Makeup", "Makeup Kits", "Makeup Tools & Brushes",
    "Foot Creams", "Hand Creams", "Nail Care", "Manicure & Pedicure Kits",
    "Hair Dryers", "Hair Straighteners", "Trimmers & Clippers", "Facial Machines", "Salon Chairs & Accessories",
    "Razors", "Shaving Cream & Foam", "After Shave", "Hair Removal Creams", "Waxing Products", "Bleach Crems", "Epilator Devices", "Threading Tools",
    "Perfumes", "Deodorants", "Body Mists", "Roll-On",
    "Health Supplements", "Vitamins & Minerals", "Protein & Nutrition", "Immunity Boosters", "Herbal Supplements",
    "Bp Monitors", "Glucometers", "Thermometers", "Nebulizers", "Pulse Oximeters", "Weighing Scales",
    "Orthopedic Supports", "Knee/Back/Wrist Supports", "Hot & Cold Packs", "Posture Correctors", "Physiotherapy Equipment",
    "First Aid Kits", "Bandages & Gauze", "Antiseptic Liquids", "Cotton & Medical Tapes", "Burn Care",
    "Sanitary Napkins", "Menstrual Cups", "Intimate Wash", "Maternity Care", "Pregnancy Test Kits",
    "Men's Grooming", "Hair Loss Solutions", "Sexual Wellness",
    "Ayurvedic Medicines", "Herbal Oils", "Herbal Powders", "Traditional Remedies",
    "Adult Diapers", "Walking Sticks", "Hearing Aids", "Wheelchairs", "Pill Organizers",
    "Diabetic Care", "Sugar Free Products", "Heart Care", "Weight Management"
  ],
  "Groceries": [
    "Rice & Rice Products", "Atta, Flours & Sooji", "Pulses & Dals", "Cooking Oils & Ghee", "Sugar, Jaggery & Salt",
    "Snacks & Namkeen", "Biscuits & Cookies", "Breakfast Cereals", "Noodles, Pasta & Vermicelli", "Ready to Eat/ Ready to Cook",
    "Whole Spices", "Powdered Spices", "Masala Mixes",
    "Milk", "Curd & Yogurt", "Butter & Cheese", "Eggs",
    "Health Drinks", "Soft Drinks & Juices",
    "Chocolates", "Candies & Toffees", "Indian Sweets",
    "Pickles", "Sauces & Ketchup", "Jams & Spreads",
    "Dishwash & Cleaners", "Laundry Detergents", "Floor & Toilet Cleaners", "Garbage Bags",
    "Tissues & Paper Towels", "Napkins", "Foils & Cling Wraps",
    "Organic Staples", "Dry Fruits & Nuts", "Seeds & Superfoods",
    "Vegetables", "Fruits", "Leafy Vegetables", "Herbs & Seasonings",
    "Chips", "Cookies", "Popcorn", "Instant Snacks", "Bread & Bakery"
  ],
  "Fashion & Beauty": [
    "T-shirts", "Polo T-Shirts", "Hoodies", "Blazers", "Casual Shirts", "Formal Shirts",
    "Jeans", "Casual Trousers", "Formal Trousers", "Shorts", "Cargos", "Suits", "Ties, Socks",
    "Sweatshirts", "Jackets", "Sweater", "Track pants", "Joggers", "Pathani Suits", "Tracksuits", "Sherwanis",
    "Three Fourths", "Kurta", "Dhoti", "Lungi", "Vests", "Boxers", "Thermals", "Night Suits", "Briefs", "Trunks",
    "Gym wear", "Winter wear", "Rain wear", "Waistcoats",
    "Dresses", "Topwear", "Jumpsuits", "Salwar Suits", "Anarkali", "Dupattas", "Petticoats", "Palazzos",
    "Camisoles", "Skirts", "Jeggings & Tights", "Trousers", "Bras", "Panties", "Night Dresses & Nighties",
    "Shapewear", "Swim & Beachwear", "Party Dresses", "Sports Wear", "Sarees", "Blouse", "Kurtis", "Kurtas",
    "Dress Material", "Lehenga", "Leggings", "Churidars", "Dhoti Pants", "Saree Shapewear",
    "Outdoor Toys", "Board Games", "Musical Toys", "Dolls", "Doll Houses", "Building Blocks & LEGO-type Toys",
    "STEM Toys", "Pretend Play", "Action Figures", "Art & Craft kits", "Ride-on Toys", "Puzzles", "Toy Guns",
    "Vehicles", "Soft Toys", "Remote Control Toys", "Educational Toys", "Helicopter", "Drones",
    "School Bags", "Pencil Boxes", "Stationery Sets", "Tiffin Bags", "Rain Covers for Bags", "Lunch box", "Bottle", "School Combo Sets",
    "Diapers", "Wipes", "Baby Rattles & Teethers", "Baby Medical & Health Care", "Baby Cleaners & Detergents",
    "Baby Food & Formula", "Baby Bibs", "Pacifiers & Soothers", "Baby Towels & Bedding", "Baby Clothes & Blankets",
    "Diper Bags", "Baby Grooming", "Baby Hair & Skin Care", "Baby Bathing", "Baby Feeding Bottle & Accessories", "Baby Safety Accessories",
    "Titan", "Fastrack", "Sonata", "Casio", "Timex", "boAt", "Noise", "Fire-Boltt", "Amazfit", "Fossil",
    "Daniel Wellington", "Armani Exchange", "Tommy Hilfiger", "Michael Kors",
    "Handbags", "Shoulder Bags", "Sling Bags", "Tote Bags", "Clutches", "Hobo bags",
    "Backpacks", "Laptop Bags", "Office Bags", "Travel Bags", "Duffel Bags",
    "Wallets & Belts", "Pouches", "Coin purses", "Sunglasses",
    "Earrings", "Necklaces", "Rings", "Bangles & Bracelets", "Anklets", "Noise Pins", "Bridal Jewelry", "Men's Jewelry", "Kids Jewelry",
    "Trolley Bags", "Suitcases", "Cabin Luggage", "Check-in Luggage",
    "Duffle Bags", "Travel Backpacks", "Weekender Bags",
    "Laptop Trolleys", "Office Travel Bags", "Garment Bags"
  ],
  "Devices": [
    "Mobile Phones", "Mobile Covers & Cases", "Chargers & Cables", "Power Banks", "Screen Protectors", "Earphones & Headphones", "Bluetooth Speakers",
    "Laptops", "Desktops", "Tablets", "Keyboards & Mouse", "Monitors", "Printers & Scanners",
    "Smart TVs", "Streaming Devices", "Soundbars", "Home Theaters", "Projectors",
    "Refrigerators", "Washing Machines", "Air conditioners", "Microwave Ovens", "Dishwashers", "Water Purifiers",
    "Smart Watches", "Fitness Bands", "VR Headsets", "Smart Glasses",
    "Digital Cameras", "DSLR Cameras", "Action Cameras", "Camera Lenses", "Tripods", "Memory Cards",
    "Gaming Consoles", "Game Controllers", "Gaming Headsets", "Gaming Accessories",
    "Smart Lights", "Smart Plugs", "Smart Door Locks", "Security Cameras", "WiFi- Routers", "Smart Sensors"
  ],
  "Electrical": [
    "Inverters & UPS", "Batteries", "Transformers", "Stabilizers", "UPS Systems", "Solar Inverters", "Battery Accessories",
    "Wiring Cables & Wires", "Switches & Sockets", "MCBs, RCCBs & DB Boxes", "Extension Boards", "Plug Tops & Adaptors", "Control Switches", "Relays & Contractors",
    "Ceiling Lights", "CFL Bulbs", "Wall Lights", "Outdoor Lights", "Street Lights", "Emergency Lights",
    "Table Fans", "Pedestal Fans", "Exhaust Fans", "Ventilation Fans", "Water Heaters", "Room Heaters", "Irons", "Mixers & Grinders", "Electric Kettles", "Induction Cooktops",
    "Smart Switches", "Smart Plugs", "Smart Lights", "Smart Doorbells", "Home Automation Kits",
    "Electrical Tools", "Testing Devices", "Tool kits", "Safety Gloves & Gear", "Industrial panels", "Heavy Duty Cables"
  ],
  "Automotive": [
    "Helmets", "Bike covers", "Bike Lights", "Bike Batteries", "Bike Engine Oil", "Bike Brake Oil", "Bike Air Filters", "Bike Cleaning & Care",
    "Car Covers", "Car Seat Covers", "Car Mats", "Car Chargers & Holders", "Car Lights & Fog Lamps",
    "Engine Oil", "Brake Fluid", "Coolant", "Gear Oil", "Power Steering Oil",
    "Air Filters", "Oil Filters", "Fuel Filters", "Spark Plugs", "Brake Pads", "Clutch Parts", "Horns", "Wipers", "Fuse & Relays",
    "Car Wash & Shampoo", "Polish & Wax", "Interior Cleaners", "Tyre Cleaners", "Chain Lubes",
    "Car Tyres", "Bike Tyres", "Alloy Wheels", "Tyre Inflators",
    "Tool Kits", "Hydraulic Jacks", "First Aid Kits", "Warning Traingles"
  ],
  "Sports": [
    "Batting Gloves", "Batting Pads", "Helmets", "Wicket Keeping Gloves", "Wicket Keeping Pads", "Knee pads",
    "Football", "Football Shoes", "Shin Guards", "Goal Posts",
    "Badminton Rackets", "Shuttlecocks", "Badminton Nets", "Grip Tapes", "Tennis Rackets", "Tennis Balls", "Tennis Nets", "Table Tennis Bats", "Table Tennis Balls", "TT Tables",
    "Basketball", "Basketball Ring", "Basketball Net",
    "Carrom Boards", "Chess Boards",
    "Dumbbells", "Barbells", "Weight Plates", "Resistance Bands", "Skipping Ropes", "Yoga Mats", "Exercise Balls",
    "Cycles", "Cycling Helmets", "Skates", "Skateboards",
    "Sports Shoes", "Sports Gloves", "Sports Bags", "Water Bottles"
  ],
  "Home Interior": [
    "POP Ceiling", "LED Ceiling Lights", "Chandeliers", "Wall Lights", "Spot Lights",
    "Main Door", "Bedroom Doors", "PVC / UPVC Doors", "Door Frames", "Door Handles & Locks", "Windows & Grills",
    "Texture Paint", "Wallpaper", "Wall Panels (PVC / WPC)", "Wall Stickers & Decals", "Floor Tiles", "Wooden Flooring", "Marble & Granite",
    "Vinyl Flooring", "Carpet & Rugs",
    "Modular Kitchen", "Kitchen Cabinets", "Kitchen Sinks", "Kitchen Faucets", "Chimney & Hobs", "Kitchen Storage",
    "Bathroom Fittings", "Showers & Taps", "Bathroom Accessories", "Sanitary Ware", "Bathroom Mirrors",
    "Sofa Sets", "Dining Tables", "Beds & Mattresses", "Wardrobes", "TV Units", "Study Tables", "Office Chairs",
    "Curtains & Blinds", "Cushions & Covers", "Wall Art & Paintings", "Showpieces & Decor", "Artificial Plants", "Mirrors",
    "Table Lamps", "Floor Lamps", "String Lights", "Night Lamps"
  ],
  "Electronics": [
    "Mobile Phones", "Mobile Covers & Cases", "Chargers & Cables", "Power Banks", "Screen Protectors", "Earphones & Headphones", "Bluetooth Speakers",
    "Laptops", "Desktops", "Tablets", "Keyboards & Mouse", "Monitors", "Printers & Scanners",
    "Smart TVs", "Streaming Devices", "Soundbars", "Home Theaters", "Projectors",
    "Smart Watches", "Fitness Bands", "VR Headsets", "Smart Glasses",
    "Digital Cameras", "DSLR Cameras", "Action Cameras", "Camera Lenses", "Tripods", "Memory Cards"
  ]
};

const ProductListing = () => {
  const { categoryName } = useParams();
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [priceRange, setPriceRange] = useState([0, 1000000]);
  const [addingId, setAddingId] = useState<string | null>(null);
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20; // 4 columns * 5 rows
  const { toast } = useToast();
  const [sortBy, setSortBy] = useState("popularity");
  const [showFilters, setShowFilters] = useState(false);

  // Map URL category name to display category name
  const categoryMap: Record<string, string> = {
    'medical-and-pharmacy': 'Medical & Pharmacy',
    'groceries': 'Groceries',
    'fashion-and-beauty': 'Fashion & Beauty',
    'devices': 'Devices',
    'electrical': 'Electrical',
    'automotive': 'Automotive',
    'sports': 'Sports',
    'home-interior': 'Home Interior',
    'electronics': 'Electronics',
  };

  // Get the current category display name
  const currentCategory = categoryName && categoryName !== 'all'
    ? categoryMap[categoryName] || categoryName
    : (searchParams.get('search') || searchParams.get('q') ? "Search Results" : 'Electronics');

  // Get subcategories for the current category
  const currentSubcategories = categories[currentCategory as keyof typeof categories] || [];

  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [inStock, setInStock] = useState(false);
  const [fastDelivery, setFastDelivery] = useState(false);

  // Debounced price range state for API calls
  const [debouncedPriceRange, setDebouncedPriceRange] = useState(priceRange);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedPriceRange(priceRange);
    }, 500);
    return () => clearTimeout(timer);
  }, [priceRange]);

  useEffect(() => {
    (async () => {
      window.scrollTo(0, 0); // Force scroll to top on category change
      console.log('========== FRONTEND PRODUCT FETCH ==========');
      const params: any = { limit: 100 };

      // Handle Category from URL param
      if (categoryName && categoryName !== 'all') {
        params.category = categoryMap[categoryName] || categoryName;
      }

      // Handle Filters
      // 1. Subcategories
      // Prioritize state (sidebar filter) over URL param, or merge them?
      // For now, let's use the state if it has items.
      const subCategoryParam = searchParams.get('subCategory');

      let finalSubIndices: string[] = [];
      if (selectedSubcategories.length > 0) {
        finalSubIndices = selectedSubcategories;
      } else if (subCategoryParam) {
        // Initial load from URL
        finalSubIndices = subCategoryParam.split(',');
        // We should probably sync this to state if it's the first run, 
        // but for now let's just use it for the fetch.
        // Note: Managing 2 sources of truth is tricky. 
        // Ideally we sync URL to state on mount. 
        // For simplistic implementation:
      }

      if (finalSubIndices.length > 0) {
        params.subCategories = finalSubIndices.join(',');
      }

      // 2. Search
      const searchQuery = searchParams.get('search') || searchParams.get('q');
      if (searchQuery) {
        params.search = searchQuery;
      }

      // 3. Price
      params.minPrice = debouncedPriceRange[0];
      params.maxPrice = debouncedPriceRange[1];

      // 4. Rating
      if (selectedRating !== null) {
        params.minRating = selectedRating;
      }

      // 4. Availability
      if (inStock) {
        params.inStock = true;
      }
      // if (fastDelivery) params.fastDelivery = true; // Add backend support if needed

      try {
        console.log('API request params:', params);

        // Always use the multi-subcategory endpoint if we want advanced filtering?
        // Or generic getProducts? getProducts wraps /products which likely supports standard filters.
        // Let's assume getProducts handles standard filters.
        // But getProductsByMultipleSubcategories is specific. 
        // Let's stick to getProducts or getProductsByMultipleSubcategories depending on subcats.

        const res = params.subCategories
          ? await apiService.getProductsByMultipleSubcategories(params)
          : await apiService.getProducts(params);

        console.log('API response received:', {
          success: res.success,
          dataLength: res.data?.length,
          pagination: res.pagination,
          message: res.message
        });

        if (res.success) {
          const mappedProducts = res.data.map((p: any) => ({
            _id: p.id || p._id,
            title: p.title,
            price: p.price,
            mrp: p.mrp || p.price,
            images: p.images || [],
            rating: p.rating || 4.5,
            reviewsCount: p.reviewsCount || 0,
            brand: p.brand || p.category,
          }));
          setProducts(mappedProducts);
        } else {
          console.error('API returned success: false', res.message);
          setProducts([]);
        }
      } catch (err) {
        console.error('Error fetching products:', err);
        setProducts([]);
      }
    })();
    setCurrentPage(1);
  }, [categoryName, selectedSubcategories, debouncedPriceRange, selectedRating, inStock, fastDelivery, searchParams]);

  // Sync URL subCategory param to state on mount
  useEffect(() => {
    const subParam = searchParams.get('subCategory');
    if (subParam) {
      const initialSubs = subParam.split(',');
      // Only set if state is empty to avoid overwriting user interaction? 
      // Or always set? Usually strictly controlled or strictly URL. 
      // Let's set it if empty.
      if (selectedSubcategories.length === 0) {
        setSelectedSubcategories(initialSubs);
      }
    }
  }, [searchParams]); // Simple dependency

  const handleSubcategoryChange = (subcategory: string, checked: boolean) => {
    if (checked) {
      setSelectedSubcategories([...selectedSubcategories, subcategory]);
    } else {
      setSelectedSubcategories(selectedSubcategories.filter((s) => s !== subcategory));
    }
  };

  const handleAddToCart = async (e: React.MouseEvent, productId: string) => {
    e.preventDefault(); // Prevent Link navigation
    e.stopPropagation();

    try {
      setAddingId(productId);
      const res = await apiService.addToCart(productId, 1);
      if (res.success) {
        window.dispatchEvent(new Event("cart-updated"));
        toast({
          title: "Success",
          description: "Added to cart successfully",
        });
      } else {
        throw new Error(res.message || "Failed to add to cart");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add to cart",
        variant: "destructive",
      });
    } finally {
      setAddingId(null);
    }
  };

  // Removed client-side filteredProducts logic. 
  // We now trust 'products' is already filtered by server.
  const sortedProducts = [...products].sort((a, b) => {
    switch (sortBy) {
      case "price-low-high":
        return a.price - b.price;
      case "price-high-low":
        return b.price - a.price;
      case "rating":
        return (b.rating || 0) - (a.rating || 0);
      case "newest":
        return 0; // Backend handles if needed, or keeping it no-op
      default:
        return 0;
    }
  });

  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
  const paginatedProducts = sortedProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background font-roboto">
      <Navbar />

      <div className="w-full px-4 py-6">
        {/* Breadcrumb and Header */}
        <div className="mb-4">
          <nav className="text-sm text-muted-foreground mb-2">
            Home / {categoryName || "Category"}
          </nav>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h1 className="text-2xl font-bold text-foreground capitalize">
              {categoryName || "Products"} ({sortedProducts.length} items)
            </h1>
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                className="md:hidden"
                onClick={() => setShowFilters(!showFilters)}
              >
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Filters
              </Button>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popularity">Popularity</SelectItem>
                  <SelectItem value="price-low-high">
                    Price: Low to High
                  </SelectItem>
                  <SelectItem value="price-high-low">
                    Price: High to Low
                  </SelectItem>
                  <SelectItem value="rating">Customer Rating</SelectItem>
                  <SelectItem value="newest">Newest First</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          {/* Sidebar Filters - Amazon Style */}
          <div className={`w-60 ${showFilters ? "block" : "hidden"} md:block`}>
            <div className="bg-card border-0 sticky top-4">
              <div className="p-0">
                {/* Clear Filters Button */}
                {(selectedSubcategories.length > 0 || selectedRating !== null || inStock || (priceRange[0] !== 0 || priceRange[1] !== 1000000)) && (
                  <div className="mb-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedSubcategories([]);
                        setPriceRange([0, 1000000]);
                        setSelectedRating(null);
                        setInStock(false);
                      }}
                      className="w-full text-xs"
                    >
                      Clear Filters
                    </Button>
                  </div>
                )}
                {/* Category Filter with Subcategories */}
                <div className="mb-4 border-b pb-3">
                  <h4 className="font-bold text-foreground mb-2 text-base">{currentCategory}</h4>
                  <div className="max-h-[400px] overflow-y-auto pr-2 space-y-1 filter-scroll">
                    {currentSubcategories.map((subcategory) => (
                      <div key={subcategory} className="flex items-center space-x-2 py-0.5">
                        <Checkbox
                          id={subcategory}
                          checked={selectedSubcategories.includes(subcategory)}
                          onCheckedChange={(checked) =>
                            handleSubcategoryChange(subcategory, checked as boolean)
                          }
                          className="h-3 w-3 flex-shrink-0"
                        />
                        <label
                          htmlFor={subcategory}
                          className="text-xs text-foreground cursor-pointer hover:text-primary leading-tight"
                        >
                          {subcategory}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div className="mb-4 border-b pb-3">
                  <h4 className="font-bold text-foreground mb-2 text-base">
                    Price Range
                  </h4>
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    max={1000000}
                    min={0}
                    step={1000}
                    className="mb-2"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>₹{priceRange[0].toLocaleString()}</span>
                    <span>₹{priceRange[1].toLocaleString()}</span>
                  </div>
                </div>

                {/* Rating Filter */}
                <div className="mb-4 border-b pb-3">
                  <h4 className="font-bold text-foreground mb-2 text-base">
                    Customer Rating
                  </h4>
                  <div className="space-y-1">
                    {[4, 3, 2, 1].map((rating) => (
                      <div key={rating} className="flex items-center space-x-2 py-0.5">
                        <Checkbox
                          id={`rating-${rating}`}
                          className="h-3 w-3"
                          checked={selectedRating === rating}
                          onCheckedChange={(checked) => setSelectedRating(checked ? rating : null)}
                        />
                        <label
                          htmlFor={`rating-${rating}`}
                          className="text-xs text-foreground cursor-pointer flex items-center hover:text-primary"
                        >
                          {rating}
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 ml-1" />
                          & above
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Availability */}
                <div className="mb-4">
                  <h4 className="font-bold text-foreground mb-2 text-base">
                    Availability
                  </h4>
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2 py-0.5">
                      <Checkbox
                        id="in-stock"
                        className="h-3 w-3"
                        checked={inStock}
                        onCheckedChange={(checked) => setInStock(checked as boolean)}
                      />
                      <label
                        htmlFor="in-stock"
                        className="text-xs text-foreground cursor-pointer hover:text-primary"
                      >
                        In Stock
                      </label>
                    </div>
                    {/* Fast delivery placeholder if needed */}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Product Grid */}
          <div className="flex-1">
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
              {paginatedProducts.map((product) => (
                <div
                  key={product._id}
                  className="group hover:shadow-lg transition-shadow duration-300 bg-card border border-border"
                >
                  <div className="p-3">
                    <Link to={`/product/${product._id}`}>
                      <div className="relative mb-2">
                        <img
                          src={product.images?.[0] || '/placeholder.svg'}
                          alt={product.title}
                          className="w-full h-32 md:h-48 object-cover"
                        />
                        <Badge className="absolute top-1 left-1 bg-discount text-white text-xs rounded-none">
                          {product.discount > 0 ? product.discount : (product.mrp && product.mrp > product.price ? Math.round(((product.mrp - product.price) / product.mrp) * 100) : 0)}% OFF
                        </Badge>
                      </div>

                      <h3 className="font-semibold text-card-foreground mb-1 font-roboto group-hover:text-primary transition-colors line-clamp-2 text-sm">
                        {product.title}
                      </h3>

                      <div className="flex items-center gap-1 mb-1">
                        <div className="flex items-center">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs font-medium ml-1">
                            {product.rating || 4.5}
                          </span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          ({product.reviewsCount || 0})
                        </span>
                      </div>

                      <div className="flex items-center gap-1 mb-2">
                        <span className="text-lg font-bold text-price">
                          ₹{product.price.toLocaleString()}
                        </span>
                        {product.mrp > product.price && (
                          <span className="text-xs text-muted-foreground line-through">
                            ₹{product.mrp.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </Link>

                    <Button
                      className="w-full bg-primary hover:bg-primary-hover text-primary-foreground text-xs py-2 rounded-none"
                      onClick={(e) => handleAddToCart(e, product._id)}
                      disabled={addingId === product._id}
                    >
                      {addingId === product._id ? (
                        <span className="animate-spin mr-2">⟳</span>
                      ) : (
                        <ShoppingCart className="h-3 w-3 mr-1" />
                      )}
                      {addingId === product._id ? "Adding..." : "Add to Cart"}
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (currentPage > 1) handlePageChange(currentPage - 1);
                        }}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                      // Show only first, last, and pages around current
                      if (
                        page === 1 ||
                        page === totalPages ||
                        (page >= currentPage - 1 && page <= currentPage + 1)
                      ) {
                        return (
                          <PaginationItem key={page}>
                            <PaginationLink
                              href="#"
                              isActive={currentPage === page}
                              onClick={(e) => {
                                e.preventDefault();
                                handlePageChange(page);
                              }}
                              className="cursor-pointer"
                            >
                              {page}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      } else if (
                        page === currentPage - 2 ||
                        page === currentPage + 2
                      ) {
                        return (
                          <PaginationItem key={page}>
                            <PaginationEllipsis />
                          </PaginationItem>
                        );
                      }
                      return null;
                    })}

                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (currentPage < totalPages) handlePageChange(currentPage + 1);
                        }}
                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProductListing;
