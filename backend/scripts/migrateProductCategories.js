const mongoose = require("mongoose");
const Product = require("../models/Product");
require("dotenv").config();

const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://hosannaking2019:YWafeOL8X8dkaSYn@cluster0.rdtscmx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Category mapping from old names to new names
const categoryMapping = {
  // Old name -> New name
  "Medical": "Medical & Pharmacy",
  "Medical & Pharmacy": "Medical & Pharmacy", // Keep if already correct
  "Pharmacy": "Medical & Pharmacy",
  "Medicine": "Medical & Pharmacy",
  
  "Grocery": "Groceries",
  "Groceries": "Groceries",
  "Food": "Groceries",
  
  "Fashion": "Fashion & Beauty",
  "Fashion & Beauty": "Fashion & Beauty",
  "Beauty": "Fashion & Beauty",
  "Clothing": "Fashion & Beauty",
  
  "Electronics": "Devices",
  "Devices": "Devices",
  "Electronic": "Devices",
  "Gadgets": "Devices",
  
  "Electrical": "Electrical",
  "Electric": "Electrical",
  
  "Automotive": "Automotive",
  "Auto": "Automotive",
  "Automobile": "Automotive",
  
  "Sports": "Sports",
  "Sport": "Sports",
  "Fitness": "Sports",
  
  "Home Interior": "Home Interior",
  "Home": "Home Interior",
  "Interior": "Home Interior",
  "Home & Garden": "Home Interior",
  "Furniture": "Home Interior"
};

// Subcategory mapping (if needed)
const subcategoryMapping = {
  // Add specific subcategory mappings if needed
  "Medicines": "Personal Care",
  "Health Supplements": "Personal Care",
  "Medical Devices": "Personal Care",
  "First Aid": "Personal Care",
  
  "Fresh Produce": "General food items",
  "Dairy & Eggs": "General food items",
  "Snacks & Beverages": "General food items",
  "Packaged Food": "General food items",
  "Cooking Essentials": "General food items",
  "Breakfast & Cereals": "General food items",
  
  "Men's Clothing": "Menswear",
  "Women's Clothing": "Women's Wear",
  "Kids Clothing": "Kids Wear",
  "Shoes": "Men's Shoes",
  "Accessories": "Watches",
  
  "Smartphones": "Cell Phones & Accessories",
  "Tablets": "Cell Phones & Accessories",
  "Headphones": "Cell Phones & Accessories",
  "Cameras": "Cell Phones & Accessories",
  "Gaming Consoles": "Cell Phones & Accessories",
  
  "Washing Machines": "Solar Panels",
  "Air Conditioners": "Solar Panels",
  "Kitchen Appliances": "Solar Panels",
  "Fans & Coolers": "Ceiling Fan",
  
  "Car Accessories": "Car Accessories",
  "Bike Accessories": "Bike Accessories",
  "Car Care": "Engine Oil",
  "Tools & Equipment": "Engine Oil",
  "Spare Parts": "Air Filter",
  
  "Fitness Equipment": "Cricket Bats",
  "Outdoor Gear": "Cricket Balls",
  "Sports Apparel": "Cricket Kit",
  "Team Sports": "Volleyball",
  "Water Sports": "Volleyball Net",
  "Yoga & Meditation": "Volleyball Net",
  
  "Kitchen & Dining": "Gypsum False Ceiling",
  "Home Decor": "Cove Lights",
  "Lighting": "Cove Lights",
  "Bedding": "Wall Paint",
  "Storage": "Wallpaper",
  "Curtains & Blinds": "Curtains"
};

async function connectToDatabase() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("❌ Failed to connect to MongoDB:", error.message);
    process.exit(1);
  }
}

