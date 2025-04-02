const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  emailAddress: {
    type: String,
    required: true,
  },
  designation: {
    type: String,
    enum: ['Citizen', 'Staff', 'Service Provider', 'Ration Officer', 'Healthcare Worker', 'Other'],
    required: true,
  },
  wardNo: {
    type: String,
    required: true,
  },
  houseNo: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ['Service', 'Staff Behavior', 'Facility Issue', 'Corruption', 'Delay', 'Other'],
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  priorityLevel: {
    type: String,
    enum: ['Normal', 'High', 'Critical'],
    default: 'Normal',
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  },
});

const Complaint = mongoose.model('Complaint', complaintSchema);

module.exports = Complaint;
