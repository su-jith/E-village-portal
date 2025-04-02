const express = require("express");
const RationOfficer = require("../models/RationOfficer");
const Ward = require("../models/Ward");

const router = express.Router();



router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the officer exists
    const officer = await RationOfficer.findOne({ email });

    if (!officer) {
      return res.status(404).json({ message: 'Ration Officer not found' });
    }

    // Compare plain passwords directly (not recommended in production!)
    if (officer.password !== password) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    // Prepare the response data (without sensitive fields)
    const responseOfficerData = {
      id: officer._id,
      name: officer.name,
      email: officer.email,
      assignedWard: officer.assignedWard || 'Not assigned', // optional
    };

    res.json(responseOfficerData);
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;


// Add a new Ration Officer
router.post("/add", async (req, res) => {
  try {
    const { userId, name, email, phone, password } = req.body;

    const existingOfficer = await RationOfficer.findOne({ $or: [{ userId }, { email }] });
    if (existingOfficer) {
      return res.status(400).json({ message: "User ID or Email already exists!" });
    }

    const newOfficer = new RationOfficer({ userId, name, email, phone, password });
    await newOfficer.save();

    res.status(201).json({ message: "Ration Officer added successfully!" });
  } catch (error) {
    console.error("Error adding Ration Officer:", error);
    res.status(500).json({ message: "Server error while adding Ration Officer" });
  }
});

// Assign ward to Ration Officer
router.post("/assign-ward", async (req, res) => {
  console.log(req.body);
  const { officerId, ward } = req.body;

  try {
    // Check if Ration Officer exists
    console.log("Received officerId:", officerId);
    console.log("Received wardId:", ward);
    const officer = await RationOfficer.findById(officerId);
    console.log("Received Officer:", officer);

    if (!officer) {
      return res.status(404).json({ message: "Ration Officer not found" });
    }

    // Check if ward exists
    const wardData = await Ward.findOne({ wardNumber: ward });
    console.log("Found Ward:", wardData);

    if (!wardData) {
      return res.status(404).json({ message: "Ward not found" });
    }

    // Assign ward to Ration Officer
    officer.assignedWard = wardData.wardNumber;
    await officer.save();

    // Verify after saving
    const officerCheck = await RationOfficer.findById(officerId);
    console.log("Updated Officer:", officerCheck);

    res.status(200).json({ message: "Ward assigned successfully", officer: officerCheck });
  } catch (error) {
    console.error("Error assigning ward:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

// Fetch all Ration Officers
router.get("/all", async (req, res) => {
  try {
    const officers = await RationOfficer.find({}, "userId name email phone password assignedWard");
    res.json(officers);
  } catch (error) {
    res.status(500).json({ message: "Server error fetching Ration Officers" });
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

// Fetch unassigned Ration Officers
router.get("/unassigned", async (req, res) => {
  try {
    const officers = await RationOfficer.find({ assignedWard: null }, "userId name email phone");
    res.json(officers);
  } catch (error) {
    res.status(500).json({ message: "Error fetching unassigned Ration Officers" });
  }
});

// Delete Ration Officer
router.delete("/:id", async (req, res) => {
  try {
    await RationOfficer.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Ration Officer deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});

// Update Ration Officer
router.put("/update/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updatedOfficer = await RationOfficer.findByIdAndUpdate(id, req.body, { new: true });

    if (!updatedOfficer) {
      return res.status(404).json({ message: "Ration Officer not found" });
    }

    res.json(updatedOfficer);
  } catch (error) {
    res.status(500).json({ message: "Error updating Ration Officer", error });
  }
});

// Remove ward assignment
router.put("/remove-assignment", async (req, res) => {
  try {
    const { officerId } = req.body;
    const officer = await RationOfficer.findById(officerId);

    if (!officer) {
      return res.status(404).json({ message: "Ration Officer not found" });
    }

    officer.assignedWard = null;
    await officer.save();

    res.json({ message: "Ward assignment removed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error removing assignment" });
  }
});

module.exports = router;
