import express from "express";
import User from "../models/user.model.js";

const router = express.Router();

// ================= ADD USER =================
router.post("/add-user", async (req, res) => {
  try {
    const { name, mobile, password, town, address, createdBy } = req.body;

    if (!name || !mobile || !password) {
      return res.status(400).json({ message: "Required fields missing!" });
    }

    const doesExist = await User.findOne({ mobile });
    if (doesExist) {
      return res.status(400).json({ message: "Mobile already registered!" });
    }

    const tokenlen = await User.countDocuments({ createdBy: createdBy });

    const user = await User.create({
      name,
      mobile,
      password,
      town,
      address,
      createdBy: createdBy,
      token: tokenlen + 1,
    });

    res.status(201).json({ message: "User created successfully!", user });
  } catch (err) {
    console.error(err); // 👈 ADD THIS
    res.status(500).json({ message: "Error creating user" });
  }
});

// ================= LOGIN =================
router.post("/login", async (req, res) => {
  try {
    const { mobile, password } = req.body;

    if (!mobile || !password) {
      return res.status(400).json({ message: "Mobile and password required!" });
    }

    const user = await User.findOne({ mobile });

    if (!user) {
      return res.status(400).json({ message: "User not found!" });
    }

    if (user.password !== password) {
      return res.status(400).json({ message: "Invalid credentials!" });
    }

    res.status(200).json({ message: "Login successful!", user });
  } catch (err) {
    console.error("LOGIN ERROR:", err); // 👈 IMPORTANT
    res.status(500).json({ message: "Server error during login" });
  }
});

export default router;
