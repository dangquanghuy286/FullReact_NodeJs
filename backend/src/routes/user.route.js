import express from "express";
import {
  getProfile,
  searchUserByUsername,
  updateProfile,
  uploadAvatar,
} from "../controllers/user.controller.js";

import { upload } from "../middlewares/upload.middleware.js";

const router = express.Router();

router.get("/profile", getProfile);
router.get("/search", searchUserByUsername);
router.post("/uploadAvatar", upload.single("file"), uploadAvatar);
router.patch("/updateProfile", updateProfile);
export default router;
