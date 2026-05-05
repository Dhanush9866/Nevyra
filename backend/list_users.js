
const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({ email: String, phone: String });
const User = mongoose.model("User", userSchema);
const listUsers = async () => {
    try {
        const uri = "mongodb+srv://hosannaking2019:YWafeOL8X8dkaSYn@cluster0.rdtscmx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
        await mongoose.connect(uri);
        const users = await User.find({}, { email: 1, phone: 1, isAdmin: 1 });
        console.log(`Count: ${users.length}`);
        users.forEach(u => console.log(`${u.email} | ${u.phone} | Admin: ${u.isAdmin}`));
    } catch (e) { console.error(e); } finally { await mongoose.disconnect(); }
};
listUsers();
