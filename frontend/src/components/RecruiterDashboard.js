import React, { useState } from "react";
import "../styles/RecruiterDashboard.css";

function RecruiterDashboard() {
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [email, setEmail] = useState("");
  const [pdfFile, setPdfFile] = useState(null);

  const handlePdfUpload = (event) => {
    setPdfFile(event.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Job Title:", jobTitle);
    console.log("Job Description:", jobDescription);
    console.log("Email:", email);
    console.log("Uploaded PDF:", pdfFile ? pdfFile.name : "No file uploaded");
    
    // Here, you can send the data to the backend
    alert("Job posted successfully!");
  };

  return (
    <div className="recruiter-dashboard">
      <h2>Recruiter Dashboard</h2>
      <form onSubmit={handleSubmit}>
        <label>Job Title:</label>
        <input
          type="text"
          value={jobTitle}
          onChange={(e) => setJobTitle(e.target.value)}
          required
        />

        <label>Job Description:</label>
        <textarea
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          required
        ></textarea>

        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label>Upload Job Description (PDF):</label>
        <input type="file" accept="application/pdf" onChange={handlePdfUpload} />

        <button type="submit">Post Job</button>
      </form>
    </div>
  );
}

export default RecruiterDashboard;
