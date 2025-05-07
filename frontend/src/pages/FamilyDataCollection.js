import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import '../styles/FamilyDataCollection.css';

const FamilyDataCollectionA1B2C3 = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { wardNumber, houseNumber, familyMemberId } = useParams();
 // Added familyMemberId for update case
  
  console.log('Params:', useParams());
  console.log('houseNumber:', houseNumber);
  console.log('familyMemberId:', familyMemberId);


  const [houseInfo, setHouseInfo] = useState({
    rationEntitlement: '',
    landOwnership: '',
    houseType: ''
  });

  const [formData, setFormData] = useState({
    memberName: '',
    dob: '',
    age: '',
    gender: '',
    aadhaarNumber: '',
    relationship: '',
    maritalStatus: '',
    phone: '',
    email: '',
    highestQualification: '',
    currentEducationalStatus: '',
    occupation: '',
    employer: '',
    employmentType: '',
    skills: '',
    monthlyIncome: '',
  });

  const isEditMode = Boolean(familyMemberId);

  // Fetch house and ward details on component mount
  useEffect(() => {
    const fetchHouseDetails = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/employee/house/${houseNumber}`);
        const data = await res.json();

        if (res.ok && data.length > 0) {
          setHouseInfo({
            rationEntitlement: data[0].rationEntitlement,
            landOwnership: data[0].landOwnership,
            houseType: data[0].houseType
          });
          
        } else {
          alert(data.message || 'Failed to fetch house details.');
        }
      } catch (error) {
        console.error('Error fetching house details:', error);
      }
    };

    if (houseNumber) {
      fetchHouseDetails();
    }
  }, [houseNumber]);

  // Fetch family member details if editing
  useEffect(() => {
    const fetchFamilyMemberDetails = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/employee/family/member/${familyMemberId}`);
        const data = await res.json();

        if (res.ok && data) {
          setFormData({
            memberName: data.memberName,
            dob: data.dob,
            age: calculateAge(data.dob),
            gender: data.gender,
            aadhaarNumber: data.aadhaarNumber,
            relationship: data.relationship,
            maritalStatus: data.maritalStatus,
            phone: data.phone,
            email: data.email,
            highestQualification: data.highestQualification,
            currentEducationalStatus: data.currentEducationalStatus,
            occupation: data.occupation,
            employer: data.employer,
            employmentType: data.employmentType,
            skills: data.skills,
            monthlyIncome: data.monthlyIncome
          });
        } else {
          alert(data.message || 'Failed to fetch family member details.');
        }
      } catch (error) {
        console.error('Error fetching family member details:', error);
      }
    };

    if (isEditMode) {
      fetchFamilyMemberDetails();
    }
  }, [familyMemberId, isEditMode]);

  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'dob') {
      const age = calculateAge(value);
      setFormData({
        ...formData,
        dob: value,
        age: age >= 0 ? age : ''
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!houseNumber || !wardNumber) {
      alert('Missing house or ward number!');
      return;
    }
    
    if (formData.aadhaarNumber.length !== 12) {
      alert('Aadhaar number must be 12 digits.');
      return;
    }

    if (formData.phone && formData.phone.length !== 10) {
      alert('Phone number must be 10 digits.');
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/employee/family/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          houseNumber,
          wardNumber,
          rationEntitlement: houseInfo.rationEntitlement,
          landOwnership: houseInfo.landOwnership,
          houseType: houseInfo.houseType,
          memberName: formData.name,
          ...formData
        })
      });

      const data = await res.json();

      if (res.ok) {
        alert('Family member added successfully!');
        navigate(`/employee/house-management`);
      } else {
        alert(data.message || 'Failed to add family member.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!familyMemberId) {
      alert('Missing family member ID!');
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/employee/family/update/${familyMemberId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          houseNumber,
          wardNumber,
          rationEntitlement: houseInfo.rationEntitlement,
          landOwnership: houseInfo.landOwnership,
          houseType: houseInfo.houseType,
          ...formData
        })
      });

      const data = await res.json();

      if (res.ok) {
        alert('Family member updated successfully!');
        navigate(`/employee/house-management`);
      } else {
        alert(data.message || 'Failed to update family member.');
      }
    } catch (error) {
      console.error('Error updating family member:', error);
    }
  };

  return (
    <div className="fdc-container-A1B2C3">
      <h2 className="fdc-title-A1B2C3">
        {isEditMode ? 'Update Family Member' : 'Add Family Member'}
      </h2>

      {/* Ward and House Numbers */}
      <div className="fdc-info-A1B2C3">
        <label className="fdc-label-A1B2C3">Ward Number</label>
        <input
          className="fdc-input-A1B2C3"
          value={wardNumber || ''}
          disabled
        />

        <label className="fdc-label-A1B2C3">House Number</label>
        <input
          className="fdc-input-A1B2C3"
          value={houseNumber || ''}
          disabled
        />

        <label className="fdc-label-A1B2C3">Ration Entitlement</label>
        <input
          className="fdc-input-A1B2C3"
          value={houseInfo.rationEntitlement || ''}
          disabled
        />

        <label className="fdc-label-A1B2C3">Land Ownership</label>
        <input
          className="fdc-input-A1B2C3"
          value={houseInfo.landOwnership || ''}
          disabled
        />

        <label className="fdc-label-A1B2C3">House Type</label>
        <input
          className="fdc-input-A1B2C3"
          value={houseInfo.houseType || ''}
          disabled
        />
      </div>

      {/* Family Member Form */}
      <form
        onSubmit={isEditMode ? handleUpdate : handleSubmit}
        className="fdc-form-A1B2C3"
      >
        <label className="fdc-label-A1B2C3">Member Name</label>
        <input
          name="memberName"
          placeholder="Member Name"
          onChange={handleChange}
          value={formData.memberName}
          className="fdc-input-A1B2C3"
          required
        />

        <label className="fdc-label-A1B2C3">Date of Birth</label>
        <input
          name="dob"
          type="date"
          onChange={handleChange}
          value={formData.dob}
          className="fdc-input-A1B2C3"
          required
        />

        <label className="fdc-label-A1B2C3">Age</label>
        <input
          value={formData.age || ''}
          disabled
          className="fdc-input-disabled-A1B2C3"
        />

        <label className="fdc-label-A1B2C3">Gender</label>
        <select
          name="gender"
          onChange={handleChange}
          value={formData.gender}
          className="fdc-select-A1B2C3"
          required
        >
          <option value="">Select Gender</option>
          <option>Male</option>
          <option>Female</option>
          <option>Other</option>
        </select>

        <label className="fdc-label-A1B2C3">Aadhaar Number</label>
        <input
          name="aadhaarNumber"
          placeholder="12-digit Aadhaar Number"
          onChange={handleChange}
          value={formData.aadhaarNumber}
          maxLength="12"
          className="fdc-input-A1B2C3"
          required
        />

        <label className="fdc-label-A1B2C3">Relationship</label>
        <input
          name="relationship"
          placeholder="Relationship"
          onChange={handleChange}
          value={formData.relationship}
          className="fdc-input-A1B2C3"
          required
        />

        <label className="fdc-label-A1B2C3">Marital Status</label>
        <select
          name="maritalStatus"
          onChange={handleChange}
          value={formData.maritalStatus}
          className="fdc-select-A1B2C3"
          required
        >
          <option value="">Select Marital Status</option>
          <option>Married</option>
          <option>Unmarried</option>
          <option>Widowed</option>
        </select>

        <label className="fdc-label-A1B2C3">Phone</label>
        <input
          name="phone"
          type="tel"
          placeholder="10-digit Phone Number"
          onChange={handleChange}
          value={formData.phone}
          maxLength="10"
          className="fdc-input-A1B2C3"
        />

        <label className="fdc-label-A1B2C3">Email</label>
        <input
          name="email"
          type="email"
          placeholder="Email Address"
          onChange={handleChange}
          value={formData.email}
          className="fdc-input-A1B2C3"
        />

        <label className="fdc-label-A1B2C3">Highest Qualification</label>
        <select
          name="highestQualification"
          onChange={handleChange}
          value={formData.highestQualification}
          className="fdc-select-A1B2C3"
          required
        >
          <option value="">Select Qualification</option>
          <option>School</option>
          <option>SSLC</option>
          <option>HSC</option>
          <option>Diploma</option>
          <option>Under Graduate</option>
          <option>Post Graduate</option>
          <option>none</option>
        </select>

        <label className="fdc-label-A1B2C3">Current Educational Status</label>
        <input
          name="currentEducationalStatus"
          placeholder="Educational Status"
          onChange={handleChange}
          value={formData.currentEducationalStatus}
          className="fdc-input-A1B2C3"
        />

        <label className="fdc-label-A1B2C3">Occupation</label>
        <input
          name="occupation"
          placeholder="Occupation"
          onChange={handleChange}
          value={formData.occupation}
          className="fdc-input-A1B2C3"
        />

        <label className="fdc-label-A1B2C3">Employer</label>
        <input
          name="employer"
          placeholder="Employer"
          onChange={handleChange}
          value={formData.employer}
          className="fdc-input-A1B2C3"
        />

        <label className="fdc-label-A1B2C3">Employment Type</label>
        <select
          name="employmentType"
          onChange={handleChange}
          value={formData.employmentType}
          className="fdc-select-A1B2C3"
        >
          <option value="">Select Employment Type</option>
          <option>Government</option>
          <option>Private</option>
          <option>Self Employed</option>
          <option>Business</option>
          <option>Student</option>
          <option>Unemployed</option>
        </select>

        <label className="fdc-label-A1B2C3">Skills</label>
        <select
          name="skills"
          onChange={handleChange}
          value={formData.skills}
          className="fdc-select-A1B2C3"
        >
          <option value="">Select Skill</option>
          <option>Carpenter</option>
          <option>Mason</option>
          <option>Welder</option>
          <option>Painter</option>
          <option>Steel Fixer (House/Industrial)</option>
          <option>Tile Setter</option>
          <option>Electrician</option>
          <option>Plumber</option>
          <option>HVAC Technician</option>
          <option>Auto Mechanic</option>
          <option>Diesel Mechanic</option>
          <option>Fitter</option>
          <option>Barber</option>
          <option>Driver</option>
          <option>IT professional</option>
          <option>None</option>
          <option>Other</option>
        </select>

        <label className="fdc-label-A1B2C3">Monthly Income</label>
        <input
          name="monthlyIncome"
          type="number"
          placeholder="Monthly Income"
          onChange={handleChange}
          value={formData.monthlyIncome}
          className="fdc-input-A1B2C3"
        />

        <button type="submit" className="fdc-button-A1B2C3">
          {isEditMode ? 'Update Member' : 'Add Member'}
        </button>
      </form>

      <button
        onClick={() => navigate(`/employee/house-management`)}
        className="fdc-back-button-A1B2C3"
      >
        Back to House Management
      </button>
    </div>
  );
};

export default FamilyDataCollectionA1B2C3;
