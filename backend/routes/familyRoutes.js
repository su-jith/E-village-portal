//routes/familyRoutes.js

const express = require('express');
const router = express.Router();
const Family = require('../models/Family');
const House = require('../models/House');
const mongoose = require('mongoose');

// POST /api/family/login
router.post('/login', async (req, res) => {
  const { wardNumber, houseNumber, password } = req.body;

  try {
    const house = await House.findOne({ wardNumber, houseNumber });

    if (!house) {
      return res.status(404).json({ message: 'House not found for this ward' });
    }

    if (house.password !== password) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    res.status(200).json({
      message: 'Login successful',
      houseDetails: house,
    });
  } catch (error) {
    console.error('Family login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});



// routes/family.js get house details
router.get('/house-details', async (req, res) => {
  const { wardNumber, houseNumber } = req.query;
  ;
  try {
    const house = await House.findOne({ wardNumber, houseNumber });
    

    if (!house) {
      return res.status(404).json({ message: 'House not found' });
    }

    res.json(house);
  } catch (error) {
    console.error('Error fetching house details:', error);
    res.status(500).json({ message: 'Server error' });
  }
});



// Fetch all members in a family (ward + house number combo)
router.get('/family-members', async (req, res) => {
  const { wardNumber, houseNumber } = req.query;

  console.log('Fetching family members for:', wardNumber, houseNumber);

  try {
    const members = await Family.find({ wardNumber, houseNumber });

    if (!members || members.length === 0) {
      return res.status(404).json({ message: 'No family members found' });
    }

    res.json(members);
  } catch (error) {
    console.error('Error fetching family members:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


// Add family member
router.post('/add', async (req, res) => {
  try {
    console.log('Received data:', req.body);
    const { houseNumber, memberName, dob, ...rest } = req.body;

    console.log('Received data:', req.body);

    if (!houseNumber) {
      return res.status(400).json({ message: 'House number is required' });
    }

    const house = await House.findOne({ houseNumber });

    if (!house) {
      return res.status(404).json({ message: 'House not found for house number: ' + houseNumber });
    }

    const wardNumber = house.wardNumber;
    console.log(`Auto-assigned Ward Number: ${wardNumber} for House Number: ${houseNumber}`);

    if (!memberName || memberName.trim() === '') {
      return res.status(400).json({ message: "Member name is required" });
  }
  

    const birthDate = new Date(dob);
    if (isNaN(birthDate)) {
      console.log('Invalid DOB:', dob);
      return res.status(400).json({ message: 'Invalid date of birth' });
    }

    const ageDifMs = Date.now() - birthDate.getTime();
    const ageDate = new Date(ageDifMs);
    const age = Math.abs(ageDate.getUTCFullYear() - 1970);

    // Check Aadhaar duplicate (optional)
    const existingAadhaar = await Family.findOne({ aadhaarNumber: rest.aadhaarNumber });
    if (existingAadhaar) {
      return res.status(400).json({ message: 'Aadhaar number already exists.' });
    }

    // Clean up incoming data
    const monthlyIncome = parseInt(rest.monthlyIncome, 10) || 0;
    let skills = rest.skills;
    if (skills && !Array.isArray(skills)) {
      skills = [skills];
    }

    const newMember = new Family({
      houseNumber,
      wardNumber,
      memberName,
      dob,
      age,
      gender: rest.gender,
      aadhaarNumber: rest.aadhaarNumber,
      relationship: rest.relationship,
      maritalStatus: rest.maritalStatus,
      phone: rest.phone,
      email: rest.email,
      highestQualification: rest.highestQualification,
      currentEducationalStatus: rest.currentEducationalStatus,
      occupation: rest.occupation,
      employer: rest.employer,
      employmentType: rest.employmentType,
      skills,
      monthlyIncome
    });

    console.log('Saving member:', newMember);

    await newMember.save();

    res.status(201).json({ message: 'Family member added successfully.', newMember });

  } catch (error) {
    console.error('Error adding family member:', error);
    res.status(500).json({ message: 'Server error.', error });
  }
});


// Get family members by house
router.get('/:houseNumber', async (req, res) => {
  try {
    const members = await Family.find({ houseNumber: req.params.houseNumber });
    res.json(members);
  } catch (error) {
    console.error('Error fetching members:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

// Get a single family member by their _id
router.get('/member/:id', async (req, res) => {
  try {
    const memberId = req.params.id;

    // Validate ObjectId format (optional but recommended)
    if (!mongoose.Types.ObjectId.isValid(memberId)) {
      return res.status(400).json({ message: 'Invalid member ID' });
    }
    console.log(memberId)
    // Find the family member by _id
    const member = await Family.findById( memberId );

    if (!member) {
      return res.status(404).json({ message: 'Family member not found' });
    }

    res.json(member);
  } catch (error) {
    console.error('Error fetching member:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});



// DELETE route to remove a family member by ID
router.delete("/delete/:memberId", async (req, res) => {
  try {
      const { memberId } = req.params;

      // Find and delete the family member
      const deletedMember = await Family.findByIdAndDelete(memberId);

      if (!deletedMember) {
          return res.status(404).json({ message: "Family member not found" });
      }

      res.status(200).json({ message: "Family member deleted successfully", deletedMember });
  } catch (error) {
      res.status(500).json({ message: "Error deleting family member", error: error.message });
  }
});



// PUT route to update a family member by ID
router.put("/update/:memberId", async (req, res) => {
  try {
      const { memberId } = req.params;
      const updatedData = req.body; // Data sent from frontend
      console.log('Updating member:', updatedData);

      // Find and update the family member
      const updatedMember = await Family.findByIdAndUpdate(memberId, updatedData, { 
          new: true, // Return updated document
          runValidators: true // Ensure validation rules are applied
          
      });

      if (!updatedMember) {
          return res.status(404).json({ message: "Family member not found" });
      }

      res.status(200).json({ message: "Family member updated successfully", updatedMember });
  } catch (error) {
      res.status(500).json({ message: "Error updating family member", error: error.message });
  }
});



router.get('/:wardNumber/:houseNumber', async (req, res) => {
  const { wardNumber, houseNumber } = req.params;

  try {
    const members = await Family.find({
      wardNumber: parseInt(wardNumber),
      houseNumber: parseInt(houseNumber)
    });


    res.status(200).json(members);
    console.log('Fetched family members:', members); // Debugging line
  } catch (error) {
    console.error('Error fetching family members:', error);
    res.status(500).json({ message: 'Server error fetching family members', error });
  }
});



module.exports = router;
