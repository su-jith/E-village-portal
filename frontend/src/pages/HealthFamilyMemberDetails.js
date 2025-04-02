import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/HealthFamilyMemberDetails.css';

const FamilyMemberDetails = () => {
  const { memberId } = useParams();
  const navigate = useNavigate();
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMemberDetails = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/healthcare-worker/healthdata/member/${memberId}`);
        const data = await res.json();
        setMember(data[0]);
      } catch (error) {
        console.error('Error fetching family member details:', error);
        alert('Something went wrong.');
      } finally {
        setLoading(false);
      }
    };

    fetchMemberDetails();
  }, [memberId]);

  const handleDelete = async () => {
    const confirmDelete = window.confirm('Are you sure you want to delete this record?');
    if (!confirmDelete) return;

    try {
      const res = await fetch(`http://localhost:5000/api/healthcare-worker/healthdata/delete-member/${memberId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        alert('Record deleted successfully');
        navigate(-1);
      } else {
        alert('Failed to delete record');
      }
    } catch (error) {
      console.error('Error deleting record:', error);
      alert('Something went wrong.');
    }
  };

  if (loading) {
    return <div className="loading">Loading member details...</div>;
  }

  if (!member) {
    return <div className="no-data">No member data found.</div>;
  }

  return (
    <div className="member-details-container">
      <h2 className="details-heading">Family Member Health Details</h2>

      <div className="details-card">
        <div className="details-section">
          <h3 className="section-heading">Basic Information</h3>
          <p><strong>Blood Group:</strong> {member.bloodGroup}</p>
          <p><strong>Height:</strong> {member.height} cm</p>
          <p><strong>Weight:</strong> {member.weight} kg</p>
          <p><strong>Allergies:</strong> {member.allergies}</p>
        </div>

        <div className="details-section">
          <h3 className="section-heading">Medical History</h3>
          <p><strong>Disability Status:</strong> {member.disabilityStatus}</p>
          <p><strong>Chronic Diseases:</strong> {member.chronicDiseases}</p>
          <p><strong>Past Surgeries:</strong> {member.pastSurgeries}</p>
          <p><strong>Family Medical History:</strong> {member.familyMedicalHistory}</p>
          <p><strong>Routine Vaccines:</strong> {member.routineVaccines}</p>
          <p><strong>Covid Status:</strong> {member.covidStatus}</p>
        </div>

        <div className="details-section">
          <h3 className="section-heading">Vitals & Lifestyle</h3>
          <p><strong>Blood Sugar:</strong> {member.bloodSugar}</p>
          <p><strong>BP Readings:</strong> {member.bpReadings}</p>
          <p><strong>Current Medications:</strong> {member.currentMedications}</p>
          <p><strong>Hospitalization History:</strong> {member.hospitalizationHistory}</p>
          <p><strong>Mental Health:</strong> {member.mentalHealth}</p>
          <p><strong>Lifestyle:</strong> {member.lifestyle}</p>
        </div>
      </div>

      <div className="button-group">
        
        <button className="delete-btn" onClick={handleDelete}>Delete</button>
        <button className="back-btn" onClick={() => navigate(-1)}>Back</button>
      </div>
    </div>
  );
};

export default FamilyMemberDetails;