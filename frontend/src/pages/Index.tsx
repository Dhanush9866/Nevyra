
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
    title: "Big Savings & Daily Essentials",
    items: [
      { title: "Rice & Rice Products", offer: "Travel Essentials", image: "https://res.cloudinary.com/dv4dqyiqk/image/upload/v1766903338/nevyra/daily-essentials/WhatsApp%20Image%202025-12-26%20at%207.10.15%20PM.jpg", category: "Fashion & Beauty", subcategory: "Luggage" },
      { title: "Fruits", offer: "Timeless Style", image: "https://res.cloudinary.com/dv4dqyiqk/image/upload/v1766903334/nevyra/daily-essentials/WhatsApp%20Image%202025-12-26%20at%207.10.15%20PM%20%281%29.jpg", category: "Fashion & Beauty", subcategory: "Watches" },
      { title: "Milk", offer: "Step in Style", image: "https://res.cloudinary.com/dv4dqyiqk/image/upload/v1766903335/nevyra/daily-essentials/WhatsApp%20Image%202025-12-26%20at%207.10.15%20PM%20%282%29.jpg", category: "Fashion & Beauty", subcategory: "Men's Shoes" },
      { title: "Instant Snacks", offer: "Elegant Footwear", image: "https://res.cloudinary.com/dv4dqyiqk/image/upload/v1766903337/nevyra/daily-essentials/WhatsApp%20Image%202025-12-26%20at%207.10.15%20PM%20%283%29.jpg", category: "Fashion & Beauty", subcategory: "Women's Shoes" },
    ]
  },
  {
    title: "Trending Fashion Deals",
    items: [
      { title: "Men's Wear", offer: "Latest Tech", image: "https://res.cloudinary.com/dv4dqyiqk/image/upload/v1766903395/nevyra/fashion-deals/WhatsApp%20Image%202025-12-26%20at%207.12.57%20PM.jpg", category: "Devices", subcategory: "Cell Phones & Accessories" },
      { title: "Women's Wear", offer: "Power & Performance", image: "https://res.cloudinary.com/dv4dqyiqk/image/upload/v1766903393/nevyra/fashion-deals/WhatsApp%20Image%202025-12-26%20at%207.12.57%20PM%20%281%29.jpg", category: "Devices", subcategory: "Laptops" },
      { title: "Baby Care & Kids", offer: "Tech Meets Style", image: "https://res.cloudinary.com/dv4dqyiqk/image/upload/v1766903394/nevyra/fashion-deals/WhatsApp%20Image%202025-12-26%20at%207.12.57%20PM%20%282%29.jpg", category: "Devices", subcategory: "Smart Watches" },
      { title: "Small Accessories", offer: "Home Entertainment", image: "https://res.cloudinary.com/dv4dqyiqk/image/upload/v1766903397/nevyra/fashion-deals/WhatsApp%20Image%202025-12-26%20at%207.12.58%20PM.jpg", category: "Devices", subcategory: "Televisions" },
    ]
  },
  {
    title: "Health Essentials Deals",
    items: [
      { title: "General food items", offer: "Pantry Staples", image: "https://res.cloudinary.com/dv4dqyiqk/image/upload/v1766903340/nevyra/health-essentials/WhatsApp%20Image%202025-12-26%20at%207.19.42%20PM.jpg", category: "Groceries", subcategory: "General food items" },
      { title: "Daily essentials", offer: "Everyday Needs", image: "https://res.cloudinary.com/dv4dqyiqk/image/upload/v1766903344/nevyra/health-essentials/WhatsApp%20Image%202025-12-26%20at%207.19.43%20PM.jpg", category: "Groceries", subcategory: "Daily essentials" },
      { title: "Fresh Produce", offer: "Farm Fresh", image: "https://res.cloudinary.com/dv4dqyiqk/image/upload/v1766903341/nevyra/health-essentials/WhatsApp%20Image%202025-12-26%20at%207.19.43%20PM%20%281%29.jpg", category: "Groceries", subcategory: "General food items" },
      { title: "Snacks", offer: "Tasty Treats", image: "https://res.cloudinary.com/dv4dqyiqk/image/upload/v1766903342/nevyra/health-essentials/WhatsApp%20Image%202025-12-26%20at%207.19.43%20PM%20%282%29.jpg", category: "Groceries", subcategory: "General food items" },
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
    title: " Smart Deals",
    items: [
      { title: "Mobile Phones", offer: "Upgrade Your Ride", image: "https://res.cloudinary.com/dv4dqyiqk/image/upload/v1766903377/nevyra/smart-deals/WhatsApp%20Image%202025-12-26%20at%207.32.51%20PM.jpg", category: "Automotive", subcategory: "Car Accessories" },
      { title: "Laptops", offer: "Ride in Style", image: "https://res.cloudinary.com/dv4dqyiqk/image/upload/v1766903375/nevyra/smart-deals/WhatsApp%20Image%202025-12-26%20at%207.32.51%20PM%20%281%29.jpg", category: "Automotive", subcategory: "Bike Accessories" },
      { title: "Bluetooth Speakers", offer: "Smooth Performance", image: "https://res.cloudinary.com/dv4dqyiqk/image/upload/v1766903380/nevyra/smart-deals/WhatsApp%20Image%202025-12-26%20at%207.32.52%20PM.jpg", category: "Automotive", subcategory: "Engine Oil" },
      { title: "Chargers & Cables", offer: "Safety First", image: "https://res.cloudinary.com/dv4dqyiqk/image/upload/v1766903378/nevyra/smart-deals/WhatsApp%20Image%202025-12-26%20at%207.32.52%20PM%20%281%29.jpg", category: "Automotive", subcategory: "Brake Fluid" },
    ]
  },
  {
    title: "Sports Deals",
    items: [
      { title: "Sports Shoes", offer: "Play Your Game", image: "https://res.cloudinary.com/dv4dqyiqk/image/upload/v1766903385/nevyra/sports-deals/WhatsApp%20Image%202025-12-26%20at%207.43.37%20PM.jpg", category: "Sports", subcategory: "Cricket Bats" },
      { title: "Cricket", offer: "Match Quality", image: "https://res.cloudinary.com/dv4dqyiqk/image/upload/v1766903381/nevyra/sports-deals/WhatsApp%20Image%202025-12-26%20at%207.43.37%20PM%20%281%29.jpg", category: "Sports", subcategory: "Cricket Balls" },
      { title: "Football", offer: "Complete Set", image: "https://res.cloudinary.com/dv4dqyiqk/image/upload/v1766903383/nevyra/sports-deals/WhatsApp%20Image%202025-12-26%20at%207.43.37%20PM%20%282%29.jpg", category: "Sports", subcategory: "Cricket Kit" },
      { title: "Fitness & Gym", offer: "Team Sports", image: "https://res.cloudinary.com/dv4dqyiqk/image/upload/v1766903384/nevyra/sports-deals/WhatsApp%20Image%202025-12-26%20at%207.43.37%20PM%20%283%29.jpg", category: "Sports", subcategory: "Volleyball" },
    ]
  },
  {
    title: "Security & Lighting Deals",
    items: [
      { title: "Cameras & Accessories", offer: "Energy Efficient", image: "https://res.cloudinary.com/dv4dqyiqk/image/upload/v1766903374/nevyra/security-lighting/WhatsApp%20Image%202025-12-26%20at%207.58.06%20PM.jpg", category: "Electrical", subcategory: "LED Bulbs" },
      { title: "Smart Door Locks", offer: "Cool Comfort", image: "https://res.cloudinary.com/dv4dqyiqk/image/upload/v1766903369/nevyra/security-lighting/WhatsApp%20Image%202025-12-26%20at%207.58.06%20PM%20%281%29.jpg", category: "Electrical", subcategory: "Ceiling Fan" },
      { title: "Lighting", offer: "Power Up", image: "https://res.cloudinary.com/dv4dqyiqk/image/upload/v1766903371/nevyra/security-lighting/WhatsApp%20Image%202025-12-26%20at%207.58.06%20PM%20%282%29.jpg", category: "Electrical", subcategory: "Batteries" },
      { title: "CFL Bulbs", offer: "Safe Connections", image: "https://res.cloudinary.com/dv4dqyiqk/image/upload/v1766903372/nevyra/security-lighting/WhatsApp%20Image%202025-12-26%20at%207.58.06%20PM%20%283%29.jpg", category: "Electrical", subcategory: "Wiring Cables" },
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
    title: "Office & Books Deals",
    items: [
      { title: "Cabinets", offer: "Window Dressing", image: "https://res.cloudinary.com/dv4dqyiqk/image/upload/v1766903365/nevyra/office-books/WhatsApp%20Image%202025-12-26%20at%208.27.46%20PM.jpg", category: "Home Interior", subcategory: "Curtains" },
      { title: "Printers & Scanners", offer: "Fresh Colors", image: "https://res.cloudinary.com/dv4dqyiqk/image/upload/v1766903363/nevyra/office-books/WhatsApp%20Image%202025-12-26%20at%208.27.46%20PM%20%281%29.jpg", category: "Home Interior", subcategory: "Wall Paint" },
      { title: "Notebooks", offer: "Designer Walls", image: "https://res.cloudinary.com/dv4dqyiqk/image/upload/v1766903368/nevyra/office-books/WhatsApp%20Image%202025-12-26%20at%208.27.47%20PM.jpg", category: "Home Interior", subcategory: "Wallpaper" },
      { title: "Pens", offer: "Ambient Lighting", image: "https://res.cloudinary.com/dv4dqyiqk/image/upload/v1766903367/nevyra/office-books/WhatsApp%20Image%202025-12-26%20at%208.27.47%20PM%20%281%29.jpg", category: "Home Interior", subcategory: "Cove Lights" },
    ]
  },
  {
    title: "Home & Skincare Deals",
    items: [
      { title: "Furniture", offer: "Daily Essentials", image: "https://res.cloudinary.com/dv4dqyiqk/image/upload/v1766903345/nevyra/home-skincare/WhatsApp%20Image%202025-12-26%20at%208.59.33%20PM.jpg", category: "Medical & Pharmacy", subcategory: "Personal Care" },
      { title: "Home Appliances", offer: "Healthy Glow", image: "https://res.cloudinary.com/dv4dqyiqk/image/upload/v1766903350/nevyra/home-skincare/WhatsApp%20Image%202025-12-26%20at%208.59.34%20PM.jpg", category: "Medical & Pharmacy", subcategory: "Skin Care" },
      { title: "Makeup", offer: "Salon Quality", image: "https://res.cloudinary.com/dv4dqyiqk/image/upload/v1766903347/nevyra/home-skincare/WhatsApp%20Image%202025-12-26%20at%208.59.34%20PM%20%281%29.jpg", category: "Medical & Pharmacy", subcategory: "Hair Care" },
      { title: "Skincare", offer: "Glamorous Look", image: "https://res.cloudinary.com/dv4dqyiqk/image/upload/v1766903348/nevyra/home-skincare/WhatsApp%20Image%202025-12-26%20at%208.59.34%20PM%20%282%29.jpg", category: "Medical & Pharmacy", subcategory: "Makeup" },
    ]
  },
  {
    title: "Music Instruments and Watches Deals",
    items: [
      { title: "Televisions & Audio", offer: "Stylish Collection", image: "https://res.cloudinary.com/dv4dqyiqk/image/upload/v1766903362/nevyra/music-watches/WhatsApp%20Image%202025-12-26%20at%209.30.49%20PM.jpg", category: "Fashion & Beauty", subcategory: "Menswear" },
      { title: "Televisions & Audio", offer: "Trendy Outfits", image: "https://res.cloudinary.com/dv4dqyiqk/image/upload/v1766903357/nevyra/music-watches/WhatsApp%20Image%202025-12-26%20at%209.30.49%20PM%20%281%29.jpg", category: "Fashion & Beauty", subcategory: "Women's Wear" },
      { title: "Men's watches", offer: "Cute & Comfy", image: "https://res.cloudinary.com/dv4dqyiqk/image/upload/v1766903359/nevyra/music-watches/WhatsApp%20Image%202025-12-26%20at%209.30.49%20PM%20%282%29.jpg", category: "Fashion & Beauty", subcategory: "Kids Wear" },
      { title: "Women's watches", offer: "Fun Footwear", image: "https://res.cloudinary.com/dv4dqyiqk/image/upload/v1766903360/nevyra/music-watches/WhatsApp%20Image%202025-12-26%20at%209.30.49%20PM%20%283%29.jpg", category: "Fashion & Beauty", subcategory: "Kids Shoes" },
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
    title: "Best Automative Deals",
    items: [
      { title: "Car Accessories", offer: "Min. 20% Off", image: "https://res.cloudinary.com/dv4dqyiqk/image/upload/v1766903331/nevyra/automotive-deals/WhatsApp%20Image%202025-12-26%20at%2010.26.26%20PM.jpg" },
      { title: "ToolsBike Accessories", offer: "Best Sellers", image: "https://res.cloudinary.com/dv4dqyiqk/image/upload/v1766903328/nevyra/automotive-deals/WhatsApp%20Image%202025-12-26%20at%2010.26.26%20PM%20%281%29.jpg" },
      { title: "Care & Cleaning", offer: "GPS & Audio", image: "https://res.cloudinary.com/dv4dqyiqk/image/upload/v1766903329/nevyra/automotive-deals/WhatsApp%20Image%202025-12-26%20at%2010.26.26%20PM%20%282%29.jpg" },
      { title: "Tools & Safety", offer: "Up to 30% Off", image: "https://res.cloudinary.com/dv4dqyiqk/image/upload/v1766903332/nevyra/automotive-deals/WhatsApp%20Image%202025-12-26%20at%2010.26.27%20PM.jpg" },
    ]
  },
  {
    title: "Kids & Toys Deals",
    items: [
      { title: "Baby Clothes & Blankets", offer: "Top Brands", image: "https://res.cloudinary.com/dv4dqyiqk/image/upload/v1766903351/nevyra/kids-toys/WhatsApp%20Image%202025-12-26%20at%2010.44.27%20PM.jpg" },
      { title: "School Bags", offer: "Min. 40% Off", image: "https://res.cloudinary.com/dv4dqyiqk/image/upload/v1766903356/nevyra/kids-toys/WhatsApp%20Image%202025-12-26%20at%2010.44.28%20PM.jpg" },
      { title: "Building Blocks & LEGO-type Toys", offer: "DIY Essentials", image: "https://res.cloudinary.com/dv4dqyiqk/image/upload/v1766903353/nevyra/kids-toys/WhatsApp%20Image%202025-12-26%20at%2010.44.28%20PM%20%281%29.jpg" },
      { title: "Outdoor Toys", offer: "Gear & More", image: "https://res.cloudinary.com/dv4dqyiqk/image/upload/v1766903354/nevyra/kids-toys/WhatsApp%20Image%202025-12-26%20at%2010.44.28%20PM%20%282%29.jpg" },
    ]
  },
  {
    title: "Tool & Energy Deals",
    items: [
      { title: "Power & Backup", offer: "Work from Home", image: "https://res.cloudinary.com/dv4dqyiqk/image/upload/v1766903387/nevyra/tools-energy/WhatsApp%20Image%202025-12-26%20at%2011.03.20%20PM.jpg" },
      { title: "Power & Backup", offer: "Back to School", image: "https://res.cloudinary.com/dv4dqyiqk/image/upload/v1766903391/nevyra/tools-energy/WhatsApp%20Image%202025-12-26%20at%2011.03.21%20PM.jpg" },
      { title: "Solar Inverters", offer: "Min. 25% Off", image: "https://res.cloudinary.com/dv4dqyiqk/image/upload/v1766903388/nevyra/tools-energy/WhatsApp%20Image%202025-12-26%20at%2011.03.21%20PM%20%281%29.jpg" },
      { title: "Power & Backup", offer: "Office Gear", image: "https://res.cloudinary.com/dv4dqyiqk/image/upload/v1766903390/nevyra/tools-energy/WhatsApp%20Image%202025-12-26%20at%2011.03.21%20PM%20%282%29.jpg" },
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
