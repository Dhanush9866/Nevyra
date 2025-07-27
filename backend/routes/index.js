const express = require("express");
const router = express.Router();

router.use("/auth", require("./auth"));
router.use("/products", require("./products"));
router.use("/categories", require("./categories"));
router.use("/cart", require("./cart"));
router.use("/orders", require("./orders"));
router.use("/users", require("./users"));
router.use("/admins", require("./admins"));
router.use("/payments", require("./payments"));

module.exports = router;
