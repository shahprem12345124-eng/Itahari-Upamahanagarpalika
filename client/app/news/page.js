"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import Icon from "../components/Icon";
import { apiRequest, imageUrl } from "../../lib/api";
import { demoNews } from "../../lib/demoNews";
import { useLanguage } from "../components/LanguageProvider";

const categories = ["सबै", "सूचना", "नगर समाचार", "सेवा जानकारी"];

export default function NewsPage() {
  const { language, t } = useLanguage();
  const [items, setItems] = useState(demoNews);
  const [category, setCategory] = useState("सबै");
  const [query, setQuery] = useState("");
  const [usingDemo, setUsingDemo] = useState(true);

  useEffect(() => {
    apiRequest("/news")
      .then((result) => {
        if (Array.isArray(result.data)) {
          setItems(result.data);
          setUsingDemo(false);
        }
      })
      .catch(() => setUsingDemo(true));
  }, []);

  const filtered = useMemo(() => items.filter((item) => {
    const matchesCategory = category === "सबै" || item.category === category;
    const searchText = `${item.title} ${item.titleEn || ""} ${item.summary} ${item.summaryEn || ""} ${item.content || ""} ${item.contentEn || ""} ${item.category}`.toLocaleLowerCase();
    return matchesCategory && searchText.includes(query.toLocaleLowerCase());
  }), [category, items, query]);

  return (
    <div className="container page-container">
      <section className="page-hero news-page-hero">
        <div>
          <span className="eyebrow"><Icon name="news" size={15} /> {t("सूचना केन्द्र")}</span>
          <h1>{t("समाचार तथा")} <span>{t("सूचनाहरू")}</span></h1>
          <p>{t("इटहरी उपमहानगरपालिकाका गतिविधि, सार्वजनिक सूचना र नागरिक सेवासम्बन्धी जानकारी।")}</p>
        </div>
        <div className="page-hero-art"><div className="news-hero-icon"><Icon name="news" size={38} /></div><span className="hero-art-dot dot-one" /><span className="hero-art-dot dot-two" /></div>
      </section>

      {usingDemo && <div className="inline-notice"><Icon name="info" size={17} /> {t("हाल प्रदर्शनका लागि नमुना सूचनाहरू देखाइएका छन्. वास्तविक सूचना हेर्न API सर्भर र डाटाबेस चलाउनुहोस्।")}</div>}

      <div className="news-toolbar">
        <div className="category-pills" role="group" aria-label={t("समाचार वर्ग")}>
          {categories.map((item) => <button key={item} type="button" className={`category-pill ${category === item ? "selected" : ""}`} onClick={() => setCategory(item)}>{t(item)}</button>)}
        </div>
        <label className="search-field"><Icon name="search" size={18} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t("सूचना खोज्नुहोस्...")} aria-label={t("सूचना खोज्नुहोस्")} /></label>
      </div>

      {filtered.length ? <div className="news-grid news-list-grid">
        {filtered.map((item, index) => (
          <article className="news-card" key={item._id || item.title}>
            {item.image ? <div className="news-card-image"><Image src={imageUrl(item.image)} alt="" width={900} height={600} unoptimized /></div> : <div className={`news-visual tone-${item.tone || ["red", "green", "blue"][index % 3]}`}><span className="news-visual-mark"><Icon name="building" size={30} /></span><span className="news-category">{t(item.category || "सूचना")}</span></div>}
            <div className="news-card-body">
              <span className="news-date"><Icon name="clock" size={14} /> {formatDate(item.createdAt, language, t)}</span>
              <h2>{language === "en" ? item.titleEn || item.title : item.title}</h2><p>{language === "en" ? item.summaryEn || item.summary : item.summary}</p>
              {(language === "en" ? item.contentEn || item.content : item.content) && <details className="news-detail"><summary>{t("थप जानकारी पढ्नुहोस्")}</summary><p>{language === "en" ? item.contentEn || item.content : item.content}</p></details>}
            </div>
          </article>
        ))}
      </div> : <div className="empty-state"><span className="empty-state-icon"><Icon name="search" size={25} /></span><h2>{t("सूचना भेटिएन")}</h2><p>{t("अर्को शब्द प्रयोग गर्नुहोस् वा फरक वर्ग छान्नुहोस्।")}</p></div>}
    </div>
  );
}

function formatDate(value, language, t) {
  if (!value) return t("२०८३ वैशाख १८");
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? value : parsed.toLocaleDateString(language === "en" ? "en-US" : "ne-NP");
}
