const express = require("express");
const { GetProductsBySellerId, AddNewProduct } = require("../../controllers/seller/GetProductsBySellerId");
const router = express.Router();

router.get("/seller/getProductsById/:seller_id", GetProductsBySellerId);
router.post("/addProduct", AddNewProduct)

module.exports = router;
