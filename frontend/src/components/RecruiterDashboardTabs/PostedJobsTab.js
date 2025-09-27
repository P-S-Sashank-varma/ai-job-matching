import React from "react";
import { Calendar, Briefcase, MapPin, Edit, Trash2 } from "lucide-react";
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

export const PostedJobsTab = ({ 
  loading, 
  postedJobs, 
  handleEditJob, 
  handleDeleteJob, 
  setActiveTab 
}) => {
  const getLocationVariant = (jobLocationType) => {
    switch (jobLocationType) {
      case "Remote": return "success";
      case "Onsite": return "warning";
      case "Hybrid": return "secondary";
      default: return "default";
    }
  };

  return (
    <div className="p-6 bg-gradient-to-br from-yellow-100/90 to-orange-100/90 rounded-xl border border-yellow-200/50 shadow-lg space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-orange-200">
        <div className="flex items-center gap-3">
          <Briefcase className="w-6 h-6 text-orange-600" />
          <h2 className="text-2xl font-bold text-gray-900">Posted Jobs</h2>
        </div>
      </div>
      
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
          <span className="ml-3 text-gray-600">Loading jobs...</span>
        </div>
      ) : postedJobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {postedJobs.map((job) => (
            <Card key={job.id} className="bg-gradient-to-br from-white/90 to-yellow-50/90 border-yellow-200 hover:shadow-lg transition-shadow duration-200">
              <div className="p-4">
                <div className="flex items-start justify-between mb-3">
                  {job.company_image ? (
                    <img 
                      src={job.company_image} 
                      alt={job.company} 
                      className="w-12 h-12 object-cover rounded-lg border border-gray-200" 
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Briefcase className="w-6 h-6 text-gray-400" />
                    </div>
                  )}
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleEditJob(job)}
                      className="p-2 h-8 w-8"
                    >
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleDeleteJob(job.id)}
                      className="p-2 h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
                
                <h3 className="font-semibold text-lg text-gray-900 mb-2">{job.company}</h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{job.job_description}</p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <Badge variant={getLocationVariant(job.job_location)}>
                      {job.job_location}
                    </Badge>
                    {job.location && <span>• {job.location}</span>}
                  </div>
                  
                  {job.skills_required && (
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Skills:</span> {job.skills_required}
                    </div>
                  )}
                  
                  {job.salary_range && (
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Salary:</span> {job.salary_range}
                    </div>
                  )}
                </div>
                
                <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-100">
                  <span>Job ID: {job.id}</span>
                  {job.match_percentage && (
                    <Badge variant="secondary">{job.match_percentage}% Match</Badge>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs posted yet</h3>
          <p className="text-gray-600 mb-4">Start by posting your first job to attract candidates.</p>
          <Button onClick={() => setActiveTab("post-job")}>
            Post New Job
          </Button>
        </div>
      )}
    </div>
  );
};

