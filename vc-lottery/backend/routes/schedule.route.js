import express from "express";
import multer from "multer";
import Schedule from "../models/schedule.model.js";

const router = express.Router();

/* ================= MULTER ================= */
const storage = multer.memoryStorage();
const upload = multer({ storage });

/* ================= GET ALL LOTTERIES ================= */
router.get("/get-lottery", async (req, res) => {
  try {
    const lottery = await Schedule.find().sort({ scheduleDate: -1 });
    res.status(200).json({ lottery });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching lottery schedule",
      error: error.message,
    });
  }
});

/* ================= CREATE SCHEDULE ================= */
router.post("/create", upload.single("qrCode"), async (req, res) => {
  try {
    const { adminMobile, upiId, lotteryName, scheduleDate } = req.body;

    if (!adminMobile || !upiId || !lotteryName || !scheduleDate) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    const schedule = await Schedule.create({
      adminMobile,
      upiId,
      lotteryName,
      scheduleDate: new Date(scheduleDate),
      winnerId: null,
      qrCode: req.file
        ? {
            data: req.file.buffer,
            contentType: req.file.mimetype,
          }
        : null,
    });

    res.status(201).json({
      message: "Schedule created successfully",
      scheduleId: schedule._id,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating schedule",
      error: error.message,
    });
  }
});

/* ================= UPDATE SCHEDULE TIME (NEW) ================= */
router.put("/update-time", async (req, res) => {
  try {
    const { scheduleId, scheduleDate } = req.body;

    if (!scheduleId || !scheduleDate) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const schedule = await Schedule.findById(scheduleId);
    if (!schedule) {
      return res.status(404).json({ message: "Schedule not found" });
    }

    schedule.scheduleDate = new Date(scheduleDate);
    await schedule.save();

    res.status(200).json({
      message: "Schedule time updated successfully",
      schedule,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating schedule time",
      error: error.message,
    });
  }
});

/* ================= SELECT / CHANGE WINNER ================= */
router.put("/select-winner", async (req, res) => {
  try {
    const { scheduleId, winnerId } = req.body;

    if (!scheduleId || !winnerId) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const schedule = await Schedule.findById(scheduleId);
    if (!schedule) {
      return res.status(404).json({ message: "Schedule not found" });
    }

    // ✅ ADMIN OVERRIDE — ALWAYS ALLOWED
    schedule.winnerId = winnerId;
    await schedule.save();

    res.status(200).json({
      message: "Winner updated successfully",
      winnerId,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error selecting winner",
      error: error.message,
    });
  }
});

/* ================= UPDATE LOTTERY DETAILS ================= */
router.put("/update", upload.single("qrCode"), async (req, res) => {
  try {
    const { scheduleId, lotteryName, upiId, adminMobile, scheduleDate } =
      req.body;

    if (!scheduleId) {
      return res.status(400).json({ message: "Schedule ID required" });
    }

    const schedule = await Schedule.findById(scheduleId);
    if (!schedule) {
      return res.status(404).json({ message: "Schedule not found" });
    }

    if (lotteryName) schedule.lotteryName = lotteryName;
    if (upiId) schedule.upiId = upiId;
    if (adminMobile) schedule.adminMobile = adminMobile;
    if (scheduleDate) schedule.scheduleDate = new Date(scheduleDate);

    if (req.file) {
      schedule.qrCode = {
        data: req.file.buffer,
        contentType: req.file.mimetype,
      };
    }

    await schedule.save();

    res.status(200).json({
      message: "Lottery updated successfully",
      schedule,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating lottery",
      error: error.message,
    });
  }
});

/* ================= GET RESULT ================= */
/* ================= GET RESULT ================= */
router.get("/result", async (req, res) => {
  try {
    const schedule = await Schedule.findOne()
      .sort({ scheduleDate: -1 })
      .populate("winnerId", "name mobile");

    if (!schedule) {
      return res.status(404).json({ message: "No schedule found" });
    }

    const now = new Date();
    const scheduleTime = new Date(schedule.scheduleDate);

    // ✅ Only reveal winner if scheduled time has passed
    if (scheduleTime > now) {
      return res.status(403).json({
        message: "Winner not declared yet. Please check after scheduled time.",
      });
    }

    res.status(200).json({
      scheduleId: schedule._id,
      lotteryName: schedule.lotteryName,
      scheduleDate: schedule.scheduleDate,
      adminMobile: schedule.adminMobile,
      upiId: schedule.upiId,
      winner: schedule.winnerId || null,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching result",
      error: error.message,
    });
  }
});

export default router;
