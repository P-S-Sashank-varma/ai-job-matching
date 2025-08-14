import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/Login.css";  // CSS file for styling
import { FaEnvelope, FaLock, FaArrowLeft } from 'react-icons/fa';  // Icons for email, lock, back

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");  // Default role
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch("https://ai-job-matching-zd8j.onrender.com/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role }),  // Include role in the request
      });

      if (response.ok) {
        const data = await response.json();
        // Save the token and role in localStorage
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);  // Save role to redirect user accordingly

        // Redirect based on user role
        if (data.role === "recruiter") {
          navigate("/recruiter-dashboard");  // Redirect to recruiter dashboard
        } else {
          navigate("/userportal");  // Redirect to user dashboard
        }
      } else {
        const errorData = await response.json();
        alert(errorData.detail);  // Display error message from backend
      }
    } catch (err) {
      alert("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  return (
    <div className="auth-page">
      <header className="auth-header">
        <button className="back-button" onClick={handleBack} aria-label="Go back">
          <FaArrowLeft />
          <span>Back</span>
        </button>
        <Link to="/" className="brand">Smart Hire AI</Link>
      </header>

      <div className="auth-container">
        <div className="auth-card">
          <h2>Login</h2>
          <form onSubmit={handleLogin}>
            <div className="input-group">
              <FaEnvelope className="input-icon" />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <FaLock className="input-icon" />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <select value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="user">User</option>
                <option value="recruiter">Recruiter</option>
              </select>
            </div>
            <button type="submit" className="auth-button" disabled={isSubmitting} aria-busy={isSubmitting}>
              {isSubmitting ? "Signing in..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
