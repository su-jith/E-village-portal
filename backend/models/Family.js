const mongoose = require('mongoose');

const familySchema = new mongoose.Schema({
  houseNumber: {
    type: Number,
    required: true
  },
  wardNumber: {
    type: Number,
    required: true
  },
  memberName: {
    type: String,
    required: true
  },
  dob: {
    type: Date,
    required: true
  },
  age: {
    type: Number,
    required: true
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    required: true
  },
  aadhaarNumber: {
    type: String,
    required: true,
    unique: true   // ✅ Ensures no duplicate Aadhaar
  },
  relationship: {
    type: String,
    required: true
  },
  maritalStatus: {
    type: String,
    enum: ['Married', 'Unmarried', 'Widowed'],
    required: true
  },
  phone: String,
  email: String,
  highestQualification: {
    type: String,
    enum: ['School', 'SSLC', 'HSC', 'Diploma', 'Under Graduate', 'Post Graduate', 'none'],
    required: true
  },
  currentEducationalStatus: String,
  occupation: String,
  employer: String,
  employmentType: {
    type: String,
    enum: ['Government', 'Private', 'Self Employed', 'Business', 'Student', 'Unemployed',"Not Applicable", ''],
  },
  skills: {
    type: [String],
    enum: ['Carpenter', 'Mason', 'Welder', 'Painter', 'Steel Fixer(House/Industrial)',
           'Tile Setter', 'Electrician', 'Plumber', 'HVAC Technician', 'Auto Mechanic',
           'Diesel Mechanic', 'Fitter', 'Barber', 'Driver','IT professional','None', 'Other','']
  },
  monthlyIncome: Number
});

module.exports = mongoose.model('Family', familySchema);
