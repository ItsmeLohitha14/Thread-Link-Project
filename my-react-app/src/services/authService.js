// services/authService.js 
import axios from "axios";

const API_URL = "http://localhost:5000/api/auth";

// User Registration
export const registerUser = async (formData) => {
  try {
    const response = await axios.post(`${API_URL}/register`, formData);
    return response;
  } catch (error) {
    throw error;
  }
};
//
// User Login        
// User/Admin Login
export const loginUser = async (userData) => {
  try {
    const res = await axios.post(`${API_URL}/login`, userData);
    if (res.data.token) {
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
    }
    return res.data;
  } catch (err) {
    throw err.response?.data || { message: "Login failed" };
  }
};

export const loginAdmin = async (adminData) => {
  try {
    const res = await axios.post(`${API_URL}/admin/login`, adminData);
    if (res.data.token) {
      localStorage.setItem("token", res.data.token);      // ✅ same key
      localStorage.setItem("user", JSON.stringify(res.data.user)); // ✅ same key
    }
    return res.data;
  } catch (err) {
    throw err.response?.data || { message: "Admin login failed" };
  }
};


// Logout for both user and admin   
export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("adminToken");
  localStorage.removeItem("admin");
};

// Export all functions individually (better for tree-shaking)
export default {
  registerUser,
  loginUser,
  loginAdmin,
  logout,
};
