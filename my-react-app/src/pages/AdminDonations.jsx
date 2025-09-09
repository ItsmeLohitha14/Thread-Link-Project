import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllDonations, updateDonationStatus } from "../services/donationService";
import { ArrowLeft, Grid3X3 } from "lucide-react";

const AdminDonations = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState("");
  const [admin, setAdmin] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
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
        const data = await getAllDonations();
        setDonations(data);
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

  const handleStatusChange = async (id, status) => {
    try {
      const updatedDonation = await updateDonationStatus(id, status);
      setDonations((prev) =>
        prev.map((d) => (d._id === id ? updatedDonation : d))
      );
      alert(`Donation ${status} successfully!`);
    } catch (err) {
      console.error("❌ Error updating status:", err);
      alert("Failed to update donation status: " + err.message);
    }
  };

  const openImageModal = (imageUrl) => {
    setSelectedImage(imageUrl);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
  };

  if (checking) return <div className="p-6">Checking access...</div>;
  if (loading) return <div className="p-6 text-center">Loading donations...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-6 md:mb-8">
        {/* Back Button - Left Side */}
        <button
          onClick={() => navigate("/admin-dashboard")}
          className="flex items-center gap-1 md:gap-2 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 md:px-4 md:py-2 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
        >
          <ArrowLeft size={18} />
          <span className="hidden md:block">Back to Dashboard</span>
        </button>

        {/* Centered Title - Hidden on mobile, shown on desktop */}
        <h1 className="hidden md:block text-2xl md:text-3xl font-bold text-gray-800 text-center flex-1 mx-4">
          Manage Donations
        </h1>

        {/* Mobile Title with Icon */}
        <div className="md:hidden flex items-center gap-2 flex-1 justify-center">
          <Grid3X3 size={20} className="text-blue-600" />
          <span className="text-xl font-bold text-gray-800">Donations</span>
        </div>

        {/* Empty div for balance - keeps title centered on desktop */}
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

      {donations.length === 0 && !error ? (
        <div className="bg-white p-6 md:p-8 rounded-lg shadow text-center">
          <p className="text-gray-500 text-lg">No donations found.</p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          {/* Desktop Table */}
          <table className="hidden md:table min-w-full text-sm">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="px-6 py-3 font-semibold text-gray-700">Image</th>
                <th className="px-6 py-3 font-semibold text-gray-700">Donor Name</th>
                <th className="px-6 py-3 font-semibold text-gray-700">Email</th>
                <th className="px-6 py-3 font-semibold text-gray-700">Title</th>
                <th className="px-6 py-3 font-semibold text-gray-700">Category</th>
                <th className="px-6 py-3 font-semibold text-gray-700">Gender</th>
                <th className="px-6 py-3 font-semibold text-gray-700">Quantity</th>
                <th className="px-6 py-3 font-semibold text-gray-700">Status</th>
                <th className="px-6 py-3 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {donations.map((donation) => (
                <tr key={donation._id} className="border-t hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    {donation.imageUrl ? (
                      <div 
                        className="cursor-pointer group"
                        onClick={() => openImageModal(donation.imageUrl)}
                      >
                        <img
                          src={donation.imageUrl}
                          alt={donation.title}
                          className="w-12 h-12 object-cover rounded border group-hover:opacity-80 transition-opacity"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'block';
                          }}
                        />
                        <div 
                          className="w-12 h-12 bg-gray-200 rounded border items-center justify-center text-xs text-gray-500 hidden group-hover:bg-gray-300 transition-colors"
                          onClick={() => openImageModal(donation.imageUrl)}
                        >
                          View
                        </div>
                      </div>
                    ) : (
                      <div className="w-12 h-12 bg-gray-200 rounded border flex items-center justify-center text-xs text-gray-500">
                        No Image
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 font-medium">{donation.user?.fullName || "N/A"}</td>
                  <td className="px-6 py-4 text-gray-600">{donation.user?.email || "N/A"}</td>
                  <td className="px-6 py-4 font-medium">{donation.title}</td>
                  <td className="px-6 py-4 capitalize text-gray-700">{donation.category}</td>
                  <td className="px-6 py-4 capitalize text-gray-700">{donation.gender || "N/A"}</td>
                  <td className="px-6 py-4 text-center">{donation.quantity}</td>
                  <td className="px-6 py-4">
                    {donation.status === "pending" && (
                      <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-medium">
                        Pending
                      </span>
                    )}
                    {donation.status === "approved" && (
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
                        Approved
                      </span>
                    )}
                    {donation.status === "rejected" && (
                      <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-medium">
                        Rejected
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 space-x-2">
                    {donation.status === "pending" ? (
                      <>
                        <button
                          onClick={() => handleStatusChange(donation._id, "approved")}
                          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-xs transition-colors duration-200"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleStatusChange(donation._id, "rejected")}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs transition-colors duration-200"
                        >
                          Reject
                        </button>
                      </>
                    ) : (
                      <span className="text-gray-500 text-xs">No actions</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-4 p-4">
            {donations.map((donation) => (
              <div key={donation._id} className="bg-white border rounded-lg p-4 shadow-sm">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {donation.imageUrl ? (
                      <div 
                        className="cursor-pointer"
                        onClick={() => openImageModal(donation.imageUrl)}
                      >
                        <img
                          src={donation.imageUrl}
                          alt={donation.title}
                          className="w-16 h-16 object-cover rounded border"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'block';
                          }}
                        />
                        <div 
                          className="w-16 h-16 bg-gray-200 rounded border items-center justify-center text-xs text-gray-500 hidden"
                          onClick={() => openImageModal(donation.imageUrl)}
                        >
                          View
                        </div>
                      </div>
                    ) : (
                      <div className="w-16 h-16 bg-gray-200 rounded border flex items-center justify-center text-xs text-gray-500">
                        No Image
                      </div>
                    )}
                    <div>
                      <h3 className="font-semibold text-sm">{donation.title}</h3>
                      <p className="text-xs text-gray-600 capitalize">{donation.category}</p>
                      <p className="text-xs text-gray-500">Qty: {donation.quantity}</p>
                      {donation.gender && (
                        <p className="text-xs text-gray-500 capitalize">Gender: {donation.gender}</p>
                      )}
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    donation.status === "pending" ? "bg-yellow-100 text-yellow-700" :
                    donation.status === "approved" ? "bg-green-100 text-green-700" :
                    "bg-red-100 text-red-700"
                  }`}>
                    {donation.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                  <div>
                    <span className="font-medium">Donor:</span>
                    <p className="text-gray-600">{donation.user?.fullName || "N/A"}</p>
                  </div>
                  <div>
                    <span className="font-medium">Email:</span>
                    <p className="text-gray-600 text-xs truncate">{donation.user?.email || "N/A"}</p>
                  </div>
                </div>

                {donation.status === "pending" && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleStatusChange(donation._id, "approved")}
                      className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded text-xs transition-colors"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleStatusChange(donation._id, "rejected")}
                      className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded text-xs transition-colors"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl max-h-full overflow-auto">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-semibold">Donation Image</h3>
              <button
                onClick={closeImageModal}
                className="text-gray-500 hover:text-gray-700 text-2xl transition-colors"
              >
                ×
              </button>
            </div>
            <div className="p-4">
              <img
                src={selectedImage}
                alt="Donation"
                className="w-full h-auto max-h-96 object-contain rounded"
              />
            </div>
            <div className="p-4 border-t flex justify-end">
              <button
                onClick={closeImageModal}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDonations;