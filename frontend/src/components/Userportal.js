import React, { useState, useRef } from "react";
import "../styles/Userportal.css";
import { FaUserCircle } from "react-icons/fa";

function UserPortal() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [resumeFile, setResumeFile] = useState(null);

  // ✅ **Use useRef for file input**
  const resumeInputRef = useRef(null);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

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
      const response = await fetch("http://127.0.0.1:8000/user-dashboard", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      if (response.ok) {
        alert("Resume uploaded successfully!");

        // ✅ **Fix: Reset file input using ref**
        if (resumeInputRef.current) {
          resumeInputRef.current.value = "";
        }

        // ✅ **Reset other form fields**
        setName("");
        setEmail("");
        setPhone("");
        setResumeFile(null);
      } else {
        alert(`Error: ${result.detail}`);
      }
    } catch (error) {
      console.error("Error uploading resume:", error);
      alert("Failed to upload resume. Please try again.");
    }
  };

  return (
    <div className="user-portal">
      {/* Navbar */}
      <nav className="navbar">
        <div className="logo">AI Job Portal</div>
        <ul className="nav-links">
          <li><a href="/">Home</a></li>
          {/* Job Roles Dropdown */}
          <li className="dropdown">
            <button className="dropdown-btn" onClick={toggleDropdown}>Job Roles ▼</button>
            {showDropdown && (
              <ul className="dropdown-menu">
                <li><a href="/jobs/software-engineer">Software Engineer</a></li>
                <li><a href="/jobs/data-scientist">Data Scientist</a></li>
                <li><a href="/jobs/cyber-security">Cyber Security Analyst</a></li>
              </ul>
            )}
          </li>
        </ul>
        {/* User Icon & Username */}
        <div className="user-info">
          <FaUserCircle className="user-icon" />
          <span className="username">JohnDoe123</span>
        </div>
      </nav>

      {/* Resume Upload Section */}
      <div className="resume-section">
        <h2>Upload Your Resume</h2>
        <form className="resume-form" onSubmit={handleResumeUpload}>
          <label>Full Name:</label>
          <input type="text" placeholder="Enter your name" value={name} onChange={(e) => setName(e.target.value)} required />

          <label>Email:</label>
          <input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required />

          <label>Phone Number:</label>
          <input type="tel" placeholder="Enter phone number" value={phone} onChange={(e) => setPhone(e.target.value)} required />

          <label>Upload Resume:</label>
          <input 
            type="file" 
            accept=".pdf,.doc,.docx" 
            onChange={(e) => setResumeFile(e.target.files[0])} 
            ref={resumeInputRef}  // ✅ Attach ref here
            required 
          />

          <button type="submit" className="upload-btn">Submit</button>
        </form>
      </div>
    </div>
  );
}

export default UserPortal;
