import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/RationOfficerDashboard.css'; // Ensure your CSS file is linked properly

const RationOfficerDashboard = () => {
  const [officer, setOfficer] = useState(null);
  const [wardDetails, setWardDetails] = useState(null);
  const [houses, setHouses] = useState([]);
  const [memberCounts, setMemberCounts] = useState({});
  
  const navigate = useNavigate();

  useEffect(() => {
    const storedOfficer = localStorage.getItem('rationOfficerData');

    if (!storedOfficer) {
      alert('No ration officer logged in. Please login first.');
      window.location.href = '/login/rationofficer';
      return;
    }

    const officerData = JSON.parse(storedOfficer);
    setOfficer(officerData);

    if (officerData.assignedWard) {
      fetchWardDetails(officerData.assignedWard);
      fetchHouses(officerData.assignedWard);
    }
  }, []);

  const fetchWardDetails = async (wardNumber) => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/ward/${wardNumber}`);
      const data = await response.json();

      if (response.ok) {
        setWardDetails(data);
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error('Error fetching ward details:', error);
    }
  };

  const fetchHouses = async (wardNumber) => {
    try {
      const response = await fetch(`http://localhost:5000/api/employee/houses/${wardNumber}`);
      const data = await response.json();

      if (response.ok) {
        setHouses(data);
        fetchAllMemberCounts(data);
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error('Error fetching house details:', error);
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

  const fetchAllMemberCounts = async (houses) => {
    const counts = {};
    for (const house of houses) {
      const count = await fetchMemberCount(house.houseNumber);
      counts[house.houseNumber] = count;
    }
    setMemberCounts(counts);
  };

  const handleLogout = () => {
    localStorage.removeItem('rationOfficerData');
    window.location.href = '/login/rationofficer';
  };

  if (!officer) return <div>Loading...</div>;

  return (
    <>
      {/* Dashboard Content */}
      <div className="dashboard-container">
        <h2>Welcome to Ration Officer Dashboard</h2>

        <p><strong>Name:</strong> {officer.name}</p>
        <p><strong>Email:</strong> {officer.email}</p>
        <p><strong>Assigned Ward:</strong> {officer.assignedWard || 'No ward assigned'}</p>

        {wardDetails ? (
          <div className="ward-details">
            <h3>Assigned Ward Details</h3>
            <p><strong>Ward Number:</strong> {wardDetails.wardNumber}</p>
            <p><strong>Number of Houses:</strong> {wardDetails.numberOfHouses.join(', ')}</p>
            <p><strong>Ward Member:</strong> {wardDetails.wardMember}</p>
          </div>
        ) : (
          officer.assignedWard && <p>Loading ward details...</p>
        )}

        <div className="house-list">
          <h3>Houses in Assigned Ward</h3>
          {houses.length > 0 ? (
            <table className="house-table">
              <thead>
                <tr>
                  <th>House No</th>
                  <th>House Name</th>
                  <th>Ration Entitlement</th>
                  <th>No. of Members</th>
                </tr>
              </thead>
              <tbody>
                {houses.map((house) => (
                  <tr key={house._id}>
                    <td>{house.houseNumber}</td>
                    <td>{house.houseName}</td>
                    <td>{house.rationEntitlement}</td>
                    <td>{memberCounts[house.houseNumber] !== undefined ? memberCounts[house.houseNumber] : 'Loading...'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No houses found in this ward.</p>
          )}
        </div>

        <button
          className="notify-btn"
          onClick={() => navigate('/ration-notification')}
        >
          Send Ration Notification
        </button>

        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>

      {/* Complaints & Feedback Card */}
      <div className="complaint-feedback-card">
        <h3>Complaints & Feedback</h3>
        <p>Submit your complaints or feedback regarding services, staff, or facilities.</p>
        <button
          className="complaint-feedback-btn"
          onClick={() => navigate('/api/complaints')}
        >
          Submit Now
        </button>
      </div>
    </>
  );
};

export default RationOfficerDashboard;
