// models/Donation.js 
import mongoose from "mongoose";

const donationSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    category: { type: String, required: true },
    size: { type: String },
    condition: { type: String },
    quantity: { type: Number, required: true },
    description: { type: String },
    imageUrl: { type: String },
    gender: { type: String },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const Donation = mongoose.model("Donation", donationSchema);
export default Donation;