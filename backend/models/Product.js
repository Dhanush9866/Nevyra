const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Seller",
      default: null,
    },
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    subCategory: {
      type: String,
      required: true,
    },
    images: [
      {
        type: String,
        required: true,
      },
    ],
    inStock: {
      type: Boolean,
      default: true,
    },
    rating: {
      type: Number,
      default: 0,
    },
    reviews: {
      type: Number,
      default: 0,
    },
    stockQuantity: {
      type: Number,
      default: 0,
    },
    lowStockThreshold: { type: Number, default: 5 },
    soldCount: {
      type: Number,
      default: 0,
    },
    attributes: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
    },
    additionalSpecifications: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", productSchema);
