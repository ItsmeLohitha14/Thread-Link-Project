// src/pages/AdminRequests.jsx
import React, { useState, useEffect } from "react";
import { getAllRequests, updateRequestStatus } from "../services/requestService";
import { CheckCircle, XCircle, Clock, RefreshCw, Eye } from "lucide-react";

const AdminRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedRequest, setSelectedRequest] = useState(null);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      setLoading(true);
      const allRequests = await getAllRequests();
      setRequests(allRequests);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (requestId, status) => {
    try {
      const updatedRequest = await updateRequestStatus(requestId, status);
      setRequests(prev => prev.map(req => 
        req._id === requestId ? updatedRequest : req
      ));
      alert(`Request ${status} successfully!`);
    } catch (err) {
      alert(`Error updating status: ${err.message}`);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "rejected":
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-700";
      case "rejected":
        return "bg-red-100 text-red-700";
      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Orphanage Requests</h1>
            <p className="text-gray-600">Review and approve/reject clothing requests from orphanages</p>
          </div>
          <button
            onClick={loadRequests}
            className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            <p>Error: {error}</p>
          </div>
        )}

        <div className="grid gap-6">
          {requests.map((request) => (
            <div key={request._id} className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold">
                    Request from: {request.orphanage?.fullName || "Unknown Orphanage"}
                  </h3>
                  <p className="text-sm text-gray-500">{request.orphanage?.email}</p>
                  <p className="text-sm text-gray-500">
                    Submitted: {new Date(request.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                    {request.status.toUpperCase()}
                  </span>
                  <button
                    onClick={() => setSelectedRequest(request)}
                    className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <span className="text-sm text-gray-600">Total Items:</span>
                  <p className="font-semibold">{request.items.length}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Total Quantity:</span>
                  <p className="font-semibold">{request.totalQuantity} pieces</p>
                </div>
              </div>

              {request.status === "pending" && (
                <div className="flex gap-3">
                  <button
                    onClick={() => handleStatusUpdate(request._id, "approved")}
                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(request._id, "rejected")}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {requests.length === 0 && !error && (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm">
            <p className="text-gray-500 text-lg">No orphanage requests found.</p>
          </div>
        )}

        {/* Request Details Modal */}
        {selectedRequest && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">Request Details</h2>
                  <button
                    onClick={() => setSelectedRequest(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>

                <div className="mb-4">
                  <h3 className="font-semibold">Orphanage Information</h3>
                  <p>Name: {selectedRequest.orphanage?.fullName || "N/A"}</p>
                  <p>Email: {selectedRequest.orphanage?.email || "N/A"}</p>
                  <p>Phone: {selectedRequest.orphanage?.phone || "N/A"}</p>
                </div>

                <div className="mb-4">
                  <h3 className="font-semibold">Requested Items ({selectedRequest.items.length})</h3>
                  <div className="space-y-3 mt-2">
                    {selectedRequest.items.map((item, index) => (
                      <div key={index} className="border rounded-lg p-3">
                        <div className="flex items-start gap-3">
                          {item.imageUrl && (
                            <img
                              src={item.imageUrl}
                              alt={item.title}
                              className="w-16 h-16 object-cover rounded"
                            />
                          )}
                          <div className="flex-1">
                            <p className="font-semibold">{item.title}</p>
                            <p className="text-sm text-gray-600">Category: {item.category}</p>
                            <p className="text-sm text-gray-600">Size: {item.size}</p>
                            <p className="text-sm text-gray-600">Gender: {item.gender}</p>
                            <p className="text-sm text-gray-600">Condition: {item.condition}</p>
                            <p className="text-sm font-semibold">Quantity: {item.requestedQuantity}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => setSelectedRequest(null)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminRequests;