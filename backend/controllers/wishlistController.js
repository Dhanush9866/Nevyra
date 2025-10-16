const { WishlistItem } = require("../models");

exports.list = async (req, res, next) => {
  try {
    const items = await WishlistItem.find({ userId: req.user.id }).populate("productId");
    res.json({ success: true, message: "Wishlist fetched", data: items });
  } catch (err) {
    next(err);
  }
};

exports.add = async (req, res, next) => {
  try {
    const { productId } = req.body;
    if (!productId) return res.status(400).json({ success: false, message: "productId required", data: null });
    const existing = await WishlistItem.findOne({ userId: req.user.id, productId });
    if (existing) return res.json({ success: true, message: "Already in wishlist", data: existing });
    const item = await WishlistItem.create({ userId: req.user.id, productId });
    res.status(201).json({ success: true, message: "Added to wishlist", data: item });
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    await WishlistItem.deleteOne({ _id: req.params.itemId, userId: req.user.id });
    res.json({ success: true, message: "Removed from wishlist", data: null });
  } catch (err) { next(err); }
};


