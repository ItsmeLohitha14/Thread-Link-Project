// src/services/requestService.js
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/orphanage-requests";

const api = axios.create({
  baseURL: API_URL,
});

// Add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const handleError = (error, defaultMsg) => {
  if (error.response) {
    return error.response.data?.message || defaultMsg;
  }
  if (error.request) {
    return "No response from server. Please try again later.";
  }
  return error.message || defaultMsg;
};

export const submitOrphanageRequest = async (requestData) => {
  try {
    const response = await api.post("/", requestData);
    return response.data;
  } catch (error) {
    throw new Error(handleError(error, "Failed to submit request"));
  }
};

export const getMyRequests = async () => {
  try {
    const response = await api.get("/my-requests");
    return response.data;
  } catch (error) {
    throw new Error(handleError(error, "Failed to fetch requests"));
  }
};

export const getAllRequests = async () => {
  try {
    const response = await api.get("/");
    return response.data;
  } catch (error) {
    throw new Error(handleError(error, "Failed to fetch requests"));
  }
};

export const updateRequestStatus = async (requestId, status) => {
  try {
    const response = await api.put(`/${requestId}/status`, { status });
    return response.data;
  } catch (error) {
    throw new Error(handleError(error, "Failed to update request status"));
  }
};

// 🔥 Optional: delete request (if needed by admin)
export const deleteRequest = async (requestId) => {
  try {
    const response = await api.delete(`/${requestId}`);
    return response.data;
  } catch (error) {
    throw new Error(handleError(error, "Failed to delete request"));
  }
};
