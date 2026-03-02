import express from "express";
import User from "../models/user.model.js";

const router = express.Router();

/**
 * Add a new user (Signup)
 * Body: { name, mobile, password, town, address }
 */
router.post("/add-user", async (req, res) => {
  try {
    const { name, mobile, password, town, address , adminId } = req.body;

    if (!name || !mobile || !password) {
      return res.status(400).json({ message: "Required fields missing!" });
    }

    const doesExist = await User.findOne({ mobile });
    if (doesExist) {
      return res.status(400).json({ message: "Mobile already registered!" });
    }

    const tokenlen = await User.find({createdBy: adminId});

    const user = await User.create({
      name,
      mobile,
      password,
      town,
      address,
      createdBy: adminId,
      token: tokenlen+1
    });

    res.status(201).json({ message: "User created successfully!", user });
  } catch (err) {
    res.status(500).json({ message: "Error creating user", error: err });
  }
});

/**
 * Login user (mobile + password)
 * Body: { mobile, password }
 */
router.post("/login", async (req, res) => {
  try {
    const { mobile, password } = req.body;

    const user = await User.findOne({ mobile });

    if (!user || user.password !== password) {
      return res.status(400).json({ message: "Invalid credentials!" });
    }

    res.status(200).json({ message: "Login successful!", user });
  } catch (err) {
    res.status(500).json({ message: "Error logging in", error: err });
  }
});

export default router;
