import mongoose from "mongoose";
// Message schema for conversations
const messageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation", //Tham chieu den Conversation
      required: true,
      index: true,
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      trim: true,
    },
    imgUrl: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);
// Index for optimizing message queries by conversation and time
messageSchema.index({
  conversationId: 1,
  createdAt: -1,
});
// Message model export
const Message = mongoose.model("Message", messageSchema);
export default Message;
