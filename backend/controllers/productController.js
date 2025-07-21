const { Product } = require("../models");
const { validateAttributes } = require("../utils/validateAttributes");

exports.list = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, category, search } = req.query;
    const where = {};
    if (category) where.category = category;
    if (search) where.title = { $iLike: `%${search}%` };
    const offset = (parseInt(page) - 1) * parseInt(limit);
    const { count, rows } = await Product.findAndCountAll({
      where,
      offset,
      limit: parseInt(limit),
      attributes: [
        "id",
        "title",
        "price",
        "category",
        "subCategory",
        "images",
        "inStock",
        "rating",
        "reviews",
        "stockQuantity",
        "soldCount",
        "attributes",
      ],
    });
    res.json({
      success: true,
      message: "Products fetched",
      data: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / limit),
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.details = async (req, res, next) => {
  console.log(req.params.id);
  
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product)
      return res
        .status(404)
        .json({ success: false, message: "Product not found", data: null });
    res.json({ success: true, message: "Product details", data: product });
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const {
      title,
      price,
      category,
      subCategory,
      images,
      inStock,
      rating,
      reviews,
      stockQuantity,
      soldCount,
      attributes,
    } = req.body;
    if (!title || !price || !category || !attributes || !images || !subCategory)
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
        data: null,
      });
    if (!validateAttributes(category, attributes)) {
      return res.status(400).json({
        success: false,
        message: "Invalid attributes for category",
        data: null,
      });
    }
    const product = await Product.create({
      title,
      price,
      category,
      subCategory,
      images,
      inStock,
      rating,
      reviews,
      stockQuantity,
      soldCount,
      attributes,
    });
    res
      .status(201)
      .json({ success: true, message: "Product created", data: product });
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product)
      return res
        .status(404)
        .json({ success: false, message: "Product not found", data: null });
    const {
      title,
      price,
      category,
      subCategory,
      images,
      inStock,
      rating,
      reviews,
      stockQuantity,
      soldCount,
      attributes,
    } = req.body;
    if (category && attributes && !validateAttributes(category, attributes)) {
      return res.status(400).json({
        success: false,
        message: "Invalid attributes for category",
        data: null,
      });
    }
    await product.update({
      title,
      price,
      category,
      subCategory,
      images,
      inStock,
      rating,
      reviews,
      stockQuantity,
      soldCount,
      attributes,
    });
    res.json({ success: true, message: "Product updated", data: product });
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product)
      return res
        .status(404)
        .json({ success: false, message: "Product not found", data: null });
    await product.destroy();
    res.json({ success: true, message: "Product deleted", data: null });
  } catch (err) {
    next(err);
  }
};

exports.getAll = async (req, res, next) => {
  try {
    const products = await Product.findAll();
    res.json({
      success: true,
      message: "All products fetched",
      data: products,
    });
  } catch (err) {
    next(err);  
  }
};
