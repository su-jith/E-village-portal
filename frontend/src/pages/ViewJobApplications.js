import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/ViewJobApplications.css'; // Make sure this path is correct

const ViewJobApplications = () => {
  const { jobId } = useParams(); // This comes from the URL param
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        // Get all job applications matching this jobId
        const res = await axios.get(`http://localhost:5000/api/job-application/application/${jobId}`);
        const data = res.data;

        console.log('Fetched applications:', data);

        setApplications(data.applications); // Assuming the backend sends { applications: [...] }
      } catch (error) {
        console.error('Error fetching applications:', error);
        alert('Something went wrong while fetching applications.');
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [jobId]);

  if (loading) return <div className="loading">Loading applications...</div>;

  if (!applications || applications.length === 0) {
    return <div className="no-data">No applications found for this job.</div>;
  }

  return (
    <div className="applications-container">
      <h2 className="page-heading">Applications for Job ID: {jobId}</h2>

      <div className="applications-list">
        {applications.map(app => (
          <div className="application-card" key={app._id}>
            <h3>{app.applicantName}</h3>
            <p><strong>House Number:</strong> {app.houseNumber}</p>
            <p><strong>Ward Number:</strong> {app.wardNumber}</p>
            <p><strong>Age:</strong> {app.age}</p>
            <p><strong>Aadhaar Number:</strong> {app.aadhaarNumber}</p>

            <p><strong>Skills:</strong> {app.skills && app.skills.length > 0 ? app.skills.join(', ') : 'None'}</p>
            <p><strong>Experience:</strong> {app.experience || 'N/A'}</p>

            <p><strong>Application Date:</strong> {new Date(app.applicationDate).toLocaleDateString()}</p>
            <p><strong>Status:</strong> {app.status}</p>
          </div>
        ))}
      </div>

      <button className="back-btn" onClick={() => navigate(-1)}>
        Back
      </button>
    </div>
  );
};

export default ViewJobApplications;
