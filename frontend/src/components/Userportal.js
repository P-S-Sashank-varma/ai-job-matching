
import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  User, 
  FileText, 
  Briefcase, 
  CheckCircle, 
  Calendar
} from "lucide-react";
import "../styles/Userportal.css";
import { 
  renderResumeTab, 
  renderJobsTab, 
  renderApplicationsTab, 
  renderDrivesTab 
} from "./UserPortalTabs";
import { 
  checkExistingResume, 
  fetchSelectedJobs, 
  setupDrivesData 
} from "./UserPortalAPI";

function UserPortal() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasExistingResume, setHasExistingResume] = useState(false);
  const [selectedJobs, setSelectedJobs] = useState([]);
  const [upcomingDrives, setUpcomingDrives] = useState([]);
  const [activeTab, setActiveTab] = useState("jobs"); // "resume", "jobs", "applications", "drives"

  const resumeInputRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = JSON.parse(atob(token.split(".")[1]));
        setEmail(decodedToken.email);
        
        checkExistingResume(decodedToken.email, setHasExistingResume, setName, setPhone, activeTab, location);
        
        if (location.pathname === '/selected-jobs') {
          setActiveTab('jobs');
        } else if (location.pathname === '/drives') {
          setActiveTab('drives');
        }
        
        if (activeTab === "jobs" || location.pathname === '/selected-jobs') {
          fetchSelectedJobs(decodedToken.email, setSelectedJobs);
        }

        setupDrivesData(setUpcomingDrives);
      } catch (error) {
        console.error("Error parsing token:", error);
      
      }
    } else {
      setEmail("user@example.com");
      checkExistingResume("user@example.com", setHasExistingResume, setName, setPhone, activeTab, location);
      setupDrivesData(setUpcomingDrives);
    }
  }, [activeTab, location.pathname]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const tabProps = {
    name, setName,
    email,
    phone, setPhone,
    resumeFile, setResumeFile,
    loading, setLoading,
    hasExistingResume, setHasExistingResume,
    selectedJobs, setSelectedJobs,
    upcomingDrives, setUpcomingDrives,
    setActiveTab,
    navigate,
    resumeInputRef,
    location,
  };

  return (
    <div className="user-portal">
      <nav className="navbar">
        <div className="logo">Smart Hire AI</div>
        
        <ul className="nav-links">
          <li><a href="/">Home</a></li>
          <li><a href="/contact">Contact</a></li>
        </ul>
        
        <div className="user-info">
          <div className="user-icon">
            <User size={16} />
          </div>
          <span className="username">{email || "User"}</span>
          <button onClick={handleLogout} className="btn btn-primary" style={{marginLeft: '1rem'}}>Logout</button>
        </div>
      </nav>

      <div className="main-container">
        <div className="sidebar">
          <div className="sidebar-nav">
            <button
              onClick={() => {
                setActiveTab("resume");
              }}
              className={`sidebar-link ${activeTab === "resume" ? "active" : ""}`}
            >
              <FileText size={18} />
              <span>Resume</span>
            </button>
            
            <button
              onClick={() => {
                setActiveTab("jobs");
              }}
              className={`sidebar-link ${activeTab === "jobs" ? "active" : ""}`}
            >
              <Briefcase size={18} />
              <span>Selected Jobs</span>
            </button>
            
            <button
              onClick={() => setActiveTab("applications")}
              className={`sidebar-link ${activeTab === "applications" ? "active" : ""}`}
            >
              <CheckCircle size={18} />
              <span>Applications</span>
            </button>

            <button
              onClick={() => {
                setActiveTab("drives");
              }}
              className={`sidebar-link ${activeTab === "drives" ? "active" : ""}`}
            >
              <Calendar size={18} />
              <span>Hiring Drives</span>
            </button>
          </div>
          
          <div className="resume-status">
            <h4 className="font-medium">Resume Status</h4>
            <div className="status-indicator">
              <div className={`status-dot ${hasExistingResume ? 'active' : 'pending'}`}></div>
              <span>
                {hasExistingResume ? 'Resume uploaded' : 'No resume uploaded'}
              </span>
            </div>
          </div>
        </div>
        
        <div className="content-area">
          {activeTab === "resume" && renderResumeTab(tabProps)}
          {activeTab === "jobs" && renderJobsTab(tabProps)}
          {activeTab === "applications" && renderApplicationsTab(tabProps)}
          {activeTab === "drives" && renderDrivesTab(tabProps)}
        </div>
      </div>
    </div>
  );
}

export default UserPortal;