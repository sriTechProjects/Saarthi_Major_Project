const express = require("express");
const { getProducts, getCategoryProductsWithFilters } = require("../../controllers/buyer/products");
const {productDetails} = require("../../controllers/buyer/productDetails");
const router = express.Router();

router.get("/:category", getProducts);
router.get("/:category/filter", getCategoryProductsWithFilters);
router.get("/:category/:productId", productDetails);

module.exports = router;