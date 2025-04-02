import React, { useState } from 'react';
import axios from 'axios';
import '../styles/EmployeeLogin.css';


const EmployeeLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/api/employees/login', {
        email,
        password,
      });

      const employeeData = response.data;

      // Save the logged-in employee data (you can use Redux, Context, etc. - here we use localStorage for simplicity)
      localStorage.setItem('employeeData', JSON.stringify(employeeData));

      // Redirect to Dashboard
      window.location.href = '/employee-dashboard';
    } catch (err) {
      console.error(err);
      setError(err.response.data.message || 'Login failed');
    }
  };

  return (
    <div className="login-container">
  <h2 className="login-heading">Employee Login</h2>
  <form onSubmit={handleLogin} className="login-form">
    <div className="input-group">
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="login-input"
      />
    </div>

    <div className="input-group">
      <input
        type="password"
        placeholder="Enter your password"
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

export default EmployeeLogin;
