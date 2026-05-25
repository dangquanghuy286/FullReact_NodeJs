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

  verified: {
    type: Boolean,
    default: false,
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
