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

// Example JSON for API testing
/*
{
  "name": "John Doe",
  "phone": "+1234567890",
  "address": "123 Main Street, City, Country",
  "tag": "VIP",
  "notes": "Prefers cotton fabrics",
  "measurements": {
    "shoulder": 42,
    "chest": 38,
    "waist": 32,
    "hip": 36,
    "sleeve": 24,
    "kurtiLength": 48
  }
}
*/