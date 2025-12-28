import mongoose from "mongoose";

const scheduleSchema = new mongoose.Schema(
  {
    adminMobile: {
      type: String,
      required: true,
    },
    upiId: {
      type: String,
      required: true,
    },
    qrCode: {
      data: Buffer, // store image as binary
      contentType: String, // store mime type like image/png
    },
    lotteryName: {
      type: String,
      required: true,
    },
    scheduleDate: {
      type: Date, // when winner is announced
      required: true,
    },
    winnerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // winner is a user
      default: null,
    },
    isDeclared: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Schedule = mongoose.model("Schedule", scheduleSchema);

export default Schedule;
