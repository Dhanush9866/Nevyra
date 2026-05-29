const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { User } = require("../models");
const { isEmail, isStrongPassword } = require("../utils/validators");
const { sendOTPEmail } = require("../utils/emailService");

// ---------- helpers ----------
function generateAccessToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET || "secretToken", {
    expiresIn: "15m",
  });
}

function generateRefreshToken() {
  return crypto.randomBytes(40).toString("hex");
}

// ---------- register ----------
exports.register = async (req, res, next) => {
  try {
    const { firstName, lastName, email, phone, password, address } = req.body;
    if (!firstName || !lastName || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields required", data: null });
    }
    if (!isEmail(email)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email", data: null });
    }
    if (!isStrongPassword(password)) {
      return res
        .status(400)
        .json({ success: false, message: "Password too weak", data: null });
    }
    const existing = await User.findOne({ email });
    if (existing) {
      return res
        .status(409)
        .json({
          success: false,
          message: "Email already registered",
          data: null,
        });
    }
    if (phone) {
      const existingPhone = await User.findOne({ phone });
      if (existingPhone) {
        return res
          .status(409)
          .json({
            success: false,
            message: "Phone number already exists",
            data: null,
          });
      }
    }
    const hashed = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      lastName,
      phone,
      email,
      password: hashed,
      address,
    });
    await user.save();
    return res.status(201).json({
      success: true,
      message: "User registered",
      data: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
      },
    });
  } catch (err) {
    next(err);
  }
};

// ---------- login (with refresh token) ----------
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Email and password required",
          data: null,
        });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials", data: null });
    }

    // Check if user is a seller and verification status
    const { Seller } = require("../models");
    const sellerProfile = await Seller.findOne({ user: user._id });

    if (sellerProfile) {
      if (sellerProfile.verificationStatus === 'pending') {
        return res.status(403).json({ success: false, message: "Your account is currently under review. Please wait for admin approval." });
      }
      if (sellerProfile.verificationStatus === 'rejected') {
        return res.status(403).json({ success: false, message: "Your account application has been rejected. Please contact support." });
      }
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials", data: null });
    }

    // Generate short-lived access token (15 min)
    const accessToken = generateAccessToken({
      id: user._id,
      email: user.email,
      isAdmin: user.isAdmin,
    });

    // Generate refresh token (7 days) and hash it for DB storage
    const rawRefreshToken = generateRefreshToken();
    const hashedRefreshToken = await bcrypt.hash(rawRefreshToken, 10);
    user.refreshToken = hashedRefreshToken;
    user.refreshTokenExpires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    await user.save();

    return res.json({
      success: true,
      message: "Login successful",
      data: {
        token: accessToken,
        accessToken,
        refreshToken: rawRefreshToken,
        expiresIn: 900, // 15 min in seconds
      },
    });
  } catch (err) {
    next(err);
  }
};

// ---------- refresh token ----------
exports.refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res
        .status(400)
        .json({ success: false, message: "Refresh token is required" });
    }

    // Find a user whose refresh token hasn't expired
    const users = await User.find({
      refreshTokenExpires: { $gt: new Date() },
      refreshToken: { $ne: null },
    });

    // Check each user's hashed token against the provided raw token
    let matchedUser = null;
    for (const u of users) {
      const isMatch = await bcrypt.compare(refreshToken, u.refreshToken);
      if (isMatch) {
        matchedUser = u;
        break;
      }
    }

    if (!matchedUser) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid or expired refresh token" });
    }

    // Issue new access token
    const accessToken = generateAccessToken({
      id: matchedUser._id,
      email: matchedUser.email,
      isAdmin: matchedUser.isAdmin,
    });

    return res.json({
      success: true,
      message: "Token refreshed",
      data: {
        token: accessToken,
        accessToken,
        expiresIn: 900,
      },
    });
  } catch (err) {
    next(err);
  }
};

