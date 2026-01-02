const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware");
const authenticate = authMiddleware;

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/forgot-password", authController.forgotPassword);
router.post("/verify-otp", authController.verifyOTP);
router.post("/reset-password", authController.resetPassword);
router.post("/create-seller", authenticate, authController.createSellerProfile);
router.post("/seller-payment-details", authenticate, authController.updatePaymentDetails);
router.post("/seller-kyc", authenticate, authController.submitKYC);
router.get("/profile", authMiddleware, authController.profile);
router.patch("/profile", authMiddleware, authController.updateProfile);
router.get("/seller-profile", authenticate, authController.getSellerProfile);

// Address management routes
router.get("/addresses", authMiddleware, authController.getAddresses);
router.post("/addresses", authMiddleware, authController.addAddress);
router.patch("/addresses/:index", authMiddleware, authController.updateAddressByIndex);
router.delete("/addresses/:index", authMiddleware, authController.deleteAddressByIndex);

module.exports = router;
