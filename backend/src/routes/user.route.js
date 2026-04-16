import express from "express";
import {
  getProfile,
  searchUserByUsername,
  uploadAvatar,
} from "../controllers/user.controller.js";

import { upload } from "../middlewares/upload.middleware.js";
// User routes
const router = express.Router();

router.get("/profile", getProfile);
router.get("/search", searchUserByUsername);
router.post("/uploadAvatar", upload.single("file", uploadAvatar));

export default router;
