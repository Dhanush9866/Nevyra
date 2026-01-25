const express = require("express");
const router = express.Router();
const reviewController = require("../../controllers/reviewController");
const authMiddleware = require("../../middlewares/authMiddleware");

// Get reviews for a product
router.get("/product/:productId", reviewController.getByProduct);

// Get reviews for the current user
router.get("/user", authMiddleware, reviewController.getByUser);

// Get products pending review
router.get("/pending", authMiddleware, reviewController.getPending);

// Create a review
router.post("/product/:productId", authMiddleware, reviewController.create);

// Update a review
router.put("/:id", authMiddleware, reviewController.update);

// Delete a review
router.delete("/:id", authMiddleware, reviewController.deleteReview);

module.exports = router;
