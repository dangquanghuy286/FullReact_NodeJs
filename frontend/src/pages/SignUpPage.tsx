// app/sign-up/page.tsx
import { SignupForm } from "@/components/auth/signup-form";
import { AuthLayout } from "./AuthLayoutProps";


const SignUpPage = () => {
  return (
    <AuthLayout>
      <SignupForm />
    </AuthLayout>
  );
};

export default SignUpPage;