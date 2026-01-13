import Navbar from "@/components/Navbar";
import HeroBanner from "@/components/HeroBanner";
import TopDeals from "@/components/TopDeals";

import WhyChooseUs from "@/components/WhyChooseUs";
import Footer from "@/components/Footer";
import HomeCategoryGrid from "@/components/HomeCategoryGrid";
import HomeProductCarousel from "@/components/HomeProductCarousel";
import { useState, useEffect } from "react";
import { apiService } from "@/lib/api";

// Mock Data for Row 1 (Grid) - Using Valid Database Categories/Subcategories
const row1GridGroups = [
  {
    title: "Big Savings & Daily Essentials",
    items: [
      { title: "Rice & Rice Products", offer: "Travel Essentials", image: "https://res.cloudinary.com/dv4dqyiqk/image/upload/v1766903338/nevyra/daily-essentials/WhatsApp%20Image%202025-12-26%20at%207.10.15%20PM.jpg", category: "Groceries", subcategory: "Rice & Rice Products,Pulses & Dals" },
      { title: "Fruits", offer: "Timeless Style", image: "https://res.cloudinary.com/dv4dqyiqk/image/upload/v1766903334/nevyra/daily-essentials/WhatsApp%20Image%202025-12-26%20at%207.10.15%20PM%20%281%29.jpg", category: "Groceries", subcategory: "Fruits,Vegatables" },
      { title: "Milk", offer: "Step in Style", image: "https://res.cloudinary.com/dv4dqyiqk/image/upload/v1766903335/nevyra/daily-essentials/WhatsApp%20Image%202025-12-26%20at%207.10.15%20PM%20%282%29.jpg", category: "Groceries", subcategory: "Milk,Eggs" },
      { title: "Instant Snacks", offer: "Elegant Footwear", image: "https://res.cloudinary.com/dv4dqyiqk/image/upload/v1766903337/nevyra/daily-essentials/WhatsApp%20Image%202025-12-26%20at%207.10.15%20PM%20%283%29.jpg", category: "Groceries", subcategory: "snacks & namkeen , Health Drinks" },
    ]
  },
  {
    title: "Trending Fashion Deals",
    items: [
      { title: "Men's Wear", offer: "Latest Tech", image: "https://res.cloudinary.com/dv4dqyiqk/image/upload/v1766903395/nevyra/fashion-deals/WhatsApp%20Image%202025-12-26%20at%207.12.57%20PM.jpg", category: "Fashion & Beauty", subcategory: "Men's Wear" },
      { title: "Women's Wear", offer: "Power & Performance", image: "https://res.cloudinary.com/dv4dqyiqk/image/upload/v1766903393/nevyra/fashion-deals/WhatsApp%20Image%202025-12-26%20at%207.12.57%20PM%20%281%29.jpg", category: "Fashion & Beauty", subcategory: "Women's Wear" },
      { title: "Baby Care & Kids", offer: "Tech Meets Style", image: "https://res.cloudinary.com/dv4dqyiqk/image/upload/v1766903394/nevyra/fashion-deals/WhatsApp%20Image%202025-12-26%20at%207.12.57%20PM%20%282%29.jpg", category: "Fashion & Beauty", subcategory: "Baby Care & Kids" },
      { title: "Small Accessories", offer: "Home Entertainment", image: "https://res.cloudinary.com/dv4dqyiqk/image/upload/v1766903397/nevyra/fashion-deals/WhatsApp%20Image%202025-12-26%20at%207.12.58%20PM.jpg", category: "Fashion & Beauty", subcategory: "Small Accessories" },
    ]
  },
  {
    title: "Health Essentials Deals",
    items: [
      { title: "General food items", offer: "Pantry Staples", image: "https://res.cloudinary.com/dv4dqyiqk/image/upload/v1766903340/nevyra/health-essentials/WhatsApp%20Image%202025-12-26%20at%207.19.42%20PM.jpg", category: "Medical & Pharmacy", subcategory: "Tablets" },
      { title: "Daily essentials", offer: "Everyday Needs", image: "https://res.cloudinary.com/dv4dqyiqk/image/upload/v1766903344/nevyra/health-essentials/WhatsApp%20Image%202025-12-26%20at%207.19.43%20PM.jpg", category: "Medical & Pharmacy", subcategory: "skincare" },
      { title: "Fresh Produce", offer: "Farm Fresh", image: "https://res.cloudinary.com/dv4dqyiqk/image/upload/v1766903341/nevyra/health-essentials/WhatsApp%20Image%202025-12-26%20at%207.19.43%20PM%20%281%29.jpg", category: "Medical & Pharmacy", subcategory: "Medical & Pharmacy" },
      { title: "Snacks", offer: "Tasty Treats", image: "https://res.cloudinary.com/dv4dqyiqk/image/upload/v1766903342/nevyra/health-essentials/WhatsApp%20Image%202025-12-26%20at%207.19.43%20PM%20%282%29.jpg", category: "Medical & Pharmacy", subcategory: "Medical & Pharmacy" },
    ]
  },

];

