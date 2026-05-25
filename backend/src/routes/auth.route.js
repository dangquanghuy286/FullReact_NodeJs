import express from "express";

import {
  refreshToken,
  signIn,
  signOut,
  signUp,
  sendOTP,
  verifyOTP,
  resetPassword,
} from "../controllers/auth.controller.js";

import { protectedRoute } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Auth
router.post("/signup", signUp);
router.post("/signin", signIn);
router.post("/signout", signOut);
router.get("/refresh", refreshToken);

// Reset password
router.post("/send-otp", protectedRoute, sendOTP);

router.post("/verify-otp", protectedRoute, verifyOTP);

router.post("/reset-password", protectedRoute, resetPassword);

export default router;
