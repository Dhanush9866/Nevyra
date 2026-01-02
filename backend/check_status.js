const mongoose = require("mongoose");
const { Seller } = require("./models");
require("dotenv").config();

const uri = "mongodb+srv://hosannaking2019:YWafeOL8X8dkaSYn@cluster0.rdtscmx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const checkPending = async () => {
    try {
        await mongoose.connect(uri);
        console.log("Connected to MongoDB");

        const pendingSellers = await Seller.find({ verificationStatus: "pending" }).populate("user", "firstName lastName email");

        console.log(`Pending Sellers Count: ${pendingSellers.length}`);
        pendingSellers.forEach(s => {
            console.log(`- Store: ${s.storeName}, Email: ${s.user?.email}, ID: ${s._id}`);
        });

        mongoose.disconnect();
    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
};

checkPending();
