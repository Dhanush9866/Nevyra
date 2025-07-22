const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../models");
const { isEmail, isStrongPassword } = require("../utils/validators");
const { sendOTPEmail } = require("../utils/emailService");

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
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials", data: null });
    }
    const token = jwt.sign(
      { id: user._id, email: user.email, isAdmin: user.isAdmin },
      process.env.JWT_SECRET || "secretToken",
      { expiresIn: "7d" }
    );
    return res.json({
      success: true,
      message: "Login successful",
      data: { token },
    });
  } catch (err) {
    next(err);
  }
};

exports.profile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
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

exports.updateProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { firstName, lastName, phone, email } = req.body;
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
    await user.save();
    const userData = user.toObject();
    delete userData.password;
    return res.json({
      success: true,
      message: "Profile updated",
      data: userData,
    });
  } catch (err) {
    next(err);
  }
};

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
    await sendOTPEmail(email, otp);
    return res.json({ success: true, message: "OTP sent to your email" });
  } catch (err) {
    next(err);
  }
};

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
    const { firstName, lastName, email, phone, address, city, zipCode } = req.body;
    if (!firstName || !lastName || !email || !phone || !address || !city || !zipCode) {
      return res.status(400).json({ success: false, message: "All address fields required", data: null });
    }
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found", data: null });
    }
    user.addresses = user.addresses || [];
    user.addresses.push({ firstName, lastName, email, phone, address, city, zipCode });
    await user.save();
    return res.status(201).json({ success: true, message: "Address added", data: user.addresses });
  } catch (err) {
    next(err);
  }
};
