const mongoose = require('mongoose');
const { userSchema, serviceSchema } = require("../data/store");

const orderSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  customerId: { type: String, required: true },
  customerName: { type: String, required: true },
  phone: { type: String, required: true },
  serviceId: { type: String, required: true },
  dressType: { type: String, required: true },
  status: { type: String, required: true },
  deadline: { type: Date, required: true },
  totalAmount: { type: Number, required: true },
  paidAmount: { type: Number, required: true },
  workerId: { type: String },
  measurements: {
    chest: { type: Number },
    waist: { type: Number },
    length: { type: Number }
  },
  address: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Order', orderSchema);