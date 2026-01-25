const { Review, Product, Order, OrderItem } = require("../models");

exports.create = async (req, res, next) => {
  try {
    const { rating, title, comment, images } = req.body;
    const { productId } = req.params;
    const userId = req.user.id;

    if (!rating || !comment) {
      return res.status(400).json({
        success: false,
        message: "Rating and comment are required",
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Check if user already reviewed this product
    const existingReview = await Review.findOne({ user: userId, product: productId });
    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this product",
      });
    }

    const review = new Review({
      user: userId,
      product: productId,
      rating,
      title,
      comment,
      images,
    });

    await review.save();

    // Update product rating and review count
    const reviews = await Review.find({ product: productId });
    const reviewsCount = reviews.length;
    const averageRating = reviews.reduce((acc, item) => item.rating + acc, 0) / reviewsCount;

    product.rating = averageRating.toFixed(1);
    product.reviews = reviewsCount;
    await product.save();

    res.status(201).json({
      success: true,
      message: "Review submitted successfully",
      data: review,
    });
  } catch (err) {
    next(err);
  }
};

exports.getByProduct = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const reviews = await Review.find({ product: productId })
      .populate("user", "firstName lastName")
      .sort("-createdAt");

    res.json({
      success: true,
      message: "Reviews fetched successfully",
      data: reviews,
    });
  } catch (err) {
    next(err);
  }
};

exports.getByUser = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const reviews = await Review.find({ user: userId })
      .populate("product")
      .sort("-createdAt");

    res.json({
      success: true,
      message: "User reviews fetched successfully",
      data: reviews,
    });
  } catch (err) {
    next(err);
  }
};

exports.getPending = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // 1. Get all delivered orders for the user
    const orders = await Order.find({
      userId: userId,
      status: { $in: ['Delivered', 'delivered'] }
    });

    const orderIds = orders.map(o => o._id);

    // 2. Get all OrderItems for these orders
    const orderItems = await OrderItem.find({
      orderId: { $in: orderIds }
    }).populate("productId");

    // 3. Extract unique product IDs from these items
    const purchasedProductIds = [];
    const productMap = new Map();

    orderItems.forEach(item => {
      if (item.productId && item.productId._id) {
        const pid = item.productId._id.toString();
        if (!productMap.has(pid)) {
          productMap.set(pid, item.productId);
          purchasedProductIds.push(item.productId._id);
        }
      }
    });

    // 3. Get all reviews by this user for these products
    const existingReviews = await Review.find({
      user: userId,
      product: { $in: purchasedProductIds }
    });

    const reviewedProductIds = new Set(
      existingReviews.map(r => r.product.toString())
    );

    // 4. Filter products that haven't been reviewed
    const pendingProducts = purchasedProductIds
      .filter(pid => !reviewedProductIds.has(pid.toString()))
      .map(pid => productMap.get(pid.toString()));

    res.json({
      success: true,
      message: "Pending reviews fetched successfully",
      data: pendingProducts,
    });
  } catch (err) {
    next(err);
  }
};

// Update a review
exports.update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rating, title, comment, images } = req.body;
    const userId = req.user.id;

    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    if (review.user.toString() !== userId && !req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this review",
      });
    }

    // Update fields
    if (rating) review.rating = rating;
    if (title !== undefined) review.title = title;
    if (comment) review.comment = comment;
    if (images) review.images = images;

    await review.save();

    // Update product rating and review count
    const productId = review.product;
    const reviews = await Review.find({ product: productId });
    const reviewsCount = reviews.length;
    const averageRating = reviews.reduce((acc, item) => item.rating + acc, 0) / reviewsCount;

    await Product.findByIdAndUpdate(productId, {
      rating: averageRating.toFixed(1),
      reviews: reviewsCount,
    });

    res.json({
      success: true,
      message: "Review updated successfully",
      data: review,
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    if (review.user.toString() !== userId && !req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this review",
      });
    }

    const productId = review.product;
    await review.deleteOne();

    // Update product rating and review count
    const reviews = await Review.find({ product: productId });
    const reviewsCount = reviews.length;
    let averageRating = 0;
    if (reviewsCount > 0) {
      averageRating = reviews.reduce((acc, item) => item.rating + acc, 0) / reviewsCount;
    }

    await Product.findByIdAndUpdate(productId, {
      rating: averageRating.toFixed(1),
      reviews: reviewsCount,
    });

    res.json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};
