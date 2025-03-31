
import React from "react";
import { 
  ArrowRight, 
  Upload,
  Clock,
  Briefcase,
  CheckCircle,
  Calendar,
  Building,
  RefreshCw
} from "lucide-react";
import { handleResumeUpload, handleRegisterDrive } from "./UserPortalAPI";

export const renderResumeTab = (props) => {
  const { 
    name, setName, 
    email, 
    phone, setPhone, 
    resumeFile, setResumeFile, 
    loading, setLoading,
    hasExistingResume, setHasExistingResume,
    setActiveTab, navigate, resumeInputRef
  } = props;
  
  return (
    <div className="animate-fade-up">
      <div className="content-header">
        <span className="chip">Profile Details</span>
        <h2 className="text-2xl font-semibold text-[#1d1d1f]">
          {hasExistingResume ? "Update Your Resume" : "Upload Your Resume"}
        </h2>
        <p className="text-[#6e6e73]">
          {hasExistingResume 
            ? "Your resume is already on file. You can update your information below."
            : "Please provide your information and upload your resume to get started."}
        </p>
      </div>

      <form className="space-y-6" onSubmit={(e) => handleResumeUpload(
        e, resumeFile, hasExistingResume, name, email, phone, 
        setLoading, setHasExistingResume, setActiveTab, navigate, 
        setResumeFile, resumeInputRef
      )}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <div className="relative">
              <input 
                type="text" 
                className="form-input" 
                placeholder="Enter your name" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                required 
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div className="relative">
              <input 
                type="email" 
                className="form-input" 
                value={email} 
                disabled 
                required 
              />
            </div>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Phone Number</label>
          <div className="relative">
            <input 
              type="tel" 
              className="form-input" 
              placeholder="Enter phone number" 
              value={phone} 
              onChange={(e) => setPhone(e.target.value)} 
              required 
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">
            {hasExistingResume ? "Update Resume (Optional)" : "Upload Resume"}
          </label>
          <div className="upload-area">
            <div className="flex flex-col items-center">
              <div className="upload-icon">
                <Upload size={24} />
              </div>
              <div>
                <p className="text-sm font-medium">
                  {resumeFile ? resumeFile.name : "Drag and drop your resume here"}
                </p>
                <p className="text-xs text-[#6e6e73] mt-1">
                  Supported formats: PDF, DOC, DOCX
                </p>
              </div>
              <input 
                type="file" 
                accept=".pdf,.doc,.docx" 
                onChange={(e) => setResumeFile(e.target.files[0])} 
                ref={resumeInputRef} 
                required={!hasExistingResume}
                className="hidden" 
                id="resume-upload" 
              />
              <div className="upload-btn-container">
                <label 
                  htmlFor="resume-upload" 
                  className="btn btn-secondary cursor-pointer"
                >
                  Browse Files
                </label>
              </div>
              {resumeFile && (
                <div className="file-name">
                  Selected: {resumeFile.name}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="submit-btn">
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              <span className="flex items-center">
                {hasExistingResume ? "Update Information" : "Submit Resume"}
                <ArrowRight className="ml-1" size={16} />
              </span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export const renderJobsTab = (props) => {
  const { hasExistingResume, setActiveTab, navigate } = props;
  
  return (
    <div className="animate-fade-up">
      <div className="content-header">
        <span className="chip">Recommended For You</span>
        <h2 className="text-2xl font-semibold text-[#1d1d1f]">Selected Jobs</h2>
        <p className="text-[#6e6e73]">
          Based on your resume, we've selected these jobs that match your skills and experience.
        </p>
      </div>
  
      <div className="mb-8 p-6 bg-white rounded-xl border border-[#e5e5e7] animate-scale-in">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">View Your Matching Jobs</h3>
            <p className="text-[#6e6e73] mb-4 md:mb-0">
              We've analyzed your resume and found jobs that match your skills.
            </p>
          </div>
          
          {hasExistingResume && (
            <button 
              onClick={() => setActiveTab("resume")}
              className="btn btn-secondary flex items-center"
            >
              <RefreshCw size={16} className="mr-2" />
              Update Resume
            </button>
          )}
        </div>
        
        <button 
          onClick={() => navigate("/selected-jobs")}
          className="btn btn-primary"
        >
          View Selected Jobs
          <ArrowRight className="ml-2" size={16} />
        </button>
      </div>
    </div>
  );
};

export const renderApplicationsTab = (props) => {
  const { selectedJobs, navigate } = props;
  
  return (
    <div className="animate-fade-up">
      <div className="content-header">
        <span className="chip">Your Applications</span>
        <h2 className="text-2xl font-semibold text-[#1d1d1f]">Application Status</h2>
        <p className="text-[#6e6e73]">
          Track the status of your job applications here.
        </p>
      </div>

      <div className="space-y-4">
        {selectedJobs
          .filter(job => job.applied)
          .map((job) => (
            <div key={job.id} className="application-item animate-scale-in">
              <div className="application-details">
                <div>
                  <h3 className="text-lg font-semibold text-[#1d1d1f]">{job.title}</h3>
                  <p className="text-[#6e6e73] text-sm">{job.company}</p>
                </div>
                <span className="application-status">
                  <Clock size={12} className="mr-1" />
                  In Review
                </span>
              </div>
              
              <div className="flex justify-between items-center mt-4 pt-4 border-t border-[#e5e5e7]">
                <div className="application-date">
                  Applied on: {new Date().toLocaleDateString()}
                </div>
                
                <button className="btn btn-secondary">
                  View Details
                </button>
              </div>
            </div>
          ))}

        {selectedJobs.filter(job => job.applied).length === 0 && (
          <div className="empty-state animate-fade-in">
            <div className="flex justify-center mb-4">
              <Briefcase size={48} className="text-[#a7a7a7]" />
            </div>
            <h3 className="empty-title">No Applications Yet</h3>
            <p className="empty-description">
              You haven't applied to any jobs yet. Browse our selected jobs and start applying!
            </p>
            <button
              onClick={() => navigate("/jobs")}
              className="empty-action-btn"
            >
              Browse Jobs
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export const renderDrivesTab = (props) => {
  const { upcomingDrives, loading, hasExistingResume, setActiveTab, setLoading, setUpcomingDrives } = props;
  
  return (
    <div className="animate-fade-up">
      <div className="content-header">
        <span className="chip">Career Events</span>
        <h2 className="text-2xl font-semibold text-[#1d1d1f]">Upcoming Hiring Drives</h2>
        <p className="text-[#6e6e73]">
          Register for upcoming virtual and in-person hiring events from top companies.
        </p>
      </div>

      {upcomingDrives.length > 0 ? (
        <div className="drives-grid">
          {upcomingDrives.map((drive) => (
            <div key={drive.id} className="drive-card animate-scale-in">
              <div className="drive-header">
                <div>
                  <h3 className="drive-title">{drive.title}</h3>
                  <p className="drive-company">{drive.company}</p>
                </div>
                {drive.registered ? (
                  <span className="drive-badge registered">
                    <CheckCircle size={12} className="mr-1" />
                    Registered
                  </span>
                ) : (
                  <span className="drive-badge upcoming">
                    <Calendar size={12} className="mr-1" />
                    Upcoming
                  </span>
                )}
              </div>
              
              <div className="drive-info">
                <div className="info-item">
                  <Calendar size={14} className="text-[#6e6e73]" />
                  <span>{new Date(drive.date).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</span>
                </div>
                <div className="info-item">
                  <Building size={14} className="text-[#6e6e73]" />
                  <span>{drive.location}</span>
                </div>
              </div>
              
              <div className="drive-description">
                <p>{drive.description}</p>
              </div>
              
              <div className="drive-positions">
                <h4 className="text-sm font-medium mb-2">Open Positions:</h4>
                <div className="positions-list">
                  {drive.positions && drive.positions.map((position, index) => (
                    <span key={index} className="position-tag">
                      {position}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="drive-footer">
                <button
                  onClick={() => handleRegisterDrive(
                    drive.id, 
                    hasExistingResume, 
                    setActiveTab, 
                    setLoading, 
                    upcomingDrives, 
                    setUpcomingDrives
                  )}
                  disabled={drive.registered || loading}
                  className={`drive-register-btn ${drive.registered ? 'registered' : ''}`}
                >
                  {drive.registered ? (
                    <>
                      <CheckCircle size={14} className="mr-1" />
                      Registered
                    </>
                  ) : (
                    "Register Now"
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state animate-fade-in">
          <div className="flex justify-center mb-4">
            <Calendar size={48} className="text-[#a7a7a7]" />
          </div>
          <h3 className="empty-title">No Upcoming Drives</h3>
          <p className="empty-description">
            There are no upcoming hiring drives at the moment. Please check back later.
          </p>
        </div>
      )}
    </div>
  );
};