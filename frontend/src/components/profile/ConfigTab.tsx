import { useState } from "react";
import { Sun, Moon } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useThemeStore } from "@/stores/theme.strore";

export const ConfigTab = () => {
  const { isDarkMode, toggleTheme } = useThemeStore();

  const [showOnline, setShowOnline] = useState(true);

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2">
        <span className="text-[#00c0d1]">✦</span>
        <div>
          <p className="text-sm font-semibold">App Preferences</p>
          <p className="text-xs text-muted-foreground">
            Personalize your chat experience
          </p>
        </div>
      </div>

      <Separator />

      {/* Dark Mode */}
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <p className="text-sm font-medium">Dark Mode</p>
          <p className="text-xs text-muted-foreground">
            Switch between light and dark theme
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Sun className="size-4 text-muted-foreground" />

          <Switch
            checked={isDarkMode}
            onCheckedChange={toggleTheme}
            className="data-[state=checked]:bg-[#00c0d1]"
          />

          <Moon className="size-4 text-muted-foreground" />
        </div>
      </div>

      <Separator />

      {/* Online Status */}
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <p className="text-sm font-medium">Show Online Status</p>
          <p className="text-xs text-muted-foreground">
            Allow others to see when you are online
          </p>
        </div>

        <Switch
          checked={showOnline}
          onCheckedChange={setShowOnline}
          className="data-[state=checked]:bg-[#00c0d1]"
        />
      </div>
    </div>
  );
};
