import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/ViewComplaints.css'; // Import the external CSS file

const ViewComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/complaints/all');
      setComplaints(res.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching complaints:', error);
      setLoading(false);
    }
  };

  return (
    <div className="complaints-container">
      <h2 className="page-title">Complaints & Feedback</h2>

      {loading ? (
        <div className="loader-container">
          <div className="loader"></div>
        </div>
      ) : complaints.length === 0 ? (
        <div className="no-complaints">No complaints found.</div>
      ) : (
        <div className="complaints-grid">
          {complaints.map((complaint) => (
            <div className="complaint-card" key={complaint._id}>
              <div className="card-header">
                <h3 className="complaint-category">{complaint.category}</h3>
                <span className={`priority-badge ${complaint.priorityLevel.toLowerCase()}`}>
                  {complaint.priorityLevel}
                </span>
              </div>

              <div className="complaint-details">
                <p><strong>Name:</strong> {complaint.fullName}</p>
                <p><strong>Email:</strong> {complaint.emailAddress}</p>
                <p><strong>Designation:</strong> {complaint.designation}</p>
                <p><strong>Ward No:</strong> {complaint.wardNo}</p>
                <p><strong>House No:</strong> {complaint.houseNo}</p>
              </div>

              <div className="complaint-description">
                <h4>Description</h4>
                <p>{complaint.description}</p>
              </div>

              <div className="submitted-date">
                Submitted on: {new Date(complaint.submittedAt).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ViewComplaints;
