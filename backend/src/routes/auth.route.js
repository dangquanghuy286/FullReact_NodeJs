import express from "express";
import {
  refreshToken,
  signIn,
  signOut,
  signUp,
  requestChangePassword,
  changePassword,
} from "../controllers/auth.controller.js";
import { protectedRoute } from "../middlewares/auth.middleware.js";
// Auth routes
const router = express.Router();

router.post("/signup", signUp);
router.post("/signin", signIn);
router.post("/signout", signOut);
router.get("/refresh", refreshToken);
router.post(
  "/change-password/request-otp",
  protectedRoute,
  requestChangePassword,
);
router.post("/change-password", protectedRoute, changePassword);
export default router;
