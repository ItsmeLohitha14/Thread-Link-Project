// src/App.jsx
import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import About from "./components/About";
import Footer from "./components/Footer";
import Register from "./pages/Register";
import Login from "./pages/Login";
import UserDashboard from "./pages/UserDashboard";
import UserDonations from "./components/UserDonations";
import UserRequests from "./components/UserRequests";
import OrphanageDashboard from "./pages/OrphanageDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute"; // Role-based protection
import AdminDonations from "./pages/AdminDonations";
import AdminUsers from "./pages/AdminUsers";
import { CartProvider } from './contexts/CartContext';

const App = () => {
  const location = useLocation();

  const noNavbarPaths = [
    "/dashboard",
    "/orphanage-dashboard",
    "/admin-dashboard",
    "/admin/donations",
    "/admin/users",
  ];

  const showNavbar = !noNavbarPaths.some(path =>
    location.pathname.startsWith(path)
  );

  return (
    <CartProvider>
      <div className="min-h-screen bg-white text-gray-900">
        {showNavbar && <Navbar />}

        <Routes>
          <Route
            path="/"
            element={
              <>
                <Home />
                <About />
                <Footer />
              </>
            }
          />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/donations" element={<UserDonations />} />
          <Route path="/requests" element={<UserRequests />} />
          <Route path="/orphanage-dashboard" element={<OrphanageDashboard />} />
          <Route path="/admin/donations" element={<AdminDonations />} />
          <Route path="/admin/users" element={<ProtectedRoute><AdminUsers /></ProtectedRoute>} />
          
          {/* Admin Dashboard with Role Protection */}
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute role="Admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </CartProvider>
  );
};

export default App;