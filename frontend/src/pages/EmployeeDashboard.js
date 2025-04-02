import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/EmployeeDashboard.css';

const EmployeeDashboard = () => {
  const [employee, setEmployee] = useState(null);
  const [wardDetails, setWardDetails] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedEmployee = localStorage.getItem('employeeData');

    if (!storedEmployee) {
      alert('No employee logged in. Please login first.');
      window.location.href = '/login/employee';
      return;
    }

    const employeeData = JSON.parse(storedEmployee);
    setEmployee(employeeData);

    if (employeeData.assignedWard) {
      fetchWardDetails(employeeData.assignedWard);
    }
  }, []);

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
    localStorage.removeItem('employeeData');
    window.location.href = '/login/employee';
  };

  const handleStartDataCollection = () => {
    localStorage.setItem('assignedWard', employee.assignedWard);
    navigate('/employee/collect-data');
  };

  const handleNavigateToComplaints = () => {
    navigate('/api/complaints');
  };

  if (!employee) return <div>Loading...</div>;

  return (
    <div className="page-wrapper">
      {/* Main Dashboard Container */}
      <div className="dashboard-container">
        <h2>Welcome to Employee Dashboard</h2>
        <p><strong>Name:</strong> {employee.name}</p>
        <p><strong>Email:</strong> {employee.email}</p>
        <p><strong>Assigned Ward:</strong> {employee.assignedWard || 'No ward assigned'}</p>

        {wardDetails ? (
          <div className="ward-details">
            <h3>Assigned Ward Details</h3>
            <p><strong>Ward Number:</strong> {wardDetails.wardNumber}</p>
            <p><strong>Number of Houses:</strong> {wardDetails.numberOfHouses.join(', ')}</p>
            <p><strong>Ward Member:</strong> {wardDetails.wardMember}</p>

            <button onClick={handleStartDataCollection}>
              Start Family Data Collection
            </button>
          </div>
        ) : (
          employee.assignedWard && <p>Loading ward details...</p>
        )}

        <button className="logout-btn" onClick={handleLogout}>Logout</button>
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

export default EmployeeDashboard;
