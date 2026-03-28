const mongoose = require("mongoose");
const { CartItem, Product } = require("../models");

const getVariantDetails = (product, selectedFeatures) => {
  let price = product.price;
  let image = product.images && product.images.length > 0 ? product.images[0] : null;

  // Convert selectedFeatures to plain object if it's a Map
  const featuresObj = selectedFeatures instanceof Map ? Object.fromEntries(selectedFeatures) : selectedFeatures || {};

  if (product.variantCombinations && Array.isArray(product.variantCombinations) && Object.keys(featuresObj).length > 0) {
    const combo = product.variantCombinations.find(c => {
      const comboAttrs = c.attributes instanceof Map ? Object.fromEntries(c.attributes) : c.attributes;
      if (!comboAttrs) return false;
      return Object.entries(comboAttrs).every(([k, v]) => String(featuresObj[k]) === String(v));
    });
    if (combo) {
      if (combo.price) price = combo.price;
      if (combo.images && combo.images.length > 0) image = combo.images[0];
    }
  }
  return { price, image };
};

exports.list = async (req, res, next) => {
  try {
    const items = await CartItem.find({ userId: req.user.id }).populate(
      "productId"
    );

    // Map items to include resolved price and image
    const data = items.map(item => {
      const itemObj = item.toObject();
      if (item.productId) {
        const { price, image } = getVariantDetails(item.productId, item.selectedFeatures);
        itemObj.resolvedPrice = price;
        itemObj.resolvedImage = image;
      }
      return itemObj;
    });

    res.json({ success: true, message: "Cart items fetched", data });
  } catch (err) {
    next(err);
  }
};

exports.add = async (req, res, next) => {
  try {
    const { productId, quantity, selectedFeatures } = req.body;
    if (!productId || !quantity)
      return res
        .status(400)
        .json({
          success: false,
          message: "Product and quantity required",
          data: null,
        });

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(404).json({
        success: false,
        message: "Product not found (Invalid ID)",
        data: null,
      });
    }

    // Check if item with same product and features already exists
    let item = await CartItem.findOne({
      userId: req.user.id,
      productId,
      selectedFeatures: selectedFeatures || new Map()
    });

    // Find product to get variant image
    const product = await Product.findById(productId);
    const { image: variantImage } = product ? getVariantDetails(product, selectedFeatures) : { image: null };

    if (item) {
      item.quantity += quantity;
      item.variantImage = variantImage; // Update image just in case
      await item.save();
    } else {
      item = new CartItem({
        userId: req.user.id,
        productId,
        quantity,
        selectedFeatures: selectedFeatures || new Map(),
        variantImage
      });
      await item.save();
    }
    res
      .status(201)
      .json({ success: true, message: "Item added to cart", data: item });
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const { quantity } = req.body;
    if (!mongoose.Types.ObjectId.isValid(req.params.itemId)) {
      return res.status(404).json({ success: false, message: "Cart item not found (Invalid ID)", data: null });
    }
    const item = await CartItem.findOne({
      _id: req.params.itemId,
      userId: req.user.id,
    });
    if (!item)
      return res
        .status(404)
        .json({ success: false, message: "Cart item not found", data: null });
    item.quantity = quantity;
    await item.save();
    res.json({ success: true, message: "Cart item updated", data: item });
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.itemId)) {
      return res.status(404).json({ success: false, message: "Cart item not found (Invalid ID)", data: null });
    }
    const item = await CartItem.findOne({
      _id: req.params.itemId,
      userId: req.user.id,
    });
    if (!item)
      return res
        .status(404)
        .json({ success: false, message: "Cart item not found", data: null });
    await item.deleteOne();
    res.json({ success: true, message: "Cart item removed", data: null });
  } catch (err) {
    next(err);
  }
};
