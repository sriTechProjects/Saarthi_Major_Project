const express = require("express");
const { GetProductsBySellerId } = require("../../controllers/seller/GetProductsBySellerId");
const { addProduct } = require("../../controllers/seller/createProduct");
const router = express.Router();

router.get("/seller/getProductsById/:seller_id", GetProductsBySellerId);
router.post("/seller/create", addProduct)

module.exports = router;
