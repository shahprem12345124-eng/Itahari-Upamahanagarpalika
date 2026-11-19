"use client";

import Link from "next/link";
import Icon from "./Icon";
import { useLanguage } from "./LanguageProvider";

export default function SiteFooter() {
  const { t } = useLanguage();
  return (
    <footer className="site-footer">
      <div className="container footer-main">
        <div className="footer-brand">
          <span className="footer-brand-icon"><Icon name="building" size={23} /></span>
          <div><strong>{t("इटहरी उपमहानगरपालिका")}</strong><span>{t("नगर कार्यपालिकाको कार्यालय")} · {t("सुनसरी, नेपाल")}</span></div>
        </div>
        <div className="footer-links">
          <Link href="/news">{t("सूचना तथा समाचार")}</Link>
          <Link href="/tourist-places">{t("पर्यटन स्थल")}</Link>
          <Link href="/complaint">{t("गुनासो दर्ता")}</Link>
          <Link href="/about">{t("हाम्रो बारेमा")}</Link>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container footer-bottom-inner">
          <span>© २०८३ {t("इटहरी उपमहानगरपालिका")} · {t("सर्वाधिकार सुरक्षित")}</span>
          <span className="footer-credit"><Icon name="heart" size={13} /> {t("नागरिक सेवाका लागि समर्पित")}</span>
        </div>
      </div>
    </footer>
  );
}
