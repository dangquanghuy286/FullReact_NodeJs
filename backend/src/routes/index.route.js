import express from "express";
import authRoutes from "./auth.route.js";
import userRoutes from "./user.route.js";
import { protectedRoute } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Public routes
router.use("/auth", authRoutes);
// Private routes
router.use("/user", protectedRoute, userRoutes);
export default router;
