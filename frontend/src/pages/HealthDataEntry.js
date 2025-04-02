import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../styles/HealthDataEntry.css';

const initialFormData = {
  bloodGroup: '',
  height: '',
  weight: '',
  allergies: '',
  disabilityStatus: '',
  chronicDiseases: '',
  pastSurgeries: '',
  familyMedicalHistory: '',
  routineVaccines: '',
  covidStatus: '',
  pregnancyStatus: '',
  expectedDeliveryDate: '',
  lastCheckupDate: '',
  bloodSugar: '',
  bpReadings: '',
  currentMedications: '',
  hospitalizationHistory: '',
  mentalHealth: '',
  govtHealthScheme: '',
  lifestyle: '',
  infectiousDiseaseHistory: '',
  remarks: '',
};

const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const covidStatusOptions = ['Vaccinated', 'Partially Vaccinated', 'Unvaccinated'];
const pregnancyStatusOptions = ['Pregnant', 'Not Pregnant', 'N/A'];
const mentalHealthOptions = ['Good', 'Average', 'Poor'];
const lifestyleOptions = ['Smoker', 'Non-Smoker', 'Alcoholic', 'Non-Alcoholic', 'Regular Exercise', 'No Exercise'];
const disabilityStatusOptions = ['None', 'Physical', 'Mental', 'Both'];
const chronicDiseasesOptions = ['Diabetes', 'Hypertension', 'Heart Disease', 'Asthma', 'Cancer', 'None'];

