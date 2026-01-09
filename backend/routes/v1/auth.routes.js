const express = require("express");
const router = express.Router();
const authController = require("../../controllers/authController");
const authMiddleware = require("../../middlewares/authMiddleware");

// Authentication
router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/forgot-password", authController.forgotPassword);
router.post("/verify-otp", authController.verifyOTP);
router.post("/reset-password", authController.resetPassword);

// Seller Profile Creation (Authenticated)
router.post("/create-seller", authMiddleware, authController.createSellerProfile);
router.post("/seller-payment-details", authMiddleware, authController.updatePaymentDetails);
router.post("/seller-kyc", authMiddleware, authController.submitKYC);
router.get("/seller-profile", authMiddleware, authController.getSellerProfile);

// User Profile
router.get("/profile", authMiddleware, authController.profile);
router.patch("/profile", authMiddleware, authController.updateProfile);

// Address Management
router.get("/addresses", authMiddleware, authController.getAddresses);
router.post("/addresses", authMiddleware, authController.addAddress);
router.put("/addresses/:index", authMiddleware, authController.updateAddressByIndex); // From users.js
router.patch("/addresses/:index", authMiddleware, authController.updateAddressByIndex); // From auth.js
router.delete("/addresses/:index", authMiddleware, authController.deleteAddressByIndex);

module.exports = router;
