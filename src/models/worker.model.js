const mongoose = require('mongoose');

const workerSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  specialization: { type: String, required: true },
  status: { type: String, required: true },
  assignedOrderIds: [{ type: String }]
});
module.exports = mongoose.model('Worker', workerSchema);