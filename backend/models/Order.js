const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    totalAmount: { type: Number, required: true },
    orderNumber: { type: String, unique: true },
    shippingAddress: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      email: { type: String },
      phone: { type: String, required: true },
      addressLine1: { type: String, required: true },
      addressLine2: { type: String },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zipCode: { type: String, required: true },
    },
    status: {
      type: String,
      enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
      default: "Pending",
    },
    paymentMethod: {
      type: String,
      enum: ["razorpay", "cod"],
      default: "cod",
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed"],
      default: "Pending",
    },
    paymentDetails: {
      razorpayOrderId: String,
      razorpayPaymentId: String,
      razorpaySignature: String,
    },
    returnStatus: {
      type: String,
      enum: ["None", "Pending", "Approved", "Rejected", "Success"],
      default: "None",
    },
    returnReason: {
      type: String,
      default: "",
    },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: false }
);

module.exports = mongoose.model("Order", orderSchema);
