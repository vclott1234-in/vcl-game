import express from "express";
import multer from "multer";
import Schedule from "../models/schedule.model.js";

const router = express.Router();

/* ================= MULTER ================= */
const storage = multer.memoryStorage();
const upload = multer({ storage });

/* ============================================================
   CREATE LOTTERY
   ============================================================ */
router.post("/create", upload.single("qrCode"), async (req, res) => {
  try {
    const { adminId, adminMobile, upiId, lotteryName, scheduleDate } = req.body;

    if (!adminId || !adminMobile || !upiId || !lotteryName || !scheduleDate) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    const schedule = await Schedule.create({
      adminId,
      adminMobile,
      upiId,
      lotteryName,
      scheduleDate: new Date(scheduleDate),
      winnerId: null,
      isDeclared: false,
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

/* ============================================================
   GET ALL LOTTERIES OF ADMIN
   ============================================================ */
router.get("/get-lottery", async (req, res) => {
  try {
    const { adminId } = req.query;

    if (!adminId) {
      return res.status(400).json({ message: "Admin ID required" });
    }

    const lottery = await Schedule.find({ adminId })
      .sort({ scheduleDate: -1 });

    res.status(200).json({ lottery });

  } catch (error) {
    res.status(500).json({
      message: "Error fetching lottery",
      error: error.message,
    });
  }
});

/* ============================================================
   UPDATE LOTTERY DETAILS (OWNER CHECK)
   ============================================================ */
router.put("/update", upload.single("qrCode"), async (req, res) => {
  try {
    const {
      scheduleId,
      adminId,
      lotteryName,
      upiId,
      adminMobile,
      scheduleDate,
    } = req.body;

    if (!scheduleId || !adminId) {
      return res.status(400).json({ message: "Schedule ID and Admin ID required" });
    }

    const schedule = await Schedule.findOne({
      _id: scheduleId,
      adminId,
    });

    if (!schedule) {
      return res.status(403).json({
        message: "Not authorized to update this lottery",
      });
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

/* ============================================================
   UPDATE SCHEDULE TIME (OWNER CHECK)
   ============================================================ */
router.put("/update-time", async (req, res) => {
  try {
    const { scheduleId, adminId, scheduleDate } = req.body;

    if (!scheduleId || !adminId || !scheduleDate) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const schedule = await Schedule.findOne({
      _id: scheduleId,
      adminId,
    });

    if (!schedule) {
      return res.status(403).json({ message: "Not authorized" });
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

/* ============================================================
   SELECT / CHANGE WINNER (OWNER CHECK)
   ============================================================ */
router.put("/select-winner", async (req, res) => {
  try {
    const { scheduleId, adminId, winnerId } = req.body;

    if (!scheduleId || !adminId || !winnerId) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const schedule = await Schedule.findOne({
      _id: scheduleId,
      adminId,
    });

    if (!schedule) {
      return res.status(403).json({ message: "Not authorized" });
    }

    schedule.winnerId = winnerId;
    schedule.isDeclared = true;

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

/* ============================================================
   GET RESULT OF SPECIFIC LOTTERY (OWNER CHECK)
   ============================================================ */
router.get("/result/:scheduleId", async (req, res) => {
  try {
    const { adminId } = req.query;

    if (!adminId) {
      return res.status(400).json({ message: "Admin ID required" });
    }

    const schedule = await Schedule.findOne({
      _id: req.params.scheduleId,
      adminId,
    }).populate("winnerId", "name mobile");

    if (!schedule) {
      return res.status(403).json({
        message: "Not authorized or schedule not found",
      });
    }

    if (!schedule.isDeclared) {
      return res.status(403).json({
        message: "Winner not declared yet",
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