import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import Session from "../models/session.model.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const ACCESS_TOKEN_TTL = "15m";
const REFRESH_TOKEN_TTL = 14 * 24 * 60 * 1000; //14 ngày

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
export const signIn = async (req, res) => {
  try {
    // Lấy input
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({
        message: "Thiếu userName or passWord!",
      });
    }
    // Lấy hash trong db so anh với pass input
    const user = await User.findOne({ username });
    if (!user) {
      return res
        .status(401)
        .json({ message: "userName or passWord không chính xác!" });
    }
    // Kiểm tra password
    const passWordCorrect = await bcrypt.compare(password, user.hashedPassword);

    if (!passWordCorrect) {
      return res
        .status(401)
        .json({ message: "userName or passWord không chính xác!" });
    }
    // Nếu khớp tạo accessToken với JWT
    const accessToken = jwt.sign(
      { userId: user._id },
      process.env.ACCESS_TOKEN,
      {
        expiresIn: ACCESS_TOKEN_TTL,
      }
    );
    // Tạo refresh token
    const refreshToken = crypto.randomBytes(64).toString("hex");
    // Tạo session mới để lưu refresh token
    await Session.create({
      userId: user._id,
      refreshToken,
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL),
    });
    // Trả  refresh token về trong cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: REFRESH_TOKEN_TTL,
    });
    // Trả access token trong res
    return res.status(200).json({
      message: `User ${user.displayName} đã đăng nhập thành công!`,
      accessToken,
    });
  } catch (error) {
    console.error("Lỗi khi gọi signUp:", error);
    return res.status(500).json({ message: "Lỗi server, thử lại sau" });
  }
};
export const signOut = async (req, res) => {
  try {
    // Lấy refreshToken token từ cookie
    const token = req.cookies?.refreshToken;
    // Xóa refresh token trong section
    if (token) {
      await Session.deleteOne({ refreshToken: token });
    }
    // Xóa cookie
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
    return res.status(200).json({ message: "Đăng xuất thành công!" });
  } catch (error) {
    console.error("Lỗi khi gọi signOut:", error);
    return res.status(500).json({ message: "Lỗi server, thử lại sau" });
  }
};
export const refreshToken = async (req, res) => {
  try {
    const token = req.cookies?.refreshToken;

    if (!token) {
      return res.status(401).json({ message: "Token không tồn tại !" });
    }

    const session = await Session.findOne({ refreshToken: token });
    if (!session) {
      return res
        .status(403)
        .json({ message: "Token không hợp lệ hoặc đã hết hạn" });
    }

    if (session.expiresAt < new Date()) {
      // Xóa session hết hạn
      await Session.deleteOne({ _id: session._id });
      return res.status(403).json({ message: "Token đã hết hạn!" });
    }

    const accessToken = jwt.sign(
      { userId: session.userId },
      process.env.ACCESS_TOKEN,
      { expiresIn: ACCESS_TOKEN_TTL }
    );

    return res.status(200).json({ accessToken });
  } catch (error) {
    console.error("Lỗi khi gọi refreshToken:", error);
    return res.status(500).json({ message: "Lỗi server, thử lại sau" });
  }
};
