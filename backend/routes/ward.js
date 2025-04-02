const express = require("express");
const router = express.Router();
const Ward = require("../models/Ward");

// GET all wards
router.get("/", async (req, res) => {
  try {
    const wards = await Ward.find({});
    res.json({ success: true, wards });
  } catch (error) {
    console.error("Error fetching wards:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
});







// POST new ward (Adding a new ward)
router.post("/", async (req, res) => {
  try {
    const { wardNumber, numberOfHouses, wardMember } = req.body;

    // Validate fields
    if (!wardNumber || !numberOfHouses || !wardMember) {
      return res.status(400).json({ success: false, message: "All fields are required." });
    }

    const wNumber = Number(wardNumber);
    const houses = Number(numberOfHouses);

    if (isNaN(wNumber) || wNumber <= 0) {
      return res.status(400).json({ success: false, message: "Invalid ward number." });
    }

    if (isNaN(houses) || houses <= 0) {
      return res.status(400).json({ success: false, message: "Invalid number of houses." });
    }

    // Check for duplicate ward
    const existingWard = await Ward.findOne({ wardNumber: wNumber });
    if (existingWard) {
      return res.status(400).json({ success: false, message: "Ward already exists." });
    }

    // Create new ward
    const newWard = new Ward({ wardNumber: wNumber, numberOfHouses: houses, wardMember });
    await newWard.save();

    res.json({ success: true, message: "Ward added successfully!", ward: newWard });
  } catch (error) {
    console.error("Error saving ward:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
});

// PUT update ward
router.put("/:id", async (req, res) => {
  try {
    const { wardNumber, numberOfHouses, wardMember } = req.body;
    
    if (!wardNumber || !numberOfHouses || !wardMember) {
      return res.status(400).json({ success: false, message: "All fields are required." });
    }

    const wNumber = Number(wardNumber);
    const houses = Number(numberOfHouses);

    if (isNaN(wNumber) || wNumber <= 0) {
      return res.status(400).json({ success: false, message: "Invalid ward number." });
    }

    if (isNaN(houses) || houses <= 0) {
      return res.status(400).json({ success: false, message: "Invalid number of houses." });
    }

    // Check for duplicate ward (excluding current ward)
    const duplicate = await Ward.findOne({ wardNumber: wNumber, _id: { $ne: req.params.id } });
    if (duplicate) {
      return res.status(400).json({ success: false, message: "Ward number already exists." });
    }

    // Update ward
    const updatedWard = await Ward.findByIdAndUpdate(
      req.params.id,
      { wardNumber: wNumber, numberOfHouses: houses, wardMember },
      { new: true }
    );

    if (!updatedWard) {
      return res.status(404).json({ success: false, message: "Ward not found." });
    }

    res.json({ success: true, message: "Ward updated successfully!", ward: updatedWard });
  } catch (error) {
    console.error("Error updating ward:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
});

// DELETE ward
router.delete("/:id", async (req, res) => {
  try {
    const deletedWard = await Ward.findByIdAndDelete(req.params.id);
    if (!deletedWard) {
      return res.status(404).json({ success: false, message: "Ward not found." });
    }

    res.json({ success: true, message: "Ward deleted successfully!" });
  } catch (error) {
    console.error("Error deleting ward:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
});

module.exports = router;
