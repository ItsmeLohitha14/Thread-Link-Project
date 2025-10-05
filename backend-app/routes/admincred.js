// backend-app/routes/admincred.js

import express from "express";
import jwt from "jsonwebtoken";
const router = express.Router();

// Use environment variables in production
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@threadlink.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";


// Admin login endpoint
router.post("/login", (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      // Generate JWT  ok

      const token = jwt.sign(
        { email, role: "admin" },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );
      return res.status(200).json({

        message: "Login successful",

        token,

        user: {

          name: "Admin",

          email: ADMIN_EMAIL,
          userType: "Admin",
        },
      });

    }
    return res.status(401).json({ message: "Invalid admin credentials" });
  } catch (err) {
    console.error("Admin login error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});
export default router;