const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  // Basic user schema, add fields as needed
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String },
  role: { type: String, default: 'user' }
});
module.exports = mongoose.model('User', userSchema);