import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import routes from "./routes/index.route.js";

const server = express();

// ================= MIDDLEWARE =================
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(cors());

// ================= MONGODB CONNECTION =================

// 🔥 Hardcoded connection string (as you requested)
const MONGO_URI =
  "mongodb+srv://vc_lottery:3yfJufDlQnrbkTtT@cluster0.uag6iaz.mongodb.net/vclottery";

let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;

  try {
    const db = await mongoose.connect(MONGO_URI, {
      bufferCommands: false,
    });

    isConnected = db.connections[0].readyState === 1;
    console.log("Connected to DB successfully!");
  } catch (err) {
    console.error("DB ERROR:", err);
    throw err;
  }
};

// 🔥 Ensure DB connects before every request (Vercel safe)
server.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    res.status(500).json({ message: "Database connection failed" });
  }
});

// ================= ROUTES =================
server.use("/api", routes);

// ❌ DO NOT USE server.listen()
// ✅ Required for Vercel
export default server;
