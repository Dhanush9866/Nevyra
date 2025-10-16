const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const wishlistController = require("../controllers/wishlistController");
const authMiddleware = require("../middlewares/authMiddleware");

router.get("/profile", authMiddleware, authController.profile);
router.get("/addresses", authMiddleware, authController.getAddresses);
router.post("/addresses", authMiddleware, authController.addAddress);
router.put("/addresses/:index", authMiddleware, authController.updateAddressByIndex);
router.delete("/addresses/:index", authMiddleware, authController.deleteAddressByIndex);

// Wishlist
router.get("/wishlist", authMiddleware, wishlistController.list);
router.post("/wishlist", authMiddleware, wishlistController.add);
router.delete("/wishlist/:itemId", authMiddleware, wishlistController.remove);

module.exports = router;
