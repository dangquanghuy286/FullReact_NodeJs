import { LanguageSwitcher } from "@/components/switch/LanguageSwitcher";
import type { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
}

export const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen w-full relative bg-white">
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `
            radial-gradient(circle at center, #FFF991 0%, transparent 70%)
          `,
          opacity: 0.6,
          mixBlendMode: "multiply",
        }}
      />

      {/* Language switcher - top right, available on every auth screen */}
      <div className="absolute top-4 right-4 z-20">
        <LanguageSwitcher />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm md:max-w-4xl">{children}</div>
      </div>
    </div>
  );
};
