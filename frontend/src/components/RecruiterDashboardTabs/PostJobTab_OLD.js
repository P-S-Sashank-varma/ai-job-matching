import React from "react";
import { Edit, Plus } from "lucide-react";
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';

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
    <div className="space-y-8">
      <div className="text-center border-b border-gray-200 pb-6">
        <div className="flex items-center justify-center gap-2 mb-4">
          {editingJobId ? (
            <Edit className="w-6 h-6 text-blue-600" />
          ) : (
            <Plus className="w-6 h-6 text-blue-600" />
          )}
          <h2 className="text-3xl font-bold text-gray-900">
            {editingJobId ? "Edit Job" : "Post a New Job"}
          </h2>
        </div>
        <p className="text-gray-600 max-w-2xl mx-auto">
          {editingJobId 
            ? "Update your job posting details below."
            : "Create a new job posting to attract the best candidates."}
        </p>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Recruiter Name</label>
            <Input 
              type="text" 
              value={recruiterName} 
              onChange={(e) => setRecruiterName(e.target.value)} 
              required 
              placeholder="Enter Recruiter Name"
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <Input 
              type="email" 
              value={email} 
              readOnly 
              required
              className="bg-gray-50"
            />
          </div>
        </div>
          
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Company Name</label>
          <Input 
            type="text" 
            value={company} 
            onChange={(e) => setCompany(e.target.value)} 
            required
            placeholder="Enter Company Name"
          />
        </div>
          
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Company Logo</label>
          <div className="flex items-center space-x-4">
            <input 
              type="file" 
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" 
              accept="image/*" 
              onChange={handleCompanyImageChange} 
              ref={companyImageInputRef} 
            />
            
            {companyImagePreview && (
              <div className="relative">
                <img 
                  src={companyImagePreview} 
                  alt="Company Preview" 
                  className="w-16 h-16 object-cover rounded-lg border border-gray-300" 
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 rounded-lg flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200">
                  <span className="text-white text-xs font-medium">Click to change</span>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Skills Required</label>
            <Input 
              type="text" 
              value={skillsRequired} 
              onChange={(e) => setSkillsRequired(e.target.value)} 
              placeholder="e.g. JavaScript, React, Node.js" 
              required 
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Salary Range</label>
            <Input 
              type="text" 
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
