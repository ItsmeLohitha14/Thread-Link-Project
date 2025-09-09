// backend-app/routes/donationRoutes.js
import express from "express";
import { protect, admin } from "../middleware/authMiddleware.js";
import {
  getAllDonations,
  updateDonationStatus,
  getUserDonations,
  addDonation,
  getApprovedDonations,
       
} from "../controllers/donationController.js";

const router = express.Router();

// All routes protected
router.use(protect);

// Admin only routes
router.get("/all", admin, getAllDonations);
router.put("/:id/status", admin, updateDonationStatus);

// User routes
router.get("/", getUserDonations);
router.post("/", addDonation);  // ← Use addDonation here
router.get('/approved', protect, getApprovedDonations);

export default router;