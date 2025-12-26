
import Navbar from "@/components/Navbar";
import HeroBanner from "@/components/HeroBanner";
import TopDeals from "@/components/TopDeals";

import WhyChooseUs from "@/components/WhyChooseUs";
import Footer from "@/components/Footer";
import HomeCategoryGrid from "@/components/HomeCategoryGrid";
import HomeProductCarousel from "@/components/HomeProductCarousel";

// Mock Data for Row 1 (Grid) - Using Valid Database Categories/Subcategories
const row1GridGroups = [
  {
    title: "Fashion & Beauty",
    items: [
      { title: "Luggage", offer: "Travel Essentials", image: "https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?auto=format&fit=crop&w=300&q=80", category: "Fashion & Beauty", subcategory: "Luggage" },
      { title: "Watches", offer: "Timeless Style", image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=300&q=80", category: "Fashion & Beauty", subcategory: "Watches" },
      { title: "Men's Shoes", offer: "Step in Style", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=300&q=80", category: "Fashion & Beauty", subcategory: "Men's Shoes" },
      { title: "Women's Shoes", offer: "Elegant Footwear", image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=300&q=80", category: "Fashion & Beauty", subcategory: "Women's Shoes" },
    ]
  },
  {
    title: "Devices",
    items: [
      { title: "Cell Phones & Accessories", offer: "Latest Tech", image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=300&q=80", category: "Devices", subcategory: "Cell Phones & Accessories" },
      { title: "Laptops", offer: "Power & Performance", image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=300&q=80", category: "Devices", subcategory: "Laptops" },
      { title: "Smart Watches", offer: "Tech Meets Style", image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=300&q=80", category: "Devices", subcategory: "Smart Watches" },
      { title: "Televisions", offer: "Home Entertainment", image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=300&q=80", category: "Devices", subcategory: "Televisions" },
    ]
  },
  {
    title: "Groceries",
    items: [
      { title: "General food items", offer: "Pantry Staples", image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=300&q=80", category: "Groceries", subcategory: "General food items" },
      { title: "Daily essentials", offer: "Everyday Needs", image: "https://images.unsplash.com/photo-1610348725531-843dff563e2c?auto=format&fit=crop&w=300&q=80", category: "Groceries", subcategory: "Daily essentials" },
      { title: "Fresh Produce", offer: "Farm Fresh", image: "https://images.unsplash.com/photo-1610348725531-843dff563e2c?auto=format&fit=crop&w=300&q=80", category: "Groceries", subcategory: "General food items" },
      { title: "Snacks", offer: "Tasty Treats", image: "https://images.unsplash.com/photo-1621939514649-28b12e81d196?auto=format&fit=crop&w=300&q=80", category: "Groceries", subcategory: "General food items" },
    ]
  },

];

// Row 2 Carousel: Home Interior & Electrical (Combined Categories)
// Title: "Home Interior & Electrical Deals"
// TODO: Fetch products from categories: "Home Interior" + "Electrical"
const row2Products = [
  { id: "1", title: "Modern Sofa", price: "$499", image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=300&q=80", description: "Velvet Finish" },
  { id: "2", title: "Wooden Chair", price: "$120", image: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=300&q=80", description: "Teak Wood" },
  { id: "3", title: "Coffee Table", price: "$150", image: "https://images.unsplash.com/photo-1532372320572-cda25653a26d?auto=format&fit=crop&w=300&q=80", description: "Glass Top" },
  { id: "4", title: "Bookshelf", price: "$200", image: "https://images.unsplash.com/photo-1594620302200-9a762244a156?auto=format&fit=crop&w=300&q=80", description: "5-Tier" },
  { id: "5", title: "King Size Bed", price: "$899", image: "https://images.unsplash.com/photo-1505693416388-b0346efee535?auto=format&fit=crop&w=300&q=80", description: "With Storage" },
  { id: "6", title: "Lamp Shade", price: "$45", image: "https://images.unsplash.com/photo-1513506003011-3b03c80165bd?auto=format&fit=crop&w=300&q=80", description: "Ambient Light" },
  { id: "7", title: "Office Desk", price: "$250", image: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=300&q=80", description: "Ergonomic" },
  { id: "8", title: "Recliner", price: "$350", image: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=300&q=80", description: "Leather" },
  { id: "9", title: "Dining Table", price: "$600", image: "https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=300&q=80", description: "Solid Wood" },
  { id: "10", title: "Nightstand", price: "$80", image: "https://images.unsplash.com/photo-1532372320978-9b4d05249840?auto=format&fit=crop&w=300&q=80", description: "Modern" },
  { id: "11", title: "Wardrobe", price: "$800", image: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=300&q=80", description: "Spacious" },
  { id: "12", title: "Bookshelf Large", price: "$300", image: "https://images.unsplash.com/photo-1506544521782-b13c7793d256?auto=format&fit=crop&w=300&q=80", description: "Library Style" },
];
const row2Title = "Home Interior & Electrical Deals";

// Mock Data for Row 3 (Grid) - Using Valid Database Categories/Subcategories
const row3GridGroups = [
  {
    title: "Automotive",
    items: [
      { title: "Car Accessories", offer: "Upgrade Your Ride", image: "https://images.unsplash.com/photo-1600273759367-1606d20367eb?auto=format&fit=crop&w=300&q=80", category: "Automotive", subcategory: "Car Accessories" },
      { title: "Bike Accessories", offer: "Ride in Style", image: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=300&q=80", category: "Automotive", subcategory: "Bike Accessories" },
      { title: "Engine Oil", offer: "Smooth Performance", image: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=300&q=80", category: "Automotive", subcategory: "Engine Oil" },
      { title: "Brake Fluid", offer: "Safety First", image: "https://images.unsplash.com/photo-1517524285303-d6fc683dddf8?auto=format&fit=crop&w=300&q=80", category: "Automotive", subcategory: "Brake Fluid" },
    ]
  },
  {
    title: "Sports",
    items: [
      { title: "Cricket Bats", offer: "Play Your Game", image: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=300&q=80", category: "Sports", subcategory: "Cricket Bats" },
      { title: "Cricket Balls", offer: "Match Quality", image: "https://images.unsplash.com/photo-1624526267942-ab0ff8a3e972?auto=format&fit=crop&w=300&q=80", category: "Sports", subcategory: "Cricket Balls" },
      { title: "Cricket Kit", offer: "Complete Set", image: "https://images.unsplash.com/photo-1593766787879-e8c78e09cec1?auto=format&fit=crop&w=300&q=80", category: "Sports", subcategory: "Cricket Kit" },
      { title: "Volleyball", offer: "Team Sports", image: "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?auto=format&fit=crop&w=300&q=80", category: "Sports", subcategory: "Volleyball" },
    ]
  },
  {
    title: "Electrical",
    items: [
      { title: "LED Bulbs", offer: "Energy Efficient", image: "https://images.unsplash.com/photo-1550985616-10810253b84d?auto=format&fit=crop&w=300&q=80", category: "Electrical", subcategory: "LED Bulbs" },
      { title: "Ceiling Fan", offer: "Cool Comfort", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=300&q=80", category: "Electrical", subcategory: "Ceiling Fan" },
      { title: "Batteries", offer: "Power Up", image: "https://images.unsplash.com/photo-1609525512049-5b8f7c9c4f6f?auto=format&fit=crop&w=300&q=80", category: "Electrical", subcategory: "Batteries" },
      { title: "Wiring Cables", offer: "Safe Connections", image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=300&q=80", category: "Electrical", subcategory: "Wiring Cables" },
    ]
  },

];

// Row 4 Carousel: Devices & Automotive (Combined Categories)
// Title: "Devices & Automotive Deals"
// TODO: Fetch products from categories: "Devices" + "Automotive"
const row4Products = [
  { id: "101", title: "iPhone 15 Pro", price: "$999", image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=300&q=80", description: "Titanium Blue" },
  { id: "102", title: "Samsung S24", price: "$899", image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=300&q=80", description: "Onyx Black" },
  { id: "103", title: "Pixel 8", price: "$699", image: "https://images.unsplash.com/photo-1598327105666-5b89351aff23?auto=format&fit=crop&w=300&q=80", description: "Hazel" },
  { id: "104", title: "OnePlus 12", price: "$799", image: "https://images.unsplash.com/photo-1621330381970-4b93fb8b4503?auto=format&fit=crop&w=300&q=80", description: "Emerald" },
  { id: "105", title: "AirPods Pro", price: "$249", image: "https://images.unsplash.com/photo-1588423771073-b8903fbb85b5?auto=format&fit=crop&w=300&q=80", description: "2nd Gen" },
  { id: "106", title: "Galaxy Watch 6", price: "$299", image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=300&q=80", description: "Classic" },
  { id: "107", title: "iPad Air", price: "$599", image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=300&q=80", description: "M1 Chip" },
  { id: "108", title: "Power Bank", price: "$49", image: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?auto=format&fit=crop&w=300&q=80", description: "20000mAh" },
  { id: "109", title: "Bluetooth Speaker", price: "$120", image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=300&q=80", description: "Portable" },
  { id: "110", title: "Action Camera", price: "$399", image: "https://images.unsplash.com/photo-1564466013-4e4d0812702b?auto=format&fit=crop&w=300&q=80", description: "4K 60fps" },
  { id: "111", title: "Drone", price: "$799", image: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?auto=format&fit=crop&w=300&q=80", description: "Camera Drone" },
  { id: "112", title: "VR Headset", price: "$499", image: "https://images.unsplash.com/photo-1622979135225-d2ba269fb1bd?auto=format&fit=crop&w=300&q=80", description: "Immersive" },
];
const row4Title = "Devices & Automotive Deals";

// Mock Data for Row 5 (Grid) - Using Valid Database Categories/Subcategories
const row5GridGroups = [
  {
    title: "Home Interior",
    items: [
      { title: "Curtains", offer: "Window Dressing", image: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=300&q=80", category: "Home Interior", subcategory: "Curtains" },
      { title: "Wall Paint", offer: "Fresh Colors", image: "https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=300&q=80", category: "Home Interior", subcategory: "Wall Paint" },
      { title: "Wallpaper", offer: "Designer Walls", image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=300&q=80", category: "Home Interior", subcategory: "Wallpaper" },
      { title: "Cove Lights", offer: "Ambient Lighting", image: "https://images.unsplash.com/photo-1513506003011-3b03c80165bd?auto=format&fit=crop&w=300&q=80", category: "Home Interior", subcategory: "Cove Lights" },
    ]
  },
  {
    title: "Medical & Pharmacy",
    items: [
      { title: "Personal Care", offer: "Daily Essentials", image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=300&q=80", category: "Medical & Pharmacy", subcategory: "Personal Care" },
      { title: "Skin Care", offer: "Healthy Glow", image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=300&q=80", category: "Medical & Pharmacy", subcategory: "Skin Care" },
      { title: "Hair Care", offer: "Salon Quality", image: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&w=300&q=80", category: "Medical & Pharmacy", subcategory: "Hair Care" },
      { title: "Makeup", offer: "Glamorous Look", image: "https://images.unsplash.com/photo-1522335789203-abd652327ed8?auto=format&fit=crop&w=300&q=80", category: "Medical & Pharmacy", subcategory: "Makeup" },
    ]
  },
  {
    title: "Fashion & Beauty",
    items: [
      { title: "Menswear", offer: "Stylish Collection", image: "https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?auto=format&fit=crop&w=300&q=80", category: "Fashion & Beauty", subcategory: "Menswear" },
      { title: "Women's Wear", offer: "Trendy Outfits", image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=300&q=80", category: "Fashion & Beauty", subcategory: "Women's Wear" },
      { title: "Kids Wear", offer: "Cute & Comfy", image: "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=300&q=80", category: "Fashion & Beauty", subcategory: "Kids Wear" },
      { title: "Kids Shoes", offer: "Fun Footwear", image: "https://images.unsplash.com/photo-1514989940723-e8e51635b782?auto=format&fit=crop&w=300&q=80", category: "Fashion & Beauty", subcategory: "Kids Shoes" },
    ]
  },
];

// Row 6 Carousel: Fashion & Beauty + Medical & Pharmacy (Combined Categories)
// Title: "Fashion, Beauty & Personal Care Deals"
// TODO: Fetch products from categories: "Fashion & Beauty" + "Medical & Pharmacy"
const row6Products = [
  { id: "201", title: "Summer Dress", price: "$49", image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=300&q=80", description: "Floral Print" },
  { id: "202", title: "Denim Jacket", price: "$79", image: "https://images.unsplash.com/photo-1578932750294-f5075e85f44a?auto=format&fit=crop&w=300&q=80", description: "Classic Blue" },
  { id: "203", title: "Sneakers", price: "$120", image: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=300&q=80", description: "Running" },
  { id: "204", title: "Handbag", price: "$150", image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=300&q=80", description: "Leather" },
  { id: "205", title: "Wayfarer Glasses", price: "$99", image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=300&q=80", description: "UV Protection" },
  { id: "206", title: "Gold Watch", price: "$299", image: "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&w=300&q=80", description: "Luxury" },
  { id: "207", title: "Beach Hat", price: "$25", image: "https://images.unsplash.com/photo-1582736159677-bb894672e811?auto=format&fit=crop&w=300&q=80", description: "Straw" },
  { id: "208", title: "Scarf", price: "$35", image: "https://images.unsplash.com/photo-1520975661595-6453674ddc18?auto=format&fit=crop&w=300&q=80", description: "Silk" },
  { id: "209", title: "Heels", price: "$89", image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=300&q=80", description: "Stilettos" },
  { id: "210", title: "Blazer", price: "$110", image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=300&q=80", description: "Formal" },
  { id: "211", title: "Boots", price: "$140", image: "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&w=300&q=80", description: "Leather" },
  { id: "212", title: "Belt", price: "$45", image: "https://images.unsplash.com/photo-1624222247344-550fb60583dc?auto=format&fit=crop&w=300&q=80", description: "Classic" },
];
const row6Title = "Fashion, Beauty & Personal Care Deals";

// Mock Data for Row 7 (Grid)
const row7GridGroups = [
  {
    title: "Automotive",
    items: [
      { title: "Car Care", offer: "Min. 20% Off", image: "https://images.unsplash.com/photo-1600273759367-1606d20367eb?auto=format&fit=crop&w=300&q=80" },
      { title: "Tools", offer: "Best Sellers", image: "https://images.unsplash.com/photo-1517524285303-d6fc683dddf8?auto=format&fit=crop&w=300&q=80" },
      { title: "Electronics", offer: "GPS & Audio", image: "https://images.unsplash.com/photo-1542456008-01d7842bd955?auto=format&fit=crop&w=300&q=80" },
      { title: "Accessories", offer: "Up to 30% Off", image: "https://images.unsplash.com/photo-1588631388394-d99f2b8417c8?auto=format&fit=crop&w=300&q=80" },
    ]
  },
  {
    title: "Tools & Hardware",
    items: [
      { title: "Power Tools", offer: "Top Brands", image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=300&q=80" },
      { title: "Hand Tools", offer: "Min. 40% Off", image: "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?auto=format&fit=crop&w=300&q=80" },
      { title: "Hardware", offer: "DIY Essentials", image: "https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?auto=format&fit=crop&w=300&q=80" },
      { title: "Safety", offer: "Gear & More", image: "https://images.unsplash.com/photo-1582650085445-3db523d44331?auto=format&fit=crop&w=300&q=80" },
    ]
  },
  {
    title: "Office Supplies",
    items: [
      { title: "Furniture", offer: "Work from Home", image: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=300&q=80" },
      { title: "Stationery", offer: "Back to School", image: "https://images.unsplash.com/photo-1456735190827-d1262f71b8a3?auto=format&fit=crop&w=300&q=80" },
      { title: "Organizers", offer: "Min. 25% Off", image: "https://images.unsplash.com/photo-1510444369796-0da1a011211e?auto=format&fit=crop&w=300&q=80" },
      { title: "Tech", offer: "Office Gear", image: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=300&q=80" },
    ]
  },
];

// Row 8 Carousel: Groceries & Sports (Combined Categories)
// Title: "Groceries & Sports Essentials"
// TODO: Fetch products from categories: "Groceries" + "Sports"
const row8Products = [
  { id: "301", title: "Coffee Beans", price: "$15", image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=300&q=80", description: "Arabica" },
  { id: "302", title: "Tea Set", price: "$49", image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=300&q=80", description: "Ceramic" },
  { id: "303", title: "Spices", price: "$25", image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=300&q=80", description: "Assorted" },
  { id: "304", title: "Olive Oil", price: "$20", image: "https://images.unsplash.com/photo-1474979266404-7cbf9c732a56?auto=format&fit=crop&w=300&q=80", description: "Extra Virgin" },
  { id: "305", title: "Honey", price: "$12", image: "https://images.unsplash.com/photo-1587049352851-8d4e89186eff?auto=format&fit=crop&w=300&q=80", description: "Organic" },
  { id: "306", title: "Chocolate", price: "$8", image: "https://images.unsplash.com/photo-1511381978829-04286b368db6?auto=format&fit=crop&w=300&q=80", description: "Dark" },
  { id: "307", title: "Cereal", price: "$6", image: "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?auto=format&fit=crop&w=300&q=80", description: "Healthy" },
  { id: "308", title: "Juice", price: "$5", image: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&w=300&q=80", description: "Fresh" },
  { id: "309", title: "Pasta", price: "$4", image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&w=300&q=80", description: "Italian" },
  { id: "310", title: "Rice", price: "$10", image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=300&q=80", description: "Basmati" },
  { id: "311", title: "Sauces", price: "$7", image: "https://images.unsplash.com/photo-1472476443507-c7a392dd6182?auto=format&fit=crop&w=300&q=80", description: "Assorted" },
  { id: "312", title: "Snacks", price: "$9", image: "https://images.unsplash.com/photo-1621939514649-28b12e81d196?auto=format&fit=crop&w=300&q=80", description: "Mix" },
];
const row8Title = "Groceries & Sports Essentials";


const Index = () => {
  return (
    <div className="min-h-screen bg-[#F1F3F6] font-roboto">
      <Navbar />
      <HeroBanner />
       <TopDeals />
      
      {/* Row 1: Grid */}
      <HomeCategoryGrid groups={row1GridGroups} />
      
      {/* Row 2: Carousel - Home Interior & Electrical */}
      <HomeProductCarousel title={row2Title} products={row2Products} />
      
      {/* Row 3: Grid */}
      <HomeCategoryGrid groups={row3GridGroups} />

      {/* Row 4: Carousel - Devices & Automotive */}
      <HomeProductCarousel title={row4Title} products={row4Products} />

      {/* Row 5: Grid */}
      <HomeCategoryGrid groups={row5GridGroups} />

      {/* Row 6: Carousel - Fashion, Beauty & Personal Care */}
      <HomeProductCarousel title={row6Title} products={row6Products} />

      {/* Row 7: Grid */}
      <HomeCategoryGrid groups={row7GridGroups} />

      {/* Row 8: Carousel - Groceries & Sports */}
      <HomeProductCarousel title={row8Title} products={row8Products} />

     

      <WhyChooseUs />
      <Footer />
    </div>
  );
};

export default Index;
