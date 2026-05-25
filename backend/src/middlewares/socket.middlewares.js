import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

// Authenticate socket connection using JWT
export const socketAuthMiddleware = async (socket, next) => {
  try {
    const token = socket.handshake.auth?.token;

    if (!token) {
      return next(new Error("Unauthorized - Token không tồn tại"));
    }

    // Verify token (đồng bộ)
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN);

    const user = await User.findById(decoded.userId).select("-hashedPassword");

    if (!user) {
      return next(new Error("Unauthorized - User không tồn tại"));
    }

    socket.user = user;
    next();
  } catch (error) {
    console.error(
      "Lỗi khi verify JWT trong socketMiddleware:",
      error.name || error,
    );

    if (error.name === "TokenExpiredError") {
      return next(new Error("TOKEN_EXPIRED"));
    }

    if (error.name === "JsonWebTokenError") {
      return next(new Error("TOKEN_INVALID"));
    }

    next(new Error("Unauthorized"));
  }
};
