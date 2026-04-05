import mongoose from "mongoose";
// Friend relationship schema
const friendSchema = new mongoose.Schema(
  {
    userA: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    userB: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);
// Ensure consistent user ordering before save
friendSchema.pre("save", function (next) {
  const a = this.userA.toString();
  const b = this.userB.toString();

  if (a > b) {
    this.userA = new mongoose.Types.ObjectId(b);
    this.userB = new mongoose.Types.ObjectId(a);
  }
  next();
});
// Unique index for friend pairs
friendSchema.index(
  {
    userA: 1,
    userB: 1,
  },
  {
    unique: true, // Đảm bảo mỗi cặp bạn bè chỉ tồn tại một lần
  },
);
// Friend model export
const Friend = mongoose.model("Friend", friendSchema);
export default Friend;
