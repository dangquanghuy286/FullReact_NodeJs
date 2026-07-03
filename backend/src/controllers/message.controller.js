import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import {
  emitNewMessage,
  updateConversationAfterCreateMessage,
} from "../utils/message.helper.js";
import { io } from "../socket/index.socket.js";
import { uploadMessageImages } from "../libs/cloudinary.js";

// Gửi tin nhắn trực tiếp (có thể kèm content, hoặc 1/nhiều ảnh, hoặc cả hai)
export const sendDirectMessage = async (req, res) => {
  try {
    const { recipientId, content, conversationId } = req.body;
    const senderId = req.user._id;
    const files = req.files || []; // do multer.array cung cấp

    // Phải có ít nhất content hoặc ảnh
    if (!content?.trim() && files.length === 0) {
      return res.status(400).json({
        message: "Cần có nội dung hoặc ít nhất 1 ảnh!",
      });
    }

    let conversation;
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

    // Upload ảnh lên cloudinary (nếu có)
    const images = await uploadMessageImages(files);

    const message = await Message.create({
      conversationId: conversation._id,
      senderId,
      content: content?.trim() || "",
      images,
    });

    updateConversationAfterCreateMessage(conversation, message, senderId);
    await conversation.save();
    emitNewMessage(io, conversation, message);

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

// Gửi tin nhắn nhóm (có thể kèm content, hoặc 1/nhiều ảnh, hoặc cả hai)
export const sendGroupMessage = async (req, res) => {
  try {
    const { conversationId, content } = req.body;
    const senderId = req.user._id;
    const conversation = req.conversation;
    const files = req.files || [];

    if (!content?.trim() && files.length === 0) {
      return res.status(400).json({
        message: "Cần có nội dung hoặc ít nhất 1 ảnh!",
      });
    }

    const images = await uploadMessageImages(files);

    const message = await Message.create({
      conversationId,
      senderId,
      content: content?.trim() || "",
      images,
    });

    updateConversationAfterCreateMessage(conversation, message, senderId);
    await conversation.save();
    emitNewMessage(io, conversation, message);

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
