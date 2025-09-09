import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Users, Building, Trash2, AlertCircle } from "lucide-react";
import { getAllUsers, deleteUser } from "../services/adminService";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState("");
  const [admin, setAdmin] = useState(null);
  const [activeTab, setActiveTab] = useState("donors"); // 'donors' or 'orphanages'
  const [deleteError, setDeleteError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const token = localStorage.getItem("token");
        
        if (!token) {
          alert("No token found. Redirecting to home.");
          navigate("/");
          return;
        }

        const res = await fetch("http://localhost:5000/api/auth/me", {
          headers: { 
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
        });
        
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(errorData.message || `HTTP error! status: ${res.status}`);
        }

        const userData = await res.json();
        const user = userData.user || userData;
        const isAdmin = user.role === "admin" || user.isAdmin || user.email === "admin@threadlink.com";
        
        if (!isAdmin) {
          alert("Unauthorized access. Redirecting to home.");
          navigate("/");
          return;
        }

        setAdmin(user);
        await fetchUsers();
      } catch (err) {
        console.error("❌ Auth check failed:", err.message);
        setError(err.message);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
      } finally {
        setLoading(false);
        setChecking(false);
      }
    };

    checkAdmin();
  }, [navigate]);

  const fetchUsers = async () => {
    try {
      const data = await getAllUsers();
      setUsers(data);
      filterUsersByType(data, activeTab);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filterUsersByType = (usersList, type) => {
    const filtered = usersList.filter(user => 
      type === "donors" 
        ? user.userType === "Individual Donor"
        : user.userType === "Orphanage"
    );
    setFilteredUsers(filtered);
  };

  useEffect(() => {
    filterUsersByType(users, activeTab);
  }, [activeTab, users]);

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) return;
    
    try {
      await deleteUser(userId);
      // Remove user from state
      setUsers(users.filter(user => user._id !== userId));
      setDeleteError("");
      alert("User deleted successfully");
    } catch (err) {
      console.error("Error deleting user:", err);
      setDeleteError(err.message);
    }
  };

  if (checking) return <div className="p-6">Checking access...</div>;
  if (loading) return <div className="p-6 text-center">Loading users...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-6 md:mb-8">
        <button
          onClick={() => navigate("/admin-dashboard")}
          className="flex items-center gap-1 md:gap-2 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 md:px-4 md:py-2 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
        >
          <ArrowLeft size={18} />
          <span className="hidden md:block">Back to Dashboard</span>
        </button>

        <h1 className="hidden md:block text-2xl md:text-3xl font-bold text-gray-800 text-center flex-1 mx-4">
          Manage Users
        </h1>

        <div className="md:hidden flex items-center gap-2 flex-1 justify-center">
          <Users size={20} className="text-blue-600" />
          <span className="text-xl font-bold text-gray-800">Users</span>
        </div>

        <div className="hidden md:block w-40"></div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <p>Error: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      )}

      {deleteError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 flex items-center">
          <AlertCircle size={20} className="mr-2" />
          <p>{deleteError}</p>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="flex border-b mb-6">
        <button
          className={`px-4 py-2 font-medium flex items-center gap-2 ${
            activeTab === "donors"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("donors")}
        >
          <Users size={16} />
          Individual Donors
        </button>
        <button
          className={`px-4 py-2 font-medium flex items-center gap-2 ${
            activeTab === "orphanages"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("orphanages")}
        >
          <Building size={16} />
          Orphanages
        </button>
      </div>

      {filteredUsers.length === 0 && !error ? (
        <div className="bg-white p-6 md:p-8 rounded-lg shadow text-center">
          <p className="text-gray-500 text-lg">
            No {activeTab === "donors" ? "donors" : "orphanages"} found.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          {/* Desktop Table */}
          <table className="hidden md:table min-w-full text-sm">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="px-6 py-3 font-semibold text-gray-700">Name</th>
                <th className="px-6 py-3 font-semibold text-gray-700">Email</th>
                <th className="px-6 py-3 font-semibold text-gray-700">Phone</th>
                <th className="px-6 py-3 font-semibold text-gray-700">Address</th>
                <th className="px-6 py-3 font-semibold text-gray-700">User Type</th>
                <th className="px-6 py-3 font-semibold text-gray-700">Role</th>
                <th className="px-6 py-3 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user._id} className="border-t hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium">{user.fullName}</td>
                  <td className="px-6 py-4 text-gray-600">{user.email}</td>
                  <td className="px-6 py-4">{user.phone || "N/A"}</td>
                  <td className="px-6 py-4">{user.address || "N/A"}</td>
                  <td className="px-6 py-4 capitalize">{user.userType}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      user.role === "admin" || user.isAdmin
                        ? "bg-purple-100 text-purple-700" 
                        : "bg-gray-100 text-gray-700"
                    }`}>
                      {user.role || (user.isAdmin ? "admin" : "user")}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleDeleteUser(user._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs transition-colors duration-200 flex items-center gap-1"
                      disabled={user.role === "admin" || user.isAdmin}
                      title={user.role === "admin" || user.isAdmin ? "Cannot delete admin users" : "Delete user"}
                    >
                      <Trash2 size={14} />
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-4 p-4">
            {filteredUsers.map((user) => (
              <div key={user._id} className="bg-white border rounded-lg p-4 shadow-sm">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-sm">{user.fullName}</h3>
                    <p className="text-xs text-gray-600">{user.email}</p>
                    <p className="text-xs text-gray-500 mt-1 capitalize">{user.userType}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    user.role === "admin" || user.isAdmin
                      ? "bg-purple-100 text-purple-700" 
                      : "bg-gray-100 text-gray-700"
                  }`}>
                    {user.role || (user.isAdmin ? "admin" : "user")}
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-2 text-xs mb-3">
                  {user.phone && (
                    <div>
                      <span className="font-medium">Phone:</span>
                      <p className="text-gray-600">{user.phone}</p>
                    </div>
                  )}
                  {user.address && (
                    <div>
                      <span className="font-medium">Address:</span>
                      <p className="text-gray-600">{user.address}</p>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleDeleteUser(user._id)}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded text-xs transition-colors flex items-center justify-center gap-1"
                    disabled={user.role === "admin" || user.isAdmin}
                    title={user.role === "admin" || user.isAdmin ? "Cannot delete admin users" : "Delete user"}
                  >
                    <Trash2 size={14} />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;