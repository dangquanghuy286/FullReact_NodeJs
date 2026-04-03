import express from "express";
import {
  getProfile,
  searchUserByUsername,
} from "../controllers/user.controller.js";
// User routes
const router = express.Router();

router.get("/profile", getProfile);
router.get("/search", searchUserByUsername);

export default router;
