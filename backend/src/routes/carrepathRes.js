import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import GeneratedRoadmap from "../models/GeneratedRoadmap.js";

dotenv.config();
// Assuming you have a User model
import { GoogleGenerativeAI } from "@google/generative-ai";

import RoadmapForm from "../models/RoadmapForm.js";

const router = express.Router();

// POST route to save education background and career details
router.post("/", async (req, res) => {
  try {
    const formData = req.body;

    console.log(formData);

    const roadmap = new RoadmapForm(formData);

    await roadmap.save();

    // res.status(201).json(formData);

    const genAI = new GoogleGenerativeAI(process.env.GOOGLEAPI_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      Your AI-based personalized learning path generator you should give the roadmap based on given data
      

      ${JSON.stringify(formData, null, 2)}
      
      ## Detailed Roadmap:
      
    Generate a personalized career guidance roadmap based on the above user-provided data: personal information, education background, future career goals, current skills, learning preferences, and challenges. The roadmap should be structured into phases, covering short-term and long-term career goals, necessary skills, recommended courses, industry trends, and job opportunities.
    
    should provide courses link like udemy corsera and other based on career selected the response must include all detail of course like price , duration ,mentor ,photo of course etc. 

    Include actionable steps for skill development, networking, and job search strategies. Integrate AI-powered recommendations based on industry trends and the user’s progress. Provide resource links to relevant online courses from platforms such as Udemy, Coursera, edX, and LinkedIn Learning.

    Additionally, offer guidance on overcoming challenges, mentorship opportunities, and community support for continuous career growth. Ensure that all recommendations are up-to-date and relevant to the user’s career path.
    
    give all this respond in only in json format and the format must follow following structure that is just an example for format

{
  "userId": "678fe640180fa929cc64f786",
  "userName": "Om",
  "roadmap": {
    "title": "Personalized Career Roadmap for Aspiring Doctor",
    "overview": "This roadmap outlines a path for Om to pursue higher studies and become a doctor, considering his current skills, learning preferences, and challenges.  It focuses on building a strong foundation in biology and related subjects,  developing relevant skills, and navigating the application process for medical school.",
    "phases": [
      {
        "phaseName": "Phase 1: Building a Strong Foundation (6-12 Months)",
        "description": "Focus on strengthening foundational knowledge in biology and related subjects to prepare for competitive medical entrance exams.",
        "actionableSteps": [
          "Complete 11th and 12th grade with a strong focus on Biology, Chemistry, and Physics.",
          "Enroll in preparatory courses for medical entrance exams (NEET, etc.)",
          "Utilize online resources like Khan Academy, Byju's, and other relevant Indian exam preparation platforms.",
          "Join group study sessions for peer learning and support."
        ],
        "recommendedCourses": [
          {
            "platform": "Coursera",
            "title": "Biology for Medical School",  //Replace with actual course
            "link": "https://www.coursera.org/example-course", // Replace with actual link
            "price": "Varies",
            "duration": "6 months",
            "mentor": "Professor X", // Replace with actual mentor
            "image": "https://example.com/course-image.jpg" // Replace with actual image URL
          },
          {
            "platform": "Udemy",
            "title": "NEET Preparation Course", // Replace with actual course
            "link": "https://www.udemy.com/example-course", // Replace with actual link
            "price": "$99",
            "duration": "12 months",
            "mentor": "Dr. Y", // Replace with actual mentor
            "image": "https://example.com/course-image.jpg" // Replace with actual image URL
          }

        ],
        "industryTrends": "Advancements in medical technology, focus on preventative care, increasing demand for specialized doctors."
      },
      {
        "phaseName": "Phase 2: Medical School Application & Admission (12-18 Months)",
        "description": "Focus on preparing for and applying to medical schools, considering entrance exams, GPA, and extracurricular activities.",
        "actionableSteps": [
          "Research and identify suitable medical schools in India.",
          "Prepare for medical entrance exams (NEET, AIIMS, etc.)",
          "Build a strong academic record.",
          "Engage in relevant extracurricular activities to showcase commitment and skills.",
          "Seek mentorship from doctors or medical school advisors."
        ],
        "recommendedCourses": [
          {
            "platform": "Khan Academy",
            "title": "MCAT Prep", // Replace with relevant Indian exam
            "link": "https://www.khanacademy.org/",
            "price": "Free",
            "duration": "Self-paced",
            "mentor": "N/A",
            "image": "https://example.com/course-image.jpg"
          }
        ],
        "industryTrends": "Increased competition for medical school admission, emphasis on holistic review of applications."   
      },
      {
        "phaseName": "Phase 3: Medical School and Beyond (4+ Years)",
        "description": "Focus on medical school curriculum, internships, residencies, and specialization.",
        "actionableSteps": [
          "Excel in medical school coursework.",
          "Actively participate in research opportunities.",
          "Secure relevant internships and clinical rotations.",
          "Network with doctors and healthcare professionals.",
          "Choose a specialization based on interests and career goals."
        ],
        "recommendedCourses": [], // Medical school curriculum will be determined by the chosen institution.
        "industryTrends": "Growing importance of telemedicine, AI in healthcare, personalized medicine."
      }
    ],
    "additionalResources": {
      "mentorship": "Seek mentorship from doctors or medical school advisors through professional organizations or university networks.",
      "communitySupport": "Join online forums and communities for aspiring doctors to connect with peers and learn from their experiences.",
      "jobSearchStrategies": "Network with healthcare professionals, utilize online job boards (e.g., LinkedIn), attend medical career fairs."
    },
    "challengesAndSolutions": {
      "challenge": "Too many resources, not sure where to start.",
      "solution": "Prioritize resources based on the requirements of the medical entrance exams. Create a structured study plan and stick to it. Seek guidance from mentors or educational counselors."
    }
  }
}"`;

    const result = await model.generateContent(prompt);
    const generatedText = await result.response.text();

// Extract JSON content only (use regex to find the first valid JSON block)
const jsonMatch = generatedText.match(/\{[\s\S]*\}/);

if (!jsonMatch) {
  throw new Error("Failed to extract valid JSON from AI response.");
}

const cleanedJson = jsonMatch[0]; // Extracted JSON content
const generatedRoadmap = JSON.parse(cleanedJson);

const savedRoadmap = new GeneratedRoadmap(generatedRoadmap);
await savedRoadmap.save();

res.status(201).json(generatedRoadmap);

  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: error.message });
  }
});



export default router;
