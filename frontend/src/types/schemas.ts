import * as z from "zod";

// ─────────────────────────────────────────────
// Step 1: Nhập email hoặc username
// ─────────────────────────────────────────────
export const requestSchema = z.object({
  identifier: z.string().min(1, "Please enter your email or username"),
});
export type RequestFormData = z.infer<typeof requestSchema>;

// ─────────────────────────────────────────────
// Step 2: Nhập OTP
// ─────────────────────────────────────────────
export const otpSchema = z.object({
  otp: z
    .string()
    .min(6, "OTP must be 6 digits")
    .max(6, "OTP must be 6 digits")
    .regex(/^\d+$/, "OTP must contain only numbers"),
});
export type OtpFormData = z.infer<typeof otpSchema>;

// ─────────────────────────────────────────────
// Step 3: Đặt mật khẩu mới
// ─────────────────────────────────────────────
export const resetSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[A-Za-z])(?=.*\d).+$/,
        "Password must contain both letters and numbers",
      ),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
export type ResetFormData = z.infer<typeof resetSchema>;

export type Step = "request" | "otp" | "reset" | "done";
