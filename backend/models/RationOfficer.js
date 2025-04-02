const mongoose = require("mongoose");

const RationOfficerSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  password: { type: String, required: true }, // ✅ Storing unhashed password
  assignedWard: { type: String, default: null } // Stores assigned ward
});

module.exports = mongoose.model("RationOfficer", RationOfficerSchema);
