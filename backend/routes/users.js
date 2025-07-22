const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware");

router.get("/profile", authMiddleware, authController.profile);
router.get("/addresses", authMiddleware, authController.getAddresses);
router.post("/addresses", authMiddleware, authController.addAddress);

module.exports = router;
