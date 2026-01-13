const express = require("express");
const router = express.Router();

router.use("/auth", require("./auth.routes"));
router.use("/products", require("./product.routes"));
router.use("/seller", require("./seller.routes"));
router.use("/cart", require("./cart.routes"));
router.use("/orders", require("./order.routes"));
router.use("/payments", require("./payment.routes"));
router.use("/upload", require("./upload.routes"));
router.use("/reviews", require("./review.routes"));
router.use("/categories", require("./category.routes"));
router.use("/admin", require("./admin.routes"));
router.use("/admins", require("./admin.routes")); // Alias for backward compatibility
router.use("/contact", require("./contact.routes"));
router.use("/users", require("./user.routes"));
router.use("/settings", require("./settings.routes"));

// Dashboard routes (to maintain /api/dashboard/... compatibility)
const dashboardController = require("../../controllers/dashboardController");
const authMiddleware = require("../../middlewares/authMiddleware");
const adminMiddleware = require("../../middlewares/adminMiddleware");

router.get("/dashboard/stats", authMiddleware, adminMiddleware, dashboardController.getDashboardStats);
router.get("/dashboard/quick-stats", authMiddleware, adminMiddleware, dashboardController.getQuickStats);

module.exports = router;
