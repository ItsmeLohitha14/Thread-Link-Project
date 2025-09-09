// backend-app/routes/auth.js

import express from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/User.js";
import LoginEvent from "../models/LoginEvent.js";
import { protect } from "../middleware/authMiddleware.js";
dotenv.config();
const router = express.Router();

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// =======================  yes
// REGISTER
// =======================
router.post("/register", async (req, res) => {
  try {
    const { fullName, email, phone, address, password, userType } = req.body;
    if (!fullName || !email || !password || !userType) {
      return res.status(400).json({ message: "All required fields must be filled" });
    }
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }
    user = new User({ fullName, email, phone, address, password, userType });
    await user.save();
    res.status(201).json({
      token: generateToken(user._id),
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        address: user.address,
        userType: user.userType,
      },
    });
  } catch (err) {
    console.error("❌ Registration error:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

// =======================
// USER LOGIN
// =======================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const ipAddress = req.ip || req.connection.remoteAddress;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      await LoginEvent.create({ email, success: false, ipAddress });
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      await LoginEvent.create({ userId: user._id, email, success: false, ipAddress });
      return res.status(400).json({ message: "Invalid credentials" });
    }
    await LoginEvent.create({ userId: user._id, email, success: true, ipAddress });
    res.status(200).json({
      token: generateToken(user._id),
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        address: user.address,
        userType: user.userType,
        role: user.role,
        isAdmin: user.isAdmin,
      },
    });
  } catch (err) {
    console.error("❌ Login error:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

// =======================
// GET CURRENT USER (PROTECTED)
// =======================
router.get('/me', protect, async (req, res) => {
  try {
    res.json({
      user: {
        id: req.user._id, // Changed from _id to id for consistency
        fullName: req.user.fullName,
        email: req.user.email,
        role: req.user.role,
        isAdmin: req.user.isAdmin,
        userType: req.user.userType // Added for consistency
      }
    });
  } catch (error) {
    console.error("❌ /me endpoint error:", error);
    res.status(500).json({ message: 'Server error' });
  }
});

// =======================
// ADMIN LOGIN (UNCOMMENT IF NEEDED)
// =======================
/*
router.post("/admin/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const ipAddress = req.ip || req.connection.remoteAddress;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }
    const admin = await User.findOne({ email, userType: "admin" }).select("+password");
    if (!admin) {
      await LoginEvent.create({ email, success: false, ipAddress });
      return res.status(400).json({ message: "Invalid admin credentials" });
    }
    const isMatch = await admin.matchPassword(password);
    if (!isMatch) {
      await LoginEvent.create({ userId: admin._id, email, success: false, ipAddress });
      return res.status(400).json({ message: "Invalid admin credentials" });
    }
    await LoginEvent.create({ userId: admin._id, email, success: true, ipAddress });
    res.status(200).json({
      token: generateToken(admin._id),
      admin: {
        id: admin._id,
        fullName: admin.fullName,
        email: admin.email,
        userType: admin.userType,
        role: admin.role,
        isAdmin: admin.isAdmin
      },
    });
  } catch (err) {
    console.error("❌ Admin login error:", err);
    res.status(500).json({ message: "Server Error" });
  }
});
*/

export default router;