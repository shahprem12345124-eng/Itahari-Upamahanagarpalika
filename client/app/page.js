"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import Icon from "./components/Icon";
import { apiRequest, imageUrl } from "../lib/api";
import { demoNews } from "../lib/demoNews";
import { useLanguage } from "./components/LanguageProvider";

const services = [
  { icon: "form", title: "अनलाइन गुनासो", detail: "समस्या तथा सुझाव दर्ता", href: "/complaint", color: "red" },
  { icon: "news", title: "सूचना तथा समाचार", detail: "नगरका नयाँ अपडेटहरू", href: "/news", color: "blue" },
  { icon: "building", title: "नगरपालिका परिचय", detail: "हाम्रो सेवा र जिम्मेवारी", href: "/about", color: "green" },
];

const quickFacts = [
  { icon: "users", value: "२०", englishValue: "20", label: "वडा कार्यालय" },
  { icon: "building", value: "२४/७", englishValue: "24/7", label: "नागरिक सेवा" },
  { icon: "heart", value: "समर्पित", englishValue: "Dedicated", label: "जनताको सेवामा" },
];

export default function Home() {
  const { language, t } = useLanguage();
  const [news, setNews] = useState(demoNews);
  const [settings, setSettings] = useState({});
  const [usingDemo, setUsingDemo] = useState(true);

  useEffect(() => {
    apiRequest("/news")
      .then((result) => {
        if (Array.isArray(result.data)) {
          setNews(result.data.slice(0, 3));
          setUsingDemo(false);
        }
      })
      .catch(() => setUsingDemo(true));
    apiRequest("/settings")
      .then((result) => setSettings(result.data || {}))
      .catch(() => {});
  }, []);
  const mayorName = language === "en"
    ? settings.mayorNameEn || settings.mayorName || t("नगर प्रमुख")
    : settings.mayorName || t("नगर प्रमुख");
  const mayorTitle = language === "en"
    ? settings.mayorTitleEn || settings.mayorTitle || t("जनप्रतिनिधि")
    : settings.mayorTitle || t("जनप्रतिनिधि");
  const mayorBio = language === "en"
    ? settings.mayorBioEn || settings.mayorBio || t("“पारदर्शी, प्रविधिमैत्री र उत्तरदायी नगरसेवा हाम्रो लक्ष्य हो। नागरिकको साथ र सक्रिय सहभागिताले समृद्ध इटहरी निर्माण गर्न सकिन्छ।”")
    : settings.mayorBio || t("“पारदर्शी, प्रविधिमैत्री र उत्तरदायी नगरसेवा हाम्रो लक्ष्य हो। नागरिकको साथ र सक्रिय सहभागिताले समृद्ध इटहरी निर्माण गर्न सकिन्छ।”");
  const mayorContact = language === "en" ? settings.mayorContactEn || settings.mayorContact : settings.mayorContact;

  return (
    <>
      <section className="container home-intro">
        <div className="intro-copy">
          <span className="eyebrow"><span className="eyebrow-line" /> {t("नागरिक सेवा पोर्टल")}</span>
          <h1>{t("हाम्रो शहर,")}<br /><span>{t("हाम्रो साझा जिम्मेवारी।")}</span></h1>
          <p>{t("इटहरी उपमहानगरपालिकाका सेवा, सूचना र नागरिक गुनासो अब एउटै डिजिटल माध्यममा। तपाईंको आवाजले हाम्रो शहरलाई अझ राम्रो बनाउँछ।")}</p>
          <div className="intro-actions">
            <Link href="/complaint" className="button button-primary"><Icon name="send" size={17} /> {t("गुनासो दर्ता गर्नुहोस्")}</Link>
            <Link href="/about" className="button button-quiet">{t("हाम्रो बारेमा")} <Icon name="arrow" size={17} /></Link>
          </div>
          <div className="home-facts">
            {quickFacts.map((fact) => <div className="fact" key={fact.label}><span className="fact-icon"><Icon name={fact.icon} size={16} /></span><span><strong>{language === "en" ? fact.englishValue : fact.value}</strong><small>{t(fact.label)}</small></span></div>)}
          </div>
        </div>
        <div className="home-art">
          <Image
            src="/itahari-city.png"
            alt={t("इटहरी शहरको हवाई दृश्य")}
            fill
            priority
            sizes="(max-width: 680px) 100vw, 50vw"
            className="home-art-image"
          />
        </div>
      </section>

      {usingDemo && <div className="container"><div className="inline-notice"><Icon name="info" size={17} /> {t("API सर्भर उपलब्ध नभएकाले नमुना सूचनाहरू देखाइएका छन्। वास्तविक समाचार र सेवाका लागि Express API तथा MongoDB चलाउनुहोस्।")}</div></div>}

      <section className="container mayor-section">
        <div className="mayor-card">
          <div className="mayor-profile">
            <div className="mayor-photo-frame">
              <Image src={settings.mayorImage ? imageUrl(settings.mayorImage) : "/mayor-placeholder.svg"} alt={t("नगर प्रमुख")} className="mayor-photo" width={120} height={120} unoptimized />
            </div>
            <strong>{mayorName}</strong>
            <span className="mayor-role"><Icon name="users" size={14} /> {mayorTitle}</span>
          </div>
          <div className="mayor-message">
            <span className="quote-label">{t("नगर प्रमुखको सन्देश")}</span>
            <blockquote>{mayorBio}</blockquote>
            {mayorContact && <p className="mayor-contact">{t("सम्पर्क विवरण")}: {mayorContact}</p>}
            <div className="mayor-values"><span><Icon name="check" size={15} /> {t("सुशासन र जवाफदेहिता")}</span><span><Icon name="check" size={15} /> {t("डिजिटल नागरिक सेवा")}</span><span><Icon name="check" size={15} /> {t("समावेशी विकास")}</span></div>
          </div>
        </div>
      </section>

      <section className="container section-block services-section">
        <div className="section-heading">
          <div><span className="eyebrow">{t("सजिलो सेवा")}</span><h2>{t("तपाईंका लागि डिजिटल सेवाहरू")}</h2></div>
          <Link href="/about" className="text-link">{t("सबै सेवा हेर्नुहोस्")} <Icon name="arrow" size={16} /></Link>
        </div>
        <div className="service-grid">
          {services.map((service) => (
            <Link className="service-card" href={service.href} key={service.title}>
              <span className={`service-icon ${service.color}`}><Icon name={service.icon} size={22} /></span>
              <span className="service-copy"><strong>{t(service.title)}</strong><small>{t(service.detail)}</small></span>
              <Icon name="chevron" className="service-arrow" size={18} />
            </Link>
          ))}
        </div>
      </section>

      <section className="container section-block home-lower">
        <div className="news-column">
          <div className="section-heading">
            <div><span className="eyebrow">{t("नगरका गतिविधि")}</span><h2>{t("ताजा सूचना तथा समाचार")}</h2></div>
            <Link href="/news" className="text-link">{t("सबै समाचार")} <Icon name="arrow" size={16} /></Link>
          </div>
          <div className="news-grid">
            {news.slice(0, 3).map((item, index) => (
              <article className="news-card" key={item._id || item.title}>
                <div className={`news-visual tone-${item.tone || ["red", "green", "blue"][index % 3]}`}>
                  <span className="news-visual-mark"><Icon name="building" size={28} /></span>
                  <span className="news-category">{t(item.category || "सूचना")}</span>
                </div>
                <div className="news-card-body">
                  <span className="news-date"><Icon name="clock" size={14} /> {formatDate(item.createdAt, language, t)}</span>
                  <h3>{language === "en" ? item.titleEn || item.title : item.title}</h3>
                  <p>{language === "en" ? item.summaryEn || item.summary : item.summary}</p>
                  <Link href="/news" className="news-more">{t("थप पढ्नुहोस्")} <Icon name="arrow" size={15} /></Link>
                </div>
              </article>
            ))}
          </div>
        </div>
        <aside className="emergency-card">
          <span className="emergency-overline"><span className="emergency-dot" /> {t("नागरिक सहायता")}</span>
          <h2>{t("हामी यहाँ छौँ,")}<br />{t("तपाईंको सेवामा।")}</h2>
          <p>{t("सेवाका बारेमा जानकारी वा तत्काल सहायता चाहिएमा हामीलाई सम्पर्क गर्नुहोस्।")}</p>
          <div className="emergency-lines">
            <a href="tel:025580000"><span className="contact-icon"><Icon name="phone" size={17} /></span><span><small>{t("नगरपालिका सम्पर्क")}</small><strong>०२५-५८००००</strong></span><Icon name="arrow" className="contact-arrow" size={16} /></a>
            <a href="mailto:info@itaharimun.gov.np"><span className="contact-icon"><Icon name="send" size={17} /></span><span><small>{t("इमेल")}</small><strong>info@itaharimun.gov.np</strong></span><Icon name="arrow" className="contact-arrow" size={16} /></a>
          </div>
          <Link href="/complaint" className="emergency-action">{t("समस्या दर्ता गर्नुहोस्")} <Icon name="arrow" size={16} /></Link>
        </aside>
      </section>
    </>
  );
}

function formatDate(value, language, t) {
  if (!value) return t("२०८३ वैशाख १८");
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? value : parsed.toLocaleDateString(language === "en" ? "en-US" : "ne-NP");
}
