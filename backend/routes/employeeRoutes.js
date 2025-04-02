const express = require("express");
const jwt = require("jsonwebtoken");
const Employee = require("../models/Employee");
const Ward = require("../models/Ward");

const router = express.Router();

// ✅ Add a new employee (Without password hashing)
router.post("/add", async (req, res) => {
  try {
    const { employeeId, name, email, password } = req.body;

    if (!employeeId || !name || !email || !password) {
      return res.status(400).json({ message: "All fields are required!" });
    }

    // Check if Employee ID or Email already exists
    const existingEmployee = await Employee.findOne({ $or: [{ employeeId }, { email }] });
    if (existingEmployee) {
      return res.status(400).json({ message: "Employee ID or Email already exists!" });
    }

    // Save employee without password hashing
    const newEmployee = new Employee({ employeeId, name, email, password });
    await newEmployee.save();

    console.log("✅ Employee added:", newEmployee);
    res.status(201).json({ message: "Employee added successfully!" });

  } catch (error) {
    console.error("❌ Error adding employee:", error);
    res.status(500).json({ message: "Server error while adding employee" });
  }
});

// ✅ Fetch all employees
router.get("/all", async (req, res) => {
  try {
    const employees = await Employee.find({}, "employeeId name email assignedWard password");
    res.json(employees);
  } catch (error) {
    console.error("❌ Error fetching employees:", error);
    res.status(500).json({ message: "Server error fetching employees" });
  }
});


// ✅ Delete Employee
router.delete("/:id", async (req, res) => {
  try {
    const deletedEmployee = await Employee.findByIdAndDelete(req.params.id);

    if (!deletedEmployee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    console.log("✅ Employee deleted:", deletedEmployee);
    res.status(200).json({ message: "Employee deleted successfully" });

  } catch (error) {
    console.error("❌ Server Error:", error);
    res.status(500).json({ message: "Server Error", error });
  }
});

// ✅ Update employee by ID
router.put("/update/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updatedEmployee = await Employee.findByIdAndUpdate(id, req.body, { new: true });

    if (!updatedEmployee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    console.log("✅ Employee updated:", updatedEmployee);
    res.json(updatedEmployee);

  } catch (error) {
    console.error("❌ Error updating employee:", error);
    res.status(500).json({ message: "Error updating employee", error });
  }
});

// ✅ Employee Login API (Without Password Hashing)
// POST /api/employees/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find employee by email
    const employee = await Employee.findOne({ email });

    // If not found
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    // Check password (plain text for simplicity - bcrypt recommended in production)
    if (employee.password !== password) {
      return res.status(401).json({ message: 'Incorrect password' });
    }

    // Successful login - return employee details (exclude password)
    res.status(200).json({
      _id: employee._id,
      employeeId: employee.employeeId,
      name: employee.name,
      email: employee.email,
      assignedWard: employee.assignedWard
    });

  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


// Login endpoint (email & password)
router.post('/employee_dash', async (req, res) => {
  const { email, password } = req.body;

  try {
    const employee = await Employee.findOne({ email });

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    if (employee.password !== password) {
      return res.status(401).json({ message: 'Incorrect password' });
    }

    // Login successful, return employee details (excluding password)
    res.json({
      _id: employee._id,
      employeeId: employee.employeeId,
      name: employee.name,
      email: employee.email,
      assignedWard: employee.assignedWard,
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
