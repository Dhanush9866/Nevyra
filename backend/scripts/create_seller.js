const mongoose = require("mongoose");
const { User, Seller } = require("../models");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const userId = "687e6ef6e7e5ad4ffdfe91d7"; // The ID from your logs

async function createSeller() {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      console.error("MONGODB_URI is missing in .env");
      process.exit(1);
    }

    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB");

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      console.error("User not found!");
      process.exit(1);
    }
    console.log(`Found user: ${user.name} (${user.email})`);

    // Check if seller already exists (maybe it was deleted or query failed?)
    const existingSeller = await Seller.findOne({ user: userId });
    if (existingSeller) {
      console.log("Seller profile already exists:", existingSeller);
      // Maybe update it to be verified?
      existingSeller.verificationStatus = "verified";
      existingSeller.isVerified = true;
      await existingSeller.save();
      console.log("Updated seller to be verified.");
    } else {
      // Create new seller
      const newSeller = new Seller({
        user: userId,
        storeName: "Test Store " + Math.floor(Math.random() * 1000),
        sellerType: "individual",
        businessAddress: {
             street: "123 Tech Park",
             city: "Hyderabad",
             state: "Telangana",
             zipCode: "500081",
             country: "India"
        },
        verificationStatus: "verified",
        isVerified: true,
        gst: "GST" + Math.random().toString(36).substring(7).toUpperCase(),
        termsAccepted: true
      });

      await newSeller.save();
      console.log("Created new Verified Seller Profile:", newSeller);
      
      // Update user role to seller if needed (though logic usually relies on Seller document)
      user.role = "seller";
      await user.save();
      console.log("Updated user role to seller");
    }

    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

createSeller();
