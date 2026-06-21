
import { LoginForm } from "@/components/auth/signin-form";
import { AuthLayout } from "./AuthLayoutProps";

const SignInPage = () => {
  return (
    <AuthLayout>
      <LoginForm />
    </AuthLayout>
  );
};

export default SignInPage;
