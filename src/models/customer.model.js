const mongoose = require('mongoose');
const customerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  tag: { type: String },
  notes: { type: String },
  measurements: {
    shoulder: { type: Number },
    chest: { type: Number },
    waist: { type: Number },
    hip: { type: Number },
    sleeve: { type: Number },
    kurtiLength: { type: Number }
  }
});
module.exports = mongoose.model('Customer', customerSchema);