import React, { useEffect, useState } from "react";
import "../styles/Job.css"; // Import Job CSS for styling

const Job = () => {
  const [jobs, setJobs] = useState([]); // Store fetched jobs
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch job listings from backend
    const fetchJobs = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/recruiter-dashboard");
        if (!response.ok) {
          throw new Error("Failed to fetch jobs");
        }
        const data = await response.json();
        console.log("Fetched jobs:", data); // ✅ Debugging: Check API response
        setJobs(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching jobs:", error);
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  return (
    <div className="job-container">
      <h2>Available Jobs</h2>
      {loading ? (
        <p>Loading jobs...</p>
      ) : jobs.length === 0 ? (
        <p>No jobs available.</p>
      ) : (
        <div className="job-list">
          {jobs.map((job, index) => (
            <div key={index} className="job-card">
              <img src={job.company_image_url} alt="Company Logo" className="company-logo" />
              <div className="job-info">
                <h3>{job.company}</h3>
                <p><strong>Recruiter:</strong> {job.recruiter_name}</p>
                <p><strong>Posted On:</strong> {new Date().toLocaleString()}</p>
                <p><strong>Skills Required:</strong> {job.skills_required || "No skills listed"}</p>  {/* ✅ Fix */}
                <button className="apply-button">AI will APPLY</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Job;
