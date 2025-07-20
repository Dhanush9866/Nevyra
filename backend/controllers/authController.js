const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../models");
const { isEmail, isStrongPassword } = require("../utils/validators");

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
    const existing = await User.findOne({ where: { email } });
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
      const existingPhone = await User.findOne({ where: { phone } });
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
    const user = await User.create({ firstName, lastName, phone, email, password: hashed, address });
    return res
      .status(201)
      .json({
        success: true,
        message: "User registered",
        data: { id: user.id, firstName: user.firstName, lastName: user.lastName, email: user.email, phone: user.phone },
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
    const user = await User.findOne({ where: { email } });
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
      { id: user.id, email: user.email, isAdmin: user.isAdmin },
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
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ["password"] },
    });
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
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found", data: null });
    }
    if (firstName !== undefined) user.firstName = firstName;
    if (lastName !== undefined) user.lastName = lastName;
    if (phone !== undefined && phone !== user.phone) {
      // Check for duplicate phone
      const existingPhone = await User.findOne({ where: { phone } });
      if (existingPhone && existingPhone.id !== user.id) {
        return res.status(409).json({ success: false, message: "Phone number already exists", data: null });
      }
      user.phone = phone;
    }
    if (email !== undefined && email !== user.email) {
      // Validate email format
      if (!isEmail(email)) {
        return res.status(400).json({ success: false, message: "Invalid email format", data: null });
      }
      // Check for duplicate email
      const existing = await User.findOne({ where: { email } });
      if (existing && existing.id !== user.id) {
        return res.status(409).json({ success: false, message: "Email already in use", data: null });
      }
      user.email = email;
    }
    await user.save();
    const userData = user.toJSON();
    delete userData.password;
    return res.json({ success: true, message: "Profile updated", data: userData });
  } catch (err) {
    next(err);
  }
};
