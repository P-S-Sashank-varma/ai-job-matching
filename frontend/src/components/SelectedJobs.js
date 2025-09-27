import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/Card";
import { Button } from "./ui/Button";
import { Badge } from "./ui/Badge";
import Logo from "./ui/Logo";
import {
  Building,
  Mail,
  Star,
  Play,
  CheckCircle,
  Clock,
  Trophy,
  ArrowRight,
  Loader,
  Search
} from "lucide-react";

const SelectedJobs = () => {
  const [matchedJobs, setMatchedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState("");
  const [completionStatus, setCompletionStatus] = useState({});
  const [logoErrorMap, setLogoErrorMap] = useState({});

  const navigate = useNavigate();
  const location = useLocation();

  // Decode user email from JWT
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUserEmail(decodedToken.email);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }

    // Load round completion status from local storage
    const storedStatus = JSON.parse(localStorage.getItem("completionStatus") || "{}");
    setCompletionStatus(storedStatus);
  }, []);

  // Reload completionStatus from localStorage when page becomes visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        const storedStatus = JSON.parse(localStorage.getItem("completionStatus") || "{}");
        setCompletionStatus(storedStatus);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  // Reload completionStatus from localStorage when route changes
  useEffect(() => {
    const storedStatus = JSON.parse(localStorage.getItem("completionStatus") || "{}");
    setCompletionStatus(storedStatus);
  }, [location]);

  // Fetch matching jobs once email is available
  useEffect(() => {
    if (!userEmail) return;

    const fetchJobsAndStatuses = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found");

        const res = await fetch(`https://ai-job-matching-zd8j.onrender.com/matching-jobs/${userEmail}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Failed to fetch jobs");

        const data = await res.json();
        if (!Array.isArray(data)) throw new Error("Unexpected data format");

        // For each job, fetch the completion status
        const jobsWithStatus = await Promise.all(
          data.map(async (job) => {
            const recruiterEmail = job.recruiter_email || job.email || job.recruiterEmail;
            if (!recruiterEmail) return { ...job, completion_status: {} };
            try {
              const statusRes = await fetch(
                `https://ai-job-matching-zd8j.onrender.com/api/job-status/${userEmail}/${recruiterEmail}`,
                { headers: { Authorization: `Bearer ${token}` } }
              );
              if (!statusRes.ok) return { ...job, completion_status: {} };
              const statusData = await statusRes.json();
              return { ...job, completion_status: statusData.completion_status || {} };
            } catch {
              return { ...job, completion_status: {} };
            }
          })
        );

        setMatchedJobs(jobsWithStatus);
      } catch (err) {
        console.error("Job fetch error:", err);
        setMatchedJobs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchJobsAndStatuses();
  }, [userEmail]);

  // Check if all rounds are done
  const getAllRoundsCompleted = (job) => {
    const status = job.completion_status || {};
    return status.aptitude && status.coding && status.hr;
  };

  // Count how many rounds are completed
  const getCompletedRoundsCount = (job) => {
    const status = job.completion_status || {};
    let count = 0;
    if (status.aptitude) count++;
    if (status.coding) count++;
    if (status.hr) count++;
    return count;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Logo size={32} className="drop-shadow-sm" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Your Matched Jobs
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            Opportunities tailored for {userEmail ? userEmail.split('@')[0] : "you"}
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Loader className="w-8 h-8 animate-spin text-blue-600 mb-4" />
            <p className="text-gray-600">Loading your personalized job matches...</p>
          </div>
        ) : matchedJobs.length === 0 ? (
          <Card className="max-w-md mx-auto text-center py-16">
            <CardContent className="space-y-4">
              <Search className="w-12 h-12 text-gray-400 mx-auto" />
              <h3 className="text-xl font-semibold text-gray-700">No Jobs Found</h3>
              <p className="text-gray-500">We couldn't find any matching jobs at the moment. Check back soon!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {matchedJobs.map((job, index) => {
              const recruiterEmail =
                job.recruiter_email || job.email || job.recruiterEmail || "N/A";

              const completedRounds = getCompletedRoundsCount(job);
              const allCompleted = getAllRoundsCompleted(job);
              const derivedLogoUrl = job.company_image_filename
                ? `https://ai-job-matching-zd8j.onrender.com/get-company-image/${job.company_image_filename}`
                : ((job.company_image_url && typeof job.company_image_url === 'string' && job.company_image_url.length > 0)
                    ? job.company_image_url
                    : null);
              const companyInitial = (job.company || 'C').trim().charAt(0).toUpperCase();
              const progressPercentage = (completedRounds / 3) * 100;

              return (
                <Card 
                  key={index} 
                  className={`group hover:shadow-xl transition-all duration-300 border-2 ${
                    allCompleted 
                      ? 'border-green-200 bg-gradient-to-br from-green-50 to-emerald-50' 
                      : 'border-blue-200 bg-gradient-to-br from-white to-blue-50'
                  } hover:scale-[1.02]`}
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-4">
                      {/* Company Logo */}
                      <div className="flex-shrink-0">
                        {derivedLogoUrl && !logoErrorMap[index] ? (
                          <img
                            src={derivedLogoUrl}
                            alt={`${job.company || 'Company'} Logo`}
                            className="w-16 h-16 rounded-full object-contain border-2 border-white shadow-md"
                            onError={() => setLogoErrorMap(prev => ({ ...prev, [index]: true }))}
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-md border-2 border-white">
                            {companyInitial}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <CardTitle className="text-xl text-gray-800 flex items-center gap-2">
                          <Building className="w-5 h-5 text-blue-600" />
                          {job.company || "Unknown Company"}
                        </CardTitle>
                        <CardDescription className="text-gray-600">
                          {job.recruiter_name || "Recruiter"}
                        </CardDescription>
                      </div>
                      
                      {/* Match Percentage Badge */}
                      <Badge 
                        variant={job.match_percentage >= 80 ? "success" : job.match_percentage >= 60 ? "warning" : "secondary"}
                        className="text-sm font-semibold"
                      >
                        <Star className="w-3 h-3 mr-1" />
                        {job.match_percentage || 0}% Match
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Recruiter Email */}
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span className="truncate">{recruiterEmail}</span>
                    </div>

                    {/* Skills Matched */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">Matched Skills:</h4>
                      <div className="flex flex-wrap gap-1">
                        {job.matched_skills?.length ? (
                          job.matched_skills.slice(0, 4).map((skill, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))
                        ) : (
                          <Badge variant="secondary" className="text-xs">No skills listed</Badge>
                        )}
                        {job.matched_skills?.length > 4 && (
                          <Badge variant="secondary" className="text-xs">
                            +{job.matched_skills.length - 4} more
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Progress Section */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">
                          {allCompleted ? (
                            <div className="flex items-center gap-2 text-green-600">
                              <Trophy className="w-4 h-4" />
                              All rounds completed!
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 text-blue-600">
                              <Clock className="w-4 h-4" />
                              {completedRounds}/3 rounds completed
                            </div>
                          )}
                        </span>
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-full transition-all duration-500 ${
                            allCompleted
                              ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                              : 'bg-gradient-to-r from-blue-500 to-purple-500'
                          }`}
                          style={{ width: `${progressPercentage}%` }}
                        />
                      </div>

                      {/* Action Button */}
                      <Button
                        onClick={() =>
                          navigate(`/ai-hr-interview/${encodeURIComponent(recruiterEmail)}`)
                        }
                        className={`w-full transition-all duration-200 ${
                          allCompleted
                            ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700'
                            : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
                        } group`}
                      >
                        {allCompleted ? (
                          <>
                            <CheckCircle className="w-4 h-4 mr-2" />
                            View Application Status
                          </>
                        ) : (
                          <>
                            <Play className="w-4 h-4 mr-2" />
                            Continue Interview
                            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default SelectedJobs;
