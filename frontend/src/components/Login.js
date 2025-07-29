import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";  // CSS file for styling
import { FaEnvelope, FaLock } from 'react-icons/fa';  // Icons for email and lock

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");  // Default role
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const response = await fetch("https://ai-job-matching-1w6g.onrender.com/login", {
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
  };

  return (
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
          <button type="submit" className="auth-button">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