// ---------- logout ----------
exports.logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (req.user) {
      // If authenticated, clear refresh token for this user
      const user = await User.findById(req.user.id);
      if (user) {
        user.refreshToken = undefined;
        user.refreshTokenExpires = undefined;
        await user.save();
      }
    } else if (refreshToken) {
      // Fallback: find user by refresh token and clear it
      const users = await User.find({
        refreshToken: { $ne: null },
      });
      for (const u of users) {
        const isMatch = await bcrypt.compare(refreshToken, u.refreshToken);
        if (isMatch) {
          u.refreshToken = undefined;
          u.refreshTokenExpires = undefined;
          await u.save();
          break;
        }
      }
    }

    return res.json({ success: true, message: "Logged out successfully" });
  } catch (err) {
    next(err);
  }
};

// ---------- profile ----------
exports.profile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("-password -refreshToken -refreshTokenExpires");
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found", data: null });
    }
    return res.json({ success: true, message: "Profile fetched", data: user });
  } catch (err) {
    next(err);
  }
};

// ---------- updateProfile ----------
exports.updateProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { firstName, lastName, phone, email, avatar } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found", data: null });
    }
    if (firstName !== undefined) user.firstName = firstName;
    if (lastName !== undefined) user.lastName = lastName;
    if (phone !== undefined && phone !== user.phone) {
      // Check for duplicate phone
      const existingPhone = await User.findOne({ phone });
      if (
        existingPhone &&
        existingPhone._id.toString() !== user._id.toString()
      ) {
        return res
          .status(409)
          .json({
            success: false,
            message: "Phone number already exists",
            data: null,
          });
      }
      user.phone = phone;
    }
    if (email !== undefined && email !== user.email) {
      // Validate email format
      if (!isEmail(email)) {
        return res
          .status(400)
          .json({
            success: false,
            message: "Invalid email format",
            data: null,
          });
      }
      // Check for duplicate email
      const existing = await User.findOne({ email });
      if (existing && existing._id.toString() !== user._id.toString()) {
        return res
          .status(409)
          .json({
            success: false,
            message: "Email already in use",
            data: null,
          });
      }
      user.email = email;
    }
    if (avatar !== undefined) user.avatar = avatar;
    await user.save();
    const userData = user.toObject();
    delete userData.password;
    delete userData.refreshToken;
    delete userData.refreshTokenExpires;
    return res.json({
      success: true,
      message: "Profile updated",
      data: userData,
    });
  } catch (err) {
    next(err);
  }
};

// ---------- forgotPassword (graceful SMTP) ----------
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "Email not found" });
    }
    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetPasswordOTP = otp;
    user.resetPasswordOTPExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 min
    await user.save();

    // Gracefully handle SMTP failures — OTP is already saved
    try {
      await sendOTPEmail(email, otp);
      return res.json({ success: true, message: "OTP sent to your email" });
    } catch (emailErr) {
      console.error("Failed to send OTP email:", emailErr);
      return res.json({
        success: true,
        message: "OTP generated. Email delivery may be delayed — please try again or contact support.",
      });
    }
  } catch (err) {
    next(err);
  }
};

// ---------- resetPassword ----------
exports.resetPassword = async (req, res, next) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }
    const user = await User.findOne({ email });
    if (!user || !user.resetPasswordOTP || !user.resetPasswordOTPExpires) {
      return res.status(400).json({ success: false, message: "Invalid request" });
    }
    if (user.resetPasswordOTP !== otp) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }
    if (user.resetPasswordOTPExpires < new Date()) {
      return res.status(400).json({ success: false, message: "OTP expired" });
    }
    if (!isStrongPassword(newPassword)) {
      return res.status(400).json({ success: false, message: "Password too weak" });
    }
    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordOTP = undefined;
    user.resetPasswordOTPExpires = undefined;
    await user.save();
    return res.json({ success: true, message: "Password reset successful" });
  } catch (err) {
    next(err);
  }
};

