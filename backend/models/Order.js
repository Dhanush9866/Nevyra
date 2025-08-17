const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  productName: {
    type: String,
    required: true,
  },
  productImage: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  totalPrice: {
    type: Number,
    required: true,
    min: 0,
  },
});

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [orderItemSchema],
    shippingAddress: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      zipCode: { type: String, required: true },
    },
    paymentMethod: {
      type: String,
      enum: ["cod", "card", "upi", "netbanking"],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },
    orderStatus: {
      type: String,
      enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
    shippingCost: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    tax: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    orderNumber: {
      type: String,
      unique: true,
      required: false, // Will be generated in pre-save hook
    },
    estimatedDelivery: {
      type: Date,
      required: false, // Will be generated in pre-save hook
    },
    notes: {
      type: String,
      maxLength: 500,
    },
  },
  {
    timestamps: true,
  }
);

// Generate order number before saving
orderSchema.pre("save", async function (next) {
  if (this.isNew) {
    try {
      const date = new Date();
      const year = date.getFullYear().toString().slice(-2);
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const day = date.getDate().toString().padStart(2, "0");
      
      // Generate a simple order number without database query
      const timestamp = Date.now().toString().slice(-6);
      this.orderNumber = `NV${year}${month}${day}${timestamp}`;
      
      // Set estimated delivery to 5-7 days from now
      const deliveryDays = 5 + Math.floor(Math.random() * 3); // 5-7 days
      this.estimatedDelivery = new Date(date.getTime() + deliveryDays * 24 * 60 * 60 * 1000);
    } catch (error) {
      console.error("Error generating order number:", error);
      // Fallback order number
      this.orderNumber = `NV${Date.now()}`;
      this.estimatedDelivery = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000);
    }
  }
  next();
});

// Calculate totals before saving
orderSchema.pre("save", function (next) {
  if (this.isModified("items") || this.isModified("subtotal") || this.isModified("shippingCost") || this.isModified("tax")) {
    this.totalAmount = this.subtotal + this.shippingCost + this.tax;
  }
  next();
});

module.exports = mongoose.model("Order", orderSchema);
