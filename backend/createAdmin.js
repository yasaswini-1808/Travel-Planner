// Script to create an admin user or promote existing user to admin
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "./models/User.js";
import { MONGODB_URI } from "./config.js";

async function createAdmin() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    // Option 1: Create a new admin user
    const adminData = {
      username: "admin",
      email: "admin@travelplanner.com",
      password: await bcrypt.hash("admin123", 10),
      fullName: "System Administrator",
      role: "admin",
    };

    // Check if admin already exists
    const existingAdmin = await User.findOne({
      $or: [{ email: adminData.email }, { username: adminData.username }],
    });

    if (existingAdmin) {
      console.log("⚠️  Admin user already exists. Updating to admin role...");
      existingAdmin.role = "admin";
      await existingAdmin.save();
      console.log("✅ User promoted to admin successfully!");
      console.log(`   Username: ${existingAdmin.username}`);
      console.log(`   Email: ${existingAdmin.email}`);
    } else {
      const admin = new User(adminData);
      await admin.save();
      console.log("✅ Admin user created successfully!");
      console.log(`   Username: ${adminData.username}`);
      console.log(`   Email: ${adminData.email}`);
      console.log(`   Password: admin123`);
      console.log("\n⚠️  Please change the password after first login!");
    }

    // Option 2: Promote an existing user by email (uncomment to use)
    // const userEmail = "your-email@example.com";
    // const user = await User.findOne({ email: userEmail });
    // if (user) {
    //   user.role = "admin";
    //   await user.save();
    //   console.log(`✅ User ${user.username} promoted to admin!`);
    // } else {
    //   console.log("❌ User not found");
    // }

    mongoose.connection.close();
  } catch (error) {
    console.error("❌ Error:", error.message);
    mongoose.connection.close();
  }
}

createAdmin();
