// services/donationService.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/donations';

// Create axios instance with auth token
const api = axios.create({
  baseURL: API_URL,
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    try {
      const userData = localStorage.getItem('user');
      if (userData) {
        const user = JSON.parse(userData);
        if (user && user.token) {
          config.headers.Authorization = `Bearer ${user.token}`;
          console.log("✅ Token added to request:", user.token.substring(0, 20) + "...");
        } else {
          console.log("❌ No token found in user object");
        }
      } else {
        console.log("❌ No user data found in localStorage");
      }
    } catch (error) {
      console.error('Error parsing user data from localStorage:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("✅ Token added to request:", token.substring(0, 20) + "...");
    } else {
      console.log("❌ No token found in localStorage");
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Get all donations (for admin)
// services/donationService.js - Update getAllDonations
export const getAllDonations = async () => {
  try {
    console.log("Fetching all donations from:", API_URL + '/all');
    const response = await api.get('/all');
    console.log("Donations response:", response);
    
    // Handle different response formats
    const data = response.data.donations || response.data || [];
    console.log("Donations fetched successfully:", data.length, "items");
    return data;
  } catch (error) {
    console.error('Error fetching all donations:', error);
    const errorMessage = error.response?.data?.message || 'Failed to fetch all donations';
    throw new Error(errorMessage);
  }
};

export const addDonation = async (donationData) => {
  try {
    const response = await api.post('/', donationData);
    return response.data;
  } catch (error) {
    console.error('Error adding donation:', error.response?.data || error.message);
    const errorMessage = error.response?.data?.message || 'Failed to add donation';
    throw new Error(errorMessage);
  }
};

export const getUserDonations = async () => {
  try {
    const response = await api.get('/');
    return response.data;
  } catch (error) {
    console.error('Error fetching donations:', error.response?.data || error.message);
    const errorMessage = error.response?.data?.message || 'Failed to fetch donations';
    throw new Error(errorMessage);
  }
};

export const updateDonationStatus = async (id, status) => {
  try {
    console.log("Updating donation status:", id, status);
    const response = await api.put(`/${id}/status`, { status });
    console.log("Status updated successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error('Error updating donation status:', error.response?.data || error.message);
    const errorMessage = error.response?.data?.message || 'Failed to update donation status';
    throw new Error(errorMessage);
  }
};

export const getApprovedDonations = async () => {
  try {
    console.log("Fetching approved donations from:", API_URL + '/approved');
    const response = await api.get('/approved');
    
    const data = response.data.donations || response.data || [];
    console.log("Approved donations fetched successfully:", data.length, "items");
    return data;
  } catch (error) {
    console.error('Error fetching approved donations:', error);
    const errorMessage = error.response?.data?.message || 'Failed to fetch approved donations';
    throw new Error(errorMessage);
  }
};