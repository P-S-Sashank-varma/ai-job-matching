import React, { useState } from "react";
import "../styles/Userportal.css";
import { FaUserCircle } from "react-icons/fa";

function UserPortal() {
  const [showDropdown, setShowDropdown] = useState(false);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
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
        <form className="resume-form">
          <label>Full Name:</label>
          <input type="text" placeholder="Enter your name" required />

          <label>Email:</label>
          <input type="email" placeholder="Enter your email" required />

          <label>Phone Number:</label>
          <input type="tel" placeholder="Enter phone number" required />

          <label>Upload Resume:</label>
          <input type="file" accept=".pdf,.doc,.docx" required />

          <button type="submit" className="upload-btn">Submit</button>
        </form>
      </div>
    </div>
  );
}

export default UserPortal;
