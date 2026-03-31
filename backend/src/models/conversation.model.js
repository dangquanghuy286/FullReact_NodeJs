import mongoose from "mongoose";
// Participant schema for conversation members
const participantSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    _id: false,
  },
);
// Group information schema
const groupSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    _id: false,
  },
);
// Last message metadata schema
const lastMessageSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
    },
    content: {
      type: String,
      default: null,
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    createdAt: {
      type: Date,
      default: null,
    },
  },
  {
    _id: false,
  },
);
// Conversation schema (direct & group chat)
const conversationSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["direct", "group"],
      required: true,
    },
    participants: {
      type: [participantSchema],
      require: true,
    },
    group: {
      type: groupSchema,
      require: true,
    },
    lastMessageAt: {
      type: Date,
    },
    seenBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    lastMessage: {
      type: lastMessageSchema,
      default: null,
    },
    unreadCounts: {
      type: Map,
      of: Number,
      default: {},
    },
  },
  {
    timestamps: true,
  },
);

conversationSchema.index({
  "participant.userId": 1,
  lastMessageAt: -1,
});
// Conversation model export
const Conversation = mongoose.model("Conversation", conversationSchema);
export default Conversation;
