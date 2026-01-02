const { Review, Product } = require("../models");

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
