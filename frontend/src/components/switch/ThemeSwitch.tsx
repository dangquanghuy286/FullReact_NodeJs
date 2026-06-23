import { Sun, Moon } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useThemeStore } from "@/stores/theme.strore";
import { cn } from "@/lib/utils";

interface ThemeSwitchProps {
  iconClassName?: string;
  sunClassName?: string;
  moonClassName?: string;
  switchClassName?: string;
  showIcons?: boolean;
}

export function ThemeSwitch({
  iconClassName = "size-4 text-muted-foreground",
  sunClassName,
  moonClassName,
  switchClassName = "data-[state=checked]:bg-[#00c0d1]",
  showIcons = true,
}: ThemeSwitchProps) {
  const { isDarkMode, toggleTheme } = useThemeStore();

  return (
    <div className="flex items-center gap-2">
      {showIcons && <Sun className={cn(iconClassName, sunClassName)} />}

      <Switch
        checked={isDarkMode}
        onCheckedChange={toggleTheme}
        className={switchClassName}
      />

      {showIcons && <Moon className={cn(iconClassName, moonClassName)} />}
    </div>
  );
}
