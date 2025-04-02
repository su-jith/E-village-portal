import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/AdminLogin.css';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        navigate('/dashboard');
      } else {
        setError(data.errors ? data.errors[0].msg : 'Login failed');
      }
    } catch (err) {
      setError('Something went wrong. Please try again later.');
    }
  };

  const handleBack = () => {
    navigate(-1); // Go back to the previous page
  };

  const handleHome = () => {
    navigate('/'); // Go to home page
  };

  return (
    <div className="login-container-9x8b2">
      {/* Navbar */}
      <div className="navbar-9x8b2">
        <button onClick={handleBack} className="nav-button-9x8b2">
          ← Back
        </button>
        
        <button onClick={handleHome} className="nav-button-9x8b2">
          Home 🏠
        </button>
      </div>

      {/* Login Card */}
      <div className="login-card-9x8b2">
        <h2>Admin Login</h2>
        {error && <p className="error-9x8b2">{error}</p>}

        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Email</label>
          <input 
            type="email" 
            id="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />

          <label htmlFor="password">Password</label>
          <input 
            type="password" 
            id="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />

          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
