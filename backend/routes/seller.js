const express = require("express");
const router = express.Router();
const sellerController = require("../controllers/sellerController");
const authMiddleware = require("../middlewares/authMiddleware");
console.log("Seller routes loaded");
// All routes require authentication
router.use(authMiddleware);

// Debug middleware
router.use((req, res, next) => {
    console.log("Inside seller router. URL:", req.url, "Method:", req.method);
    next();
});

// Test route
router.get("/ping", (req, res) => res.send("pong"));

// Product Management
router.post("/products", (req, res, next) => {
    console.log("POST /products matched");
    sellerController.createProduct(req, res, next);
});
router.get("/products", (req, res, next) => {
    console.log("GET /products matched");
    sellerController.getMyProducts(req, res, next);
});
router.put("/products/:id", sellerController.updateMyProduct);
router.delete("/products/:id", sellerController.deleteMyProduct);

// Order Management
router.get("/orders", sellerController.getMyOrders);
router.put("/orders/:id/status", sellerController.updateOrderStatus);

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
