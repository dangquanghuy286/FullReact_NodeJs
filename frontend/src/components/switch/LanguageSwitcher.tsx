import { useTranslation } from "react-i18next";

const LANGUAGES = [
  { code: "vi", flag: "fi fi-vn", label: "Tiếng Việt" },
  { code: "en", flag: "fi fi-gb", label: "English" },
];

export const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language;

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("lang", lang);
  };

  return (
    <div className="flex items-center gap-1">
      {LANGUAGES.map(({ code, flag, label }) => (
        <button
          key={code}
          onClick={() => changeLanguage(code)}
          title={label}
          aria-label={label}
          className={`px-2 py-1 text-base rounded transition ${
            currentLang === code
              ? "bg-[#00c0d1]/20 ring-1 ring-[#00c0d1]"
              : "opacity-60 hover:opacity-100"
          }`}
        >
          <span className={flag} />
        </button>
      ))}
    </div>
  );
};
