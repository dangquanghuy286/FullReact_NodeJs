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
// User registration
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
// User login (generate access & refresh tokens)
export const signIn = async (req, res) => {
  try {
    // Lấy input
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({
        message: "Thiếu userName or passWord!",
      });
    }
    // Lấy hash trong db so sanh với pass input
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
      },
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
// User logout (invalidate refresh token)
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
// Refresh access token using refresh token
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
      { expiresIn: ACCESS_TOKEN_TTL },
    );

    return res.status(200).json({ accessToken });
  } catch (error) {
    console.error("Lỗi khi gọi refreshToken:", error);
    return res.status(500).json({ message: "Lỗi server, thử lại sau" });
  }
};
// Request OTP for password reset
// Bước 1: Gửi OTP vào email (yêu cầu JWT hợp lệ qua protectedRoute)
// POST /send-otp
export const sendOTP = async (req, res) => {
  try {
    const user = req.user;

    // tạo otp
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // xóa otp cũ
    await OTP.deleteMany({ userId: user._id });

    // lưu otp mới
    await OTP.create({
      userId: user._id,
      otp,
      verified: false,
      expiresAt: new Date(Date.now() + OTP_TTL),
    });

    // gửi email
    await sendOTPEmail(user.email, otp);

    return res.status(200).json({
      message: `OTP đã gửi tới ${user.email}`,
    });
  } catch (error) {
    console.error("Lỗi sendOTP:", error);

    return res.status(500).json({
      message: "Lỗi server",
    });
  }
};
// Bước 2: Xác thực OTP
// POST /verify-otp
export const verifyOTP = async (req, res) => {
  try {
    const user = req.user;

    const { otp } = req.body;

    if (!otp) {
      return res.status(400).json({
        message: "OTP không được để trống!",
      });
    }

    const otpRecord = await OTP.findOne({
      userId: user._id,
    });

    if (!otpRecord) {
      return res.status(400).json({
        message: "OTP không tồn tại!",
      });
    }

    // kiểm tra hết hạn
    if (otpRecord.expiresAt < new Date()) {
      await OTP.deleteOne({ _id: otpRecord._id });

      return res.status(400).json({
        message: "OTP đã hết hạn!",
      });
    }

    // kiểm tra otp
    if (otpRecord.otp !== otp) {
      return res.status(400).json({
        message: "OTP không chính xác!",
      });
    }

    // đánh dấu verified
    otpRecord.verified = true;

    await otpRecord.save();

    return res.status(200).json({
      message: "Xác thực OTP thành công!",
    });
  } catch (error) {
    console.error("Lỗi verifyOTP:", error);

    return res.status(500).json({
      message: "Lỗi server",
    });
  }
};
// Bước 3: Đặt lại mật khẩu mới
// POST /reset-password
export const resetPassword = async (req, res) => {
  try {
    const user = req.user;

    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message: "Thiếu currentPassword hoặc newPassword!",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        message: "Mật khẩu mới phải >= 6 ký tự!",
      });
    }

    // lấy full user
    const fullUser = await User.findById(user._id);

    // check mật khẩu cũ
    const isCorrect = await bcrypt.compare(
      currentPassword,
      fullUser.hashedPassword,
    );

    if (!isCorrect) {
      return res.status(401).json({
        message: "Mật khẩu hiện tại không đúng!",
      });
    }

    // kiểm tra otp đã verify chưa
    const otpRecord = await OTP.findOne({
      userId: user._id,
    });

    if (!otpRecord) {
      return res.status(400).json({
        message: "OTP không tồn tại!",
      });
    }

    if (!otpRecord.verified) {
      return res.status(400).json({
        message: "OTP chưa được xác thực!",
      });
    }

    // hash mật khẩu mới
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // update password
    await User.findByIdAndUpdate(user._id, {
      hashedPassword,
    });

    // xóa otp
    await OTP.deleteOne({
      _id: otpRecord._id,
    });

    // logout all devices
    await Session.deleteMany({
      userId: user._id,
    });

    return res.status(200).json({
      message: "Đổi mật khẩu thành công. Vui lòng đăng nhập lại!",
    });
  } catch (error) {
    console.error("Lỗi resetPassword:", error);

    return res.status(500).json({
      message: "Lỗi server",
    });
  }
};
