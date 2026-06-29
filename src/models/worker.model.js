const mongoose = require("mongoose");
const workerSchema = new mongoose.Schema({
  workerId: {
    type: String,
    required: true,
    unique: true,
  },
  name: String,
  nameHi: String,
  phone: String,
  avatarColor: String,
  initials: String,
  photo: {
      type: String,
      default: "",
    },
  status: {
    type: String,
    enum: ["active", "free"],
    default: "free",
  },
  specialization: String,
  specializationHi: String,
  assignedOrders: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
    },
  ],
});
module.exports = mongoose.model("Worker", workerSchema);