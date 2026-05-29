const express = require("express");
const router = express.Router();
const authController = require("../../controllers/authController");
const authMiddleware = require("../../middlewares/authMiddleware");
const optionalAuthMiddleware = require("../../middlewares/optionalAuthMiddleware");

// Authentication
router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/forgot-password", authController.forgotPassword);
router.post("/verify-otp", authController.verifyOTP);
router.post("/reset-password", authController.resetPassword);
router.post("/change-password", authMiddleware, authController.changePassword);

// Refresh Token & Logout
router.post("/refresh-token", authController.refreshToken);
router.post("/logout", optionalAuthMiddleware, authController.logout);

// Seller Profile Creation (Authenticated)
router.post("/create-seller", authMiddleware, authController.createSellerProfile);
router.post("/seller-payment-details", authMiddleware, authController.updatePaymentDetails);
router.post("/seller-kyc", authMiddleware, authController.submitKYC);
router.get("/seller-profile", authMiddleware, authController.getSellerProfile);

// User Profile
router.get("/profile", authMiddleware, authController.profile);
router.patch("/profile", authMiddleware, authController.updateProfile);

// Address Management – ObjectId-based (preferred)
router.get("/addresses", authMiddleware, authController.getAddresses);
router.post("/addresses", authMiddleware, authController.addAddress);
router.patch("/addresses/by-id/:addressId", authMiddleware, authController.updateAddressById);
router.delete("/addresses/by-id/:addressId", authMiddleware, authController.deleteAddressById);

// Address Management – Index-based (DEPRECATED – kept for backward compatibility)
router.put("/addresses/:index", authMiddleware, authController.updateAddressByIndex);
router.patch("/addresses/:index", authMiddleware, authController.updateAddressByIndex);
router.delete("/addresses/:index", authMiddleware, authController.deleteAddressByIndex);

module.exports = router;
