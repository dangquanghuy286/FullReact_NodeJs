import mongoose from "mongoose";
// Friend request schema
const friendRequestSchema = new mongoose.Schema(
  {
    from: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: {
      type: String,
      maxlength: 300,
    },
  },
  {
    timestamps: true,
  },
);
// Unique index for friend request pairs
friendRequestSchema.index(
  {
    from: 1,
    to: 1,
  },
  {
    unique: true,
  },
);
// Index for querying sent requests
friendRequestSchema.index({
  from: 1,
});
// Index for querying received requests
friendRequestSchema.index({
  to: 1,
});
// Friend request model export
const FriendRequest = mongoose.model("FriendRequest", friendRequestSchema);
export default FriendRequest;
