import { useState } from "react";
import { Sun, Moon, Globe } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useThemeStore } from "@/stores/theme.strore";
import { useTranslation } from "react-i18next";

export const ConfigTab = () => {
  const { isDarkMode, toggleTheme } = useThemeStore();
  const { t, i18n } = useTranslation();

  const [showOnline, setShowOnline] = useState(true);

  const currentLang = i18n.language;

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("lang", lang);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2">
        <span className="text-[#00c0d1]">✦</span>
        <div>
          <p className="text-sm font-semibold">{t("config.title")}</p>
          <p className="text-xs text-muted-foreground">
            {t("config.subtitle")}
          </p>
        </div>
      </div>

      <Separator />

      {/* 🌐 Language */}
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <p className="text-sm font-medium">{t("config.language.label")}</p>
          <p className="text-xs text-muted-foreground">
            {t("config.language.description")}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Globe className="size-4 text-muted-foreground" />

          <button
            onClick={() => changeLanguage("vi")}
            className={`px-2 py-1 text-xs rounded ${
              currentLang === "vi" ? "bg-[#00c0d1] text-white" : "bg-muted"
            }`}
          >
            VI
          </button>

          <button
            onClick={() => changeLanguage("en")}
            className={`px-2 py-1 text-xs rounded ${
              currentLang === "en" ? "bg-[#00c0d1] text-white" : "bg-muted"
            }`}
          >
            EN
          </button>
        </div>
      </div>

      <Separator />

      {/* Dark Mode */}
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <p className="text-sm font-medium">{t("config.darkMode.label")}</p>
          <p className="text-xs text-muted-foreground">
            {t("config.darkMode.description")}
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
          <p className="text-sm font-medium">
            {t("config.onlineStatus.label")}
          </p>
          <p className="text-xs text-muted-foreground">
            {t("config.onlineStatus.description")}
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
