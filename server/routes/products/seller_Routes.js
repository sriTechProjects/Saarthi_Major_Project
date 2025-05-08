const express = require("express");
const { GetProductsBySellerId } = require("../../controllers/seller/GetProductsBySellerId");
const { addProduct, editProduct } = require("../../controllers/seller/createProduct");
const { deleteProduct } = require("../../controllers/seller/DeleteProductById");
const router = express.Router();
const upload = require('../../config/multerSetup')

router.get("/seller/getProductsById/:seller_id", GetProductsBySellerId);
router.post("/addProduct", upload.array("images", 5), addProduct)
router.put("/editProduct", upload.array("images", 5), editProduct)
router.delete("/seller/deleteProductById/:product_id", deleteProduct)

module.exports = router;
