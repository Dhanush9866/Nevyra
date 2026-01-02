
require("dotenv").config();
const mongoose = require("mongoose");
const Seller = require("./models/Seller");
const User = require("./models/User");

const connectDB = async () => {
    try {
        console.log("URI:", process.env.MONGODB_URI ? "Found" : "Missing");
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB");
    } catch (err) {
        console.error("MongoDB connection error:", err);
        process.exit(1);
    }
};

const checkSellers = async () => {
    await connectDB();
    try {
        const sellers = await Seller.find({});
        console.log(`Found ${sellers.length} sellers.`);

        for (const s of sellers) {
            console.log("------------------------------------------------");
            console.log(`ID: ${s._id}`);
            console.log(`Store: ${s.storeName}`);
            console.log(`Status: ${s.verificationStatus}`);
            console.log(`User ID: ${s.user}`);

            // Check if user exists
            const u = await User.findById(s.user);
            console.log(`Linked User: ${u ? u.email : 'NOT FOUND'}`);

            console.log(`KYC: ${JSON.stringify(s.kycDetails)}`);
        }
    } catch (err) {
        console.error("Error checking sellers:", err);
    } finally {
        mongoose.disconnect();
    }
};

checkSellers();
