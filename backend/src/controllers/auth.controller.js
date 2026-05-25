import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import Session from "../models/session.model.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { sendOTPEmail } from "../libs/mailer.js";
import OTP from "../models/otp.model.js";

const OTP_TTL = 5 * 60 * 1000;
const ACCESS_TOKEN_TTL = "15m";
const REFRESH_TOKEN_TTL = 14 * 24 * 60 * 60 * 1000;
const CONFIRM_TOKEN_TTL = "10m";
// ─────────────────────────────────────────────
// User registration
// ─────────────────────────────────────────────
export const signUp = async (req, res) => {
  try {
    const { username, password, email, firstName, lastName } = req.body;

    if (!username || !password || !email || !firstName || !lastName) {
      return res.status(400).json({
        message:
          "Không thể thiếu username, password, email, firstName và lastName!",
      });
    }

    const duplicateUsername = await User.findOne({ username });
    if (duplicateUsername) {
      return res.status(409).json({ message: "Username đã tồn tại" });
    }

    const duplicateEmail = await User.findOne({ email });
    if (duplicateEmail) {
      return res.status(409).json({ message: "Email đã tồn tại" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      hashedPassword,
      email,
      displayName: `${firstName} ${lastName}`,
    });

    await newUser.save();

    return res.status(201).json({ message: "Đăng ký thành công!" });
  } catch (error) {
    console.error("Lỗi khi gọi signUp:", error);
    return res.status(500).json({ message: "Lỗi server, thử lại sau" });
  }
};

// ─────────────────────────────────────────────
// User login
// ─────────────────────────────────────────────
export const signIn = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Thiếu username hoặc password!" });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res
        .status(401)
        .json({ message: "Username hoặc password không chính xác!" });
    }

    const passWordCorrect = await bcrypt.compare(password, user.hashedPassword);
    if (!passWordCorrect) {
      return res
        .status(401)
        .json({ message: "Username hoặc password không chính xác!" });
    }

    const accessToken = jwt.sign(
      { userId: user._id },
      process.env.ACCESS_TOKEN,
      { expiresIn: ACCESS_TOKEN_TTL },
    );

    const refreshToken = crypto.randomBytes(64).toString("hex");

    await Session.create({
      userId: user._id,
      refreshToken,
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL),
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: REFRESH_TOKEN_TTL,
    });

    return res.status(200).json({
      message: `User ${user.displayName} đã đăng nhập thành công!`,
      accessToken,
    });
  } catch (error) {
    console.error("Lỗi khi gọi signIn:", error);
    return res.status(500).json({ message: "Lỗi server, thử lại sau" });
  }
};