// ---------- changePassword ----------
exports.changePassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user.id;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ success: false, message: "Old and new passwords are required" });
    }

    // We can enforce strong password here if we want, using same validator
    if (!isStrongPassword(newPassword)) {
      return res.status(400).json({ success: false, message: "Password is too weak. Must contain 8+ chars and diverse types." });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Incorrect old password" });
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    await user.save();

    return res.json({ success: true, message: "Password updated successfully" });
  } catch (err) {
    next(err);
  }
};



exports.createSellerProfile = async (req, res, next) => {
  try {
    const { storeName, sellerType, gstNumber, businessAddress } = req.body;
    const userId = req.user.id;

    if (!storeName) {
      return res.status(400).json({ success: false, message: "Store name is required" });
    }

    const { Seller } = require("../models");

    // Check if seller profile already exists
    let seller = await Seller.findOne({ user: userId });
    if (seller) {
      return res.status(409).json({ success: false, message: "Seller profile already exists" });
    }

    seller = new Seller({
      user: userId,
      storeName,
      sellerType,
      gstNumber,
      businessAddress
    });

    await seller.save();

    return res.status(201).json({
      success: true,
      message: "Seller profile created",
      data: seller
    });
  } catch (err) {
    console.error("Create Seller Profile Error:", err);
    return res.status(500).json({ success: false, message: err.message, stack: err.stack });
  }
};

exports.updatePaymentDetails = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { accountHolderName, accountNumber, ifscCode, cancelledCheque } = req.body;

    const { Seller } = require("../models");
    const seller = await Seller.findOne({ user: userId });

    if (!seller) {
      return res.status(404).json({ success: false, message: "Seller profile not found" });
    }

    seller.bankDetails = {
      accountHolderName,
      accountNumber,
      ifscCode,
      cancelledCheque
    };

    await seller.save();

    return res.json({ success: true, message: "Payment details updated", data: seller });
  } catch (err) {
    next(err);
  }
};

exports.submitKYC = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { panCard, addressProof, livePhoto } = req.body;

    const { Seller } = require("../models");
    const seller = await Seller.findOne({ user: userId });

    if (!seller) {
      return res.status(404).json({ success: false, message: "Seller profile not found" });
    }

    seller.kycDetails = {
      panCard,
      addressProof,
      livePhoto
    };

    // After submitting KYC, status implies pending verification
    seller.verificationStatus = "pending";

    await seller.save();

    return res.json({ success: true, message: "KYC submitted for verification", data: seller });
  } catch (err) {
    next(err);
  }
};

exports.verifyOTP = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ success: false, message: "Email and OTP are required" });
    }
    const user = await User.findOne({ email });
    if (!user || !user.resetPasswordOTP || !user.resetPasswordOTPExpires) {
      return res.status(400).json({ success: false, message: "Invalid request" });
    }
    if (user.resetPasswordOTP !== otp) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }
    if (user.resetPasswordOTPExpires < new Date()) {
      return res.status(400).json({ success: false, message: "OTP expired" });
    }
    return res.json({ success: true, message: "OTP verified" });
  } catch (err) {
    next(err);
  }
};

// ==========================================
// ADDRESS MANAGEMENT
// ==========================================

exports.getAddresses = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found", data: null });
    }
    return res.json({ success: true, message: "Addresses fetched", data: user.addresses || [] });
  } catch (err) {
    next(err);
  }
};

exports.addAddress = async (req, res, next) => {
  try {
    const { firstName, lastName, email, phone, addressLine1, addressLine2, city, state, zipCode } = req.body;
    if (!firstName || !lastName || !phone || !addressLine1 || !city || !state || !zipCode) {
      return res.status(400).json({ success: false, message: "Required address fields missing", data: null });
    }
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found", data: null });
    }
    user.addresses = user.addresses || [];
    user.addresses.push({ firstName, lastName, email, phone, addressLine1, addressLine2, city, state, zipCode });
    await user.save();
    return res.status(201).json({ success: true, message: "Address added", data: user.addresses });
  } catch (err) {
    next(err);
  }
};

