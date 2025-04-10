const express = require("express");
const { GetProductsBySellerId } = require("../../controllers/seller/GetProductsBySellerId");
const router = express.Router();

router.get("/seller/getProductsById/:seller_id", GetProductsBySellerId);

module.exports = router;
