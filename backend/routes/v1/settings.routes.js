const express = require("express");
const router = express.Router();
const Settings = require("../../models/Settings");
const authMiddleware = require("../../middlewares/authMiddleware");

// Get settings
router.get("/", async (req, res) => {
    try {
        let settings = await Settings.findOne();
        if (!settings) {
            // Create default settings if not exists
            settings = await Settings.create({ heroBanners: [] });
        }
        res.json({ success: true, data: settings });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Update hero banners
router.put("/hero-banners", authMiddleware, async (req, res) => {
    try {
        const { heroBanners } = req.body;
        let settings = await Settings.findOne();
        if (!settings) {
            settings = new Settings();
        }
        settings.heroBanners = heroBanners;
        await settings.save();
        res.json({ success: true, data: settings, message: "Hero banners updated successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
