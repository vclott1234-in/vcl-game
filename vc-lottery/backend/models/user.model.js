import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    mobile: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    town: {
      type: String,
      default: "",
    },
    address: {
      type: String,
      default: "",
    },
    token: {
      type: String,
      default: "",
    },
    imageUrl: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    createdBy: {
      type: String,
      required: [true , "Admin ID is required."]
    }
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
