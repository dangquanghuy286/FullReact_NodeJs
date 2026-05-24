import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendOTPEmail = async (toEmail, otp) => {
  await transporter.sendMail({
    from: `"App Support" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: "Mã OTP đổi mật khẩu",
    html: `
      <h2>Mã OTP của bạn</h2>
      <p>Mã OTP để đổi mật khẩu: <strong>${otp}</strong></p>
      <p>Mã có hiệu lực trong <strong>5 phút</strong>.</p>
      <p>Nếu bạn không yêu cầu, hãy bỏ qua email này.</p>
    `,
  });
};
