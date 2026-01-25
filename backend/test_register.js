
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({ email: String, phone: String, firstName: String, lastName: String, password: String });
const User = mongoose.model("User", userSchema);

const testRegister = async () => {
    try {
        const uri = "mongodb+srv://hosannaking2019:YWafeOL8X8dkaSYn@cluster0.rdtscmx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
        await mongoose.connect(uri);
        console.log("Connected.");

        // Check conflicts manually first
        const pCheck = await User.findOne({ phone: "9398999587" });
        if (pCheck) console.log("CONFLICT PHONE: found", pCheck.email);
        else console.log("Phone check clean.");

        const eCheck = await User.findOne({ email: "bluepowerranger@gmail.com" });
        if (eCheck) console.log("CONFLICT EMAIL: found", eCheck.email);
        else console.log("Email check clean.");

        // If clean, try to insert?
        if (!pCheck && !eCheck) {
            console.log("No conflicts found in DB. Registration should succeed.");
        }

    } catch (e) { console.error(e); } finally { await mongoose.disconnect(); }
};
testRegister();
