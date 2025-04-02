const express = require("express");
const router = express.Router();
const Job = require("../models/Job"); // Assuming your schema file is named Job.js

// CREATE a Job Post - POST /api/jobs
router.post("/post-job", async (req, res) => {
  try {
    const {
      jobTitle,
      jobLocation,
      employmentType,
      jobSummary,
      keyResponsibilities,
      salary,
      deadline,
    } = req.body;

    // Validation (basic)
    if (!jobTitle || !jobLocation || !employmentType || !jobSummary || !salary || !deadline) {
      return res.status(400).json({ message: "Please fill all required fields." });
    }

    const newJob = new Job({
      jobTitle,
      jobLocation,
      employmentType,
      jobSummary,
      keyResponsibilities,
      salary,
      deadline,
      appliedMembers: [], // default empty array
    });

    const savedJob = await newJob.save();

    res.status(201).json({
      message: "Job posted successfully",
      job: savedJob,
    });
  } catch (error) {
    console.error("Error creating job:", error);
    res.status(500).json({ message: "Server Error", error });
  }
});

// GET All Jobs - GET /api/jobs
router.get("/all-jobs", async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.status(200).json({ jobs });
  } catch (error) {
    console.error("❌ Error fetching jobs:", error);
    res.status(500).json({ message: "Server error" });
  }
});



// DELETE job by ID
router.delete('/delete-job/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedJob = await Job.findByIdAndDelete(id);

    if (!deletedJob) {
      return res.status(404).json({ message: 'Job not found' });
    }

    res.json({ message: 'Job deleted successfully!' });
  } catch (error) {
    console.error('Error deleting job:', error);
    res.status(500).json({ message: 'Server error while deleting job' });
  }
});


module.exports = router;
