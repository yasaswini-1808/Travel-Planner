// routes/authRoutes.js - Authentication routes with MongoDB
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "../models/User.js";
import Session from "../models/Session.js";
import { authenticateToken } from "../middleware/auth.js";
import { JWT_SECRET, JWT_EXPIRES_IN } from "../config.js";
import {
  loginLimiter,
  registerLimiter,
  forgotPasswordLimiter,
  resetPasswordLimiter,
} from "../middleware/rateLimit.js";
import {
  validateBody,
  authRegisterSchema,
  authLoginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "../middleware/validate.js";
import {
  sendPasswordResetEmail,
  sendLoginNotificationEmail,
  sendWelcomeRegistrationEmail,
} from "../services/emailService.js";

const router = express.Router();

// Register new user
router.post(
  "/register",
  registerLimiter,
  validateBody(authRegisterSchema),
  async (req, res) => {
    try {
      const { username, email, password, fullName } = req.body;
      const normalizedUsername = username?.trim();
      const normalizedEmail = email?.trim().toLowerCase();

      // Validation
      if (!normalizedUsername || !normalizedEmail || !password) {
        return res.status(400).json({
          error: "Username, email, and password are required",
        });
      }

      if (password.length < 6) {
        return res.status(400).json({
          error: "Password must be at least 6 characters long",
        });
      }

      // Check if user already exists
      const existingUser = await User.findOne({
        $or: [{ email: normalizedEmail }, { username: normalizedUsername }],
      });

      if (existingUser) {
        return res.status(400).json({
          error:
            existingUser.email === normalizedEmail
              ? "Email already registered"
              : "Username already taken",
        });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      const user = new User({
        username: normalizedUsername,
        email: normalizedEmail,
        password: hashedPassword,
        fullName: fullName || null,
        role: "user",
      });

      await user.save();

      // Create JWT token with role
      const token = jwt.sign(
        {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN },
      );

      // Save session
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7); // 7 days from now

      const session = new Session({
        userId: user._id,
        token,
        expiresAt,
      });

      await session.save();

      // Send registration email (non-blocking)
      sendWelcomeRegistrationEmail({
        to: user.email,
        username: user.username,
      }).catch((err) =>
        console.error("Registration welcome email failed:", err),
      );

      res.status(201).json({
        message: "Registration successful",
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          fullName: user.fullName,
          role: user.role,
        },
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({
        error: "Registration failed. Please try again.",
      });
    }
  },
);

// Login user
router.post(
  "/login",
  loginLimiter,
  validateBody(authLoginSchema),
  async (req, res) => {
    try {
      const { email, password } = req.body;
      const normalizedEmail = email?.trim().toLowerCase();

      // Validation
      if (!normalizedEmail || !password) {
        return res.status(400).json({
          error: "Email and password are required",
        });
      }

      // Find user
      const user = await User.findOne({ email: normalizedEmail }).select(
        "+password",
      );

      if (!user) {
        return res.status(401).json({
          error: "Invalid email or password",
        });
      }

      if (!user.password || typeof user.password !== "string") {
        return res.status(401).json({
          error: "Invalid email or password",
        });
      }

      // Verify password
      let validPassword = false;
      try {
        validPassword = await bcrypt.compare(password, user.password);
      } catch {
        validPassword = false;
      }

      if (!validPassword) {
        return res.status(401).json({
          error: "Invalid email or password",
        });
      }

      // Update last login without triggering full document validation
      await User.updateOne(
        { _id: user._id },
        { $set: { lastLogin: new Date() } },
      );

      // Create JWT token with role
      const token = jwt.sign(
        {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN },
      );

      // Save session
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);

      const session = new Session({
        userId: user._id,
        token,
        expiresAt,
      });

      await session.save();

      // Send login notification email (non-blocking)
      const clientIp =
        req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
        req.socket?.remoteAddress ||
        "Unknown";
      sendLoginNotificationEmail({
        to: user.email,
        username: user.username,
        loginTime: new Date(),
        ipAddress: clientIp,
      }).catch((err) => console.error("Login notification email failed:", err));

      res.json({
        message: "Login successful",
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          fullName: user.fullName,
          role: user.role,
        },
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({
        error: "Login failed. Please try again.",
      });
    }
  },
);

// Forgot password - send reset link/token (dev-safe response)
router.post(
  "/forgot-password",
  forgotPasswordLimiter,
  validateBody(forgotPasswordSchema),
  async (req, res) => {
    try {
      const normalizedEmail = req.body.email?.trim().toLowerCase();
      const user = await User.findOne({ email: normalizedEmail }).select(
        "+resetPasswordToken +resetPasswordExpires",
      );

      if (user) {
        const resetToken = crypto.randomBytes(32).toString("hex");
        const hashedToken = crypto
          .createHash("sha256")
          .update(resetToken)
          .digest("hex");

        const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

        await User.updateOne(
          { _id: user._id },
          {
            $set: {
              resetPasswordToken: hashedToken,
              resetPasswordExpires: expiresAt,
            },
          },
        );

        const frontendUrl =
          process.env.FRONTEND_URL?.trim() || "http://localhost:5173";
        const resetUrl = `${frontendUrl}/reset-password?token=${resetToken}`;

        try {
          await sendPasswordResetEmail({
            to: normalizedEmail,
            resetUrl,
          });
        } catch (mailError) {
          await User.updateOne(
            { _id: user._id },
            {
              $unset: {
                resetPasswordToken: "",
                resetPasswordExpires: "",
              },
            },
          );

          console.error("Forgot password mail error:", mailError.message);

          if (
            process.env.NODE_ENV !== "production" &&
            mailError.message === "SMTP is not configured"
          ) {
            return res.status(500).json({
              error:
                "SMTP is not configured. Set SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASS, SMTP_FROM, and FRONTEND_URL in backend/.env",
            });
          }

          return res.status(500).json({
            error:
              "Unable to send reset email right now. Please try again later.",
          });
        }
      }

      return res.json({
        message:
          "If an account with that email exists, a password reset link has been sent.",
      });
    } catch (error) {
      console.error("Forgot password error:", error);
      return res.status(500).json({
        error: "Failed to process forgot password request",
      });
    }
  },
);

// Reset password using reset token
router.post(
  "/reset-password",
  resetPasswordLimiter,
  validateBody(resetPasswordSchema),
  async (req, res) => {
    try {
      const { token, password } = req.body;
      const hashedToken = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");

      const user = await User.findOne({
        resetPasswordToken: hashedToken,
        resetPasswordExpires: { $gt: new Date() },
      }).select("+resetPasswordToken +resetPasswordExpires");

      if (!user) {
        return res.status(400).json({
          error: "Reset token is invalid or has expired",
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      await User.updateOne(
        { _id: user._id },
        {
          $set: {
            password: hashedPassword,
            passwordChangedAt: new Date(),
          },
          $unset: {
            resetPasswordToken: "",
            resetPasswordExpires: "",
          },
        },
      );

      await Session.deleteMany({ userId: user._id });

      return res.json({
        message:
          "Password reset successful. Please login with your new password.",
      });
    } catch (error) {
      console.error("Reset password error:", error);
      return res.status(500).json({
        error: "Failed to reset password",
      });
    }
  },
);

// Get current user (protected route)
router.get("/me", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ user });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ error: "Failed to fetch user data" });
  }
});

// Verify token (check if token is valid)
router.get("/verify", authenticateToken, (req, res) => {
  res.json({
    valid: true,
    user: {
      id: req.user.id,
      username: req.user.username,
      email: req.user.email,
    },
  });
});

// Logout (optional - mainly for frontend to clear token)
router.post("/logout", authenticateToken, async (req, res) => {
  try {
    // Remove session from database
    await Session.deleteMany({ userId: req.user.id });
    res.json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    res.json({ message: "Logged out successfully" }); // Still return success
  }
});

// Get all users (ADMIN ONLY)
router.get("/users", authenticateToken, async (req, res) => {
  try {
    // Check if user is admin
    const adminUser = await User.findById(req.user.id);

    if (!adminUser || adminUser.role !== "admin") {
      return res.status(403).json({
        error: "Access denied. Admin privileges required.",
        requiresAdmin: true,
      });
    }

    const users = await User.find().select("-password").sort({ createdAt: -1 });

    res.json({
      total: users.length,
      users: users.map((user) => ({
        id: user._id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt,
      })),
    });
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

export default router;
