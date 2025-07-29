
import { toast } from "sonner";
import { fetchAppliedJobs as fetchAppliedJobsAPI } from "../services/api";
export const checkExistingResume = async (userEmail, setHasExistingResume, setName, setPhone, activeTab, location) => {
  try {
    const response = await fetch(`https://ai-job-matching-1w6g.onrender.com/check-resume/${userEmail}`);
    const data = await response.json();
    
    if (response.ok && data.hasResume) {
      setHasExistingResume(true);
      setName(data.name || "");
      setPhone(data.phone || "");
      
      if (activeTab === "resume" && location.pathname !== '/portal') {
        return "jobs";
      }
    }
    return activeTab;
  } catch (error) {
    console.error("Error checking resume status:", error);
    return activeTab;
  }
};

export const fetchSelectedJobs = async (userEmail, setSelectedJobs) => {
  try {
    const response = await fetch(`https://ai-job-matching-1w6g.onrender.com/matching-jobs/${userEmail}`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log("Fetched jobs:", data);
    setSelectedJobs(data || []);
  } catch (error) {
    console.error("Error fetching selected jobs:", error);
    toast.error("Failed to load selected jobs.");
  }
};

export const handleResumeUpload = async (
  event, 
  resumeFile, 
  hasExistingResume, 
  name, 
  email, 
  phone, 
  setLoading, 
  setHasExistingResume, 
  setActiveTab, 
  navigate, 
  setResumeFile, 
  resumeInputRef
) => {
  event.preventDefault();
  if (!resumeFile && !hasExistingResume) {
    toast.error("Please select a resume file before submitting.");
    return;
  }

  const formData = new FormData();
  formData.append("name", name);
  formData.append("email", email);
  formData.append("phone", phone);
  
  if (resumeFile) {
    formData.append("resume", resumeFile);
  }

  try {
    setLoading(true);
    const uploadResponse = await fetch("https://ai-job-matching-1w6g.onrender.com/upload-resume", {
      method: "POST",
      body: formData,
    });

    const uploadResult = await uploadResponse.json();
    if (!uploadResponse.ok) {
      throw new Error(uploadResult.detail || "Error uploading resume");
    }

    toast.success("Resume uploaded successfully!");
    await fetch(`https://ai-job-matching-1w6g.onrender.com/parse-resume/${email}`);
    
    setHasExistingResume(true);
    setActiveTab("jobs");
    navigate("/selected-jobs", { replace: true });
    
    if (resumeFile) {
      setResumeFile(null);
      if (resumeInputRef.current) {
        resumeInputRef.current.value = "";
      }
    }
  } catch (error) {
    console.error("Error processing resume:", error);
    toast.error("Failed to process resume. Please try again.");
  } finally {
    setLoading(false);
  }
};

export const handleApply = async (jobId, email, hasExistingResume, setActiveTab, setLoading, selectedJobs, setSelectedJobs) => {
  if (!hasExistingResume) {
    toast.error("Please upload your resume first before applying.");
    setActiveTab("resume");
    return;
  }

  try {
    setLoading(true);
    const response = await fetch("https://ai-job-matching-1w6g.onrender.com/apply-job", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        jobId: jobId
      }),
    });

    if (response.ok) {
      toast.success("Successfully applied to job!");
      
      setSelectedJobs(
        selectedJobs.map(job => 
          job.id === jobId ? { ...job, applied: true } : job
        )
      );
    } else {
      const error = await response.json();
      throw new Error(error.detail || "Failed to apply for job");
    }
  } catch (error) {
    console.error("Error applying for job:", error);
    toast.error(error.message || "Error applying for job. Please try again.");
  } finally {
    setLoading(false);
  }
};

export const handleRegisterDrive = async (driveId, hasExistingResume, setActiveTab, setLoading, upcomingDrives, setUpcomingDrives) => {
  if (!hasExistingResume) {
    toast.error("Please upload your resume first before registering.");
    setActiveTab("resume");
    return;
  }

  try {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setUpcomingDrives(
      upcomingDrives.map(drive => 
        drive.id === driveId ? { ...drive, registered: true } : drive
      )
    );
    
    toast.success("Successfully registered for the hiring drive!");
  } catch (error) {
    console.error("Error registering for drive:", error);
    toast.error("Failed to register for drive. Please try again.");
  } finally {
    setLoading(false);
  }
};
export const setupDrivesData = async (setUpcomingDrives) => {
  try {
    const response = await fetch("https://ai-job-matching-1w6g.onrender.com/drives/");
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const drivesData = await response.json();
    console.log("Fetched drives:", drivesData);
    
    // Transform the API data to match the expected format
    const formattedDrives = drivesData.map(drive => ({
      id: drive.id,
      company: drive.recruiter_name,
      title: drive.name,
      date: drive.date,
      time: drive.time,
      location: drive.location,
      description: drive.description,
      positions: [`${drive.name} - ${drive.capacity} positions`],
      capacity: drive.capacity,
      registered: false, // Default to not registered
      status: drive.status,
      recruiter_email: drive.recruiter_email
    }));
    
    setUpcomingDrives(formattedDrives);
  } catch (error) {
    console.error("Error fetching drives:", error);
    toast.error("Failed to load upcoming drives.");
    
    // Set empty array if fetch fails
    setUpcomingDrives([]);
  }
};

export const fetchAppliedJobs = async (userEmail, setAppliedJobs) => {
  try {
    const jobStatuses = await fetchAppliedJobsAPI(userEmail);

    const enrichedJobs = await Promise.all(
      jobStatuses.map(async (status) => {
        try {
          // Fetch job details from the backend using both userEmail and recruiterEmail
          const jobResponse = await fetch(
            `https://ai-job-matching-1w6g.onrender.com/job-status/${encodeURIComponent(userEmail)}/${encodeURIComponent(status.recruiter_email)}`
          );

          const defaultJob = {
            id: status.recruiter_email,
            recruiter_email: status.recruiter_email,
            company: status.recruiter_email.split('@')[0],
            title: `Position at ${status.recruiter_email.split('@')[0]}`,
            completion_status: status.completion_status,
            applied: true,
            applicationDate: new Date().toLocaleDateString()
          };

          if (!jobResponse.ok) {
            return defaultJob;
          }

          const jobData = await jobResponse.json();
          return {
            ...defaultJob,
            ...jobData,
          };
        } catch (error) {
          console.error("Error fetching job details:", error);
          return {
            id: status.recruiter_email,
            recruiter_email: status.recruiter_email,
            company: status.recruiter_email.split('@')[0],
            title: `Position at ${status.recruiter_email.split('@')[0]}`,
            completion_status: status.completion_status,
            applied: true,
            applicationDate: new Date().toLocaleDateString()
          };
        }
      })
    );

    setAppliedJobs(enrichedJobs);
  } catch (error) {
    console.error("Error fetching applied jobs:", error);
    toast.error("Failed to load applied jobs.");
    setAppliedJobs([]);
  }
};
