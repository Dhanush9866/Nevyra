const express = require("express");
const router = express.Router();
const adminController = require("../../controllers/adminController");
const dashboardController = require("../../controllers/dashboardController");
const authMiddleware = require("../../middlewares/authMiddleware");
const adminMiddleware = require("../../middlewares/adminMiddleware");

// Admin Auth
router.post("/login", adminController.login);
router.put("/password", authMiddleware, adminMiddleware, adminController.updatePassword);

// Seller Verification
router.get("/pending-sellers", authMiddleware, adminMiddleware, adminController.getPendingSellers);
router.get("/sellers", authMiddleware, adminMiddleware, adminController.getAllSellers);
router.patch("/verify-seller/:sellerId", authMiddleware, adminMiddleware, adminController.verifySeller);

// Payouts
router.get("/payouts", authMiddleware, adminMiddleware, adminController.getAllPayouts);
router.patch("/payouts/:id", authMiddleware, adminMiddleware, adminController.updatePayoutStatus);

// Dashboard Statistics
router.get("/dashboard/stats", authMiddleware, adminMiddleware, dashboardController.getDashboardStats);
router.get("/dashboard/quick-stats", authMiddleware, adminMiddleware, dashboardController.getQuickStats);

module.exports = router;
