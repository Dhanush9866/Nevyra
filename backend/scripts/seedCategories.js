const mongoose = require("mongoose");
const Category = require("../models/Category");
require("dotenv").config();

const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://hosannaking2019:YWafeOL8X8dkaSYn@cluster0.rdtscmx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Default categories and subcategories - MUST MATCH FRONTEND NAVBAR.TSX EXACTLY
const defaultCategories = [
  {
    name: "Medical & Pharmacy",
    parentId: null,
    subcategories: [
      "Personal Care",
      "Skin Care",
      "Hair Care",
      "Makeup",
      "Foot, Hand & Nail Care",
      "Salon Equipment",
      "Shave & Hair Removal",
      "Fragrance"
    ]
  },
  {
    name: "Groceries",
    parentId: null,
    subcategories: [
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
      "Garbage Bags",
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
  },
  {
    name: "Fashion & Beauty",
    parentId: null,
    subcategories: [
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
      "Waistcoats",
      "Dresses",
      "Topwear",
      "Jumpsuits",
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
      "Saree Shapewear",
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
      "Michael Kors",
      "Handbags",
      "Shoulder Bags",
      "Sling Bags",
      "Tote Bags",
      "Clutches",
      "Hobo bags",
      "Backpacks",
      "Laptop Bags",
      "Office Bags",
      "Travel Bags",
      "Duffel Bags",
      "Wallets & Belts",
      "Pouches",
      "Coin purses",
      "Sunglasses",
      "Earrings",
      "Necklaces",
      "Rings",
      "Bangles & Bracelets",
      "Anklets",
      "Noise Pins",
      "Bridal Jewelry",
      "Men’s Jewelry",
      "Kids Jewelry",
      "Trolley Bags",
      "Suitcases",
      "Cabin Luggage",
      "Check-in Luggage",
      "Duffle Bags",
      "Travel Backpacks",
      "Weekender Bags",
      "Laptop Trolleys",
      "Office Travel Bags",
      "Garment Bags",
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
    name: "Devices",
    parentId: null,
    subcategories: [
      "Mobile Phones",
      "Mobile Covers & Cases",
      "Chargers & Cables",
      "Power Banks",
      "Screen Protectors",
      "Earphones & Headphones",
      "Bluetooth Speakers",
      "Laptops",
      "Desktops",
      "Tablets",
      "Keyboards & Mouse",
      "Monitors",
      "Printers & Scanners",
      "Smart TVs",
      "Streaming Devices",
      "Soundbars",
      "Home Theaters",
      "Projectors",
      "Refrigerators",
      "Washing Machines",
      "Air conditioners",
      "Microwave Ovens",
      "Dishwashers",
      "Water Purifiers",
      "Smart Watches",
      "Fitness Bands",
      "VR Headsets",
      "Smart Glasses",
      "Digital Cameras",
      "DSLR Cameras",
      "Action Cameras",
      "Camera Lenses",
      "Tripods",
      "Memory Cards",
      "Gaming Consoles",
      "Game Controllers",
      "Gaming Headsets",
      "Gaming Accessories",
      "Smart Lights",
      "Smart Plugs",
      "Smart Door Locks",
      "Security Cameras",
      "WiFi- Routers",
      "Smart Sensors"
    ]
  },
  {
    name: "Electrical & Electronics",
    parentId: null,
    subcategories: [
      "Inverters & UPS",
      "Batteries",
      "Transformers",
      "Stabilizers",
      "UPS Systems",
      "Solar Inverters",
      "Battery Accessories",
      "Wiring Cables & Wires",
      "Switches & Sockets",
      "MCBs, RCCBs & DB Boxes",
      "Extension Boards",
      "Plug Tops & Adaptors",
      "Control Switches",
      "Relays & Contractors",
      "Ceiling Lights",
      "CFL Bulbs",
      "Wall Lights",
      "Outdoor Lights",
      "Street Lights",
      "Emergency Lights",
      "Table Fans",
      "Pedestal Fans",
      "Exhaust Fans",
      "Ventilation Fans",
      "Water Heaters",
      "Room Heaters",
      "Irons",
      "Mixers & Grinders",
      "Electric Kettles",
      "Induction Cooktops",
      "Smart Switches",
      "Smart Plugs",
      "Smart Lights",
      "Smart Doorbells",
      "Home Automation Kits",
      "Electrical Tools",
      "Testing Devices",
      "Tool kits",
      "Safety Gloves & Gear",
      "Industrial panels",
      "Heavy Duty Cables"
    ]
  },
  {
    name: "Automotive & Automobile",
    parentId: null,
    subcategories: [
      "Helmets",
      "Bike covers",
      "Bike Lights",
      "Bike Batteries",
      "Bike Engine Oil",
      "Bike Brake Oil",
      "Bike Air Filters",
      "Bike Cleaning & Care",
      "Car Covers",
      "Car Seat Covers",
      "Car Mats",
      "Car Chargers & Holders",
      "Car Lights & Fog Lamps",
      "Engine Oil",
      "Brake Fluid",
      "Coolant",
      "Gear Oil",
      "Power Steering Oil",
      "Air Filters",
      "Oil Filters",
      "Fuel Filters",
      "Spark Plugs",
      "Brake Pads",
      "Clutch Parts",
      "Horns",
      "Wipers",
      "Fuse & Relays",
      "Car Wash & Shampoo",
      "Polish & Wax",
      "Interior Cleaners",
      "Tyre Cleaners",
      "Chain Lubes",
      "Car Tyres",
      "Bike Tyres",
      "Alloy Wheels",
      "Tyre Inflators",
      "Tool Kits",
      "Hydraulic Jacks",
      "First Aid Kits",
      "Warning Traingles"
    ]
  },
  {
    name: "Sports",
    parentId: null,
    subcategories: [
      "Batting Gloves",
      "Batting Pads",
      "Helmets",
      "Wicket Keeping Gloves",
      "Wicket Keeping Pads",
      "Knee pads",
      "Football",
      "Football Shoes",
      "Shin Guards",
      "Goal Posts",
      "Badminton Rackets",
      "Shuttlecocks",
      "Badminton Nets",
      "Grip Tapes",
      "Tennis Rackets",
      "Tennis Balls",
      "Tennis Nets",
      "Table Tennis Bats",
      "Table Tennis Balls",
      "TT Tables",
      "Basketball",
      "Basketball Ring",
      "Basketball Net",
      "Carrom Boards",
      "Chess Boards",
      "Dumbbells",
      "Barbells",
      "Weight Plates",
      "Resistance Bands",
      "Skipping Ropes",
      "Yoga Mats",
      "Exercise Balls",
      "Cycles",
      "Cycling Helmets",
      "Skates",
      "Skateboards",
      "Sports Shoes",
      "Sports Gloves",
      "Sports Bags",
      "Water Bottles"
    ]
  },
  {
    name: "Home Interior & Decor",
    parentId: null,
    subcategories: [
      "POP Ceiling",
      "LED Ceiling Lights",
      "Chandeliers",
      "Wall Lights",
      "Spot Lights",
      "Main Door",
      "Bedroom Doors",
      "PVC / UPVC Doors",
      "Door Frames",
      "Door Handles & Locks",
      "Windows & Grills",
      "Texture Paint",
      "Wallpaper",
      "Wall Panels (PVC / WPC)",
      "Wall Stickers & Decals",
      "Curtains",
      "Curtain Rods & Tracks",
      "Blinds (Roller / Venetian)",
      "Window Sheers",
      "Floor Tiles",
      "Wooden Flooring",
      "Marble & Granite",
      "Sofa Sets",
      "Beds",
      "Wardrobes",
      "TV Units",
      "Dining Tables",
      "Wall Art & Frames",
      "Mirrors",
      "Clocks",
      "Showpieces",
      "Indoor Plants & Pots",
      "Shelves & Racks",
      "Shoe Racks",
      "Cabinets",
      "Storage Boxes",
      "Tile Adhesives & Grout",
      "Paint Brushes & Rollers",
      "Hardware Fittings"
    ]
  },
];

async function connectToDatabase() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("❌ Failed to connect to MongoDB:", error.message);
    process.exit(1);
  }
}

