import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/HealthcareWorkerDashboard.css'; // ✅ Your CSS file

const HealthcareWorkerDashboard = () => {
  const [worker, setWorker] = useState(null);
  const [wardDetails, setWardDetails] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedWorker = localStorage.getItem('healthcareWorkerData');

    if (!storedWorker) {
      alert('No healthcare worker logged in. Please login first.');
      navigate('/login/healthcareworker');
      return;
    }

    const workerData = JSON.parse(storedWorker);
    setWorker(workerData);

    if (workerData.assignedWard) {
      fetchWardDetails(workerData.assignedWard);
    }
  }, [navigate]);

  const fetchWardDetails = async (wardNumber) => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/ward/${wardNumber}`);
      const data = await response.json();

      if (response.ok) {
        setWardDetails(data);
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error('Error fetching ward details:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('healthcareWorkerData');
    navigate('/login/healthcareworker');
  };

  const startHealthDataCollection = () => {
    navigate('/health-data-collection');
  };

  const handleNavigateToComplaints = () => {
    navigate('/api/complaints');
  };

  if (!worker) return <div>Loading...</div>;

  return (
    <div className="page-wrapper">
      
      {/* Main Dashboard Container */}
      <div className="dashboard-container">
        <h2>Welcome to Healthcare Worker Dashboard</h2>

        <div className="profile-section">
          <p><strong>Name:</strong> {worker.name}</p>
          <p><strong>Email:</strong> {worker.email}</p>
          <p><strong>Assigned Ward:</strong> {worker.assignedWard || 'No ward assigned'}</p>
        </div>

        {wardDetails ? (
          <div className="ward-details">
            <h3>Assigned Ward Details</h3>
            <p><strong>Ward Number:</strong> {wardDetails.wardNumber}</p>
            <p><strong>Number of Houses:</strong> {wardDetails.numberOfHouses.join(', ')}</p>
            <p><strong>Ward Member:</strong> {wardDetails.wardMember}</p>
          </div>
        ) : (
          worker.assignedWard && <p>Loading ward details...</p>
        )}

        <button className="start-btn" onClick={startHealthDataCollection}>
          Start Health Data Collection
        </button>

        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* Complaints & Feedback Card OUTSIDE the container */}
      <div className="complaints-card outside-card">
        <h3>Complaints & Feedback</h3>
        <p>If you have any complaints or feedback, please let us know.</p>
        <button onClick={handleNavigateToComplaints}>Register Complaint</button>
      </div>

    </div>
  );
};

export default HealthcareWorkerDashboard;
