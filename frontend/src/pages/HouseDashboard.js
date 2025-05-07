import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/HouseManagement.css';

const HouseManagement = () => {
  const [houses, setHouses] = useState([]);
  const [memberCounts, setMemberCounts] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    fetchAllHouses();
  }, []);

  const fetchMemberCount = async (houseNumber) => {
    try {
      const res = await fetch(`http://localhost:5000/api/employee/family-members/count/${houseNumber}`);
      const data = await res.json();
      return res.ok ? (data.count || 0) : 0;
    } catch (error) {
      console.error('Error fetching member count:', error);
      return 0;
    }
  };

  const fetchAllHouses = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/employee/houses/all`);
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

  const handleAddMembers = (house) => {
    navigate(`/employee/family/add/${house.houseNumber}`);
  };

  const handleViewMembers = (house) => {
    navigate(`/employee/family-details/${house.houseNumber}`);
  };

  const handleEditClick = (house) => {
    navigate(`/employee/house/edit/${house._id}`);
  };

  const handleDeleteHouse = async (id) => {
    if (!window.confirm('Are you sure you want to delete this house?')) return;

    try {
      const res = await fetch(`http://localhost:5000/api/employee/houses/delete/${id}`, {
        method: 'DELETE',
      });

      const data = await res.json();

      if (res.ok) {
        alert('House deleted successfully!');
        fetchAllHouses();
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Error deleting house:', error);
    }
  };

  return (
    <div className="house-management-container">
      <h2>House Management - All Houses</h2>

      <p>Total Houses in Database: {houses.length}</p>

     

      <table border="1" cellPadding="10" style={{ width: '100%', marginTop: '20px' }}>
        <thead>
          <tr>
            <th>House No</th>
            <th>Ward No</th>
            <th>House Name</th>
            <th>No. of Members</th>
            <th>Ration</th>
            <th>Land Ownership</th>
            <th>House Type</th>
            <th>Password</th>
            <th>Family</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {houses.map((house) => (
            <tr key={house._id}>
              <td>{house.houseNumber}</td>
              <td>{house.wardNumber}</td>
              <td>{house.houseName}</td>
              <td>{memberCounts[house.houseNumber] || 0}</td>
              <td>{house.rationEntitlement}</td>
              <td>{house.landOwnership}</td>
              <td>{house.houseType}</td>
              <td>{house.password}</td>
              <td>
                <button onClick={() => handleAddMembers(house)}>Add Members</button>
                <button onClick={() => handleViewMembers(house)} style={{ marginLeft: '10px' }}>
                  View Members
                </button>
              </td>
              <td>
                <button onClick={() => handleEditClick(house)}>Edit</button>
                <button onClick={() => handleDeleteHouse(house._id)} style={{ marginLeft: '10px' }}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button onClick={() => navigate('/dashboard')} style={{ marginTop: '20px' }}>
        Back to Dashboard
      </button>
    </div>
  );
};

export default HouseManagement;
