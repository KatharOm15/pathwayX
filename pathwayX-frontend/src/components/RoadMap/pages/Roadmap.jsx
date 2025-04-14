import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const Roadmap = () => {
  const [roadmapData, setRoadmapData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const USER_ID = localStorage.getItem("userId");
  const API_URL = `http://localhost:5000/api/roadmap/${USER_ID}`;

  useEffect(() => {
    const fetchRoadmap = async () => {
      try {
        setLoading(true);
        const response = await axios.get(API_URL);
        console.log("API Response:", response.data[0].roadmap);

        if (!response.data[0].roadmap) {
          throw new Error("Invalid roadmap data received");
        }

        setRoadmapData(response.data[0].roadmap); // ✅ Store only `roadmap`
      } catch (err) {
        console.error("Fetch error:", err.response?.data || err.message);
        setError(
          err.response?.data?.message ||
            "An error occurred while fetching the roadmap."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRoadmap();
  }, []);

  // ✅ Handle checkbox toggling
  const toggleStepCompletion = (phaseIndex, stepIndex) => {
    if (!roadmapData) return;

    const updatedRoadmap = { ...roadmapData };
    const phase = updatedRoadmap.phases[phaseIndex];

    if (!phase.completedSteps) {
      phase.completedSteps = [];
    }

    const stepPos = phase.completedSteps.indexOf(stepIndex);
    if (stepPos === -1) {
      phase.completedSteps.push(stepIndex);
    } else {
      phase.completedSteps.splice(stepPos, 1);
    }

    setRoadmapData(updatedRoadmap);
  };

  // ✅ Calculate progress
  const calculatePhaseProgress = (phase) => {
    if (!phase.completedSteps) phase.completedSteps = [];
    return Math.round(
      (phase.completedSteps.length / phase.actionableSteps.length) * 100
    );
  };

  const calculateOverallProgress = () => {
    if (!roadmapData?.phases) return 0;

    let totalSteps = 0;
    let totalCompletedSteps = 0;

    roadmapData.phases.forEach((phase) => {
      totalSteps += phase.actionableSteps.length;
      totalCompletedSteps += phase.completedSteps
        ? phase.completedSteps.length
        : 0;
    });

    return totalSteps > 0
      ? Math.round((totalCompletedSteps / totalSteps) * 100)
      : 0;
  };

  if (loading)
    return <div className="text-center text-white text-2xl">Loading...</div>;
  if (error)
    return <div className="text-center text-red-500 text-2xl">{error}</div>;
  if (!roadmapData) return null;

  return (
    <div className="min-h-screen bg-transparent text-white p-6">
      <motion.div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-purple-500 via-violet-500 to-blue-500  bg-clip-text text-transparent">
          Your Learning Roadmap
        </h1>
        <p className="text-gray-400 mb-6">{roadmapData.overview}</p>

        {/* Overall Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-semibold">Overall Progress</h2>
            <span className="bg-gradient-to-r from-purple-500 via-violet-500 to-blue-500  bg-clip-text text-transparent font-semibold">
              {calculateOverallProgress()}%
            </span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-4 overflow-hidden">
            <motion.div
              className="bg-blue-500 h-4"
              initial={{ width: "0%" }}
              animate={{ width: `${calculateOverallProgress()}%` }}
              transition={{ duration: 1 }}
            ></motion.div>
          </div>
        </div>

        {/* Map all phases */}
        {roadmapData.phases.map((phase, phaseIndex) => (
          <motion.div
            key={phaseIndex}
            className="mb-12 p-4 border border-gray-700 rounded-lg shadow-lg"
          >
            <h2 className="text-2xl font-semibold text-teal-600 mb-2">
              {phase.phaseName}
            </h2>
            <p className="text-gray-400 mb-4">{phase.description}</p>

            {/* Phase Progress */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-lg font-semibold">Phase Progress</h4>
                <span className="text-teal-400 font-semibold">
                  {calculatePhaseProgress(phase)}%
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                <motion.div
                  className="bg-teal-500 h-3"
                  initial={{ width: "0%" }}
                  animate={{ width: `${calculatePhaseProgress(phase)}%` }}
                  transition={{ duration: 1 }}
                ></motion.div>
              </div>
            </div>

            {/* Actionable Steps */}
            <h4 className="font-bold mb-2">Actionable Steps:</h4>
            <ul className="space-y-2">
              {phase.actionableSteps.map((step, stepIndex) => (
                <li key={stepIndex} className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    className="w-5 h-5 cursor-pointer accent-teal-500"
                    checked={phase.completedSteps?.includes(stepIndex)}
                    onChange={() => toggleStepCompletion(phaseIndex, stepIndex)}
                  />
                  <span
                    className={
                      phase.completedSteps?.includes(stepIndex)
                        ? "line-through text-gray-400"
                        : "text-gray-400"
                    }
                  >
                    {step}
                  </span>
                </li>
              ))}
            </ul>

            {/* Recommended Courses */}
            {phase.recommendedCourses && (
              <>
                <h4 className="font-bold mt-4">Recommended Courses:</h4>
                <ul className="space-y-2">
                  {phase.recommendedCourses.map((course, index) => (
                    <li
                      key={index}
                      className="border p-3 rounded-md border-gray-700"
                    >
                      <a
                        href={course.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-gradient-to-r from-purple-500 via-violet-500 to-blue-500  bg-clip-text text-transparent font-semibold"
                      >
                        {course.title}
                      </a>
                      <p className="text-gray-400 text-sm">
                        {course.platform} | {course.duration} | {course.price}
                      </p>
                    </li>
                  ))}
                </ul>
              </>
            )}

            {/* Industry Trends */}
            <h4 className="font-bold mt-4">Industry Trends:</h4>
            <p className="text-gray-400">{phase.industryTrends}</p>
          </motion.div>
        ))}

        {/* Additional Resources */}
        <motion.div className="p-4 border border-gray-700 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold text-yellow-400 mb-2">
            Additional Resources
          </h2>
          <p className="text-gray-400">
            <strong>Mentorship:</strong>{" "}
            {roadmapData.additionalResources.mentorship}
          </p>
          <p className="text-gray-400">
            <strong>Community Support:</strong>{" "}
            {roadmapData.additionalResources.communitySupport}
          </p>
          <p className="text-gray-400">
            <strong>Job Search Strategies:</strong>{" "}
            {roadmapData.additionalResources.jobSearchStrategies}
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Roadmap;
