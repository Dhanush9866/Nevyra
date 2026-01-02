const mongoose = require("mongoose");

const payoutSchema = new mongoose.Schema(
  {
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Seller",
      required: true,
    },
    amount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["Processing", "Paid", "Failed", "Rejected"],
      default: "Processing",
    },
    transactionId: { type: String }, // Bank reference
    notes: { type: String },
    requestedAt: { type: Date, default: Date.now },
    processedAt: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payout", payoutSchema);
