import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Landing from "./components/landing/Landing";
import Dashboard from "./components/dashboard/Dashboard";
import { ThemeProvider } from "./context/ThemeContext";
import Sidebar from "./components/Sidebar/Sidebar";
import Navbar from "./components/Navbar";

import RoadmapComponent from "./components/Static-Roadmap/StaticRoadmap";
import RoadmapList from "./components/Static-Roadmap/RoadmapList";

import Home from "./components/RoadMap/pages/Home";
import MultiStepForm from "./components/RoadMap/pages/MultiStepForm";
import Roadmap from "./components/RoadMap/pages/Roadmap";
import NotFound from "./components/RoadMap/pages/NotFound";

function MainLayout() {
  return (
    <div className="app-container">
      <Navbar />
      <div className="main-layout">
        <Sidebar />

        <div className="content">
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/career-path" element={<Home />} />
            <Route path="/roadmap-list" element={<RoadmapList />} />
            <Route path="/form" element={<MultiStepForm />} />
            <Route path="/roadmap" element={<Roadmap />} />
            <Route path="/static-roadmap" element={<RoadmapComponent />} />
            <Route path="/*" element={<NotFound />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          {/* Landing Page without Navbar & Sidebar */}
          <Route path="/" element={<Landing />} />

          {/* Main layout for dashboard & other pages */}
          <Route path="/*" element={<MainLayout />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
