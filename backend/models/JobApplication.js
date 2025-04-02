const mongoose = require('mongoose');

const jobApplicationSchema = new mongoose.Schema({
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job', // Assuming you have a Job model
    required: true
  },
  applicantName: {
    type: String,
    required: true,
    trim: true
  },
  houseNumber: {
    type: String,
    required: true,
    trim: true
  },
  wardNumber: {
    type: String,
    required: true,
    trim: true
  },
  age: {
    type: Number,
    required: true
  },
  aadhaarNumber: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return /^\d{12}$/.test(v);
      },
      message: props => `${props.value} is not a valid Aadhaar number!`
    }
  },
  

  skills: {
    type: [String], // Array of skills
    default: []
  },
  experience: {
    type: String,
    required: false,
    trim: true
  },
  applicationDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['Applied', 'Reviewed', 'Accepted', 'Rejected'],
    default: 'Applied'
  }
});

module.exports = mongoose.model('JobApplication', jobApplicationSchema);
