const express = require('express');
const router = express.Router();
const cartController = require('../../controllers/buyer/cartController');

router.get('/:buyerId', cartController.getCart);
router.post('/add', cartController.addToCart);
router.patch("/update/:buyerId", cartController.updateQuantity);
router.delete("/delete/:buyerId/:productId", cartController.removeFromCart);
router.post("/checkout",cartController.checkOut);

module.exports = router;
