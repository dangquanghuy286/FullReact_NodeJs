import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import en from "./locales/en.json";
import vi from "./locales/vi.json";

i18n
  .use(LanguageDetector) // tự detect ngôn ngữ browser
  .use(initReactI18next) // bind với React
  .init({
    resources: {
      en: { translation: en },
      vi: { translation: vi },
    },
    fallbackLng: "en", // fallback nếu không tìm thấy key
    lng: localStorage.getItem("lang") || undefined, // ưu tiên lang đã lưu
    interpolation: {
      escapeValue: false, // React đã tự escape XSS
    },
    detection: {
      order: ["localStorage", "navigator"], // thứ tự detect
      lookupLocalStorage: "lang",
    },
  });

export default i18n;
