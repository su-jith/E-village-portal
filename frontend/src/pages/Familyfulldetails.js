import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/FamilyFullDetails.css'; // You can enhance the CSS for the cards

const FamilyFullDetails = () => {
  const { memberId } = useParams();
  const navigate = useNavigate();

  const [familyDetails, setFamilyDetails] = useState(null);
  const [healthDetails, setHealthDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const familyRes = await axios.get(`http://localhost:5000/api/employee/family/member/${memberId}`);
        setFamilyDetails(familyRes.data);

        const healthRes = await axios.get(`http://localhost:5000/api/healthcare-worker/healthdata/full-details/member/${memberId}`);
        setHealthDetails(healthRes.data);
      

      } catch (error) {
        console.error('Error fetching details:', error);
        alert('Error fetching family member details.');
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [memberId]);

  if (loading) return <div className="loading">Loading details...</div>;
  if (!familyDetails) return <div className="no-data">No personal details found for this member.</div>;

  return (
    <div className="family-full-details-container">
      <h2 className="page-title">Full Details of {familyDetails.memberName}</h2>

      {/* PERSONAL DETAILS */}
      <div className="details-section">
        <h3 className="section-title">Personal Information</h3>
        <div className="card-container">
          <div className="detail-card"><strong>House Number:</strong> {familyDetails.houseNumber}</div>
          <div className="detail-card"><strong>Ward Number:</strong> {familyDetails.wardNumber}</div>
          <div className="detail-card"><strong>Date of Birth:</strong> {new Date(familyDetails.dob).toLocaleDateString()}</div>
          <div className="detail-card"><strong>Age:</strong> {familyDetails.age}</div>
          <div className="detail-card"><strong>Gender:</strong> {familyDetails.gender}</div>
          <div className="detail-card"><strong>Aadhaar Number:</strong> {familyDetails.aadhaarNumber}</div>
          <div className="detail-card"><strong>Relationship:</strong> {familyDetails.relationship}</div>
          <div className="detail-card"><strong>Marital Status:</strong> {familyDetails.maritalStatus}</div>
          <div className="detail-card"><strong>Phone:</strong> {familyDetails.phone || 'N/A'}</div>
          <div className="detail-card"><strong>Email:</strong> {familyDetails.email || 'N/A'}</div>
          <div className="detail-card"><strong>Highest Qualification:</strong> {familyDetails.highestQualification}</div>
          <div className="detail-card"><strong>Current Educational Status:</strong> {familyDetails.currentEducationalStatus || 'N/A'}</div>
          <div className="detail-card"><strong>Occupation:</strong> {familyDetails.occupation || 'N/A'}</div>
          <div className="detail-card"><strong>Employer:</strong> {familyDetails.employer || 'N/A'}</div>
          <div className="detail-card"><strong>Employment Type:</strong> {familyDetails.employmentType || 'N/A'}</div>
          <div className="detail-card"><strong>Skills:</strong> {familyDetails.skills.length > 0 ? familyDetails.skills.join(', ') : 'None'}</div>
          <div className="detail-card"><strong>Monthly Income:</strong> ₹{familyDetails.monthlyIncome || 'N/A'}</div>
        </div>
      </div>

      {/* HEALTH DETAILS */}
      {healthDetails ? (
        <div className="details-section">
          <h3 className="section-title">Health Information</h3>
          <div className="card-container">
            <div className="detail-card"><strong>Blood Group:</strong> {healthDetails.bloodGroup || 'N/A'}</div>
            <div className="detail-card"><strong>Height:</strong> {healthDetails.height ? `${healthDetails.height} cm` : 'N/A'}</div>
            <div className="detail-card"><strong>Weight:</strong> {healthDetails.weight ? `${healthDetails.weight} kg` : 'N/A'}</div>
            <div className="detail-card"><strong>Allergies:</strong> {healthDetails.allergies || 'None'}</div>
            <div className="detail-card"><strong>Disability Status:</strong> {healthDetails.disabilityStatus || 'N/A'}</div>
            <div className="detail-card"><strong>Chronic Diseases:</strong> {healthDetails.chronicDiseases || 'None'}</div>
            <div className="detail-card"><strong>Past Surgeries:</strong> {healthDetails.pastSurgeries || 'None'}</div>
            <div className="detail-card"><strong>Family Medical History:</strong> {healthDetails.familyMedicalHistory || 'None'}</div>
            <div className="detail-card"><strong>Routine Vaccines:</strong> {healthDetails.routineVaccines || 'N/A'}</div>
            <div className="detail-card"><strong>COVID Status:</strong> {healthDetails.covidStatus || 'N/A'}</div>
            <div className="detail-card"><strong>Pregnancy Status:</strong> {healthDetails.pregnancyStatus || 'N/A'}</div>
            <div className="detail-card"><strong>Expected Delivery Date:</strong> {healthDetails.expectedDeliveryDate ? new Date(healthDetails.expectedDeliveryDate).toLocaleDateString() : 'N/A'}</div>
            <div className="detail-card"><strong>Last Checkup Date:</strong> {healthDetails.lastCheckupDate ? new Date(healthDetails.lastCheckupDate).toLocaleDateString() : 'N/A'}</div>
            <div className="detail-card"><strong>Blood Sugar:</strong> {healthDetails.bloodSugar || 'N/A'}</div>
            <div className="detail-card"><strong>BP Readings:</strong> {healthDetails.bpReadings || 'N/A'}</div>
            <div className="detail-card"><strong>Current Medications:</strong> {healthDetails.currentMedications || 'None'}</div>
            <div className="detail-card"><strong>Hospitalization History:</strong> {healthDetails.hospitalizationHistory || 'None'}</div>
            <div className="detail-card"><strong>Mental Health:</strong> {healthDetails.mentalHealth || 'N/A'}</div>
            <div className="detail-card"><strong>Govt Health Scheme:</strong> {healthDetails.govtHealthScheme || 'N/A'}</div>
            <div className="detail-card"><strong>Lifestyle:</strong> {healthDetails.lifestyle || 'N/A'}</div>
            <div className="detail-card"><strong>Infectious Disease History:</strong> {healthDetails.infectiousDiseaseHistory || 'None'}</div>
            <div className="detail-card"><strong>Remarks:</strong> {healthDetails.remarks || 'None'}</div>
          </div>
        </div>
      ) : (
        <div className="no-data">No health details found for this member.</div>
      )}

      <button className="back-btn" onClick={() => navigate(-1)}>Back</button>
    </div>
  );
};

export default FamilyFullDetails;
