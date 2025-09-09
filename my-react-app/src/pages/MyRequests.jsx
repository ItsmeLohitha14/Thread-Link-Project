// src/pages/MyRequests.jsx
import React, { useState, useEffect } from "react";
import { useCart } from "../contexts/CartContext";
import { Calendar, Package, CheckCircle, Clock, XCircle, Truck, RefreshCw } from "lucide-react";

const MyRequests = () => {
  const { fetchMyRequests } = useCart();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      setLoading(true);
      setError("");
      const myRequests = await fetchMyRequests();

      // sort by createdAt oldest → newest for consistent numbering
      const sorted = [...myRequests].sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
      );

      setRequests(sorted);
    } catch (err) {
      console.error("Error loading requests:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "rejected":
        return <XCircle className="w-5 h-5 text-red-500" />;
      case "fulfilled":
        return <Truck className="w-5 h-5 text-blue-500" />;
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
      case "fulfilled":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading your requests...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-xl shadow-sm">
          <Package className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Error loading requests</h2>
          <p className="text-gray-500 mb-4">{error}</p>
          <button
            onClick={loadRequests}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Requests</h1>
            <p className="text-gray-600">Track the status of your clothing requests</p>
          </div>
          <button
            onClick={loadRequests}
            className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>

        {requests.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-700 mb-2">No requests yet</h2>
            <p className="text-gray-500 mb-6">Submit your first request from the cart</p>
            <button
              onClick={() => (window.location.href = "/orphanage-dashboard?tab=browse")}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition"
            >
              Browse Clothes
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* render in reverse (latest on top), but use original index for numbering */}
            {[...requests]
              .slice()
              .reverse()
              .map((request) => {
                const originalIndex = requests.findIndex((r) => r._id === request._id);
                return (
                  <div key={request._id} className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold">
                          Request {originalIndex + 1}
                        </h3>
                        <div className="flex items-center gap-2 mt-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-500">
                            {new Date(request.createdAt).toLocaleDateString()} at{" "}
                            {new Date(request.createdAt).toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(request.status)}
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            request.status
                          )}`}
                        >
                          {request.status.toUpperCase()}
                        </span>
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <h4 className="font-medium mb-3">
                        Items Requested ({request.totalQuantity} pieces):
                      </h4>
                      <div className="grid gap-3">
                        {request.items.map((item, itemIndex) => (
                          <div
                            key={itemIndex}
                            className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg"
                          >
                            {item.imageUrl && (
                              <img
                                src={item.imageUrl}
                                alt={item.title}
                                className="w-12 h-12 object-cover rounded"
                              />
                            )}
                            <div className="flex-1">
                              <p className="font-medium">{item.title}</p>
                              <p className="text-sm text-gray-500 capitalize">
                                {item.category} • {item.gender}
                              </p>
                              <p className="text-sm text-gray-500">
                                Size: {item.size} • Condition: {item.condition}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">
                                Quantity: {item.requestedQuantity}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {request.notes && (
                      <div className="mt-4 pt-4 border-t">
                        <h4 className="font-medium mb-2">Notes:</h4>
                        <p className="text-sm text-gray-600">{request.notes}</p>
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyRequests;