const HealthDataEntry = () => {
  const { memberId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [healthcareWorkerId, setHealthcareWorkerId] = useState('');

  useEffect(() => {
    const workerData = JSON.parse(localStorage.getItem('healthcareWorkerData'));
    if (workerData && workerData._id) {
      setHealthcareWorkerId(workerData._id);
    } else {
      alert('Healthcare Worker not logged in');
      navigate('/healthcare-worker-login');
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    let tempErrors = {};
    if (!formData.bloodGroup) tempErrors.bloodGroup = 'Blood group is required';
    if (!formData.height || formData.height <= 0) tempErrors.height = 'Valid height required';
    if (!formData.weight || formData.weight <= 0) tempErrors.weight = 'Valid weight required';
    if (!formData.covidStatus) tempErrors.covidStatus = 'COVID status is required';
    if (!formData.pregnancyStatus) tempErrors.pregnancyStatus = 'Pregnancy status is required';
    if (!formData.lastCheckupDate) tempErrors.lastCheckupDate = 'Last checkup date required';

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      alert('Please correct the errors in the form!');
      return;
    }

    const dataToSend = {
      familyMemberId: memberId,
      healthcareWorkerId,
      ...formData,
    };

    try {
      const res = await fetch('http://localhost:5000/api/healthcare-worker/healthdata/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend),
      });

      const data = await res.json();

      if (res.ok) {
        alert('Health data saved successfully!');
        navigate(-1);
      } else {
        console.error(data.message);
        alert('Failed to save health data.');
      }
    } catch (error) {
      console.error('Error submitting health data:', error);
      alert('Something went wrong.');
    }
  };

  return (
    <div className="health-data-entry-container">
      <h2>Enter Health Data for Family Member</h2>
      <form onSubmit={handleSubmit} className="health-data-form">

        {/* Blood Group */}
        <label>
          Blood Group:
          <select
            name="bloodGroup"
            value={formData.bloodGroup}
            onChange={handleChange}
            required
          >
            <option value="">Select Blood Group</option>
            {bloodGroups.map((bg) => (
              <option key={bg} value={bg}>{bg}</option>
            ))}
          </select>
          {errors.bloodGroup && <span className="error">{errors.bloodGroup}</span>}
        </label>

        {/* Height */}
        <label>
          Height (cm):
          <input
            type="number"
            name="height"
            value={formData.height}
            onChange={handleChange}
            min="1"
            required
          />
          {errors.height && <span className="error">{errors.height}</span>}
        </label>

        {/* Weight */}
        <label>
          Weight (kg):
          <input
            type="number"
            name="weight"
            value={formData.weight}
            onChange={handleChange}
            min="1"
            required
          />
          {errors.weight && <span className="error">{errors.weight}</span>}
        </label>

        {/* Allergies */}
        <label>
          Allergies:
          <input
            type="text"
            name="allergies"
            value={formData.allergies}
            onChange={handleChange}
            placeholder="e.g. Peanuts, Dust"
          />
        </label>

        {/* Disability Status */}
        <label>
          Disability Status:
          <select
            name="disabilityStatus"
            value={formData.disabilityStatus}
            onChange={handleChange}
          >
            <option value="">Select Disability Status</option>
            {disabilityStatusOptions.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </label>

        {/* Chronic Diseases */}
        <label>
          Chronic Diseases:
          <select
            name="chronicDiseases"
            value={formData.chronicDiseases}
            onChange={handleChange}
          >
            <option value="">Select Chronic Disease</option>
            {chronicDiseasesOptions.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </label>

        {/* Past Surgeries */}
        <label>
          Past Surgeries:
          <input
            type="text"
            name="pastSurgeries"
            value={formData.pastSurgeries}
            onChange={handleChange}
          />
        </label>

        {/* Family Medical History */}
        <label>
          Family Medical History:
          <textarea
            name="familyMedicalHistory"
            value={formData.familyMedicalHistory}
            onChange={handleChange}
          />
        </label>

        {/* Routine Vaccines */}
        <label>
          Routine Vaccines:
          <textarea
            name="routineVaccines"
            value={formData.routineVaccines}
            onChange={handleChange}
            placeholder="e.g. Polio, Hepatitis B"
          />
        </label>

        {/* COVID Status */}
        <label>
          COVID Status:
          <select
            name="covidStatus"
            value={formData.covidStatus}
            onChange={handleChange}
            required
          >
            <option value="">Select</option>
            {covidStatusOptions.map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
          {errors.covidStatus && <span className="error">{errors.covidStatus}</span>}
        </label>

        {/* Pregnancy Status */}
        <label>
          Pregnancy Status:
          <select
            name="pregnancyStatus"
            value={formData.pregnancyStatus}
            onChange={handleChange}
            required
          >
            <option value="">Select</option>
            {pregnancyStatusOptions.map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
          {errors.pregnancyStatus && <span className="error">{errors.pregnancyStatus}</span>}
        </label>

        {/* Expected Delivery Date */}
        {formData.pregnancyStatus === 'Pregnant' && (
          <label>
            Expected Delivery Date:
            <input
              type="date"
              name="expectedDeliveryDate"
              value={formData.expectedDeliveryDate}
              onChange={handleChange}
            />
          </label>
        )}

        {/* Last Checkup Date */}
        <label>
          Last Checkup Date:
          <input
            type="date"
            name="lastCheckupDate"
            value={formData.lastCheckupDate}
            onChange={handleChange}
            required
          />
          {errors.lastCheckupDate && <span className="error">{errors.lastCheckupDate}</span>}
        </label>

        {/* Blood Sugar */}
        <label>
          Blood Sugar (mg/dL):
          <input
            type="number"
            name="bloodSugar"
            value={formData.bloodSugar}
            onChange={handleChange}
            min="0"
          />
        </label>

        {/* BP Readings */}
        <label>
          BP Readings (e.g. 120/80):
          <input
            type="text"
            name="bpReadings"
            value={formData.bpReadings}
            onChange={handleChange}
            placeholder="e.g. 120/80"
          />
        </label>

        {/* Current Medications */}
        <label>
          Current Medications:
          <textarea
            name="currentMedications"
            value={formData.currentMedications}
            onChange={handleChange}
          />
        </label>

        {/* Hospitalization History */}
        <label>
          Hospitalization History:
          <textarea
            name="hospitalizationHistory"
            value={formData.hospitalizationHistory}
            onChange={handleChange}
          />
        </label>

        {/* Mental Health */}
        <label>
          Mental Health Status:
          <select
            name="mentalHealth"
            value={formData.mentalHealth}
            onChange={handleChange}
          >
            <option value="">Select</option>
            {mentalHealthOptions.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </label>

        {/* Govt Health Scheme */}
        <label>
          Govt Health Scheme:
          <input
            type="text"
            name="govtHealthScheme"
            value={formData.govtHealthScheme}
            onChange={handleChange}
            placeholder="e.g. Ayushman Bharat"
          />
        </label>

        {/* Lifestyle */}
        <label>
          Lifestyle Factors:
          <select
            name="lifestyle"
            value={formData.lifestyle}
            onChange={handleChange}
          >
            <option value="">Select</option>
            {lifestyleOptions.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </label>

        {/* Infectious Disease History */}
        <label>
          Infectious Disease History:
          <textarea
            name="infectiousDiseaseHistory"
            value={formData.infectiousDiseaseHistory}
            onChange={handleChange}
          />
        </label>

        {/* Remarks */}
        <label>
          Additional Remarks:
          <textarea
            name="remarks"
            value={formData.remarks}
            onChange={handleChange}
          />
        </label>

        <button type="submit" className="submit-btn">
          Submit Health Data
        </button>
      </form>
    </div>
  );
};

export default HealthDataEntry;
