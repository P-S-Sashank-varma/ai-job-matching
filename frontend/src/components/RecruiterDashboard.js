import React, { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import "../styles/RecruiterDashboard.css";
import { PostJobTab } from "./RecruiterDashboardTabs/PostJobTab";
import { PostedJobsTab } from "./RecruiterDashboardTabs/PostedJobsTab";
import { ConductDriveTab } from "./RecruiterDashboardTabs/ConductDriveTab";
import { 
  fetchJobs, 
  fetchDrives, 
  handleCompanyImageUpload, 
  handleEditJob, 
  handleDeleteJob, 
  handleDeleteDrive, 
  handleJobSubmit,
  handleDriveSubmit
} from "./RecruiterDashboardAPI";

function RecruiterDashboard() {
  // State variables
  const [recruiterName, setRecruiterName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [companyImage, setCompanyImage] = useState(null);
  const [companyImagePreview, setCompanyImagePreview] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [skillsRequired, setSkillsRequired] = useState("");
  const [salaryRange, setSalaryRange] = useState("");
  const [jobLocation, setJobLocation] = useState("Remote");
  const [location, setLocation] = useState("");
  const [Matchingpercentage, setMatchingpercentage] = useState("");
  const [postedJobs, setPostedJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingJobId, setEditingJobId] = useState(null);
  const [activeTab, setActiveTab] = useState("post-job");
  
  // Drive section state
  const [driveName, setDriveName] = useState("");
  const [driveDate, setDriveDate] = useState("");
  const [driveTime, setDriveTime] = useState("");
  const [driveLocation, setDriveLocation] = useState("");
  const [driveDescription, setDriveDescription] = useState("");
  const [driveCapacity, setDriveCapacity] = useState("");
  const [drives, setDrives] = useState([]);
  const [loadingDrives, setLoadingDrives] = useState(false);

  const companyImageInputRef = useRef(null);

  useEffect(() => {
    fetchJobs(email, setPostedJobs, setLoading);
    fetchDrives(email, setDrives, setLoadingDrives);
  }, [email]);

  // Reset form for job posting
  const resetForm = () => {
    setCompany("");
    setJobDescription("");
    setSkillsRequired("");
    setSalaryRange("");
    setJobLocation("Remote");
    setLocation("");
    setCompanyImage(null);
    setMatchingpercentage("");
    setCompanyImagePreview(null);
    if (companyImageInputRef.current) companyImageInputRef.current.value = "";
    setEditingJobId(null);
  };
  
  // Reset form for drive submission
  const resetDriveForm = () => {
    setDriveName("");
    setDriveDate("");
    setDriveTime("");
    setDriveLocation("");
    setDriveDescription("");
    setDriveCapacity("");
  };

  // Event handlers with state reference passing
  const handleCompanyImageChange = (event) => {
    handleCompanyImageUpload(event, setCompanyImage, setCompanyImagePreview);
  };

  const handleJobEdit = (job) => {
    handleEditJob(
      job, 
      setEditingJobId, 
      setCompany, 
      setJobDescription, 
      setSkillsRequired, 
      setSalaryRange, 
      setJobLocation, 
      setLocation, 
      setCompanyImagePreview, 
      setMatchingpercentage, 
      setActiveTab
    );
  };

  const handleJobDelete = (jobId) => {
    handleDeleteJob(jobId, setPostedJobs);
  };

  const handleDriveDelete = (driveId) => {
    handleDeleteDrive(driveId, setDrives);
  };

  const submitJobForm = (e) => {
    handleJobSubmit(
      e,
      editingJobId,
      recruiterName,
      email,
      company,
      jobDescription,
      skillsRequired,
      salaryRange,
      Matchingpercentage,
      jobLocation,
      location,
      companyImage,
      companyImagePreview,
      setPostedJobs,
      resetForm
    );
  };

  const submitDriveForm = (e) => {
    handleDriveSubmit(
      e,
      driveName,
      driveDate,
      driveTime,
      driveLocation,
      driveDescription,
      driveCapacity,
      email,
      recruiterName,
      setDrives,
      resetDriveForm
    );
  };

  return (
    <div className="recruiter-dashboard">
      <div className="dashboard-header">
        <span className="dashboard-tag">Recruiter Portal</span>
        <h1>Welcome, {recruiterName}</h1>
        <p>Manage your job postings and recruitment drives all in one place.</p>
      </div>

      <div className="tabs">
        <div 
          className={`tab ${activeTab === "post-job" ? "active" : ""}`}
          onClick={() => setActiveTab("post-job")}
        >
          {editingJobId ? "Edit Job" : "Post a New Job"}
        </div>
        <div 
          className={`tab ${activeTab === "posted-jobs" ? "active" : ""}`}
          onClick={() => setActiveTab("posted-jobs")}
        >
          Posted Jobs
        </div>
        <div 
          className={`tab ${activeTab === "conduct-drive" ? "active" : ""}`}
          onClick={() => setActiveTab("conduct-drive")}
        >
          Conduct a Drive
        </div>
      </div>

      <div className="dashboard-content">
        {activeTab === "post-job" && (
          <PostJobTab 
            editingJobId={editingJobId}
            recruiterName={recruiterName}
            setRecruiterName={setRecruiterName}
            email={email}
            company={company}
            setCompany={setCompany}
            companyImagePreview={companyImagePreview}
            skillsRequired={skillsRequired}
            setSkillsRequired={setSkillsRequired}
            salaryRange={salaryRange}
            setSalaryRange={setSalaryRange}
            jobLocation={jobLocation}
            setJobLocation={setJobLocation}
            Matchingpercentage={Matchingpercentage}
            setMatchingpercentage={setMatchingpercentage}
            location={location}
            setLocation={setLocation}
            jobDescription={jobDescription}
            setJobDescription={setJobDescription}
            handleCompanyImageChange={handleCompanyImageChange}
            companyImageInputRef={companyImageInputRef}
            resetForm={resetForm}
            handleSubmit={submitJobForm}
          />
        )}
        
        {activeTab === "posted-jobs" && (
          <PostedJobsTab 
            loading={loading}
            postedJobs={postedJobs}
            handleEditJob={handleJobEdit}
            handleDeleteJob={handleJobDelete}
            setActiveTab={setActiveTab}
          />
        )}
        
        {activeTab === "conduct-drive" && (
          <ConductDriveTab 
            driveName={driveName}
            setDriveName={setDriveName}
            driveCapacity={driveCapacity}
            setDriveCapacity={setDriveCapacity}
            driveDate={driveDate}
            setDriveDate={setDriveDate}
            driveTime={driveTime}
            setDriveTime={setDriveTime}
            driveLocation={driveLocation}
            setDriveLocation={setDriveLocation}
            driveDescription={driveDescription}
            setDriveDescription={setDriveDescription}
            drives={drives}
            loadingDrives={loadingDrives}
            handleDeleteDrive={handleDriveDelete}
            handleDriveSubmit={submitDriveForm}
          />
        )}
      </div>
    </div>
  );
}

export default RecruiterDashboard;
