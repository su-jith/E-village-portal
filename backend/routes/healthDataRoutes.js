// Example Express Route
const express = require('express');
const router = express.Router();

const FamilyHealth = require('../models/FamilyHealth');
const mongoose = require('mongoose');

router.post('/add', async (req, res) => {
  const data = req.body;
  try {
    const newHealthData = new FamilyHealth(data);
    await newHealthData.save();
    res.status(201).json({ message: 'Health data saved successfully!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error saving health data.' });
  }
});


// ✅ Route to check if health data exists for a specific family member
router.get('/check/:memberId', async (req, res) => {
  const { memberId } = req.params;

  try {
    // Check if health data exists for the given family member ID
    const healthData = await HealthData.findOne({ familyMemberId: memberId });

    if (healthData) {
      // Health data exists
      return res.json({ hasHealthData: true });
    } else {
      // No health data found
      return res.json({ hasHealthData: false });
    }

  } catch (error) {
    console.error('Error checking health data:', error);
    res.status(500).json({ message: 'Server error checking health data' });
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
    const member = await FamilyHealth.find( {familyMemberId:memberId} );

    if (!member) {
      return res.status(404).json({ message: 'Family member not found' });
    }

    res.json(member);
  } catch (error) {
    console.error('Error fetching member:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});




// Get a single family member by their _id
router.get('/full-details/member/:id', async (req, res) => {
  try {
    const memberId = req.params.id;

    // Validate ObjectId format (optional but recommended)
    if (!mongoose.Types.ObjectId.isValid(memberId)) {
      return res.status(400).json({ message: 'Invalid member ID' });
    }
    console.log(memberId)
    // Find the family member by _id
    const member = await FamilyHealth.find( {familyMemberId:memberId} );

    if (!member) {
      return res.status(404).json({ message: 'Family member not found' });
    }

    res.json(member);
  } catch (error) {
    console.error('Error fetching member:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});


// DELETE route to remove a family member's health record
router.delete('/delete-member/:memberId', async (req, res) => {
  try {
      const { memberId } = req.params;
      const deletedMember = await FamilyHealth.findOneAndDelete({ familyMemberId: memberId });
      

      if (!deletedMember) {
          return res.status(404).json({ message: 'Member not found' });
      }

      res.json({ message: 'Member deleted successfully' });
  } catch (error) {
      console.error('Error deleting member:', error);
      res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
