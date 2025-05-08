const Cart = require('../../models/cart');
const Product = require('../../models/products');
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

