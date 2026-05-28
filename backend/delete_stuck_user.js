
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    email: String,
    phone: String,
    firstName: String
});
const User = mongoose.model("User", userSchema);

require("dotenv").config();

const deleteUser = async () => {
    try {
        const uri = process.env.MONGO_URI || "mongodb://localhost:27017/nevyra";
        await mongoose.connect(uri);
        console.log("Connected.");

        // Check total users first
        const total = await User.countDocuments();
        console.log(`Total users in DB: ${total}`);

        // Search variations
        const phones = [
            "9398999587",
            "+91 9398999587",
            "+919398999587",
            "8639139906",
            "+91 8639139906"
        ];
        const emails = [
            "mahidhanush20@gmail.com",
            "bluepowerranger@gmail.com"
        ];

        for (const p of phones) {
            const u = await User.findOne({ phone: p });
            if (u) {
                console.log(`[FOUND BY PHONE] ${p} -> ID: ${u._id}, Email: ${u.email}`);
                await User.deleteOne({ _id: u._id });
                console.log("  [DELETED]");
            }
        }

        for (const e of emails) {
            const u = await User.findOne({ email: e });
            if (u) {
                console.log(`[FOUND BY EMAIL] ${e} -> ID: ${u._id}, Phone: ${u.phone}`);
                await User.deleteOne({ _id: u._id });
                console.log("  [DELETED]");
            }
        }

    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
    }
};

deleteUser();
