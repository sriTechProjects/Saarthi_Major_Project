const Cart = require('../../models/cart');
const Product = require('../../models/products');
const Order = require('../../models/orders')
const Interaction = require('../../models/interaction'); 

// GET /cart/:buyerId
exports.getCart = async (req, res) => {
    try {
        const { buyerId } = req.params;
        const cart = await Cart.findOne({ buyerId }).populate('items.productId');

        if (!cart) return res.status(404).json({ message: 'Cart not found' });

        res.status(200).json(cart);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// POST /cart/add
exports.addToCart = async (req, res) => {
    try {
      const { buyerId, productId, quantity = 1 } = req.body;
  
      let cart = await Cart.findOne({ buyerId });
  
      if (!cart) {
        cart = new Cart({ buyerId, items: [{ productId, quantity }] });
      } else {
        const itemIndex = cart.items.findIndex(
          item => item.productId.toString() === productId
        );
  
        if (itemIndex > -1) {
          cart.items[itemIndex].quantity += quantity;
        } else {
          cart.items.push({ productId, quantity });
        }
      }
  
      // Insert or update interaction to have reward 2
      await Interaction.findOneAndUpdate(
        { buyer_id: buyerId, product_id: productId },
        { $set: { interaction: 2 } },
        { upsert: true, new: true }
      );
  
      cart.updatedAt = new Date();
      await cart.save();
  
      res.status(200).json(cart);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  
// PUT /cart/update
exports.updateQuantity = async (req, res) => {
    try {
        const { buyerId } = req.params;
        const { productId, quantity } = req.body;

        const cart = await Cart.findOne({ buyerId });
        if (!cart) return res.status(404).json({ message: 'Cart not found' });

        const item = cart.items.find(item => item.productId.toString() === productId);
        if (!item) return res.status(404).json({ message: 'Product not in cart' });

        item.quantity = quantity;
        cart.updatedAt = new Date();

        await cart.save();
        res.status(200).json(cart);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// DELETE /cart/remove
// DELETE /cart/delete/:buyerId/:productId
exports.removeFromCart = async (req, res) => {
    try {
        const { buyerId, productId } = req.params;

        const cart = await Cart.findOne({ buyerId });
        if (!cart) return res.status(404).json({ message: 'Cart not found' });

        cart.items = cart.items.filter(item => item.productId.toString() !== productId);
        cart.updatedAt = new Date();

        await cart.save();
        res.status(200).json(cart);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.checkOut = async (req, res) => {
  try {
    const { checkoutData, cartItems, buyerId, totalPayable } = req.body;

    if (!checkoutData || !checkoutData.address || !checkoutData.payment || !cartItems || !buyerId || !totalPayable) {
      return res.status(400).json({ message: "Incomplete checkout data." });
    }
    console.log(checkoutData.payment.selectedMethod)
    // Convert cartItems to order items with priceAtPurchase
    const items = await Promise.all(cartItems.map(async (item) => {
      const product = await Product.findById(item.productId._id);
      if (!product) {
        throw new Error(`Product not found: ${item._id}`);
      }

      await Interaction.findOneAndUpdate(
        { buyer_id: buyerId, product_id: item.productId._id },
        { $set: { interaction: 3 } },
        { upsert: true, new: true }
      );

      const unitPrice = product.unit_price;
      const discount = product.discount || 0;

      const discountedPrice = unitPrice - (discount * unitPrice) / 100;
      const totalPriceForItem = parseFloat((item.quantity * discountedPrice).toFixed(2));



      return {
        productId: product._id,
        quantity: item.quantity,
        priceAtPurchase: totalPriceForItem
      };
    }));

    const order = new Order({
      buyerId,
      items,
      totalPrice: checkoutData.payment.totalPayable,
      shippingAddress: checkoutData.address,
      paymentMethod: checkoutData.payment.selectedMethod,
      paymentStatus: "pending"
    });

    const savedOrder = await order.save();

    res.status(201).json({
      message: "Order placed successfully",
      orderId: savedOrder._id,
      order: savedOrder
    });

  } catch (error) {
    console.error("Checkout error:", error.message);
    res.status(500).json({ message: error.message || "Server error during checkout." });
  }
};



