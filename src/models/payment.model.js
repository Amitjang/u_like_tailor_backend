const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  orderId: { type: String, required: true },
  customerId: { type: String, required: true },
  amount: { type: Number, required: true },
  mode: { type: String, required: true },
  note: { type: String },
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Payment', paymentSchema);