const row2Title = "Home Interior & Electrical Deals";
const row2Categories = "Home Interior & Decor,Electrical & Electronics";

// Mock Data for Row 3 (Grid) - Using Valid Database Categories/Subcategories
const row3GridGroups = [
  {
    title: " Smart Deals",
    items: [
      { title: "Mobile Phones", offer: "Upgrade Your Ride", image: "https://res.cloudinary.com/dv4dqyiqk/image/upload/v1766903377/nevyra/smart-deals/WhatsApp%20Image%202025-12-26%20at%207.32.51%20PM.jpg", category: "Devices", subcategory: "Mobile Phones,Tablets" },
      { title: "Laptops", offer: "Ride in Style", image: "https://res.cloudinary.com/dv4dqyiqk/image/upload/v1766903375/nevyra/smart-deals/WhatsApp%20Image%202025-12-26%20at%207.32.51%20PM%20%281%29.jpg", category: "Devices", subcategory: "Laptops,Desktops" },
      { title: "Bluetooth Speakers", offer: "Smooth Performance", image: "https://res.cloudinary.com/dv4dqyiqk/image/upload/v1766903380/nevyra/smart-deals/WhatsApp%20Image%202025-12-26%20at%207.32.52%20PM.jpg", category: "Devices", subcategory: "Bluetooth Speakers,soundbars" },
      { title: "Chargers & Cables", offer: "Safety First", image: "https://res.cloudinary.com/dv4dqyiqk/image/upload/v1766903378/nevyra/smart-deals/WhatsApp%20Image%202025-12-26%20at%207.32.52%20PM%20%281%29.jpg", category: "Devices", subcategory: "Cell Phones & Accessories" },
    ]
  },
  {
    title: "Sports Deals",
    items: [
      { title: "Sports Shoes", offer: "Play Your Game", image: "https://res.cloudinary.com/dv4dqyiqk/image/upload/v1766903385/nevyra/sports-deals/WhatsApp%20Image%202025-12-26%20at%207.43.37%20PM.jpg", category: "Sports", subcategory: "Sports Shoes,Cricket Bats" },
      { title: "Cricket", offer: "Match Quality", image: "https://res.cloudinary.com/dv4dqyiqk/image/upload/v1766903381/nevyra/sports-deals/WhatsApp%20Image%202025-12-26%20at%207.43.37%20PM%20%281%29.jpg", category: "Sports", subcategory: "Cricket,Cricket Balls" },
      { title: "Football", offer: "Complete Set", image: "https://res.cloudinary.com/dv4dqyiqk/image/upload/v1766903383/nevyra/sports-deals/WhatsApp%20Image%202025-12-26%20at%207.43.37%20PM%20%282%29.jpg", category: "Sports", subcategory: "Football,Cricket Kit" },
      { title: "Fitness & Gym", offer: "Team Sports", image: "https://res.cloudinary.com/dv4dqyiqk/image/upload/v1766903384/nevyra/sports-deals/WhatsApp%20Image%202025-12-26%20at%207.43.37%20PM%20%283%29.jpg", category: "Sports", subcategory: "Fitness & Gym,Volleyball" },
    ]
  },
  {
    title: "Security & Lighting Deals",
    items: [
      { title: "Cameras & Accessories", offer: "Energy Efficient", image: "https://res.cloudinary.com/dv4dqyiqk/image/upload/v1766903374/nevyra/security-lighting/WhatsApp%20Image%202025-12-26%20at%207.58.06%20PM.jpg", category: "Electrical & Electronics", subcategory: "Cameras & Accessories,LED Bulbs" },
      { title: "Smart Door Locks", offer: "Cool Comfort", image: "https://res.cloudinary.com/dv4dqyiqk/image/upload/v1766903369/nevyra/security-lighting/WhatsApp%20Image%202025-12-26%20at%207.58.06%20PM%20%281%29.jpg", category: "Electrical & Electronics", subcategory: "Smart Door Locks,Ceiling Fan" },
      { title: "Lighting", offer: "Power Up", image: "https://res.cloudinary.com/dv4dqyiqk/image/upload/v1766903371/nevyra/security-lighting/WhatsApp%20Image%202025-12-26%20at%207.58.06%20PM%20%282%29.jpg", category: "Electrical & Electronics", subcategory: "Lighting,Batteries" },
      { title: "CFL Bulbs", offer: "Safe Connections", image: "https://res.cloudinary.com/dv4dqyiqk/image/upload/v1767979028/WhatsApp_Image_2026-01-08_at_9.24.36_PM_wospgh.jpg", category: "Electrical & Electronics", subcategory: "CFL Bulbs,Wiring Cables" },
    ]
  },

];

