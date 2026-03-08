// middleware/auth.js - Authentication middleware
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config.js";

export const authenticateToken = (req, res, next) => {
  // Get token from header
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

  if (!token) {
    console.error("❌ No token provided");
    return res.status(401).json({
      error: "Access denied. No token provided.",
      requiresAuth: true,
    });
  }

  try {
    // Verify token
    const verified = jwt.verify(token, JWT_SECRET);
    req.user = verified; // Add user info to request
    console.log("✅ Token verified for user:", verified.id);
    next();
  } catch (error) {
    console.error("❌ Token verification failed:", error.message);
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        error: "Token expired. Please login again.",
        requiresAuth: true,
      });
    }
    return res.status(403).json({
      error: "Invalid token.",
      requiresAuth: true,
      details: error.message,
    });
  }
};

// Check if user is admin
export const requireAdmin = async (req, res, next) => {
  try {
    // First authenticate the token
    if (!req.user) {
      return res.status(401).json({
        error: "Authentication required",
        requiresAuth: true,
      });
    }

    // Import User model dynamically to avoid circular dependency
    const { default: User } = await import("../models/User.js");

    // Get user from database to check role
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    if (user.role !== "admin") {
      return res.status(403).json({
        error: "Access denied. Admin privileges required.",
        requiresAdmin: true,
      });
    }

    next();
  } catch (error) {
    console.error("❌ Admin check failed:", error.message);
    return res.status(500).json({
      error: "Authorization check failed",
    });
  }
};

export const optionalAuth = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token) {
    try {
      const verified = jwt.verify(token, JWT_SECRET);
      req.user = verified;
    } catch (error) {
      // Token exists but invalid/expired - continue without user
      req.user = null;
    }
  }

  next();
};
