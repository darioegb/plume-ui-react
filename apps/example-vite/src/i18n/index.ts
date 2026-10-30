import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import { read, write } from "../lib/storage";
import { en } from "./en";
import { es } from "./es";

export const languages = ["en", "es"] as const;

export type Language = (typeof languages)[number];

const LANGUAGE_KEY = "plume-projects:language";

const isLanguage = (value: unknown): value is Language =>
  languages.some((language) => language === value);

function detectLanguage(): Language {
  const saved = read(LANGUAGE_KEY);
  if (isLanguage(saved)) return saved;
  const preferred = navigator.languages.find((tag) =>
    isLanguage(tag.slice(0, 2).toLowerCase()),
  );
  const language = preferred?.slice(0, 2).toLowerCase();
  return isLanguage(language) ? language : "en";
}

void i18next.use(initReactI18next).init({
  fallbackLng: "en",
  initAsync: false,
  interpolation: { escapeValue: false },
  lng: detectLanguage(),
  resources: { en: { translation: en }, es: { translation: es } },
  supportedLngs: languages,
});

document.documentElement.lang = i18next.language;

i18next.on("languageChanged", (language) => {
  document.documentElement.lang = language;
  write(LANGUAGE_KEY, language);
});

export { i18next };
