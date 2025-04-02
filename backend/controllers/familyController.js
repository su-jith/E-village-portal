// controllers/familyController.js
const Family = require('../models/Family');

// Create or update a family record based on the house number
exports.createOrUpdateFamily = async (req, res) => {
  try {
    // Expecting houseNumber, ward, address, and familyMembers in req.body
    const { houseNumber, ward, address, familyMembers } = req.body;
    
    if (!houseNumber || !ward) {
      return res.status(400).json({ msg: 'House number and ward are required' });
    }
    
    let family = await Family.findOne({ houseNumber });
    
    if (family) {
      // Update the existing family record
      family.ward = ward;
      family.address = address;
      family.familyMembers = familyMembers;
      await family.save();
      return res.json({ msg: 'Family record updated', family });
    } else {
      // Create a new family record
      family = new Family({ houseNumber, ward, address, familyMembers });
      await family.save();
      return res.status(201).json({ msg: 'Family record created', family });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Retrieve a family record by house number
exports.getFamilyByHouseNumber = async (req, res) => {
  try {
    const { houseNumber } = req.params;
    const family = await Family.findOne({ houseNumber });
    if (!family) {
      return res.status(404).json({ msg: 'Family record not found' });
    }
    res.json(family);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Retrieve all family records for a specific ward
exports.getFamiliesByWard = async (req, res) => {
  try {
    const { ward } = req.params;
    const families = await Family.find({ ward });
    res.json(families);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: 'Server error' });
  }
};
