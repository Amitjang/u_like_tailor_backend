const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  deliveryDays: { type: Number, required: true }
});
module.exports = mongoose.model('Service', serviceSchema);  
