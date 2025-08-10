import React, { useEffect, useState } from "react";
import { Search } from "lucide-react";
import "../styles/Job.css";

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch("http://localhost:8000/recruiter-dashboard");
        if (!response.ok) {
          throw new Error("Failed to fetch jobs");
        }
        const data = await response.json();
        console.log("Fetched jobs:", data);
        setJobs(data);
        setFilteredJobs(data);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setFilteredJobs(jobs);
      return;
    }
    
    const filtered = jobs.filter(job => 
      job.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.recruiter_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.skills_required?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.job_location?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredJobs(filtered);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="jobs-section">
      <h2 className="jobs-title">Available Jobs</h2>

      <div className="search-container">
        <input
          type="text"
          placeholder="Search by company, skills, location..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={handleKeyPress}
          className="search-input"
        />
        <button onClick={handleSearch} className="search-button">
          <Search className="search-icon" />
          Search
        </button>
      </div>

      {loading ? (
        <p className="loading-message">Loading jobs...</p>
      ) : filteredJobs.length === 0 ? (
        <p className="no-jobs-message">No jobs available.</p>
      ) : (
        <div className="jobs-grid">
          {filteredJobs.map((job, index) => (
            <div key={index} className="job-item-card">
              <img 
                src={job.company_image_url} 
                alt={`${job.company} Logo`} 
                className="company-image" 
              />

              <div className="job-details">
                <h3 className="company-title">{job.company}</h3>
                <p className="job-info"><strong>Recruiter:</strong> {job.recruiter_name}</p>
                <p className="job-info"><strong>Posted On:</strong> {new Date().toLocaleDateString()}</p>
                <p className="job-info"><strong>Salary:</strong> {job.salary_range || "Not specified"}</p>
                <p className="job-info"><strong>Location:</strong> {job.job_location || "Not specified"}</p>
                <p className="job-info"><strong>Match Percentage:</strong> {job.match_percentage || "0"}%</p>

                <div className="skills-container">
                  <strong>Skills Required:</strong>
                  <ul className="skills-list">
                    {(job.skills_required || "No skills listed")
                      .split(",")
                      .map((skill, idx) => (
                        <li key={idx} className="skill-item">{skill.trim()}</li>
                      ))}
                  </ul>
                </div>
                
                <button className="apply-btn">AI will APPLY</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Jobs;
