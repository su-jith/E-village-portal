const mongoose = require('mongoose');

const { Schema } = mongoose;

// Schema for Health Data Collection by Healthcare Worker
const FamilyHealthSchema = new Schema(
  {
    // Reference to family member (assuming you have a FamilyMember schema)
    familyMemberId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'FamilyMember',
      required: true,
    },

    // Reference to healthcare worker (who collected the data)
    healthcareWorkerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'HealthcareWorker',
      required: true,
    },

    // Basic Health Information
    bloodGroup: { type: String, trim: true },
    height: { type: Number }, // in cm or specify unit
    weight: { type: Number }, // in kg or specify unit
    allergies: { type: String, trim: true },
    disabilityStatus: { type: String, trim: true },

    // Medical History
    chronicDiseases: { type: String, trim: true }, // e.g., Diabetes, Hypertension
    pastSurgeries: { type: String, trim: true },
    familyMedicalHistory: { type: String, trim: true },

    // Vaccination & Immunization
    routineVaccines: { type: String, trim: true }, // e.g., Polio, Hepatitis
    covidStatus: { type: String, trim: true }, // Vaccinated/Unvaccinated/Partially Vaccinated/etc.

    // Maternal & Child Health
    pregnancyStatus: { type: String, trim: true }, // Pregnant/Not Pregnant
    expectedDeliveryDate: { type: Date },

    // Health Checkups & Screenings
    lastCheckupDate: { type: Date },
    bloodSugar: { type: String, trim: true }, // e.g., Normal/High/Low + value if needed
    bpReadings: { type: String, trim: true }, // e.g., 120/80 mmHg

    // Medication & Treatment
    currentMedications: { type: String, trim: true },
    hospitalizationHistory: { type: String, trim: true },

    // Mental Health
    mentalHealth: { type: String, trim: true },

    // Health Insurance & Government Schemes
   
    govtHealthScheme: { type: String, trim: true }, // Ayushman Bharat, etc.

    // Lifestyle & Hygiene
    lifestyle: { type: String, trim: true }, // Smoking, Alcohol, Exercise habits, etc.

    // Disease Outbreak Monitoring
    infectiousDiseaseHistory: { type: String, trim: true }, // e.g., TB, Malaria, Dengue

    // Additional optional fields
    remarks: { type: String, trim: true },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt timestamps
  }
);

// Export the model
module.exports = mongoose.model('FamilyHealth', FamilyHealthSchema);
