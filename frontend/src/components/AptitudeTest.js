
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { updateRoundStatus, fetchSpecificJobStatus } from "../services/api";
import "../styles/Aptitude.css";

// 10 Aptitude Questions
const questionBank = [
  { id: 1, question: "What is 25% of 400?", options: ["75", "100", "125", "150"], answer: "100" },
  { id: 2, question: "If 2x + 3 = 11, what is x?", options: ["3", "4", "5", "6"], answer: "4" },
  { id: 3, question: "A car travels 240 km in 3 hours. What is its speed?", options: ["70 km/h", "80 km/h", "90 km/h", "100 km/h"], answer: "80 km/h" },
  { id: 4, question: "If the day after tomorrow is Wednesday, what day is it today?", options: ["Monday", "Tuesday", "Wednesday", "Thursday"], answer: "Monday" },
  { id: 5, question: "What is the next number in the sequence: 2, 4, 8, 16, ...?", options: ["20", "24", "32", "36"], answer: "32" },
  { id: 6, question: "A shop offers a 20% discount on a $50 item. What is the sale price?", options: ["$36", "$38", "$40", "$42"], answer: "$40" },
  { id: 7, question: "If 5 apples cost $2, how much do 15 apples cost?", options: ["$4", "$6", "$8", "$10"], answer: "$6" },
  { id: 8, question: "What is the value of 3² + 4²?", options: ["20", "25", "30", "35"], answer: "25" },
  { id: 9, question: "A train leaves at 2:00 PM and arrives at 5:00 PM, traveling 180 km. What is its speed?", options: ["50 km/h", "60 km/h", "70 km/h", "80 km/h"], answer: "60 km/h" },
  { id: 10, question: "If 7 books cost $56, what is the cost of 1 book?", options: ["$6", "$7", "$8", "$9"], answer: "$8" },
];

const getRandomQuestions = () => {
  let shuffled = [...questionBank].sort(() => Math.random() - 0.5);
  return shuffled;
};

function Aptitude() {
  const recruiterEmail = localStorage.getItem("currentRecruiterEmail") || "Unknown";
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10 * 60); // 10 minutes total
  const [completed, setCompleted] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [isAlreadyCompleted, setIsAlreadyCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Get user email from token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUserEmail(decodedToken.email);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);

  // Check if test is already completed
  useEffect(() => {
    const checkCompletionStatus = async () => {
      if (!userEmail || !recruiterEmail) return;
      
      try {
        const status = await fetchSpecificJobStatus(userEmail, recruiterEmail);
        if (status?.completion_status?.aptitude) {
          setIsAlreadyCompleted(true);
        }
      } catch (error) {
        console.error("Error checking completion status:", error);
      } finally {
        setLoading(false);
      }
    };

    checkCompletionStatus();
  }, [userEmail, recruiterEmail]);

  useEffect(() => {
    if (!isAlreadyCompleted) {
      setQuestions(getRandomQuestions());
    }
  }, [isAlreadyCompleted]);

  useEffect(() => {
    if (timeLeft <= 0 && !isAlreadyCompleted) {
      setCompleted(true);
    }
    if (!isAlreadyCompleted) {
      const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft, isAlreadyCompleted]);

  useEffect(() => {
    if (completed && score >= questions.length * 0.7 && userEmail) {
      // Mark aptitude test as completed in backend for this specific recruiter
      updateRoundStatus(userEmail, recruiterEmail, "aptitude", true)
        .catch(error => console.error("Error updating aptitude status:", error));
    }
  }, [completed, score, questions.length, recruiterEmail, userEmail]);

  if (loading) return <div className="loading">Loading...</div>;

  if (isAlreadyCompleted) {
    return (
      <div className="aptitude-container">
        <header className="exam-header">
          <h1>Aptitude Assessment</h1>
        </header>

        <div className="exam-content">
          <div className="result-container">
            <h2>Test Already Completed</h2>
            <div className="result-message success">
              <p>✅ You have already completed the aptitude assessment for this job application.</p>
              <p className="next-step-message">You cannot retake this test. Please continue with the hiring process.</p>
              <button onClick={handleBackToHRInterview} className="continue-button">
                Return to Hiring Process
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (questions.length === 0) return <div className="loading">Loading Questions...</div>;

  const currentQuestion = questions[currentQuestionIndex];
  const formatTime = (seconds) => `${Math.floor(seconds / 60)}:${seconds % 60 < 10 ? "0" : ""}${seconds % 60}`;

  const handleAnswerSelect = (answer) => {
    setSelectedAnswer(answer);
  };

  const handleSubmit = () => {
    if (selectedAnswer === currentQuestion.answer) {
      setScore((prev) => prev + 1);
    }
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer("");
    } else {
      setCompleted(true);
    }
  };

  const handleBackToHRInterview = () => {
    navigate(`/ai-hr-interview/${recruiterEmail}`);
  };

  return (
    <div className="aptitude-container">
      <header className="exam-header">
        <h1>Aptitude Assessment</h1>
        {!completed && (
          <div className="timer">
            Time Remaining: <span className={timeLeft < 120 ? "warning" : ""}>{formatTime(timeLeft)}</span>
          </div>
        )}
      </header>

      <div className="exam-content">
        {!completed ? (
          <div className="question-container">
            <div className="progress">
              Question {currentQuestionIndex + 1} of {questions.length}
            </div>
            <h2 className="question-text">{currentQuestion.question}</h2>
            <div className="options-container">
              {currentQuestion.options.map((option, index) => (
                <div key={index} className="option-item">
                  <input
                    type="radio"
                    id={`option-${index}`}
                    name="answer"
                    value={option}
                    checked={selectedAnswer === option}
                    onChange={() => handleAnswerSelect(option)}
                  />
                  <label htmlFor={`option-${index}`} className="option-label">
                    {option}
                  </label>
                </div>
              ))}
            </div>
            <div className="button-container">
              <button
                onClick={handleSubmit}
                disabled={!selectedAnswer}
                className="submit-button"
              >
                {currentQuestionIndex === questions.length - 1 ? "Submit Exam" : "Next Question"}
              </button>
            </div>
          </div>
        ) : (
          <div className="result-container">
            <h2>Exam Results</h2>
            <div className="score">
              Your Score: {score} / {questions.length}
              <span className="percentage">
                ({((score / questions.length) * 100).toFixed(1)}%)
              </span>
            </div>
            {score >= questions.length * 0.7 ? (
              <div className="result-message success">
                <p>✅ Congratulations! You have passed the aptitude assessment.</p>
                <p className="next-step-message">Please return to continue with the hiring process.</p>
                <button onClick={handleBackToHRInterview} className="continue-button">
                  Return to Hiring Process
                </button>
              </div>
            ) : (
              <div className="result-message fail">
                <p>❌ Sorry, you did not meet the passing criteria.</p>
                <button onClick={handleBackToHRInterview} className="exit-button">
                  Return to Hiring Process
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Aptitude;
