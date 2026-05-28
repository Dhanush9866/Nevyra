
const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({ email: String, phone: String });
const User = mongoose.model("User", userSchema);
require("dotenv").config();

const listUsers = async () => {
    try {
        const uri = process.env.MONGO_URI || "mongodb://localhost:27017/nevyra";
        await mongoose.connect(uri);
        const users = await User.find({}, { email: 1, phone: 1, isAdmin: 1 });
        console.log(`Count: ${users.length}`);
        users.forEach(u => console.log(`${u.email} | ${u.phone} | Admin: ${u.isAdmin}`));
    } catch (e) { console.error(e); } finally { await mongoose.disconnect(); }
};
listUsers();
