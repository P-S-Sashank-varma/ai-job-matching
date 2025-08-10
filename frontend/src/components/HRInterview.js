import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import emailjs from "@emailjs/browser";
import { fetchSpecificJobStatus, updateRoundStatus } from "../services/api";
import "../styles/HRInterview.css";
import { CheckCircle } from "lucide-react";

const HRInterview = ({ userName }) => {
  const { recruiterEmail } = useParams();
  const decodedRecruiterEmail = recruiterEmail
    ? decodeURIComponent(recruiterEmail)
    : localStorage.getItem("currentRecruiterEmail") || "Unknown";

  const navigate = useNavigate();

  const [userEmail, setUserEmail] = useState("");
  const [completionData, setCompletionData] = useState({
    aptitude: false,
    coding: false,
    hr: false,
  });
  const [statusUpdated, setStatusUpdated] = useState(false); // ✅ added toggle to force refresh
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [score, setScore] = useState(null);
  const [evaluating, setEvaluating] = useState(false);
  const [skills, setSkills] = useState("");
  const [loading, setLoading] = useState(false);
  const [showInterview, setShowInterview] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUserEmail(decodedToken.email);
        console.log("Decoded user email:", decodedToken.email);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);

  useEffect(() => {
    if (recruiterEmail) {
      localStorage.setItem("currentRecruiterEmail", decodedRecruiterEmail);
    }
  }, [recruiterEmail, decodedRecruiterEmail]);

  useEffect(() => {
    const fetchJobStatus = async () => {
      if (!userEmail || !decodedRecruiterEmail) return;
      try {
        console.log("Fetching job status for:", userEmail, decodedRecruiterEmail);
        const status = await fetchSpecificJobStatus(userEmail, decodedRecruiterEmail);
        console.log("Fetched job status from backend:", status);
        setCompletionData(status?.completion_status || {});
      } catch (error) {
        console.error("Error fetching job status:", error);
      }
    };

    fetchJobStatus();
  }, [userEmail, decodedRecruiterEmail, statusUpdated]); // ✅ re-fetch when statusUpdated changes

  const updateCompletionStatus = async (round, isCompleted) => {
    if (!userEmail || !decodedRecruiterEmail) return;

    console.log("Updating round status...");
    console.log("Round:", round);
    console.log("Is Completed:", isCompleted);
    console.log("User Email:", userEmail);
    console.log("Recruiter Email:", decodedRecruiterEmail);

    try {
      await updateRoundStatus(userEmail, decodedRecruiterEmail, round, isCompleted);
      const updatedStatus = await fetchSpecificJobStatus(userEmail, decodedRecruiterEmail);
      console.log("✅ Status after update:", updatedStatus);
      setCompletionData(updatedStatus?.completion_status || {});
      setStatusUpdated(prev => !prev); // ✅ trigger re-render
    } catch (error) {
      console.error("Error updating completion status:", error);
    }
  };

  const checkAllRoundsCompleted = () => {
    return completionData.aptitude && completionData.coding && completionData.hr;
  };

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8000/generate_questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ skills: skills.split(",").map((s) => s.trim()) }),
      });

      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

      const data = await response.json();
      if (data.questions && Array.isArray(data.questions)) {
        setQuestions(data.questions);
        setAnswers(new Array(data.questions.length).fill(""));
      }
    } catch (err) {
      console.error("Error fetching questions:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      evaluateAnswers();
    }
  };

  const handleAnswerChange = (e) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = e.target.value;
    setAnswers(newAnswers);
  };

  const evaluateAnswers = async () => {
    setEvaluating(true);
    try {
      let totalScore = 0;
      for (let i = 0; i < questions.length; i++) {
        if (!answers[i]) continue;

        const response = await fetch("http://localhost:8000/evaluate_answer", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question: questions[i], answer: answers[i] || "No answer provided" }),
        });

        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const data = await response.json();
        totalScore += data.score;
      }

      const finalScore = Math.round(totalScore / questions.length);
      setScore(finalScore);

      if (finalScore >= 0) {
        await updateCompletionStatus("hr", true); // ✅ update backend and re-fetch
      }

      if (finalScore >= 0 && userEmail.trim() !== "") {
        sendEmail(finalScore);
      }
    } catch (err) {
      console.error("Error evaluating answers:", err);
    } finally {
      setEvaluating(false);
    }
  };

  const sendEmail = (finalScore) => {
    const serviceID = "service_2muq5z7";
    const templateID = "template_saz9rem";
    const publicKey = "9cF6wTZ08TowYhA2u";

    const templateParams = {
      to_email: decodedRecruiterEmail,
      from_name: "Smart Hire AI",
      reply_to: "virushka679@gmail.com",
      message: `The candidate has completed the AI HR interview with a score of ${finalScore}/10.\n\nCandidate Email: ${userEmail}\n\nThis assessment was conducted through the AI Job Matching Portal.`,
    };

    emailjs.send(serviceID, templateID, templateParams, publicKey)
      .then((response) => {
        console.log("✅ Email sent successfully!", response);
      })
      .catch((error) => {
        console.error("❌ Error sending email:", error);
      });
  };

  const goToAptitude = () => navigate(`/aptitude`);
  const goToCoding = () => navigate(`/codinground`);
  const goToSelectedJobs = () => navigate("/selected-jobs");

  return (
    <div className="main-container">
      <div className="interview-container">
        <div className="header-section">
          <h1 className="title">Smart Hire AI</h1>
          <p className="subtitle">AI-powered hiring assistant</p>
        </div>

        <div className="recruiter-info">
          <div className="info-card">
            <h3>Recruiter</h3>
            <p>{decodedRecruiterEmail}</p>
          </div>
        </div>

        <div className="progress-tracker">
          <div className="progress-card">
            <h2>Hiring Process</h2>
            <div className="steps-container">
              <div className={`step ${completionData.aptitude ? 'completed' : ''}`}>
                <div className="step-icon">
                  {completionData.aptitude && <CheckCircle className="check-icon" />}
                  <span className="step-number">1</span>
                </div>
                <div className="step-content">
                  <h3>Aptitude Test</h3>
                  <p>Problem-solving assessment</p>
                  <button 
                    className={`step-button ${completionData.aptitude ? 'completed' : ''}`}
                    onClick={goToAptitude}
                  >
                    {completionData.aptitude ? 'Completed' : 'Start Test'}
                  </button>
                </div>
              </div>

              <div className={`step ${completionData.coding ? 'completed' : ''}`}>
                <div className="step-icon">
                  {completionData.coding && <CheckCircle className="check-icon" />}
                  <span className="step-number">2</span>
                </div>
                <div className="step-content">
                  <h3>Coding Challenge</h3>
                  <p>Technical skills assessment</p>
                  <button 
                    className={`step-button ${completionData.coding ? 'completed' : ''}`}
                    onClick={goToCoding}
                    disabled={!completionData.aptitude}
                  >
                    {completionData.coding ? 'Completed' : completionData.aptitude ? 'Start Challenge' : 'Complete Aptitude First'}
                  </button>
                </div>
              </div>

              <div className={`step ${completionData.hr ? 'completed' : ''}`}>
                <div className="step-icon">
                  {completionData.hr && <CheckCircle className="check-icon" />}
                  <span className="step-number">3</span>
                </div>
                <div className="step-content">
                  <h3>HR Interview</h3>
                  <p>AI-powered interview simulation</p>
                  <button 
                    className={`step-button ${completionData.hr ? 'completed' : ''}`}
                    onClick={() => setShowInterview(true)} 
                    disabled={!completionData.coding}
                  >
                    {completionData.hr ? 'Completed' : completionData.coding ? 'Start Interview' : 'Complete Coding First'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {showInterview && (
          <div className="interview-section">
            <div className="interview-card">
              <h2>AI HR Interview</h2>
              
              {score === null ? (
                <>
                  {!questions.length ? (
                    <div className="interview-setup">
                      <h3>Interview Setup</h3>
                      <p className="instruction">
                        Enter your skills to generate personalized interview questions:
                      </p>
                      <div className="input-group">
                        <input
                          type="text"
                          value={skills}
                          onChange={(e) => setSkills(e.target.value)}
                          placeholder="e.g., Python, React, Machine Learning"
                          className="skills-input"
                        />
                      </div>
                      <button
                        onClick={fetchQuestions}
                        className="start-interview-button"
                        disabled={loading}
                      >
                        {loading ? "Generating Questions..." : "Start Interview"}
                      </button>
                    </div>
                  ) : (
                    <div className="question-section">
                      <div className="question-progress">
                        Question {currentQuestionIndex + 1} of {questions.length}
                      </div>
                      <div className="question-card">
                        <p className="question">
                          {questions[currentQuestionIndex]}
                        </p>
                        <textarea
                          rows="6"
                          value={answers[currentQuestionIndex] || ""}
                          onChange={handleAnswerChange}
                          placeholder="Type your answer here..."
                          className="answer-textarea"
                        />
                        <button
                          onClick={handleNextQuestion}
                          className="next-button"
                          disabled={evaluating || !answers[currentQuestionIndex]}
                        >
                          {currentQuestionIndex < questions.length - 1
                            ? "Next Question"
                            : "Submit Interview"}
                        </button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="results-section">
                  <div className="results-card">
                    <h3>Interview Completed</h3>
                    {evaluating ? (
                      <div className="evaluating">
                        <div className="loading-spinner"></div>
                        <p>Evaluating your responses...</p>
                      </div>
                    ) : (
                      <>
                        <div className="score-display">
                          <div className="score-circle">
                            <span className="score-value">{score}</span>
                            <span className="score-max">/10</span>
                          </div>
                        </div>
                        <p className="score-message">
                          {score >= 7 ? "Excellent performance! We'll be in touch soon." : 
                           score >= 5 ? "Good job! Your application has been submitted." : 
                           "Thanks for completing the interview."}
                        </p>
                        <div className="post-interview-actions">
                          {checkAllRoundsCompleted() ? (
                            <button onClick={goToSelectedJobs} className="view-jobs-button">
                              View All Applications
                            </button>
                          ) : (
                            <button onClick={() => window.location.reload()} className="restart-button">
                              Start New Application
                            </button>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HRInterview;
