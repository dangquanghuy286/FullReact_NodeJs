import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

// Xác minh User là ai
export const protectedRoute = (req, res, next) => {
  try {
    // Lấy token từ header
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>

    if (!token) {
      return res.status(401).json({
        message: "Không tìm thấy access token.",
      });
    }

    // Xác nhận token hợp lệ
    // Cấu trúc jwt.verify(token, secret, callback)
    jwt.verify(token, process.env.ACCESS_TOKEN, async (err, decodeUser) => {
      if (err) {
        console.error(err);
        return res.status(403).json({
          message: "Access token đã hết hạn hoặc không hợp lệ.",
        });
      }

      try {
        // Tìm User trong database
        const user = await User.findById(decodeUser.userId).select(
          "-hashedPassword"
        );

        if (!user) {
          return res.status(404).json({
            message: "Người dùng không tồn tại.",
          });
        }

        // Lưu user vào req
        req.user = user;
        next();
      } catch (dbError) {
        console.error("Lỗi truy vấn User trong DB:", dbError);
        return res.status(500).json({
          message: "Lỗi hệ thống!",
        });
      }
    });
  } catch (error) {
    console.error("Lỗi xác minh JWT trong middleware!", error);
    return res.status(500).json({
      message: "Lỗi hệ thống!",
    });
  }
};
