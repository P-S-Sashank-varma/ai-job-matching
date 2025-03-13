import React, { useEffect, useState } from "react";
import "../styles/SelectedJobs.css";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

const SelectedJobs = () => {
  const [matchedJobs, setMatchedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState("");

  const navigate = useNavigate();

  // ✅ Get logged-in user info from token
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
  }, []);

  // ✅ Fetch selected jobs after getting user email
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
            // ✅ Dynamically extract recruiter email
            const recruiterEmail =
              job.recruiter_email || job.email || job.recruiterEmail || "Not available";

            return (
              <div key={index} className="job-card">
                <img src={job.company_image_url} alt="Company Logo" className="company-logo" />
                <div className="job-info">
                  <h3>{job.company}</h3>
                  <p><strong>Recruiter:</strong> {job.recruiter_name}</p>
                  <p><strong>Skills Matched:</strong> {job.matched_skills?.join(", ") || "N/A"}</p>
                  <p><strong>Match Percentage:</strong> {job.match_percentage || "0"}%</p>
                  <p><strong>Recruiter Email:</strong> {recruiterEmail}</p>
                  
                  {/* ✅ Fixed: Using recruiterEmail for navigation */}
                  <button
                    onClick={() =>
                      navigate(`/ai-hr-interview/${encodeURIComponent(recruiterEmail)}`)
                    }
                  >
                    Ready For AI Interview
                  </button>
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
