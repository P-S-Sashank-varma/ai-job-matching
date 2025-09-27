
import React, { useState,useEffect} from 'react';
import { 
  ArrowRight, 
  Upload,
  Clock,
  Briefcase,
  CheckCircle,
  Calendar,
  Building,
  RefreshCw,
  XCircle
} from "lucide-react";
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Card } from './ui/Card';
import { Badge } from './ui/Badge';
import { handleResumeUpload, handleRegisterDrive,fetchAppliedJobs } from "./UserPortalAPI";

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
    <div className="space-y-8">
      <div className="text-center border-b border-gray-200 pb-6">
        <Badge variant="secondary" className="mb-4">
          Profile Details
        </Badge>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          {hasExistingResume ? "Update Your Resume" : "Upload Your Resume"}
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
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
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <div className="relative">
              <input 
                type="text" 
                className="w-full px-4 py-3 border border-green-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent bg-green-50/50 placeholder:text-gray-500 text-gray-900" 
                placeholder="Enter your name" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                required 
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Email Address</label>
            <div className="relative">
              <input 
                type="email" 
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 placeholder:text-gray-400 text-gray-900" 
                value={email} 
                disabled 
                required 
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Phone Number</label>
          <div className="relative">
            <input 
              type="tel" 
              className="w-full px-4 py-3 border border-green-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent bg-green-50/50 placeholder:text-gray-500 text-gray-900" 
              placeholder="Enter phone number" 
              value={phone} 
              onChange={(e) => setPhone(e.target.value)} 
              required 
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            {hasExistingResume ? "Update Resume (Optional)" : "Upload Resume"}
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 transition-colors duration-200">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Upload className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {resumeFile ? resumeFile.name : "Drag and drop your resume here"}
                </p>
                <p className="text-xs text-gray-500 mt-1">
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
              <label 
                htmlFor="resume-upload" 
                className="px-6 py-2 bg-green-50 border border-green-300 rounded-lg text-sm font-medium text-green-700 hover:bg-green-100 cursor-pointer transition-colors duration-200"
              >
                Browse Files
              </label>
              {resumeFile && (
                <Badge variant="success" className="mt-2">
                  Selected: {resumeFile.name}
                </Badge>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-6">
          <Button 
            type="submit" 
            disabled={loading}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-2"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                {hasExistingResume ? "Update Information" : "Submit Resume"}
                <ArrowRight size={16} />
              </div>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export const renderJobsTab = (props) => {
  const { hasExistingResume, setActiveTab, navigate } = props;
  
  return (
    <div className="space-y-8">
      <div className="text-center border-b border-gray-200 pb-6">
        <Badge variant="secondary" className="mb-4">
          Recommended For You
        </Badge>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Selected Jobs</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Based on your resume, we've selected these jobs that match your skills and experience.
        </p>
      </div>
  
      <Card className="backdrop-blur-lg bg-white/80 border-white/20 shadow-xl">
        <div className="p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
            <div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900">View Your Matching Jobs</h3>
              <p className="text-gray-600 mb-4 md:mb-0">
                We've analyzed your resume and found jobs that match your skills.
              </p>
            </div>
            
            {hasExistingResume && (
              <Button 
                onClick={() => setActiveTab("resume")}
                variant="outline"
                className="flex items-center gap-2"
              >
                <RefreshCw size={16} />
                Update Resume
              </Button>
            )}
          </div>
          
          <Button 
            onClick={() => navigate("/selected-jobs")}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 flex items-center gap-2"
          >
            View Selected Jobs
            <ArrowRight size={16} />
          </Button>
        </div>
      </Card>
    </div>
  );
};
// Fix the function name to follow React conventions for regular functions
export const renderApplicationsTab = (props) => {
  const { selectedJobs, navigate, email } = props;
  
  return (
    <div className="space-y-8">
      <div className="text-center border-b border-gray-200 pb-6">
        <Badge variant="secondary" className="mb-4">
          Your Applications
        </Badge>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Application Status</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Track the status of your job applications and interview progress here.
        </p>
      </div>

      {props.loadingApplications ? (
        <div className="flex justify-center items-center py-12">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="space-y-6">
          {props.appliedJobs && props.appliedJobs.length > 0 ? (
            props.appliedJobs.map((job) => (
              <Card key={job.id} className="backdrop-blur-lg bg-gradient-to-br from-blue-100/90 to-sky-100/90 border-blue-200/50 shadow-xl">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {job.title || `Position at ${job.company}`}
                      </h3>
                      <p className="text-gray-600 text-sm">{job.company}</p>
                    </div>
                    <Badge variant={props.calculateProgress(job.completion_status) === 100 ? "success" : "secondary"} className="flex items-center gap-1">
                      {props.calculateProgress(job.completion_status) === 100 ? (
                        <>
                          <CheckCircle size={12} />
                          Completed
                        </>
                      ) : (
                        <>
                          <Clock size={12} />
                          In Progress
                        </>
                      )}
                    </Badge>
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-sm font-medium text-gray-700">Interview Progress:</div>
                      <div className="text-sm text-gray-500">
                        {Math.round(props.calculateProgress(job.completion_status))}% Complete
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${props.calculateProgress(job.completion_status)}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className={`p-3 rounded-lg border-2 ${job.completion_status?.aptitude ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'}`}>
                      <div className="flex items-center gap-2">
                        {job.completion_status?.aptitude ? (
                          <CheckCircle size={16} className="text-green-600" />
                        ) : (
                          <XCircle size={16} className="text-gray-400" />
                        )}
                        <div>
                          <div className="text-sm font-medium">Aptitude</div>
                          <div className="text-xs text-gray-500">
                            {job.completion_status?.aptitude ? 'Completed' : 'Pending'}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className={`p-3 rounded-lg border-2 ${job.completion_status?.coding ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'}`}>
                      <div className="flex items-center gap-2">
                        {job.completion_status?.coding ? (
                          <CheckCircle size={16} className="text-green-600" />
                        ) : (
                          <XCircle size={16} className="text-gray-400" />
                        )}
                        <div>
                          <div className="text-sm font-medium">Coding</div>
                          <div className="text-xs text-gray-500">
                            {job.completion_status?.coding ? 'Completed' : 'Pending'}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className={`p-3 rounded-lg border-2 ${job.completion_status?.hr ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'}`}>
                      <div className="flex items-center gap-2">
                        {job.completion_status?.hr ? (
                          <CheckCircle size={16} className="text-green-600" />
                        ) : (
                          <XCircle size={16} className="text-gray-400" />
                        )}
                        <div>
                          <div className="text-sm font-medium">HR Interview</div>
                          <div className="text-xs text-gray-500">
                            {job.completion_status?.hr ? 'Completed' : 'Pending'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                    <div className="text-sm text-gray-500">
                      Applied on: {job.applicationDate || new Date().toLocaleDateString()}
                    </div>

                    <Button
                      onClick={() => navigate(`/ai-hr-interview/${encodeURIComponent(job.recruiter_email)}`)}
                      variant="outline"
                    >
                      {props.calculateProgress(job.completion_status) === 100 ? 'View Details' : 'Continue Process'}
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <Card className="backdrop-blur-lg bg-gradient-to-br from-purple-100/90 to-violet-100/90 border-purple-200/50 shadow-xl">
              <div className="p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Briefcase size={32} className="text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Applications Yet</h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  You haven't applied to any jobs yet. Browse our selected jobs and start applying!
                </p>
                <Button
                  onClick={() => navigate("/jobs")}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  Browse Jobs
                </Button>
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export const renderDrivesTab = (props) => {
  const { upcomingDrives, loading, hasExistingResume, setActiveTab, setLoading, setUpcomingDrives } = props;
  
  return (
    <div className="space-y-8">
      <div className="text-center border-b border-gray-200 pb-6">
        <Badge variant="secondary" className="mb-4">
          Career Events
        </Badge>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Upcoming Hiring Drives</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Register for upcoming virtual and in-person hiring events from top companies.
        </p>
      </div>

      {upcomingDrives.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {upcomingDrives.map((drive) => (
            <Card key={drive.id} className="backdrop-blur-lg bg-gradient-to-br from-indigo-100/90 to-blue-100/90 border-indigo-200/50 shadow-xl hover:shadow-2xl transition-all duration-300">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{drive.title}</h3>
                    <p className="text-gray-600 text-sm">{drive.company}</p>
                  </div>
                  {drive.registered ? (
                    <Badge variant="success" className="flex items-center gap-1">
                      <CheckCircle size={12} />
                      Registered
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Calendar size={12} />
                      Upcoming
                    </Badge>
                  )}
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar size={14} />
                    <span>{new Date(drive.date).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Building size={14} />
                    <span>{drive.location}</span>
                  </div>
                </div>
                
                <div className="mb-4">
                  <p className="text-sm text-gray-700">{drive.description}</p>
                </div>
                
                {drive.positions && drive.positions.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Open Positions:</h4>
                    <div className="flex flex-wrap gap-1">
                      {drive.positions.map((position, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {position}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                <Button
                  onClick={() => handleRegisterDrive(
                    drive.id, 
                    hasExistingResume, 
                    setActiveTab, 
                    setLoading, 
                    upcomingDrives, 
                    setUpcomingDrives
                  )}
                  disabled={drive.registered || loading}
                  className={`w-full ${drive.registered 
                    ? 'bg-green-600 hover:bg-green-700 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
                  }`}
                >
                  {drive.registered ? (
                    <div className="flex items-center gap-2">
                      <CheckCircle size={14} />
                      Registered
                    </div>
                  ) : (
                    "Register Now"
                  )}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="backdrop-blur-lg bg-gradient-to-br from-teal-100/90 to-cyan-100/90 border-teal-200/50 shadow-xl">
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar size={32} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Upcoming Drives</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              There are no upcoming hiring drives at the moment. Please check back later.
            </p>
          </div>
        </Card>
      )}
    </div>
  );
};