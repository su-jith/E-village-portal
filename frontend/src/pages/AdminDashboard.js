import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/AdminDashboard.css";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="admin-dashboard-ab12cd34">
      <header className="dashboard-header-ab12cd34">
        <h1>Admin Dashboard</h1>
        <h2>Welcome Admin</h2>

        {/* Logout Button at Top-Right */}
        <button onClick={handleLogout} className="logout-button-ab12cd34">
          Logout
        </button>
      </header>

      <div className="cards-container-ab12cd34">
        <Link to="/dashboard/overview" className="card-ab12cd34">
          <h2>Dashboard Overview</h2>
          <p>View key statistics and recent activities.</p>
        </Link>

        {/* Redirect to User Management Page */}
        <Link to="/dashboard/user-management" className="card-ab12cd34">
          <h2>User Management</h2>
          <p>Manage users and roles.</p>
        </Link>

        <Link to="/dashboard/assign-ward" className="card-ab12cd34">
          <h2>Assign Ward</h2>
          <p>Assign wards to employees, healthcare workers, or ration officers.</p>
        </Link>

        <Link to="/dashboard/wards" className="card-ab12cd34">
          <h2>Ward Management</h2>
          <p>Ward configurations</p>
        </Link>

        <Link to="/dashboard/job-portal" className="card-ab12cd34">
          <h2>Job Portal</h2>
          <p>Configure system settings and preferences.</p>
        </Link>

       

        <Link to="/api/view-complaints" className="card-ab12cd34">
          <h2>Complaints and Feedbacks</h2>
          <p>View complaints and feedback.</p>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
