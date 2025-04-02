import React from "react";
import { Link } from "react-router-dom";
import "../styles/UserManagement.css"; // Updated CSS file

const UserManagement = () => {
  return (
    <div className="user-management-x1y2z3">
      <header className="user-header-x1y2z3">
        <h1>User Management</h1>
        <p>Manage different user roles and accounts.</p>
      </header>

      <div className="cards-container-x1y2z3">
        <Link to="/dashboard/employees" className="user-card-x1y2z3">
          <h2>Employee Management</h2>
          <p>Manage employees' details and access levels.</p>
        </Link>

      

        <Link to="/dashboard/healthcare-workers" className="user-card-x1y2z3">
          <h2>Healthcare Workers</h2>
          <p>Assign and manage healthcare workers.</p>
        </Link>

        <Link to="/dashboard/ration-officers" className="user-card-x1y2z3">
          <h2>Ration Officer Management</h2>
          <p>Assign and manage ration officers.</p>
        </Link>

        
      </div>
    </div>
  );
};

export default UserManagement;
