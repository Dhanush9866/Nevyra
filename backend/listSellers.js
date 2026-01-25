const mongoose = require("mongoose");
const connectDB = require("./config/mongodb");
const { Seller } = require("./models");

async function listSellers() {
    await connectDB();
    const sellers = await Seller.find();
    console.log("SELLERS_START");
    console.log(JSON.stringify(sellers, null, 2));
    console.log("SELLERS_END");
    process.exit(0);
}

listSellers();
