import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api';

export const fetchUserJobStatuses = async (userEmail) => {
  try {
    const response = await axios.get(`${API_URL}/job-status/${userEmail}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching job statuses:', error);
    return [];
  }
};

export const fetchSpecificJobStatus = async (userEmail, recruiterEmail) => {
  try {
   const response = await axios.get(
  `${API_URL}/job-status/${encodeURIComponent(userEmail)}/${encodeURIComponent(recruiterEmail)}`
);

    return response.data;
  } catch (error) {
    console.error('Error fetching specific job status:', error);
    return {
      user_email: userEmail,
      recruiter_email: recruiterEmail,
      completion_status: {
        aptitude: false,
        coding: false,
        hr: false
      }
    };
  }
};

export const updateRoundStatus = async (userEmail, recruiterEmail, roundName, completed) => {
  try {
    const response = await axios.put(
      `${API_URL}/job-status/${userEmail}/${recruiterEmail}/round`,
      null,  // No body needed
      {
        params: {
          round_name: roundName,
          completed: completed
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error updating round status:', error);
    throw error;
  }
};

export const fetchAppliedJobs = async (userEmail) => {
    try {
      // Fetch all job statuses for the given user email
      const response = await axios.get(`${API_URL}/job-status/${userEmail}`);
      
      // Filter the jobs that are actually applied (where recruiter_email is not null)
      const appliedJobs = response.data.filter(job => job.recruiter_email !== null);
  
      return appliedJobs;
    } catch (error) {
      console.error('Error fetching applied jobs:', error);
      return [];
    }
  };
  