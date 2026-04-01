import express from "express";
import { checkFriendShip } from "../middlewares/friend.middleware.js";
import {
  createConversation,
  getAllConversations,
  getMessages,
  markAsSeen,
} from "../controllers/conversation.controller.js";
// Conversation routes
const router = express.Router();

router.post("/", checkFriendShip, createConversation);
router.get("/", getAllConversations);
router.get("/:conversationId/messages", getMessages);
router.patch("/:conversationId/seen", markAsSeen);
export default router;
