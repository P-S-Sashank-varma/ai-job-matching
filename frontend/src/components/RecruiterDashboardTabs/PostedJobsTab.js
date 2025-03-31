import React from "react";

export const PostedJobsTab = ({ 
  loading, 
  postedJobs, 
  handleEditJob, 
  handleDeleteJob, 
  setActiveTab 
}) => {
  const getLocationClass = (jobLocationType) => {
    switch (jobLocationType) {
      case "Remote": return "job-tag job-remote";
      case "Onsite": return "job-tag job-onsite";
      case "Hybrid": return "job-tag job-hybrid";
      default: return "job-tag";
    }
  };

  return (
    <div className="dashboard-section" style={{ gridColumn: "span 2" }}>
      <div className="section-header">
        <h2>Posted Jobs</h2>
        <div className="section-header-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
          </svg>
        </div>
      </div>
      <div className="section-content">
        {loading ? (
          <div className="loading">
            <div className="loading-spinner"></div>
            <span>Loading jobs...</span>
          </div>
        ) : postedJobs.length > 0 ? (
          <div className="jobs-grid">
            {postedJobs.map((job) => (
              <div key={job.id} className="job-card">
                <div className="job-card-header">
                  {job.company_image ? (
                    <img 
                      src={job.company_image} 
                      alt={job.company} 
                      className="job-company-logo" 
                    />
                  ) : (
                    <div className="job-company-logo" style={{ background: '#f5f5f7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6e6e73" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                      </svg>
                    </div>
                  )}
                  <div className="job-title-container">
                    <h3>{job.company}</h3>
                    <div className="job-company">{job.location}</div>
                  </div>
                </div>
                
                <div className="job-card-content">
                  <div className="job-detail">
                    <span className="job-detail-icon">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                      </svg>
                    </span>
                    <span className="job-detail-text">{job.salary_range}</span>
                  </div>
                  
                  <div className="job-detail">
                    <span className="job-detail-icon">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                      </svg>
                    </span>
                    <span className="job-detail-text">Skills: {job.skills_required}</span>
                  </div>
                  
                  <div className="job-detail">
                    <span className="job-detail-icon">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                      </svg>
                    </span>
                    <span className={getLocationClass(job.job_location)}>
                      {job.job_location}
                    </span>
                  </div>
                </div>
                
                <div className="job-card-actions">
                  <button 
                    className="btn btn-secondary btn-icon"
                    onClick={() => handleEditJob(job)}
                    title="Edit Job"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                  </button>
                  
                  <button 
                    className="btn btn-destructive btn-icon"
                    onClick={() => handleDeleteJob(job.id)}
                    title="Delete Job"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      <line x1="10" y1="11" x2="10" y2="17"></line>
                      <line x1="14" y1="11" x2="14" y2="17"></line>
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-jobs">
            <div className="no-jobs-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
            </div>
            <p>No jobs posted yet. Create your first job posting!</p>
            <button 
              className="btn btn-primary"
              onClick={() => setActiveTab("post-job")}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14"></path>
                <path d="M12 5v14"></path>
              </svg>
              Post a New Job
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
