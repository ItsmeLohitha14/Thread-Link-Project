import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Users, Package, ClipboardList, LogOut, Shield, Menu, X } from "lucide-react";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);
  const [admin, setAdmin] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // ✅ Admin check with loading
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setAdmin(storedUser);

    if (!storedUser) {
      alert("Unauthorized access. Redirecting to home.");
      navigate("/");
      return;
    }

    const isAdmin =
      storedUser.userType === "Admin" ||
      storedUser.isAdmin === true ||
      storedUser.email === "admin@threadlink.com" ||
      storedUser.role === "admin";

    if (!isAdmin) {
      alert("Unauthorized access. Redirecting to home.");
      navigate("/");
    }

    setChecking(false);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  if (checking) return <div className="p-6 text-center">Checking access...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 flex flex-col">
      {/* Header */}
      <header className="backdrop-blur-md bg-white/60 shadow px-4 sm:px-6 py-4 flex justify-between items-center sticky top-0 z-20">
        <div className="flex items-center gap-2">
          <Shield className="text-purple-600" size={28} />
          <h1 className="text-lg sm:text-xl font-extrabold text-gray-800 tracking-wide">
            Admin Dashboard
          </h1>
        </div>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-4">
          <span className="text-gray-700 font-medium">
            Welcome, {admin?.fullName || "Admin"}
          </span>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition"
          >
            <LogOut size={18} />
            <span className="hidden sm:inline">Logout</span>
          </motion.button>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center gap-2">
          <span className="text-sm text-gray-700 truncate max-w-[120px]">
            {admin?.fullName?.split(' ')[0] || "Admin"}
          </span>
          <button
            onClick={toggleMobileMenu}
            className="p-2 rounded-lg bg-white shadow-md"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute top-16 right-4 bg-white/95 backdrop-blur-md rounded-xl shadow-xl p-4 min-w-[200px] border border-white/40 md:hidden z-30"
          >
            <div className="flex flex-col gap-3">
              <span className="text-gray-700 font-medium pb-2 border-b border-gray-200">
                {admin?.fullName || "Admin"}
              </span>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-lg shadow-md w-full justify-center"
              >
                <LogOut size={18} />
                Logout
              </motion.button>
            </div>
          </motion.div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto"
        >
          {/* Manage Users */}
          <DashboardCard
            to="/admin/users"
            title="Manage Users"
            desc="View and remove user accounts."
            icon={<Users className="text-blue-500" />}
            color="from-blue-100 to-blue-50"
          />

          {/* Manage Donations */}
          <DashboardCard
            to="/admin/donations"
            title="Manage Donations"
            desc="Track incoming clothing donations."
            icon={<Package className="text-green-500" />}
            color="from-green-100 to-green-50"
          />

          {/* Manage Orders */}
          <DashboardCard
            to="/admin/requests"
            title="Manage Orders"
            desc="Review clothing requests from orphanages."
            icon={<ClipboardList className="text-purple-500" />}
            color="from-purple-100 to-purple-50"
          />
        </motion.div>
      </main>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-10 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
};

// Reusable Dashboard Card - Updated for mobile
const DashboardCard = ({ to, title, desc, icon, color }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.03, y: -3 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="w-full"
    >
      <Link
        to={to}
        className={`block bg-gradient-to-br ${color} p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-md hover:shadow-xl backdrop-blur-md border border-white/40 transition min-h-[140px] sm:min-h-[160px] flex flex-col justify-between`}
      >
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <div className="p-2 sm:p-3 bg-white rounded-lg sm:rounded-xl shadow">
            {React.cloneElement(icon, { size: window.innerWidth < 640 ? 30 : 40 })}
          </div>
        </div>
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-1 sm:mb-2 line-clamp-1">
            {title}
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">
            {desc}
          </p>
        </div>
      </Link>
    </motion.div>
  );
};

export default AdminDashboard;