const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const authMiddleware = require("../middlewares/authMiddleware");
const adminMiddleware = require("../middlewares/adminMiddleware");

// User routes
router.post("/", authMiddleware, orderController.create);
router.get("/", authMiddleware, orderController.list);
router.get("/:id", authMiddleware, orderController.details);
router.patch("/:id/status", authMiddleware, orderController.updateStatus);
router.post("/:id/return", authMiddleware, orderController.requestReturn);
router.patch("/:id/return-status", authMiddleware, adminMiddleware, orderController.updateReturnStatus); // Using adminMiddleware as minimal protection for now, assuming seller has similar access or this is shared

// Admin routes
router.get("/admin/all", authMiddleware, adminMiddleware, orderController.adminList);

module.exports = router;
