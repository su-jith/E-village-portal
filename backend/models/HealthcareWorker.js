//models/HealthcareWorker.js

const mongoose = require("mongoose");

const HealthcareWorkerSchema = new mongoose.Schema({
  workerId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  assignedWard: { type: String, default: null } // Stores assigned ward
});

module.exports = mongoose.model("HealthcareWorker", HealthcareWorkerSchema);