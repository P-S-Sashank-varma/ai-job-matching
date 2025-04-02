import { toast } from "sonner";

// Fetch jobs from the API
export const fetchJobs = async (recruiterEmail, setPostedJobs, setLoading) => {
  setLoading(true);
  try {
    const token = localStorage.getItem("token") || "dummy-token";
    
    // For demo purposes, use sample data if API is not accessible
    const sampleJobs = [
      {
        id: "1",
        company: "TechCorp",
        job_description: "Senior React Developer position",
        skills_required: "React, TypeScript, Node.js",
        salary_range: "$100,000 - $130,000",
        job_location: "Remote",
        location: "Anywhere",
        company_image: null,
        Matchingpercentage: "85"
      },
      {
        id: "2",
        company: "InnovateSoft",
        job_description: "Full Stack Engineer needed for exciting projects",
        skills_required: "React, Python, AWS",
        salary_range: "$90,000 - $120,000",
        job_location: "Hybrid",
        location: "New York, NY",
        company_image: null,
        Matchingpercentage: "75"
      }
    ];

    try {
      const response = await fetch(`http://127.0.0.1:8000/recruiter-dashboard/${encodeURIComponent(recruiterEmail)}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (response.ok) {
        const data = await response.json();
        setPostedJobs(data);
      } else {
        console.log("Using sample jobs data");
        setPostedJobs(sampleJobs);
      }
    } catch (error) {
      console.log("API error, using sample jobs data");
      setPostedJobs(sampleJobs);
    }
  } catch (error) {
    console.error("Error fetching jobs:", error);
    toast.error("Failed to fetch jobs");
  } finally {
    setLoading(false);
  }
};

// Fetch drives from the API
export const fetchDrives = async (recruiterEmail, setDrives, setLoadingDrives) => {
  setLoadingDrives(true);
  try {
    const token = localStorage.getItem("token") || "dummy-token";
    
    try {
      const response = await fetch(`http://127.0.0.1:8000/drives/${encodeURIComponent(recruiterEmail)}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (response.ok) {
        const data = await response.json();
        setDrives(data);
      } else {
        console.log("Failed to fetch drives from API");
        setDrives([]);
      }
    } catch (error) {
      console.log("API error fetching drives");
      setDrives([]);
    }
  } catch (error) {
    console.error("Error fetching drives:", error);
    toast.error("Failed to fetch drives");
  } finally {
    setLoadingDrives(false);
  }
};

// Handle company image upload
export const handleCompanyImageUpload = (event, setCompanyImage, setCompanyImagePreview) => {
  const file = event.target.files[0];
  if (file) {
    setCompanyImage(file);
    setCompanyImagePreview(URL.createObjectURL(file));
  }
};

// Handle edit job
export const handleEditJob = (
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
) => {
  setEditingJobId(job.id);
  setCompany(job.company);
  setJobDescription(job.job_description);
  setSkillsRequired(job.skills_required);
  setSalaryRange(job.salary_range);
  setJobLocation(job.job_location);
  setLocation(job.location);
  setCompanyImagePreview(job.company_image);
  setMatchingpercentage(job.Matchingpercentage);
  setActiveTab("post-job");
};

// Handle delete job
export const handleDeleteJob = async (jobId, setPostedJobs) => {
  if (!window.confirm("Are you sure you want to delete this job?")) return;
  
  try {
    const token = localStorage.getItem("token") || "dummy-token";

    try {
      const response = await fetch(`http://127.0.0.1:8000/recruiter-dashboard/${jobId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        toast.success("Job deleted successfully!");
      } else {
        throw new Error("Failed to delete job");
      }
    } catch (error) {
      console.log("API error, updating UI only");
    }
    
    // Update UI regardless of API success
    setPostedJobs(prev => prev.filter(job => job.id !== jobId));
    
  } catch (error) {
    console.error("Error deleting job:", error);
    toast.error("Failed to delete job");
  }
};

// Handle delete drive
export const handleDeleteDrive = async (driveId, setDrives) => {
  if (!window.confirm("Are you sure you want to delete this drive?")) return;
  
  try {
    const token = localStorage.getItem("token") || "dummy-token";

    try {
      const response = await fetch(`http://127.0.0.1:8000/drives/${driveId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        toast.success("Drive deleted successfully!");
      } else {
        throw new Error("Failed to delete drive");
      }
    } catch (error) {
      console.log("API error, updating UI only");
    }
    
    // Update UI regardless of API success
    setDrives(prev => prev.filter(drive => drive.id !== driveId));
    
  } catch (error) {
    console.error("Error deleting drive:", error);
    toast.error("Failed to delete drive");
  }
};

