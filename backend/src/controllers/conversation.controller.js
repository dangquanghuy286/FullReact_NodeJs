import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import { io } from "../socket/index.socket.js";
// Create a conversation
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

    const participants = (conversation.participants || []).map((p) => ({
      _id: p.userId?._id,
      displayName: p.userId?.displayName,
      avatarUrl: p.userId?.avatarUrl ?? null,
      joinedAt: p.joinedAt,
    }));

    const formattedConversation = { ...conversation.toObject(), participants };

    // Nếu là nhóm thì mới emit sự kiện tạo nhóm mới
    if (type === "group") {
      memberIds.forEach((userId) => {
        io.to(userId).emit.apply("new-group", formattedConversation);
      });
    }
    return res.status(201).json({
      conversation: formattedConversation,
    });
  } catch (error) {
    console.error("Lỗi khi tạo hội thoại!", error);
    return res.status(500).json({
      message: "Lỗi hệ thống!",
    });
  }
};
// Get all user conversations
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
// Get messages with cursor pagination
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

    // 5. Lấy danh sách tin nhắn , dư 1 bản ghi
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
      messages: message,
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
// Get conversation IDs for Socket.IO
export const getUserConversationsForSocketIO = async (userId) => {
  try {
    const conversations = await Conversation.find(
      {
        "participants.userId": userId,
      },
      { _id: 1 },
    );

    return conversations.map((c) => c._id.toString());
  } catch (error) {
    console.error("Lỗi khi fetch conversations", error);
    return [];
  }
};
// Mark messages as seen
export const markAsSeen = async (req, res) => {
  try {
    // Bước 1: Lấy thông tin Id người dùng và convo và xử lý ngoại lệ
    const { conversationId } = req.params;
    const userId = req.user._id.toString();

    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      return res.status(404).json({
        message: "Conversation không tồn tại!",
      });
    }

    const last = conversation.lastMessage;

    if (!last) {
      return res.status(200).json({
        message: "Không có tin nhắn để mark as seen",
      });
    }

    if (last.senderId.toString() === userId) {
      return res.status(200).json({
        message: "Sender không cần đánh dấu là đã đọc!",
      });
    }
    // Bước 2:Cập nhật trạng thái đã đọc
    const updated = await Conversation.findByIdAndUpdate(
      conversationId,
      {
        $addToSet: { seenBy: userId },
        $set: { [`unreadCounts.${userId}`]: 0 },
      },
      { new: true },
    );

    if (!updated) {
      return res.status(404).json({
        message: "Update thất bại",
      });
    }
    // Bước 3:Đồng bộ trạng thái “đã đọc” theo thời gian thực giữa các user.
    io.to(conversationId).emit("read-message", {
      conversation: updated,
      lastMessage: {
        _id: updated?.lastMessage?._id,
        content: updated?.lastMessage?.content,
        createdAt: updated?.lastMessage?.createdAt,
        sender: {
          _id: updated?.lastMessage?.senderId,
        },
      },
    });
    // Bước 4:Trả response về client
    return res.status(200).json({
      message: "Marked as seen",
      seenBy: updated.seenBy || [],
      myUnreadCount: updated.unreadCounts[userId] || 0,
    });
  } catch (error) {
    console.error("Lỗi khi mark seen", error);
    return res.status(500).json({
      message: "Lỗi hệ thống!",
    });
  }
};
