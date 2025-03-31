import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/Home.css";
import { motion } from "framer-motion";
import dev1Image from "../images/pf2.jpeg";
import dev2Image from "../images/kumar.png";
import dev3Image from "../images/mani4.jpeg";
import dev4Image from "../images/bhaskar.png";
import { 
  Search, 
  FileText, 
  MessageSquare, 
  ArrowRight, 
  CheckCircle, 
  Facebook, 
  Twitter, 
  Instagram, 
  ArrowUp,
  Linkedin,
  Github,
  Mail
} from "lucide-react";

function Home() {
  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
    // Navbar scroll effect
    const handleNavScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    
    // Scroll reveal animation
    const handleScrollReveal = () => {
      const elements = document.querySelectorAll('.scroll-reveal');
      elements.forEach(el => {
        const rect = el.getBoundingClientRect();
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;
        
        if (rect.top <= windowHeight * 0.75) {
          el.classList.add('revealed');
        }
      });
    };
    
    window.addEventListener("scroll", handleNavScroll);
    window.addEventListener('scroll', handleScrollReveal);
    
    // Initial check
    handleScrollReveal();
    
    return () => {
      window.removeEventListener("scroll", handleNavScroll);
      window.removeEventListener('scroll', handleScrollReveal);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Team members data
  const teamMembers = [
    {
      name: "Sashank Varma",
      role: "Frontend Developer",
      image: dev1Image,
      linkedin: "#",
      github: "#",
      email: "sashank@example.com"
    },
    {
      name: "Prasanna Kumar",
      role: "Backend Developer",
      image:dev2Image,
      linkedin: "#",
      github: "#",
      email: "prasanna@example.com"
    },
    {
      name: "Devi Manikanta",
      role: "AI Engineer",
      image: dev3Image,
      linkedin: "#",
      github: "#",
      email: "devi@example.com"
    },
    {
      name: "Bhaskar Reddy",
      role: "UX Designer",
      image: dev4Image,
      linkedin: "#",
      github: "#",
      email: "bhaskar@example.com"
    }
  ];

  // Features data
  const features = [
    {
      icon: <Search className="w-8 h-8" />,
      title: "Job Match",
      description: "Find job opportunities that best match your skills and experience with AI-powered matching technology.",
      buttonText: "Find Jobs"
    },
    {
      icon: <FileText className="w-8 h-8" />,
      title: "Resume Parser",
      description: "Automatically extract and analyze skills and qualifications from your resume to find the perfect match.",
      buttonText: "Try Now"
    },
    {
      icon: <MessageSquare className="w-8 h-8" />,
      title: "AI Interview",
      description: "Practice mock interviews powered by AI to boost your confidence and prepare for real interviews.",
      buttonText: "Start Interview"
    }
  ];

  return (
    <div>
      {/* Navbar */}
      <header className={`fixed-header ${scrolled ? "scrolled" : ""}`}>
        <div className="container">
          <Link to="/" className="logo">
            <span className="logo-text">SmartHire AI</span>
          </Link>
          
          <nav className="nav-menu">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/jobs" className="nav-link">Jobs</Link>
            <Link to="/contact" className="nav-link">Contact</Link>
          </nav>
          
          <div className="auth-buttons">
            <Link to="/login" className="login-button">Log in</Link>
            <Link to="/signup" className="signup-button">Sign up</Link>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <div className="hero-section">
          <div className="container hero-container">
            <div className="hero-content">
              <span className="hero-tag">AI-Powered Job Matching</span>
              <h1 className="hero-title">
                Find your perfect job with
                <span className="hero-highlight"> AI assistant</span>
              </h1>
              <p className="hero-description">
                Leverage the power of artificial intelligence to match your skills with the perfect job opportunities and let our AI apply for them on your behalf.
              </p>
              <div className="hero-buttons">
                <Link to="/signup" className="primary-button">
                  Get Started
                  <ArrowRight className="button-icon" />
                </Link>
                <Link to="/jobs" className="secondary-button">
                  Explore Jobs
                </Link>
              </div>
            </div>
            
            <div className="hero-image-container">
              <img 
                src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d" 
                alt="Person using laptop with AI job matching" 
                className="hero-realistic-image"
              />
            </div>
          </div>
          
          <div className="scroll-indicator">
            <span>Scroll to discover</span>
            <div className="scroll-mouse">
              <div className="scroll-wheel"></div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <section className="features-section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Powerful Features</h2>
              <p className="section-subtitle">
                Our AI-powered tools help you navigate the job market with ease and precision
              </p>
            </div>

            <div className="features-grid">
              {features.map((feature, index) => (
                <div key={index} className="feature-card scroll-reveal">
                  <div className="feature-icon">
                    {feature.icon}
                  </div>
                  <h3 className="feature-title">{feature.title}</h3>
                  <p className="feature-description">{feature.description}</p>
                  <button className="feature-button">
                    {feature.buttonText}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Resume Section */}
        <section className="resume-section">
          <div className="container">
            <div className="resume-container">
              <div className="resume-content">
                <span className="resume-tag">AI-Powered Technology</span>
                
                <h2 className="resume-title">
                  AI-Powered Resume Parsing & HR Interview
                </h2>
                
                <p className="resume-description">
                  Our AI analyzes your resume to extract key skills and experiences, helping you find the best job matches. Get ready for AI-driven HR interview questions tailored to your expertise.
                </p>
                
                <h3 className="resume-subtitle">How It Works:</h3>
                
                <ul className="resume-list">
                  {[
                    "Upload your resume for AI parsing",
                    "Extracted skills matched with job opportunities",
                    "Assess your expertise in aptitude, coding skills, and AI interview preparation"
                  ].map((item, index) => (
                    <li key={index} className="resume-list-item">
                      <CheckCircle className="list-icon" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                
                <button className="primary-button">
                  Start AI Interview
                  <ArrowRight className="button-icon" />
                </button>
              </div>
              
              <div className="resume-visual">
                <div className="resume-card">
                  <div className="resume-card-header">
                    Resume Analysis Results
                  </div>
                  
                  <div className="resume-card-body">
                    <div className="resume-card-section">
                      <h4 className="resume-card-label">Skills Extracted</h4>
                      <div className="resume-skills">
                        {["React", "JavaScript", "Node.js", "Python", "Machine Learning"].map((skill, index) => (
                          <span key={index} className="resume-skill-tag">{skill}</span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="resume-card-section">
                      <h4 className="resume-card-label">Experience Level</h4>
                      <div className="progress-container">
                        <div className="progress-bar" style={{width: '75%'}}></div>
                      </div>
                      <div className="progress-labels">
                        <span>Entry</span>
                        <span>Mid-level</span>
                        <span>Senior</span>
                      </div>
                    </div>
                    
                    <div className="resume-card-section">
                      <h4 className="resume-card-label">Job Match Confidence</h4>
                      <div className="match-score">
                        <div className="match-percentage">94%</div>
                        <div className="match-details">
                          <div>High confidence</div>
                          <div className="match-subtext">Based on 50+ similar profiles</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="resume-card-section border-top">
                      <h4 className="resume-card-label">Recommended Job Openings</h4>
                      <div className="job-recommendations">
                        {["Senior Frontend Developer", "React Team Lead", "JavaScript Engineer"].map((job, index) => (
                          <div key={index} className="job-recommendation">
                            <span>{job}</span>
                            <ArrowRight className="job-arrow" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="team-section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Meet Our Team</h2>
              <p className="section-subtitle">
                The talented people behind our innovative AI-powered job matching platform
              </p>
            </div>

            <div className="team-grid">
              {teamMembers.map((member, index) => (
                <div key={index} className="team-card scroll-reveal">
                  <div className="team-image-container">
                    <img src={member.image} alt={member.name} className="team-image" />
                  </div>
                  <div className="team-details">
                    <h3 className="team-name">{member.name}</h3>
                    <p className="team-role">{member.role}</p>
                    <div className="team-social">
                      <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="social-link linkedin">
                        <Linkedin className="social-icon" />
                      </a>
                      <a href={member.github} target="_blank" rel="noopener noreferrer" className="social-link github">
                        <Github className="social-icon" />
                      </a>
                      <a href={`mailto:${member.email}`} className="social-link email">
                        <Mail className="social-icon" />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-section">
              <h3 className="footer-heading">About Us</h3>
              <p className="footer-text">
                SmartResume is your AI-powered job search assistant that helps you find the perfect job match and prepare for interviews.
              </p>
              <div className="footer-social">
                <a href="#" className="footer-social-link">
                  <Facebook className="footer-icon" />
                </a>
                <a href="#" className="footer-social-link">
                  <Twitter className="footer-icon" />
                </a>
                <a href="#" className="footer-social-link">
                  <Instagram className="footer-icon" />
                </a>
              </div>
            </div>
            
            <div className="footer-section">
              <h3 className="footer-heading">Quick Links</h3>
              <ul className="footer-links">
                {[
                  { name: "Jobs", path: "/jobs" },
                  { name: "Contact", path: "/contact" },
                  { name: "Terms of Service", path: "/terms" },
                  { name: "Privacy Policy", path: "/privacy" },
                  { name: "FAQ", path: "/faq" }
                ].map((link, index) => (
                  <li key={index}>
                    <Link to={link.path} className="footer-link">{link.name}</Link>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="footer-section">
              <h3 className="footer-heading">Newsletter</h3>
              <p className="footer-text">
                Subscribe to our newsletter for the latest updates and job opportunities.
              </p>
              <form className="footer-form">
                <input type="email" placeholder="Your email address" className="footer-input" />
                <button type="submit" className="footer-button">Subscribe</button>
              </form>
            </div>
          </div>
          
          <div className="footer-bottom">
            <p className="copyright">
              &copy; {new Date().getFullYear()} SmartResume. All rights reserved.
            </p>
            
            <button onClick={scrollToTop} className="scroll-top">
              <ArrowUp className="scroll-top-icon" />
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;