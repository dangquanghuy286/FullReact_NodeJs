import { uploadImageFromBuffer } from "../middlewares/upload.middleware.js";
import User from "../models/user.model.js";

// Get profile
export const getProfile = async (req, res) => {
  try {
    const user = req.user;

    return res.status(200).json({
      user,
    });
  } catch (error) {
    console.error("Lỗi khi gọi profile", error);
    return res.status(500).json({
      message: "Lỗi hệ thống  !",
    });
  }
};

// Search users
export const searchUserByUsername = async (req, res) => {
  try {
    const { username } = req.query;
    if (!username || username.trim() === "") {
      return res.status(400).json({
        message: "Vui lòng cung cấp tên người dùng để tìm kiếm !",
      });
    }
    const user = await User.findOne({
      username,
    }).select("_id username displayName avatarURL");

    return res.status(200).json({
      user,
    });
  } catch (error) {
    console.error("Lỗi khi tìm kiếm người dùng", error);
    return res.status(500).json({
      message: "Lỗi hệ thống  !",
    });
  }
};

// uploadAvatar
export const uploadAvatar = async (req, res) => {
  try {
    const file = req.file;
    const userId = req.user._id;

    if (!file) {
      return res.status(400).json({
        message: "No file upload",
      });
    }

    const result = await uploadImageFromBuffer(file.buffer);

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        avatarURL: result.secure_url,
        avatarId: result.public_id,
      },
      {
        new: true,
      },
    ).select("avatarUrl");

    if (!updatedUser.avatarURL) {
      return res.status(400).json({
        message: "Avatar null",
      });
    }
    return res.status(200).json({
      avatarURL: updatedUser.avatarURL,
    });
  } catch (error) {
    console.error("Lỗi", error);
    return res.status(500).json({
      message: "Failed",
    });
  }
};
