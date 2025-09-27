import React, { useEffect, useState } from "react";
import { Search, MapPin, DollarSign, Calendar, User, Briefcase, Sparkles, Building } from "lucide-react";
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Card } from './ui/Card';
import { Badge } from './ui/Badge';

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch("https://ai-job-matching-zd8j.onrender.com/recruiter-dashboard");
        if (!response.ok) {
          throw new Error("Failed to fetch jobs");
        }
        const data = await response.json();
        console.log("Fetched jobs:", data);
        setJobs(data);
        setFilteredJobs(data);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setFilteredJobs(jobs);
      return;
    }
    
    const filtered = jobs.filter(job => 
      job.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.recruiter_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.skills_required?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.job_location?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredJobs(filtered);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-lg border-b border-white/20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-violet-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                AI Job Match
              </h1>
            </div>
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
              Discover Your Perfect Job
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Find opportunities that match your skills with AI-powered job recommendations
            </p>
          </div>

          {/* Search Section */}
          <Card className="backdrop-blur-lg bg-white/80 border-white/20 shadow-xl max-w-2xl mx-auto">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search by company, skills, location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="pl-10"
                />
              </div>
              <Button 
                onClick={handleSearch}
                className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white px-6 py-2 font-medium flex items-center gap-2"
              >
                <Search className="w-4 h-4" />
                Search
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Jobs Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600 text-lg">Loading amazing job opportunities...</p>
            </div>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Briefcase className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">No Jobs Found</h3>
            <p className="text-gray-600">Try adjusting your search criteria or check back later for new opportunities.</p>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-gray-900">
                {filteredJobs.length} Job{filteredJobs.length !== 1 ? 's' : ''} Found
              </h3>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                AI Matched
              </Badge>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
              {filteredJobs.map((job, index) => (
                <Card key={index} className="backdrop-blur-lg bg-white/80 border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] overflow-hidden">
                  <div className="relative p-6">
                    {/* Company Logo */}
                    <div className="flex items-start gap-4 mb-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-violet-100 to-purple-100 rounded-2xl flex items-center justify-center flex-shrink-0 overflow-hidden">
                        <img 
                          src={job.company_image_filename
                            ? `https://ai-job-matching-zd8j.onrender.com/get-company-image/${job.company_image_filename}`
                            : ((job.company_image_url && typeof job.company_image_url === 'string' && job.company_image_url.length > 0)
                                ? job.company_image_url
                                : '/logo192.png')}
                          alt={`${job.company} Logo`} 
                          className="w-full h-full object-cover"
                          onError={(e) => { 
                            e.currentTarget.src = '/logo192.png';
                            e.currentTarget.className = 'w-8 h-8 text-blue-600';
                          }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-xl font-bold text-gray-900 mb-1 truncate">
                          {job.company}
                        </h3>
                        <p className="text-sm text-gray-600 flex items-center gap-1">
                          <User className="w-4 h-4" />
                          {job.recruiter_name}
                        </p>
                      </div>
                      {job.match_percentage && (
                        <Badge 
                          variant={parseInt(job.match_percentage) >= 80 ? "success" : 
                                   parseInt(job.match_percentage) >= 60 ? "warning" : "secondary"}
                          className="font-semibold"
                        >
                          {job.match_percentage}% Match
                        </Badge>
                      )}
                    </div>

                    {/* Job Details */}
                    <div className="space-y-4 mb-6">
                      <div className="grid grid-cols-1 gap-3">
                        {job.salary_range && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <DollarSign className="w-4 h-4 text-green-600" />
                            <span>{job.salary_range}</span>
                          </div>
                        )}
                        
                        {job.job_location && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <MapPin className="w-4 h-4 text-blue-600" />
                            <span>{job.job_location}</span>
                          </div>
                        )}
                        
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="w-4 h-4 text-purple-600" />
                          <span>Posted {new Date().toLocaleDateString()}</span>
                        </div>
                      </div>

                      {/* Skills */}
                      {job.skills_required && (
                        <div>
                          <h4 className="text-sm font-semibold text-gray-900 mb-2">Required Skills:</h4>
                          <div className="flex flex-wrap gap-2">
                            {job.skills_required.split(",").slice(0, 6).map((skill, idx) => (
                              <Badge 
                                key={idx} 
                                variant="outline" 
                                className="text-xs bg-blue-50 text-blue-700 border-blue-200"
                              >
                                {skill.trim()}
                              </Badge>
                            ))}
                            {job.skills_required.split(",").length > 6 && (
                              <Badge variant="outline" className="text-xs">
                                +{job.skills_required.split(",").length - 6} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Apply Button */}
                    <Button className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-semibold py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 group">
                      <Sparkles className="w-5 h-5 group-hover:animate-pulse" />
                      AI Will Apply
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Jobs;
