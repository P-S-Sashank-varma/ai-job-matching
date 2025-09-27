
import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  User, 
  FileText, 
  Briefcase, 
  CheckCircle, 
  Calendar,
  LogOut,
  Home,
  MessageCircle
} from "lucide-react";
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { Badge } from './ui/Badge';
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-teal-50 to-emerald-50">
      {/* Modern Navigation Bar */}
      <nav className="bg-white/80 backdrop-blur-lg border-b border-white/20 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-green-600 to-teal-600 rounded-lg flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
                Smart Hire AI
              </span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="/" className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors duration-200">
                <Home className="w-4 h-4" />
                Home
              </a>
              <a href="/contact" className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors duration-200">
                <MessageCircle className="w-4 h-4" />
                Contact
              </a>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-green-100 to-teal-100 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-blue-600" />
                </div>
                <span className="text-sm font-medium text-gray-700 hidden sm:block">
                  {email || "User"}
                </span>
              </div>
              <Button 
                onClick={handleLogout} 
                variant="ghost" 
                size="sm"
                className="flex items-center gap-2 text-gray-600 hover:text-red-600"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:block">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Modern Sidebar */}
          <div className="lg:col-span-1">
            <Card className="backdrop-blur-lg bg-white/80 border-white/20 shadow-xl sticky top-24">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Navigation</h3>
                
                <div className="space-y-2">
                  <button
                    onClick={() => setActiveTab("resume")}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                      activeTab === "resume" 
                        ? 'bg-gradient-to-r from-green-500 to-teal-500 text-white shadow-lg' 
                        : 'text-gray-700 hover:bg-green-50 hover:text-green-600'
                    }`}
                  >
                    <FileText className="w-5 h-5" />
                    <span className="font-medium">Resume</span>
                  </button>
                  
                  <button
                    onClick={() => setActiveTab("jobs")}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                      activeTab === "jobs" 
                        ? 'bg-gradient-to-r from-green-500 to-teal-500 text-white shadow-lg' 
                        : 'text-gray-700 hover:bg-green-50 hover:text-green-600'
                    }`}
                  >
                    <Briefcase className="w-5 h-5" />
                    <span className="font-medium">Selected Jobs</span>
                  </button>
                  
                  <button
                    onClick={() => setActiveTab("applications")}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                      activeTab === "applications" 
                        ? 'bg-gradient-to-r from-green-500 to-teal-500 text-white shadow-lg' 
                        : 'text-gray-700 hover:bg-green-50 hover:text-green-600'
                    }`}
                  >
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-medium">Applications</span>
                  </button>

                  <button
                    onClick={() => setActiveTab("drives")}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                      activeTab === "drives" 
                        ? 'bg-gradient-to-r from-green-500 to-teal-500 text-white shadow-lg' 
                        : 'text-gray-700 hover:bg-green-50 hover:text-green-600'
                    }`}
                  >
                    <Calendar className="w-5 h-5" />
                    <span className="font-medium">Hiring Drives</span>
                  </button>
                </div>
                
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Resume Status</h4>
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${hasExistingResume ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                    <span className="text-sm text-gray-600">
                      {hasExistingResume ? 'Resume uploaded' : 'No resume uploaded'}
                    </span>
                  </div>
                  {hasExistingResume && (
                    <Badge variant="success" className="mt-2">
                      Ready to apply
                    </Badge>
                  )}
                </div>
              </div>
            </Card>
          </div>
          
          {/* Main Content Area */}
          <div className="lg:col-span-3">
            <Card className="backdrop-blur-lg bg-white/80 border-white/20 shadow-xl">
              <div className="p-8">
                {activeTab === "resume" && renderResumeTab(tabProps)}
                {activeTab === "jobs" && renderJobsTab(tabProps)}
                {activeTab === "applications" && renderApplicationsTab(tabProps)}
                {activeTab === "drives" && renderDrivesTab(tabProps)}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserPortal;