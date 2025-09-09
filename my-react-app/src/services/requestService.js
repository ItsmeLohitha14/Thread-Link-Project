// services/requestService.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/orphanage-requests';

const api = axios.create({
  baseURL: API_URL,
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const submitOrphanageRequest = async (requestData) => {
  try {
    const response = await api.post('/', requestData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to submit request');
  }
};

export const getMyRequests = async () => {
  try {
    const response = await api.get('/my-requests');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch requests');
  }
};

export const getAllRequests = async () => {
  try {
    const response = await api.get('/');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch requests');
  }
};

export const updateRequestStatus = async (requestId, status) => {
  try {
    const response = await api.put(`/${requestId}/status`, { status });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update request status');
  }
};