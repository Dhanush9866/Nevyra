const mongoose = require("mongoose");
const Category = require("../models/Category");
const Product = require("../models/Product");
require("dotenv").config();

const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://hosannaking2019:YWafeOL8X8dkaSYn@cluster0.rdtscmx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const genericImages = [
  "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1629198688000-71f23e745b6e?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1560343090-f0409e92791a?auto=format&fit=crop&q=80&w=800"
];

function getRandomImage() {
  return genericImages[Math.floor(Math.random() * genericImages.length)];
}

function getRandomPrice(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function connectToDatabase() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("❌ Failed to connect to MongoDB:", error.message);
    process.exit(1);
  }
}

async function populateSubcategories() {
  try {
    console.log("🌱 Starting detailed product population...");

    // 1. Fetch all subcategories (categories with a parentId)
    // We need to populate parentId to get the parent category Name
    const subCategories = await Category.find({ parentId: { $ne: null } }).populate("parentId");

    if (!subCategories || subCategories.length === 0) {
      console.log("⚠️ No subcategories found. Please seed categories first.");
      return;
    }

    console.log(`Found ${subCategories.length} subcategories.`);

    let totalCreated = 0;
    
    // 2. Iterate and create products
    for (const subCat of subCategories) {
      if (!subCat.parentId) {
        console.warn(`⚠️ Skipping subcategory "${subCat.name}" because it has an invalid parent.`);
        continue;
      }

      const parentName = subCat.parentId.name;
      const subCatName = subCat.name;
      
      const productsToCreate = [];

      for (let i = 1; i <= 10; i++) {
        // Simple randomization for variety
        const price = getRandomPrice(10, 500);
        const stock = getRandomPrice(10, 200);
        const rating = (Math.random() * (5.0 - 3.5) + 3.5).toFixed(1);
        const reviews = getRandomPrice(5, 500);
        
        productsToCreate.push({
          title: `${subCatName} Item ${i}`,
          price: price,
          category: parentName,
          subCategory: subCatName,
          images: [getRandomImage()], // In a real app, this would be specific images
          description: `This is high quality ${subCatName} from the ${parentName} collection. Perfect for your needs.`,
          stockQuantity: stock,
          rating: Number(rating),
          reviews: reviews
        });
      }

      // Bulk insert for efficiency
      try {
        await Product.insertMany(productsToCreate);
        console.log(`✅ Added 10 products for: ${parentName} > ${subCatName}`);
        totalCreated += 10;
      } catch (err) {
        console.error(`❌ Error adding products for ${subCatName}:`, err.message);
      }
    }

    console.log("\n🎉 Population Complete!");
    console.log(`Total Products Created: ${totalCreated}`);

  } catch (error) {
    console.error("❌ Population process failed:", error.message);
    throw error;
  }
}

async function main() {
  try {
    await connectToDatabase();
    await populateSubcategories();
  } catch (error) {
    console.error("❌ Script execution failed:", error.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
  }
}

if (require.main === module) {
  main();
}
