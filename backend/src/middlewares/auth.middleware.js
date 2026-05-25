import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectedRoute = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Không tìm thấy access token." });
    }

    // Verify token
    jwt.verify(token, process.env.ACCESS_TOKEN, async (err, decoded) => {
      if (err) {
        console.error("JWT Error:", err.name);

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
