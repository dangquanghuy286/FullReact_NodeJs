import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
export const createConversation = async (req, res) => {
  try {
    const { type, name, memberIds } = req.body;
    const userId = req.user._id;

    if (
      !type ||
      (type === "group" && !name) ||
      !memberIds ||
      !Array.isArray(memberIds) ||
      memberIds.length === 0
    ) {
      return res.status(400).json({
        message: "Tên nhóm và danh sách thành viên là bắt buộc !",
      });
    }
    let conversation;

    if (type === "direct") {
      const participantId = memberIds[0];

      conversation = await Conversation.findOne({
        type: "direct",
        "participants.userId": {
          $all: [userId, participantId],
        },
      });

      if (!conversation) {
        conversation = new Conversation({
          type: "direct",
          participants: [
            {
              userId,
            },
            {
              userId: participantId,
            },
          ],
          lastMessageAt: new Date(),
        });
        await conversation.save();
      }
    }

    if (type === "group") {
      conversation = new Conversation({
        type: "group",
        participants: [
          { userId },
          ...memberIds.map((id) => ({
            userId: id,
          })),
        ],
        group: {
          name,
          createdBy: userId,
        },
        lastMessageAt: new Date(),
      });
      await conversation.save();
    }

    if (!conversation) {
      return res.status(400).json({
        message: "Conversation type không hợp lệ!",
      });
    }

    await conversation.populate([
      {
        path: "participants.userId",
        select: "displayName avatarUrl",
      },
      {
        path: "seenBy",
        select: "displayName avatarUrl",
      },
      {
        path: "lastMessage.senderId",
        select: "displayName avatarUrl",
      },
    ]);

    return res.status(201).json({
      conversation,
    });
  } catch (error) {
    console.error("Lỗi khi tạo hội thoại!", error);
    return res.status(500).json({
      message: "Lỗi hệ thống!",
    });
  }
};
export const getAllConversations = async (req, res) => {
  try {
    const userId = req.user._id;
    const conversation = await Conversation.find({
      "participants.userId": userId,
    })
      .sort({
        lastMessageAt: -1,
        updatedAt: -1,
      })
      .populate({
        path: "participants.userId",
        select: "displayName avatarUrl",
      })
      .populate({
        path: "lastMessage.senderId",
        select: "displayName avatarUrl",
      })
      .populate({
        path: "seenBy",
        select: "displayName avatarUrl",
      });

    const formatted = conversation.map((hoi) => {
      const participants = (hoi.participants || []).map((p) => ({
        _id: p.userId?._id,
        displayName: p.userId?.displayName,
        avatarUrl: p.userId?.avatarUrl ?? null,
        joinedAt: p.joinedAt,
      }));

      return {
        ...hoi.toObject(),
        unreadCounts: hoi.unreadCounts || {},
        participants,
      };
    });

    return res.status(200).json({
      conversation: formatted,
    });
  } catch (error) {
    console.error("Lỗi khi lấy conversation!", error);
    return res.status(500).json({
      message: "Lỗi hệ thống!",
    });
  }
};
export const getMessages = async (req, res) => {
  try {
    // 1. Lấy conversationId từ URL
    const { conversationId } = req.params;

    // 2. Lấy limit và cursor từ query
    const { limit = 50, cursor } = req.query;

    // 3. Tạo điều kiện query theo conversationId
    const query = { conversationId };

    // 4. Nếu có cursor thì lấy tin nhắn cũ hơn cursor
    if (cursor) {
      query.createdAt = {
        $lt: new Date(cursor),
      };
    }

    // 5. Lấy danh sách tin nhắn (mới → cũ), dư 1 bản ghi
    let message = await Message.find(query)
      .sort({
        createdAt: -1,
      })
      .limit(Number(limit) + 1);

    // 6. Khởi tạo cursor cho lần load tiếp theo
    let nextCursor = null;

    // 7. Nếu còn tin nhắn cũ hơn thì tạo nextCursor
    if (message.length > Number(limit)) {
      const nextMessage = message[message.length - 1];
      nextCursor = nextMessage.createdAt.toISOString();
      message.pop();
    }

    // 8. Đảo mảng để trả về theo thứ tự cũ → mới
    message = message.reverse();

    // 9. Trả dữ liệu về client
    return res.status(200).json({
      message,
      nextCursor,
    });
  } catch (error) {
    // 10. Bắt lỗi hệ thống
    console.error("Lỗi khi lấy tin nhắn!", error);
    return res.status(500).json({
      message: "Lỗi hệ thống!",
    });
  }
};
