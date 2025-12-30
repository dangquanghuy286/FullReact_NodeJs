import Friend from "../models/friend.model.js";

export const checkFriendShip = async (req, res, next) => {
  const pair = (a, b) => (a < b ? [a, b] : [b, a]);
  try {
    const me = req.user._id.toString();
    const recipientId = req.body?.recipientId ?? null;

    if (recipientId) {
      const [userA, userB] = pair(me, recipientId);

      const isFriend = await Friend.findOne({
        userA,
        userB,
      });
      if (!isFriend) {
        return res.status(403).json({
          message: "Bạn chưa kết bạn với người này!",
        });
      }
      return next();
    }

    if (!recipientId) {
      return res.status(400).json({
        message: "Thiếu recipientId!",
      });
    }
  } catch (error) {
    console.error("Lỗi !", error);
    return res.status(500).json({
      message: "Lỗi hệ thống!",
    });
  }
};
