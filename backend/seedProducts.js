const mongoose = require("mongoose");
const connectDB = require("./config/mongodb");
const { Category, Product } = require("./models");

async function seedProducts() {
    try {
        await connectDB();
        console.log("Connected to database...");

        const allCategories = await Category.find();
        const categoryMap = {};
        allCategories.forEach(cat => {
            categoryMap[cat._id.toString()] = cat;
        });

        const subCategories = allCategories.filter(cat => cat.parentId !== null);
        console.log(`Found ${subCategories.length} subcategories.`);

        const productsToCreate = [];
        const BATCH_SIZE = 100;

        const sampleImages = [
            "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80",
            "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
            "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80",
            "https://images.unsplash.com/photo-1560343090-f0409e92791a?w=800&q=80",
            "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&q=80",
            "https://images.unsplash.com/photo-1526170315870-ef6897388a12?w=800&q=80",
            "https://images.unsplash.com/photo-1585333127302-c2921935667a?w=800&q=80",
            "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&q=80",
            "https://images.unsplash.com/photo-1511746015091-c794017387a3?w=800&q=80",
            "https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?w=800&q=80"
        ];

        for (const subCat of subCategories) {
            const parentCat = categoryMap[subCat.parentId.toString()];
            const categoryName = parentCat ? parentCat.name : "Uncategorized";

            for (let i = 1; i <= 10; i++) {
                const price = Math.floor(Math.random() * 4000) + 100;
                const discountPercentage = Math.floor(Math.random() * 50) + 10;
                const originalPrice = Math.floor(price / (1 - discountPercentage / 100));
                const discount = originalPrice - price;

                productsToCreate.push({
                    title: `${subCat.name} - Premium ${['Edition', 'Pro', 'Classic', 'Essential', 'Plus'][Math.floor(Math.random() * 5)]} ${i}`,
                    description: `Experience the best of ${subCat.name} with our high-quality premium product. Designed for durability and performance, this item in the ${categoryName} category is perfect for your everyday needs. Includes multiple features and a sleek design.`,
                    price,
                    originalPrice,
                    discount,
                    category: categoryName,
                    subCategory: subCat.name,
                    images: [
                        sampleImages[Math.floor(Math.random() * sampleImages.length)],
                        sampleImages[Math.floor(Math.random() * sampleImages.length)]
                    ],
                    inStock: true,
                    rating: (Math.random() * (5 - 3.5) + 3.5).toFixed(1),
                    reviews: Math.floor(Math.random() * 500) + 20,
                    stockQuantity: Math.floor(Math.random() * 200) + 50,
                    lowStockThreshold: 10,
                    soldCount: Math.floor(Math.random() * 1000),
                    attributes: {
                        "Brand": "Nevyra",
                        "Material": "Premium Synthetic",
                        "Model": `NV-${Math.floor(Math.random() * 1000)}`
                    },
                    additionalSpecifications: {
                        "WARRANTY": "1 Year Replacement Warranty",
                        "DELIVERY": "3-5 Business Days",
                        "SUPPORT": "24/7 Customer Care"
                    }
                });

                if (productsToCreate.length >= BATCH_SIZE) {
                    await Product.insertMany(productsToCreate);
                    console.log(`Inserted batch of ${productsToCreate.length} products... Total so far: ${await Product.countDocuments()}`);
                    productsToCreate.length = 0;
                }
            }
        }

        if (productsToCreate.length > 0) {
            await Product.insertMany(productsToCreate);
            console.log(`Inserted final batch of ${productsToCreate.length} products.`);
        }

        console.log("Seeding completed successfully!");
        process.exit(0);
    } catch (error) {
        console.error("Seeding failed:", error);
        process.exit(1);
    }
}

seedProducts();
