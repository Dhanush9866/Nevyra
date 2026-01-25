const mongoose = require("mongoose");
const connectDB = require("./config/mongodb");
const { Category } = require("./models");

async function listCategories() {
    await connectDB();
    const categories = await Category.find();
    categories.forEach(cat => {
        console.log(`ID: ${cat._id}, Name: ${cat.name}, ParentID: ${cat.parentId}`);
    });
    console.log("TOTAL_CATEGORIES:", categories.length);
    process.exit(0);
}

listCategories();
