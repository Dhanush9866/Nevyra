const Admin = require("../models/Admin");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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
    const token = jwt.sign(
      { id: admin._id, email: admin.email, isAdmin: true },
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
