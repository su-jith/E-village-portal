import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/RationOfficerManagement.css"; // ✅ Ensure this file exists

const RationOfficerManagement = () => {
  const [rationOfficers, setRationOfficers] = useState([]);
  const [editingOfficer, setEditingOfficer] = useState(null); // ✅ Track editing state
  const [formData, setFormData] = useState({
    userId: "",
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  useEffect(() => {
    fetchRationOfficers();
  }, []);

  const fetchRationOfficers = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/api/ration-officers/all");
      setRationOfficers(data);
    } catch (error) {
      console.error("Error fetching Ration Officers:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingOfficer) {
        await axios.put(
          `http://localhost:5000/api/ration-officers/update/${editingOfficer._id}`,
          formData
        );
        alert("Ration Officer updated successfully!");
      } else {
        await axios.post("http://localhost:5000/api/ration-officers/add", formData);
        alert("Ration Officer added successfully!");
      }

      fetchRationOfficers();
      handleCancelEdit(); // ✅ Reset form
    } catch (error) {
      console.error("Error:", error);
      alert(`Error: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleEdit = (officer) => {
    setFormData({ ...officer, password: officer.password || "" }); // ✅ Include password for display
    setEditingOfficer(officer);
  };

  const handleCancelEdit = () => {
    setFormData({ userId: "", name: "", email: "", phone: "", password: "" });
    setEditingOfficer(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this Ration Officer?")) {
      try {
        await axios.delete(`http://localhost:5000/api/ration-officers/${id}`);
        fetchRationOfficers();
      } catch (error) {
        console.error("Error deleting Ration Officer:", error);
      }
    }
  };

  return (
    <div className="ration-officer-management">
      <h2>Ration Officer Management</h2>

      <form onSubmit={handleSubmit}>
        <input type="text" name="userId" placeholder="User ID" value={formData.userId} onChange={handleChange} required />
        <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
        <input type="text" name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} required />
        <input type="text" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />

        <button type="submit">
          {editingOfficer ? "Update Ration Officer" : "Add Ration Officer"}
        </button>

        {editingOfficer && (
          <button type="button" onClick={handleCancelEdit} className="cancel-btn">
            Cancel Edit
          </button>
        )}
      </form>

      <table>
        <thead>
          <tr>
            <th>User ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Password</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rationOfficers.map((officer) => (
            <tr key={officer._id}>
              <td>{officer.userId}</td>
              <td>{officer.name}</td>
              <td>{officer.email}</td>
              <td>{officer.phone}</td>
              <td>{officer.password}</td> {/* ✅ Show password */}
              <td>
                <button onClick={() => handleEdit(officer)}>Edit</button>
                <button onClick={() => handleDelete(officer._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RationOfficerManagement;
