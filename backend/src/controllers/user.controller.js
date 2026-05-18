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
    ).select("avatarURL");

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
// Update profile
export const updateProfile = async (req, res) => {
  try {
    // Lấy thông tin người dùng từ token
    const userId = req.user._id;
    const { displayName, bio, phone } = req.body;

    // Kiểm tra hệ thống có gì để cập nhật không
    if (!displayName && !bio && !phone) {
      return res.status(400).json({
        message: "Vui lòng cung cấp ít nhất một trường để cập nhật !",
      });
    }

    // Validate bio length
    if (bio && bio.length > 160) {
      return res.status(400).json({
        message: "Bio không được vượt quá 160 ký tự !",
      });
    }

    // Tạo đối tượng cập nhật
    const updateData = {};
    if (displayName != undefined) updateData.displayName = displayName.trim();
    if (bio != undefined) updateData.bio = bio.trim();
    if (phone != undefined) updateData.phone = phone.trim();

    // Hàm cập nhật người dùng
    const updateUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true },
    ).select("-hashedPassword");

    // Kiểm tra nếu cập nhật thành công
    if (!updateUser) {
      return res.status(404).json({
        message: "Không tìm thấy người dùng !",
      });
    }

    return res.status(200).json({
      user: updateUser,
      message: "Cập nhật profile thành công !",
    });
  } catch (error) {
    console.error("Lỗi khi cập nhật profile", error);
    return res.status(500).json({
      message: "Lỗi hệ thống  !",
    });
  }
};