async function analyzeProducts() {
  try {
    console.log("\n📊 Analyzing existing products...\n");
    
    const products = await Product.find({});
    console.log(`Total products found: ${products.length}`);
    
    // Group by category
    const categoryStats = {};
    const subcategoryStats = {};
    
    products.forEach(product => {
      // Count categories
      if (product.category) {
        categoryStats[product.category] = (categoryStats[product.category] || 0) + 1;
      }
      
      // Count subcategories
      if (product.subCategory) {
        subcategoryStats[product.subCategory] = (subcategoryStats[product.subCategory] || 0) + 1;
      }
    });
    
    console.log("\n📁 Current Categories:");
    Object.entries(categoryStats).forEach(([cat, count]) => {
      const willMap = categoryMapping[cat] ? `→ ${categoryMapping[cat]}` : "✓ (already correct)";
      console.log(`   ${cat}: ${count} products ${willMap}`);
    });
    
    console.log("\n📂 Current Subcategories:");
    Object.entries(subcategoryStats).forEach(([subcat, count]) => {
      const willMap = subcategoryMapping[subcat] ? `→ ${subcategoryMapping[subcat]}` : "✓ (will keep)";
      console.log(`   ${subcat}: ${count} products ${willMap}`);
    });
    
    return { products, categoryStats, subcategoryStats };
  } catch (error) {
    console.error("❌ Error analyzing products:", error.message);
    throw error;
  }
}

async function migrateProducts(dryRun = true) {
  try {
    const { products } = await analyzeProducts();
    
    console.log(`\n${dryRun ? '🔍 DRY RUN MODE' : '🔄 MIGRATION MODE'} - ${dryRun ? 'No changes will be made' : 'Updating products...'}\n`);
    
    let updatedCount = 0;
    let skippedCount = 0;
    const updates = [];
    
    for (const product of products) {
      let needsUpdate = false;
      const changes = {};
      
      // Check if category needs updating
      if (product.category && categoryMapping[product.category]) {
        const newCategory = categoryMapping[product.category];
        if (newCategory !== product.category) {
          changes.category = { old: product.category, new: newCategory };
          needsUpdate = true;
        }
      }
      
      // Check if subcategory needs updating
      if (product.subCategory && subcategoryMapping[product.subCategory]) {
        const newSubCategory = subcategoryMapping[product.subCategory];
        if (newSubCategory !== product.subCategory) {
          changes.subCategory = { old: product.subCategory, new: newSubCategory };
          needsUpdate = true;
        }
      }
      
      if (needsUpdate) {
        updates.push({
          id: product._id,
          title: product.title,
          changes
        });
        
        if (!dryRun) {
          // Actually update the product
          if (changes.category) {
            product.category = changes.category.new;
          }
          if (changes.subCategory) {
            product.subCategory = changes.subCategory.new;
          }
          await product.save();
        }
        
        updatedCount++;
      } else {
        skippedCount++;
      }
    }
    
    // Display results
    console.log("\n📋 Migration Summary:");
    console.log(`   Products to update: ${updatedCount}`);
    console.log(`   Products unchanged: ${skippedCount}`);
    
    if (updates.length > 0) {
      console.log("\n📝 Changes to be made:");
      updates.slice(0, 10).forEach(update => {
        console.log(`\n   Product: ${update.title} (${update.id})`);
        if (update.changes.category) {
          console.log(`      Category: "${update.changes.category.old}" → "${update.changes.category.new}"`);
        }
        if (update.changes.subCategory) {
          console.log(`      SubCategory: "${update.changes.subCategory.old}" → "${update.changes.subCategory.new}"`);
        }
      });
      
      if (updates.length > 10) {
        console.log(`\n   ... and ${updates.length - 10} more products`);
      }
    }
    
    if (dryRun) {
      console.log("\n💡 This was a dry run. Run with 'migrate' argument to apply changes.");
    } else {
      console.log("\n✅ Migration completed successfully!");
    }
    
  } catch (error) {
    console.error("❌ Migration failed:", error.message);
    throw error;
  }
}

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  try {
    await connectToDatabase();

    switch (command) {
      case 'analyze':
        await analyzeProducts();
        break;
      case 'migrate':
        await migrateProducts(false);
        break;
      case 'dry-run':
      default:
        await migrateProducts(true);
        break;
    }

  } catch (error) {
    console.error("❌ Script execution failed:", error.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log("\n🔌 Disconnected from MongoDB");
  }
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = {
  migrateProducts,
  analyzeProducts,
  connectToDatabase
};
