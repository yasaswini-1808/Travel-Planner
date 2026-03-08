// routes/itineraryRoutes.js - Itinerary management routes
import express from "express";
import Itinerary from "../models/Itinerary.js";
import { authenticateToken } from "../middleware/auth.js";
import { validateBody, itinerarySaveSchema } from "../middleware/validate.js";

const router = express.Router();

// Save new itinerary (PROTECTED - requires authentication)
router.post(
  "/save",
  authenticateToken,
  validateBody(itinerarySaveSchema),
  async (req, res) => {
    try {
      console.log("📝 Save itinerary request received");
      console.log("User ID from token:", req.user?.id);
      console.log("Request body keys:", Object.keys(req.body));

      const {
        source,
        destination,
        startDate,
        endDate,
        numberOfDays,
        budget,
        companion,
        accommodation,
        transport,
        activities,
        dietary,
        specialRequests,
        itineraryData,
        tripName,
      } = req.body;

      // Check if user is authenticated
      if (!req.user || !req.user.id) {
        console.error("❌ Authentication failed: User not found in request");
        return res.status(401).json({
          error: "Authentication required",
        });
      }

      if (!destination || !numberOfDays || !budget || !companion) {
        return res.status(400).json({
          error:
            "Destination, numberOfDays, budget, and companion are required",
        });
      }

      // Map UI values to enum values
      const budgetMap = {
        Budget: "low",
        Moderate: "medium",
        Luxury: "high",
        low: "low",
        medium: "medium",
        high: "high",
      };

      const companionMap = {
        Solo: "solo",
        Couple: "couple",
        "Family with Kids": "family",
        Friends: "friends",
        solo: "solo",
        couple: "couple",
        family: "family",
        friends: "friends",
      };

      const mappedBudget = budgetMap[budget] || budget;
      const mappedCompanion = companionMap[companion] || companion;

      const itinerary = new Itinerary({
        userId: req.user.id,
        source: source || null,
        destination,
        tripName: tripName || destination,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        numberOfDays,
        budget: mappedBudget,
        companion: mappedCompanion,
        accommodation: accommodation || null,
        transport: transport || null,
        activities: activities || [],
        dietary: dietary || [],
        specialRequests: specialRequests || null,
        itineraryData: itineraryData || null,
        status: "planned",
      });

      console.log("💾 Saving itinerary to database...");
      await itinerary.save();
      console.log("✅ Itinerary saved successfully with ID:", itinerary._id);

      res.status(201).json({
        message: "Itinerary saved successfully",
        itinerary,
      });
    } catch (error) {
      console.error("Error saving itinerary:", error.message);
      console.error("Error details:", error);
      res.status(500).json({
        error: "Failed to save itinerary",
        details: error.message,
      });
    }
  },
);

// Get all itineraries for logged-in user (PROTECTED)
router.get("/my-itineraries", authenticateToken, async (req, res) => {
  try {
    const itineraries = await Itinerary.find({ userId: req.user.id }).sort({
      createdAt: -1,
    });

    res.json({
      message: "Itineraries retrieved successfully",
      itineraries,
    });
  } catch (error) {
    console.error("Error fetching itineraries:", error);
    res.status(500).json({
      error: "Failed to fetch itineraries",
    });
  }
});

// Get single itinerary by ID (PROTECTED)
router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const itinerary = await Itinerary.findById(req.params.id);

    if (!itinerary) {
      return res.status(404).json({
        error: "Itinerary not found",
      });
    }

    // Verify ownership
    if (itinerary.userId.toString() !== req.user.id) {
      return res.status(403).json({
        error: "You do not have permission to view this itinerary",
      });
    }

    res.json({
      message: "Itinerary retrieved successfully",
      itinerary,
    });
  } catch (error) {
    console.error("Error fetching itinerary:", error);
    res.status(500).json({
      error: "Failed to fetch itinerary",
    });
  }
});

// Update itinerary (PROTECTED)
router.put(
  "/:id",
  authenticateToken,
  validateBody(itinerarySaveSchema.partial()),
  async (req, res) => {
    try {
      const itinerary = await Itinerary.findById(req.params.id);

      if (!itinerary) {
        return res.status(404).json({
          error: "Itinerary not found",
        });
      }

      // Verify ownership
      if (itinerary.userId.toString() !== req.user.id) {
        return res.status(403).json({
          error: "You do not have permission to update this itinerary",
        });
      }

      // Update fields
      const updatesAllowed = [
        "tripName",
        "source",
        "destination",
        "startDate",
        "endDate",
        "numberOfDays",
        "budget",
        "companion",
        "accommodation",
        "transport",
        "activities",
        "dietary",
        "specialRequests",
        "itineraryData",
        "estimatedCost",
        "notes",
        "status",
      ];

      updatesAllowed.forEach((field) => {
        if (req.body[field] !== undefined) {
          itinerary[field] = req.body[field];
        }
      });

      await itinerary.save();

      res.json({
        message: "Itinerary updated successfully",
        itinerary,
      });
    } catch (error) {
      console.error("Error updating itinerary:", error);
      res.status(500).json({
        error: "Failed to update itinerary",
      });
    }
  },
);

// Delete itinerary (PROTECTED)
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const itinerary = await Itinerary.findById(req.params.id);

    if (!itinerary) {
      return res.status(404).json({
        error: "Itinerary not found",
      });
    }

    // Verify ownership
    if (itinerary.userId.toString() !== req.user.id) {
      return res.status(403).json({
        error: "You do not have permission to delete this itinerary",
      });
    }

    await Itinerary.findByIdAndDelete(req.params.id);

    res.json({
      message: "Itinerary deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting itinerary:", error);
    res.status(500).json({
      error: "Failed to delete itinerary",
    });
  }
});

export default router;
