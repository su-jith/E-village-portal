//models/Employee.js

const mongoose = require("mongoose");

const EmployeeSchema = new mongoose.Schema({
  employeeId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  assignedWard: { type: String, default: null } // Stores assigned ward
});

module.exports = mongoose.model("Employee", EmployeeSchema);
