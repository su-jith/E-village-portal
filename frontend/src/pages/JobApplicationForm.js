import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/JobApplicationForm.css'; // Optional for custom styling

const JobApplicationForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // ✅ Destructure what you passed from the previous page
  const { jobId, jobTitle, houseNumber, wardNumber } = location.state || {};

  const [formData, setFormData] = useState({
    jobId: '',
    applicantName: '',
    houseNumber: '',
    wardNumber: '',
    age: '',
    aadhaarNumber: '',
    skills: '',
    experience: ''
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    // ✅ If jobId is missing, show an error
    if (!jobId) {
      setError('No job selected. Please select a job to apply.');
      return;
    }

    // ✅ Fetch family data from localStorage (optional)
    const familyData = JSON.parse(localStorage.getItem('familyData'));
    const { houseDetails } = familyData || {};

    setFormData(prev => ({
      ...prev,
      jobId: jobId,
      houseNumber: houseNumber || houseDetails?.houseNumber || '',
      wardNumber: wardNumber || houseDetails?.wardNumber || ''
    }));
  }, [jobId, houseNumber, wardNumber]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.applicantName || !formData.age || !formData.aadhaarNumber) {
      setError('Please fill in all required fields.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/job-application/submit', formData);
      console.log(response.data);

      setSuccess('Application submitted successfully!');
      setError('');

      // Optional: Redirect after successful submission
      setTimeout(() => {
        navigate('/family-dashboard');
      }, 2000);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to submit application');
    }
  };

  // ✅ If there's no jobId, show this error screen
  if (error && !jobId) {
    return (
      <div className="form-container">
        <p className="error-message">{error}</p>
        <button onClick={() => navigate('/family-dashboard')}>Go Back</button>
      </div>
    );
  }

  return (
    <div className="form-container">
      <h2>Apply for: {jobTitle || 'Unknown Job'}</h2>

      <form onSubmit={handleSubmit} className="application-form">
        <div className="form-group">
          <label>Job ID</label>
          <input type="text" value={formData.jobId} name="jobId" readOnly />
        </div>

        <div className="form-group">
          <label>Applicant Name *</label>
          <input
            type="text"
            name="applicantName"
            value={formData.applicantName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>House Number</label>
          <input
            type="text"
            name="houseNumber"
            value={formData.houseNumber}
            readOnly
          />
        </div>

        <div className="form-group">
          <label>Ward Number</label>
          <input
            type="text"
            name="wardNumber"
            value={formData.wardNumber}
            readOnly
          />
        </div>

        <div className="form-group">
          <label>Age *</label>
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Aadhaar Number *</label>
          <input
            type="text"
            name="aadhaarNumber"
            value={formData.aadhaarNumber}
            onChange={handleChange}
            minLength={12}
            maxLength={12}
            required
          />
        </div>

        <div className="form-group">
          <label>Skills (comma-separated)</label>
          <input
            type="text"
            name="skills"
            value={formData.skills}
            onChange={handleChange}
            placeholder="e.g., Cooking, Farming"
          />
        </div>

        <div className="form-group">
          <label>Experience</label>
          <textarea
            name="experience"
            value={formData.experience}
            onChange={handleChange}
            rows={4}
            placeholder="Describe your experience"
          />
        </div>

        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}

        <div className="button-group">
          <button type="submit" className="submit-button">Submit Application</button>
          <button type="button" onClick={() => navigate('/family-dashboard')} className="cancel-button">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default JobApplicationForm;
