import React, { useState, useRef } from "react";
import "../styles/RecruiterDashboard.css";

function RecruiterDashboard() {
  const [recruiterName, setRecruiterName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [companyImage, setCompanyImage] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [skillsRequired, setSkillsRequired] = useState("");

  const companyImageInputRef = useRef(null);

  const handleCompanyImageUpload = (event) => {
    setCompanyImage(event.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!companyImage) {
      alert("Please select a company image before submitting.");
      return;
    }

    const formData = new FormData();
    formData.append("recruiter_name", recruiterName);
    formData.append("email", email);
    formData.append("company", company);
    formData.append("job_description", jobDescription);
    formData.append("skills_required", skillsRequired);
    formData.append("company_image", companyImage);

    try {
      const response = await fetch("http://127.0.0.1:8000/recruiter-dashboard", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      if (response.ok) {
        alert("Job posted successfully!");

        if (companyImageInputRef.current) {
          companyImageInputRef.current.value = "";
        }

        setRecruiterName("");
        setEmail("");
        setCompany("");
        setJobDescription("");
        setSkillsRequired("");
        setCompanyImage(null);
      } else {
        alert(`Error: ${result.detail}`);
      }
    } catch (error) {
      console.error("Error posting job:", error);
      alert("Failed to post job. Please try again.");
    }
  };

  return (
    <div className="recruiter-dashboard">
      <h2><i className="fa-solid fa-briefcase"></i> Recruiter Dashboard</h2>
      <form onSubmit={handleSubmit}>
        <label><i className="fa-solid fa-user"></i> Recruiter Name:</label>
        <input type="text" value={recruiterName} onChange={(e) => setRecruiterName(e.target.value)} required />

        <label><i className="fa-solid fa-envelope"></i> Email:</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

        <label><i className="fa-solid fa-building"></i> Company Name:</label>
        <input type="text" value={company} onChange={(e) => setCompany(e.target.value)} required />

        <label><i className="fa-solid fa-file-image"></i> Upload Company Image:</label>
        <input type="file" accept="image/*" onChange={handleCompanyImageUpload} ref={companyImageInputRef} required />

        <label><i className="fa-solid fa-code"></i> Skills Required:</label>
        <input type="text" placeholder="E.g. JavaScript, React, Python" value={skillsRequired} onChange={(e) => setSkillsRequired(e.target.value)} required />

        <label><i className="fa-solid fa-file-alt"></i> Job Description:</label>
        <textarea value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} required></textarea>

        <button type="submit"><i className="fa-solid fa-paper-plane"></i> Post Job</button>
      </form>
    </div>
  );
}

export default RecruiterDashboard;
