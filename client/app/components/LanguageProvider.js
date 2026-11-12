"use client";

import { createContext, useContext, useEffect, useMemo, useSyncExternalStore } from "react";
import { englishTranslations } from "../../lib/translations";

const LanguageContext = createContext(null);

function subscribeToLanguage(callback) {
  window.addEventListener("storage", callback);
  window.addEventListener("itahari-language-change", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("itahari-language-change", callback);
  };
}

function getLanguageSnapshot() {
  return window.localStorage.getItem("itahari-language") === "en" ? "en" : "ne";
}

export function LanguageProvider({ children }) {
  const language = useSyncExternalStore(subscribeToLanguage, getLanguageSnapshot, () => "ne");

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const value = useMemo(() => ({
    language,
    toggleLanguage() {
      window.localStorage.setItem("itahari-language", language === "en" ? "ne" : "en");
      window.dispatchEvent(new Event("itahari-language-change"));
    },
    t(text) {
      return language === "en" ? englishTranslations[text] || text : text;
    },
  }), [language]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within a LanguageProvider.");
  return context;
}
