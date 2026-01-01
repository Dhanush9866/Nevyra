const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const authMiddleware = require("../middlewares/authMiddleware");
const adminMiddleware = require("../middlewares/adminMiddleware");

router.post("/login", adminController.login);
router.put("/password", authMiddleware, adminMiddleware, adminController.updatePassword);
router.patch("/verify-seller/:sellerId", authMiddleware, adminMiddleware, adminController.verifySeller);
router.get("/pending-sellers", authMiddleware, adminMiddleware, adminController.getPendingSellers);

module.exports = router; 