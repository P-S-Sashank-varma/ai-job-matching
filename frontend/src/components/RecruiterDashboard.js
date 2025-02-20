import React, { useState, useRef } from "react";
import "../styles/RecruiterDashboard.css";

function RecruiterDashboard() {
  const [recruiterName, setRecruiterName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [companyImage, setCompanyImage] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [skillsRequired, setSkillsRequired] = useState(""); // ✅ New state for skills required

  // ✅ **Use useRef for file input**
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
    formData.append("skills_required", skillsRequired); // ✅ Add skills required field
    formData.append("company_image", companyImage);

    try {
      const response = await fetch("http://127.0.0.1:8000/recruiter-dashboard", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      if (response.ok) {
        alert("Job posted successfully!");

        // ✅ **Fix: Reset file input using ref**
        if (companyImageInputRef.current) {
          companyImageInputRef.current.value = "";
        }

        // ✅ **Reset other form fields**
        setRecruiterName("");
        setEmail("");
        setCompany("");
        setJobDescription("");
        setSkillsRequired(""); // ✅ Reset skills required field
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
      <h2>Recruiter Dashboard</h2>
      <form onSubmit={handleSubmit}>
        <label>Recruiter Name:</label>
        <input
          type="text"
          value={recruiterName}
          onChange={(e) => setRecruiterName(e.target.value)}
          required
        />

        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label>Company Name:</label>
        <input
          type="text"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          required
        />

        <label>Upload Company Image:</label>
        <input 
          type="file" 
          accept="image/*" 
          onChange={handleCompanyImageUpload} 
          ref={companyImageInputRef}  // ✅ Attach ref here
          required 
        />


<label>Skills Required:</label>
        <input
          type="text"
          placeholder="E.g. JavaScript, React, Python"
          value={skillsRequired}
          onChange={(e) => setSkillsRequired(e.target.value)}
          required
        />


        <label>Job Description:</label>
        <textarea
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          required
        ></textarea>

        {/* ✅ New Skills Required Field */}
       
        <button type="submit">Post Job</button>
      </form>
    </div>
  );
}

export default RecruiterDashboard;
