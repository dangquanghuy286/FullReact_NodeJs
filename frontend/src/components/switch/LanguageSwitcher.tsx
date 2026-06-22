import { Globe } from "lucide-react";
import { useTranslation } from "react-i18next";

export const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language;

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("lang", lang);
  };

  return (
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
  );
};
