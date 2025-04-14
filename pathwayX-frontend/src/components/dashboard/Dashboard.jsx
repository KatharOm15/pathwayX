import React, { useEffect, useState } from "react";
import { Flame, FolderOpen, Award, ClipboardList } from "lucide-react";
import CareerCard from "./CareerCard";
import Chatbot from "../AI-Chatbot/Chatbot";

const Dashboard = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const stats = [
    {
      title: "Current Streak",
      value: "10 Days",
      icon: <Flame size={28} className="text-red-500" />,
      change: "+2 Days",
    },
    {
      title: "Ongoing Projects",
      value: "3",
      icon: <FolderOpen size={28} className="text-green-500" />,
      change: "+1 New",
    },
    {
      title: "Certifications Earned",
      value: "5",
      icon: (
        <Award
          size={28}
          className="bg-gradient-to-r from-purple-500 via-violet-500 to-blue-500  bg-clip-text text-transparent"
        />
      ),
      change: "+1",
    },
    {
      title: "Pending Tasks",
      value: "7",
      icon: <ClipboardList size={28} className="text-yellow-500" />,
      change: "-2 Completed",
    },
  ];

  return (
    <>
      <p className="text-2xl font-bold">
        Welcome back, {user ? user.name : "Guest"} 👋
      </p>
      <p className="text-gray-500 dark:text-gray-400">
        Stay on track with your learning journey!
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="p-6 rounded-2xl bg-transparent dark:shadow-sm shadow-gray-300 
            hover:shadow-md hover:shadow-gray-300 hover:scale-103 transition-all duration-300 relative"
          >
            <div className="w-12 h-12 p-3 rounded-xl bg-gray-100 dark:bg-gray-200 flex items-center">
              {stat.icon}
            </div>

            <span
              className="absolute top-4 right-4 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 
              px-3 py-1 text-sm rounded-full shadow"
            >
              {stat.change}
            </span>

            <h3 className="text-gray-500 dark:text-gray-400 mt-4">
              {stat.title}
            </h3>
            <p className="text-2xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>
      <CareerCard />

      <Chatbot />
    </>
  );
};

export default Dashboard;
