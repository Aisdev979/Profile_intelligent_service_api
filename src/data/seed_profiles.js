import mongoose from "mongoose";
import Profile from "../models/profile.models.js";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB connected");
  } catch (error) {
    console.error("❌ DB connection error:", error.message);
    process.exit(1);
  }
};

const { profiles } = JSON.parse(
  fs.readFileSync("./data/seed_profiles.json", "utf-8")
);

console.log(`📦 Loaded ${profiles.length} profiles from JSON`);

/**
 * Seed profiles into DB
 * - Uses ordered:false to skip duplicates (requires unique index in schema)
 */

const seedProfiles = async () => {
  try {
    await connectDB();
    await Profile.insertMany(profiles, { ordered: false });

    process.exit(0);
  } catch (error) {
    if (error.code === 11000) {
      console.warn("⚠️  Duplicate entries detected and skipped");
    } else {
      console.error("❌ Seeding error:", error.message);
    }
    process.exit(1);
  }
};

const deleteProfiles = async () => {
  try {
    await connectDB();

    const result = await Profile.deleteMany({});
    console.log(`🗑️ ${result.deletedCount} profiles deleted`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Delete error:", error.message);
    process.exit(1);
  }
};

/* CLI command handling */
const command = process.argv[2];

if (command === "-delete") {
  deleteProfiles();
} else if (command === "-seedProfiles") {
  seedProfiles();
} else {
  console.log(`
Usage:
  node seed.js -seedProfiles   → Seed database
  node seed.js -delete         → Delete all profiles
  `);
}
 