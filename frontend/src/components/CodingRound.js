import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Editor from "@monaco-editor/react";
import axios from "axios";
import "../styles/CodingRound.css";

// ✅ Question Bank (5 Questions)
const questionBank = [
  { id: 1, title: "Sum of Two Numbers", description: "Write a function that takes two integers and returns their sum.", testCases: [ { input: "2 3", expectedOutput: "5" }, { input: "10 15", expectedOutput: "25" }, { input: "0 0", expectedOutput: "0" } ], language: "python" },
  { id: 2, title: "Check Prime Number", description: "Write a function that checks if a number is prime (True/False).", testCases: [ { input: "7", expectedOutput: "True" }, { input: "4", expectedOutput: "False" }, { input: "11", expectedOutput: "True" } ], language: "cpp" },
  { id: 3, title: "Reverse a String", description: "Write a function that takes a string and returns it reversed.", testCases: [ { input: "hello", expectedOutput: "olleh" }, { input: "world", expectedOutput: "dlrow" }, { input: "racecar", expectedOutput: "racecar" } ], language: "java" },
  { id: 4, title: "Factorial of a Number", description: "Write a function that returns the factorial of a given number.", testCases: [ { input: "5", expectedOutput: "120" }, { input: "3", expectedOutput: "6" }, { input: "7", expectedOutput: "5040" } ], language: "python" },
  { id: 5, title: "Find Maximum in an Array", description: "Write a function that returns the largest number in a list of integers.", testCases: [ { input: "1 3 5 7 9", expectedOutput: "9" }, { input: "-10 -20 -30 -5", expectedOutput: "-5" }, { input: "100 200 300", expectedOutput: "300" } ], language: "cpp" }
];

// ✅ Function to Get Random Questions Every Login
const getRandomQuestions = () => {
  let shuffled = [...questionBank].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 3); // Pick 3 random questions
};

function CodingRound() {
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

  // ✅ Load 3 Random Questions on Every Page Load
  useEffect(() => {
    setQuestions(getRandomQuestions());
  }, []);

  // ✅ Timer Effect
  useEffect(() => {
    if (timeLeft <= 0) handleNextQuestion();
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  if (questions.length === 0) return <h2>Loading Questions...</h2>;

  const selectedQuestion = questions[currentQuestionIndex];

  // ✅ Format Time (MM:SS)
  const formatTime = (seconds) => `${Math.floor(seconds / 60)}:${seconds % 60 < 10 ? "0" : ""}${seconds % 60}`;

  // ✅ Handles Code Changes in the Editor
  const handleCodeChange = (newValue) => setCode(newValue);

  // ✅ Handles Language Selection
  const handleLanguageChange = (event) => setSelectedLanguage(event.target.value);

  // ✅ Handles Code Submission and Runs Test Cases
  const handleSubmit = async () => {
    if (!code.trim()) { setOutput("❌ Error: Code cannot be empty."); return; }

    setOutput("🚀 Executing...");
    let results = [], failedCases = [], questionPassed = true;

    for (let testCase of selectedQuestion.testCases) {
      try {
        const response = await axios.post("http://localhost:8000/execute/", { language: selectedLanguage, source_code: code, input_data: testCase.input }, { withCredentials: false });
        const data = response.data;

        const cleanedOutput = data.output ? data.output.trim().replace(/\r\n/g, "\n").replace(/\s+$/, "") : "No Output";
        const expectedOutput = testCase.expectedOutput.trim().replace(/\r\n/g, "\n").replace(/\s+$/, "");

        const passed = cleanedOutput.toLowerCase() === expectedOutput.toLowerCase();
        if (!passed) { questionPassed = false; failedCases.push({ input: testCase.input, output: cleanedOutput, expected: expectedOutput }); }
        results.push({ input: testCase.input, output: cleanedOutput, expected: expectedOutput, passed });
      } catch (error) {
        console.error("❌ Axios Error:", error);
        setOutput("❌ Request failed. Check server logs.");
        return;
      }
    }

    // ✅ Score Calculation
    if (questionPassed) setScore((prevScore) => prevScore + 5);
    setTestResults(results);
    setFailedTestCases(failedCases);
    setOutput(questionPassed ? "✅ All Test Cases Passed!" : "❌ Some Test Cases Failed.");
  };

  // ✅ Handle Next Question
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

  // ✅ Handle Previous Question
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

  return (
    <div className="coding-round-container">
      <h2>Coding Round</h2>
      {!completed && <h3 className="coding-round-time-left">Time Left: {formatTime(timeLeft)}</h3>}
      
      <h3>{selectedQuestion.title}</h3>
      <p><strong>Problem:</strong> {selectedQuestion.description}</p>
      
      {/* Language Dropdown */}
      <div className="coding-round-language-select">
        <label>Select Language: </label>
        <select value={selectedLanguage} onChange={handleLanguageChange}>
          <option value="python">Python</option>
          <option value="cpp">C++</option>
          <option value="java">Java</option>
        </select>
      </div>
      
      {/* Test Cases Table */}
      <table className="coding-round-test-cases-table">
        <thead>
          <tr>
            <th>Input</th>
            <th>Expected Output</th>
          </tr>
        </thead>
        <tbody>
          {selectedQuestion.testCases.map((test, index) => (
            <tr key={index}>
              <td>{test.input}</td>
              <td>{test.expectedOutput}</td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {/* Code Editor */}
      <div className="coding-round-editor-container">
        <Editor 
          height="300px" 
          width="100%" 
          language={selectedLanguage} 
          theme="vs-dark" 
          value={code} 
          onChange={handleCodeChange} 
        />
      </div>
      
      {/* Action Buttons */}
      <div className="coding-round-action-buttons">
       <center><button onClick={handleSubmit}>Submit Code</button></center>
        {currentQuestionIndex > 0 && <button onClick={handlePreviousQuestion}>← Previous</button>}
        <center><button onClick={handleNextQuestion}>Next →</button></center>
      </div>
      
      {/* Result Section */}
      <div className="coding-round-result-section">
        <h3>Result:</h3>
        <p>{output}</p>
        
        {/* Failed Test Cases Table */}
        {failedTestCases.length > 0 && (
          <table className="coding-round-failed-cases-table">
            <thead>
              <tr>
                <th>Input</th>
                <th>Expected Output</th>
                <th>Your Output</th>
              </tr>
            </thead>
            <tbody>
              {failedTestCases.map((test, index) => (
                <tr key={index}>
                  <td>{test.input}</td>
                  <td>{test.expected}</td>
                  <td>{test.output}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      
      {/* Completion Section */}
      {completed && (
        <div className="coding-round-completion-section">
          <h3>Final Score: {score}</h3>
          {score >= 5 ? (
            <div>
              <p>🎉 Congratulations! You have passed the coding round.</p>
              <p>Please go back to the previous page for the HR interview.</p>
            </div>
          ) : (
            <div>
              <p>😞 Sorry, you did not qualify for the next round.</p>
              <button onClick={() => navigate("/")}>Quit</button>
            </div>
          )}
          
          {/* Test Case Results */}
          <h3>Test Case Results:</h3>
          <table className="coding-round-test-results-table">
            <thead>
              <tr>
                <th>Input</th>
                <th>Expected Output</th>
                <th>Your Output</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {testResults.map((test, index) => (
                <tr key={index} style={{ backgroundColor: test.passed ? "lightgreen" : "lightcoral" }}>
                  <td>{test.input}</td>
                  <td>{test.expected}</td>
                  <td>{test.output}</td>
                  <td>{test.passed ? "✅ Passed" : "❌ Failed"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default CodingRound;