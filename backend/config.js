// config.js - Centralized configuration
import dotenv from "dotenv";

// Load environment variables early
dotenv.config();

// Ensure JWT_SECRET is loaded
const JWT_SECRET =
  process.env.JWT_SECRET ||
  "your_super_secret_jwt_key_change_this_in_production_12345";

const JWT_EXPIRES_IN = "7d";

console.log("🔐 JWT_SECRET loaded:", JWT_SECRET.substring(0, 20) + "...");

export { JWT_SECRET, JWT_EXPIRES_IN };
