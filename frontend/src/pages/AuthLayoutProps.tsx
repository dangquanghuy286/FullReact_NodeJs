import { LanguageSwitcher } from "@/components/switch/LanguageSwitcher";
import { ThemeSwitch } from "@/components/switch/ThemeSwitch";
import type { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
}

export const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen w-full relative bg-white dark:bg-background">
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
      <div className="absolute top-4 right-4 z-20 flex items-center gap-3">
        <ThemeSwitch
          sunClassName="size-4 text-yellow-500"
          moonClassName="size-4 text-gray-500 dark:text-gray-300"
          switchClassName="data-[state=checked]:bg-[#009fb0]"
        />
        <LanguageSwitcher />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm md:max-w-4xl">{children}</div>
      </div>
    </div>
  );
};
