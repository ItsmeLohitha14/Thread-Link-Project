import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ role, children }) => {
  const token = localStorage.getItem("token");
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (role && user.userType !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
