import en from "./en.json";
import da from "./da.json";

const translations = {
  en,
  da
};

let currentLang = "da"; // default language

export function setLanguage(lang) {
  if (translations[lang]) {
    currentLang = lang;
  }
}

export function t(key) {
  return translations[currentLang][key] || key;
}
