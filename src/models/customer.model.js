// const mongoose = require('mongoose');
// const customerSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   phone: { type: String, required: true },
//   address: { type: String, required: true },
//   tag: { type: String },
//   notes: { type: String },
//   measurements: {
//     shoulder: { type: Number },
//     chest: { type: Number },
//     waist: { type: Number },
//     hip: { type: Number },
//     sleeve: { type: Number },
//     kurtiLength: { type: Number }
//   }
// });
const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    nameHi: {
      type: String,
      default: "",
    },

    phone: {
      type: String,
      required: true,
    },

    address: {
      type: String,
      default: "",
    },

    tag: {
      type: String,
      enum: ["vip", "regular", "new"],
      default: "regular",
    },

    totalOrders: {
      type: Number,
      default: 0,
    },

    lastOrderType: {
      type: String,
      default: "",
    },

    lastOrderTypeHi: {
      type: String,
      default: "",
    },

    notes: {
      type: String,
      default: "",
    },

    notesHi: {
      type: String,
      default: "",
    },

    avatarColor: {
      type: String,
      default: "#7B1FA2",
    },

    initials: {
      type: String,
      default: "",
    },

    measurements: {
      shoulder: { type: String, default: "" },
      chest: { type: String, default: "" },
      waist: { type: String, default: "" },
      hip: { type: String, default: "" },
      height: { type: String, default: "" },
      sleeve: { type: String, default: "" },
      kurtiLength: { type: String, default: "" },
      trouserLength: { type: String, default: "" },
      neckSize: { type: String, default: "" },
    },

    // Permanent Image URL
    imageUrl: {
      type: String,
      default: "",
    },

    semanticLabel: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Customer", customerSchema);
// module.exports = mongoose.model('Customer', customerSchema);

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