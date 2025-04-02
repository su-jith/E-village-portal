import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/FamilyDashboard.css'; // Optional: for custom styles

const FamilyDashboard = () => {
  const [houseDetail, setHouseDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [memberCount, setMemberCount] = useState(0);
  const [familyMembers, setFamilyMembers] = useState([]);
  const [showFamilyTable, setShowFamilyTable] = useState(false);
  const [showJobsTable, setShowJobsTable] = useState(false);
  const [showRationNotifications, setShowRationNotifications] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [rationNotifications, setRationNotifications] = useState([]);

  const navigate = useNavigate();

  const familyData = JSON.parse(localStorage.getItem('familyData'));

  useEffect(() => {
    const loadData = async () => {
      if (familyData) {
        const { wardNumber, houseNumber } = familyData.houseDetails;
        await fetchHouseDetails(wardNumber, houseNumber);
        await fetchFamilyMembers(wardNumber, houseNumber);
      } else {
        setError('No login data found. Please login again.');
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const fetchHouseDetails = async (wardNumber, houseNumber) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/employee/family/house-details`, {
        params: { wardNumber, houseNumber },
      });

      setHouseDetail(response.data);

      const count = await fetchMemberCount(houseNumber);
      setMemberCount(count);

      setLoading(false);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to load house details');
      setLoading(false);
    }
  };

  const fetchMemberCount = async (houseNumber) => {
    try {
      const res = await fetch(`http://localhost:5000/api/employee/family-members/count/${houseNumber}`);
      const data = await res.json();

      if (res.ok) {
        return data.count || 0;
      } else {
        console.error(data.message);
        return 0;
      }
    } catch (error) {
      console.error('Error fetching member count:', error);
      return 0;
    }
  };

  const fetchFamilyMembers = async (wardNumber, houseNumber) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/employee/family/family-members`, {
        params: { wardNumber, houseNumber },
      });

      setFamilyMembers(response.data);
    } catch (error) {
      console.error('Error fetching family members:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('familyData');
    window.location.href = '/login/family';
  };

  const handleViewFullDetails = (member) => {
    navigate(`/family-full-details/${member._id}`, { state: { member } });
  };

  const handleViewFamilyMembersClick = () => {
    setShowFamilyTable(true);
    setShowJobsTable(false);
    setShowRationNotifications(false);
  };

  const handleViewJobsClick = async () => {
    setShowFamilyTable(false);
    setShowJobsTable(true);
    setShowRationNotifications(false);

    try {
      const response = await axios.get(`http://localhost:5000/api/job/all-jobs`);

      console.log("Jobs Response Data:", response.data);

      const jobsArray = Array.isArray(response.data)
        ? response.data
        : response.data.jobs;

      setJobs(jobsArray || []);
    } catch (error) {
      console.error('Error fetching job openings:', error);
      setJobs([]);
    }
  };

  const handleViewRationNotificationsClick = async () => {
    setShowFamilyTable(false);
    setShowJobsTable(false);
    setShowRationNotifications(true);

    if (!houseDetail || !houseDetail.rationEntitlement) {
      console.error("Ration entitlement not found");
      return;
    }

    try {
      const response = await axios.get(`http://localhost:5000/api/ration/notifications`, {
        params: { entitlement: houseDetail.rationEntitlement },
      });
      

      console.log("Ration Notifications:", response.data);

      const notificationsArray = Array.isArray(response.data)
        ? response.data
        : response.data.notifications;

      setRationNotifications(notificationsArray || []);
    } catch (error) {
      console.error('Error fetching ration notifications:', error);
      setRationNotifications([]);
    }
  };




  const handleApplyJob = (job) => {
    navigate(`/job-application/${job._id}`, {
      state: {
        jobId: job._id,
        jobTitle: job.jobTitle,
        houseNumber: houseDetail.houseNumber,
        wardNumber: houseDetail.wardNumber
      }
    });
  };


  const handleNavigateToComplaints = () => {
    navigate('/api/complaints');
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container">
        <p className="error-message">{error}</p>
        <button className="logout-button" onClick={handleLogout}>
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="dashboard-container">
        <h2 className="dashboard-heading">
          Welcome, House No: {houseDetail.houseNumber}
        </h2>
        <p><strong>Ward Number:</strong> {houseDetail.wardNumber}</p>
        <p><strong>House Name:</strong> {houseDetail.houseName || 'N/A'}</p>
        <p><strong>No. of Members:</strong> {memberCount}</p>
        <p><strong>Address:</strong> {houseDetail.address || 'N/A'}</p>
        <p><strong>Ration Entitlement:</strong> {houseDetail.rationEntitlement || 'N/A'}</p>
        <p><strong>Phone:</strong> {houseDetail.phone || 'N/A'}</p>

        <div className="button-container">
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      <div className="card-container">
        <div className="view-family-card" onClick={handleViewFamilyMembersClick}>
          <h3>View Family Members</h3>
        </div>

        <div className="view-jobs-card" onClick={handleViewJobsClick}>
          <h3>View Job Openings</h3>
        </div>

        <div className="view-ration-card" onClick={handleViewRationNotificationsClick}>
          <h3>Ration Notifications</h3>
        </div>


        <div className="complaints-card outside-card" onClick={handleNavigateToComplaints}>
         <h3>Complaints & Feedback</h3>
        </div>
      </div>

      {showFamilyTable && (
        <div className="family-members-section">
          <h3 className="family-members-heading">Family Members</h3>
          {familyMembers.length === 0 ? (
            <p>No family members found.</p>
          ) : (
            <table className="family-members-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>DOB</th>
                  <th>Age</th>
                  <th>Relationship</th>
                  <th>Aadhar</th>
                  <th>Phone</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {familyMembers.map((member, index) => (
                  <tr key={index}>
                    <td>{member.memberName}</td>
                    <td>{member.dob?.slice(0, 10)}</td>
                    <td>{member.age}</td>
                    <td>{member.relationship}</td>
                    <td>{member.aadhaarNumber || 'N/A'}</td>
                    <td>{member.phone || 'N/A'}</td>
                    <td>
                      <button
                        className="view-details-button"
                        onClick={() => handleViewFullDetails(member)}
                      >
                        View Full Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {showJobsTable && (
        <div className="jobs-section">
          <h3 className="jobs-heading">Job Openings</h3>
          {jobs.length === 0 ? (
            <p>No job openings found.</p>
          ) : (
            <table className="jobs-table">
              <thead>
                <tr>
                  <th>Job Title</th>
                  <th>Location</th>
                  <th>Employment Type</th>
                  <th>Job Description</th>
                  <th>Responsibilities</th>
                  <th>Salary</th>
                  <th>Posted On</th>
                  <th>Deadline</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job, index) => (
                  <tr key={index}>
                    <td>{job.jobTitle}</td>
                    <td>{job.jobLocation}</td>
                    <td>{job.employmentType}</td>
                    <td>{job.jobSummary}</td>
                    <td>
                      <ul>
                        {job.keyResponsibilities.map((resp, i) => (
                          <li key={i}>{resp}</li>
                        ))}
                      </ul>
                    </td>
                    <td>{job.salary}</td>
                    <td>{new Date(job.createdAt).toLocaleDateString()}</td>
                    <td>{new Date(job.deadline).toLocaleDateString()}</td>
                    <td>
                      <button
                        className="apply-button"
                        onClick={() => handleApplyJob(job)}
                      >
                        Apply
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {showRationNotifications && (
      <div className="ration-notifications-section">
      <h3 className="ration-notifications-heading">Ration Notifications</h3>
    
      {rationNotifications.length === 0 ? (
        <p>No ration notifications found for your entitlement.</p>
      ) : (
        <div className="ration-card single-card">
          <h4>All Notifications</h4>
    
          {rationNotifications.map((notification, index) => (
            <div key={notification._id} className="single-notification">
              <h5>Entitlement: {notification.entitlement}</h5>
              <p><strong>Last Pickup Date:</strong> {new Date(notification.lastPickupDate).toLocaleDateString()}</p>
    
              <p><strong>Items:</strong></p>
              <ul>
                {notification.items.map((item, idx) => (
                  <li key={idx}>
                    {item.itemName} - {item.quantity} {item.unit}
                  </li>
                ))}
              </ul>
    
              <p><strong>Notification Created On:</strong> {new Date(notification.createdAt).toLocaleDateString()}</p>
    
              {index !== rationNotifications.length - 1 && <hr />}
            </div>
          ))}
        </div>
      )}
    </div>
  
      )}
    </>
  );
};

export default FamilyDashboard;
