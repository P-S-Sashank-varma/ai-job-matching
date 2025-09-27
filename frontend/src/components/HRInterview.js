import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import emailjs from "@emailjs/browser";
import { fetchSpecificJobStatus, updateRoundStatus, markAllRoundsEmailSent } from "../services/api";
import { Button } from "./ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/Card";
import { Badge } from "./ui/Badge";
import { Input } from "./ui/Input";
import { CheckCircle, Brain, Code, MessageSquare, Play, Clock, Loader2, ArrowRight } from "lucide-react";

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
  const [emailSent, setEmailSent] = useState(false);
  const [emailAlreadySent, setEmailAlreadySent] = useState(false);
  const [emailSending, setEmailSending] = useState(false);
  const [emailError, setEmailError] = useState("");
  const autoSendGuardRef = useRef(false);

  // Local flag to ensure a single notification per user/recruiter pair on this device
  const getNotifyKey = (u, r) => `emailNotified:${u || ''}:${r || ''}`;
  const hasAlreadyNotified = (u, r) => localStorage.getItem(getNotifyKey(u, r)) === 'true';
  const markNotified = (u, r) => localStorage.setItem(getNotifyKey(u, r), 'true');

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
        setEmailAlreadySent(!!status?.all_rounds_completed_email_sent);
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
      const response = await fetch("https://ai-job-matching-zd8j.onrender.com/generate_questions", {
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

        const response = await fetch("https://ai-job-matching-zd8j.onrender.com/evaluate_answer", {
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
        // Mark HR as completed in backend
        await updateCompletionStatus("hr", true);

        // Re-fetch status to confirm all rounds are completed before sending email
        try {
          const refreshed = await fetchSpecificJobStatus(userEmail, decodedRecruiterEmail);
          const status = refreshed?.completion_status || {};
          const allDone = !!(status.aptitude && status.coding && status.hr);
          const backendAlreadySent = !!refreshed?.all_rounds_completed_email_sent;
          const alreadySent = hasAlreadyNotified(userEmail, decodedRecruiterEmail);
          if (allDone && !backendAlreadySent && !alreadySent && userEmail.trim() !== "") {
            sendEmail(finalScore);
            markNotified(userEmail, decodedRecruiterEmail);
            try {
              await markAllRoundsEmailSent(userEmail, decodedRecruiterEmail);
            } catch (e2) {
              console.error("Error marking backend notified flag:", e2);
            }
          } else if (allDone && (backendAlreadySent || alreadySent)) {
            setEmailAlreadySent(true);
          }
        } catch (e) {
          console.error("Error checking completion before email:", e);
        }
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
      message:
        typeof finalScore === "number"
          ? `The candidate has completed the AI HR interview with a score of ${finalScore}/10.\n\nCandidate Email: ${userEmail}\n\nThis assessment was conducted through the AI Job Matching Portal.`
          : `The candidate has completed all interview rounds.\n\nCandidate Email: ${userEmail}\n\nThis notification was sent by Smart Hire AI.`,
    };

    setEmailError("");
    setEmailSending(true);
    emailjs
      .send(serviceID, templateID, templateParams, publicKey)
      .then((response) => {
        console.log("✅ Email sent successfully!", response);
        setEmailSent(true);
        setEmailSending(false);
      })
      .catch((error) => {
        console.error("❌ Error sending email:", error);
        setEmailError("Failed to send email. Please try again later.");
        setEmailSending(false);
      });
  };

  // Auto-check on mount/updates: if all rounds are already completed, send once if needed
  useEffect(() => {
    if (!userEmail || !decodedRecruiterEmail) return;
    const allDone = checkAllRoundsCompleted();
    if (!allDone) return;
    if (autoSendGuardRef.current) return;

    (async () => {
      autoSendGuardRef.current = true;
      try {
        const refreshed = await fetchSpecificJobStatus(userEmail, decodedRecruiterEmail);
        const backendAlreadySent = !!refreshed?.all_rounds_completed_email_sent;
        const alreadySent = hasAlreadyNotified(userEmail, decodedRecruiterEmail);
        if (backendAlreadySent || alreadySent) {
          setEmailAlreadySent(true);
          return;
        }
        // Not sent yet: send now and mark flags
        sendEmail(undefined);
        markNotified(userEmail, decodedRecruiterEmail);
        try {
          await markAllRoundsEmailSent(userEmail, decodedRecruiterEmail);
        } catch (e2) {
          console.error("Error marking backend notified flag:", e2);
        }
      } catch (e) {
        console.error("Auto-send check failed:", e);
      }
    })();
  }, [userEmail, decodedRecruiterEmail, completionData]);

  const goToAptitude = () => navigate(`/aptitude`);
  const goToCoding = () => navigate(`/codinground`);
  const goToSelectedJobs = () => navigate("/selected-jobs");

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in-up">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl"></div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              SmartHire AI
            </h1>
          </div>
          <p className="text-gray-600">AI-powered hiring assessment platform</p>
        </div>

        {/* Recruiter Info */}
        <Card className="mb-8 bg-white/80 backdrop-blur-sm shadow-lg animate-fade-in">
          <CardContent className="p-6">
            <div className="text-center">
              <Badge className="mb-2 bg-blue-100 text-blue-800">Current Application</Badge>
              <p className="text-lg font-semibold text-gray-900">{decodedRecruiterEmail}</p>
              <p className="text-sm text-gray-600">Recruiter Contact</p>
            </div>
          </CardContent>
        </Card>

        {/* Progress Tracker */}
        <Card className="mb-8 bg-white/80 backdrop-blur-sm shadow-lg animate-fade-in">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center text-gray-900">
              Assessment Progress
            </CardTitle>
            <CardDescription className="text-center text-gray-600">
              Complete all three rounds to finish your application
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              {/* Aptitude Test */}
              <div className={`relative p-6 rounded-xl border-2 transition-all duration-300 ${
                completionData.aptitude 
                  ? 'bg-green-50 border-green-200 shadow-lg' 
                  : 'bg-gray-50 border-gray-200 hover:border-blue-300 hover:shadow-md'
              }`}>
                <div className="text-center">
                  <div className={`w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center text-white font-bold text-lg ${
                    completionData.aptitude 
                      ? 'bg-green-500' 
                      : 'bg-gray-400'
                  }`}>
                    {completionData.aptitude ? (
                      <CheckCircle className="w-6 h-6" />
                    ) : (
                      <Brain className="w-6 h-6" />
                    )}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Aptitude Test</h3>
                  <p className="text-sm text-gray-600 mb-4">Problem-solving assessment</p>
                  <Button 
                    onClick={completionData.aptitude ? null : goToAptitude}
                    disabled={completionData.aptitude}
                    className={`w-full ${
                      completionData.aptitude 
                        ? 'bg-green-500 hover:bg-green-500 cursor-not-allowed opacity-80' 
                        : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
                    }`}
                    size="sm"
                  >
                    {completionData.aptitude ? (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Completed
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 mr-2" />
                        Start Test
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Coding Challenge */}
              <div className={`relative p-6 rounded-xl border-2 transition-all duration-300 ${
                completionData.coding 
                  ? 'bg-green-50 border-green-200 shadow-lg' 
                  : completionData.aptitude 
                    ? 'bg-gray-50 border-gray-200 hover:border-blue-300 hover:shadow-md' 
                    : 'bg-gray-100 border-gray-200 opacity-60'
              }`}>
                <div className="text-center">
                  <div className={`w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center text-white font-bold text-lg ${
                    completionData.coding 
                      ? 'bg-green-500' 
                      : completionData.aptitude 
                        ? 'bg-blue-500' 
                        : 'bg-gray-400'
                  }`}>
                    {completionData.coding ? (
                      <CheckCircle className="w-6 h-6" />
                    ) : (
                      <Code className="w-6 h-6" />
                    )}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Coding Challenge</h3>
                  <p className="text-sm text-gray-600 mb-4">Technical skills assessment</p>
                  <Button 
                    onClick={completionData.coding ? null : goToCoding}
                    disabled={!completionData.aptitude || completionData.coding}
                    className={`w-full ${
                      completionData.coding 
                        ? 'bg-green-500 hover:bg-green-500 cursor-not-allowed opacity-80' 
                        : completionData.aptitude 
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
                          : 'bg-gray-400 hover:bg-gray-400 cursor-not-allowed'
                    }`}
                    size="sm"
                  >
                    {completionData.coding ? (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Completed
                      </>
                    ) : completionData.aptitude ? (
                      <>
                        <Play className="w-4 h-4 mr-2" />
                        Start Challenge
                      </>
                    ) : (
                      <>
                        <Clock className="w-4 h-4 mr-2" />
                        Complete Aptitude First
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* HR Interview */}
              <div className={`relative p-6 rounded-xl border-2 transition-all duration-300 ${
                completionData.hr 
                  ? 'bg-green-50 border-green-200 shadow-lg' 
                  : completionData.coding 
                    ? 'bg-gray-50 border-gray-200 hover:border-blue-300 hover:shadow-md' 
                    : 'bg-gray-100 border-gray-200 opacity-60'
              }`}>
                <div className="text-center">
                  <div className={`w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center text-white font-bold text-lg ${
                    completionData.hr 
                      ? 'bg-green-500' 
                      : completionData.coding 
                        ? 'bg-purple-500' 
                        : 'bg-gray-400'
                  }`}>
                    {completionData.hr ? (
                      <CheckCircle className="w-6 h-6" />
                    ) : (
                      <MessageSquare className="w-6 h-6" />
                    )}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">HR Interview</h3>
                  <p className="text-sm text-gray-600 mb-4">AI-powered interview simulation</p>
                  <Button 
                    onClick={completionData.hr ? null : () => setShowInterview(true)}
                    disabled={!completionData.coding || completionData.hr}
                    className={`w-full ${
                      completionData.hr 
                        ? 'bg-green-500 hover:bg-green-500 cursor-not-allowed opacity-80' 
                        : completionData.coding 
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
                          : 'bg-gray-400 hover:bg-gray-400 cursor-not-allowed'
                    }`}
                    size="sm"
                  >
                    {completionData.hr ? (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Completed
                      </>
                    ) : completionData.coding ? (
                      <>
                        <Play className="w-4 h-4 mr-2" />
                        Start Interview
                      </>
                    ) : (
                      <>
                        <Clock className="w-4 h-4 mr-2" />
                        Complete Coding First
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Interview Section */}
        {showInterview && (
          <Card className="bg-white/80 backdrop-blur-sm shadow-lg animate-fade-in">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center text-gray-900 flex items-center justify-center">
                <MessageSquare className="w-6 h-6 mr-2 text-purple-600" />
                AI HR Interview
              </CardTitle>
            </CardHeader>
            <CardContent>
              {score === null ? (
                <>
                  {!questions.length ? (
                    <div className="text-center max-w-md mx-auto">
                      <div className="mb-6">
                        <Brain className="w-16 h-16 text-purple-600 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Interview Setup</h3>
                        <p className="text-gray-600">
                          Enter your key skills to generate personalized interview questions tailored to your expertise.
                        </p>
                      </div>
                      <div className="space-y-4">
                        <Input
                          value={skills}
                          onChange={(e) => setSkills(e.target.value)}
                          placeholder="e.g., Python, React, Machine Learning, Data Analysis"
                          className="text-center"
                        />
                        <Button
                          onClick={fetchQuestions}
                          disabled={loading || !skills.trim()}
                          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                          size="lg"
                        >
                          {loading ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Generating Questions...
                            </>
                          ) : (
                            <>
                              <Play className="w-4 h-4 mr-2" />
                              Start Interview
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="max-w-3xl mx-auto">
                      <div className="mb-6">
                        <Badge className="mb-4 bg-purple-100 text-purple-800">
                          Question {currentQuestionIndex + 1} of {questions.length}
                        </Badge>
                        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                          <div 
                            className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full transition-all duration-300" 
                            style={{width: `${((currentQuestionIndex + 1) / questions.length) * 100}%`}}
                          ></div>
                        </div>
                      </div>
                      
                      <Card className="mb-6 border-l-4 border-purple-500">
                        <CardContent className="p-6">
                          <p className="text-lg text-gray-900 leading-relaxed">
                            {questions[currentQuestionIndex]}
                          </p>
                        </CardContent>
                      </Card>

                      <div className="space-y-4">
                        <textarea
                          rows={6}
                          value={answers[currentQuestionIndex] || ""}
                          onChange={handleAnswerChange}
                          placeholder="Type your detailed answer here... Be specific and provide examples where possible."
                          className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none"
                        />
                        <div className="flex justify-end">
                          <Button
                            onClick={handleNextQuestion}
                            disabled={evaluating || !answers[currentQuestionIndex]?.trim()}
                            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                            size="lg"
                          >
                            {currentQuestionIndex < questions.length - 1 ? (
                              <>
                                Next Question
                                <ArrowRight className="w-4 h-4 ml-2" />
                              </>
                            ) : (
                              <>
                                Submit Interview
                                <CheckCircle className="w-4 h-4 ml-2" />
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center max-w-2xl mx-auto">
                  {evaluating ? (
                    <div className="py-12">
                      <Loader2 className="w-16 h-16 text-purple-600 mx-auto mb-4 animate-spin" />
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">Evaluating Your Responses</h3>
                      <p className="text-gray-600">Our AI is analyzing your answers and calculating your score...</p>
                    </div>
                  ) : (
                    <>
                      <div className="mb-8">
                        <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center text-white text-3xl font-bold">
                          {score}
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Interview Completed!</h3>
                        <p className="text-lg text-gray-600">
                          Your Score: {score}/10 ({Math.round((score / 10) * 100)}%)
                        </p>
                        <p className="mt-4 text-gray-700">
                          {score >= 7 ? "🎉 Excellent performance! We'll be in touch soon." : 
                           score >= 5 ? "👍 Good job! Your application has been submitted." : 
                           "✨ Thanks for completing the interview."}
                        </p>
                      </div>

                      {(emailSent || emailAlreadySent) && (
                        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                          <div className="flex items-center justify-center text-green-800">
                            <CheckCircle className="w-5 h-5 mr-2" />
                            {emailAlreadySent ? "Recruiter has been notified previously" : "Recruiter has been notified successfully"}
                          </div>
                        </div>
                      )}

                      <div className="space-y-4">
                        {checkAllRoundsCompleted() ? (
                          <Button onClick={goToSelectedJobs} size="lg" className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700">
                            View All Applications
                          </Button>
                        ) : (
                          <Button onClick={() => window.location.reload()} size="lg" variant="outline">
                            Start New Application
                          </Button>
                        )}
                      </div>
                    </>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default HRInterview;
