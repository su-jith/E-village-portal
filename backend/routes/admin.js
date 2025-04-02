// routes/admin.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const role = require('../middleware/role');
const User = require("../models/User");
const Ward = require("../models/Ward");
const Employee = require("../models/Employee");




// Protected route accessible only by admin users
router.get('/dashboard', auth, role('admin'), (req, res) => {
  res.json({ msg: 'Welcome to the admin dashboard' });
});

// GET /api/admin/employees - returns a list of employees for selection list
router.get("/employees/all", async (req, res) => {
  try {
    const employees = await Employee.find({});
    res.json(employees);
  } catch (error) {
    console.error("Error fetching employees:", error);
    res.status(500).json({ message: "Server error" });
  }
});


// filter employees with an assigned ward.
router.get("/employees/assigned", async (req, res) => {
  try {
    const employees = await Employee.find({ assignedWard: { $ne: null } }); // Fetch only assigned employees
    console.log("Fetched Assigned Employees:", employees);
    res.json(employees);
  } catch (error) {
    console.error("Error fetching assigned employees:", error);
    res.status(500).json({ message: "Server error" });
  }
});



router.get("/admin/ward", async (req, res) => {
  try {
    const wards = await Ward.find();
    res.json({ wards });
  } catch (err) {
    res.status(500).json({ message: "Error fetching wards" });
  }
});



// GET ward by wardNumber
router.get('/ward/:wardNumber', async (req, res) => {
  const wardNumber = req.params.wardNumber;

  try {
    const ward = await Ward.findOne({ wardNumber: wardNumber });

    if (!ward) {
      return res.status(404).json({ message: 'Ward not found' });
    }

    res.json(ward);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});



router.post("/assign-ward", async (req, res) => {
  console.log(req.body);
  const { employeeId, ward } = req.body;

  try {
      // Check if employee exists
      console.log("Received employeeId:", employeeId);
      console.log("Received wardId:", ward);
      const employee = await Employee.findById(employeeId);
      console.log("Received Employee:", employee);
      
      if (!employee) {
          return res.status(404).json({ message: "Employee not found" });
      }
      
      // Check if ward exists
      const wardData = await Ward.findOne({ wardNumber: ward });
      console.log("Found Ward:", wardData);
      
      if (!wardData) {
          return res.status(404).json({ message: "Ward not found" });
      }
      
      // Assign ward to employee
      employee.assignedWard = wardData.wardNumber; // Use wardData instead of wards
      await employee.save();
      
      // Verify after saving
      const employeeCheck = await Employee.findById(employeeId);
      console.log("Updated Employee:", employeeCheck);

      res.status(200).json({ message: "Ward assigned successfully", employee: employeeCheck });
  } catch (error) {
      console.error("Error assigning ward:", error);
      res.status(500).json({ message: "Server error", error });
  }
});

//remove assigned ward back to null
const mongoose = require("mongoose");

router.put("/remove-assignment", async (req, res) => {
  const { employeeId } = req.body;
  
  console.log("Received request to remove assignment for Employee ID:", employeeId);

  try {
      // Convert employeeId to ObjectId
      const objectId = new mongoose.Types.ObjectId(employeeId);

      // Update the employee record in MongoDB
      const result = await Employee.updateOne(
          { _id: objectId }, // Correct field for querying by ID
          { $set: { assignedWard: null } }
      );

      console.log("Database Update Result:", result);

      if (result.matchedCount === 0) {
          return res.status(400).json({ message: "Employee not found or assignment was not updated." });
      }

      res.json({ message: "Assignment removed successfully" });
  } catch (error) {
      console.error("Error in removing assignment:", error);
      res.status(500).json({ message: "Internal server error" });
  }
});





module.exports = router;
