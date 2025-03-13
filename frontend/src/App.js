import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import Signup from "./components/Signup";
import UserPortal from "./components/Userportal";
import RecruiterDashboard from "./components/RecruiterDashboard";
import ProtectedRoute from "./components/ProtectedRoute";  
import Job from "./components/Job";
import SelectedJobs from "./components/SelectedJobs";
import HRInterview from "./components/HRInterview";
import ContactForm from "./components/ContactForm";
import Aptitude from "./components/AptitudeTest";
import CodingRound from "./components/CodingRound";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/jobs" element={<Job />} /> 
        <Route path="/login" element={<Login />} />
        <Route path="/contact" element={<ContactForm />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/codinground" element={<CodingRound/>} />
        <Route path="/Aptitude" element={<Aptitude/>} />
        <Route path="/selected-jobs" element={<SelectedJobs />} />
        <Route path="/ai-hr-interview/:recruiterEmail" element={<HRInterview />} />
        {/* Protected route for User Portal */}
        <Route 
          path="/userportal" 
          element={
            <ProtectedRoute requiredRole="user">
              <UserPortal/>
            </ProtectedRoute>
          } 
        />

        {/* Protected route for Recruiter Dashboard */}
        <Route 
          path="/recruiter-dashboard" 
          element={
            <ProtectedRoute requiredRole="recruiter">
              <RecruiterDashboard />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
