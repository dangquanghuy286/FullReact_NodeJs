import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import Session from "../models/session.model.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { sendChangePasswordEmail, sendOTPEmail } from "../libs/mailer.js";
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
// * signIn phát hiện isDeactivated → tự động gửi OTP

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

    // Tài khoản bị khóa → gửi OTP khôi phục thay vì báo lỗi cứng
    if (user.isDeactivated) {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();

      await OTP.deleteMany({ userId: user._id });
      await OTP.create({
        userId: user._id,
        otp,
        verified: false,
        expiresAt: new Date(Date.now() + OTP_TTL),
      });

      await sendOTPEmail(user.email, otp);

      return res.status(403).json({
        message:
          "Tài khoản đã bị vô hiệu hóa. OTP khôi phục đã được gửi tới email đăng ký.",
        code: "ACCOUNT_DEACTIVATED",
      });
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
// ────────────────────────────────────────────
// CHANGE PASSWORD
// POST /change-password
export const changePassword = async (req, res) => {
  try {
    const user = req.user; // từ protectedRoute
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Thiếu thông tin!" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: "Mật khẩu mới phải >= 6 ký tự!" });
    }

    const fullUser = await User.findById(user._id);

    const isCorrect = await bcrypt.compare(
      currentPassword,
      fullUser.hashedPassword,
    );
    if (!isCorrect) {
      return res.status(401).json({ message: "Mật khẩu hiện tại không đúng!" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.findByIdAndUpdate(user._id, { hashedPassword });

    return res.status(200).json({ message: "Đổi mật khẩu thành công!" });
  } catch (error) {
    console.error("Lỗi changePassword:", error);
    return res.status(500).json({ message: "Lỗi server" });
  }
};
// ────────────────────────────────────────────
// FORGOT PASSWORD

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
// DELETE /user/deactivate-account
export const deactivateAccount = async (req, res) => {
  try {
    const userId = req.user._id;
    const { password } = req.body;

    if (!password) {
      return res
        .status(400)
        .json({ message: "Vui lòng nhập mật khẩu để xác nhận!" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Người dùng không tồn tại!" });
    }

    const isCorrect = await bcrypt.compare(password, user.hashedPassword);
    if (!isCorrect) {
      return res.status(401).json({ message: "Mật khẩu không chính xác!" });
    }

    // Đánh dấu vô hiệu hóa
    await User.findByIdAndUpdate(userId, {
      isDeactivated: true,
      deactivatedAt: new Date(),
    });

    // Kick toàn bộ sessions hiện tại
    await Session.deleteMany({ userId });
    await OTP.deleteMany({ userId });

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    return res.status(200).json({ message: "Tài khoản đã bị vô hiệu hóa!" });
  } catch (error) {
    console.error("Lỗi deactivateAccount:", error);
    return res.status(500).json({ message: "Lỗi server!" });
  }
};

// RECOVER ACCOUNT

//***/ Verify OTP khôi phục
// POST /recover-account/verify-otp
export const recoverVerifyOTP = async (req, res) => {
  try {
    const { username, otp } = req.body;

    if (!username || !otp) {
      return res
        .status(400)
        .json({ message: "Vui lòng nhập username và OTP!" });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "Tài khoản không tồn tại!" });
    }

    if (!user.isDeactivated) {
      return res
        .status(400)
        .json({ message: "Tài khoản không ở trạng thái bị khóa!" });
    }

    const otpRecord = await OTP.findOne({ userId: user._id });

    if (!otpRecord) {
      return res.status(400).json({
        message: "OTP không tồn tại! Vui lòng đăng nhập lại để nhận OTP mới.",
      });
    }

    if (otpRecord.expiresAt < new Date()) {
      await OTP.deleteOne({ _id: otpRecord._id });
      return res.status(400).json({
        message: "OTP đã hết hạn! Vui lòng đăng nhập lại để nhận OTP mới.",
      });
    }

    if (otpRecord.otp !== otp) {
      return res.status(400).json({ message: "OTP không chính xác!" });
    }

    // Khôi phục tài khoản
    await User.findByIdAndUpdate(user._id, {
      isDeactivated: false,
      deactivatedAt: null,
    });

    // Dọn OTP
    await OTP.deleteOne({ _id: otpRecord._id });

    return res.status(200).json({
      message: "Tài khoản đã được khôi phục! Vui lòng đăng nhập lại.",
    });
  } catch (error) {
    console.error("Lỗi recoverVerifyOTP:", error);
    return res.status(500).json({ message: "Lỗi server" });
  }
};

//***/ Gửi lại OTP nếu hết hạn
// POST /recover-account/resend-otp
export const recoverResendOTP = async (req, res) => {
  try {
    const { username } = req.body;

    if (!username) {
      return res.status(400).json({ message: "Vui lòng nhập username!" });
    }

    const user = await User.findOne({ username });

    // Không lộ thông tin nếu không tìm thấy
    if (!user || !user.isDeactivated) {
      return res.status(200).json({
        message: "Nếu tài khoản hợp lệ, OTP đã được gửi tới email đăng ký.",
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
      message: "Nếu tài khoản hợp lệ, OTP đã được gửi tới email đăng ký.",
    });
  } catch (error) {
    console.error("Lỗi recoverResendOTP:", error);
    return res.status(500).json({ message: "Lỗi server" });
  }
};
