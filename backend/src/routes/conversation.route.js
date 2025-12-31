import express from "express";
import { checkFriendShip } from "../middlewares/friend.middleware.js";
import {
  createConversation,
  getAllConversations,
  getMessages,
} from "../controllers/conversation.controller.js";
const router = express.Router();

router.post("/", checkFriendShip, createConversation);
router.get("/", getAllConversations);
router.get("/:conversationId/messages", getMessages);
export default router;
