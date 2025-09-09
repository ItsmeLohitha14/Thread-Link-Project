// middleware/authMiddleware.js              
import jwt from "jsonwebtoken";
import User from "../models/User.js";

// ✅ Protect routes → only logged-in users
// middleware/authMiddleware.js - Alternative approach
export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Special handling for admin user
      if (decoded.email === "admin@threadlink.com" && decoded.role === "admin") {
        req.user = {
          _id: "admin-user-id", // You can use a fixed ID or generate one
          email: decoded.email,
          role: decoded.role,
          isAdmin: true,
          fullName: "System Administrator"
        };
      } else {
        // Regular user lookup
        req.user = await User.findById(decoded.id).select("-password");
        if (!req.user) {
          return res.status(401).json({ message: "User not found" });
        }
        req.user.isAdmin = req.user.role === "admin" || req.user.isAdmin === true;
      }

      next();
    } catch (err) {
      return res.status(401).json({ message: "Not authorized, invalid token" });
    }
  } else {
    return res.status(401).json({ message: "Not authorized, no token provided" });
  }
};

// ✅ Restrict to admin only
export const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    return next();
  }
  return res.status(403).json({ message: "Not authorized as admin" });
};