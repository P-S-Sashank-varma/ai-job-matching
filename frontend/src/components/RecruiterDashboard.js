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
  handleDriveSubmit,
  decodeToken,
  fetchRecruiterProfile
} from "./RecruiterDashboardAPI";
import { useNavigate } from "react-router-dom";

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
  const [recruiterName1, setRecruiterName1] = useState("");
  const [recruiterEmail1, setRecruiterEmail1] = useState("");
  

  const companyImageInputRef = useRef(null);
  const navigate = useNavigate();

  // Initialize recruiter info from token on component mount
  useEffect(() => {
    const initializeRecruiterInfo = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.log("No token found, using demo data");
          setEmail("demo@example.com");
          setRecruiterName("Demo Recruiter");
          setRecruiterEmail1("demo@example.com");
          setRecruiterName1("Demo Recruiter");
          return;
        }
        
        // Decode token to get email
        const decodedToken = decodeToken(token);
        if (decodedToken && decodedToken.email) {
          setEmail(decodedToken.email);
          setRecruiterEmail1(decodedToken.email);
          
          // Fetch recruiter profile to get name
          const recruiter = await fetchRecruiterProfile(decodedToken.email);
          if (recruiter && recruiter.name) {
            setRecruiterName(recruiter.name);
            setRecruiterName1(recruiter.name);
          } else {
            // Fallback to email username if no name is found
            const username = decodedToken.email.split('@')[0];
            setRecruiterName(username);
            setRecruiterName1(username);
          }
        }
      } catch (error) {
        console.error("Error initializing recruiter info:", error);
        toast.error("Error loading profile data");
        
        // Set fallback values
        setEmail("demo@example.com");
        setRecruiterName("Demo Recruiter");
        setRecruiterEmail1("demo@example.com");
        setRecruiterName1("Demo Recruiter");
      }
    };
    
    initializeRecruiterInfo();
  }, []);

  // Fetch jobs and drives when email changes
  useEffect(() => {
    if (email) {
      fetchJobs(email, setPostedJobs, setLoading);
      fetchDrives(email, setDrives, setLoadingDrives);
    }
  }, [email]);

  // Reset form for job posting
  const resetForm = () => {
    // Keep the recruiter name and email, reset other fields
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
    // Don't reset the recruiter email and name
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
      recruiterEmail1,
      recruiterName1,
      setDrives,
      resetDriveForm,
    );
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="recruiter-dashboard">
      <div className="dashboard-header">
        <span className="dashboard-tag">Recruiter Portal</span>
        <h1>Welcome, {recruiterName || "Recruiter"}</h1>
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
            recruiterEmail1={recruiterEmail1}
            recruiterName1={recruiterName1}
            setRecruiterEmail1={setRecruiterEmail1}
            setRecruiterName1={setRecruiterName1}
            drives={drives}
            loadingDrives={loadingDrives}
            handleDeleteDrive={handleDriveDelete}
            handleDriveSubmit={submitDriveForm}
          />
        )}
      </div>
      <button onClick={handleLogout} style={{position: 'absolute', top: 20, right: 20, padding: '8px 18px', background: '#5b7fff', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 600, cursor: 'pointer'}}>Logout</button>
    </div>
  );
}

export default RecruiterDashboard;
