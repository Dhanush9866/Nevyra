const express = require("express");
const router = express.Router();
const reviewController = require("../../controllers/reviewController");
const authMiddleware = require("../../middlewares/authMiddleware");

// Get reviews for a product
router.get("/product/:productId", reviewController.getByProduct);

// Create a review
router.post("/product/:productId", authMiddleware, reviewController.create);

// Delete a review
router.delete("/:id", authMiddleware, reviewController.deleteReview);

module.exports = router;
