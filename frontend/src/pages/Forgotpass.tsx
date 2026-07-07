import { ForgotPasswordForm } from "@/components/auth/forgotpassword/forgotpasswordform";
import { AuthLayout } from "./AuthLayoutProps";

const ForgotPasswordPage = () => {
  return (
    <AuthLayout>
      <ForgotPasswordForm />
    </AuthLayout>
  );
};

export default ForgotPasswordPage;
