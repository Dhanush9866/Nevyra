const { Product, Category } = require("../models");
const connectDB = require("../config/mongodb");
const mongoose = require("mongoose");

async function fixProductCategories() {
  try {
    // Connect to the specific database
    const conn = await mongoose.connect(
      "mongodb+srv://hosannaking2019:YWafeOL8X8dkaSYn@cluster0.rdtscmx.mongodb.net/test?retryWrites=true&w=majority&appName=Cluster0"
    );
    console.log(`Connected to MongoDB: ${conn.connection.host}`);
    console.log(`Using database: ${conn.connection.name}`);

    // List all collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log("Available collections:", collections.map(c => c.name));
    
    // Get all products
    const products = await Product.find({});
    console.log(`Found ${products.length} products`);
    
    // Also try to find products in the products collection directly
    const productsCollection = mongoose.connection.db.collection('products');
    const allProducts = await productsCollection.find({}).toArray();
    console.log(`Found ${allProducts.length} products in products collection`);
    
    if (allProducts.length > 0) {
      console.log("Sample product:", JSON.stringify(allProducts[0], null, 2));
    }

    let fixedCount = 0;
    let errorCount = 0;

    for (const product of products) {
      try {
        let categoryName = product.category;
        let subCategoryName = product.subCategory;
        let needsUpdate = false;

        // Check if category is an ObjectId (24 character hex string)
        if (product.category && product.category.match(/^[0-9a-fA-F]{24}$/)) {
          const categoryDoc = await Category.findById(product.category);
          if (categoryDoc) {
            categoryName = categoryDoc.name;
            needsUpdate = true;
            console.log(`Resolved category: ${product.category} -> ${categoryName}`);
          } else {
            console.log(`Category not found for ID: ${product.category}`);
            errorCount++;
            continue;
          }
        }

        // Check if subCategory is an ObjectId (24 character hex string)
        if (product.subCategory && product.subCategory.match(/^[0-9a-fA-F]{24}$/)) {
          const subCategoryDoc = await Category.findById(product.subCategory);
          if (subCategoryDoc) {
            subCategoryName = subCategoryDoc.name;
            needsUpdate = true;
            console.log(`Resolved subcategory: ${product.subCategory} -> ${subCategoryName}`);
          } else {
            console.log(`Subcategory not found for ID: ${product.subCategory}`);
            errorCount++;
            continue;
          }
        }

        // Update product if needed
        if (needsUpdate) {
          await Product.findByIdAndUpdate(product._id, {
            category: categoryName,
            subCategory: subCategoryName
          });
          fixedCount++;
          console.log(`Updated product: ${product.title}`);
        }
      } catch (error) {
        console.error(`Error processing product ${product._id}:`, error.message);
        errorCount++;
      }
    }

    console.log(`\nFix completed:`);
    console.log(`- Products fixed: ${fixedCount}`);
    console.log(`- Errors: ${errorCount}`);
    console.log(`- Total processed: ${products.length}`);

    // Show final state
    const updatedProducts = await Product.find({});
    console.log("\nUpdated products:");
    updatedProducts.forEach(product => {
      console.log(`- ${product.title}: ${product.category} / ${product.subCategory}`);
    });

  } catch (error) {
    console.error("Error fixing product categories:", error);
  } finally {
    process.exit();
  }
}

// Run the fix
fixProductCategories();
