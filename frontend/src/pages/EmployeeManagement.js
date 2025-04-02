import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/EmployeeManagement.css"; // ✅ Importing styles

const EmployeeManagement = () => {
  const [employees, setEmployees] = useState([]);
  const [editingEmployee, setEditingEmployee] = useState(null); // ✅ Track if editing
  const [formData, setFormData] = useState({
    employeeId: "",
    name: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/employees/all");
      setEmployees(response.data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingEmployee) {
        console.log("Editing employee with ID:", editingEmployee._id); // Debugging step
  
        const response = await axios.put(
          `http://localhost:5000/api/employees/update/${editingEmployee._id}`,
          formData
        );
  
        console.log("Update Response:", response.data);
        alert("Employee updated successfully!");
      } else {
        const response = await axios.post("http://localhost:5000/api/employees/add", formData);
        console.log("Add Response:", response.data);
        alert("Employee added successfully!");
      }
      
      fetchEmployees();
      setEditingEmployee(null);
    } catch (error) {
      console.error("Error:", error);
      alert(`Error: ${error.response?.data?.message || error.message}`);
    }
  };
  
  const handleEdit = (employee) => {
    setFormData(employee);
    setEditingEmployee(employee); // ✅ Set employee for editing
  };

  const handleCancelEdit = () => {
    setFormData({ employeeId: "", name: "", email: "", password: "" });
    setEditingEmployee(null); // ✅ Cancel editing
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      try {
        await axios.delete(`http://localhost:5000/api/employees/${id}`);
        fetchEmployees();
      } catch (error) {
        console.error("Error deleting employee:", error);
      }
    }
  };

  return (
    <div className="employee-management">
      <h2>Employee Management</h2>

      <form onSubmit={handleSubmit}>
        <input type="text" name="employeeId" placeholder="Employee ID" value={formData.employeeId} onChange={handleChange} required />
        <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
        
        <button type="submit">
          {editingEmployee ? "Update Employee" : "Add Employee"}
        </button>

        {editingEmployee && (
          <button type="button" onClick={handleCancelEdit} className="cancel-btn">
            Cancel Edit
          </button>
        )}
      </form>

      <table>
  <thead>
    <tr>
      <th>Employee ID</th>
      <th>Name</th>
      <th>Email</th>
      <th>Password</th>
      <th>Actions</th>
    </tr>
  </thead>
  <tbody>
    {employees.map((employee) => (
      <tr key={employee._id}>
        <td>{employee.employeeId}</td>
        <td>{employee.name}</td>
        <td>{employee.email}</td>
        <td>{employee.password}</td>
        <td>
          <button onClick={() => handleEdit(employee)}>Edit</button>
          <button onClick={() => handleDelete(employee._id)}>Delete</button>
        </td>
      </tr>
    ))}
  </tbody>
</table>

    </div>
  );
};

export default EmployeeManagement;
