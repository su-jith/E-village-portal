const express = require('express');
const router = express.Router();
const House = require('../models/House');
const Ward = require('../models/Ward'); // Assuming Ward schema exists
const Family = require('../models/Family');



router.get("/houses/all", async (req, res) => {
  try {
    console.log("Calling /houses/all...");
    const houses = await House.find();
    console.log("Houses found:", houses.length);
    res.json(houses);
  } catch (error) {
    console.error("Error in /houses/all:", error.message);
    res.status(500).json({ message: "Failed to fetch houses", error: error.message });
  }
});




// GET all houses for a ward
router.get('/houses/:wardNumber', async (req, res) => {
  try {
    const { wardNumber } = req.params;
    const houses = await House.find({ wardNumber });

    res.json(houses);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching houses', error });
  }
});

router.get('/house/:houseNumber', async (req, res) => {
  try {
    const { houseNumber } = req.params;
    const houses = await House.find({ houseNumber: Number(houseNumber) });


    res.json(houses);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching houses', error });
  }
});

// POST add new house
router.post('/houses/add', async (req, res) => {
  const {
    houseNumber,
    houseName,
    wardNumber,
    rationEntitlement,
    landOwnership,
    houseType,
    password,
  } = req.body;

  // ✅ Check all fields
  if (
    !houseNumber ||
    !houseName ||
    !wardNumber ||
    !rationEntitlement ||
    !landOwnership ||
    !houseType ||
    !password
  ) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    // Check if the ward exists
    const ward = await Ward.findOne({ wardNumber });
    if (!ward) {
      return res.status(404).json({ message: 'Ward not found.' });
    }

    const existingHouses = await House.find({ wardNumber });
    if (existingHouses.length >= ward.numberOfHouses) {
      return res.status(400).json({ message: 'House limit reached for this ward.' });
    }

    // Check house number uniqueness
    const houseExists = await House.findOne({ houseNumber, wardNumber });
    if (houseExists) {
      return res.status(400).json({ message: 'House number already exists in this ward.' });
    }

    // Create the new house object
    const newHouse = new House({
      houseNumber,
      houseName,
      wardNumber,
      rationEntitlement,
      landOwnership,
      houseType,
      password, // stored unhashed as you requested
    });

    await newHouse.save();

    res.status(201).json({ message: 'House added successfully', house: newHouse });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error adding house', error });
  }
});



// ✅ Update house
router.put('/houses/update/:id', async (req, res) => {
  const {
    houseNumber,
    houseName,
    rationEntitlement,
    landOwnership,
    houseType,
    password,
  } = req.body;

  const { id } = req.params;

  try {
    const house = await House.findById(id);
    if (!house) {
      return res.status(404).json({ message: 'House not found' });
    }

    house.houseNumber = houseNumber;
    house.houseName = houseName;
    house.rationEntitlement = rationEntitlement;
    house.landOwnership = landOwnership;
    house.houseType = houseType;
    house.password = password; // stored unhashed as you requested

    await house.save();

    res.json({ message: 'House updated successfully', house });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error while updating house' });
  }
});



// ✅ Delete house
router.delete('/houses/delete/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const house = await House.findById(id);

    if (!house) {
      return res.status(404).json({ message: 'House not found' });
    }

    await House.findByIdAndDelete(id);

    res.json({ message: 'House deleted successfully' });
  } catch (err) {
    console.error('Delete Error:', err);
    res.status(500).json({ message: 'Server error while deleting house' });
  }
});


//get count of family members by house
router.get('/family-members/count/:houseNumber', async (req, res) => {
  try {
    const { houseNumber } = req.params;
    

    const parsedHouseNumber = Number(houseNumber);
    if (isNaN(parsedHouseNumber)) {
      return res.status(400).json({ message: 'Invalid house number parameter' });
    }

    const count = await Family.countDocuments({ houseNumber: parsedHouseNumber });
    

    res.json({ count });
  } catch (error) {
    console.error('Error counting family members:', error.message);
    res.status(500).json({ message: 'Error counting family members' });
  }
});









module.exports = router;
