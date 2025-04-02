import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/AdminJobPost.css";

function AdminJobPost() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    jobTitle: "",
    jobLocation: "",
    employmentType: "",
    jobSummary: "",
    keyResponsibilities: [""],
    salary: "",
    deadline: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Job list state
  const [jobList, setJobList] = useState([]);

  // State to manage applications for a selected job
  const [selectedApplications, setSelectedApplications] = useState([]);
  const [showApplications, setShowApplications] = useState(false);
  const [selectedJobTitle, setSelectedJobTitle] = useState("");

  // Fetch jobs on component mount
  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/job/all-jobs");
      setJobList(res.data.jobs || []);
    } catch (err) {
      console.error("❌ Error fetching jobs:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleResponsibilitiesChange = (index, value) => {
    const updatedResponsibilities = [...formData.keyResponsibilities];
    updatedResponsibilities[index] = value;

    setFormData({
      ...formData,
      keyResponsibilities: updatedResponsibilities,
    });
  };

  const addResponsibility = () => {
    setFormData({
      ...formData,
      keyResponsibilities: [...formData.keyResponsibilities, ""],
    });
  };

  const removeResponsibility = (index) => {
    const updatedResponsibilities = [...formData.keyResponsibilities];
    updatedResponsibilities.splice(index, 1);

    setFormData({
      ...formData,
      keyResponsibilities: updatedResponsibilities,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/job/post-job",
        formData
      );

      alert("✅ Job posted successfully!");
      setFormData({
        jobTitle: "",
        jobLocation: "",
        employmentType: "",
        jobSummary: "",
        keyResponsibilities: [""],
        salary: "",
        deadline: "",
      });

      fetchJobs(); // refresh job list after posting
    } catch (err) {
      console.error("Error posting job:", err);
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
        alert(`❌ Failed: ${err.response.data.message}`);
      } else {
        setError("Something went wrong.");
        alert("❌ Failed to post job. Try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (jobId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this job posting?"
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:5000/api/job/delete-job/${jobId}`);

      alert("✅ Job deleted successfully!");
      fetchJobs(); // refresh job list after deletion
    } catch (err) {
      console.error("❌ Error deleting job:", err);
      alert("❌ Failed to delete job. Try again later.");
    }
  };


  


const handleViewApplications = async (jobId, jobTitle) => {
  try {
    const res = await axios.get(`http://localhost:5000/api/job-application/application/${jobId}`);

    const applications = res.data.applications;

    if (applications.length === 0) {
      alert("No applications found for this job.");
      return;
    }

    console.log("✅ Applications fetched:", applications);

    // Navigate to the page, passing jobTitle + applications via state
    navigate(`/view-job-applications/${jobId}`, {
      state: {
        jobTitle,
        applications
      }
    });
  } catch (err) {
    console.error("❌ Error fetching applications:", err);
    alert("❌ Failed to fetch applications. Try again later.");
  }
};


  return (
    <div className="admin-job-post-page">
      {/* Job Post Form Container */}
      <div className="job-post-container">
        <h2 className="form-title">Create Job Posting</h2>

        <form className="job-post-form" onSubmit={handleSubmit}>
          {/* Job Title */}
          <div className="form-group">
            <label htmlFor="jobTitle">Job Title</label>
            <input
              type="text"
              id="jobTitle"
              name="jobTitle"
              value={formData.jobTitle}
              onChange={handleChange}
              required
            />
          </div>

          {/* Job Location */}
          <div className="form-group">
            <label htmlFor="jobLocation">Job Location</label>
            <input
              type="text"
              id="jobLocation"
              name="jobLocation"
              value={formData.jobLocation}
              onChange={handleChange}
              required
            />
          </div>

          {/* Employment Type */}
          <div className="form-group">
            <label htmlFor="employmentType">Employment Type</label>
            <select
              id="employmentType"
              name="employmentType"
              value={formData.employmentType}
              onChange={handleChange}
              required
            >
              <option value="">Select Type</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
              <option value="Internship">Internship</option>
              <option value="Temporary">Temporary</option>
            </select>
          </div>

          {/* Job Summary */}
          <div className="form-group">
            <label htmlFor="jobSummary">Job Summary</label>
            <textarea
              id="jobSummary"
              name="jobSummary"
              value={formData.jobSummary}
              onChange={handleChange}
              required
            ></textarea>
          </div>

          {/* Key Responsibilities */}
          <div className="form-group">
            <label>Key Responsibilities</label>
            {formData.keyResponsibilities.map((responsibility, index) => (
              <div key={index} className="responsibility-item">
                <input
                  type="text"
                  value={responsibility}
                  onChange={(e) =>
                    handleResponsibilitiesChange(index, e.target.value)
                  }
                  required
                />
                <button
                  type="button"
                  onClick={() => removeResponsibility(index)}
                  className="remove-btn"
                >
                  ✕
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addResponsibility}
              className="add-btn"
            >
              + Add Responsibility
            </button>
          </div>

          {/* Salary */}
          <div className="form-group">
            <label htmlFor="salary">Salary</label>
            <input
              type="text"
              id="salary"
              name="salary"
              value={formData.salary}
              onChange={handleChange}
              required
            />
          </div>

          {/* Deadline */}
          <div className="form-group">
            <label htmlFor="deadline">Application Deadline</label>
            <input
              type="date"
              id="deadline"
              name="deadline"
              value={formData.deadline}
              onChange={handleChange}
              required
            />
          </div>

          {/* Submit Button */}
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Posting..." : "Post Job"}
          </button>
        </form>
      </div>

      {/* Job List Container */}
      <div className="job-list-container">
        <h2 className="table-title">Posted Jobs</h2>
        {jobList.length === 0 ? (
          <p>No jobs posted yet.</p>
        ) : (
          <table className="job-list-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Title</th>
                <th>Location</th>
                <th>Type</th>
                <th>Salary</th>
                <th>Summary</th>
                <th>Responsibilities</th>
                <th>Deadline</th>
                <th>Posted On</th>
                <th>Actions</th> {/* Actions column */}
              </tr>
            </thead>
            <tbody>
              {jobList.map((job, index) => (
                <tr key={job._id}>
                  <td>{index + 1}</td>
                  <td>{job.jobTitle}</td>
                  <td>{job.jobLocation}</td>
                  <td>{job.employmentType}</td>
                  <td>{job.salary}</td>
                  <td>{job.jobSummary}</td>
                  <td>
                    <ul>
                      {job.keyResponsibilities.map((resp, i) => (
                        <li key={i}>{resp}</li>
                      ))}
                    </ul>
                  </td>
                  <td>{new Date(job.deadline).toLocaleDateString()}</td>
                  <td>{new Date(job.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(job._id)}
                      disabled={loading}
                    >
                      🗑️ Delete
                    </button>

                    <button
                      className="view-btn"
                      onClick={() => handleViewApplications(job._id, job.jobTitle)}
                      disabled={loading}
                    >
                      👀 View Applications
                    </button>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default AdminJobPost;