// ---------- index-based (deprecated – kept for backward compatibility) ----------

// Update single address by index (DEPRECATED – use updateAddressById instead)
exports.updateAddressByIndex = async (req, res, next) => {
  try {
    const idx = parseInt(req.params.index, 10);
    const { firstName, lastName, email, phone, addressLine1, addressLine2, city, state, zipCode } = req.body;
    if (!firstName || !lastName || !phone || !addressLine1 || !city || !state || !zipCode) {
      return res.status(400).json({ success: false, message: "Required address fields missing", data: null });
    }
    const user = await User.findById(req.user.id);
    if (!user || !user.addresses || idx < 0 || idx >= user.addresses.length) {
      return res.status(404).json({ success: false, message: "Address not found", data: null });
    }
    user.addresses[idx] = { firstName, lastName, email, phone, addressLine1, addressLine2, city, state, zipCode };
    await user.save();
    return res.json({ success: true, message: "Address updated", data: user.addresses });
  } catch (err) {
    next(err);
  }
};

// Delete single address by index (DEPRECATED – use deleteAddressById instead)
exports.deleteAddressByIndex = async (req, res, next) => {
  try {
    const idx = parseInt(req.params.index, 10);
    const user = await User.findById(req.user.id);
    if (!user || !user.addresses || idx < 0 || idx >= user.addresses.length) {
      return res.status(404).json({ success: false, message: "Address not found", data: null });
    }
    user.addresses.splice(idx, 1);
    await user.save();
    return res.json({ success: true, message: "Address deleted", data: user.addresses });
  } catch (err) {
    next(err);
  }
};

// ---------- ObjectId-based (new) ----------

// Update address by its Mongoose subdocument _id
exports.updateAddressById = async (req, res, next) => {
  try {
    const { addressId } = req.params;
    const { firstName, lastName, email, phone, addressLine1, addressLine2, city, state, zipCode } = req.body;
    if (!firstName || !lastName || !phone || !addressLine1 || !city || !state || !zipCode) {
      return res.status(400).json({ success: false, message: "Required address fields missing", data: null });
    }
    const user = await User.findById(req.user.id);
    if (!user || !user.addresses) {
      return res.status(404).json({ success: false, message: "User not found", data: null });
    }
    const address = user.addresses.id(addressId);
    if (!address) {
      return res.status(404).json({ success: false, message: "Address not found", data: null });
    }
    address.firstName = firstName;
    address.lastName = lastName;
    address.email = email;
    address.phone = phone;
    address.addressLine1 = addressLine1;
    address.addressLine2 = addressLine2;
    address.city = city;
    address.state = state;
    address.zipCode = zipCode;
    await user.save();
    return res.json({ success: true, message: "Address updated", data: user.addresses });
  } catch (err) {
    next(err);
  }
};

// Delete address by its Mongoose subdocument _id
exports.deleteAddressById = async (req, res, next) => {
  try {
    const { addressId } = req.params;
    const user = await User.findById(req.user.id);
    if (!user || !user.addresses) {
      return res.status(404).json({ success: false, message: "User not found", data: null });
    }
    const address = user.addresses.id(addressId);
    if (!address) {
      return res.status(404).json({ success: false, message: "Address not found", data: null });
    }
    address.deleteOne();
    await user.save();
    return res.json({ success: true, message: "Address deleted", data: user.addresses });
  } catch (err) {
    next(err);
  }
};

// ==========================================

exports.getSellerProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { Seller } = require("../models");
    const seller = await Seller.findOne({ user: userId }).populate('user');

    if (!seller) {
      // It's possible a user is logged in but hasn't created a seller profile yet (Step 1 complete, Step 2 pending)
      return res.json({ success: true, message: "No seller profile found", data: null });
    }

    return res.json({ success: true, message: "Seller profile fetched", data: seller });
  } catch (err) {
    next(err);
  }
};
