// models/Itinerary.js - MongoDB Itinerary Schema
import mongoose from "mongoose";

const itinerarySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    destination: {
      type: String,
      required: true,
      trim: true,
    },
    source: {
      type: String,
      trim: true,
    },
    tripName: {
      type: String,
      trim: true,
      maxlength: 100,
    },
    startDate: {
      type: Date,
      default: null,
    },
    endDate: {
      type: Date,
      default: null,
    },
    numberOfDays: {
      type: Number,
      required: true,
    },
    budget: {
      type: String,
      enum: ["low", "medium", "high"],
      required: true,
    },
    companion: {
      type: String,
      required: true,
      enum: ["family", "friends", "couple", "solo"],
    },
    accommodation: {
      type: String,
      trim: true,
    },
    transport: {
      type: String,
      trim: true,
    },
    activities: {
      type: [String],
      default: [],
    },
    dietary: {
      type: [String],
      default: [],
    },
    specialRequests: {
      type: String,
      trim: true,
    },
    itineraryData: {
      type: mongoose.Schema.Types.Mixed, // Stores the full day-by-day itinerary (JSON)
      default: null,
    },
    estimatedCost: {
      type: String,
      trim: true,
    },
    notes: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["draft", "planned", "completed"],
      default: "draft",
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  },
);

const Itinerary = mongoose.model("Itinerary", itinerarySchema);

export default Itinerary;
