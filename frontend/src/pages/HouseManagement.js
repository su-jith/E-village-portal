import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/HouseManagement.css';

const HouseManagement = () => {
  const [wardNumber, setWardNumber] = useState(null);
  const [houses, setHouses] = useState([]);
  const [houseNumber, setHouseNumber] = useState('');
  const [houseName, setHouseName] = useState('');
  const [maxHouses, setMaxHouses] = useState(0);
  const [editingHouse, setEditingHouse] = useState(null);
  const [rationEntitlement, setRationEntitlement] = useState('');
  const [landOwnership, setLandOwnership] = useState('');
  const [houseType, setHouseType] = useState('');
  const [password, setPassword] = useState('');
  const [memberCounts, setMemberCounts] = useState({});


  const navigate = useNavigate();

  const resetForm = () => {
    setHouseNumber('');
    setHouseName('');
    setRationEntitlement('');
    setLandOwnership('');
    setHouseType('');
    setPassword('');
    setEditingHouse(null);
  };
  

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
  }, []);

  const fetchWardInfo = async (wardNo) => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/ward/${wardNo}`);
      const data = await response.json();

      if (response.ok) {
        setMaxHouses(data.numberOfHouses);
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
      console.log("Fetching family member count for houseNumber:", houseNumber);

  
      if (res.ok) {
        return data.count || 0; // assuming the API returns { count: number }
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
  
        // Fetch family members count for each house
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
  
  

  const handleAddHouse = async () => {
    if (
      !houseNumber ||
      !houseName ||
      !rationEntitlement ||
      !landOwnership ||
      !houseType ||
      !password
    ) {
      alert('Please fill out all fields.');
      return;
    }
  
    if (houses.length >= maxHouses) {
      alert(`You have already added the maximum number of houses (${maxHouses}) for this ward.`);
      return;
    }
  
    try {
      const res = await fetch('http://localhost:5000/api/employee/houses/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          houseNumber,
          houseName,
          wardNumber,
          rationEntitlement,
          landOwnership,
          houseType,
          password,
        }),
      });
  
      const data = await res.json();
  
      if (res.ok) {
        alert('House added successfully!');
        resetForm();
        fetchHouses(wardNumber);
        resetForm();
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Error adding house:', error);
    }
  };
  

  const handleEditClick = (house) => {
    setEditingHouse(house);
    setHouseNumber(house.houseNumber);
    setHouseName(house.houseName);
    setRationEntitlement(house.rationEntitlement);
    setLandOwnership(house.landOwnership);
    setHouseType(house.houseType);
    setPassword(house.password); // ⚠️ only because you're storing unhashed
  };
  

  const handleUpdateHouse = async () => {
    if (
      !houseNumber ||
      !houseName ||
      !rationEntitlement ||
      !landOwnership ||
      !houseType ||
      !password
    ) {
      alert('Please fill out all fields.');
      return;
    }
  
    try {
      const res = await fetch(`http://localhost:5000/api/employee/houses/update/${editingHouse._id}`, {

        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          houseNumber,
          houseName,
          rationEntitlement,
          landOwnership,
          houseType,
          password,
        }),
      });
  
      const data = await res.json();
  
      if (res.ok) {
        alert('House updated successfully!');
        resetForm();
        fetchHouses(wardNumber);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Error updating house:', error);
    }
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
        fetchHouses(wardNumber);
        resetForm();
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Error deleting house:', error);
    }
  };

  // ✅ MODIFIED to pass houseNumber and wardNumber
  const handleAddMembers = (house) => {
    navigate(`/employee/family/add/${house.wardNumber}/${house.houseNumber}`);
  };

  const handleViewMembers = (house) => {
    navigate(`/employee/family-details/${house.wardNumber}/${house.houseNumber}`);
  };

  return (
    <div className="house-management-container">
      <h2>House Management - Ward {wardNumber}</h2>

      <p>Total Houses Allowed: {maxHouses}</p>
      <p>Houses Added: {houses.length}</p>

      <div className="add-house-form">
        <input
          type="number"
          placeholder="House Number"
          value={houseNumber}
          onChange={(e) => setHouseNumber(e.target.value)}
        />
        <input
          type="text"
          placeholder="House Name"
          value={houseName}
          onChange={(e) => setHouseName(e.target.value)}
        />

        <select
          value={rationEntitlement}
          onChange={(e) => setRationEntitlement(e.target.value)}
        >
          <option value="">Select Ration Entitlement</option>
          <option value="APL">APL</option>
          <option value="BPL">BPL</option>
        </select>


        <select
          value={landOwnership}
          onChange={(e) => setLandOwnership(e.target.value)}
        >
          <option value="">Select Land Ownership</option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>

        <select
          value={houseType}
          onChange={(e) => setHouseType(e.target.value)}
        >
          <option value="">Select House Type</option>
          <option value="Own">Own</option>
          <option value="Rented">Rented</option>
        </select>


        <input
          type="text"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />


      {editingHouse ? (
      <>
        <button onClick={handleUpdateHouse}>Update House</button>
        <button
          onClick={resetForm} >
              Cancel
        </button>
          </>
        ) : (
          <button onClick={handleAddHouse}>Add House</button>
        )}
      </div>

      <h3>Houses in Ward {wardNumber}</h3>
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
      <td>{memberCounts[house.houseNumber] || 0}</td> {/* ✅ Corrected */}
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


      <button onClick={() => navigate('/employee-dashboard')} style={{ marginTop: '20px' }}>
        Back to Dashboard
      </button>
    </div>
  );
};

export default HouseManagement;