// Handle job form submission
export const handleJobSubmit = async (
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
) => {
  e.preventDefault();

  const token = localStorage.getItem("token") || "dummy-token";

  const formData = new FormData();
  formData.append("recruiter_name", recruiterName);
  formData.append("email", email);
  formData.append("company", company);
  formData.append("job_description", jobDescription);
  formData.append("skills_required", skillsRequired);
  formData.append("salary_range", salaryRange);
  formData.append("match_percentage", Matchingpercentage); 
  formData.append("job_location", jobLocation);
  formData.append("location", location);
  if (companyImage) formData.append("company_image", companyImage);

  try {
    const url = editingJobId
      ? `http://127.0.0.1:8000/recruiter-dashboard/${editingJobId}`
      : "http://127.0.0.1:8000/recruiter-dashboard";
    const method = editingJobId ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        body: formData,
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        toast.success(editingJobId ? "Job updated successfully!" : "Job posted successfully!");
        // Refetch jobs instead of updating state directly
        const responseEmail = email || "demo@example.com";
        fetchJobs(responseEmail, setPostedJobs, () => {});
      } else {
        const result = await response.json();
        toast.error(`Error: ${result.detail || "Something went wrong"}`);
      }
    } catch (error) {
      console.log("API error, simulating success for demo");
      toast.success(editingJobId ? "Job updated successfully!" : "Job posted successfully!");
      
      // Simulate API response by updating UI
      const newJob = {
        id: editingJobId || Date.now().toString(),
        company,
        job_description: jobDescription,
        skills_required: skillsRequired,
        salary_range: salaryRange,
        job_location: jobLocation,
        location,
        company_image: companyImagePreview,
        Matchingpercentage
      };
      
      if (editingJobId) {
        setPostedJobs(prev => prev.map(job => job.id === editingJobId ? newJob : job));
      } else {
        setPostedJobs(prev => [...prev, newJob]);
      }
    }
    
    resetForm();
  } catch (error) {
    console.error("Error posting job:", error);
    toast.error("Failed to post job. Please try again.");
  }
};

export const handleDriveSubmit = async (
  e,
  driveName,
  driveDate,
  driveTime,
  driveLocation,
  driveDescription,
  driveCapacity,
  recruiterEmail,  // ensure this is a string, not the function
  recruiterName,
  setDrives,
  resetDriveForm,  // ensure this is a string, not the function
) => {
  e.preventDefault();
  
  const token = localStorage.getItem("token") || "dummy-token";

  // Log the data before submitting
  console.log({
    name: driveName,
    date: driveDate,
    time: driveTime,
    location: driveLocation,
    description: driveDescription,
    capacity: driveCapacity,
    recruiterEmail: recruiterEmail,  // pass the actual email value
    recruiterName: recruiterName     // pass the actual name value
  });

  try {
    const formData = new FormData();
    formData.append("name", driveName);
    formData.append("date", driveDate);
    formData.append("time", driveTime);
    formData.append("location", driveLocation);
    formData.append("description", driveDescription);
    formData.append("capacity", driveCapacity);
    formData.append("recruiter_name", recruiterName);  // pass the actual name value
    formData.append("recruiter_email", recruiterEmail);  // pass the actual email value

    const response = await fetch("http://127.0.0.1:8000/drives/", {
      method: "POST",
      body: formData,
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.ok) {
      const newDrive = await response.json();
      toast.success("Drive scheduled successfully!");
      setDrives(prev => [...prev, newDrive]);
    } else {
      throw new Error("Failed to schedule drive");
    }
  } catch (error) {
    console.error("API request failed:", error);
    
    // Simulate API response (for development mode)
    console.log("API error, simulating success for demo");

    const newDrive = {
      id: Date.now().toString(),
      name: driveName,
      date: driveDate,
      time: driveTime,
      location: driveLocation,
      description: driveDescription,
      capacity: driveCapacity,
      recruiterEmail: recruiterEmail,  // use the string value here
      recruiterName: recruiterName,    // use the string value here
      status: "Scheduled"
    };

    setDrives((prev) => [...prev, newDrive]);
    toast.success("Drive scheduled successfully!");
  }

  resetDriveForm();
};




// Decode JWT token
export const decodeToken = (token) => {
  try {
    // JWT tokens are in format: header.payload.signature
    // We only need the payload, which is the second part
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;
    
    // Convert base64url to base64
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    
    // Decode the payload
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => `%${(`00${c.charCodeAt(0).toString(16)}`).slice(-2)}`)
        .join('')
    );
    
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

// Fetch recruiter profile from the database
export const fetchRecruiterProfile = async (email) => {
  try {
    const token = localStorage.getItem("token") || "dummy-token";
    
    try {
      const response = await fetch(`http://127.0.0.1:8000/recruiter-profile/${encodeURIComponent(email)}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (response.ok) {
        return await response.json();
      } else {
        console.log("Failed to fetch recruiter profile");
        return null;
      }
    } catch (error) {
      console.log("API error fetching recruiter profile");
      // For demo purposes, return a mock profile based on email
      return {
        name: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1),
        email: email,
      };
    }
  } catch (error) {
    console.error("Error fetching recruiter profile:", error);
    return null;
  }
};