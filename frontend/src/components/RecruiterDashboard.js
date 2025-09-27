import React, { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { Plus, Briefcase, Calendar, LogOut, User } from "lucide-react";
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { Badge } from './ui/Badge';
import Logo from './ui/Logo';
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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-rose-50">
      {/* Modern Header */}
      <div className="bg-white/80 backdrop-blur-lg border-b border-white/20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <Logo size={32} className="drop-shadow-sm" />
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">SmartHire AI</h1>
                <p className="text-sm text-gray-600">Recruiter Portal - Welcome, {recruiterName || "Recruiter"}</p>
              </div>
            </div>
            
            <Button 
              onClick={handleLogout} 
              variant="ghost" 
              size="sm"
              className="flex items-center gap-2 text-gray-600 hover:text-red-600"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
            Recruitment Dashboard
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Manage your job postings and recruitment drives all in one place. 
            Connect with the best candidates using our AI-powered matching system.
          </p>
        </div>

        {/* Modern Tabs */}
        <div className="mb-8">
          <Card className="backdrop-blur-lg bg-white/80 border-white/20 shadow-xl p-2">
            <div className="flex space-x-2">
              <Button
                onClick={() => setActiveTab("post-job")}
                variant={activeTab === "post-job" ? "default" : "ghost"}
                className={`flex items-center gap-2 px-4 py-3 font-medium transition-all duration-200 ${
                  activeTab === "post-job" 
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg' 
                    : 'text-gray-700 hover:text-orange-600 hover:bg-orange-50'
                }`}
              >
                <Plus className="w-4 h-4" />
                {editingJobId ? "Edit Job" : "Post New Job"}
              </Button>
              
              <Button
                onClick={() => setActiveTab("posted-jobs")}
                variant={activeTab === "posted-jobs" ? "default" : "ghost"}
                className={`flex items-center gap-2 px-4 py-3 font-medium transition-all duration-200 ${
                  activeTab === "posted-jobs" 
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg' 
                    : 'text-gray-700 hover:text-orange-600 hover:bg-orange-50'
                }`}
              >
                <Briefcase className="w-4 h-4" />
                Posted Jobs
                {postedJobs.length > 0 && (
                  <Badge variant="secondary" className="ml-1">
                    {postedJobs.length}
                  </Badge>
                )}
              </Button>
              
              <Button
                onClick={() => setActiveTab("conduct-drive")}
                variant={activeTab === "conduct-drive" ? "default" : "ghost"}
                className={`flex items-center gap-2 px-4 py-3 font-medium transition-all duration-200 ${
                  activeTab === "conduct-drive" 
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg' 
                    : 'text-gray-700 hover:text-orange-600 hover:bg-orange-50'
                }`}
              >
                <Calendar className="w-4 h-4" />
                Conduct Drive
                {drives.length > 0 && (
                  <Badge variant="secondary" className="ml-1">
                    {drives.length}
                  </Badge>
                )}
              </Button>
            </div>
          </Card>
        </div>

        {/* Content Area */}
        <Card className="backdrop-blur-lg bg-white/80 border-white/20 shadow-xl">
          <div className="p-8">
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
        </Card>
      </div>
    </div>
  );
}

export default RecruiterDashboard;
