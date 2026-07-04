import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectedRoute = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Không tìm thấy access token." });
    }

    jwt.verify(token, process.env.ACCESS_TOKEN, async (err, decoded) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          return res.status(401).json({
            message: "Access token đã hết hạn",
            code: "TOKEN_EXPIRED",
          });
        }

        return res.status(403).json({
          message: "Access token không hợp lệ",
          code: "INVALID_TOKEN",
        });
      }

      // Token hợp lệ
      try {
        const user = await User.findById(decoded.userId).select(
          "-hashedPassword",
        );

        if (!user) {
          return res.status(404).json({ message: "Người dùng không tồn tại." });
        }

        // Chặn access token cũ (cấp trước khi deactivate, vẫn còn hạn 15 phút)
        // tiếp tục được dùng để gọi các route được bảo vệ.
        if (user.isDeactivated) {
          return res.status(403).json({
            message: "Tài khoản đã bị vô hiệu hóa.",
            code: "ACCOUNT_DEACTIVATED",
          });
        }

        req.user = user;
        next();
      } catch (dbError) {
        console.error("Lỗi DB:", dbError);
        return res.status(500).json({ message: "Lỗi hệ thống!" });
      }
    });
  } catch (error) {
    console.error("Lỗi middleware:", error);
    return res.status(500).json({ message: "Lỗi hệ thống!" });
  }
};
