import React from "react";
import "../styles/Home.css";
import aiParserImage from "../images/job.png"; // Job Match
import resumeParserImage from "../images/ai-parser.png"; // Resume Parser
import aiInterviewImage from "../images/ai-interview.png"; // AI Interview
import professionalResumeImage from "../images/job.png"; // Professional Resume Writing
import dev1Image from "../images/profile-pic.png";
import dev2Image from "../images/kumar.png";
import dev3Image from "../images/mani4.jpeg";
import dev4Image from "../images/bhaskar.png";
import { FaLinkedin, FaGithub, FaEnvelope, FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";

function Home() {
  return (
    <>
      {/* Home Page Section */}
      <div className="home-page">
        <nav className="navbar">
          <div className="logo">AI Job Portal</div>
          <ul className="nav-links">
            <li><a href="/recruiter-dashboard">Home</a></li>
            <li><a href="/jobs">Jobs</a></li>
            <li><a href="/login">Login</a></li>
            <li><a href="/signup">Signup</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
        </nav>

        <div className="content">
          <h1>Welcome to the AI Job Matching Portal</h1>
          <p>Find jobs that match your skills and let AI apply for them on your behalf.</p>
          <a href="/login">
            <button className="cta-button">Get Started</button>
          </a>
        </div>
      </div>

      {/* Features Section */}
      <div className="features-section" id="features">
        <div className="feature-card">
          <img src={aiParserImage} alt="Job Match" className="feature-image" />
          <h2>Job Match</h2>
          <p>Find job opportunities that best match your skills and experience.</p>
          <button className="cta-button">Find Jobs</button>
        </div>

        <div className="feature-card">
          <img src={resumeParserImage} alt="Resume Parser" className="feature-image" />
          <h2>Resume Parser</h2>
          <p>Automatically extract skills and qualifications from your resume.</p>
          <button className="cta-button">Try Now</button>
        </div>

        <div className="feature-card">
          <img src={aiInterviewImage} alt="AI Interview" className="feature-image" />
          <h2>AI Interview</h2>
          <p>Practice mock interviews powered by AI to boost your confidence.</p>
          <button className="cta-button">Start Interview</button>
        </div>
      </div>

     {/* Professional Resume Writing Section (Now AI Interview & Resume Parsing) */}
<div className="professional-resume-section">
  <div className="professional-resume-content">
    <h2>AI-Powered Resume Parsing & HR Interview</h2>
    <p>
      Our AI analyzes your resume to extract key skills and experiences, 
      helping you find the best job matches. Get ready for AI-driven 
      HR interview questions tailored to your expertise.
    </p>
    <h3>How It Works:</h3>
    <ul>
      <li>Upload your resume for AI parsing</li>
      <li>Extracted skills matched with job opportunities</li>
      <li>AI-generated HR interview questions based on your profile</li>
      <li>Receive feedback to improve your interview performance</li>
    </ul>
    <button className="cta-button">Start AI HR Interview</button>
  </div>
  <img
    src={professionalResumeImage}  // Keep the same image reference
    alt="AI HR Interview & Resume Parsing"
    className="professional-resume-image"
  />
</div>

      {/* Developer Community Section */}
      <div className="developer-community-section">
        <h2>Developer Community</h2>
        <div className="developer-cards">
          {[
            { name: "Sashank Varma", image: dev1Image, linkedin: "#", github: "#", email: "#" },
            { name: "Prasanna Kumar", image: dev2Image, linkedin: "#", github: "#", email: "#" },
            { name: "Devi Manikanta", image: dev3Image, linkedin: "#", github: "#", email: "#" },
            { name: "Bhaskar Reddy", image: dev4Image, linkedin: "#", github: "#", email: "#" }
          ].map((dev, index) => (
            <div className="developer-card" key={index}>
              <img src={dev.image} alt={dev.name} className="developer-image" />
              <h3>{dev.name}</h3>
              <div className="developer-links">
                <a href={dev.linkedin} target="_blank" rel="noopener noreferrer"><FaLinkedin /></a>
                <a href={dev.github} target="_blank" rel="noopener noreferrer"><FaGithub /></a>
                <a href={`mailto:${dev.email}`}><FaEnvelope /></a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Section */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-section">
            <h3>About Us</h3>
            <p>Your AI-powered job search assistant.</p>
          </div>
          <div className="footer-section">
            <h3>Quick Links</h3>
            <ul>
              <li><a href="/jobs">Jobs</a></li>
              <li><a href="/contact">Contact</a></li>
              <li><a href="/terms">Terms of Service</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h3>Follow Us</h3>
            <div className="footer-socials">
              <a href="#"><FaFacebook /></a>
              <a href="#"><FaTwitter /></a>
              <a href="#"><FaInstagram /></a>
            </div>
          </div>
        </div>
        <p className="footer-bottom">© 2025 AI Job Portal. All rights reserved.</p>
      </footer>
    </>
  );
}

export default Home;
