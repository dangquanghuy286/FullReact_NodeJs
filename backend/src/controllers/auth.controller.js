import bcrypt from "bcryptjs";
import User from "../models/user.model.js";

export const signUp = async (req, res) => {
  try {
    const { username, password, email, firstName, lastName } = req.body;

    if (!username || !password || !email || !firstName || !lastName) {
      return res.status(400).json({
        message:
          "Không thể thiếu username, password, email, firstName và lastName!",
      });
    }
    // Kiểm tra xem UserName có tồn tại chưa
    const duplicateUsername = await User.findOne({ username });
    if (duplicateUsername) {
      return res.status(409).json({ message: "Username đã tồn tại" });
    }
    // Kiểm tra xem Email có tồn tại chưa
    const duplicateEmail = await User.findOne({ email });
    if (duplicateEmail) {
      return res.status(409).json({ message: "Email đã tồn tại" });
    }
    // Mã hóa password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo user mới
    const newUser = new User({
      username,
      hashedPassword,
      email,
      displayName: `${firstName} ${lastName}`,
    });

    await newUser.save();

    // Trả về
    res.status(201).json({
      message: "Đăng ký thành công!",
    });
  } catch (error) {
    console.error("Lỗi khi gọi signUp:", error);
    return res.status(500).json({ message: "Lỗi server, thử lại sau" });
  }
};
