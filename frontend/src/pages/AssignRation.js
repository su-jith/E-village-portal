import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/AssignRation.css";

const AssignRation = () => {
  const [rationOfficers, setRationOfficers] = useState([]);
  const [wards, setWards] = useState([]);
  const [assignedOfficers, setAssignedOfficers] = useState([]);
  const [selectedOfficer, setSelectedOfficer] = useState("");
  const [selectedWard, setSelectedWard] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchRationOfficers();
    fetchWards();
    fetchAssignedOfficers();
  }, []);

  const fetchRationOfficers = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/ration-officers/unassigned");
      setRationOfficers(response.data);
    } catch (error) {
      console.error("Error fetching ration officers:", error);
    }
  };

  const fetchWards = async () => {
    try {
      const assignedResponse = await axios.get("http://localhost:5000/api/ration-officers/all");
      const assignedWardNumbers = assignedResponse.data
        .filter(officer => officer.assignedWard !== null)
        .map(officer => officer.assignedWard);

      const wardResponse = await axios.get("http://localhost:5000/api/admin/ward");
      if (!wardResponse.data || !Array.isArray(wardResponse.data.wards)) {
        throw new Error("Invalid ward response structure");
      }

      const availableWards = wardResponse.data.wards.filter(w => !assignedWardNumbers.includes(w.wardNumber));
      setWards(Array.isArray(availableWards) ? availableWards : []);
    } catch (error) {
      console.error("Error fetching wards:", error);
      setWards([]);
    }
  };

  const fetchAssignedOfficers = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/ration-officers/all");
      const filteredAssignedOfficers = response.data.filter(officer => officer.assignedWard !== null);
      setAssignedOfficers(filteredAssignedOfficers);
    } catch (error) {
      console.error("Error fetching assigned officers:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedOfficer || !selectedWard) {
      setMessage("Please select both a Ration Officer and a ward.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/ration-officers/assign-ward", {
        officerId: selectedOfficer,
        ward: selectedWard,
      });
      setMessage(response.data.message);
      setSelectedOfficer("");
      setSelectedWard("");
      await fetchRationOfficers();
      await fetchAssignedOfficers();
      await fetchWards();
    } catch (error) {
      console.error("Error assigning ward:", error);
      setMessage("Error assigning ward. Please try again.");
    }
  };

  const handleRemoveAssignment = async (officerId) => {
    try {
      const response = await axios.put("http://localhost:5000/api/ration-officers/remove-assignment", {
        officerId,
      });

      setMessage(response.data.message);
      await fetchRationOfficers();
      await fetchAssignedOfficers();
      await fetchWards();
    } catch (error) {
      console.error("Error removing assignment:", error);
      setMessage("Error removing assignment. Please try again.");
    }
  };

  return (
    <div className="assign-ward-container">
      <h2>Assign Ward to Ration Officer</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Select Ration Officer:</label>
          <select value={selectedOfficer} onChange={(e) => setSelectedOfficer(e.target.value)} required>
            <option value="">-- Choose an officer --</option>
            {rationOfficers.map(officer => (
              <option key={officer._id} value={officer._id}>{officer.name} ({officer.email})</option>
            ))}
          </select>
        </div>
        <div>
          <label>Select Ward:</label>
          <select value={selectedWard} onChange={(e) => setSelectedWard(e.target.value)} required>
            <option value="">-- Choose a ward --</option>
            {wards.map(ward => (
              <option key={ward._id} value={ward.wardNumber}>Ward {ward.wardNumber}</option>
            ))}
          </select>
        </div>
        <button type="submit">Assign Ward</button>
      </form>
      {message && <p>{message}</p>}

      <h3>Assigned Ration Officers</h3>
      <table>
        <thead>
          <tr>
            <th>Officer ID</th>
            <th>Name</th>
            <th>Phone Number</th>
            <th>Assigned Ward</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {assignedOfficers.length > 0 ? (
            assignedOfficers.map(officer => (
              <tr key={officer._id}>
                <td>{officer.userId}</td>
                <td>{officer.name}</td>
                <td>{officer.phone}</td>
                <td>Ward {officer.assignedWard}</td>
                <td>
                  <button onClick={() => handleRemoveAssignment(officer._id)} className="remove-btn">
                    Remove
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No ration officers assigned yet.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AssignRation;
