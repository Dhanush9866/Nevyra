const mongoose = require("mongoose");
const Product = require("../models/Product");
require("dotenv").config();

const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://hosannaking2019:YWafeOL8X8dkaSYn@cluster0.rdtscmx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const products = [
  // --- Medical & Pharmacy (5 items) ---
  {
    title: "Vitamin C Serum",
    price: 25,
    category: "Medical & Pharmacy",
    subCategory: "Skin Care",
    images: ["https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=800"],
    description: "Brightening vitamin C serum.",
    stockQuantity: 100,
    rating: 4.7,
    reviews: 150
  },
  {
    title: "Hair Growth Shampoo",
    price: 18,
    category: "Medical & Pharmacy",
    subCategory: "Hair Care",
    images: ["https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&q=80&w=800"],
    description: "Promotes healthy hair growth.",
    stockQuantity: 80,
    rating: 4.5,
    reviews: 120
  },
  {
    title: "Luxury Perfume",
    price: 89,
    category: "Medical & Pharmacy",
    subCategory: "Fragrance",
    images: ["https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=800"],
    description: "Long-lasting fragrance.",
    stockQuantity: 50,
    rating: 4.8,
    reviews: 200
  },
  {
    title: "Makeup Palette",
    price: 45,
    category: "Medical & Pharmacy",
    subCategory: "Makeup",
    images: ["https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&q=80&w=800"],
    description: "Professional makeup palette.",
    stockQuantity: 60,
    rating: 4.6,
    reviews: 90
  },
  {
    title: "Hand Cream",
    price: 12,
    category: "Medical & Pharmacy",
    subCategory: "Foot, Hand & Nail Care",
    images: ["https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&q=80&w=800"],
    description: "Moisturizing hand cream.",
    stockQuantity: 120,
    rating: 4.4,
    reviews: 80
  },

  // --- Groceries (5 items) ---
  {
    title: "Organic Rice 5kg",
    price: 15,
    category: "Groceries",
    subCategory: "General food items",
    images: ["https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=800"],
    description: "Premium organic rice.",
    stockQuantity: 200,
    rating: 4.7,
    reviews: 300
  },
  {
    title: "Olive Oil 1L",
    price: 22,
    category: "Groceries",
    subCategory: "General food items",
    images: ["https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&q=80&w=800"],
    description: "Extra virgin olive oil.",
    stockQuantity: 150,
    rating: 4.8,
    reviews: 250
  },
  {
    title: "Whole Wheat Flour 10kg",
    price: 18,
    category: "Groceries",
    subCategory: "General food items",
    images: ["https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80&w=800"],
    description: "Fresh whole wheat flour.",
    stockQuantity: 180,
    rating: 4.6,
    reviews: 180
  },
  {
    title: "Dishwashing Liquid",
    price: 8,
    category: "Groceries",
    subCategory: "Daily essentials",
    images: ["https://images.unsplash.com/photo-1563453392212-326f5e854473?auto=format&fit=crop&q=80&w=800"],
    description: "Effective dishwashing liquid.",
    stockQuantity: 250,
    rating: 4.5,
    reviews: 150
  },
  {
    title: "Laundry Detergent 2kg",
    price: 14,
    category: "Groceries",
    subCategory: "Daily essentials",
    images: ["https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?auto=format&fit=crop&q=80&w=800"],
    description: "Powerful cleaning detergent.",
    stockQuantity: 200,
    rating: 4.7,
    reviews: 220
  },

  // --- Fashion & Beauty (5 items) ---
  {
    title: "Men's Formal Shirt",
    price: 35,
    category: "Fashion & Beauty",
    subCategory: "Menswear",
    images: ["https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&q=80&w=800"],
    description: "Classic formal shirt.",
    stockQuantity: 100,
    rating: 4.6,
    reviews: 140
  },
  {
    title: "Women's Casual Dress",
    price: 45,
    category: "Fashion & Beauty",
    subCategory: "Women's Wear",
    images: ["https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=800"],
    description: "Comfortable casual dress.",
    stockQuantity: 80,
    rating: 4.7,
    reviews: 160
  },
  {
    title: "Kids T-Shirt Pack",
    price: 25,
    category: "Fashion & Beauty",
    subCategory: "Kids Wear",
    images: ["https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&q=80&w=800"],
    description: "Colorful kids t-shirts.",
    stockQuantity: 120,
    rating: 4.5,
    reviews: 100
  },
  {
    title: "Leather Watch",
    price: 89,
    category: "Fashion & Beauty",
    subCategory: "Watches",
    images: ["https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&q=80&w=800"],
    description: "Elegant leather watch.",
    stockQuantity: 50,
    rating: 4.8,
    reviews: 180
  },
  {
    title: "Travel Luggage",
    price: 120,
    category: "Fashion & Beauty",
    subCategory: "Luggage",
    images: ["https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?auto=format&fit=crop&q=80&w=800"],
    description: "Durable travel luggage.",
    stockQuantity: 40,
    rating: 4.7,
    reviews: 130
  },

  // --- Devices (5 items) ---
  {
    title: "iPhone 15 Pro",
    price: 999,
    category: "Devices",
    subCategory: "Cell Phones & Accessories",
    images: ["https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&q=80&w=800"],
    description: "Latest iPhone model.",
    stockQuantity: 50,
    rating: 4.9,
    reviews: 300
  },
  {
    title: "Dell XPS 15 Laptop",
    price: 1299,
    category: "Devices",
    subCategory: "Laptops",
    images: ["https://images.unsplash.com/photo-1593642632823-8f78536788c6?auto=format&fit=crop&q=80&w=800"],
    description: "High-performance laptop.",
    stockQuantity: 30,
    rating: 4.8,
    reviews: 250
  },
  {
    title: "Samsung 55\" Smart TV",
    price: 799,
    category: "Devices",
    subCategory: "Televisions",
    images: ["https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&q=80&w=800"],
    description: "4K Smart TV.",
    stockQuantity: 25,
    rating: 4.7,
    reviews: 200
  },
  {
    title: "LG French Door Refrigerator",
    price: 1499,
    category: "Devices",
    subCategory: "Refrigerators",
    images: ["https://images.unsplash.com/photo-1571175443880-49e1d58b794a?auto=format&fit=crop&q=80&w=800"],
    description: "Energy-efficient refrigerator.",
    stockQuantity: 15,
    rating: 4.6,
    reviews: 120
  },
  {
    title: "Apple Watch Series 9",
    price: 399,
    category: "Devices",
    subCategory: "Smart Watches",
    images: ["https://images.unsplash.com/photo-1434493789847-2f02ea6ca920?auto=format&fit=crop&q=80&w=800"],
    description: "Advanced smartwatch.",
    stockQuantity: 60,
    rating: 4.8,
    reviews: 280
  },

  // --- Electrical (5 items) ---
  {
    title: "Solar Panel 300W",
    price: 250,
    category: "Electrical",
    subCategory: "Solar Panels",
    images: ["https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&q=80&w=800"],
    description: "High-efficiency solar panel.",
    stockQuantity: 30,
    rating: 4.7,
    reviews: 80
  },
  {
    title: "Car Battery 12V",
    price: 120,
    category: "Electrical",
    subCategory: "Batteries",
    images: ["https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&q=80&w=800"],
    description: "Long-lasting car battery.",
    stockQuantity: 50,
    rating: 4.6,
    reviews: 100
  },
  {
    title: "LED Bulb Pack (10pcs)",
    price: 25,
    category: "Electrical",
    subCategory: "LED Bulbs",
    images: ["https://images.unsplash.com/photo-1550985616-10810253b84d?auto=format&fit=crop&q=80&w=800"],
    description: "Energy-saving LED bulbs.",
    stockQuantity: 200,
    rating: 4.5,
    reviews: 150
  },
  {
    title: "Ceiling Fan 48\"",
    price: 89,
    category: "Electrical",
    subCategory: "Ceiling Fan",
    images: ["https://images.unsplash.com/photo-1621905251918-48416bd8575a?auto=format&fit=crop&q=80&w=800"],
    description: "Energy-efficient ceiling fan.",
    stockQuantity: 40,
    rating: 4.6,
    reviews: 90
  },
  {
    title: "Electrical Wiring Cable 100m",
    price: 45,
    category: "Electrical",
    subCategory: "Wiring Cables",
    images: ["https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&q=80&w=800"],
    description: "High-quality wiring cable.",
    stockQuantity: 80,
    rating: 4.7,
    reviews: 70
  },

  // --- Automotive (5 items) ---
  {
    title: "Bike Helmet",
    price: 45,
    category: "Automotive",
    subCategory: "Bike Accessories",
    images: ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80&w=800"],
    description: "Safety bike helmet.",
    stockQuantity: 100,
    rating: 4.7,
    reviews: 150
  },
  {
    title: "Car Seat Cover Set",
    price: 89,
    category: "Automotive",
    subCategory: "Car Accessories",
    images: ["https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&q=80&w=800"],
    description: "Premium car seat covers.",
    stockQuantity: 60,
    rating: 4.6,
    reviews: 120
  },
  {
    title: "Synthetic Engine Oil 5L",
    price: 35,
    category: "Automotive",
    subCategory: "Engine Oil",
    images: ["https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&q=80&w=800"],
    description: "High-performance engine oil.",
    stockQuantity: 150,
    rating: 4.8,
    reviews: 200
  },
  {
    title: "Brake Fluid 1L",
    price: 15,
    category: "Automotive",
    subCategory: "Brake Fluid",
    images: ["https://images.unsplash.com/photo-1487754180451-c456f719a1fc?auto=format&fit=crop&q=80&w=800"],
    description: "DOT 4 brake fluid.",
    stockQuantity: 100,
    rating: 4.5,
    reviews: 80
  },
  {
    title: "Car Air Filter",
    price: 25,
    category: "Automotive",
    subCategory: "Air Filter",
    images: ["https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&q=80&w=800"],
    description: "High-efficiency air filter.",
    stockQuantity: 120,
    rating: 4.6,
    reviews: 90
  },

  // --- Sports (5 items) ---
  {
    title: "Cricket Bat Professional",
    price: 89,
    category: "Sports",
    subCategory: "Cricket Bats",
    images: ["https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&q=80&w=800"],
    description: "Professional cricket bat.",
    stockQuantity: 40,
    rating: 4.8,
    reviews: 120
  },
  {
    title: "Cricket Ball Pack (6pcs)",
    price: 25,
    category: "Sports",
    subCategory: "Cricket Balls",
    images: ["https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&q=80&w=800"],
    description: "Leather cricket balls.",
    stockQuantity: 100,
    rating: 4.6,
    reviews: 80
  },
  {
    title: "Cricket Stumps Set",
    price: 35,
    category: "Sports",
    subCategory: "Stumps",
    images: ["https://images.unsplash.com/photo-1593341646782-e0b495cff86d?auto=format&fit=crop&q=80&w=800"],
    description: "Complete stumps set.",
    stockQuantity: 60,
    rating: 4.5,
    reviews: 60
  },
  {
    title: "Volleyball",
    price: 20,
    category: "Sports",
    subCategory: "Volleyball",
    images: ["https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?auto=format&fit=crop&q=80&w=800"],
    description: "Professional volleyball.",
    stockQuantity: 80,
    rating: 4.7,
    reviews: 100
  },
  {
    title: "Volleyball Net",
    price: 45,
    category: "Sports",
    subCategory: "Volleyball Net",
    images: ["https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?auto=format&fit=crop&q=80&w=800"],
    description: "Durable volleyball net.",
    stockQuantity: 50,
    rating: 4.6,
    reviews: 70
  },

  // --- Home Interior (5 items) ---
  {
    title: "Gypsum False Ceiling",
    price: 450,
    category: "Home Interior",
    subCategory: "Gypsum False Ceiling",
    images: ["https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=800"],
    description: "Modern false ceiling design.",
    stockQuantity: 20,
    rating: 4.7,
    reviews: 50
  },
  {
    title: "LED Cove Lights 5m",
    price: 35,
    category: "Home Interior",
    subCategory: "Cove Lights",
    images: ["https://images.unsplash.com/photo-1565183997392-2f6f122e5912?auto=format&fit=crop&q=80&w=800"],
    description: "RGB LED cove lights.",
    stockQuantity: 100,
    rating: 4.6,
    reviews: 80
  },
  {
    title: "Premium Wall Paint 20L",
    price: 89,
    category: "Home Interior",
    subCategory: "Wall Paint",
    images: ["https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&q=80&w=800"],
    description: "Washable wall paint.",
    stockQuantity: 60,
    rating: 4.8,
    reviews: 120
  },
  {
    title: "Designer Wallpaper Roll",
    price: 45,
    category: "Home Interior",
    subCategory: "Wallpaper",
    images: ["https://images.unsplash.com/photo-1615873968403-89e068629265?auto=format&fit=crop&q=80&w=800"],
    description: "Elegant wallpaper design.",
    stockQuantity: 80,
    rating: 4.7,
    reviews: 90
  },
  {
    title: "Blackout Curtains Set",
    price: 65,
    category: "Home Interior",
    subCategory: "Curtains",
    images: ["https://images.unsplash.com/photo-1585128792304-b8f4e7e0e3d0?auto=format&fit=crop&q=80&w=800"],
    description: "Thermal blackout curtains.",
    stockQuantity: 70,
    rating: 4.6,
    reviews: 100
  }
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

