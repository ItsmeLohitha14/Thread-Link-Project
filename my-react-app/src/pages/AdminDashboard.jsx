// AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";


const AdminDashboard = () => {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true); // loading state
  const [admin, setAdmin] = useState(null);

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
      navigate(" ");
    }

    setChecking(false);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  if (checking) return <div className="p-6">Checking access...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <header className="bg-white shadow px-6 py-6 flex justify-between items-center">
        <h1 className="text-xl font-bold">Admin Dashboard</h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-700 font-medium hidden sm:block">
            Welcome, {admin?.fullName || "Admin"}
          </span>
          <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs sm:text-sm font-semibold">
            Admin
          </span>
          <button
            onClick={handleLogout}
            className="bg-red-100 text-red-600 px-3 py-1 rounded hover:bg-red-200 text-sm"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="p-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Link
            to="/admin/users"
            className="block bg-white p-6 shadow rounded hover:shadow-md transition"
          >
            <h2 className="text-lg font-semibold mb-2">Manage Users</h2>
            <p className="text-sm text-gray-600">
              View and remove user accounts.
            </p>
          </Link>
          <Link
            to="/admin/donations"
            className="block bg-white p-6 shadow rounded hover:shadow-md transition"
          >
            <h2 className="text-lg font-semibold mb-2">Manage Donations</h2>
            <p className="text-sm text-gray-600">
              Track incoming clothing donations.
            </p>
          </Link>
          <Link
            to="/admin/requests"
            className="block bg-white p-6 shadow rounded hover:shadow-md transition"
          >
            <h2 className="text-lg font-semibold mb-2">Manage Orders</h2>
            <p className="text-sm text-gray-600">
              Review clothing requests from orphanages.
            </p>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
