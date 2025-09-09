import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import userDashboardImg from "../assets/UserDashboardimg.png";
import UserDonations from "../components/UserDonations";
import UserRequests from "../components/UserRequests";
import { useNavigate } from "react-router-dom";


const UserDashboard = () => {
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const [activeSection, setActiveSection] = useState(""); // '', 'donations', 'requests'
  const navigate = useNavigate();


  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Navigation Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md px-5 sm:px-8 py-5 flex items-center justify-between">
        <h1 className="text-xl font-bold">Donor Dashboard</h1>
        <div className="flex items-center gap-4 text-sm sm:text-base">
          <p className="text-gray-700 font-medium hidden sm:block">
            Welcome, <span className="font-semibold">{user?.fullName || "User"}</span>
          </p>
          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs sm:text-sm font-semibold">
            User
          </span>
          <button
            onClick={() => {
              localStorage.removeItem("user");
              window.location.href = "/";
            }}
            className="bg-red-100 text-red-600 hover:bg-red-200 px-3 py-1 sm:px-4 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium transition"
          >
            Logout
          </button>

        </div>
      </div>

      {/* Hero Section */}
      <div className="pt-24 bg-gradient-to-r from-green-500 to-blue-500 text-white w-full">
        <div className="flex flex-col md:grid md:grid-cols-2 items-center px-4 sm:px-10 md:px-16 py-10 md:py-16 gap-10">
          <div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-6 leading-snug">
              Connect Communities Through <br /> Sustainable Fashion
            </h2>
            <p className="text-base sm:text-lg text-white/90 mb-6">
              Join ThreadLink to donate, share, and receive clothing while reducing waste and helping those in need.
            </p>
            <button className="bg-white text-green-600 font-semibold px-6 py-3 rounded-lg shadow-md hover:bg-gray-100 transition">
              Donate Now
            </button>
          </div>

          <div className="flex justify-center md:justify-end">
            <div className="rounded-xl overflow-hidden shadow-xl w-full max-w-md h-60 sm:h-72 md:h-80 transform transition duration-500 hover:scale-105 hover:shadow-2xl hover:rotate-1">
              <img src={userDashboardImg} alt="Clothes folding" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </div>

      {/* Buttons to Toggle Sections */}
      <div className="bg-white flex-grow pt-4">
        <div className="py-6 flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 px-4">
          <button
            onClick={() => setActiveSection("donations")}
            className={`px-6 py-2 rounded-lg shadow font-medium ${activeSection === "donations" ? "bg-blue-500 text-white" : "bg-gray-200 hover:bg-gray-300 text-gray-800"
              }`}
          >
            My Donations
          </button>

          <button
            onClick={() => setActiveSection("requests")}
            className={`px-6 py-2 rounded-lg shadow font-medium ${activeSection === "requests" ? "bg-blue-500 text-white" : "bg-gray-200 hover:bg-gray-300 text-gray-800"
              }`}
          >
            My Requests
          </button>
        </div>

        {/* Section Renderer */}
        <div className="max-w-4xl mx-auto">
          {activeSection === "donations" && <UserDonations />}
          {activeSection === "requests" && <UserRequests />}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
