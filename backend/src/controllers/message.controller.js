import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import { updateConversationAfterCreateMessage } from "../utils/message.helper.js";
export const sendDirectMessage = async (req, res) => {
  try {
    const { recipientId, content, conversationId } = req.body;
    const senderId = req.user._id;
    let conversation;

    if (!content) {
      return res.status(400).json({
        message: "Thiếu nội dung!",
      });
    }

    if (conversationId) {
      conversation = await Conversation.findById(conversationId);

      if (!conversation) {
        return res.status(404).json({
          message: "Không tìm thấy cuộc hội thoại!",
        });
      }
    } else {
      const existingConversation = await Conversation.findOne({
        type: "direct",
        "participants.userId": { $all: [senderId, recipientId] },
      });

      if (existingConversation) {
        conversation = existingConversation;
      } else {
        conversation = await Conversation.create({
          type: "direct",
          participants: [
            { userId: senderId, joinedAt: new Date() },
            { userId: recipientId, joinedAt: new Date() },
          ],
          lastMessageAt: new Date(),
          unreadCounts: new Map(),
        });
      }
    }

    const message = await Message.create({
      conversationId: conversation._id,
      senderId,
      content,
    });

    updateConversationAfterCreateMessage(conversation, message, senderId);
    await conversation.save();

    return res.status(201).json({
      message,
      conversation,
    });
  } catch (error) {
    console.error("Lỗi khi gửi tin nhắn!", error);
    return res.status(500).json({
      message: "Lỗi hệ thống!",
    });
  }
};
export const sendGroupMessage = async (req, res) => {
  try {
    const { conversationId, content } = req.body;
    const senderId = req.user._id;
    const conversation = req.conversation;

    if (!content) {
      return res.status(400).json("Thiếu nội dung");
    }

    const message = await Message.create({
      conversationId,
      senderId,
      content,
    });

    updateConversationAfterCreateMessage(conversation, message, senderId);

    await conversation.save();
    return res.status(201).json({
      message,
    });
  } catch (error) {
    console.error("Lỗi khi gửi tin nhắn!", error);
    return res.status(500).json({
      message: "Lỗi hệ thống!",
    });
  }
};
