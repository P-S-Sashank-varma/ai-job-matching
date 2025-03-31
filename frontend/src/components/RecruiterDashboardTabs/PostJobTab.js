import React from "react";

export const PostJobTab = ({
  editingJobId,
  recruiterName,
  setRecruiterName,
  email,
  company,
  setCompany,
  companyImagePreview,
  skillsRequired,
  setSkillsRequired,
  salaryRange,
  setSalaryRange,
  jobLocation,
  setJobLocation,
  Matchingpercentage,
  setMatchingpercentage,
  location,
  setLocation,
  jobDescription,
  setJobDescription,
  handleCompanyImageChange,
  companyImageInputRef,
  resetForm,
  handleSubmit
}) => {
  return (
    <div className="dashboard-section">
      <div className="section-header">
        <h2>{editingJobId ? "Edit Job" : "Post a New Job"}</h2>
        <div className="section-header-icon">
          {editingJobId ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14"></path>
              <path d="M12 5v14"></path>
            </svg>
          )}
        </div>
      </div>
      <div className="section-content">
        <form className="dashboard-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Recruiter Name</label>
            <input 
              type="text" 
              className="form-control" 
              value={recruiterName} 
              onChange={(e) => setRecruiterName(e.target.value)} 
              required 
              placeholder="Enter Recruiter Name"
            />
          </div>
          
          <div className="form-group">
            <label>Email</label>
            <input 
              type="email" 
              className="form-control readonly" 
              value={email} 
              readOnly 
              required 
            />
          </div>
          
          <div className="form-group">
            <label>Company Name</label>
            <input 
              type="text" 
              className="form-control" 
              value={company} 
              onChange={(e) => setCompany(e.target.value)} 
              required 
            />
          </div>
          
          <div className="form-group">
            <label>Company Logo</label>
            <input 
              type="file" 
              className="form-control file-input" 
              accept="image/*" 
              onChange={handleCompanyImageChange} 
              ref={companyImageInputRef} 
            />
            
            {companyImagePreview && (
              <div className="image-container">
                <img 
                  src={companyImagePreview} 
                  alt="Company Preview" 
                  className="company-preview" 
                />
                <div className="image-overlay">
                  <span>Click to change</span>
                </div>
              </div>
            )}
          </div>
          
          <div className="form-group">
            <label>Skills Required</label>
            <input 
              type="text" 
              className="form-control" 
              value={skillsRequired} 
              onChange={(e) => setSkillsRequired(e.target.value)} 
              placeholder="e.g. JavaScript, React, Node.js" 
              required 
            />
          </div>
          
          <div className="form-group">
            <label>Salary Range</label>
            <input 
              type="text" 
              className="form-control" 
              value={salaryRange} 
              onChange={(e) => setSalaryRange(e.target.value)} 
              placeholder="e.g. $80,000 - $100,000" 
              required 
            />
          </div>
          
          <div className="form-group">
            <label>Job Location Type</label>
            <select 
              className="form-control select-control" 
              value={jobLocation} 
              onChange={(e) => setJobLocation(e.target.value)} 
              required
            >
              <option value="Remote">Remote</option>
              <option value="Onsite">Onsite</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>

          <div className="form-group">
            <label>Matching Percentage</label>
            <input 
              type="number" 
              className="form-control" 
              value={Matchingpercentage} 
              onChange={(e) => setMatchingpercentage(e.target.value)} 
              required 
            />
          </div>
          
          <div className="form-group">
            <label>Location</label>
            <input 
              type="text" 
              className="form-control" 
              value={location} 
              onChange={(e) => setLocation(e.target.value)} 
              placeholder="e.g. New York, NY" 
              required 
            />
          </div>
          
          <div className="form-group">
            <label>Job Description</label>
            <textarea 
              className="form-control textarea-control" 
              value={jobDescription} 
              onChange={(e) => setJobDescription(e.target.value)} 
              placeholder="Describe the job responsibilities and requirements..." 
              required
            ></textarea>
          </div>
          
          <div className="form-actions">
            <button 
              type="submit" 
              className="btn btn-primary"
            >
              {editingJobId ? (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                    <polyline points="17 21 17 13 7 13 7 21"></polyline>
                    <polyline points="7 3 7 8 15 8"></polyline>
                  </svg>
                  Update Job
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                    <polyline points="17 21 17 13 7 13 7 21"></polyline>
                    <polyline points="7 3 7 8 15 8"></polyline>
                  </svg>
                  Post Job
                </>
              )}
            </button>
            
            {editingJobId && (
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={resetForm}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 12H5"></path>
                  <path d="M12 19l-7-7 7-7"></path>
                </svg>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
