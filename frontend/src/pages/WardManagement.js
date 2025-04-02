import React, { useState, useEffect } from "react";
import "../styles/WardManagement.css";
import { useCallback} from "react";

const WardManagement = () => {
  const [wards, setWards] = useState([]);
  const [wardNumber, setWardNumber] = useState("");
  const [numberOfHouses, setNumberOfHouses] = useState("");
  const [wardMember, setWardMember] = useState("");
  const [message, setMessage] = useState("");
  const [editingId, setEditingId] = useState(null); // Store ID of ward being edited
  const token = localStorage.getItem("token");

  const fetchWards = useCallback(() => {
    fetch("http://localhost:5000/api/admin/ward", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setWards(data.wards || []))
      .catch((err) => console.error("Error fetching wards:", err));
  }, [token]);

  useEffect(() => {
    fetchWards();
  }, [fetchWards]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const parsedHouses = parseInt(numberOfHouses, 10);
    if (!wardNumber || isNaN(parsedHouses) || !wardMember) {
      setMessage("Please fill in all fields with valid values.");
      return;
    }

    const payload = {
      wardNumber,
      numberOfHouses: parsedHouses,
      wardMember,
    };

    try {
      let res, data;
      if (editingId) {
        // Update existing ward (PUT request)
        res = await fetch(`http://localhost:5000/api/admin/ward/${editingId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
        data = await res.json();
        setMessage(data.message || "Ward updated successfully!");
      } else {
        // Add new ward (POST request)
        res = await fetch("http://localhost:5000/api/admin/ward", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
        data = await res.json();
        setMessage(data.message || "Ward saved successfully!");
      }

      if (res.ok) {
        setWardNumber("");
        setNumberOfHouses("");
        setWardMember("");
        setEditingId(null); // Reset editing state
        fetchWards();
      } else {
        setMessage(data.message || "Error saving ward. Please try again.");
      }
    } catch (error) {
      console.error("Error saving ward:", error);
      setMessage("Error saving ward. Please try again.");
    }
  };

  const handleEdit = (id) => {
    const wardToEdit = wards.find((ward) => ward._id === id);
    if (wardToEdit) {
      setWardNumber(wardToEdit.wardNumber);
      setNumberOfHouses(wardToEdit.numberOfHouses);
      setWardMember(wardToEdit.wardMember);
      setEditingId(id);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/admin/ward/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        setMessage("Ward deleted successfully!");
        fetchWards();
      } else {
        setMessage("Error deleting ward.");
      }
    } catch (error) {
      console.error("Error deleting ward:", error);
      setMessage("Error deleting ward.");
    }
  };

  return (
    <div className="ward-management-container">
      <h2>Ward Management</h2>
      <form className="ward-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="wardNumber">Ward Number:</label>
          <input
            type="number"
            id="wardNumber"
            value={wardNumber}
            onChange={(e) => setWardNumber(e.target.value)}
            placeholder="Enter ward number"
            required
            disabled={editingId !== null} // Prevent editing wardNumber when updating
          />
        </div>
        <div className="form-group">
          <label htmlFor="numberOfHouses">Number of Houses:</label>
          <input
            type="number"
            id="numberOfHouses"
            value={numberOfHouses}
            onChange={(e) => setNumberOfHouses(e.target.value)}
            placeholder="Enter number of houses"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="wardMember">Ward Member Name:</label>
          <input
            type="text"
            id="wardMember"
            value={wardMember}
            onChange={(e) => setWardMember(e.target.value)}
            placeholder="Enter ward member's name"
            required
          />
        </div>
        <button type="submit" className="submit-btn">
          {editingId ? "Update Ward" : "Add Ward"}
        </button>
        {editingId && (
          <button
            type="button"
            className="cancel-btn"
            onClick={() => {
              setEditingId(null);
              setWardNumber("");
              setNumberOfHouses("");
              setWardMember("");
            }}
          >
            Cancel
          </button>
        )}
      </form>
      {message && <p className="message">{message}</p>}

      <h2>Existing Wards</h2>
      <table className="ward-table">
        <thead>
          <tr>
            <th>Ward Number</th>
            <th>No. of Houses</th>
            <th>Ward Member</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {wards.map((w) => (
            <tr key={w._id}>
              <td>{w.wardNumber}</td>
              <td>{w.numberOfHouses}</td>
              <td>{w.wardMember}</td>
              <td>
                <button className="edit-btn" onClick={() => handleEdit(w._id)}>
                  Edit
                </button>
                <button className="delete-btn" onClick={() => handleDelete(w._id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default WardManagement;
