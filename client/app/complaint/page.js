"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import Icon from "../components/Icon";
import { apiRequest } from "../../lib/api";
import { useLanguage } from "../components/LanguageProvider";

const wards = Array.from({ length: 20 }, (_, index) => `वडा नं. ${index + 1}`);
const departments = ["सडक तथा भौतिक पूर्वाधार", "खानेपानी तथा सरसफाइ", "स्वास्थ्य सेवा", "शिक्षा", "फोहोर व्यवस्थापन", "वातावरण तथा विपद्", "अन्य"];

export default function ComplaintPage() {
  const { language, t } = useLanguage();
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [status, setStatus] = useState({ type: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const imageInput = useRef(null);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  async function submitComplaint(event) {
    event.preventDefault();
    const form = event.currentTarget;
    setSubmitting(true);
    setStatus({ type: "", message: "" });

    try {
      const body = new FormData(form);
      body.delete("image");
      if (image) body.append("image", image);
      await apiRequest("/complaints", { method: "POST", body });
      form.reset();
      setImage(null);
      setPreview("");
      setStatus({ type: "success", message: t("तपाईंको गुनासो सफलतापूर्वक दर्ता भयो। आवश्यक परेमा सम्बन्धित शाखाले तपाईंलाई सम्पर्क गर्नेछ।") });
    } catch (error) {
      setStatus({ type: "error", message: `${t(error.message)} — ${t("कृपया API सर्भर जाँच गर्नुहोस् वा पछि पुनः प्रयास गर्नुहोस्।")}` });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="container page-container">
      <section className="page-hero complaint-page-hero">
        <div><span className="eyebrow"><Icon name="form" size={15} /> {t("नागरिकको आवाज")}</span><h1>{t("तपाईंको गुनासो,")}<br /><span>{t("हाम्रो प्राथमिकता।")}</span></h1><p>{t("समस्या वा सुझाव हामीसँग साझा गर्नुहोस्। तपाईंको जानकारी सम्बन्धित शाखामा पठाइनेछ।")}</p></div>
        <div className="complaint-hero-mark"><span className="complaint-mark-ring"><Icon name="send" size={37} /></span><span className="complaint-mark-spark spark-one">✦</span><span className="complaint-mark-spark spark-two">✦</span></div>
      </section>
      <div className="complaint-layout">
        <section className="panel complaint-form-panel">
          <div className="panel-heading">
            <span className="panel-heading-icon red"><Icon name="form" size={21} /></span>
            <div><h2>{t("अनलाइन गुनासो तथा सुझाव फारम")}</h2><p>{t("ताराङ्कित (*) भएका विवरणहरू अनिवार्य छन्।")}</p></div>
          </div>
          {status.message && <div className={`form-alert ${status.type}`} role="status"><Icon name={status.type === "success" ? "check" : "info"} size={18} /> {status.message}</div>}
          <form onSubmit={submitComplaint} className="complaint-form">
            <div className="form-grid">
              <label className="field"><span>{t("पूरा नाम")} <b>*</b></span><input name="fullName" type="text" placeholder={t("तपाईंको नाम")} required maxLength={100} /></label>
              <label className="field"><span>{t("मोबाइल / फोन नम्बर")} <b>*</b></span><input name="phone" type="tel" placeholder={language === "en" ? "98XXXXXXXX" : "९८XXXXXXXX"} required pattern="[0-9०-९+\-\s]{7,20}" title={t("वैध फोन नम्बर लेख्नुहोस्")} /></label>
              <label className="field"><span>{t("वडा छान्नुहोस्")} <b>*</b></span><select name="ward" required defaultValue=""><option value="" disabled>{t("-- वडा छान्नुहोस् --")}</option>{wards.map((ward, index) => <option key={ward} value={ward}>{language === "en" ? `Ward No. ${index + 1}` : ward}</option>)}</select></label>
              <label className="field"><span>{t("समस्याको विषय")} <b>*</b></span><select name="department" required defaultValue=""><option value="" disabled>{t("-- सम्बन्धित शाखा छान्नुहोस् --")}</option>{departments.map((department) => <option key={department} value={department}>{t(department)}</option>)}</select></label>
              <label className="field full-width"><span>{t("समस्या / सुझावको विस्तृत विवरण")} <b>*</b></span><textarea name="details" placeholder={t("आफ्नो समस्या वा सुझाव यहाँ स्पष्टसँग लेख्नुहोस्...")} rows={5} required minLength={10} maxLength={3000} /></label>
              <div className="field full-width">
                <span className="field-label">{t("सम्बन्धित तस्बिर")} <small>{t("(वैकल्पिक, अधिकतम ५ MB)")}</small></span>
                <label className="upload-field">
                  <input ref={imageInput} type="file" accept="image/png,image/jpeg,image/webp" onChange={(event) => {
                    const file = event.target.files?.[0] || null;
                    if (file && file.size > 5 * 1024 * 1024) {
                      event.target.value = "";
                      setImage(null);
                      setPreview("");
                      setStatus({ type: "error", message: t("तस्बिरको आकार ५ MB भन्दा कम हुनुपर्छ।") });
                      return;
                    }
                    setStatus({ type: "", message: "" });
                    setImage(file);
                    setPreview(file ? URL.createObjectURL(file) : "");
                  }} />
                  {preview ? <Image src={preview} alt={t("अपलोड गर्न लागिएको तस्बिर")} className="upload-preview" width={900} height={500} unoptimized /> : <span className="upload-empty"><Icon name="image" size={23} /><span><strong>{t("तस्बिर छान्नुहोस्")}</strong><small>{t("JPG, PNG वा WEBP")}</small></span><Icon name="upload" size={19} /></span>}
                </label>
                {image && <button className="remove-file" type="button" onClick={() => { setImage(null); setPreview(""); if (imageInput.current) imageInput.current.value = ""; }}>{t("तस्बिर हटाउनुहोस्")}</button>}
              </div>
            </div>
            <button type="submit" className="button button-primary submit-button" disabled={submitting}><Icon name={submitting ? "clock" : "send"} size={18} />{submitting ? t("पठाइँदैछ...") : t("गुनासो पेश गर्नुहोस्")}</button>
            <p className="form-privacy"><Icon name="admin" size={14} /> {t("तपाईंका विवरण गुनासो सम्बोधन गर्न मात्र प्रयोग गरिनेछ।")}</p>
          </form>
        </section>
        <aside className="complaint-aside">
          <section className="emergency-card">
            <span className="emergency-overline"><span className="emergency-dot" /> {t("तत्काल सहायता")}</span><h2>{t("सम्पर्कमा रहनुहोस्")}</h2><p>{t("आकस्मिक सहायता वा गुनासो प्रक्रियाका लागि फोन गर्नुहोस्।")}</p>
            <div className="emergency-lines">
              <a href="tel:100"><span className="contact-icon police">100</span><span><small>{t("नेपाल प्रहरी")}</small><strong>१००</strong></span><Icon name="arrow" className="contact-arrow" size={16} /></a>
              <a href="tel:101"><span className="contact-icon fire">101</span><span><small>{t("दमकल सेवा")}</small><strong>१०१</strong></span><Icon name="arrow" className="contact-arrow" size={16} /></a>
              <a href="tel:102"><span className="contact-icon ambulance">102</span><span><small>{t("एम्बुलेन्स")}</small><strong>१०२</strong></span><Icon name="arrow" className="contact-arrow" size={16} /></a>
              <a href="tel:025580000"><span className="contact-icon"><Icon name="phone" size={17} /></span><span><small>{t("नगरपालिका")}</small><strong>०२५-५८००००</strong></span><Icon name="arrow" className="contact-arrow" size={16} /></a>
            </div>
          </section>
          <section className="panel help-panel"><span className="help-panel-icon"><Icon name="info" size={20} /></span><h3>{t("गुनासो दर्ता गरेपछि")}</h3><p>{t("तपाईंको विवरण सम्बन्धित शाखामा पठाइनेछ। आफ्नो फोन खुला राख्नुहोस्, आवश्यक परेमा थप जानकारीका लागि सम्पर्क गरिनेछ।")}</p></section>
        </aside>
      </div>
    </div>
  );
}
