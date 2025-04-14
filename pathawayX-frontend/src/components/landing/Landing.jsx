import React, { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import {
  auth,
  signInWithPopup,
  googleProvider,
  signOut,
} from "../../config/firebase";
import axios from "axios";
import { useNavigate } from "react-router";
import FeatureCard from "./FeatureCard";
import Footer from "../Footer";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import Testimonials from "./Testimonials";

const FirstStepAI = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [heroVisible, setHeroVisible] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  // const { setUser } = useAuth();
  const phrases = ["Best Path", "AI Roadmap", "Success Plan", "Dream Journey"];
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [text, setText] = useState("");
  const [index, setIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [speed, setSpeed] = useState(150);

  useEffect(() => {
    const currentWord = phrases[index];
    let timeout;

    if (!isDeleting) {
      // Typing effect
      if (text.length < currentWord.length) {
        timeout = setTimeout(() => {
          setText((prev) => prev + currentWord.charAt(prev.length));
        }, speed);
      } else {
        timeout = setTimeout(() => setIsDeleting(true), 900);
      }
    } else {
      // Deleting effect
      if (text.length > 0) {
        timeout = setTimeout(() => {
          setText((prev) => prev.slice(0, -1));
        }, speed / 2);
      } else {
        setIsDeleting(false);
        setIndex((prevIndex) => (prevIndex + 1) % phrases.length);
      }
    }

    return () => clearTimeout(timeout);
  }, [text, isDeleting]);

  useEffect(() => {
    // Entrance animations when component mounts
    const menuTimer = setTimeout(() => setMenuVisible(true), 100);
    const heroTimer = setTimeout(() => setHeroVisible(true), 300);

    return () => {
      clearTimeout(menuTimer);
      clearTimeout(heroTimer);
    };
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Auth
  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      // console.log(result);
      const userData = {
        uid: result.user.uid,
        name: result.user.displayName,
        email: result.user.email,
        photo: result.user.photoURL,
      };

      // Send user data to backend
      const response = await axios.post(
        "http://localhost:5000/api/auth",
        userData
      );
      const serverUser = response.data.user;
      console.log(serverUser);
      setUser(serverUser);
      localStorage.setItem("user", JSON.stringify(serverUser));
      localStorage.setItem("userId", serverUser._id);

      navigate("/dashboard", { state: { user: userData } });
    } catch (error) {
      console.error("Login Failed:", error.message);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
      }`}
    >
      {/* Navigation */}
      <nav
        className={`flex items-center justify-between px-6 py-4 ${
          darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
        } border-b transition-all duration-300 ${
          menuVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="flex items-center">
          <div
            className={`w-10 h-10 ${
              darkMode ? "bg-blue-900" : "bg-blue-100"
            } rounded-lg flex items-center justify-center mr-2 transition-colors`}
          >
            <span
              className={`${
                darkMode
                  ? "bg-gradient-to-r from-purple-500 via-violet-500 to-blue-500  bg-clip-text text-transparent"
                  : "bg-gradient-to-r from-purple-500 via-violet-500 to-blue-500  bg-clip-text text-transparent"
              } text-xl`}
            >
              ⚛
            </span>
          </div>
          <span
            className={`text-xl font-bold ${
              darkMode
                ? "bg-gradient-to-r from-purple-500 via-violet-500 to-blue-500  bg-clip-text text-transparent"
                : "bg-gradient-to-r from-purple-500 via-violet-500 to-blue-500  bg-clip-text text-transparent"
            } transition-colors`}
          >
            PathwayX
          </span>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-full ${
              darkMode
                ? "bg-gray-700 text-yellow-300"
                : "bg-gray-100 text-gray-700"
            } transition-colors`}
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button
            className={`${
              darkMode
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-blue-600 hover:bg-blue-700"
            } text-white px-6 py-2 rounded-full transition-colors cursor-pointer`}
            onClick={handleLogin}
          >
            Login
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <div
        className={`relative py-16 px-6 overflow-hidden ${
          darkMode ? "bg-gray-800" : "bg-gray-50"
        } transition-colors duration-300`}
      >
        <div
          className={`max-w-6xl mx-auto relative z-10 transition-all duration-700 transform ${
            heroVisible
              ? "translate-y-0 opacity-100"
              : "translate-y-12 opacity-0"
          }`}
        >
          <div className="flex items-center mb-6">
            <span className="text-amber-500 mr-2">✨</span>
            <span
              className={`${
                darkMode ? "text-gray-300" : "text-gray-600"
              } transition-colors`}
            >
              AI-Powered Career Guidance
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h1 className="text-5xl font-bold mb-4">
                Discover Your <br />
                <span
                  className={`${
                    darkMode
                      ? "bg-gradient-to-r from-purple-500 via-violet-500 to-blue-500  bg-clip-text text-transparent"
                      : "bg-gradient-to-r from-purple-500 via-violet-500 to-blue-500  bg-clip-text text-transparent"
                  } transition-colors text-5xl font-extrabold block mt-2`}
                >
                  {text}
                  <span className="animate-blink">|</span>{" "}
                </span>
              </h1>
              <p
                className={`${
                  darkMode ? "text-gray-300" : "text-gray-600"
                } text-lg mb-8 transition-colors`}
              >
                Let AI guide you to the perfect career path. Transform your
                future with data-driven direction.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleLogin}
                  className={`${
                    darkMode
                      ? "bg-blue-600 hover:bg-blue-700"
                      : "bg-blue-600 hover:bg-blue-700"
                  } text-white px-6 py-3 rounded-full transition-all transform hover:scale-105 flex items-center justify-center`}
                >
                  Start Your Journey <span className="ml-2">→</span>
                </button>
                <button
                  onClick={() => navigate("/roadmap-list")}
                  className={`border ${
                    darkMode
                      ? "border-blue-500 bg-gradient-to-r from-purple-500 via-violet-500 to-blue-500  bg-clip-text text-transparent hover:bg-blue-900"
                      : "border-blue-600 bg-gradient-to-r from-purple-500 via-violet-500 to-blue-500  bg-clip-text text-transparent hover:bg-blue-50"
                  } px-6 py-3 rounded-full transition-all transform hover:scale-105`}
                >
                  Learn More
                </button>
              </div>
            </div>

            <div className="flex justify-center align-center">
              <DotLottieReact
                src="https://lottie.host/df5d5f7e-0a9a-4f12-8a7d-ee534fc26b38/hVz0kBAEhR.lottie"
                background="transparent"
                speed="1"
                style={{ width: "400px", height: "400px", margin: "0 auto" }}
                loop
                autoplay
              ></DotLottieReact>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">Our Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon="🎯"
              title="Career Path Suggestion"
              description="Get personalized career path recommendations based on your skills and interests."
              index={0}
              darkMode={darkMode}
            />

            <FeatureCard
              icon="📊"
              title="Salary Insights"
              description="Access real-time job market data and salary estimates for your chosen career path."
              index={1}
              darkMode={darkMode}
            />

            <FeatureCard
              icon="🗺️"
              title="Learning Roadmap"
              description="Follow a step-by-step guide to achieve your career goals with milestone tracking."
              index={2}
              darkMode={darkMode}
            />
          </div>
          <div>
            <Testimonials darkMode={darkMode} />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default FirstStepAI;
