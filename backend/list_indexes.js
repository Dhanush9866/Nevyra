const mongoose = require("mongoose");
const { Seller } = require("./models"); // Ensure this loads the model so collection is registered
require("dotenv").config();

const uri = process.env.MONGO_URI || "mongodb://localhost:27017/nevyra";

const listIndexes = async () => {
    try {
        await mongoose.connect(uri);
        console.log("Connected to MongoDB");

        const collection = mongoose.connection.db.collection('sellers');
        const indexes = await collection.indexes();

        console.log("Indexes on 'sellers' collection:");
        console.log(JSON.stringify(indexes, null, 2));

        mongoose.disconnect();
    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
};

listIndexes();
