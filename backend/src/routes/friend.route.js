import express from "express";

import {
  addFriend,
  acceptFriendRequest,
  declineFriendRequest,
  getAllFriends,
  getFriendRequest,
} from "../controllers/friend.controller.js";

const router = express.Router();
router.post("/requests", addFriend);
router.post("/requests/:requestId/accept", acceptFriendRequest);
router.post("/requests/:requestId/decline", declineFriendRequest);

router.get("/", getAllFriends);
router.get("/requests", getFriendRequest);

export default router;
