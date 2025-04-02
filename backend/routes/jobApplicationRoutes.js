const express = require('express');
const router = express.Router();

const JobApplication = require('../models/JobApplication'); // ✅ Path to your model

// ✅ Create a job application (POST)
router.post('/submit', async (req, res) => {
  try {
    const jobApplication = new JobApplication(req.body);
    const savedApplication = await jobApplication.save();
    res.status(201).json(savedApplication);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
});

// ✅ Get all job applications (GET)
router.get('/all-applications', async (req, res) => {
  try {
    const applications = await JobApplication.find().populate('jobId');
    res.status(200).json(applications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

router.get('/application/:jobId', async (req, res) => {
  const { jobId } = req.params;
  try {
    const applications = await JobApplication.find({ jobId });
    res.status(200).json({ applications });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch applications", error: err });
  }
});


// ✅ Update application status (PATCH)
router.patch('/:id/status', async (req, res) => {
  const { status } = req.body;
  if (!['Applied', 'Reviewed', 'Accepted', 'Rejected'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status value' });
  }

  try {
    const updatedApplication = await JobApplication.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.json(updatedApplication);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
