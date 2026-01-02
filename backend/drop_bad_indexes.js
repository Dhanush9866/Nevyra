const mongoose = require("mongoose");
require("dotenv").config();

const uri = "mongodb+srv://hosannaking2019:YWafeOL8X8dkaSYn@cluster0.rdtscmx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const dropIndexes = async () => {
    try {
        await mongoose.connect(uri);
        console.log("Connected to MongoDB");

        const collection = mongoose.connection.db.collection('sellers');

        console.log("Dropping email_1...");
        try { await collection.dropIndex("email_1"); console.log("Dropped email_1"); } catch (e) { console.log("email_1 not found or error: " + e.message); }

        console.log("Dropping phone_1...");
        try { await collection.dropIndex("phone_1"); console.log("Dropped phone_1"); } catch (e) { console.log("phone_1 not found or error: " + e.message); }

        console.log("Dropping storeName_1...");
        try { await collection.dropIndex("storeName_1"); console.log("Dropped storeName_1"); } catch (e) { console.log("storeName_1 not found or error: " + e.message); }

        const indexes = await collection.indexes();
        console.log("\nRemaining Indexes:");
        console.log(JSON.stringify(indexes, null, 2));

        mongoose.disconnect();
    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
};

dropIndexes();
