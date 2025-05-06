const mongoose = require('mongoose');

const interactionSchema = new mongoose.Schema({
  buyer_id: {
    type: String, // changed from ObjectId to String
    ref: 'Buyer',
    required: true,
  },
  product_id: {
    type: String, // changed from ObjectId to String
    ref: 'Product',
    required: true,
  },
  interaction: {
    type: Number, // optional: add if you're using interaction field (1, 2, etc.)
    default: 1
  }
});

const Interaction = mongoose.model('Interaction', interactionSchema);

module.exports = Interaction;
