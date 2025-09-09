// controllers/donationController.js
import Donation from "../models/Donation.js";

// @desc   Add new donation (User)
// @route  POST /api/donations
// @access Private
export const addDonation = async (req, res) => {
  try {
    const { title, category, size, condition, quantity, description, imageUrl, gender } = req.body;

    if (!title || !quantity || !category) {
      return res.status(400).json({ message: "Please provide title, quantity, category and gender" });
    }

    if (!req.user) {
      return res.status(401).json({ message: "Not authorized, user missing" });
    }

    const donation = new Donation({
      user: req.user._id,
      title,
      category,
      size,
      condition,
      quantity,
      description,
      imageUrl,
      gender, // Add this
      status: "pending",
    });

    const createdDonation = await donation.save();
    
    // Populate user details for response
    await createdDonation.populate('user', 'fullName email');
    
    res.status(201).json(createdDonation);
  } catch (error) {
    console.error("❌ Error in addDonation:", error.message);
    res.status(500).json({ message: error.message || "Server error while adding donation" });
  }
};

// @desc   Get logged-in user's donations
// @route  GET /api/donations
// @access Private
export const getUserDonations = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const donations = await Donation.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(donations);
  } catch (error) {
    console.error("❌ Error in getUserDonations:", error.message);
    res.status(500).json({ message: error.message || "Server error while fetching donations" });
  }
};

// @desc   Get all donations (Admin only)
// @route  GET /api/donations/all
// @access Private/Admin
export const getAllDonations = async (req, res) => {
  try {
    const donations = await Donation.find().populate("user", "fullName email phone").sort({ createdAt: -1 });
    res.json(donations);
  } catch (error) {
    console.error("❌ Error in getAllDonations:", error.message);
    res.status(500).json({ message: error.message || "Server error while fetching all donations" });
  }
};

// @desc   Update donation status (Admin only)
// @route  PUT /api/donations/:id/status
// @access Private/Admin
export const updateDonationStatus = async (req, res) => {
  try {
    const { status } = req.body;

    // Validate status
    const allowedStatuses = ["pending", "approved", "rejected"];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const donation = await Donation.findById(req.params.id);
    if (!donation) {
      return res.status(404).json({ message: "Donation not found" });
    }

    donation.status = status;
    const updatedDonation = await donation.save();
    
    // Populate user details for response
    await updatedDonation.populate('user', 'fullName email phone');

    res.json(updatedDonation);
  } catch (error) {
    console.error("❌ Error in updateDonationStatus:", error.message);
    res.status(500).json({ message: error.message || "Server error while updating donation status" });
  }
};

// @desc   Get all approved donations (for orphanages)
// @route  GET /api/donations/approved
// @access Private
export const getApprovedDonations = async (req, res) => {
  try {
    const donations = await Donation.find({ status: "approved" })
      .populate("user", "fullName email phone")
      .sort({ createdAt: -1 });
    
    res.json(donations);
  } catch (error) {
    console.error("❌ Error in getApprovedDonations:", error.message);
    res.status(500).json({ message: error.message || "Server error while fetching approved donations" });
  }
};