async function seedProducts() {
  try {
    console.log("🌱 Starting product seeding process...");
    
    const results = {
      created: 0,
      skipped: 0,
      errors: 0
    };

    for (const productData of products) {
      try {
        // Check if product already exists
        let existingProduct = await Product.findOne({ title: productData.title });
        
        if (!existingProduct) {
          const product = new Product(productData);
          await product.save();
          console.log(`✅ Product created: ${productData.title} (${productData.category})`);
          results.created++;
        } else {
          console.log(`⚠️  Product already exists: ${productData.title}`);
          results.skipped++;
        }
        
      } catch (error) {
        console.error(`❌ Error creating product ${productData.title}:`, error.message);
        results.errors++;
      }
    }

    // Display summary by category
    console.log("\n📊 Seeding Summary:");
    console.log(`   Created: ${results.created}`);
    console.log(`   Skipped: ${results.skipped}`);
    console.log(`   Errors: ${results.errors}`);
    
    // Count products per category
    const categories = [
      "Medical & Pharmacy",
      "Groceries", 
      "Fashion & Beauty",
      "Devices",
      "Electrical",
      "Automotive",
      "Sports",
      "Home Interior"
    ];
    
    console.log("\n📦 Products per category:");
    for (const category of categories) {
      const count = await Product.countDocuments({ category });
      console.log(`   ${category}: ${count} products`);
    }

  } catch (error) {
    console.error("❌ Seeding process failed:", error.message);
    throw error;
  }
}

async function main() {
  try {
    await connectToDatabase();
    await seedProducts();
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
  seedProducts,
  connectToDatabase
};
