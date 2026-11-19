"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useSyncExternalStore } from "react";
import Icon from "./Icon";
import { NationalEmblem, NepalFlag } from "./Brand";
import { useLanguage } from "./LanguageProvider";

function subscribeToTheme(callback) {
  window.addEventListener("storage", callback);
  window.addEventListener("itahari-theme-change", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("itahari-theme-change", callback);
  };
}

function getThemeSnapshot() {
  const savedTheme = window.localStorage.getItem("itahari-theme");
  return savedTheme ? savedTheme === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
}

const links = [
  { href: "/", label: "गृहपृष्ठ", icon: "home" },
  { href: "/news", label: "समाचार", icon: "news" },
  { href: "/tourist-places", label: "पर्यटन स्थल", icon: "building" },
  { href: "/complaint", label: "गुनासो दर्ता", icon: "form" },
  { href: "/about", label: "हाम्रो बारेमा", icon: "info" },
];

export default function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const darkMode = useSyncExternalStore(subscribeToTheme, getThemeSnapshot, () => false);
  const { language, t, toggleLanguage } = useLanguage();

  useEffect(() => {
    document.documentElement.dataset.theme = darkMode ? "dark" : "light";
  }, [darkMode]);

  function toggleTheme() {
    const nextTheme = darkMode ? "light" : "dark";
    window.localStorage.setItem("itahari-theme", nextTheme);
    window.dispatchEvent(new Event("itahari-theme-change"));
  }

  return (
    <>
      <div className="utility-bar">
        <div className="container utility-inner">
          <div className="utility-welcome"><span className="live-dot" /> {t("इटहरी उपमहानगरपालिका — एकीकृत नागरिक सेवा पोर्टल")}</div>
          <div className="utility-meta"><span>{t("कोशी प्रदेश, नेपाल")}</span><span className="utility-divider" /> {t("नागरिकमैत्री सेवा, हाम्रो प्रतिबद्धता")}</div>
        </div>
      </div>
      <div className="notice-strip">
        <div className="container notice-inner">
          <span><b>{t("सूचना")}</b> {t("सार्वजनिक सेवा सहज र पारदर्शी बनाउन हामी प्रतिबद्ध छौँ।")}</span>
          <a href="tel:025580000"><Icon name="phone" size={15} /> ०२५-५८००००</a>
        </div>
      </div>
      <header className="masthead">
        <div className="container masthead-inner">
          <Link className="flag-link" href="/" aria-label={t("गृहपृष्ठ")}><NepalFlag label={t("नेपालको झण्डा")} /></Link>
          <Link className="identity" href="/">
            <span className="identity-overline">{t("सुन्दर, समृद्ध र व्यवस्थित शहर")}</span>
            <strong>{t("इटहरी उपमहानगरपालिका")}</strong>
            <span className="identity-subtitle">{t("नगर कार्यपालिकाको कार्यालय")}</span>
            <span className="identity-location">{t("कोशी प्रदेश, सुनसरी, नेपाल · नागरिक सेवा पोर्टल")}</span>
          </Link>
          <Link href="/" className="seal-link" aria-label={t("नेपालको राष्ट्रिय चिन्ह")}><NationalEmblem label={t("नेपालको राष्ट्रिय चिन्ह")} /></Link>
          <button className="mobile-menu-toggle icon-button" type="button" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? t("मेनु बन्द गर्नुहोस्") : t("मेनु खोल्नुहोस्")} aria-expanded={menuOpen}>
            <Icon name={menuOpen ? "close" : "menu"} />
          </button>
        </div>
      </header>
      <nav className={`main-nav ${menuOpen ? "menu-open" : ""}`}>
        <div className="container nav-inner">
          <div className="nav-links">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`nav-link ${pathname === link.href ? "active" : ""}`}
                onClick={() => setMenuOpen(false)}
              >
                <Icon name={link.icon} size={17} /> {t(link.label)}
              </Link>
            ))}
          </div>
          <div className="nav-actions">
            <button type="button" className="theme-toggle language-toggle" onClick={toggleLanguage} aria-label={`${t("भाषा")}: ${language === "en" ? t("English") : t("नेपाली")}`} title={language === "en" ? t("नेपाली") : t("English")}>
              <span>{language === "en" ? t("नेपाली") : "EN"}</span>
            </button>
            <button type="button" className="theme-toggle" onClick={toggleTheme} aria-label={darkMode ? t("उज्यालो मोड") : t("अँध्यारो मोड")} title={darkMode ? t("उज्यालो मोड") : t("अँध्यारो मोड")}>
              <Icon name={darkMode ? "sun" : "moon"} size={17} /><span>{darkMode ? t("उज्यालो") : t("थिम")}</span>
            </button>
            <Link href="/admin" className={`admin-link ${pathname.startsWith("/admin") ? "active" : ""}`} onClick={() => setMenuOpen(false)}>
              <Icon name="admin" size={17} /> {t("प्रशासक")}
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
}
