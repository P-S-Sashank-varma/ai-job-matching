import React, { useEffect, useState } from "react";
import "../styles/SelectedJobs.css";
import { jwtDecode } from "jwt-decode"; // ✅ Correct import
import { useNavigate } from "react-router-dom"; // ✅ Import for navigation

const SelectedJobs = () => {
  const [matchedJobs, setMatchedJobs] = useState([]); // ✅ Ensure it's an array
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState("");

  const navigate = useNavigate(); // ✅ ✅ ✅ Move inside the component

  // ✅ **Get Logged-in User Info from Token (Stored in LocalStorage)**
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token); // ✅ Decode JWT token
        setUserEmail(decodedToken.email);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);

  useEffect(() => {
    if (!userEmail) return; // ✅ Ensure email is available before fetching data

    const fetchSelectedJobs = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No authentication token found. Please log in.");
        }

        const response = await fetch(`http://127.0.0.1:8000/matching-jobs/${userEmail}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch selected jobs");
        }

        const data = await response.json();

        // ✅ Ensure API response is an array
        if (!Array.isArray(data)) {
          throw new Error("Invalid response format: Expected an array");
        }

        setMatchedJobs(data);
      } catch (error) {
        console.error("Error fetching selected jobs:", error);
        setMatchedJobs([]); // ✅ Fallback to empty array to prevent `.map()` error
      } finally {
        setLoading(false);
      }
    };

    fetchSelectedJobs();
  }, [userEmail]); // ✅ Trigger fetching only after email is set

  return (
    <div className="selected-jobs-container">
      <h2>Matching Jobs for {userEmail || "User"}</h2>
      {loading ? (
        <p>Loading jobs...</p>
      ) : matchedJobs.length === 0 ? (
        <p>No matching jobs found.</p>
      ) : (
        <div className="job-list">
          {matchedJobs.map((job, index) => (
            <div key={index} className="job-card">
              <img src={job.company_image_url} alt="Company Logo" className="company-logo" />
              <div className="job-info">
                <h3>{job.company}</h3>
                <p><strong>Recruiter:</strong> {job.recruiter_name}</p>
                <p><strong>Skills Matched:</strong> {job.matched_skills?.join(", ") || "N/A"}</p>
                <p><strong>Match Percentage:</strong> {job.match_percentage || "0"}%</p>
                <button
  className="apply-btn"
  onClick={() => navigate(`/ai-hr-interview`)} // ✅ Pass email in URL
>
  Ready For AI Interview
</button>

              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SelectedJobs;
