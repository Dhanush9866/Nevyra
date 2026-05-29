const Admin = require("../models/Admin");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

// ---------- helpers ----------
function generateAccessToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET || "secretToken", {
    expiresIn: "15m",
  });
}

function generateRefreshToken() {
  return crypto.randomBytes(40).toString("hex");
}

// ---------- login (with refresh token) ----------
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password required" });
    }
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }
    const match = await bcrypt.compare(password, admin.password);
    if (!match) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    // Generate short-lived access token (15 min)
    const accessToken = generateAccessToken({
      id: admin._id,
      email: admin.email,
      isAdmin: true,
    });

    // Generate refresh token (7 days) and hash it for DB storage
    const rawRefreshToken = generateRefreshToken();
    const hashedRefreshToken = await bcrypt.hash(rawRefreshToken, 10);
    admin.refreshToken = hashedRefreshToken;
    admin.refreshTokenExpires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    await admin.save();

    return res.json({
      success: true,
      message: "Login successful",
      data: {
        token: accessToken,
        accessToken,
        refreshToken: rawRefreshToken,
        expiresIn: 900,
      },
    });
  } catch (err) {
    next(err);
  }
};

// ---------- admin refresh token ----------
exports.refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ success: false, message: "Refresh token is required" });
    }

    const admins = await Admin.find({
      refreshTokenExpires: { $gt: new Date() },
      refreshToken: { $ne: null },
    });

    let matchedAdmin = null;
    for (const a of admins) {
      const isMatch = await bcrypt.compare(refreshToken, a.refreshToken);
      if (isMatch) {
        matchedAdmin = a;
        break;
      }
    }

    if (!matchedAdmin) {
      return res.status(401).json({ success: false, message: "Invalid or expired refresh token" });
    }

    const accessToken = generateAccessToken({
      id: matchedAdmin._id,
      email: matchedAdmin.email,
      isAdmin: true,
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

// ---------- admin logout ----------
exports.logout = async (req, res, next) => {
  try {
    if (req.user) {
      const admin = await Admin.findById(req.user.id);
      if (admin) {
        admin.refreshToken = undefined;
        admin.refreshTokenExpires = undefined;
        await admin.save();
      }
    } else if (req.body.refreshToken) {
      const admins = await Admin.find({ refreshToken: { $ne: null } });
      for (const a of admins) {
        const isMatch = await bcrypt.compare(req.body.refreshToken, a.refreshToken);
        if (isMatch) {
          a.refreshToken = undefined;
          a.refreshTokenExpires = undefined;
          await a.save();
          break;
        }
      }
    }
    return res.json({ success: true, message: "Logged out successfully" });
  } catch (err) {
    next(err);
  }
};

// Update password endpoint
exports.updatePassword = async (req, res, next) => {
  try {
    const adminId = req.user.id;
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: "Current and new password required" });
    }
    const admin = await Admin.findById(adminId);
    if (!admin) {
      return res.status(404).json({ success: false, message: "Admin not found" });
    }
    const match = await bcrypt.compare(currentPassword, admin.password);
    if (!match) {
      return res.status(401).json({ success: false, message: "Current password is incorrect" });
    }
    admin.password = await bcrypt.hash(newPassword, 10);
    await admin.save();
    res.json({ success: true, message: "Password updated successfully" });
  } catch (err) {
    next(err);
  }
};

exports.verifySeller = async (req, res, next) => {
  try {
    const { sellerId } = req.params;
    const { status } = req.body; // 'verified' or 'rejected'

    if (!['verified', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status. Use verified or rejected.' });
    }

    const { Seller } = require('../models');
    const seller = await Seller.findById(sellerId).populate('user');

    if (!seller) {
      return res.status(404).json({ success: false, message: 'Seller not found' });
    }

    seller.verificationStatus = status;
    seller.isVerified = status === 'verified';
    await seller.save();

    if (status === 'verified' && seller.user) {
      const { sendVerificationEmail } = require('../utils/emailService');

      try {
        await sendVerificationEmail(seller.user.email, `${seller.user.firstName} ${seller.user.lastName}`);
      } catch (emailErr) {
        console.error('Failed to send verification email:', emailErr);
      }
    }

    return res.json({ success: true, message: `Seller ${status} successfully`, data: seller });

  } catch (err) {
    next(err);
  }
};

exports.getPendingSellers = async (req, res, next) => {
  try {
    const { Seller } = require('../models');
    // Fetch sellers where verificationStatus is 'pending', populate user details
    const pendingSellers = await Seller.find({ verificationStatus: 'pending' })
      .populate('user', 'firstName lastName email mobile')
      .sort({ createdAt: -1 }); // Newest first

    return res.json({
      success: true,
      count: pendingSellers.length,
      data: pendingSellers
    });
  } catch (err) {
    next(err);
  }
};

exports.getAllSellers = async (req, res, next) => {
  try {
    const { Seller } = require('../models');
    const sellers = await Seller.find()
      .populate('user', 'firstName lastName email mobile')
      .sort({ createdAt: -1 });
    res.json({ success: true, count: sellers.length, data: sellers });
  } catch (err) { next(err); }
};

exports.getAllPayouts = async (req, res, next) => {
  try {
    const { Payout } = require('../models');
    // Populate seller info deeply
    const payouts = await Payout.find()
      .populate({
        path: 'sellerId',
        select: 'storeName bankDetails walletBalance', // Select specific fields from seller
        populate: { path: 'user', select: 'firstName lastName email mobile' } // User info
      })
      .sort({ createdAt: -1 });
    
    res.json({ success: true, count: payouts.length, data: payouts });
  } catch (err) { next(err); }
};

exports.updatePayoutStatus = async (req, res, next) => {
  try {
    const { Payout, Seller } = require('../models');
    const { id } = req.params;
    const { status, transactionId, notes } = req.body; // Status: Paid, Failed, Processing

    const payout = await Payout.findById(id);
    if (!payout) return res.status(404).json({ success: false, message: "Payout request not found" });

    // Handle Refund if failing a request
    if ((status === 'Failed' || status === 'Rejected') && payout.status !== 'Failed' && payout.status !== 'Rejected') {
        // Refund the amount to seller wallet
        await Seller.findByIdAndUpdate(payout.sellerId, { $inc: { walletBalance: payout.amount } });
    }

    payout.status = status;
    if (transactionId) payout.transactionId = transactionId;
    if (notes) payout.notes = notes;
    if (status === 'Paid' || status === 'Failed') payout.processedAt = new Date();
    
    await payout.save();

    res.json({ success: true, message: `Payout marked as ${status}`, data: payout });
  } catch (err) { next(err); }
};
