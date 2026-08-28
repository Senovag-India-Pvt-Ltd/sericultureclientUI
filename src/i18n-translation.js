import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import translation_en from "../src/assets/locales/en/translation_en.json";
import translation_kn from "../src/assets/locales/kn/translation_kn.json";
import translation_en_reports from "../src/assets/locales/en/translation_en_reports.json";
import translation_kn_reports from "../src/assets/locales/kn/translation_kn_reports.json";

i18next
  .use(initReactI18next)
  //   .use(LanguageDetector)
  .init({
    debug: false,
    fallbackLng: "en",
    ns: ["translation", "reports"],
    defaultNS: "translation",
    resources: {
      en: {
        translation: translation_en.data,
        reports: translation_en_reports.data,
      },
      kn: {
        translation: translation_kn.data,
        reports: translation_kn_reports.data,
      },
    },
  });
