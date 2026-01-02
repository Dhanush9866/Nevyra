const mongoose = require("mongoose");

const sellerSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
        storeName: { type: String, required: true },
        sellerType: {
            type: String,
            enum: ["Individual", "Business"],
            default: "Individual"
        },
        gstNumber: { type: String },
        businessAddress: {
            address: { type: String },
            city: { type: String },
            pincode: { type: String }
        },
        bankDetails: {
            accountHolderName: { type: String },
            accountNumber: { type: String },
            ifscCode: { type: String },
            cancelledCheque: { type: String }
        },
        kycDetails: {
            panCard: { type: String }, // URL
            addressProof: { type: String }, // URL
            livePhoto: { type: String } // URL
        },
        verificationStatus: {
            type: String,
            enum: ["pending", "verified", "rejected"],
            default: "pending"
        },
        isVerified: { type: Boolean, default: false },
        walletBalance: { type: Number, default: 0 }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Seller", sellerSchema);
