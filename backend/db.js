// db.js - MongoDB connection
import mongoose from "mongoose";
import dotenv from "dotenv";
import dns from "node:dns";

dotenv.config();

// Atlas TLS can fail on some IPv6/NAT64 networks; prefer IPv4 when possible.
try {
  dns.setDefaultResultOrder("ipv4first");
} catch {
  // No-op for older runtimes.
}

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/travel-planner";

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      family: 4,
      serverSelectionTimeoutMS: 10000, // 10 seconds timeout
      connectTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      retryWrites: true,
      maxPoolSize: 10,
    });
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    console.log("⚠️ Retrying connection...");
    setTimeout(connectDB, 5000); // Retry after 5 seconds
  }
};

// Handle connection events
mongoose.connection.on("disconnected", () => {
  console.log("⚠️ MongoDB disconnected");
});

mongoose.connection.on("error", (err) => {
  console.error("❌ MongoDB error:", err);
});

connectDB();

export default mongoose;
