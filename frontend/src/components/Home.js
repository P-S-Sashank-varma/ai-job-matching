import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "./ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/Card";
import { Badge } from "./ui/Badge";
import Logo from "./ui/Logo";
import HeroLogo from "./ui/HeroLogo";
import heroImage from "../images/homepage.jpg"
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
  Mail,
  Menu,
  X,
  Star,
  Users,
  BarChart3,
  Zap
} from "lucide-react";

function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };


  // Features data
  const features = [
    {
      icon: <Search className="w-8 h-8 text-teal-500" />,
      title: "AI Job Match",
      description: "Our advanced AI analyzes your skills and preferences to find the perfect job opportunities that align with your career goals.",
      color: "bg-teal-50 border-teal-100"
    },
    {
      icon: <FileText className="w-8 h-8 text-emerald-500" />,
      title: "Smart Resume Parser",
      description: "Automatically extract and analyze your skills, experience, and qualifications from your resume using cutting-edge AI technology.",
      color: "bg-emerald-50 border-emerald-100"
    },
    {
      icon: <MessageSquare className="w-8 h-8 text-green-500" />,
      title: "AI Interview Coach",
      description: "Practice with our AI-powered interview simulator that provides personalized feedback and helps you ace your next interview.",
      color: "bg-green-50 border-green-100"
    }
  ];

  const stats = [
    { number: "10K+", label: "Jobs Matched", icon: <BarChart3 className="w-5 h-5" /> },
    { number: "5K+", label: "Happy Users", icon: <Users className="w-5 h-5" /> },
    { number: "98%", label: "Success Rate", icon: <Star className="w-5 h-5" /> },
    { number: "24/7", label: "AI Support", icon: <Zap className="w-5 h-5" /> }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-emerald-50">
      {/* Modern Navigation */}
      <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-lg border-b' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2">
              <Logo size={32} className="drop-shadow-sm" />
              <span className="text-xl font-bold bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
                SmartHire AI
              </span>
            </Link>
            
            <nav className="hidden md:flex space-x-8">
              <Link to="/" className="text-gray-700 hover:text-teal-600 font-medium transition-colors">Home</Link>
              <Link to="/jobs" className="text-gray-700 hover:text-teal-600 font-medium transition-colors">Jobs</Link>
              <Link to="/contact" className="text-gray-700 hover:text-teal-600 font-medium transition-colors">Contact</Link>
            </nav>
            
            <div className="hidden md:flex items-center space-x-4">
              <Link to="/login">
                <Button variant="ghost">Log in</Button>
              </Link>
              <Link to="/signup">
                <Button>Sign up</Button>
              </Link>
            </div>
            
            <button 
              className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
          
          {/* Mobile menu */}
          {mobileMenuOpen && (
            <div className="md:hidden bg-white border-t animate-fade-in">
              <div className="px-2 pt-2 pb-3 space-y-1">
                <Link to="/" className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md">Home</Link>
                <Link to="/jobs" className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md">Jobs</Link>
                <Link to="/contact" className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md">Contact</Link>
                <div className="flex space-x-2 px-3 pt-2">
                  <Link to="/login" className="flex-1">
                    <Button variant="outline" className="w-full">Log in</Button>
                  </Link>
                  <Link to="/signup" className="flex-1">
                    <Button className="w-full">Sign up</Button>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="animate-fade-in-up">
                <div className="flex items-center gap-3 mb-4">
                  <HeroLogo size={60} className="animate-pulse" />
                  <Badge className="bg-teal-100 text-teal-800 hover:bg-teal-200">
                    AI-Powered Job Matching
                  </Badge>
                </div>
                <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                  Find your perfect job with
                  <span className="bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
                    {" "}AI assistant
                  </span>
                </h1>
                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                  Leverage the power of artificial intelligence to match your skills with the perfect job opportunities and let our AI prepare you for success.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link to="/signup">
                    <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700">
                      Get Started
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                  <Link to="/jobs">
                    <Button size="lg" variant="outline" className="w-full sm:w-auto">
                      Explore Jobs
                    </Button>
                  </Link>
                </div>
              </div>
              
              <div className="relative animate-fade-in">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-3xl blur-3xl opacity-20 animate-pulse"></div>
                <img 
                  src={heroImage} 
                  alt="AI Job Matching Platform" 
                  className="relative rounded-3xl shadow-2xl w-full h-auto"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-white/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center animate-fade-in" style={{animationDelay: `${index * 0.1}s`}}>
                  <div className="inline-flex items-center justify-center w-12 h-12 mb-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl text-white">
                    {stat.icon}
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16 animate-fade-in-up">
              <Badge className="mb-4 bg-purple-100 text-purple-800 hover:bg-purple-200">
                Powerful Features
              </Badge>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Everything you need to land your dream job
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Our AI-powered tools help you navigate the job market with ease and precision, giving you the competitive edge you need.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <Card key={index} className={`${feature.color} border-2 hover:shadow-lg transition-all duration-300 animate-fade-in-up`} style={{animationDelay: `${index * 0.2}s`}}>
                  <CardHeader>
                    <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center mb-4 shadow-sm">
                      {feature.icon}
                    </div>
                    <CardTitle className="text-xl font-semibold text-gray-900">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-600 leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Resume Section */}
        <section className="py-20 bg-gradient-to-r from-blue-50 to-purple-50 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="animate-fade-in-up">
                <Badge className="mb-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                  AI-Powered Technology
                </Badge>
                <h2 className="text-4xl font-bold text-gray-900 mb-6">
                  Smart Resume Analysis & Interview Prep
                </h2>
                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                  Our AI analyzes your resume to extract key skills and experiences, helping you find the best job matches. Get ready with AI-driven interview preparation tailored to your expertise.
                </p>
                
                <div className="space-y-4 mb-8">
                  {[
                    "Upload your resume for instant AI analysis",
                    "Get matched with relevant job opportunities",
                    "Practice with AI-powered interview simulations"
                  ].map((item, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
                
                <Link to="/signup">
                  <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    Start AI Analysis
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
              
              <div className="animate-fade-in">
                <Card className="bg-white/80 backdrop-blur-sm shadow-xl">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-gray-900">
                      Resume Analysis Results
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-3">Skills Extracted</h4>
                      <div className="flex flex-wrap gap-2">
                        {["React", "JavaScript", "Node.js", "Python", "AI/ML"].map((skill, index) => (
                          <Badge key={index} variant="secondary" className="bg-blue-100 text-blue-800">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-3">Experience Level</h4>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full" style={{width: '75%'}}></div>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500 mt-2">
                        <span>Entry</span>
                        <span>Mid-level</span>
                        <span>Senior</span>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-3">Job Match Confidence</h4>
                      <div className="flex items-center space-x-4">
                        <div className="text-3xl font-bold text-green-600">94%</div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">High confidence</div>
                          <div className="text-xs text-gray-500">Based on 50+ similar profiles</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-slate-900 to-gray-900 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <Logo size={32} className="drop-shadow-sm" />
                <span className="text-xl font-bold">SmartHire AI</span>
              </div>
              <p className="text-gray-400 mb-6 max-w-md">
                Your AI-powered job search assistant that helps you find the perfect job match and prepare for interviews with confidence.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Instagram className="w-5 h-5" />
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link to="/jobs" className="text-gray-400 hover:text-white transition-colors">Find Jobs</Link></li>
                <li><Link to="/contact" className="text-gray-400 hover:text-white transition-colors">Contact Us</Link></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Stay Updated</h3>
              <p className="text-gray-400 mb-4">Get the latest job opportunities and AI insights.</p>
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="flex-1 px-4 py-2 bg-gray-800 text-white rounded-l-md border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Button className="rounded-l-none bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} SmartHire AI. All rights reserved.
            </p>
            <button 
              onClick={scrollToTop}
              className="mt-4 md:mt-0 p-2 bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700 rounded-full transition-colors"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;