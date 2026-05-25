import nodemailer from "nodemailer";

const createTransporter = () =>
  nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

// ─── Email OTP  ───
export const sendOTPEmail = async (toEmail, otp) => {
  const transporter = createTransporter();

  const htmlTemplate = `
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Mã OTP</title>
</head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="480" cellpadding="0" cellspacing="0"
          style="background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e2e8f0;">
          <tr>
            <td style="background:#0f172a;padding:28px 32px;text-align:center;">
              <table cellpadding="0" cellspacing="0" style="margin:0 auto;">
                <tr>
                  <td style="background:#00c0d1;border-radius:6px;width:28px;height:28px;text-align:center;vertical-align:middle;">
                    <span style="color:#fff;font-size:16px;">🔒</span>
                  </td>
                  <td style="padding-left:8px;">
                    <span style="color:#f8fafc;font-size:16px;font-weight:500;">App Support</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:36px 32px 28px;">
              <p style="margin:0 0 6px;font-size:13px;color:#64748b;">Xin chào,</p>
              <h2 style="margin:0 0 12px;font-size:20px;font-weight:600;color:#0f172a;">
                Mã xác thực đổi mật khẩu
              </h2>
              <p style="margin:0 0 28px;font-size:14px;color:#64748b;line-height:1.6;">
                Bạn (hoặc ai đó) đã yêu cầu đổi mật khẩu. Dùng mã OTP bên dưới để tiếp tục.
              </p>
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                <tr>
                  <td style="background:#f8fafc;border:1.5px dashed #cbd5e1;border-radius:10px;padding:20px;text-align:center;">
                    <p style="margin:0 0 8px;font-size:11px;color:#94a3b8;letter-spacing:0.08em;text-transform:uppercase;">Mã OTP của bạn</p>
                    <p style="margin:0;font-size:36px;font-weight:700;letter-spacing:0.2em;color:#0f172a;font-family:'Courier New',Courier,monospace;">
                      ${otp}
                    </p>
                    <p style="margin:10px 0 0;font-size:12px;color:#f59e0b;font-weight:500;">⏱ Hết hạn sau 5 phút</p>
                  </td>
                </tr>
              </table>
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                <tr>
                  <td style="background:#fff7ed;border-left:3px solid #f97316;border-radius:0 6px 6px 0;padding:12px 14px;">
                    <p style="margin:0;font-size:13px;color:#9a3412;line-height:1.5;">
                      <strong>Không phải bạn?</strong> Hãy bỏ qua email này. Mật khẩu của bạn sẽ không thay đổi.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="border-top:1px solid #f1f5f9;padding:16px 32px;text-align:center;">
              <p style="margin:0;font-size:12px;color:#94a3b8;line-height:1.6;">
                Bạn nhận được email này vì có yêu cầu thay đổi mật khẩu từ tài khoản của bạn.<br/>
                © 2025 App Support. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  await transporter.sendMail({
    from: `"App Support" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: "Mã OTP xác thực đổi mật khẩu",
    html: htmlTemplate,
  });
};

// ─── Email xác nhận đổi mật khẩu  ───
export const sendChangePasswordEmail = async (toEmail, confirmLink) => {
  const transporter = createTransporter();

  const htmlTemplate = `
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Xác nhận đổi mật khẩu</title>
</head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="480" cellpadding="0" cellspacing="0"
          style="background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e2e8f0;">
          <!-- Header -->
          <tr>
            <td style="background:#0f172a;padding:28px 32px;text-align:center;">
              <table cellpadding="0" cellspacing="0" style="margin:0 auto;">
                <tr>
                  <td style="background:#00c0d1;border-radius:6px;width:28px;height:28px;text-align:center;vertical-align:middle;">
                    <span style="color:#fff;font-size:16px;">🔒</span>
                  </td>
                  <td style="padding-left:8px;">
                    <span style="color:#f8fafc;font-size:16px;font-weight:500;">App Support</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:36px 32px 28px;">
              <p style="margin:0 0 6px;font-size:13px;color:#64748b;">Xin chào,</p>
              <h2 style="margin:0 0 12px;font-size:20px;font-weight:600;color:#0f172a;line-height:1.3;">
                Xác nhận yêu cầu đổi mật khẩu
              </h2>
              <p style="margin:0 0 28px;font-size:14px;color:#64748b;line-height:1.6;">
                Chúng tôi nhận được yêu cầu đổi mật khẩu từ tài khoản của bạn.<br/>
                Nhấn nút bên dưới để xác nhận và tiếp tục đặt mật khẩu mới. Link có hiệu lực trong <strong>10 phút</strong>.
              </p>
              <!-- Button -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                <tr>
                  <td align="center">
                    <a href="${confirmLink}"
                      style="display:inline-block;background:#0f172a;color:#ffffff;font-size:14px;font-weight:600;
                             text-decoration:none;padding:14px 32px;border-radius:8px;letter-spacing:0.01em;">
                      ✅ Xác nhận đổi mật khẩu
                    </a>
                  </td>
                </tr>
              </table>
              <!-- Warning -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background:#fff7ed;border-left:3px solid #f97316;border-radius:0 6px 6px 0;padding:12px 14px;">
                    <p style="margin:0;font-size:13px;color:#9a3412;line-height:1.5;">
                      <strong>Không phải bạn?</strong> Hãy bỏ qua email này. Mật khẩu của bạn sẽ không thay đổi.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="border-top:1px solid #f1f5f9;padding:16px 32px;text-align:center;">
              <p style="margin:0;font-size:12px;color:#94a3b8;line-height:1.6;">
                Bạn nhận được email này vì có yêu cầu thay đổi mật khẩu từ tài khoản của bạn.<br/>
                © 2025 App Support. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  await transporter.sendMail({
    from: `"App Support" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: "Xác nhận yêu cầu đổi mật khẩu",
    html: htmlTemplate,
  });
};
