import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/HouseDashboard.css"; // CSS for styling
import { Link } from "react-router-dom"; // Import Link for navigation

const HouseManagement = () => {
  const [houses, setHouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Fetch house data from the backend API
    axios
      .get("http://localhost:5000/api/employee/overview/houses") // Change URL as per your backend
      .then((response) => {
        setHouses(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to load house data");
        setLoading(false);
      });
  }, []);

  return (
    <div className="house-management-abc123">
      <header className="house-header-abc123">
        <h1>House Management</h1>
        <p>View and manage registered houses in the system.</p>
      </header>

      {loading ? (
        <p className="loading-abc123">Loading house data...</p>
      ) : error ? (
        <p className="error-abc123">{error}</p>
      ) : (
        <table className="house-table-abc123">
          <thead>
            <tr>
              <th>House No</th>
              <th>House Name</th>
              <th>Ward Number</th>
              <th>Ration Entitlement</th>
              <th>Land Ownership</th>
            </tr>
          </thead>
          <tbody>
            {houses.map((house) => (
              <tr key={house.houseNo}>
                <td>{house.houseNumber}</td>
                <td>{house.houseName}</td>
                <td>{house.wardNumber}</td>
                <td>{house.rationEntitlement}</td>
                <td>{house.landOwnership}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default HouseManagement;
