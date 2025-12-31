import Conversation from "../models/conversation.model.js";

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
    console.error("Lỗi khi gửi tin nhắn!", error);
    return res.status(500).json({
      message: "Lỗi hệ thống!",
    });
  }
};
export const getAllConversations = async (req, res) => {};
export const getMessages = async (req, res) => {};
