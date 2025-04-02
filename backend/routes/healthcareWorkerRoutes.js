const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const HealthcareWorker = require("../models/HealthcareWorker");
const Ward = require("../models/Ward");

require("dotenv").config();
const router = express.Router();

// Add a new healthcare worker
router.post("/add", async (req, res) => {
  try {
    const { workerId, name, email, phone, password } = req.body;
    
    const existingWorker = await HealthcareWorker.findOne({ $or: [{ workerId }, { email }] });
    if (existingWorker) {
      return res.status(400).json({ message: "Worker ID or Email already exists!" });
    }
    
    const newWorker = new HealthcareWorker({ workerId, name, email, phone, password });
    await newWorker.save();

    res.status(201).json({ message: "Healthcare Worker added successfully!" });
  } catch (error) {
    console.error("Error adding healthcare worker:", error);
    res.status(500).json({ message: "Server error while adding healthcare worker" });
  }
});


// Assign ward to healthcare worker
router.post("/assign-ward", async (req, res) => {
  console.log(req.body);
  const { workerId, ward } = req.body;

  try {
      // Check if healthcare worker exists
      console.log("Received workerId:", workerId);
      console.log("Received wardId:", ward);
      const worker = await HealthcareWorker.findById(workerId);
      console.log("Received Worker:", worker);
      
      if (!worker) {
          return res.status(404).json({ message: "Healthcare worker not found" });
      }
      
      // Check if ward exists
      const wardData = await Ward.findOne({ wardNumber: ward });
      console.log("Found Ward:", wardData);
      
      if (!wardData) {
          return res.status(404).json({ message: "Ward not found" });
      }
      
      // Assign ward to healthcare worker
      worker.assignedWard = wardData.wardNumber; 
      await worker.save();
      
      // Verify after saving
      const workerCheck = await HealthcareWorker.findById(workerId);
      console.log("Updated Worker:", workerCheck);

      res.status(200).json({ message: "Ward assigned successfully", worker: workerCheck });
  } catch (error) {
      console.error("Error assigning ward:", error);
      res.status(500).json({ message: "Server error", error });
  }
});



// Fetch all healthcare workers
router.get("/all", async (req, res) => {
  try {
    const workers = await HealthcareWorker.find({}, "workerId name email phone password assignedWard");
    res.json(workers);
  } catch (error) {
    res.status(500).json({ message: "Server error fetching healthcare workers" });
  }
});





// Fetch available wards 
router.get("/admin/ward", async (req, res) => {
  try {
    const wards = await Ward.find();
    res.json({ wards });
  } catch (err) {
    res.status(500).json({ message: "Error fetching wards" });
  }
});



// Fetch unassigned healthcare workers
router.get("/unassigned", async (req, res) => {
  try {
    const workers = await HealthcareWorker.find({ assignedWard: null }, "workerId name phone assignedWard");
    res.json(workers);
  } catch (error) {
    res.status(500).json({ message: "Error fetching healthcare workers" });
  }
});



// Delete healthcare worker
router.delete("/:id", async (req, res) => {
  try {
    await HealthcareWorker.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Healthcare Worker deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});


// Update healthcare worker
router.put("/update/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updatedWorker = await HealthcareWorker.findByIdAndUpdate(id, req.body, { new: true });

    if (!updatedWorker) {
      return res.status(404).json({ message: "Healthcare Worker not found" });
    }

    res.json(updatedWorker);
  } catch (error) {
    res.status(500).json({ message: "Error updating healthcare worker", error });
  }
});


// Remove ward assignment
router.put("/remove-assignment", async (req, res) => {
  try {
    const { workerId } = req.body;
    const worker = await HealthcareWorker.findById(workerId);

    if (!worker) {
      return res.status(404).json({ message: "Healthcare worker not found" });
    }

    worker.assignedWard = null;
    await worker.save();

    res.json({ message: "Ward assignment removed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error removing assignment" });
  }
});




// Healthcare Worker Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find healthcare worker by email
    const worker = await HealthcareWorker.findOne({ email });

    // If not found
    if (!worker) {
      return res.status(404).json({ message: 'Healthcare Worker not found' });
    }

    // Check password (plain text comparison - use bcrypt in production!)
    if (worker.password !== password) {
      return res.status(401).json({ message: 'Incorrect password' });
    }

    // Successful login - return worker details (exclude password)
    res.status(200).json({
      _id: worker._id,
      healthcareWorkerId: worker.healthcareWorkerId, // or whatever your ID field is
      name: worker.name,
      email: worker.email,
      assignedWard: worker.assignedWard
    });

  } catch (error) {
    console.error('Healthcare Worker Login Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;