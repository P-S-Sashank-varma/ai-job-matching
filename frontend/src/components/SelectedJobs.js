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

  // Decode user email from JWT
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

    // Load round completion status from local storage
    const storedStatus = JSON.parse(localStorage.getItem("completionStatus") || "{}");
    setCompletionStatus(storedStatus);
  }, []);

  // Fetch matching jobs once email is available
  useEffect(() => {
    if (!userEmail) return;

    const fetchJobs = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found");

        const res = await fetch(`http://127.0.0.1:8000/matching-jobs/${userEmail}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Failed to fetch jobs");

        const data = await res.json();
        if (!Array.isArray(data)) throw new Error("Unexpected data format");

        setMatchedJobs(data);
      } catch (err) {
        console.error("Job fetch error:", err);
        setMatchedJobs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [userEmail]);

  // Check if all rounds are done
  const getAllRoundsCompleted = (recruiterEmail) => {
    const status = completionStatus[recruiterEmail];
    return status && status.aptitude && status.coding && status.hr;
  };

  // Count how many rounds are completed
  const getCompletedRoundsCount = (recruiterEmail) => {
    const status = completionStatus[recruiterEmail] || {};
    let count = 0;
    if (status.aptitude) count++;
    if (status.coding) count++;
    if (status.hr) count++;
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
            const recruiterEmail =
              job.recruiter_email || job.email || job.recruiterEmail || "N/A";

            const completedRounds = getCompletedRoundsCount(recruiterEmail);
            const allCompleted = getAllRoundsCompleted(recruiterEmail);

            return (
              <div
                key={index}
                className={`job-card ${allCompleted ? "completed-job" : ""}`}
              >
                <img
                  src={job.company_image_url || "/default-logo.png"}
                  alt="Company Logo"
                  className="company-logo"
                  onError={(e) => (e.target.src = "/default-logo.png")}
                />

                <div className="job-info">
                  <h3>{job.company || "Unknown Company"}</h3>
                  <p><strong>Recruiter:</strong> {job.recruiter_name || "N/A"}</p>
                  <p><strong>Skills Matched:</strong> {job.matched_skills?.join(", ") || "N/A"}</p>
                  <p><strong>Match Percentage:</strong> {job.match_percentage || 0}%</p>
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
