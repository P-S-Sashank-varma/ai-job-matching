import React, { useState } from "react";
import "../styles/Home.css";

function Home() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <div className="home-page">
      <nav className="navbar">
        <div className="logo">AI Job Portal</div>
        <ul className="nav-links">
          <li><a href="/recruiter-dashboard">Home</a></li>
          <li><a href="/userportal">Jobs</a></li>

          <li 
            className="dropdown" 
            onMouseEnter={() => setIsDropdownOpen(true)} 
            onMouseLeave={() => setIsDropdownOpen(false)}
          >
            <button className="dropdown-btn">Login ▾</button>
            {isDropdownOpen && (
              <ul className="dropdown-menu">
                <li><a href="/login/recruiter">Recruiter</a></li>
                <li><a href="/login">User</a></li>
              </ul>
            )}
          </li>  

          <li><a href="/signup">Signup</a></li> 
          <li><a href="/contact">Contact</a></li>
        </ul>
      </nav>

      <div className="content">
        <h1>Welcome to the AI Job Matching Portal</h1>
        <p>Find jobs that match your skills and let AI apply for them on your behalf.</p>
        <li><a href="/login"><button className="cta-button">Get Started</button></a></li>
      </div>
    </div>
  );
}

export default Home;
