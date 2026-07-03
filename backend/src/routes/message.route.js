import express from "express";
import {
  sendDirectMessage,
  sendGroupMessage,
} from "../controllers/message.controller.js";
import {
  checkFriendShip,
  checkGroup,
} from "../middlewares/friend.middleware.js";
import { upload } from "../libs/cloudinary.js";

const router = express.Router();

// upload.array("images", 10): field "images" trong form-data, tối đa 10 ảnh
router.post(
  "/direct",
  upload.array("images", 10),
  checkFriendShip,
  sendDirectMessage,
);
router.post("/group", upload.array("images", 10), checkGroup, sendGroupMessage);

export default router;
