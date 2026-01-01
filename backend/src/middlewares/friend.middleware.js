import Friend from "../models/friend.model.js";
import Conversation from "../models/conversation.model.js";

export const checkFriendShip = async (req, res, next) => {
  const pair = (a, b) => (a < b ? [a, b] : [b, a]);

  try {
    const me = req.user._id.toString();
    let recipientId = req.body?.recipientId ?? null;
    const memberIds = req.body?.memberIds ?? [];
    const type = req.body?.type;

    // Nếu là direct và không có recipientId, lấy từ memberIds[0]
    if (type === "direct" && !recipientId && memberIds.length > 0) {
      recipientId = memberIds[0];
    }

    // Kiểm tra tin nhắn trực tiếp (direct)
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

    // Kiểm tra nhóm (group)
    if (type === "group") {
      if (memberIds.length === 0) {
        return res.status(400).json({
          message: "Thiếu danh sách thành viên!",
        });
      }

      const friendCheck = memberIds.map(async (memberId) => {
        const [userA, userB] = pair(me, memberId);
        const friend = await Friend.findOne({
          userA,
          userB,
        });
        return friend ? null : memberId;
      });

      const results = await Promise.all(friendCheck);
      const notFriends = results.filter(Boolean);

      if (notFriends.length > 0) {
        return res.status(403).json({
          message: "Bạn chỉ được thêm bạn bè vào nhóm!",
          notFriends,
        });
      }

      return next();
    }

    // Nếu không phải direct hoặc group
    return res.status(400).json({
      message: "Thiếu thông tin recipientId hoặc memberIds!",
    });
  } catch (error) {
    console.error("Lỗi!", error);
    return res.status(500).json({
      message: "Lỗi hệ thống!",
    });
  }
};
export const checkGroup = async (req, res, next) => {
  try {
    const { conversationId } = req.body;
    const userId = req.user._id;

    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      return res.status(404).json({
        message: "Không tìm thấy cuộc trò chuyện!",
      });
    }

    // Kiểm tra loại conversation
    if (conversation.type !== "group") {
      return res.status(400).json({
        message: "Cuộc trò chuyện này không phải là nhóm!",
      });
    }

    const isMember = conversation.participants.some(
      (p) => p.userId.toString() === userId.toString()
    );

    if (!isMember) {
      return res.status(403).json({
        message: "Bạn không ở trong nhóm này!",
      });
    }

    req.conversation = conversation;
    return next();
  } catch (error) {
    console.error("Lỗi khi kiểm tra nhóm!", error);
    return res.status(500).json({
      message: "Lỗi hệ thống!",
    });
  }
};
