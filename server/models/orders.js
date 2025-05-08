// models/Order.js
const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  priceAtPurchase: {
    type: Number,
    required: true
  },
});

const orderSchema = new mongoose.Schema({
  buyerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Buyer",
    required: true
  },
  items: [orderItemSchema],

  totalPrice: {
    type: Number,
    required: true
  },

  shippingAddress: {
    name: { type: String, required: true },
    phoneNo: { type: String, required: true },
    pinCode: { type: String, required: true },
    locality: { type: String },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    landmark: { type: String },
    alternateMobile: { type: String },
    type: { type: String, enum: ["Home", "Work", "Other"], default: "Home" }
  },
  
  orderDate: {
    type: Date,
    default: Date.now
  },

  status: {
    type: String,
    enum: ["placed", "shipped", "delivered", "cancelled"],
    default: "placed"
  },

  paymentMethod: {
    type: String,
    enum: ["COD", "UPI", "Netbanking", "Card"],
    required: true
  },

  paymentStatus: {
    type: String,
    enum: ["pending", "paid", "failed"],
    default: "pending"
  },

  deliveryDate: {
    type: Date,
    default: () => new Date(Date.now() + 4 * 24 * 60 * 60 * 1000) 
  }  
});

module.exports = mongoose.model("Order", orderSchema);
