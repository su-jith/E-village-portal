import React from "react";
import { Link } from "react-router-dom";
import "./AssignWard.css"; // New CSS file for styling

const AssignWard = () => {
  return (
    <div className="assign-ward-container">
      <h1>Assign Ward</h1>
      <p>Select the category to assign a ward:</p>
      <div className="assign-ward-options">
        <Link to="/dashboard/assign-ward/employee" className="assign-card">
          Assign to Employee
        </Link>
        <Link to="/dashboard/assign-ward/healthcare-worker" className="assign-card">
          Assign to Healthcare Worker
        </Link>
        <Link to="/dashboard/assign-ward/ration-officer" className="assign-card">
          Assign to Ration Officer
        </Link>
      </div>
    </div>
  );
};

export default AssignWard;
