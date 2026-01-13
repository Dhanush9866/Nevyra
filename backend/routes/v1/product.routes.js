const express = require("express");
const router = express.Router();
const productController = require("../../controllers/productController");
const authMiddleware = require("../../middlewares/authMiddleware");
const adminMiddleware = require("../../middlewares/adminMiddleware");

router.get("/", productController.list);
router.get("/all", productController.getAll);
router.get("/by-subcategories", productController.listByMultipleSubcategories);
router.get("/popular-searches", productController.getPopularSearches);
router.get("/top-deals", productController.getTopDeals);
router.get("/:id", productController.details);
router.get("/:id/similar", productController.getSimilarProducts);

router.post("/", authMiddleware, adminMiddleware, productController.create);
router.put("/:id", authMiddleware, adminMiddleware, productController.update);
router.delete("/:id", authMiddleware, adminMiddleware, productController.remove);

module.exports = router;
