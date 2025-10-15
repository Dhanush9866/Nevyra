const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dashboardController");
const authMiddleware = require("../middlewares/authMiddleware");
const adminMiddleware = require("../middlewares/adminMiddleware");

// Get dashboard statistics
router.get("/stats", authMiddleware, adminMiddleware, dashboardController.getDashboardStats);

// Get quick stats for tiles
router.get("/quick-stats", authMiddleware, adminMiddleware, dashboardController.getQuickStats);

module.exports = router;
