import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    github_id: {
      type: String,
      required: [true, "GitHub ID is required"],
      unique: true,
      trim: true,
    },

    username: {
      type: String,
      required: [true, "Username is required"],
      trim: true,
      minlength: [3, "Username must be at least 3 characters long"],
      maxlength: [30, "Username cannot exceed 30 characters"],
    },

    email: {
      type: String,
      required: [true, "Email address is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"],
    },

    avatar_url: {
      type: String,
      trim: true,
    },

    role: {
      type: String,
      enum: {
        values: ["analyst", "admin"],
        message: "Role must be either analyst or admin",
      },
      default: "analyst",
    },

    is_active: {
      type: Boolean,
      default: true,
    },

    last_login_at: {
      type: Date,
    },
    refresh_token: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

// Optional: cleaner JSON output
userSchema.set("toJSON", {
  transform: function (doc, ret) {
    delete ret.__v;
    return ret;
  },
});

const User = mongoose.model("User", userSchema);

export default User;