const row4Title = "Devices & Automotive Deals";
const row4Categories = "Devices,Automotive & Automobile";

// Mock Data for Row 5 (Grid) - Using Valid Database Categories/Subcategories
const row5GridGroups = [
  {
    title: "Office & Books Deals",
    items: [
      { title: "Cabinets", offer: "Window Dressing", image: "https://res.cloudinary.com/dv4dqyiqk/image/upload/v1767979077/WhatsApp_Image_2026-01-08_at_9.23.46_PM_yivdem.jpg", category: "Home Interior & Decor", subcategory: "Cabinets,Curtains" },
      { title: "Printers & Scanners", offer: "Fresh Colors", image: "https://res.cloudinary.com/dv4dqyiqk/image/upload/v1766903363/nevyra/office-books/WhatsApp%20Image%202025-12-26%20at%208.27.46%20PM%20%281%29.jpg", category: "Home Interior & Decor", subcategory: "Printers & Scanners,Wall Paint" },
      { title: "Notebooks", offer: "Designer Walls", image: "https://res.cloudinary.com/dv4dqyiqk/image/upload/v1766903368/nevyra/office-books/WhatsApp%20Image%202025-12-26%20at%208.27.47%20PM.jpg", category: "Home Interior & Decor", subcategory: "Notebooks,Wallpaper" },
      { title: "Pens", offer: "Ambient Lighting", image: "https://res.cloudinary.com/dv4dqyiqk/image/upload/v1766903367/nevyra/office-books/WhatsApp%20Image%202025-12-26%20at%208.27.47%20PM%20%281%29.jpg", category: "Home Interior & Decor", subcategory: "Pens,Cove Lights" },
    ]
  },
  {
    title: "Home & Skincare Deals",
    items: [
      { title: "Furniture", offer: "Daily Essentials", image: "https://res.cloudinary.com/dv4dqyiqk/image/upload/v1766903345/nevyra/home-skincare/WhatsApp%20Image%202025-12-26%20at%208.59.33%20PM.jpg", category: "Home Interior & Decor", subcategory: "Furniture,Personal Care" },
      { title: "Home Appliances", offer: "Healthy Glow", image: "https://res.cloudinary.com/dv4dqyiqk/image/upload/v1766903350/nevyra/home-skincare/WhatsApp%20Image%202025-12-26%20at%208.59.34%20PM.jpg", category: "Home Interior & Decor", subcategory: "Home Appliances,Skin Care" },
      { title: "Makeup", offer: "Salon Quality", image: "https://res.cloudinary.com/dv4dqyiqk/image/upload/v1766903347/nevyra/home-skincare/WhatsApp%20Image%202025-12-26%20at%208.59.34%20PM%20%281%29.jpg", category: "Medical & Pharmacy", subcategory: "Makeup,Hair Care" },
      { title: "Skincare", offer: "Glamorous Look", image: "https://res.cloudinary.com/dv4dqyiqk/image/upload/v1766903348/nevyra/home-skincare/WhatsApp%20Image%202025-12-26%20at%208.59.34%20PM%20%282%29.jpg", category: "Medical & Pharmacy", subcategory: "Skincare,Makeup" },
    ]
  },
  {
    title: "Music Instruments and Watches Deals",
    items: [
      { title: "Televisions & Audio", offer: "Stylish Collection", image: "https://res.cloudinary.com/dv4dqyiqk/image/upload/v1766903362/nevyra/music-watches/WhatsApp%20Image%202025-12-26%20at%209.30.49%20PM.jpg", category: "Devices", subcategory: "Televisions & Audio,Menswear" },
      { title: "Televisions & Audio", offer: "Trendy Outfits", image: "https://res.cloudinary.com/dv4dqyiqk/image/upload/v1766903357/nevyra/music-watches/WhatsApp%20Image%202025-12-26%20at%209.30.49%20PM%20%281%29.jpg", category: "Devices", subcategory: "Televisions & Audio,Women's Wear" },
      { title: "Men's watches", offer: "Cute & Comfy", image: "https://res.cloudinary.com/dv4dqyiqk/image/upload/v1766903359/nevyra/music-watches/WhatsApp%20Image%202025-12-26%20at%209.30.49%20PM%20%282%29.jpg", category: "Fashion & Beauty", subcategory: "watches," },
      { title: "Women's watches", offer: "Fun Footwear", image: "https://res.cloudinary.com/dv4dqyiqk/image/upload/v1766903360/nevyra/music-watches/WhatsApp%20Image%202025-12-26%20at%209.30.49%20PM%20%283%29.jpg", category: "Fashion & Beauty", subcategory: "watches," },
    ]
  },
];

