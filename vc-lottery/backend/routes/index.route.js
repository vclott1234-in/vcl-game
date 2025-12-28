import express from "express";
import authRoutes from "./auth.route.js";
import userRoutes from "./user.route.js";
import scheduleRoutes from "./schedule.route.js";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/user", userRoutes);
router.use("/schedule", scheduleRoutes);

export default router;
