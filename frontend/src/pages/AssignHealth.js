import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/AssignHealth.css";

const AssignHealth = () => {
  const [workers, setWorkers] = useState([]);
  const [wards, setWards] = useState([]);
  const [assignedWorkers, setAssignedWorkers] = useState([]); // New state for displaying assigned workers
  const [selectedWorker, setSelectedWorker] = useState("");
  const [selectedWard, setSelectedWard] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchWorkers();
    fetchWards();
    fetchAssignedWorkers();
  }, []);

  const fetchWorkers = async () => {
    try {
    const response = await axios.get("http://localhost:5000/api/healthcare-workers/unassigned");
    setWorkers(response.data);
    } catch (error) {
    console.error("Error fetching ration officers:", error);
    }
  };

  const fetchWards = async () => {
    try {
        // Fetch assigned healthcare workers first
        const assignedResponse = await axios.get("http://localhost:5000/api/healthcare-workers/all");
        const assignedWardNumbers = assignedResponse.data
            .filter(worker => worker.assignedWard !== null)
            .map(worker => worker.assignedWard); // Extract assigned ward numbers

        // Fetch all wards
        const wardResponse = await axios.get("http://localhost:5000/api/admin/ward");

        // Ensure wardResponse.data is structured correctly
        if (!wardResponse.data || !Array.isArray(wardResponse.data.wards)) {
            throw new Error("Invalid ward response structure");
        }

        // Filter out already assigned wards
        const availableWards = wardResponse.data.wards.filter(w => !assignedWardNumbers.includes(w.wardNumber));

        setWards(Array.isArray(availableWards) ? availableWards : []);
    } catch (error) {
        console.error("Error fetching wards:", error);
        setWards([]); // Prevents map() from breaking in case of an error
    }
  };

  // Fetch assigned healthcare workers
  const fetchAssignedWorkers = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/healthcare-workers/all");
      const filteredAssignedWorkers = response.data.filter(worker => worker.assignedWard !== null);
      setAssignedWorkers(filteredAssignedWorkers);
    } catch (error) {
      console.error("Error fetching assigned workers:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedWorker || !selectedWard) {
      setMessage("Please select both a healthcare worker and a ward.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/healthcare-workers/assign-ward", {
        workerId: selectedWorker,
        ward: selectedWard,
      });
      setMessage(response.data.message);
      setSelectedWorker("");//  Clear form fields
      setSelectedWard("");// Clear form fields
      await fetchWorkers();// Refresh unassigned workers list
      await fetchAssignedWorkers(); // Refresh assigned workers list
      await fetchWards(); // Refresh available wards list
    } catch (error) {
      setMessage("Error assigning ward.");
    }
  };




  const handleRemoveAssignment = async (workerId) => {
    try {
      const response = await axios.put("http://localhost:5000/api/healthcare-workers/remove-assignment", {
        workerId,
      });

      setMessage(response.data.message);
      await fetchWorkers();
      await fetchAssignedWorkers();
      await fetchWards();
    } catch (error) {
      console.error("Error removing assignment:", error);
      setMessage("Error removing assignment. Please try again.");
    }
  };

  return (
    <div className="assign-ward-container">
      <h2>Assign Ward to Healthcare Worker</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Select Healthcare Worker:</label>
          <select value={selectedWorker} onChange={(e) => setSelectedWorker(e.target.value)} required>
            <option value="">-- Choose a worker --</option>
            {workers.map(worker => (
              <option key={worker._id} value={worker._id}>{worker.name} ({worker.email})</option>
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

      {/* Table to display assigned healthcare workers */}
      <h3>Assigned Healthcare Workers</h3>
      <table>
        <thead>
          <tr>
            <th>Worker ID</th>
            <th>Name</th>
            <th>Phone Number</th>
            <th>Assigned Ward</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
            {assignedWorkers.length > 0 ? (
            
            assignedWorkers.map(worker => (
              <tr key={worker._id}>
                <td>{worker.workerId}</td>
                <td>{worker.name}</td>
                <td>{worker.phone}</td>
                <td>Ward {worker.assignedWard}</td>
                <td>
                  <button onClick={() => handleRemoveAssignment(worker._id)} className="remove-btn">
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

export default AssignHealth;
