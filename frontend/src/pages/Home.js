import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Home.css";
// import image from "../images/home_back.jpg";
import gif from "../images/adm.gif";

function Home() {
  // State for dropdown menu visibility
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Toggle dropdown open/close
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <div className="homepage">
      {/* Top Components Section */}
      <div className="top-components container">
        <div className="brand">E-Village Portal</div>
        <ul className="top-nav">
          <li className="nav-item">
            <Link to="/" className="nav-link">
              Home
            </Link>
          </li>
          <li class="nav-item">
            <a href="#about" class="custom-link">About</a>
          </li>


          <li className="nav-item">
           <a href="#about" class="custom-link">Features</a>
          </li>
        </ul>
        <div className="login-section">
          <button onClick={toggleDropdown} className="nav-link login-btn">
            Login ▾
          </button>
          {dropdownOpen && (
            <ul className="dropdown-menu">
              <li>
                <Link to="/login/admin" className="dropdown-item">
                  Admin Login
                </Link>
              </li>
              <li>
                <Link to="/login/employee" className="dropdown-item">
                  Employee Login
                </Link>
              </li>
              <li>
                <Link to="/login/healthcare-worker" className="dropdown-item">
                  Healthcare Worker Login
                </Link>
              </li>
              <li>
                <Link to="/login/ration-officer" className="dropdown-item">
                  Ration Officer Login
                </Link>
              </li>
              <li>
                <Link to="/login/family" className="dropdown-item">
                  Family Member Login
                </Link>
              </li>
            </ul>
          )}
          <Link to="/login" className="btn get-started-btn">
            Get Started
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <main className="hero container">
        <div className="hero-text">
          <h1>
            Welcome to the <span>E-Village Portal</span>
          </h1>
          <p className="subtitle">
            Manage village data, healthcare services, ration distribution, and family
            information effortlessly.
          </p>
          <Link to="/login" className="btn primary-btn">
            Login Now
          </Link>

          {/* Social Icons */}
          <div className="social-icons">
            <a href="#">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="#">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="#">
              <i className="fab fa-instagram"></i>
            </a>
          </div>
        </div>

        <div className="hero-image">
          {/* Replace with actual image or illustration */}
          <img src={gif} alt="Village Portal Illustration" />
        </div>
      </main>

      {/* Features Section */}
      <section className="features container">
        <div className="feature-card">
          <h2>Admin Dashboard</h2>
          <p>
            Oversee village data, manage user accounts, send notifications, and generate
            insightful analytics.
          </p>
        </div>
        <div className="feature-card">
          <h2>Healthcare Services</h2>
          <p>
            Track family health records, schedule checkups, and provide timely medical
            assistance.
          </p>
        </div>
        <div className="feature-card">
          <h2>Family Portal</h2>
          <p>
            Update your family's data, apply for jobs, and receive important notifications
            easily.
          </p>
        </div>
        <div className="feature-card">
          <h2>Ration Management</h2>
          <p>
            Access ration policies, avail entitlements, and track your ration card status
            seamlessly.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div id="about" className="container">
          <p>&copy; {new Date().getFullYear()} e-Village Portal. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default Home;