// ─────────────────────────────────────────────
// User logout
// ─────────────────────────────────────────────
export const signOut = async (req, res) => {
  try {
    const token = req.cookies?.refreshToken;

    if (token) {
      await Session.deleteOne({ refreshToken: token });
    }

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

// ─────────────────────────────────────────────
// Refresh access token
// ─────────────────────────────────────────────
export const refreshToken = async (req, res) => {
  try {
    const token = req.cookies?.refreshToken;

    if (!token) {
      return res.status(401).json({ message: "Token không tồn tại!" });
    }

    const session = await Session.findOne({ refreshToken: token });
    if (!session) {
      return res
        .status(403)
        .json({ message: "Token không hợp lệ hoặc đã hết hạn" });
    }

    if (session.expiresAt < new Date()) {
      await Session.deleteOne({ _id: session._id });
      return res.status(403).json({ message: "Token đã hết hạn!" });
    }

    const accessToken = jwt.sign(
      { userId: session.userId },
      process.env.ACCESS_TOKEN,
      { expiresIn: ACCESS_TOKEN_TTL },
    );

    return res.status(200).json({ accessToken });
  } catch (error) {
    console.error("Lỗi khi gọi refreshToken:", error);
    return res.status(500).json({ message: "Lỗi server, thử lại sau" });
  }
};

// ═════════════════════════════════════════════
// CHANGE PASSWORD (đã đăng nhập — không cần OTP)
// POST /change-password
// Bước 1: Kiểm tra mật khẩu cũ
// Post /change-password/verify
export const changePasswordVerify = async (req, res) => {
  try {
    const user = req.user; // từ protectedRoute
    const { currentPassword } = req.body;

    if (!currentPassword) {
      return res.status(400).json({ message: "Thiếu currentPassword!" });
    }

    const fullUser = await User.findById(user._id);

    const isCorrect = await bcrypt.compare(
      currentPassword,
      fullUser.hashedPassword,
    );
    if (!isCorrect) {
      return res.status(401).json({ message: "Mật khẩu hiện tại không đúng!" });
    }

    // Tạo confirm token (10 phút)
    const confirmToken = jwt.sign(
      { userId: user._id, purpose: "change-password" },
      process.env.ACCESS_TOKEN,
      { expiresIn: CONFIRM_TOKEN_TTL },
    );

    // Link gửi về email — frontend sẽ đọc token từ query param
    const confirmLink = `${process.env.CLIENT_URL}/change-password/confirm?token=${confirmToken}`;

    await sendChangePasswordEmail(fullUser.email, confirmLink);

    return res.status(200).json({
      message:
        "Mật khẩu đúng. Email xác nhận đã được gửi, vui lòng kiểm tra hộp thư!",
    });
  } catch (error) {
    console.error("Lỗi changePasswordVerify:", error);
    return res.status(500).json({ message: "Lỗi server" });
  }
};
// Bước 2: Xác nhận link từ email
// GET /change-password/confirm?token=...
export const changePasswordConfirm = async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({ message: "Thiếu token!" });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.ACCESS_TOKEN);
    } catch {
      return res
        .status(401)
        .json({ message: "Token không hợp lệ hoặc đã hết hạn!" });
    }

    if (decoded.purpose !== "change-password") {
      return res.status(401).json({ message: "Token không hợp lệ!" });
    }

    // Tạo reset token mới (10 phút) để dùng ở bước 3
    // Tách biệt confirm token và reset token để tránh dùng nhầm
    const resetToken = jwt.sign(
      { userId: decoded.userId, purpose: "change-password-reset" },
      process.env.ACCESS_TOKEN,
      { expiresIn: CONFIRM_TOKEN_TTL },
    );

    return res.status(200).json({
      message: "Xác nhận thành công! Vui lòng nhập mật khẩu mới.",
      resetToken,
    });
  } catch (error) {
    console.error("Lỗi changePasswordConfirm:", error);
    return res.status(500).json({ message: "Lỗi server" });
  }
};
// Bước 3: Đặt mật khẩu mới
// POST /change-password/reset
export const changePasswordReset = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Reset token không tồn tại!" });
    }

    const resetToken = authHeader.split(" ")[1];

    let decoded;
    try {
      decoded = jwt.verify(resetToken, process.env.ACCESS_TOKEN);
    } catch {
      return res
        .status(401)
        .json({ message: "Token không hợp lệ hoặc đã hết hạn!" });
    }

    if (decoded.purpose !== "change-password-reset") {
      return res.status(401).json({ message: "Token không hợp lệ!" });
    }

    const { newPassword } = req.body;

    if (!newPassword) {
      return res.status(400).json({ message: "Thiếu newPassword!" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: "Mật khẩu mới phải >= 6 ký tự!" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.findByIdAndUpdate(decoded.userId, { hashedPassword });

    // Đăng xuất toàn bộ thiết bị
    await Session.deleteMany({ userId: decoded.userId });
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    return res.status(200).json({
      message: "Đổi mật khẩu thành công. Vui lòng đăng nhập lại!",
    });
  } catch (error) {
    console.error("Lỗi changePasswordReset:", error);
    return res.status(500).json({ message: "Lỗi server" });
  }
};
// ═════════════════════════════════════════════

// ═════════════════════════════════════════════
// FORGOT PASSWORD
// ═════════════════════════════════════════════

// Bước 1: Nhập email hoặc username → gửi OTP
// POST /forgot-password/send-otp
export const forgotSendOTP = async (req, res) => {
  try {
    const { email, username } = req.body;

    if (!email && !username) {
      return res.status(400).json({
        message: "Vui lòng nhập email hoặc username!",
      });
    }

    // Tìm user theo email hoặc username
    const user = await User.findOne(email ? { email } : { username });

    // Trả về thành công ngay cả khi không tìm thấy (tránh lộ thông tin)
    if (!user) {
      return res.status(200).json({
        message: "Nếu tài khoản tồn tại, OTP đã được gửi tới email đăng ký.",
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await OTP.deleteMany({ userId: user._id });

    await OTP.create({
      userId: user._id,
      otp,
      verified: false,
      expiresAt: new Date(Date.now() + OTP_TTL),
    });

    await sendOTPEmail(user.email, otp);

    return res.status(200).json({
      message: "Nếu tài khoản tồn tại, OTP đã được gửi tới email đăng ký.",
    });
  } catch (error) {
    console.error("Lỗi forgotSendOTP:", error);
    return res.status(500).json({ message: "Lỗi server" });
  }
};

// Bước 2: Xác thực OTP
// POST /forgot-password/verify-otp
export const forgotVerifyOTP = async (req, res) => {
  try {
    const { email, username, otp } = req.body;

    if (!otp || (!email && !username)) {
      return res.status(400).json({
        message: "Vui lòng nhập email/username và OTP!",
      });
    }

    const user = await User.findOne(email ? { email } : { username });
    if (!user) {
      return res.status(400).json({ message: "Tài khoản không tồn tại!" });
    }

    const otpRecord = await OTP.findOne({ userId: user._id });

    if (!otpRecord) {
      return res.status(400).json({ message: "OTP không tồn tại!" });
    }

    if (otpRecord.expiresAt < new Date()) {
      await OTP.deleteOne({ _id: otpRecord._id });
      return res.status(400).json({ message: "OTP đã hết hạn!" });
    }

    if (otpRecord.otp !== otp) {
      return res.status(400).json({ message: "OTP không chính xác!" });
    }

    otpRecord.verified = true;
    await otpRecord.save();

    // Trả về một reset token tạm thời để dùng ở bước 3
    // (tránh yêu cầu user nhập lại email/username lần nữa)
    const resetToken = jwt.sign(
      { userId: user._id, purpose: "reset-password" },
      process.env.ACCESS_TOKEN,
      { expiresIn: "10m" },
    );

    return res.status(200).json({
      message: "Xác thực OTP thành công!",
      resetToken,
    });
  } catch (error) {
    console.error("Lỗi forgotVerifyOTP:", error);
    return res.status(500).json({ message: "Lỗi server" });
  }
};

// Bước 3: Đặt lại mật khẩu mới
// POST /forgot-password/reset-password
export const forgotResetPassword = async (req, res) => {
  try {
    // Lấy reset token từ header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Reset token không tồn tại!" });
    }

    const resetToken = authHeader.split(" ")[1];

    let decoded;
    try {
      decoded = jwt.verify(resetToken, process.env.ACCESS_TOKEN);
    } catch {
      return res
        .status(401)
        .json({ message: "Reset token không hợp lệ hoặc đã hết hạn!" });
    }

    // Kiểm tra purpose để tránh dùng nhầm access token thường
    if (decoded.purpose !== "reset-password") {
      return res.status(401).json({ message: "Token không hợp lệ!" });
    }

    const { newPassword } = req.body;

    if (!newPassword) {
      return res.status(400).json({ message: "Thiếu newPassword!" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        message: "Mật khẩu mới phải >= 6 ký tự!",
      });
    }

    // Kiểm tra OTP đã verified chưa
    const otpRecord = await OTP.findOne({ userId: decoded.userId });

    if (!otpRecord || !otpRecord.verified) {
      return res.status(400).json({
        message: "OTP chưa được xác thực!",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await User.findByIdAndUpdate(decoded.userId, { hashedPassword });

    // Xóa OTP sau khi dùng
    await OTP.deleteOne({ _id: otpRecord._id });

    // Đăng xuất toàn bộ thiết bị
    await Session.deleteMany({ userId: decoded.userId });

    return res.status(200).json({
      message: "Đặt lại mật khẩu thành công. Vui lòng đăng nhập lại!",
    });
  } catch (error) {
    console.error("Lỗi forgotResetPassword:", error);
    return res.status(500).json({ message: "Lỗi server" });
  }
};
