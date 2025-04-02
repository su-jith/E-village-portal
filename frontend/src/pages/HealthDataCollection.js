import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/HealthDataCollection.css';

const HealthDataCollection = () => {

  const [wardNumber, setWardNumber] = useState(null);
  const [houses, setHouses] = useState([]);
  const [memberCounts, setMemberCounts] = useState({});
  const [selectedHouse, setSelectedHouse] = useState(null);
  const [familyMembers, setFamilyMembers] = useState([]);
  const [healthDataStatus, setHealthDataStatus] = useState({});

  const { houseNumber } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const assignedWard = localStorage.getItem('assignedWard');
    if (!assignedWard) {
      alert('No assigned ward found.');
      navigate('/employee/dashboard');
      return;
    }

    setWardNumber(assignedWard);
    fetchWardInfo(assignedWard);
    fetchHouses(assignedWard);
  }, [navigate]);

  const fetchWardInfo = async (wardNo) => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/ward/${wardNo}`);
      const data = await response.json();

      if (response.ok) {
        console.log('Ward Info:', data);
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error('Error fetching ward info:', error);
    }
  };

  const fetchMemberCount = async (houseNumber) => {
    try {
      const res = await fetch(`http://localhost:5000/api/employee/family-members/count/${houseNumber}`);
      const data = await res.json();

      if (res.ok) {
        return data.count || 0;
      } else {
        console.error(data.message);
        return 0;
      }
    } catch (error) {
      console.error('Error fetching member count:', error);
      return 0;
    }
  };

  const fetchHouses = async (wardNo) => {
    try {
      const res = await fetch(`http://localhost:5000/api/employee/houses/${wardNo}`);
      const data = await res.json();

      if (res.ok) {
        setHouses(data);

        const counts = {};
        for (let house of data) {
          const count = await fetchMemberCount(house.houseNumber);
          counts[house.houseNumber] = count;
        }
        setMemberCounts(counts);
      } else {
        console.error(data.message);
      }
    } catch (err) {
      console.error('Error fetching houses:', err);
    }
  };

  const handleViewFamilyMembers = async (house) => {
    setSelectedHouse(house);
    try {
      const res = await fetch(`http://localhost:5000/api/employee/family/${house.houseNumber}`);
      const data = await res.json();

      if (res.ok) {
        setFamilyMembers(data);
      } else {
        console.error(data.message);
        setFamilyMembers([]);
      }
    } catch (error) {
      console.error('Error fetching family members:', error);
      setFamilyMembers([]);
    }
  };



  // ✅ Handle View Details Button for each Family Member
  const handleViewDetails = (member) => {
    navigate(`/family-member-details/${member._id}`);
  };

  // ✅ Handle Add Health Data Button for each Family Member
  const handleAddHealthData = (member) => {
    navigate(`/add-health-data/${member._id}`);
  };

  return (
    <div className="house-management-container">
      <h2>Health Data Collection - Houses Overview</h2>

      <div>
        <h3>Total Houses Found: {houses.length}</h3>

        <table border="1" cellPadding="10" style={{ width: '100%', marginTop: '20px' }}>
          <thead>
            <tr>
              <th>House Number</th>
              <th>Ward Number</th>
              <th>House Name</th>
              <th>Ration Entitlement</th>
              <th>Land Ownership</th>
              <th>House Type</th>
              <th>Members</th>
            </tr>
          </thead>
          <tbody>
            {houses.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center' }}>
                  No houses found.
                </td>
              </tr>
            ) : (
              houses.map((house) => (
                <tr key={house._id}>
                  <td>{house.houseNumber}</td>
                  <td>{house.wardNumber}</td>
                  <td>{house.houseName}</td>
                  <td>{house.rationEntitlement}</td>
                  <td>{house.landOwnership}</td>
                  <td>{house.houseType}</td>
                  <td>
                    <button onClick={() => handleViewFamilyMembers(house)}>
                      View Family Members
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* ✅ Family Members Section */}
        {selectedHouse && (
          <div style={{ marginTop: '30px' }}>
            <h3>Family Members for House {selectedHouse.houseNumber} ({selectedHouse.houseName})</h3>

            {familyMembers.length === 0 ? (
              <p>No family members found.</p>
            ) : (
              <table border="1" cellPadding="10" style={{ width: '100%', marginTop: '10px' }}>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Gender</th>
                    <th>Age</th>
                    <th>Relationship</th>
                    <th>Phone</th>
                    <th>Email</th>
                    {/* ✅ Actions Column */}
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {familyMembers.map((member) => (
                    <tr key={member._id}>
                      <td>{member.memberName}</td>
                      <td>{member.gender}</td>
                      <td>{member.age}</td>
                      <td>{member.relationship}</td>
                      <td>{member.phone}</td>
                      <td>{member.email}</td>
                      {/* ✅ Action Buttons */}
                      <td>
                        <button
                          onClick={() => handleViewDetails(member)}
                          style={{ marginRight: '10px' }}
                        >
                          View Details
                        </button>
                        <button
                          onClick={() => handleAddHealthData(member)}
                        >
                          Add Health Data
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

         
           
          </div>
        )}

        {/* ✅ Back to Dashboard Button */}
        <button
          onClick={() => navigate('/healthcareworker-dashboard')}
          style={{ marginTop: '40px', padding: '10px 20px' }}
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default HealthDataCollection;
