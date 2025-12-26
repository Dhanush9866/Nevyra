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
      "General food items",
      "Daily essentials"
    ]
  },
  {
    name: "Fashion & Beauty",
    parentId: null,
    subcategories: [
      "Menswear",
      "Women's Wear",
      "Kids Wear",
      "Men's Shoes",
      "Women's Shoes",
      "Kids Shoes",
      "Watches",
      "Luggage"
    ]
  },
  {
    name: "Devices",
    parentId: null,
    subcategories: [
      "Cell Phones & Accessories",
      "Laptops",
      "Televisions",
      "Refrigerators",
      "Smart Watches"
    ]
  },
  {
    name: "Electrical",
    parentId: null,
    subcategories: [
      "Solar Panels",
      "Solar Fencing Kit",
      "Batteries",
      "Transformers",
      "Wiring Cables",
      "LED Bulbs",
      "Tube Lights",
      "Ceiling Fan"
    ]
  },
  {
    name: "Automotive",
    parentId: null,
    subcategories: [
      "Bike Accessories",
      "Car Accessories",
      "Engine Oil",
      "Brake Fluid",
      "Air Filter"
    ]
  },
  {
    name: "Sports",
    parentId: null,
    subcategories: [
      "Cricket Bats",
      "Cricket Balls",
      "Stumps",
      "Cricket Kit",
      "Volleyball",
      "Volleyball Net"
    ]
  },
  {
    name: "Home Interior",
    parentId: null,
    subcategories: [
      "Gypsum False Ceiling",
      "Cove Lights",
      "Main Door",
      "Wall Paint",
      "Wallpaper",
      "Curtains",
      "Wall Tiles"
    ]
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
