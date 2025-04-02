import React, { useState } from 'react';
import axios from 'axios';
// import '../styles/FamilyLogin.css'; // Assuming you have this CSS or similar

const FamilyLogin = () => {
  const [wardNumber, setWardNumber] = useState('');
  const [houseNumber, setHouseNumber] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/api/employee/family/login', {
        wardNumber,
        houseNumber,
        password,
      });
      console.log('Family login response:', response.data);
      const familyData = response.data;

      // Save logged-in family data
      localStorage.setItem('familyData', JSON.stringify(familyData));

      // Redirect based on ward or a general family dashboard
      window.location.href = `/family-dashboard/ward/${wardNumber}/${houseNumber}`;

      // Or you can use simply: window.location.href = '/family-dashboard';
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-heading">Family Login</h2>
      <form onSubmit={handleLogin} className="login-form">
        <div className="input-group">
          <input
            type="text"
            placeholder="Enter your Ward Number"
            value={wardNumber}
            onChange={(e) => setWardNumber(e.target.value)}
            required
            className="login-input"
          />
        </div>

        <div className="input-group">
          <input
            type="text"
            placeholder="Enter your House Number"
            value={houseNumber}
            onChange={(e) => setHouseNumber(e.target.value)}
            required
            className="login-input"
          />
        </div>

        <div className="input-group">
          <input
            type="password"
            placeholder="Enter your Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="login-input"
          />
        </div>

        <button type="submit" className="login-button">Login</button>

        {error && <p className="error-message">{error}</p>}
      </form>
    </div>
  );
};

export default FamilyLogin;
