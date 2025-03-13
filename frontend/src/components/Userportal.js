import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Userportal.css";
import { FaUserCircle } from "react-icons/fa";

function UserPortal() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const resumeInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = JSON.parse(atob(token.split(".")[1]));
      setEmail(decodedToken.email);
    }
  }, []);

  const handleResumeUpload = async (event) => {
    event.preventDefault();
    if (!resumeFile) {
      alert("Please select a resume file before submitting.");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("resume", resumeFile);

    try {
      setLoading(true);
      const uploadResponse = await fetch("http://127.0.0.1:8000/upload-resume", {
        method: "POST",
        body: formData,
      });

      const uploadResult = await uploadResponse.json();
      if (!uploadResponse.ok) {
        throw new Error(uploadResult.detail || "Error uploading resume");
      }

      alert("Resume uploaded successfully!");
      await fetch(`http://127.0.0.1:8000/parse-resume/${email}`);
      navigate("/selected-jobs");

      setName("");
      setPhone("");
      setResumeFile(null);
      if (resumeInputRef.current) {
        resumeInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Error processing resume:", error);
      alert("Failed to process resume. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="user-portal">
      <nav className="navbar">
        <div className="logo">Smart Hire AI</div>
        <ul className="nav-links">
          <li><a href="/">Home</a></li>
          <li><a href="/contact">Contact</a></li>
        </ul>
        <div className="user-info">
          <FaUserCircle className="user-icon" />
          <span className="username">{email || "User"}</span>
        </div>
      </nav>

      <div className="resume-section">
        <h2>Upload Your Resume</h2>
        <form className="resume-form" onSubmit={handleResumeUpload}>
          <label>Full Name:</label>
          <input type="text" placeholder="Enter your name" value={name} onChange={(e) => setName(e.target.value)} required />

          <label>Email:</label>
          <input type="email" value={email} disabled required />

          <label>Phone Number:</label>
          <input type="tel" placeholder="Enter phone number" value={phone} onChange={(e) => setPhone(e.target.value)} required />

          <label>Upload Resume:</label>
          <input type="file" accept=".pdf,.doc,.docx" onChange={(e) => setResumeFile(e.target.files[0])} ref={resumeInputRef} required />

          <button type="submit" className="upload-btn" disabled={loading}>
            {loading ? "Processing..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default UserPortal;
