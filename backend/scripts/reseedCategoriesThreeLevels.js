const mongoose = require("mongoose");
const Category = require("../models/Category");
require("dotenv").config();

const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://hosannaking2019:YWafeOL8X8dkaSYn@cluster0.rdtscmx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const categoriesData = [
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

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    const rootNames = categoriesData.map(c => c.name);

    // 1. Delete all subcategories (anything with a parentId)
    console.log("🗑️ Deleting all subcategories...");
    await Category.deleteMany({ parentId: { $ne: null } });

    // 2. Delete all root categories that are NOT in our target list
    console.log("🗑️ Deleting invalid root categories...");
    await Category.deleteMany({ parentId: null, name: { $nin: rootNames } });

    // 3. Drop unique index on name if it exists (since we removed it from schema)
    try {
      await Category.collection.dropIndex("name_1");
      console.log("🗑️ Dropped unique index on name");
    } catch (err) {
      console.log("ℹ️ Index name_1 not found or already dropped");
    }

    console.log("🌱 Starting re-population of 3-level hierarchy...");

    for (const catData of categoriesData) {
      // Find or create root category
      let root = await Category.findOne({ name: catData.name, parentId: null });
      if (!root) {
        root = new Category({ name: catData.name, parentId: null });
        await root.save();
        console.log(`✅ Root created: ${root.name}`);
      } else {
        console.log(`ℹ️ Root exists: ${root.name}`);
      }

      // Process Subcategories
      if (catData.subcategories) {
        for (const subData of catData.subcategories) {
          // Create subcategory (Level 2)
          // Note: We create them anew since we deleted them earlier
          const subCategory = new Category({
            name: subData.name,
            parentId: root._id
          });
          await subCategory.save();
          console.log(`  ✅ Subcategory created: ${subCategory.name}`);

          // Process Items (Level 3)
          if (subData.items) {
            for (const itemName of subData.items) {
              const itemCategory = new Category({
                name: itemName,
                parentId: subCategory._id
              });
              await itemCategory.save();
              console.log(`    ✅ Item created: ${itemCategory.name}`);
            }
          }
        }
      }
    }

    console.log("✨ Category re-seeding complete!");
  } catch (error) {
    console.error("❌ Seeding failed:", error);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
  }
}

seed();
