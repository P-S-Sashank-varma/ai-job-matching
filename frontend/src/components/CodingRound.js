import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Editor from "@monaco-editor/react";
import axios from "axios";
import "../styles/CodingRound.css";

// Question Bank (5 Questions)
const questionBank = [
  {
    id: 1,
    title: "Sum of Two Numbers",
    description: "Write a function that takes two integers and returns their sum.",
    testCases: [
      { input: "2 3", expectedOutput: "5" },
      { input: "10 15", expectedOutput: "25" },
      { input: "0 0", expectedOutput: "0" }
    ],
    language: "python"
  },
  {
    id: 2,
    title: "Check Prime Number",
    description: "Write a function that checks if a number is prime (True/False).",
    testCases: [
      { input: "7", expectedOutput: "True" },
      { input: "4", expectedOutput: "False" },
      { input: "11", expectedOutput: "True" }
    ],
    language: "cpp"
  },
  {
    id: 3,
    title: "Reverse a String",
    description: "Write a function that takes a string and returns it reversed.",
    testCases: [
      { input: "hello", expectedOutput: "olleh" },
      { input: "world", expectedOutput: "dlrow" },
      { input: "racecar", expectedOutput: "racecar" }
    ],
    language: "java"
  },
  {
    id: 4,
    title: "Factorial of a Number",
    description: "Write a function that returns the factorial of a given number.",
    testCases: [
      { input: "5", expectedOutput: "120" },
      { input: "3", expectedOutput: "6" },
      { input: "7", expectedOutput: "5040" }
    ],
    language: "python"
  },
  {
    id: 5,
    title: "Find Maximum in an Array",
    description: "Write a function that returns the largest number in a list of integers.",
    testCases: [
      { input: "1 3 5 7 9", expectedOutput: "9" },
      { input: "-10 -20 -30 -5", expectedOutput: "-5" },
      { input: "100 200 300", expectedOutput: "300" }
    ],
    language: "cpp"
  }
];

// Function to Get Random Questions Every Login
const getRandomQuestions = () => {
  let shuffled = [...questionBank].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 3); // Pick 3 random questions
};

