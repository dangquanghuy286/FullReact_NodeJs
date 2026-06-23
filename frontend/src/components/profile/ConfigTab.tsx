import { useState } from "react";

import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "../switch/LanguageSwitcher";
import { ThemeSwitch } from "../switch/ThemeSwitch";

export const ConfigTab = () => {
  const { t } = useTranslation();

  const [showOnline, setShowOnline] = useState(true);

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

        <LanguageSwitcher />
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

        <ThemeSwitch />
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
