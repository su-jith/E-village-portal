//pages/AssignWardtoEmployee.js

import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/AssignWardtoEmployee.css";

const AssignWard = () => {
  const [employees, setEmployees] = useState([]);
  const [wards, setWards] = useState([]);
  const [assignedEmployees, setAssignedEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [selectedWard, setSelectedWard] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchEmployees();
    fetchWards();
    fetchAssignedEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/employees/all");
      const filteredEmployees = response.data.filter(emp => emp.assignedWard === null);
      setEmployees(filteredEmployees);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  const fetchAssignedEmployees = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/employees/all");
      const filteredAssignedEmployees = response.data.filter(emp => emp.assignedWard !== null);
      setAssignedEmployees(filteredAssignedEmployees);
    } catch (error) {
      console.error("Error fetching assigned employees:", error);
    }
  };

  const fetchWards = async () => {
    try {
        // Fetch assigned employees first
        const assignedResponse = await axios.get("http://localhost:5000/api/employees/all");
        const assignedWardNumbers = assignedResponse.data
            .filter(emp => emp.assignedWard !== null)
            .map(emp => emp.assignedWard); // Extract assigned ward numbers

        // Fetch all wards
        const wardResponse = await axios.get("http://localhost:5000/api/admin/ward");

        // Filter out already assigned wards
        const availableWards = wardResponse.data.wards.filter(w => !assignedWardNumbers.includes(w.wardNumber));

        setWards(availableWards);
    } catch (error) {
        console.error("Error fetching wards:", error);
    }
};



const handleSubmit = async (e) => {
  e.preventDefault();
  if (!selectedEmployee || !selectedWard) {
      setMessage("Please select both an employee and a ward.");
      return;
  }

  try {
      const response = await axios.post("http://localhost:5000/api/admin/assign-ward", {
          employeeId: selectedEmployee,
          ward: selectedWard,
      });

      setMessage(response.data.message);
      setSelectedEmployee("");
      setSelectedWard("");
      // Refresh all states to update the UI
      await fetchEmployees();
      await fetchAssignedEmployees();
      await fetchWards(); // ✅ Update available wards after assignment
  } catch (error) {
      console.error("Error assigning ward:", error);
      setMessage("Error assigning ward. Please try again.");
  }
};



const handleDeleteAssignment = async (employeeId) => {
  console.log("Deleting assignment for Employee ID:", employeeId);

  try {
      const response = await fetch("http://localhost:5000/api/admin/remove-assignment", {
          method: "PUT",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify({ employeeId }),
      });

      const data = await response.json();
      console.log("Server Response:", data);

      if (!response.ok) {
          throw new Error(data.message);
      }

      alert("Assignment removed successfully!");

      // 🔄 Refresh states after deletion
      await fetchEmployees();
      await fetchAssignedEmployees();
      await fetchWards(); // ✅ Update available wards after removal
  } catch (error) {
      console.error("Error removing assignment:", error);
      alert(error.message);
  }
};




  return (
    <div className="assign-ward-container">
    <h2>Assign Ward to Employee</h2>
    <form onSubmit={handleSubmit}>
        <div>
            <label>Select Employee:</label>
            <select value={selectedEmployee} onChange={(e) => setSelectedEmployee(e.target.value)} required>
                <option value="">-- Choose an employee --</option>
                {employees.map(emp => (
                    <option key={emp._id} value={emp._id}>
                        {emp.name} ({emp.email})
                    </option>
                ))}
            </select>
        </div>

        <div>
            <label>Select Ward:</label>
            <select value={selectedWard} onChange={(e) => setSelectedWard(e.target.value)} required>
                <option value="">-- Choose a ward --</option>
                {wards.map(w => (
                    <option key={w._id} value={w.wardNumber}>
                        Ward {w.wardNumber} ({w.wardMember})
                    </option>
                ))}
            </select>
        </div>

        <button type="submit">Assign Ward</button>
    </form>

    {message && <p>{message}</p>}

    <h2>Assigned Wards</h2>
    <table>
        <thead>
            <tr>
                <th>Employee Name</th>
                <th>Email</th>
                <th>Assigned Ward</th>
                <th>Action</th> {/* New Column for Delete Button */}
            </tr>
        </thead>
        <tbody>
            {assignedEmployees.map((assign) => (
                <tr key={assign._id}>
                    <td>{assign.name}</td>
                    <td>{assign.email}</td>
                    <td>Ward {assign.assignedWard}</td>
                    <td>
                        <button onClick={() => handleDeleteAssignment(assign._id)}>Remove</button>
                    </td>
                </tr>
            ))}
        </tbody>
    </table>
</div>
  );
};

export default AssignWard;