const row6Title = "Fashion, Beauty & Personal Care Deals";
const row6Categories = "Fashion & Beauty,Medical & Pharmacy";

// Mock Data for Row 7 (Grid)
const row7GridGroups = [
  {
    title: "Best Automative Deals",
    items: [
      { title: "Car Accessories", offer: "Min. 20% Off", image: "https://res.cloudinary.com/dv4dqyiqk/image/upload/v1766903331/nevyra/automotive-deals/WhatsApp%20Image%202025-12-26%20at%2010.26.26%20PM.jpg", category: "Automotive & Automobile", subcategory: "Car Accessories" },
      { title: "ToolsBike Accessories", offer: "Best Sellers", image: "https://res.cloudinary.com/dv4dqyiqk/image/upload/v1766903328/nevyra/automotive-deals/WhatsApp%20Image%202025-12-26%20at%2010.26.26%20PM%20%281%29.jpg", category: "Automotive & Automobile", subcategory: "Bike Accessories" },
      { title: "Care & Cleaning", offer: "GPS & Audio", image: "https://res.cloudinary.com/dv4dqyiqk/image/upload/v1766903329/nevyra/automotive-deals/WhatsApp%20Image%202025-12-26%20at%2010.26.26%20PM%20%282%29.jpg", category: "Automotive & Automobile", subcategory: "Care & Cleaning,GPS & Audio" },
      { title: "Tools & Safety", offer: "Up to 30% Off", image: "https://res.cloudinary.com/dv4dqyiqk/image/upload/v1766903332/nevyra/automotive-deals/WhatsApp%20Image%202025-12-26%20at%2010.26.27%20PM.jpg", category: "Automotive & Automobile", subcategory: "Tools & Safety" },
    ]
  },
  {
    title: "Kids & Toys Deals",
    items: [
      { title: "Baby Clothes & Blankets", offer: "Top Brands", image: "https://res.cloudinary.com/dv4dqyiqk/image/upload/v1766903351/nevyra/kids-toys/WhatsApp%20Image%202025-12-26%20at%2010.44.27%20PM.jpg", category: "Sports", subcategory: "Baby Clothes & Blankets" },
      { title: "School Bags", offer: "Min. 40% Off", image: "https://res.cloudinary.com/dv4dqyiqk/image/upload/v1766903356/nevyra/kids-toys/WhatsApp%20Image%202025-12-26%20at%2010.44.28%20PM.jpg", category: "Sports", subcategory: "School Bags" },
      { title: "Building Blocks & LEGO-type Toys", offer: "DIY Essentials", image: "https://res.cloudinary.com/dv4dqyiqk/image/upload/v1766903353/nevyra/kids-toys/WhatsApp%20Image%202025-12-26%20at%2010.44.28%20PM%20%281%29.jpg", category: "Sports", subcategory: "Building Blocks & LEGO-type Toys" },
      { title: "Outdoor Toys", offer: "Gear & More", image: "https://res.cloudinary.com/dv4dqyiqk/image/upload/v1766903354/nevyra/kids-toys/WhatsApp%20Image%202025-12-26%20at%2010.44.28%20PM%20%282%29.jpg", category: "Sports", subcategory: "Outdoor Toys" },
    ]
  },
  {
    title: "Tool & Energy Deals",
    items: [
      { title: "Power & Backup", offer: "Work from Home", image: "https://res.cloudinary.com/dv4dqyiqk/image/upload/v1766903387/nevyra/tools-energy/WhatsApp%20Image%202025-12-26%20at%2011.03.20%20PM.jpg", category: "Electrical & Electronics", subcategory: "Power & Backup" },
      { title: "Power & Backup", offer: "Back to School", image: "https://res.cloudinary.com/dv4dqyiqk/image/upload/v1766903391/nevyra/tools-energy/WhatsApp%20Image%202025-12-26%20at%2011.03.21%20PM.jpg", category: "Electrical & Electronics", subcategory: "Power & Backup" },
      { title: "Solar Inverters", offer: "Min. 25% Off", image: "https://res.cloudinary.com/dv4dqyiqk/image/upload/v1766903388/nevyra/tools-energy/WhatsApp%20Image%202025-12-26%20at%2011.03.21%20PM%20%281%29.jpg", category: "Electrical & Electronics", subcategory: "Solar Inverters" },
      { title: "Power & Backup", offer: "Office Gear", image: "https://res.cloudinary.com/dv4dqyiqk/image/upload/v1766903390/nevyra/tools-energy/WhatsApp%20Image%202025-12-26%20at%2011.03.21%20PM%20%282%29.jpg", category: "Electrical & Electronics", subcategory: "Power & Backup" },
    ]
  },
];

