const express = require("express");
const router = express.Router();
const sellerController = require("../../controllers/sellerController");
const authMiddleware = require("../../middlewares/authMiddleware");

// All routes require authentication
router.use(authMiddleware);

// Test route
router.get("/ping", (req, res) => res.send("pong"));

// Product Management
router.post("/products", sellerController.createProduct);
router.get("/products", sellerController.getMyProducts);
router.put("/products/:id", sellerController.updateMyProduct);
router.delete("/products/:id", sellerController.deleteMyProduct);

// Order Management
router.get("/orders", sellerController.getMyOrders);
router.put("/orders/:id/status", sellerController.updateOrderStatus);
router.put("/orders/:id/return-status", sellerController.updateReturnStatus);

// Payouts & Wallet
router.get("/wallet", sellerController.getWallet);
router.post("/request-payout", sellerController.requestPayout);
router.get("/payouts", sellerController.getPayouts);
router.put("/bank-details", sellerController.updateBankDetails);

// Inventory
router.get("/inventory/stats", sellerController.getInventoryStats);

// Dashboard
router.get("/dashboard/stats", sellerController.getDashboardStats);

module.exports = router;
