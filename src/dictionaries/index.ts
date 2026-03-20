import "server-only";

export type Locale = "tr" | "en" | "de" | "ru";

export const locales: Locale[] = ["tr", "en", "de", "ru"];
export const defaultLocale: Locale = "tr";

export const localeNames: Record<Locale, string> = {
  tr: "Türkçe",
  en: "English",
  de: "Deutsch",
  ru: "Русский",
};

export const localeFlags: Record<Locale, string> = {
  tr: "TR",
  en: "EN",
  de: "DE",
  ru: "RU",
};

const dictionaries = {
  tr: () => import("./tr.json").then((m) => m.default),
  en: () => import("./en.json").then((m) => m.default),
  de: () => import("./de.json").then((m) => m.default),
  ru: () => import("./ru.json").then((m) => m.default),
};

export type Dictionary = Awaited<ReturnType<(typeof dictionaries)["tr"]>>;

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  if (!locales.includes(locale)) {
    return dictionaries[defaultLocale]();
  }
  return dictionaries[locale]();
}
