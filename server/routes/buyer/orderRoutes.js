const express = require("express");
const { getOrderById } = require("../../controllers/buyer/ordersController");
const router = express.Router();

router.get('/getOrders/:customer_id', getOrderById);
module.exports = router