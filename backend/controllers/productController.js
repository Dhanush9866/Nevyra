const { Product, Category } = require("../models");
const paginate = require("../utils/pagination");

exports.list = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, category, search } = req.query;
    const where = {};
    if (category) where.categoryId = category;
    if (search) where.name = { $iLike: `%${search}%` };
    const products = await Product.findAndCountAll(
      paginate({ where, include: [Category] }, { page: +page, limit: +limit })
    );
    res.json({ success: true, message: "Products fetched", data: products });
  } catch (err) {
    next(err);
  }
};

exports.details = async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [Category],
    });
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
    const { name, price, description, imageUrl, stock, categoryId } = req.body;
    if (!name || !price || !categoryId)
      return res
        .status(400)
        .json({
          success: false,
          message: "Missing required fields",
          data: null,
        });
    const product = await Product.create({
      name,
      price,
      description,
      imageUrl,
      stock,
      categoryId,
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
    await product.update(req.body);
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
