// OrphanageDashboard.jsx - Update the activeTab handling
import React, { useState } from "react";
import BrowseClothes from "./BrowseClothes"; // Import the new component
import CartPage from "./CartPage";
import { useCart } from "../contexts/CartContext"; // Add this import
import MyRequests from "./MyRequests";

const OrphanageDashboard = () => {
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : {};
  const [activeTab, setActiveTab] = useState("browse");
  const { getCartItemsCount } = useCart();

  const tabs = [
    { id: "browse", label: "Browse Clothes" },
    { id: "cart", label: `Cart (${getCartItemsCount()})` },
    { id: "requests", label: "My Requests" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "browse":
        return <BrowseClothes />;
      case "cart":
        return <CartPage />;
      case "requests":
        return <MyRequests />;
      default:
        return <BrowseClothes />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Top Nav */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md px-5 sm:px-8 py-5 flex items-center justify-between">
        <h1 className="text-xl font-bold">Orphanage Dashboard</h1>

        <div className="flex items-center gap-4 text-sm sm:text-base">
          <p className="text-gray-700 font-medium hidden sm:block">
            Welcome, <span className="font-semibold">{user?.fullName || "Orphanage"}</span>
          </p>
          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs sm:text-sm font-semibold">
            Orphanage
          </span>
          <button
            onClick={handleLogout}
            className="bg-red-100 text-red-600 hover:bg-red-200 px-3 py-1 sm:px-4 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium transition"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Spacer */}
      <div className="pt-24">
        {/* Tabs */}
        <div className="flex justify-center mb-6 px-4">
          <div className="flex gap-2 w-full max-w-2xl">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all text-sm sm:text-base ${
                  activeTab === tab.id
                    ? "bg-white shadow text-gray-900"
                    : "bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {renderTabContent()}
      </div>
    </div>
  );
};

export default OrphanageDashboard;