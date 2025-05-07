import React, { useEffect, useState } from 'react';
import axios from "axios";

import { useParams, useNavigate } from 'react-router-dom';
import '../styles/FamilyDetails.css';

const FamilyDetails = () => {
  const { houseNumber, wardNumber } = useParams();
  const navigate = useNavigate();

  const [familyMembers, setFamilyMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFamilyMembers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/employee/family/${wardNumber}/${houseNumber}`);
      const data = await res.json();
      console.log('Fetched family members:', data); // Debugging line
      if (res.ok) {
        setFamilyMembers(data);
      } else {
        alert(data.message || 'Failed to fetch family members.');
      }
    } catch (error) {
      console.error('Error fetching family members:', error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    if (houseNumber) {
      fetchFamilyMembers();
    }
  }, [houseNumber]);

  // Delete a family member
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this member?')) return;

    try {
      const res = await fetch(`http://localhost:5000/api/employee/family/delete/${id}`, {
        method: 'DELETE',
      });

      const data = await res.json();

      if (res.ok) {
        alert('Member deleted successfully!');
        fetchFamilyMembers(); // Refresh after delete
      } else {
        alert(data.message || 'Failed to delete member.');
      }
    } catch (error) {
      console.error('Error deleting member:', error);
    }
  };

  // Navigate to Edit page
  const handleEdit = async (member) => {
    navigate(`/employee/family/edit/${houseNumber}/${member._id}`, { state: { member } });
    try {
      const response = await axios.put(
        `http://localhost:5000/api/family/update/${member._id}`,
        { member },
        { headers: { 'Content-Type': 'application/json' } }
      );
      alert(response.data.message);
      navigate(`/employee/family/${houseNumber}`); // Navigate back after update
    } catch (error) {
      console.error("Error updating member:", error);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ textAlign: 'center' }}>Family Members of House {houseNumber}</h2>

      <button
        onClick={() => navigate(`/employee/house-management`)}
        style={{
          padding: '10px',
          marginBottom: '20px',
          backgroundColor: '#f0f0f0',
          border: '1px solid #ddd',
          cursor: 'pointer'
        }}
      >
        Back to House Management
      </button>

      {loading ? (
        <p>Loading family members...</p>
      ) : familyMembers.length === 0 ? (
        <p>No family members found for this house.</p>
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '20px' }}>
          {familyMembers.map((member, index) => (
            <div
              key={index}
              style={{
                width: '300px',
                border: '1px solid #ddd',
                borderRadius: '10px',
                padding: '15px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                backgroundColor: '#fff'
              }}
            >
              <h3 style={{ textAlign: 'center' }}>{member.memberName}</h3>
              <p><strong>Date of Birth:</strong> {member.dob}</p>
              <p><strong>Age:</strong> {member.age}</p>
              <p><strong>Gender:</strong> {member.gender}</p>
              <p><strong>Aadhaar Number:</strong> {member.aadhaarNumber}</p>
              <p><strong>Relationship:</strong> {member.relationship}</p>
              <p><strong>Marital Status:</strong> {member.maritalStatus}</p>
              <p><strong>Phone:</strong> {member.phone}</p>
              <p><strong>Email:</strong> {member.email}</p>
              <p><strong>Highest Qualification:</strong> {member.highestQualification}</p>
              <p><strong>Educational Status:</strong> {member.currentEducationalStatus}</p>
              <p><strong>Occupation:</strong> {member.occupation}</p>
              <p><strong>Employer:</strong> {member.employer}</p>
              <p><strong>Employment Type:</strong> {member.employmentType}</p>
              <p><strong>Skills:</strong> {member.skills}</p>
              <p><strong>Monthly Income:</strong> ₹{member.monthlyIncome}</p>

              <hr style={{ margin: '10px 0' }} />

              <p><strong>Ration Entitlement:</strong> {member.rationEntitlement}</p>
              <p><strong>Land Ownership:</strong> {member.landOwnership}</p>
              <p><strong>House Type:</strong> {member.houseType}</p>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                <button
                  onClick={() => handleEdit(member)}
                  style={{ backgroundColor: '#4CAF50', color: 'white', padding: '8px', borderRadius: '5px', cursor: 'pointer' }}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(member._id)}
                  style={{ backgroundColor: '#f44336', color: 'white', padding: '8px', borderRadius: '5px', cursor: 'pointer' }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FamilyDetails;
