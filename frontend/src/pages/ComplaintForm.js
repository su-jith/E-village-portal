import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/ComplaintForm.css'; // Optional: style it up!

const ComplaintForm = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    fullName: '',
    emailAddress: '',
    designation: '',
    wardNo: '',
    houseNo: '',
    category: '',
    description: '',
    priorityLevel: 'Normal',
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('http://localhost:5000/api/complaints/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Complaint submitted successfully!');
        setFormData({
          fullName: '',
          emailAddress: '',
          designation: '',
          wardNo: '',
          houseNo: '',
          category: '',
          description: '',
          priorityLevel: 'Normal',
        });

        setTimeout(() => {
          navigate(-1); // Go back to previous page or dashboard
        }, 2000);
      } else {
        setMessage(data.message || 'Something went wrong.');
      }
    } catch (error) {
      console.error('Error submitting complaint:', error);
      setMessage('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="complaint-form-container">
      <h2>Submit a Complaint / Feedback</h2>

      <form className="complaint-form" onSubmit={handleSubmit}>
        <label>
          Full Name:
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Email Address:
          <input
            type="email"
            name="emailAddress"
            value={formData.emailAddress}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Designation:
          <select
            name="designation"
            value={formData.designation}
            onChange={handleChange}
            required
          >
            <option value="">Select Designation</option>
            <option value="Citizen">Citizen</option>
            <option value="Staff">Staff</option>
            <option value="Service Provider">Service Provider</option>
            <option value="Ration Officer">Ration Officer</option>
            <option value="Healthcare Worker">Healthcare Worker</option>
            <option value="Other">Other</option>
          </select>
        </label>

        <label>
          Ward No:
          <input
            type="text"
            name="wardNo"
            value={formData.wardNo}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          House No:
          <input
            type="text"
            name="houseNo"
            value={formData.houseNo}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Complaint Category:
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="">Select Category</option>
            <option value="Service">Service</option>
            <option value="Staff Behavior">Staff Behavior</option>
            <option value="Facility Issue">Facility Issue</option>
            <option value="Corruption">Corruption</option>
            <option value="Delay">Delay</option>
            <option value="Other">Other</option>
          </select>
        </label>

        <label>
          Description:
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          ></textarea>
        </label>

        <label>
          Priority Level:
          <select
            name="priorityLevel"
            value={formData.priorityLevel}
            onChange={handleChange}
          >
            <option value="Normal">Normal</option>
            <option value="High">High</option>
            <option value="Critical">Critical</option>
          </select>
        </label>

        <button type="submit" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit Complaint'}
        </button>

        {message && <p className="message">{message}</p>}
      </form>
    </div>
  );
};

export default ComplaintForm;