async function seedCategories() {
  try {
    console.log("🌱 Starting category seeding process...");

    const results = {
      created: 0,
      skipped: 0,
      errors: 0
    };

    for (const categoryData of defaultCategories) {
      try {
        // Check if main category already exists
        let mainCategory = await Category.findOne({ name: categoryData.name, parentId: null });

        if (!mainCategory) {
          // Create main category
          mainCategory = new Category({
            name: categoryData.name,
            parentId: null
          });
          await mainCategory.save();
          console.log(`✅ Main category created: ${categoryData.name}`);
          results.created++;
        } else {
          console.log(`⚠️  Main category already exists: ${categoryData.name}`);
          results.skipped++;
        }

        // Create subcategories
        for (const subcategoryName of categoryData.subcategories) {
          const existingSubcategory = await Category.findOne({
            name: subcategoryName,
            parentId: mainCategory._id
          });

          if (!existingSubcategory) {
            const subcategory = new Category({
              name: subcategoryName,
              parentId: mainCategory._id
            });
            await subcategory.save();
            console.log(`  ✅ Subcategory created: ${subcategoryName}`);
            results.created++;
          } else {
            console.log(`  ⚠️  Subcategory already exists: ${subcategoryName}`);
            results.skipped++;
          }
        }

      } catch (error) {
        console.error(`❌ Error creating category ${categoryData.name}:`, error.message);
        results.errors++;
      }
    }

    // Display summary
    console.log("\n📊 Seeding Summary:");
    console.log(`   Created: ${results.created}`);
    console.log(`   Skipped: ${results.skipped}`);
    console.log(`   Errors: ${results.errors}`);

  } catch (error) {
    console.error("❌ Seeding process failed:", error.message);
    throw error;
  }
}

async function listCategories() {
  try {
    console.log("📋 Current categories in database:");
    const categories = await Category.find().populate('parentId', 'name');

    if (categories.length === 0) {
      console.log("   No categories found");
    } else {
      const mainCategories = categories.filter(cat => !cat.parentId);
      const subCategories = categories.filter(cat => cat.parentId);

      console.log("\n🏷️  Main Categories:");
      mainCategories.forEach((category, index) => {
        console.log(`   ${index + 1}. ${category.name}`);
      });

      console.log("\n📂 Subcategories:");
      subCategories.forEach((category, index) => {
        const parentName = category.parentId ? category.parentId.name : 'Unknown';
        console.log(`   ${index + 1}. ${category.name} (under ${parentName})`);
      });
    }
  } catch (error) {
    console.error("❌ Error listing categories:", error.message);
    throw error;
  }
}

async function clearCategories() {
  try {
    console.log("🗑️  Clearing all categories...");
    const result = await Category.deleteMany({});
    console.log(`✅ Deleted ${result.deletedCount} category(ies)`);
  } catch (error) {
    console.error("❌ Error clearing categories:", error.message);
    throw error;
  }
}

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  try {
    await connectToDatabase();

    switch (command) {
      case 'clear':
        await clearCategories();
        break;
      case 'list':
        await listCategories();
        break;
      case 'seed':
      default:
        await seedCategories();
        break;
    }

  } catch (error) {
    console.error("❌ Script execution failed:", error.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
  }
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = {
  seedCategories,
  clearCategories,
  listCategories,
  connectToDatabase
};
