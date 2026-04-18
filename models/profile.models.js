import mongoose from "mongoose";
import { v7 as uuidv7 } from "uuid";

const profileSchema = new mongoose.Schema({
  id: {
    type: String,
    default: uuidv7,
  },

  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
    minlength: [2, "Name must be at least 2 characters"],
    maxlength: [50, "Name cannot exceed 50 characters"],
  },

  gender: {
    type: String,
    required: [true, "Gender is required"],
    enum: {
      values: ["male", "female"],
      message: "Gender must be either male or female",
    },
  },

  gender_probability: {
    type: Number,
    required: [true, "Gender probability is required"],
    min: [0, "Gender probability cannot be less than 0"],
    max: [1, "Gender probability cannot be greater than 1"],
  },

  sample_size: {
    type: Number,
    required: [true, "Sample size is required"],
    min: [0, "Sample size cannot be negative"],
  },

  age: {
    type: Number,
    required: [true, "Age is required"],
    min: [0, "Age cannot be negative"],
    max: [120, "Age seems unrealistic"],
  },

  age_group: {
    type: String,
    required: [true, "Age group is required"],
    enum: {
      values: ["child", "teenager", "adult", "senior"],
      message: "Invalid age group",
    },
  },

  country_id: {
    type: String,
    required: [true, "Country ID is required"],
    uppercase: true,
    minlength: [2, "Country ID must be 2 characters"],
    maxlength: [2, "Country ID must be 2 characters"],
  },

  country_probability: {
    type: Number,
    required: [true, "Country probability is required"],
    min: [0, "Country probability cannot be less than 0"],
    max: [1, "Country probability cannot be greater than 1"],
  },
},
{ timestamps: true });

// 1. Fast lookup by id (primary API access)
profileSchema.index({ id: 1 }, { unique: true });

// 2. Prevent duplicate names + fast search
profileSchema.index({ name: 1 });

// 3. Query optimization for filters (HNG-style endpoint)
profileSchema.index({
  country_id: 1,
  gender: 1,
  age_group: 1,
});


const Profile = mongoose.model("Profile", profileSchema);

export default Profile;