function CodingRound() {
  const recruiterEmail = localStorage.getItem("currentRecruiterEmail") || "Unknown";
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedLanguage, setSelectedLanguage] = useState("python");
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [testResults, setTestResults] = useState([]);
  const [failedTestCases, setFailedTestCases] = useState([]);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15 * 60);
  const navigate = useNavigate();

  // Load 3 Random Questions on Every Page Load
  useEffect(() => {
    setQuestions(getRandomQuestions());
  }, []);

  // Timer Effect
  useEffect(() => {
    if (timeLeft <= 0) handleNextQuestion();
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  // Save completion status to localStorage when completed
  useEffect(() => {
    if (completed && score >= 5) {
      // Store completion status for this specific recruiter
      const completionData = JSON.parse(localStorage.getItem("completionStatus") || "{}");
      if (!completionData[recruiterEmail]) {
        completionData[recruiterEmail] = {};
      }
      completionData[recruiterEmail].coding = true;
      localStorage.setItem("completionStatus", JSON.stringify(completionData));
    }
  }, [completed, score, recruiterEmail]);

  if (questions.length === 0) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <h2>Loading Questions...</h2>
      </div>
    );
  }

  const selectedQuestion = questions[currentQuestionIndex];
  
  // Format Time (MM:SS)
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };
  
  // Handles Code Changes in the Editor
  const handleCodeChange = (newValue) => setCode(newValue);
  
  // Handles Language Selection
  const handleLanguageChange = (event) => setSelectedLanguage(event.target.value);
  
  // Handles Code Submission and Runs Test Cases
  const handleSubmit = async () => {
    if (!code.trim()) {
      setOutput("❌ Error: Code cannot be empty.");
      return;
    }
    
    setOutput("🚀 Executing...");
    let results = [], failedCases = [], questionPassed = true;
    
    for (let testCase of selectedQuestion.testCases) {
      try {
        const response = await axios.post("http://localhost:8000/execute/", {
          language: selectedLanguage,
          source_code: code,
          input_data: testCase.input
        }, { withCredentials: false });
        
        const data = response.data;
        const cleanedOutput = data.output ? data.output.trim().replace(/\r\n/g, "\n").replace(/\s+$/, "") : "No Output";
        const expectedOutput = testCase.expectedOutput.trim().replace(/\r\n/g, "\n").replace(/\s+$/, "");
        const passed = cleanedOutput.toLowerCase() === expectedOutput.toLowerCase();
        
        if (!passed) {
          questionPassed = false;
          failedCases.push({
            input: testCase.input,
            output: cleanedOutput,
            expected: expectedOutput
          });
        }
        
        results.push({
          input: testCase.input,
          output: cleanedOutput,
          expected: expectedOutput,
          passed
        });
      } catch (error) {
        console.error("❌ Axios Error:", error);
        setOutput("❌ Request failed. Check server logs.");
        return;
      }
    }
    
    // Score Calculation
    if (questionPassed) setScore((prevScore) => prevScore + 5);
    
    setTestResults(results);
    setFailedTestCases(failedCases);
    setOutput(questionPassed ? "✅ All Test Cases Passed!" : "❌ Some Test Cases Failed.");
  };
  
  // Handle Next Question
  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setCode("");
      setOutput("");
      setTestResults([]);
      setFailedTestCases([]);
      setTimeLeft(15 * 60);
    } else {
      setCompleted(true);
    }
  };
  
  // Handle Previous Question
  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setCode("");
      setOutput("");
      setTestResults([]);
      setFailedTestCases([]);
      setTimeLeft(15 * 60);
    }
  };
  
  const handleBackToHRInterview = () => {
    navigate(`/ai-hr-interview/${recruiterEmail}`);
  };

  return (
    <div className="coding-main-container">
      <div className="coding-round-container">
        <div className="coding-header">
          <h1>Coding Round</h1>
          {!completed && (
            <div className={`coding-timer ${timeLeft < 60 ? 'warning' : ''}`}>
              Time Left: {formatTime(timeLeft)}
            </div>
          )}
        </div>
        
        {!completed ? (
          <div className="coding-workspace">
            <div className="problem-section">
              <div className="problem-header">
                <h2>{selectedQuestion.title}</h2>
                <div className="problem-navigation">
                  <div className="problem-counter">
                    Question {currentQuestionIndex + 1} of {questions.length}
                  </div>
                  <div className="navigation-buttons">
                    {currentQuestionIndex > 0 && (
                      <button 
                        onClick={handlePreviousQuestion} 
                        className="nav-button prev"
                      >
                        ← Previous
                      </button>
                    )}
                    <button 
                      onClick={handleNextQuestion} 
                      className="nav-button next"
                    >
                      {currentQuestionIndex < questions.length - 1 ? 'Next →' : 'Finish'}
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="problem-description">
                {selectedQuestion.description}
              </div>
              
              <div className="language-selector">
                <label>Select Language:</label>
                <select value={selectedLanguage} onChange={handleLanguageChange}>
                  <option value="python">Python</option>
                  <option value="cpp">C++</option>
                  <option value="java">Java</option>
                </select>
              </div>
              
              <div className="test-cases">
                <h3>Test Cases</h3>
                <table>
                  <thead>
                    <tr>
                      <th>Input</th>
                      <th>Expected Output</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedQuestion.testCases.map((test, index) => (
                      <tr key={index}>
                        <td><pre>{test.input}</pre></td>
                        <td><pre>{test.expectedOutput}</pre></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {failedTestCases.length > 0 && (
                <div className="failed-tests">
                  <h4>Failed Test Cases</h4>
                  <table>
                    <thead>
                      <tr>
                        <th>Input</th>
                        <th>Expected</th>
                        <th>Your Output</th>
                      </tr>
                    </thead>
                    <tbody>
                      {failedTestCases.map((test, index) => (
                        <tr key={index}>
                          <td><pre>{test.input}</pre></td>
                          <td><pre>{test.expected}</pre></td>
                          <td><pre>{test.output}</pre></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            
            <div className="coding-section">
              <div className="editor-container">
                <Editor
                  height="400px"
                  width="100%"
                  language={selectedLanguage}
                  theme="vs-dark"
                  value={code}
                  onChange={handleCodeChange}
                />
              </div>
              
              <div className="action-panel">
                <button onClick={handleSubmit} className="run-button">
                  Run Code
                </button>
                <button onClick={handleNextQuestion} className="next-button">
                  {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Finish'}
                </button>
              </div>
              
              <div className="output-section">
                <h3>Output</h3>
                <div className={`output-display ${output.includes('✅') ? 'success' : output.includes('❌') ? 'error' : ''}`}>
                  {output || 'Run your code to see output'}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="completion-section">
            <div className="completion-card">
              <h2>Coding Round Complete</h2>
              
              <div className="final-score">
                <div className="score-circle">
                  <div className="score-value">{score}</div>
                  <div className="score-max">/15</div>
                </div>
                <div className="score-percent">
                  {Math.round((score / 15) * 100)}% Score
                </div>
              </div>
              
              {score >= 5 ? (
                <div className="success-message">
                  <h3>Congratulations! 🎉</h3>
                  <p>You have successfully completed the coding round with a passing score.</p>
                  <p>You can now continue with the next stage of the hiring process.</p>
                </div>
              ) : (
                <div className="fail-message">
                  <h3>Not Quite There 😕</h3>
                  <p>Unfortunately, your score didn't meet the minimum requirement of 5 points.</p>
                  <p>Don't be discouraged - keep practicing and try again!</p>
                </div>
              )}
              
              <div className="action-buttons">
                {score >= 5 ? (
                  <button onClick={handleBackToHRInterview} className="continue-button">
                    Continue to Next Stage
                  </button>
                ) : (
                  <>
                    <button onClick={() => window.location.reload()} className="retry-button">
                      Try Again
                    </button>
                    <button onClick={handleBackToHRInterview} className="exit-button">
                      Exit to HR Interview
                    </button>
                  </>
                )}
              </div>
              
              <div className="test-summary">
                <h3>Your Performance</h3>
                <table className="results-table">
                  <thead>
                    <tr>
                      <th>Question</th>
                      <th>Status</th>
                      <th>Points</th>
                    </tr>
                  </thead>
                  <tbody>
                    {testResults.map((result, index) => (
                      <tr key={index}>
                        <td>Question {index + 1}</td>
                        <td className={result.passed ? "passed" : "failed"}>
                          {result.passed ? "Passed" : "Failed"}
                        </td>
                        <td>{result.passed ? "5" : "0"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CodingRound;