const row8Title = "Groceries & Sports Essentials";
const row8Categories = "Groceries,Sports";


const Index = () => {
  const [row2Products, setRow2Products] = useState<any[]>([]);
  const [row4Products, setRow4Products] = useState<any[]>([]);
  const [row6Products, setRow6Products] = useState<any[]>([]);
  const [row8Products, setRow8Products] = useState<any[]>([]);

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const [res2, res4, res6, res8] = await Promise.all([
          apiService.getProducts({ category: row2Categories, limit: 12 }),
          apiService.getProducts({ category: row4Categories, limit: 12 }),
          apiService.getProducts({ category: row6Categories, limit: 12 }),
          apiService.getProducts({ category: row8Categories, limit: 12 }),
        ]);

        if (res2.success) setRow2Products(res2.data.map(p => ({
          id: p.id,
          title: p.title,
          price: `₹${p.price}`,
          image: p.images[0] || "https://via.placeholder.com/300"
        })));
        if (res4.success) setRow4Products(res4.data.map(p => ({
          id: p.id,
          title: p.title,
          price: `₹${p.price}`,
          image: p.images[0] || "https://via.placeholder.com/300"
        })));
        if (res6.success) setRow6Products(res6.data.map(p => ({
          id: p.id,
          title: p.title,
          price: `₹${p.price}`,
          image: p.images[0] || "https://via.placeholder.com/300"
        })));
        if (res8.success) setRow8Products(res8.data.map(p => ({
          id: p.id,
          title: p.title,
          price: `₹${p.price}`,
          image: p.images[0] || "https://via.placeholder.com/300"
        })));
      } catch (error) {
        console.error("Error fetching home products:", error);
      }
    };

    fetchAllProducts();
  }, []);

  return (
    <div className="min-h-screen bg-[#F1F3F6] font-roboto">
      <Navbar />
      <HeroBanner />
      <TopDeals />

      {/* Row 1: Grid */}
      <HomeCategoryGrid groups={row1GridGroups} />

      {/* Row 2: Carousel - Home Interior & Electrical */}
      {row2Products.length > 0 && <HomeProductCarousel title={row2Title} products={row2Products} />}

      {/* Row 3: Grid */}
      <HomeCategoryGrid groups={row3GridGroups} />

      {/* Row 4: Carousel - Devices & Automotive */}
      {row4Products.length > 0 && <HomeProductCarousel title={row4Title} products={row4Products} />}

      {/* Row 5: Grid */}
      <HomeCategoryGrid groups={row5GridGroups} />

      {/* Row 6: Carousel - Fashion, Beauty & Personal Care */}
      {row6Products.length > 0 && <HomeProductCarousel title={row6Title} products={row6Products} />}

      {/* Row 7: Grid */}
      <HomeCategoryGrid groups={row7GridGroups} />

      {/* Row 8: Carousel - Groceries & Sports */}
      {row8Products.length > 0 && <HomeProductCarousel title={row8Title} products={row8Products} />}

      <WhyChooseUs />
      <Footer />
    </div>
  );
};

export default Index;
