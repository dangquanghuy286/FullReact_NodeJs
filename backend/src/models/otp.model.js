import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  otp: {
    type: String,
    required: true,
  },

  // Phân biệt OTP dùng cho mục đích gì, tránh ghi đè nhầm giữa các flow
  purpose: {
    type: String,
    enum: ["forgot-password", "recover-account"],
    required: true,
  },

  verified: {
    type: Boolean,
    default: false,
  },

  // Số lần nhập sai OTP, dùng để chặn brute-force
  attempts: {
    type: Number,
    default: 0,
  },

  expiresAt: {
    type: Date,
    required: true,
  },
});

// TTL index
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const OTP = mongoose.model("OTP", otpSchema, "otp");

export default OTP;
