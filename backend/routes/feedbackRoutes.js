import express from "express";
import Feedback from "../models/Feedback.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const feedbackList = await Feedback.find()
      .sort({ createdAt: -1 })
      .select(
        "name email message rating categories reaction createdAt updatedAt",
      )
      .lean();

    return res.status(200).json({
      success: true,
      count: feedbackList.length,
      feedback: feedbackList,
    });
  } catch (error) {
    console.error("❌ Feedback fetch error:", error.message);
    return res.status(500).json({ error: "Failed to fetch feedback" });
  }
});

router.post("/", async (req, res) => {
  try {
    const {
      name,
      email,
      message,
      rating,
      categories = [],
      reaction = "",
    } = req.body || {};

    if (!name || !email || !message || !rating) {
      return res.status(400).json({
        error: "name, email, message, and rating are required",
      });
    }

    const feedback = await Feedback.create({
      name,
      email,
      message,
      rating,
      categories: Array.isArray(categories) ? categories : [],
      reaction,
    });

    return res.status(201).json({
      success: true,
      message: "Feedback submitted successfully",
      feedbackId: feedback._id,
      feedback: {
        _id: feedback._id,
        name: feedback.name,
        email: feedback.email,
        message: feedback.message,
        rating: feedback.rating,
        categories: feedback.categories,
        reaction: feedback.reaction,
        createdAt: feedback.createdAt,
      },
    });
  } catch (error) {
    if (error?.code === 11000 && error?.keyPattern?.email) {
      return res.status(409).json({
        error:
          "Feedback with this email already exists. Use a different email or update the existing feedback.",
      });
    }

    if (error.name === "ValidationError") {
      return res.status(400).json({
        error: Object.values(error.errors)
          .map((item) => item.message)
          .join(", "),
      });
    }

    console.error("❌ Feedback submission error:", error.message);
    return res.status(500).json({ error: "Failed to submit feedback" });
  }
});

export default router;
