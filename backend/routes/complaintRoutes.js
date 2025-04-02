const express = require('express');
const Complaint = require('../models/Complaint');

const router = express.Router();

// POST Complaint
router.post('/add', async (req, res) => {
  try {
    const newComplaint = new Complaint(req.body);
    const savedComplaint = await newComplaint.save();
    res.status(201).json(savedComplaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET All Complaints
router.get('/all', async (req, res) => {
  try {
    const complaints = await Complaint.find();
    res.status(200).json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;  // <<< ✅ CommonJS export
