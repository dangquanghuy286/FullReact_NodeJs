import express from "express";
import {
  refreshToken,
  signIn,
  signOut,
  signUp,
  forgotSendOTP,
  forgotVerifyOTP,
  forgotResetPassword,
  changePassword,
} from "../controllers/auth.controller.js";
import { protectedRoute } from "../middlewares/auth.middleware.js";

const router = express.Router();

// ─── Auth ───────────────────────────────────
router.post("/signup", signUp);
router.post("/signin", signIn);
router.post("/signout", signOut);
router.get("/refresh", refreshToken);

// ─── Change Password ────────────────────────
router.post("/change-password", protectedRoute, changePassword); // ← 1 route duy nhất

// ─── Forgot Password ────────────────────────
router.post("/forgot-password/send-otp", forgotSendOTP);
router.post("/forgot-password/verify-otp", forgotVerifyOTP);
router.post("/forgot-password/reset-password", forgotResetPassword);

export default router;
