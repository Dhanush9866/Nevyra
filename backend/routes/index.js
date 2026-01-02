const express = require("express");
const router = express.Router();

router.use("/auth", require("./auth"));
router.use("/seller", require("./seller")); // Moved up for priority
router.use("/products", require("./products"));
router.use("/categories", require("./categories"));
router.use("/cart", require("./cart"));
router.use("/orders", require("./orders"));
router.use("/users", require("./users"));
router.use("/admins", require("./admins"));
router.use("/payments", require("./payments"));
console.log('Loading upload routes...');
router.use("/upload", require("./upload"));
console.log('Upload routes loaded');
console.log('Upload routes loaded');
router.use("/dashboard", require("./dashboard"));
router.use("/contact", require("./contact"));
// router.use("/seller", require("./seller")); // Removed duplicate

module.exports = router;
