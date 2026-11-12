"use client";

import Link from "next/link";
import Icon from "../components/Icon";
import { useLanguage } from "../components/LanguageProvider";

const values = [
  { icon: "check", title: "पारदर्शिता", text: "नगरका सूचना र सेवामा नागरिकको सहज पहुँच सुनिश्चित गर्ने।" },
  { icon: "heart", title: "नागरिकमैत्री सेवा", text: "सबै नागरिकलाई सम्मानजनक, सरल र समावेशी सेवा प्रदान गर्ने।" },
  { icon: "building", title: "दिगो विकास", text: "योजनाबद्ध र वातावरणमैत्री शहर विकासका लागि सहकार्य गर्ने।" },
];

export default function AboutPage() {
  const { t } = useLanguage();
  return (
    <div className="container page-container">
      <section className="page-hero about-page-hero">
        <div><span className="eyebrow"><Icon name="building" size={15} /> {t("हाम्रो परिचय")}</span><h1>इटहरी,<br /><span>{t("हाम्रो साझा शहर।")}</span></h1><p>{t("कोशी प्रदेशको सुनसरी जिल्लामा अवस्थित इटहरी उपमहानगरपालिका पूर्वी नेपालको महत्वपूर्ण शहरी केन्द्र हो।")}</p></div>
        <div className="about-illustration" aria-hidden="true"><div className="about-circle"><Icon name="building" size={51} /></div><span className="about-star star-a">✦</span><span className="about-star star-b">✦</span><span className="about-orbit" /></div>
      </section>
      <section className="about-content-grid">
        <article className="panel about-story">
          <span className="eyebrow">{t("हाम्रो प्रतिबद्धता")}</span><h2>{t("सेवामुखी शासन, समुन्नत इटहरी")}</h2>
          <p>{t("इटहरी उपमहानगरपालिका नागरिकको जीवनस्तर उकास्ने, स्थानीय पूर्वाधार विकास गर्ने र सबैका लागि समान अवसर सिर्जना गर्ने लक्ष्यका साथ अघि बढिरहेको छ।")}</p>
          <p>{t("यस डिजिटल नागरिक सेवा पोर्टलमार्फत सूचना, सेवा र जनसहभागितालाई एउटै माध्यममा जोड्ने हाम्रो प्रयास हो। नागरिकका सुझाव र गुनासोले सेवा सुधार तथा नगर विकासलाई अझ प्रभावकारी बनाउँछन्।")}</p>
          <Link href="/complaint" className="button button-primary"><Icon name="send" size={17} /> {t("हामीलाई सुझाव दिनुहोस्")}</Link>
        </article>
        <aside className="about-facts">
          <div className="about-fact-card"><span className="fact-icon"><Icon name="building" size={20} /></span><strong>{t("इटहरी")}</strong><small>{t("उपमहानगरपालिका")}</small></div>
          <div className="about-fact-card"><span className="fact-icon"><Icon name="users" size={20} /></span><strong>{t("१९ वडा")}</strong><small>{t("स्थानीय वडा कार्यालय")}</small></div>
          <div className="about-fact-card"><span className="fact-icon"><Icon name="info" size={20} /></span><strong>{t("सुनसरी")}</strong><small>{t("कोशी प्रदेश, नेपाल")}</small></div>
        </aside>
      </section>
      <section className="section-block about-values">
        <div className="section-heading"><div><span className="eyebrow">{t("हाम्रो कार्यदिशा")}</span><h2>{t("हामीले आत्मसात् गरेका मूल्यहरू")}</h2></div></div>
        <div className="value-grid">{values.map((value) => <article className="value-card" key={value.title}><span className="value-icon"><Icon name={value.icon} size={21} /></span><h3>{t(value.title)}</h3><p>{t(value.text)}</p></article>)}</div>
      </section>
    </div>
  );
}
