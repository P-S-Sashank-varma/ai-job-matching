import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "../styles/SelectedJobs.css";

const SelectedJobs = () => {
  const [matchedJobs, setMatchedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState("");
  const [completionStatus, setCompletionStatus] = useState({});

  const navigate = useNavigate();
  const location = useLocation();

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

  // Reload completionStatus from localStorage when page becomes visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        const storedStatus = JSON.parse(localStorage.getItem("completionStatus") || "{}");
        setCompletionStatus(storedStatus);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  // Reload completionStatus from localStorage when route changes
  useEffect(() => {
    const storedStatus = JSON.parse(localStorage.getItem("completionStatus") || "{}");
    setCompletionStatus(storedStatus);
  }, [location]);

  // Fetch matching jobs once email is available
  useEffect(() => {
    if (!userEmail) return;

    const fetchJobsAndStatuses = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found");

        const res = await fetch(`http://localhost:8000/matching-jobs/${userEmail}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Failed to fetch jobs");

        const data = await res.json();
        if (!Array.isArray(data)) throw new Error("Unexpected data format");

        // For each job, fetch the completion status
        const jobsWithStatus = await Promise.all(
          data.map(async (job) => {
            const recruiterEmail = job.recruiter_email || job.email || job.recruiterEmail;
            if (!recruiterEmail) return { ...job, completion_status: {} };
            try {
              const statusRes = await fetch(
                `http://localhost:8000/api/job-status/${userEmail}/${recruiterEmail}`,
                { headers: { Authorization: `Bearer ${token}` } }
              );
              if (!statusRes.ok) return { ...job, completion_status: {} };
              const statusData = await statusRes.json();
              return { ...job, completion_status: statusData.completion_status || {} };
            } catch {
              return { ...job, completion_status: {} };
            }
          })
        );

        setMatchedJobs(jobsWithStatus);
      } catch (err) {
        console.error("Job fetch error:", err);
        setMatchedJobs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchJobsAndStatuses();
  }, [userEmail]);

  // Check if all rounds are done
  const getAllRoundsCompleted = (job) => {
    const status = job.completion_status || {};
    return status.aptitude && status.coding && status.hr;
  };

  // Count how many rounds are completed
  const getCompletedRoundsCount = (job) => {
    const status = job.completion_status || {};
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

            const completedRounds = getCompletedRoundsCount(job);
            const allCompleted = getAllRoundsCompleted(job);

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
