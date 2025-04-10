const mongoose = require('mongoose');

const interactionSchema = new mongoose.Schema({
  buyer_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Buyer',
    required: true
  },
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  interaction_value: {
    type: Number,
    default: 1 
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const Interaction = mongoose.model('Interaction', interactionSchema);

module.exports = Interaction;
