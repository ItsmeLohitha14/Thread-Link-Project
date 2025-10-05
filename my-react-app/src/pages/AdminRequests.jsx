import React, { useState, useEffect } from "react";
import {
  getAllRequests,
  updateRequestStatus,
  deleteRequest,
} from "../services/requestService";
import {
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  Eye,
  Trash2,
  ArrowLeft,
  Grid3X3,
  Search,
  Filter,
  ChevronDown,
  Users,
  Package,
  Home,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const AdminRequests = () => {
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadRequests();
  }, []);

  useEffect(() => {
    filterRequests();
  }, [requests, searchTerm, statusFilter]);

  const loadRequests = async () => {
    try {
      setLoading(true);
      setError("");
      const allRequests = await getAllRequests();
      setRequests(allRequests);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filterRequests = () => {
    let filtered = requests;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(request =>
        request.orphanage?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.orphanage?.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(request => request.status === statusFilter);
    }

    setFilteredRequests(filtered);
  };

  const handleStatusUpdate = async (requestId, status) => {
    try {
      const updatedRequest = await updateRequestStatus(requestId, status);
      setRequests((prev) =>
        prev.map((req) => (req._id === requestId ? updatedRequest : req))
      );
      setMessage(`Request marked as ${status}.`);
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setError(`Error updating status: ${err.message}`);
      setTimeout(() => setError(""), 5000);
    }
  };

  const handleDelete = async (requestId) => {
    if (!window.confirm("Are you sure you want to delete this request?")) return;
    try {
      await deleteRequest(requestId);
      setRequests((prev) => prev.filter((req) => req._id !== requestId));
      setMessage("Request deleted successfully.");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setError(`Error deleting request: ${err.message}`);
      setTimeout(() => setError(""), 5000);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-green-500" />;
      case "rejected":
        return <XCircle className="w-4 h-4 md:w-5 md:h-5 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 md:w-5 md:h-5 text-yellow-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-700 border-green-200";
      case "rejected":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
    }
  };

  const getStatusCount = (status) => {
    return requests.filter(req => req.status === status).length;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 pt-20">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Fixed Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-b border-gray-200 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left Section - Back Button */}
            <button
              onClick={() => navigate("/admin-dashboard")}
              className="flex items-center gap-2 bg-white text-gray-700 px-4 py-2 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 hover:border-blue-300 min-w-[120px]"
            >
              <ArrowLeft size={18} />
              <span className="font-medium hidden sm:block">Dashboard</span>
              <Home size={18} className="sm:hidden" />
            </button>

            {/* Center Section - Title */}
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
                Manage Requests
              </h1>
            </div>

            {/* Right Section - Refresh Button */}
            <button
              onClick={loadRequests}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 hover:bg-blue-700 min-w-[120px] justify-center"
            >
              <RefreshCw className="w-4 h-4" />
              <span className="font-medium hidden sm:block">Refresh</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-20 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Stats Cards - Updated to 4 columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {/* Total Requests Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Requests</p>
                  <p className="text-2xl font-bold text-gray-800 mt-1">{requests.length}</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-xl">
                  <Package className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            {/* Pending Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-yellow-600 mt-1">{getStatusCount("pending")}</p>
                </div>
                <div className="bg-yellow-100 p-3 rounded-xl">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </div>

            {/* Approved Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Approved</p>
                  <p className="text-2xl font-bold text-green-600 mt-1">{getStatusCount("approved")}</p>
                </div>
                <div className="bg-green-100 p-3 rounded-xl">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            {/* Rejected Card - Added */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Rejected</p>
                  <p className="text-2xl font-bold text-red-600 mt-1">{getStatusCount("rejected")}</p>
                </div>
                <div className="bg-red-100 p-3 rounded-xl">
                  <XCircle className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filter Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search Input */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by orphanage name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>

              {/* Filter Button */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-200 min-w-[120px] justify-center"
              >
                <Filter className="w-5 h-5" />
                <span>Filter</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showFilters ? 'rotate-180' : ''}`} />
              </button>
            </div>

            {/* Filter Options */}
            {showFilters && (
              <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                <div className="flex flex-wrap gap-4">
                  {["all", "pending", "approved", "rejected"].map((status) => (
                    <button
                      key={status}
                      onClick={() => setStatusFilter(status)}
                      className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                        statusFilter === status
                          ? "bg-blue-600 text-white shadow-md"
                          : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                      }`}
                    >
                      {status === "all" ? "All Requests" : status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Messages */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-2xl mb-6 flex items-center gap-3">
              <XCircle className="w-5 h-5 flex-shrink-0" />
              <p className="font-medium">{error}</p>
            </div>
          )}
          {message && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-6 py-4 rounded-2xl mb-6 flex items-center gap-3">
              <CheckCircle className="w-5 h-5 flex-shrink-0" />
              <p className="font-medium">{message}</p>
            </div>
          )}

          {/* Requests Grid */}
          <div className="grid gap-6">
            {filteredRequests.map((request) => (
              <div key={request._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-200">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {request.orphanage?.fullName || "Unknown Orphanage"}
                      </h3>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(request.status)}
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                            request.status
                          )}`}
                        >
                          {request.status.toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600">
                      <p>📧 {request.orphanage?.email || "No email"}</p>
                      <p>📅 {new Date(request.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedRequest(request)}
                      className="flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-100 transition-all duration-200 border border-blue-200"
                    >
                      <Eye className="w-4 h-4" />
                      <span className="hidden sm:block">View Details</span>
                    </button>
                    {request.status === "rejected" && (
                      <button
                        onClick={() => handleDelete(request._id)}
                        className="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 transition-all duration-200 border border-red-200"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span className="hidden sm:block">Delete</span>
                      </button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4 p-4 bg-gray-50 rounded-xl">
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Total Items</p>
                    <p className="text-xl font-bold text-gray-800">{request.items.length}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Total Quantity</p>
                    <p className="text-xl font-bold text-gray-800">{request.totalQuantity} pieces</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Status</p>
                    <p className={`text-sm font-bold ${getStatusColor(request.status).split(' ')[1]}`}>
                      {request.status.toUpperCase()}
                    </p>
                  </div>
                </div>

                {request.status === "pending" && (
                  <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
                    <button
                      onClick={() => handleStatusUpdate(request._id, "approved")}
                      className="flex items-center gap-2 bg-green-500 text-white px-6 py-3 rounded-xl hover:bg-green-600 transition-all duration-200 shadow-sm hover:shadow-md flex-1 min-w-[140px] justify-center"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Approve Request
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(request._id, "rejected")}
                      className="flex items-center gap-2 bg-red-500 text-white px-6 py-3 rounded-xl hover:bg-red-600 transition-all duration-200 shadow-sm hover:shadow-md flex-1 min-w-[140px] justify-center"
                    >
                      <XCircle className="w-4 h-4" />
                      Reject Request
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredRequests.length === 0 && !error && (
            <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
              <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg font-medium">No orphanage requests found.</p>
              <p className="text-gray-400 mt-2">
                {searchTerm || statusFilter !== "all" ? "Try adjusting your search or filters" : "All requests are processed"}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Request Details Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Request Details</h2>
                <button
                  onClick={() => setSelectedRequest(null)}
                  className="text-gray-400 hover:text-gray-600 transition-colors duration-200 p-2 hover:bg-gray-100 rounded-lg"
                >
                  ✕
                </button>
              </div>

              {/* Orphanage Information */}
              <div className="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
                <h3 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Orphanage Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-blue-600">Name</p>
                    <p className="font-medium">{selectedRequest.orphanage?.fullName || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-blue-600">Email</p>
                    <p className="font-medium">{selectedRequest.orphanage?.email || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-blue-600">Phone</p>
                    <p className="font-medium">{selectedRequest.orphanage?.phone || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-blue-600">Request Date</p>
                    <p className="font-medium">{new Date(selectedRequest.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              {/* Requested Items */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Requested Items ({selectedRequest.items.length})
                </h3>
                <div className="grid gap-4">
                  {selectedRequest.items.map((item, index) => (
                    <div key={index} className="border border-gray-200 rounded-xl p-4 hover:border-blue-300 transition-all duration-200">
                      <div className="flex flex-col sm:flex-row gap-4">
                        {item.imageUrl && (
                          <img
                            src={item.imageUrl}
                            alt={item.title}
                            className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                          />
                        )}
                        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <p className="font-semibold text-gray-800">{item.title}</p>
                            <p className="text-sm text-gray-600">Category: {item.category}</p>
                            <p className="text-sm text-gray-600">Size: {item.size}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Gender: {item.gender}</p>
                            <p className="text-sm text-gray-600">Condition: {item.condition}</p>
                            <p className="text-sm font-semibold text-blue-600">
                              Quantity: {item.requestedQuantity}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-gray-200">
                <button
                  onClick={() => setSelectedRequest(null)}
                  className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  Close Details
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminRequests;