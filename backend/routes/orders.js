const express = require("express");
const router = express.Router();
const { authMiddleware, adminMiddleware } = require("../middlewares");
const {
  createOrder,
  getUserOrders,
  getOrderById,
  cancelOrder,
  updateOrderStatus,
  getAllOrders,
} = require("../controllers/orderController");

// User routes (require authentication)
router.post("/", authMiddleware, createOrder);
router.get("/user", authMiddleware, getUserOrders);
router.get("/:orderId", authMiddleware, getOrderById);
router.patch("/:orderId/cancel", authMiddleware, cancelOrder);

// Admin routes (require admin authentication)
router.get("/admin/all", authMiddleware, adminMiddleware, getAllOrders);
router.patch("/:orderId/status", authMiddleware, adminMiddleware, updateOrderStatus);

module.exports = router;
