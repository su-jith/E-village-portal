const mongoose = require('mongoose');

const houseSchema = new mongoose.Schema({
  houseNumber: {
    type: Number,
    required: true,
  },
  houseName: {
    type: String,
    required: true,
  },
  wardNumber: {
    type: Number,
    required: true,
  },
  rationEntitlement: {
    type: String,
    enum: ['APL', 'BPL']
  },
  landOwnership: {
    type: String,
    enum: ['Yes', 'No']
  },
  houseType: {
    type: String,
    enum: ['Own', 'Rented']
  },
  password: { type: String, required: true }
});

// Optional: Ensure uniqueness of houseNumber per ward
houseSchema.index({ houseNumber: 1, wardNumber: 1 }, { unique: true });

const House = mongoose.model('House', houseSchema);

module.exports = House;
