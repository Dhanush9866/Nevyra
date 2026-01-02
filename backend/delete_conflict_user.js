const mongoose = require("mongoose");
const { User } = require("./models"); // Adjust path if needed
require("dotenv").config();

const uri = "mongodb+srv://hosannaking2019:YWafeOL8X8dkaSYn@cluster0.rdtscmx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const deleteUser = async () => {
    try {
        await mongoose.connect(uri);
        console.log("Connected to MongoDB");

        const emailsToDelete = ["chaitanyachinnu666@gmail.com", "bluepowerrange@gmail.com"];

        for (const email of emailsToDelete) {
            const user = await User.findOne({ email });
            if (user) {
                await User.deleteOne({ _id: user._id });
                console.log(`Deleted user: ${email}`);

                // Also try to delete associated seller profile if any, though likely not created yet
                try {
                    const { Seller } = require("./models");
                    const seller = await Seller.findOne({ user: user._id });
                    if (seller) {
                        await Seller.deleteOne({ _id: seller._id });
                        console.log(`Deleted associated seller profile for: ${email}`);
                    }
                } catch (e) {
                    console.log("No seller model or failed to delete seller");
                }
            } else {
                console.log(`User not found: ${email}`);
            }
        }

        mongoose.disconnect();
    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
};

deleteUser();
