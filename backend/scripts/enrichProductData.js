const mongoose = require("mongoose");
const Product = require("../models/Product");
require("dotenv").config();

const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://hosannaking2019:YWafeOL8X8dkaSYn@cluster0.rdtscmx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

async function enrichProducts() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    const products = await Product.find();
    console.log(`🔍 Found ${products.length} products to enrich.`);

    for (const product of products) {
      console.log(`📦 Enriching: ${product.title}`);

      // 1. Generate Description (if missing or too short)
      if (!product.description || product.description.length < 20) {
        product.description = `Experience the best of ${product.subCategory} with our high-quality ${product.title}. Part of the ${product.category} collection, this product is designed for reliability and performance. Whether for personal use or professional needs, it offers exceptional value and craftsmanship.`;
      }

      // 2. Category-Specific Attributes
      const attributes = new Map();
      attributes.set("BRAND", product.brand || "Nevyra Select");
      attributes.set("PRODUCT_ORIGIN", "India");
      
      switch (product.category) {
        case "Medical & Pharmacy":
          attributes.set("FORM", "Various");
          attributes.set("USAGE", "Daily Health");
          attributes.set("EXPIRY_DATE", "24 Months from MFG");
          attributes.set("PRESCRIPTION_REQUIRED", "No");
          break;
        case "Groceries":
          attributes.set("SHELF_LIFE", "6-12 Months");
          attributes.set("DIET_TYPE", "Vegetarian/Non-Vegetarian");
          attributes.set("STORAGE_INSTRUCTIONS", "Cool and Dry Place");
          attributes.set("ORGANIC", "Optional");
          break;
        case "Fashion & Beauty":
          attributes.set("MATERIAL", "Standard Grade");
          attributes.set("COLOR", "Assorted");
          attributes.set("GENDER", "Unisex");
          attributes.set("CARE_INSTRUCTIONS", "Hand/Machine Wash");
          break;
        case "Devices":
          attributes.set("CONNECTIVITY", "Wireless/Wired");
          attributes.set("BATTERY_LIFE", "As per usage");
          attributes.set("WARRANTY", "1 Year Limited");
          attributes.set("COMPATIBILITY", "Universal");
          break;
        case "Electrical & Electronics":
          attributes.set("VOLTAGE", "220-240V");
          attributes.set("WATTAGE", "Varies");
          attributes.set("ENERGY_RATING", "3 Star or Above");
          attributes.set("WARRANTY", "2 Years");
          break;
        case "Automotive & Automobile":
          attributes.set("VEHICLE_TYPE", "Car/Bike");
          attributes.set("DURABILITY", "High Grade");
          attributes.set("INSTALLATION", "Easy/Professional");
          break;
        case "Sports":
          attributes.set("SPORT_TYPE", product.subCategory);
          attributes.set("PROFESSIONAL_LEVEL", "Intermediate");
          attributes.set("WEIGHT", "Balanced");
          break;
        case "Home Interior & Decor":
          attributes.set("ROOM_TYPE", "Living/Bedroom");
          attributes.set("FINISH", "Polished");
          attributes.set("ASSEMBLY", "Pre-assembled/DIY");
          break;
        default:
          attributes.set("MATERIAL", "Standard");
          attributes.set("WARRANTY", "1 Year");
      }
      product.attributes = attributes;

      // 3. Category-Specific Additional Specifications
      const specs = new Map();
      specs.set("MODEL_NUMBER", `NV-${Math.floor(Math.random() * 9000) + 1000}`);
      specs.set("SKU_CODE", `NY-${Math.random().toString(36).substring(7).toUpperCase()}`);
      
      switch (product.category) {
        case "Devices":
        case "Electrical & Electronics":
          specs.set("COLOR_FINISH", "Black/Silver");
          specs.set("WEIGHT_G", "850");
          specs.set("BOX_CONTENTS", "Product, Manual, Warranty Card");
          break;
        case "Medical & Pharmacy":
          specs.set("NET_QUANTITY", "1 Unit");
          specs.set("SAFETY_WARNING", "Keep out of reach of children");
          break;
        case "Fashion & Beauty":
          specs.set("SIZE_CHART", "S, M, L, XL");
          specs.set("PATTERN", "Solid/Printed");
          break;
        default:
          specs.set("PACKAGING", "Eco-friendly");
          specs.set("DIMENSIONS", "Generic Standard");
      }
      product.additionalSpecifications = specs;

      // Ensure inStock and other numbers are set if they were missing or null
      if (product.stockQuantity === undefined || product.stockQuantity === null) product.stockQuantity = 50;
      if (product.rating === undefined || product.rating === null || product.rating === 0) product.rating = (Math.random() * 1.5 + 3.5).toFixed(1);
      if (product.reviews === undefined || product.reviews === null) product.reviews = Math.floor(Math.random() * 100) + 10;

      await product.save();
    }

    console.log("✨ All products enriched with category-specific data!");
  } catch (error) {
    console.error("❌ Enrichment failed:", error);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
  }
}

enrichProducts();
