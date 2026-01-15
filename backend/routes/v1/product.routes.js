const express = require("express");
const router = express.Router();
const productController = require("../../controllers/productController");
const authMiddleware = require("../../middlewares/authMiddleware");
const optionalAuthMiddleware = require("../../middlewares/optionalAuthMiddleware");
const adminMiddleware = require("../../middlewares/adminMiddleware");

router.get("/", optionalAuthMiddleware, productController.list);
router.get("/all", optionalAuthMiddleware, productController.getAll);
router.get("/by-subcategories", optionalAuthMiddleware, productController.listByMultipleSubcategories);
router.get("/popular-searches", optionalAuthMiddleware, productController.getPopularSearches);
router.get("/top-deals", optionalAuthMiddleware, productController.getTopDeals);
router.get("/:id", optionalAuthMiddleware, productController.details);
router.get("/:id/similar", optionalAuthMiddleware, productController.getSimilarProducts);

router.post("/", authMiddleware, adminMiddleware, productController.create);
router.put("/:id", authMiddleware, adminMiddleware, productController.update);
router.delete("/:id", authMiddleware, adminMiddleware, productController.remove);

module.exports = router;
