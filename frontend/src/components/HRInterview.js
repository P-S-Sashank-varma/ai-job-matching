import React, { useState } from "react";
import emailjs from "@emailjs/browser";
import "../styles/HRInterview.css";
import aiImage from "../images/ai-img-icon.png";

const HRInterview = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [score, setScore] = useState(null);
  const [evaluating, setEvaluating] = useState(false);
  const [skills, setSkills] = useState(""); // Input for skills
  const [loading, setLoading] = useState(false); // Loading state
  const [candidateEmail, setCandidateEmail] = useState(""); // Candidate's email

  // Function to fetch questions
  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://127.0.0.1:8000/generate_questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ skills: skills.split(",").map((s) => s.trim()) }),
      });

      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

      const data = await response.json();
      if (data.questions && Array.isArray(data.questions)) {
        setQuestions(data.questions);
        setAnswers(new Array(data.questions.length).fill("")); // Initialize empty answers
      }
    } catch (err) {
      console.error("Error fetching questions:", err);
    } finally {
      setLoading(false);
    }
  };

  // Move to the next question or finish the interview
  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      evaluateAnswers();
    }
  };

  // Handle answer input
  const handleAnswerChange = (e) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = e.target.value;
    setAnswers(newAnswers);
  };

  // Evaluate Answers
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

      // Send email only if score is evaluated
      if (finalScore >= 0 && candidateEmail.trim() !== "") {
        sendEmail(finalScore);
      }
    } catch (err) {
      console.error("Error evaluating answers:", err);
    } finally {
      setEvaluating(false);
    }
  };

  // Send email to the candidate
  const sendEmail = (finalScore) => {
    const serviceID = "service_2muq5z7"; // Replace with your EmailJS Service ID
    const templateID = "template_saz9rem"; // Replace with your EmailJS Template ID
    const publicKey = "9cF6wTZ08TowYhA2u"; // Replace with your EmailJS Public Key

    const templateParams = {
      to_email: candidateEmail, // ✅ Now dynamically sends to the candidate's email
      from_name: "HR Team",
      reply_to: "virushka679@gmail.com", // Change if needed
      message: `Bhaskar ninna chusina aunty video in the AI HR interview, scoring ${finalScore}/10. Based on this evaluation, they appear to be a strong candidate for further consideration. This assessment was conducted through the AI Job Matching Portal, ensuring an efficient and unbiased evaluation process.`,
    };

    emailjs
      .send(serviceID, templateID, templateParams, publicKey)
      .then((response) => {
        console.log("Email sent successfully!", response);
      })
      .catch((error) => {
        console.error("Error sending email:", error);
      });
  };

  return (
    <div className="interview-container">
      <h2 className="title">AI-Generated HR Interview</h2>
      <img src={aiImage} alt="AI Icon" className="ai-icon" />

      {score === null ? (
        <>
          {!questions.length ? (
            <>
              <p className="instruction">Enter your skills and email to generate interview questions:</p>
              <input
                type="text"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                placeholder="e.g., Python, React, Machine Learning"
                className="skills-input"
              />
              <input
                type="email"
                value={candidateEmail}
                onChange={(e) => setCandidateEmail(e.target.value)}
                placeholder="Enter Candidate's Email"
                className="email-input"
              />
              <button onClick={fetchQuestions} className="fetch-button" disabled={loading}>
                {loading ? "Loading..." : "Generate Questions"}
              </button>
            </>
          ) : (
            <>
              <p className="question">
                <strong>Question {currentQuestionIndex + 1}:</strong> {questions[currentQuestionIndex]}
              </p>
              <textarea
                rows="3"
                value={answers[currentQuestionIndex] || ""}
                onChange={handleAnswerChange}
                placeholder="Type your answer here..."
                className="answer-box"
              />
              <button onClick={handleNextQuestion} className="next-button" disabled={evaluating}>
                {currentQuestionIndex < questions.length - 1 ? "Next" : "Finish"}
              </button>
            </>
          )}
        </>
      ) : (
        <>
          <h3 className="completion-text">Interview Completed!</h3>
          {evaluating ? (
            <p className="score-text">Evaluating your answers...</p>
          ) : (
            <p className="score-text">Your Score: <strong>{score}/10</strong></p>
          )}
        </>
      )}
    </div>
  );
};

export default HRInterview;
