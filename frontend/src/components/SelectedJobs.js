import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "../styles/SelectedJobs.css";

const SelectedJobs = () => {
  const [matchedJobs, setMatchedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState("");
  const [completionStatus, setCompletionStatus] = useState({});
  
  const navigate = useNavigate();

  // Get logged-in user info from token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUserEmail(decodedToken.email);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
    
    // Load completion status for all jobs
    const storedData = JSON.parse(localStorage.getItem("completionStatus") || "{}");
    setCompletionStatus(storedData);
  }, []);

  // Fetch selected jobs after getting user email
  useEffect(() => {
    if (!userEmail) return;

    const fetchSelectedJobs = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No authentication token found. Please log in.");

        const response = await fetch(`http://127.0.0.1:8000/matching-jobs/${userEmail}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error("Failed to fetch selected jobs");

        const data = await response.json();
        console.log("Fetched Data:", data);

        if (!Array.isArray(data)) throw new Error("Invalid response format: Expected an array");

        setMatchedJobs(data);
      } catch (error) {
        console.error("Error fetching selected jobs:", error);
        setMatchedJobs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSelectedJobs();
  }, [userEmail]);

  // Helper function to check if all rounds are completed for a job
  const getAllRoundsCompleted = (recruiterEmail) => {
    const jobStatus = completionStatus[recruiterEmail];
    return jobStatus && jobStatus.aptitude && jobStatus.coding && jobStatus.hr;
  };

  // Helper function to count completed rounds for a job
  const getCompletedRoundsCount = (recruiterEmail) => {
    const jobStatus = completionStatus[recruiterEmail] || {};
    let count = 0;
    if (jobStatus.aptitude) count++;
    if (jobStatus.coding) count++;
    if (jobStatus.hr) count++;
    return count;
  };

  return (
    <div className="selected-jobs-container">
      <h2>Matching Jobs for {userEmail || "User"}</h2>

      {loading ? (
        <p>Loading jobs...</p>
      ) : matchedJobs.length === 0 ? (
        <p>No matching jobs found.</p>
      ) : (
        <div className="job-list">
          {matchedJobs.map((job, index) => {
            // Dynamically extract recruiter email
            const recruiterEmail =
              job.recruiter_email || job.email || job.recruiterEmail || "Not available";
            
            // Get completion status for this job
            const completedRounds = getCompletedRoundsCount(recruiterEmail);
            const allCompleted = getAllRoundsCompleted(recruiterEmail);

            return (
              <div key={index} className={`job-card ${allCompleted ? 'completed-job' : ''}`}>
                <img src={job.company_image_url} alt="Company Logo" className="company-logo" />
                <div className="job-info">
                  <h3>{job.company}</h3>
                  <p><strong>Recruiter:</strong> {job.recruiter_name}</p>
                  <p><strong>Skills Matched:</strong> {job.matched_skills?.join(", ") || "N/A"}</p>
                  <p><strong>Match Percentage:</strong> {job.match_percentage || "0"}%</p>
                  <p><strong>Recruiter Email:</strong> {recruiterEmail}</p>
                  
                  <div className="job-status">
                    <div className="progress-indicator">
                      <div className="progress-text">
                        {allCompleted 
                          ? "All rounds completed!" 
                          : `${completedRounds}/3 rounds completed`}
                      </div>
                      <div className="progress-bar">
                        <div 
                          className="progress-fill" 
                          style={{ width: `${(completedRounds / 3) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <button
                      onClick={() =>
                        navigate(`/ai-hr-interview/${encodeURIComponent(recruiterEmail)}`)
                      }
                      className={allCompleted ? "completed-button" : "interview-button"}
                    >
                      {allCompleted ? "View Application" : "Continue Interview Process"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SelectedJobs;
