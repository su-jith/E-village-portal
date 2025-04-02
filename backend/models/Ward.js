const mongoose = require("mongoose");

const WardSchema = new mongoose.Schema({
  wardNumber: {
    type: Number, // Must use Number (with a capital N)
    required: true,
    unique: true, // This ensures that no two wards have the same wardNumber
  },
  numberOfHouses: [{
    type: Number,
    required: true,
  }],
  wardMember: {
    type: String,
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model("Ward", WardSchema);
