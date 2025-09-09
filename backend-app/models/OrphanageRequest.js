// models/OrphanageRequest.js
import mongoose from "mongoose";

const orphanageRequestSchema = new mongoose.Schema(
  {
    orphanage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        donation: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Donation",
          required: true,
        },
        requestedQuantity: {
          type: Number,
          required: true,
          min: 1,
        },
        title: String,
        category: String,
        size: String,
        gender: String,
        condition: String,
        imageUrl: String,
      },
    ],
    totalQuantity: {
      type: Number,
      required: true,
      min: 5, // Minimum 5 pieces required
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "fulfilled"],
      default: "pending",
    },
    notes: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const OrphanageRequest = mongoose.model("OrphanageRequest", orphanageRequestSchema);
export default OrphanageRequest;