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
      <h2 className="job-heading">Available Jobs</h2>
      {loading ? (
        <p className="loading-text">Loading jobs...</p>
      ) : jobs.length === 0 ? (
        <p className="no-jobs">No jobs available.</p>
      ) : (
        <div className="job-list">
          {jobs.map((job, index) => (
            <div key={index} className="job-card">
              <img src={job.company_image_url} alt="Company Logo" className="company-logo" />
              <div className="job-info">
                <h3 className="company-name">{job.company}</h3>
                <p className="job-detail"><strong>Recruiter:</strong> {job.recruiter_name}</p>
                <p className="job-detail"><strong>Posted On:</strong> {new Date().toLocaleString()}</p>
                
                {/* Skills Section */}
                <div className="job-skills">
                  <strong>Skills Required:</strong>
                  <ul className="skills-list">
                    {(job.skills_required || "No skills listed").split(",").map((skill, idx) => (
                      <li key={idx} className="skill">{skill.trim()}</li>
                    ))}
                  </ul>
                </div>
                
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
