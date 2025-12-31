import express from "express";
import authRoutes from "./auth.route.js";
import userRoutes from "./user.route.js";
import friendRoutes from "./friend.route.js";
import messageRoutes from "./message.route.js";
import conversationRoutes from "./conversation.route.js";
import { protectedRoute } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Public routes
router.use("/auth", authRoutes);
// Private routes
router.use("/user", protectedRoute, userRoutes);
// Friend rotes
router.use("/friend", protectedRoute, friendRoutes);
// Message routes
router.use("/messages", protectedRoute, messageRoutes);
// Conversation routes
router.use("/conversation", protectedRoute, conversationRoutes);
export default router;
