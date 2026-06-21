// app/forgot-password/page.tsx
import { ForgotPasswordForm } from "@/components/auth/forgotpasswordform";
import { AuthLayout } from "./AuthLayoutProps";

const ForgotPasswordPage = () => {
  return (
    <AuthLayout>
      <ForgotPasswordForm />
    </AuthLayout>
  );
};

export default ForgotPasswordPage;
