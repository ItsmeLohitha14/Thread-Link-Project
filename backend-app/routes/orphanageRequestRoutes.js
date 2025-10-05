import express from "express";
import OrphanageRequest from "../models/OrphanageRequest.js";
import Donation from "../models/Donation.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// @desc    Create new orphanage request
// @route   POST /api/orphanage-requests
// @access  Private (Orphanage)
router.post("/", protect, async (req, res) => {
  try {
    const { items, notes } = req.body;

    // Validate items
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Request must contain at least one item" });
    }

    // Calculate total quantity
    const totalQuantity = items.reduce((total, item) => total + item.requestedQuantity, 0);

    // Validate minimum quantity
    if (totalQuantity < 5) {
      return res.status(400).json({ message: "Total requested quantity must be at least 5 pieces" });
    }

    // Check stock availability and validate items
    for (const item of items) {
      const donation = await Donation.findById(item.donation);
      if (!donation) {
        return res.status(404).json({ message: `Donation ${item.donation} not found` });
      }

      if (donation.quantity < item.requestedQuantity) {
        return res.status(400).json({ 
          message: `Insufficient stock for ${donation.title}. Available: ${donation.quantity}, Requested: ${item.requestedQuantity}` 
        });
      }

      if (donation.status !== "approved") {
        return res.status(400).json({ 
          message: `Donation ${donation.title} is not available for request` 
        });
      }
    }

    // Create request
    const request = new OrphanageRequest({
      orphanage: req.user._id,
      items: items.map(item => ({
        donation: item.donation,
        requestedQuantity: item.requestedQuantity,
        title: item.title,
        category: item.category,
        size: item.size,
        gender: item.gender,
        condition: item.condition,
        imageUrl: item.imageUrl,
      })),
      totalQuantity,
      notes,
    });

    const createdRequest = await request.save();
    
    // Populate orphanage details
    await createdRequest.populate("orphanage", "fullName email phone");
    await createdRequest.populate("items.donation", "title category size condition imageUrl");

    res.status(201).json(createdRequest);
  } catch (error) {
    console.error("Error creating orphanage request:", error);
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get orphanage's requests
// @route   GET /api/orphanage-requests/my-requests
// @access  Private (Orphanage)
router.get("/my-requests", protect, async (req, res) => {
  try {
    console.log("Fetching requests for user:", req.user._id);
    
    const requests = await OrphanageRequest.find({ orphanage: req.user._id })
      .populate("items.donation", "title category size condition imageUrl")
      .sort({ createdAt: -1 });

    console.log("Found requests:", requests.length);
    
    res.json(requests);
  } catch (error) {
    console.error("Error fetching orphanage requests:", error);
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get all requests (Admin)
// @route   GET /api/orphanage-requests
// @access  Private/Admin
router.get("/", protect, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== "admin" && !req.user.isAdmin) {
      return res.status(403).json({ message: "Not authorized as admin" });
    }

    const requests = await OrphanageRequest.find()
      .populate("orphanage", "fullName email phone")
      .populate("items.donation", "title category size condition imageUrl")
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (error) {
    console.error("Error fetching all requests:", error);
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update request status (Admin)
// @route   PUT /api/orphanage-requests/:id/status
// @access  Private/Admin
router.put("/:id/status", protect, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== "admin" && !req.user.isAdmin) {
      return res.status(403).json({ message: "Not authorized as admin" });
    }

    const { status } = req.body;
    const allowedStatuses = ["pending", "approved", "rejected", "fulfilled"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const request = await OrphanageRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    // If approving, check stock availability again
    if (status === "approved") {
      for (const item of request.items) {
        const donation = await Donation.findById(item.donation);
        if (donation.quantity < item.requestedQuantity) {
          return res.status(400).json({ 
            message: `Cannot approve - insufficient stock for ${donation.title}` 
          });
        }
      }
    }

    request.status = status;
    const updatedRequest = await request.save();

    // If approved, reduce donation quantities
    if (status === "approved") {
      for (const item of updatedRequest.items) {
        await Donation.findByIdAndUpdate(
          item.donation,
          { $inc: { quantity: -item.requestedQuantity } }
        );
      }
    }

    await updatedRequest.populate("orphanage", "fullName email phone");
    await updatedRequest.populate("items.donation", "title category size condition imageUrl");

    res.json(updatedRequest);
  } catch (error) {
    console.error("Error updating request status:", error);
    res.status(500).json({ message: error.message });
  }
});


// @desc    Delete orphanage request (Admin)
// @route   DELETE /api/orphanage-requests/:id
// @access  Private/Admin
router.delete("/:id", protect, async (req, res) => {
  try {
    if (req.user.role !== "admin" && !req.user.isAdmin) {
      return res.status(403).json({ message: "Not authorized as admin" });
    }

    const request = await OrphanageRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    await request.deleteOne();
    res.json({ message: "Request deleted successfully" });
  } catch (error) {
    console.error("Error deleting request:", error);
    res.status(500).json({ message: error.message });
  }
});


export default router;