import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/auth.store";
import { GoogleLogin } from "@react-oauth/google";
import { useTranslation } from "react-i18next";
import { PasswordInput } from "../input/PasswordInput";

// Zod Schema
const signupSchema = z.object({
  firstName: z.string().min(1, "Please enter your first name"),
  lastName: z.string().min(1, "Please enter your last name"),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .min(1, "Please enter a username"),
  email: z
    .string()
    .min(1, "Please enter your email")
    .email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[A-Za-z])(?=.*\d).+$/,
      "Password must contain both letters and numbers",
    ),
});

type SignupFormData = z.infer<typeof signupSchema>;

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { signUp, googleSignIn } = useAuthStore();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormData) => {
    const { firstName, lastName, username, password, email } = data;

    //Gọi BE để SignUp
    await signUp(username, password, email, firstName, lastName);
    navigate("/signin");
  };

  const handleGoogleSuccess = async (credentialResponse: {
    credential?: string;
  }) => {
    try {
      if (!credentialResponse.credential) return;
      await googleSignIn(credentialResponse.credential);
      navigate("/");
    } catch (error) {
      console.error(t("auth.signup.googleFailed"), error);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 md:p-8">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">{t("auth.signup.title")}</h1>
                <p className="text-muted-foreground text-sm text-balance">
                  {t("auth.signup.subtitle")}
                </p>
              </div>

              {/* First and Last Name */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">
                    {t("auth.signup.firstName")}
                  </Label>
                  <Input id="firstName" {...register("firstName")} />
                  {errors.firstName && (
                    <p className="error-message">{errors.firstName.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">{t("auth.signup.lastName")}</Label>
                  <Input id="lastName" {...register("lastName")} />
                  {errors.lastName && (
                    <p className="error-message">{errors.lastName.message}</p>
                  )}
                </div>
              </div>

              {/* Username */}
              <div className="space-y-2">
                <Label htmlFor="username">{t("account.username")}</Label>
                <Input
                  id="username"
                  placeholder="username"
                  {...register("username")}
                />
                {errors.username && (
                  <p className="error-message">{errors.username.message}</p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">{t("account.email")}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="error-message">{errors.email.message}</p>
                )}
                <p className="text-sm text-muted-foreground">
                  {t("auth.signup.emailHint")}
                </p>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">{t("auth.signup.password")}</Label>
                <PasswordInput
                  id="password"
                  placeholder="••••••••"
                  {...register("password")}
                />
                {errors.password && (
                  <p className="error-message">{errors.password.message}</p>
                )}
                <p className="text-sm text-muted-foreground">
                  {t("auth.signup.passwordHint")}
                </p>
              </div>

              {/* Submit Button */}
              <Button type="submit" className="w-full">
                {t("auth.signup.submit")}
              </Button>

              {/* Separator */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    {t("auth.signup.orContinueWith")}
                  </span>
                </div>
              </div>

              {/* Google Login */}
              <div className="flex justify-center">
                <GoogleLogin
                  type="icon"
                  shape="circle"
                  theme="filled_blue"
                  onSuccess={handleGoogleSuccess}
                  onError={() => console.error(t("auth.signup.googleFailed"))}
                />
              </div>

              {/* Footer */}
              <div className="text-center text-sm">
                {t("auth.signup.haveAccount")}{" "}
                <Link to="/signin" className="underline hover:text-primary">
                  {t("auth.signup.signIn")}
                </Link>
              </div>
            </div>
          </form>

          {/* Image Side */}
          <div
            className="bg-muted relative hidden md:block"
            style={{
              background:
                "radial-gradient(circle at center, #FFF991 0%, transparent 70%)",
            }}
          >
            <img
              src="./placeholderSignUp.png"
              alt="Sign up illustration"
              className="absolute inset-0 object-cover top-1/2 -translate-y-1/2"
            />
          </div>
        </CardContent>
      </Card>

      <div className="px-6 text-center text-sm text-muted-foreground [&_a]:hover:text-primary">
        {t("auth.signup.termsPrefix")}{" "}
        <a href="#" className="underline">
          {t("auth.signup.termsOfService")}
        </a>{" "}
        {t("auth.signup.and")}{" "}
        <a href="#" className="underline">
          {t("auth.signup.privacyPolicy")}
        </a>
        .
      </div>
    </div>
  );
}
