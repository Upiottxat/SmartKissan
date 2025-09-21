// import * as Localization from "expo-localization";
// import i18n from "i18next";
// import { initReactI18next } from "react-i18next";
// import translations from "./translations.json";
// const fallback = { languageTag: "en", isRTL: false };


// const deviceLanguage =
//   Localization.locale?.split("-")[0] || "en"; // safe check with ?

// i18n.use(initReactI18next).init({
//   compatibilityJSON: "v3",
//   lng: languageTag,
//    fallbackLng: "en",
//   resources: translations, 
//   interpolation: {
//     escapeValue: false,
//   },
// });

// export default i18n;
import * as Localization from "expo-localization";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import translations from "./translations.json";

const deviceLanguage =
  Localization.locale?.split("-")[0] || "en"; // safe check with ?

i18n.use(initReactI18next).init({
  resources: translations,
  lng: deviceLanguage,
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});

export default i18n;
