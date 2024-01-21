import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import translation_en from "../src/assets/locales/en/translation_en.json";
import translation_kn from "../src/assets/locales/kn/translation_kn.json";

i18next
  .use(initReactI18next)
  //   .use(LanguageDetector)
  .init({
    debug: false,
    fallbackLng: "en",
    resources: {
      en: {
        translation: translation_en.data,
      },
      kn: {
        translation: translation_kn.data,
      },
    },
  });
