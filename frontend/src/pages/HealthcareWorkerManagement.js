import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/HealthcareWorkerManagement.css";

const HealthcareWorkerManagement = () => {
  const [workers, setWorkers] = useState([]);
  const [editingWorker, setEditingWorker] = useState(null);
  const [formData, setFormData] = useState({
    workerId: "",
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  useEffect(() => {
    fetchWorkers();
  }, []);

  const fetchWorkers = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/healthcare-workers/all");
      setWorkers(response.data);
    } catch (error) {
      console.error("Error fetching workers:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingWorker) {
        await axios.put(`http://localhost:5000/api/healthcare-workers/update/${editingWorker._id}`, formData);
        alert("Healthcare Worker updated successfully!");
      } else {
        await axios.post("http://localhost:5000/api/healthcare-workers/add", formData);
        alert("Healthcare Worker added successfully!");
      }
      fetchWorkers();
      setEditingWorker(null);
    } catch (error) {
      console.error("Error:", error);
      alert(`Error: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleEdit = (worker) => {
    setFormData(worker);
    setEditingWorker(worker);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure?")) {
      await axios.delete(`http://localhost:5000/api/healthcare-workers/${id}`);
      fetchWorkers();
    }
  };

  return (
    <div className="healthcare-management">
      <h2>Healthcare Worker Management</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="workerId" placeholder="Worker ID" value={formData.workerId} onChange={handleChange} required />
        <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
        <input type="text" name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
        <button type="submit">{editingWorker ? "Update" : "Add"} Worker</button>
      </form>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Password</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {workers.map((worker) => (
            <tr key={worker._id}>
              <td>{worker.workerId}</td>
              <td>{worker.name}</td>
              <td>{worker.email}</td>
              <td>{worker.phone}</td>
              <td>{worker.password}</td>
              <td>
                <button onClick={() => handleEdit(worker)}>Edit</button>
                <button onClick={() => handleDelete(worker._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default HealthcareWorkerManagement;