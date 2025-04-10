const mongoose = require('mongoose');

const interactionSchema = new mongoose.Schema({
    buyer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Buyer', required: true },
    product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    interactedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Interaction', interactionSchema);
