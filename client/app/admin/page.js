"use client";

import Image from "next/image";
import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import Icon from "../components/Icon";
import { apiRequest, imageUrl } from "../../lib/api";
import { useLanguage } from "../components/LanguageProvider";

const emptyNews = { title: "", titleEn: "", category: "सूचना", summary: "", summaryEn: "", content: "", contentEn: "" };
const emptyTouristPlace = { name: "", nameEn: "", description: "", descriptionEn: "", address: "", addressEn: "" };
const complaintStatuses = {
  pending: "विचाराधीन",
  completed: "सम्पन्न",
  cancelled: "रद्द",
};
const emptyMayorProfile = {
  mayorName: "",
  mayorTitle: "",
  mayorBio: "",
  mayorContact: "",
  mayorNameEn: "",
  mayorTitleEn: "",
  mayorBioEn: "",
  mayorContactEn: "",
};

function subscribeToAdminAccess(callback) {
  window.addEventListener("itahari-admin-access-change", callback);
  return () => window.removeEventListener("itahari-admin-access-change", callback);
}

function getAdminAccess() {
  return window.sessionStorage.getItem("itahari-admin-access") === "granted"
    && Boolean(window.sessionStorage.getItem("itahari-admin-token"));
}

function adminApiRequest(path, options = {}) {
  const token = window.sessionStorage.getItem("itahari-admin-token");
  const headers = new Headers(options.headers);
  headers.set("Authorization", `Bearer ${token || ""}`);
  return apiRequest(path, { ...options, headers });
}

export default function AdminPage() {
  const { language, t } = useLanguage();
  const unlocked = useSyncExternalStore(subscribeToAdminAccess, getAdminAccess, () => false);
  const [password, setPassword] = useState("");
  const [activeTab, setActiveTab] = useState("news");
  const [news, setNews] = useState([]);
  const [touristPlaces, setTouristPlaces] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [complaintFilter, setComplaintFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [pageError, setPageError] = useState("");
  const [pageMessage, setPageMessage] = useState("");
  const [newsEditor, setNewsEditor] = useState(null);
  const [touristPlaceEditor, setTouristPlaceEditor] = useState(null);
  const [complaintDetails, setComplaintDetails] = useState(null);
  const [savingComplaintStatus, setSavingComplaintStatus] = useState("");
  const [savingTouristPlace, setSavingTouristPlace] = useState(false);
  const [mayorImage, setMayorImage] = useState("");
  const [savingMayor, setSavingMayor] = useState(false);
  const [mayorProfile, setMayorProfile] = useState(emptyMayorProfile);
  const [savingProfile, setSavingProfile] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    setPageError("");
    try {
      const [newsResponse, complaintsResponse, settingsResponse, touristPlacesResponse] = await Promise.all([
        apiRequest("/news"),
        adminApiRequest("/complaints"),
        apiRequest("/settings"),
        apiRequest("/tourist-places"),
      ]);
      setNews(newsResponse.data || []);
      setTouristPlaces(touristPlacesResponse.data || []);
      setComplaints(complaintsResponse.data || []);
      setMayorImage(settingsResponse.data?.mayorImage || "");
      setMayorProfile(Object.fromEntries(
        Object.keys(emptyMayorProfile).map((field) => [field, settingsResponse.data?.[field] || ""]),
      ));
    } catch (error) {
      setPageError(`${t(error.message)} — ${t("Express API र MongoDB सर्भर चलिरहेको छ कि जाँच गर्नुहोस्।")}`);
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    if (!unlocked) return undefined;
    const timer = window.setTimeout(() => {
      void loadData();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [loadData, unlocked]);

  async function unlockAdmin(event) {
    event.preventDefault();
    setPageError("");
    setLoading(true);
    try {
      const response = await apiRequest("/admin/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (typeof response.token !== "string" || !response.token) {
        throw new Error("Administrator sign-in did not return a session token.");
      }
      window.sessionStorage.setItem("itahari-admin-token", response.token);
      window.sessionStorage.setItem("itahari-admin-access", "granted");
      window.dispatchEvent(new Event("itahari-admin-access-change"));
      setPassword("");
    } catch (error) {
      setPageError(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function saveNews(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const body = new FormData(form);
    const id = body.get("id");
    body.delete("id");
    try {
      await adminApiRequest(id ? `/news/${id}` : "/news", {
        method: id ? "PUT" : "POST",
        body,
      });
      setNewsEditor(null);
      setPageMessage(t(id ? "समाचार अद्यावधिक भयो।" : "नयाँ समाचार प्रकाशित भयो।"));
      await loadData();
    } catch (error) {
      setPageError(t(error.message));
    }
  }

  async function deleteNews(item) {
    if (!window.confirm(language === "en" ? `Delete "${item.titleEn || item.title}"?` : `"${item.title}" हटाउने हो?`)) return;
    try {
      await adminApiRequest(`/news/${item._id}`, { method: "DELETE" });
      setPageMessage(t("समाचार हटाइयो।"));
      await loadData();
    } catch (error) {
      setPageError(t(error.message));
    }
  }

  async function deleteComplaint(item) {
    if (!window.confirm(language === "en" ? `Delete the complaint from ${item.fullName}?` : `${item.fullName} को गुनासो हटाउने हो?`)) return;
    try {
      await adminApiRequest(`/complaints/${item._id}`, { method: "DELETE" });
      if (complaintDetails?._id === item._id) setComplaintDetails(null);
      setPageMessage(t("गुनासो हटाइयो।"));
      await loadData();
    } catch (error) {
      setPageError(t(error.message));
    }
  }

  async function updateComplaintStatus(item, status) {
    setSavingComplaintStatus(item._id);
    setPageError("");
    try {
      const response = await adminApiRequest(`/complaints/${item._id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      setComplaints((items) => items.map((complaint) => (
        complaint._id === item._id ? response.data : complaint
      )));
      setComplaintDetails((current) => (
        current?._id === item._id ? response.data : current
      ));
      setPageMessage(t("गुनासोको अवस्था अद्यावधिक भयो।"));
    } catch (error) {
      setPageError(t(error.message));
    } finally {
      setSavingComplaintStatus("");
    }
  }

  async function saveTouristPlace(event) {
    event.preventDefault();
    const body = new FormData(event.currentTarget);
    const id = body.get("id");
    body.delete("id");
    setSavingTouristPlace(true);
    setPageError("");
    try {
      await adminApiRequest(id ? `/tourist-places/${id}` : "/tourist-places", {
        method: id ? "PUT" : "POST",
        body,
      });
      setTouristPlaceEditor(null);
      setPageMessage(t(id ? "पर्यटन स्थल अद्यावधिक भयो।" : "नयाँ पर्यटन स्थल थपियो।"));
      await loadData();
    } catch (error) {
      setPageError(t(error.message));
    } finally {
      setSavingTouristPlace(false);
    }
  }

  async function deleteTouristPlace(item) {
    const title = language === "en" ? item.nameEn || item.name : item.name;
    if (!window.confirm(language === "en" ? `Delete "${title}"?` : `"${title}" हटाउने हो?`)) return;
    setPageError("");
    try {
      await adminApiRequest(`/tourist-places/${item._id}`, { method: "DELETE" });
      setPageMessage(t("पर्यटन स्थल हटाइयो।"));
      await loadData();
    } catch (error) {
      setPageError(t(error.message));
    }
  }

  async function showComplaint(item) {
    setPageError("");
    try {
      const response = await adminApiRequest(`/complaints/${item._id}`);
      setComplaintDetails(response.data);
    } catch (error) {
      setPageError(t(error.message));
    }
  }

  async function uploadMayorImage(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    setSavingMayor(true);
    setPageError("");
    try {
      const body = new FormData();
      body.append("image", file);
      const response = await adminApiRequest("/settings/mayor-image", { method: "PUT", body });
      setMayorImage(response.data.mayorImage);
      setPageMessage(t("नगर प्रमुखको तस्बिर परिवर्तन भयो।"));
    } catch (error) {
      setPageError(t(error.message));
    } finally {
      setSavingMayor(false);
      event.target.value = "";
    }
  }

  async function saveMayorProfile(event) {
    event.preventDefault();
    setSavingProfile(true);
    setPageError("");
    try {
      const response = await adminApiRequest("/settings/mayor-profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mayorProfile),
      });
      setMayorProfile(Object.fromEntries(
        Object.keys(emptyMayorProfile).map((field) => [field, response.data?.[field] || ""]),
      ));
      setPageMessage(t("प्रोफाइल सुरक्षित भयो।"));
    } catch (error) {
      setPageError(t(error.message));
    } finally {
      setSavingProfile(false);
    }
  }

  function updateMayorProfile(field, value) {
    setMayorProfile((profile) => ({ ...profile, [field]: value }));
  }

  const complaintStatusCounts = complaints.reduce((counts, complaint) => {
    const status = complaint.status || "pending";
    counts[status] = (counts[status] || 0) + 1;
    return counts;
  }, { pending: 0, completed: 0, cancelled: 0 });
  const filteredComplaints = complaintFilter === "all"
    ? complaints
    : complaints.filter((complaint) => (complaint.status || "pending") === complaintFilter);

  if (!unlocked) {
    return (
      <div className="container admin-gate-wrap">
        <section className="admin-gate panel">
          <div className="admin-gate-icon"><Icon name="admin" size={27} /></div>
          <span className="eyebrow">{t("प्रशासक क्षेत्र")}</span>
          <h1>{t("प्रशासक प्यानलमा प्रवेश")}</h1>
          <p>{t("जारी राख्न नगरपालिकाको प्रशासक पासफ्रेज प्रविष्ट गर्नुहोस्।")}</p>
          {pageError && <div className="form-alert error" role="alert"><Icon name="info" size={17} /> {pageError}</div>}
          <form onSubmit={unlockAdmin} className="admin-gate-form">
            <label className="field"><span>{t("पासफ्रेज")}</span><input type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required autoFocus /></label>
            <button type="submit" className="button button-primary submit-button" disabled={loading}>{loading ? t("जाँच हुँदैछ...") : t("प्रवेश गर्नुहोस्")} <Icon name="arrow" size={17} /></button>
          </form>
          <div className="demo-disclaimer"><Icon name="info" size={15} /> {t("प्रशासकीय अनुरोधहरू समयसीमित टोकनद्वारा सुरक्षित छन्। पासफ्रेज गोप्य राख्नुहोस्।")}</div>
        </section>
      </div>
    );
  }

  return (
    <div className="container page-container admin-container">
      <section className="admin-heading">
        <div><span className="eyebrow"><Icon name="admin" size={15} /> {t("व्यवस्थापन")}</span><h1>{t("प्रशासक")} <span>{t("प्यानल")}</span></h1><p>{t("नगरका सूचना र नागरिक गुनासो व्यवस्थापन गर्नुहोस्।")}</p></div>
        <button type="button" className="button button-secondary" onClick={() => { window.sessionStorage.removeItem("itahari-admin-access"); window.sessionStorage.removeItem("itahari-admin-token"); window.dispatchEvent(new Event("itahari-admin-access-change")); }}><Icon name="close" size={16} /> {t("बाहिरिनुहोस्")}</button>
      </section>

      <div className="admin-stat-grid">
        <div className="admin-stat-card"><span className="admin-stat-icon blue"><Icon name="news" size={19} /></span><span><strong>{news.length}</strong><small>{t("प्रकाशित समाचार")}</small></span></div>
        <div className="admin-stat-card"><span className="admin-stat-icon red"><Icon name="form" size={19} /></span><span><strong>{complaints.length}</strong><small>{t("प्राप्त गुनासो")}</small></span></div>
        <div className="admin-stat-card"><span className="admin-stat-icon green"><Icon name="check" size={19} /></span><span><strong>{t("सक्रिय")}</strong><small>{t("नागरिक सेवा पोर्टल")}</small></span></div>
      </div>

      <div className="complaint-stat-grid" aria-label={t("गुनासोको अवस्था सारांश")}>
        <button type="button" className={`complaint-stat-card ${complaintFilter === "all" ? "selected" : ""}`} onClick={() => { setComplaintFilter("all"); setActiveTab("complaints"); }}>
          <span className="admin-stat-icon blue"><Icon name="form" size={18} /></span><span><strong>{complaints.length}</strong><small>{t("सबै गुनासो")}</small></span>
        </button>
        <button type="button" className={`complaint-stat-card ${complaintFilter === "pending" ? "selected" : ""}`} onClick={() => { setComplaintFilter("pending"); setActiveTab("complaints"); }}>
          <span className="admin-stat-icon amber"><Icon name="clock" size={18} /></span><span><strong>{complaintStatusCounts.pending}</strong><small>{t("विचाराधीन")}</small></span>
        </button>
        <button type="button" className={`complaint-stat-card ${complaintFilter === "completed" ? "selected" : ""}`} onClick={() => { setComplaintFilter("completed"); setActiveTab("complaints"); }}>
          <span className="admin-stat-icon green"><Icon name="check" size={18} /></span><span><strong>{complaintStatusCounts.completed}</strong><small>{t("सम्पन्न")}</small></span>
        </button>
        <button type="button" className={`complaint-stat-card ${complaintFilter === "cancelled" ? "selected" : ""}`} onClick={() => { setComplaintFilter("cancelled"); setActiveTab("complaints"); }}>
          <span className="admin-stat-icon red"><Icon name="close" size={18} /></span><span><strong>{complaintStatusCounts.cancelled}</strong><small>{t("रद्द")}</small></span>
        </button>
      </div>

      {pageError && <div className="form-alert error admin-alert" role="alert"><Icon name="info" size={17} /> {pageError}<button type="button" onClick={() => setPageError("")} aria-label={t("सन्देश बन्द गर्नुहोस्")}><Icon name="close" size={15} /></button></div>}
      {pageMessage && <div className="form-alert success admin-alert" role="status"><Icon name="check" size={17} /> {pageMessage}<button type="button" onClick={() => setPageMessage("")} aria-label={t("सन्देश बन्द गर्नुहोस्")}><Icon name="close" size={15} /></button></div>}

      <div className="admin-workspace panel">
        <div className="admin-tabs" role="tablist">
          <button type="button" role="tab" aria-selected={activeTab === "news"} className={activeTab === "news" ? "selected" : ""} onClick={() => setActiveTab("news")}><Icon name="news" size={17} /> {t("समाचार व्यवस्थापन")}</button>
          <button type="button" role="tab" aria-selected={activeTab === "complaints"} className={activeTab === "complaints" ? "selected" : ""} onClick={() => setActiveTab("complaints")}><Icon name="form" size={17} /> {t("नागरिक गुनासो")} <span className="tab-count">{complaints.length}</span></button>
          <button type="button" role="tab" aria-selected={activeTab === "places"} className={activeTab === "places" ? "selected" : ""} onClick={() => setActiveTab("places")}><Icon name="building" size={17} /> {t("पर्यटन स्थल")}</button>
          <button type="button" role="tab" aria-selected={activeTab === "settings"} className={activeTab === "settings" ? "selected" : ""} onClick={() => setActiveTab("settings")}><Icon name="edit" size={17} /> {t("पोर्टल सेटिङ")}</button>
        </div>

        {activeTab === "news" && <section className="admin-tab-content">
          <div className="admin-section-heading"><div><h2>{t("समाचार तथा सूचनाहरू")}</h2><p>{t("नयाँ सूचना प्रकाशित, सम्पादन वा हटाउनुहोस्।")}</p></div><button type="button" className="button button-primary" onClick={() => setNewsEditor({ ...emptyNews })}><span>＋</span> {t("नयाँ समाचार")}</button></div>
          {loading && !news.length ? <div className="admin-empty">{t("समाचार लोड हुँदैछ...")}</div> : news.length ? <div className="admin-news-list">{news.map((item) => <article className="admin-news-row" key={item._id}><span className="admin-news-icon"><Icon name="news" size={18} /></span><div className="admin-news-copy"><span className="news-category-inline">{t(item.category)}</span><strong>{language === "en" ? item.titleEn || item.title : item.title}</strong><small>{language === "en" ? item.summaryEn || item.summary : item.summary}</small></div><div className="admin-row-actions"><button type="button" className="icon-button action-edit" aria-label={t("सम्पादन")} onClick={() => setNewsEditor({ ...item })}><Icon name="edit" size={17} /></button><button type="button" className="icon-button action-delete" aria-label={t("हटाउनुहोस्")} onClick={() => deleteNews(item)}><Icon name="trash" size={17} /></button></div></article>)}</div> : <div className="admin-empty"><Icon name="news" size={22} /> {t("समाचार छैन। नयाँ समाचार थप्नुहोस्।")}</div>}
        </section>}

        {activeTab === "complaints" && <section className="admin-tab-content">
          <div className="admin-section-heading"><div><h2>{t("नागरिकका गुनासो")}</h2><p>{t("दर्ता भएका समस्या र संलग्न तस्बिरहरू हेर्नुहोस्।")}</p></div><button type="button" className="button button-secondary" onClick={loadData}><Icon name="clock" size={16} /> {t("नवीकरण")}</button></div>
          <div className="complaint-filter-bar" role="group" aria-label={t("गुनासो फिल्टर गर्नुहोस्")}>
            {[["all", "सबै"], ["pending", "विचाराधीन"], ["completed", "सम्पन्न"], ["cancelled", "रद्द"]].map(([value, label]) => (
              <button type="button" key={value} className={complaintFilter === value ? "selected" : ""} onClick={() => setComplaintFilter(value)}>
                {t(label)} <span>{value === "all" ? complaints.length : complaintStatusCounts[value]}</span>
              </button>
            ))}
          </div>
          {loading && !complaints.length ? <div className="admin-empty">{t("गुनासो लोड हुँदैछ...")}</div> : filteredComplaints.length ? <div className="complaint-table-wrap"><table className="complaint-table"><thead><tr><th>{t("नागरिक")}</th><th>{t("वडा / विषय")}</th><th>{t("दर्ता मिति")}</th><th>{t("अवस्था")}</th><th>{t("स्थान")}</th><th>{t("तस्बिर")}</th><th>{t("कार्य")}</th></tr></thead><tbody>{filteredComplaints.map((item) => {
            const status = item.status || "pending";
            return <tr key={item._id}><td><strong>{item.fullName}</strong><small>{item.phone}</small></td><td><strong>{item.ward}</strong><small>{t(item.department)}</small></td><td>{item.createdAt ? new Date(item.createdAt).toLocaleDateString(language === "en" ? "en-US" : "ne-NP") : "—"}</td><td><span className={`complaint-status ${status}`}>{t(complaintStatuses[status] || complaintStatuses.pending)}</span></td><td>{hasComplaintLocation(item.location) ? <a className="complaint-map-link" href={complaintMapUrl(item.location)} target="_blank" rel="noopener noreferrer" aria-label={`${t("नक्सामा स्थान खोल्नुहोस्")}: ${item.fullName}`}><Icon name="mapPin" size={14} /> {t("नक्सा")}</a> : <span className="no-image">—</span>}</td><td>{item.image ? <span className="has-image"><Icon name="image" size={15} /> {t("संलग्न")}</span> : <span className="no-image">{t("छैन")}</span>}</td><td><div className="admin-row-actions"><button type="button" className="icon-button action-view" aria-label={t("गुनासो हेर्नुहोस्")} onClick={() => showComplaint(item)}><Icon name="eye" size={17} /></button><button type="button" className="icon-button action-delete" aria-label={t("गुनासो हटाउनुहोस्")} onClick={() => deleteComplaint(item)}><Icon name="trash" size={17} /></button></div></td></tr>;
          })}</tbody></table></div> : <div className="admin-empty"><Icon name="form" size={22} /> {t("यस अवस्थामा कुनै गुनासो भेटिएन।")}</div>}
        </section>}

        {activeTab === "places" && <section className="admin-tab-content">
          <div className="admin-section-heading"><div><h2>{t("पर्यटन स्थल व्यवस्थापन")}</h2><p>{t("पर्यटन स्थल थप्नुहोस्, विवरण अद्यावधिक गर्नुहोस् वा हटाउनुहोस्।")}</p></div><button type="button" className="button button-primary" onClick={() => setTouristPlaceEditor({ ...emptyTouristPlace })}><span>＋</span> {t("नयाँ पर्यटन स्थल")}</button></div>
          {loading && !touristPlaces.length ? <div className="admin-empty">{t("पर्यटन स्थलहरू लोड हुँदैछन्...")}</div> : touristPlaces.length ? <div className="admin-news-list">{touristPlaces.map((item) => <article className="admin-news-row" key={item._id}><span className="admin-news-icon"><Icon name="building" size={18} /></span><div className="admin-news-copy"><strong>{language === "en" ? item.nameEn || item.name : item.name}</strong><small>{language === "en" ? item.addressEn || item.address || item.descriptionEn || item.description : item.address || item.description}</small></div><div className="admin-row-actions"><button type="button" className="icon-button action-edit" aria-label={t("सम्पादन")} onClick={() => setTouristPlaceEditor({ ...item })}><Icon name="edit" size={17} /></button><button type="button" className="icon-button action-delete" aria-label={t("हटाउनुहोस्")} onClick={() => deleteTouristPlace(item)}><Icon name="trash" size={17} /></button></div></article>)}</div> : <div className="admin-empty"><Icon name="building" size={22} /> {t("अहिलेसम्म कुनै व्यवस्थापित पर्यटन स्थल छैन।")}</div>}
        </section>}

        {activeTab === "settings" && <section className="admin-tab-content">
          <div className="admin-section-heading"><div><h2>{t("पोर्टल सेटिङ")}</h2><p>{t("मुखपृष्ठमा देखिने विवरण")}</p></div></div>
          <div className="mayor-settings">
            <div className="mayor-setting-photo"><Image src={mayorImage ? imageUrl(mayorImage) : "/mayor-placeholder.svg"} alt={t("हालको नगर प्रमुखको तस्बिर")} width={180} height={180} unoptimized /></div>
            <div className="mayor-setting-copy"><strong>{t("नगर प्रमुखको तस्बिर")}</strong><p>{t("स्पष्ट, अगाडिबाट खिचिएको JPG, PNG वा WEBP तस्बिर छान्नुहोस्। अधिकतम ५ MB।")}</p><label className="button button-primary upload-button"><Icon name="upload" size={16} />{savingMayor ? t("अपलोड हुँदैछ...") : t("तस्बिर परिवर्तन गर्नुहोस्")}<input type="file" accept="image/png,image/jpeg,image/webp" onChange={uploadMayorImage} disabled={savingMayor} /></label></div>
          </div>
          <form className="mayor-profile-form" onSubmit={saveMayorProfile}>
            <h3>{t("नेपाली विवरण")}</h3>
            <label className="field"><span>{t("नगर प्रमुखको नाम")}</span><input value={mayorProfile.mayorName} onChange={(event) => updateMayorProfile("mayorName", event.target.value)} maxLength={200} /></label>
            <label className="field"><span>{t("पद")}</span><input value={mayorProfile.mayorTitle} onChange={(event) => updateMayorProfile("mayorTitle", event.target.value)} maxLength={200} /></label>
            <label className="field profile-bio-field"><span>{t("परिचय")}</span><textarea value={mayorProfile.mayorBio} onChange={(event) => updateMayorProfile("mayorBio", event.target.value)} maxLength={2000} rows={3} /></label>
            <label className="field profile-contact-field"><span>{t("सम्पर्क विवरण")}</span><input value={mayorProfile.mayorContact} onChange={(event) => updateMayorProfile("mayorContact", event.target.value)} maxLength={200} /></label>
            <h3>{t("अंग्रेजी विवरण")}</h3>
            <label className="field"><span>{t("नगर प्रमुखको अंग्रेजी नाम")}</span><input value={mayorProfile.mayorNameEn} onChange={(event) => updateMayorProfile("mayorNameEn", event.target.value)} maxLength={200} /></label>
            <label className="field"><span>{t("पदको अंग्रेजी नाम")}</span><input value={mayorProfile.mayorTitleEn} onChange={(event) => updateMayorProfile("mayorTitleEn", event.target.value)} maxLength={200} /></label>
            <label className="field profile-bio-field"><span>{t("परिचय अंग्रेजीमा")}</span><textarea value={mayorProfile.mayorBioEn} onChange={(event) => updateMayorProfile("mayorBioEn", event.target.value)} maxLength={2000} rows={3} /></label>
            <label className="field profile-contact-field"><span>{t("सम्पर्क विवरण अंग्रेजीमा")}</span><input value={mayorProfile.mayorContactEn} onChange={(event) => updateMayorProfile("mayorContactEn", event.target.value)} maxLength={200} /></label>
            <button type="submit" className="button button-primary profile-save" disabled={savingProfile}><Icon name="check" size={16} /> {savingProfile ? t("जाँच हुँदैछ...") : t("परिवर्तन सुरक्षित गर्नुहोस्")}</button>
          </form>
        </section>}
      </div>
      <p className="demo-disclaimer admin-disclaimer"><Icon name="info" size={15} /> {t("पासफ्रेजले यो पृष्ठ मात्र खोल्छ; यो परियोजनामा पूर्ण प्रमाणीकरण वा role-based API सुरक्षा छैन। सार्वजनिक deployment अघि सुरक्षा लागू गर्नुहोस्।")}</p>

      {newsEditor && <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setNewsEditor(null); }}>
        <section className="dialog-card" role="dialog" aria-modal="true" aria-labelledby="news-editor-title">
          <div className="dialog-heading"><div><span className="eyebrow">{t("सामग्री व्यवस्थापन")}</span><h2 id="news-editor-title">{newsEditor._id ? t("समाचार सम्पादन") : t("नयाँ समाचार")}</h2></div><button type="button" className="icon-button" onClick={() => setNewsEditor(null)} aria-label={t("बन्द गर्नुहोस्")}><Icon name="close" /></button></div>
          <form className="admin-news-form" onSubmit={saveNews}>
            {newsEditor._id && <input type="hidden" name="id" value={newsEditor._id} />}
            <label className="field"><span>{t("शीर्षक")} <b>*</b></span><input name="title" defaultValue={newsEditor.title} required maxLength={180} /></label>
            <label className="field"><span>{t("English title")}</span><input name="titleEn" defaultValue={newsEditor.titleEn} maxLength={180} /></label>
            <label className="field"><span>{t("वर्ग")} <b>*</b></span><select name="category" defaultValue={newsEditor.category || "सूचना"} required><option value="सूचना">{t("सूचना")}</option><option value="नगर समाचार">{t("नगर समाचार")}</option><option value="सेवा जानकारी">{t("सेवा जानकारी")}</option></select></label>
            <label className="field"><span>{t("संक्षिप्त विवरण")} <b>*</b></span><textarea name="summary" defaultValue={newsEditor.summary} rows={3} required maxLength={500} /></label>
            <label className="field"><span>{t("English summary")}</span><textarea name="summaryEn" defaultValue={newsEditor.summaryEn} rows={3} maxLength={500} /></label>
            <label className="field"><span>{t("विस्तृत जानकारी")}</span><textarea name="content" defaultValue={newsEditor.content} rows={5} maxLength={8000} /></label>
            <label className="field"><span>{t("English details")}</span><textarea name="contentEn" defaultValue={newsEditor.contentEn} rows={5} maxLength={8000} /></label>
            <label className="field"><span>{t("समाचार तस्बिर")}</span><input type="file" name="image" accept="image/png,image/jpeg,image/webp" /></label>
            {newsEditor.image && <p className="current-image-note"><Icon name="image" size={15} /> {t("हालको तस्बिर छ; नयाँ छानेमा प्रतिस्थापन हुनेछ।")}</p>}
            <div className="dialog-actions"><button type="button" className="button button-secondary" onClick={() => setNewsEditor(null)}>{t("रद्द गर्नुहोस्")}</button><button type="submit" className="button button-primary"><Icon name="check" size={16} /> {t("सुरक्षित गर्नुहोस्")}</button></div>
          </form>
        </section>
      </div>}

      {touristPlaceEditor && <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setTouristPlaceEditor(null); }}>
        <section className="dialog-card" role="dialog" aria-modal="true" aria-labelledby="tourist-place-editor-title">
          <div className="dialog-heading"><div><span className="eyebrow">{t("सामग्री व्यवस्थापन")}</span><h2 id="tourist-place-editor-title">{touristPlaceEditor._id ? t("पर्यटन स्थल सम्पादन") : t("नयाँ पर्यटन स्थल")}</h2></div><button type="button" className="icon-button" onClick={() => setTouristPlaceEditor(null)} aria-label={t("बन्द गर्नुहोस्")}><Icon name="close" /></button></div>
          <form className="admin-news-form" onSubmit={saveTouristPlace}>
            {touristPlaceEditor._id && <input type="hidden" name="id" value={touristPlaceEditor._id} />}
            <label className="field"><span>{t("नाम")} <b>*</b></span><input name="name" defaultValue={touristPlaceEditor.name} required maxLength={180} /></label>
            <label className="field"><span>{t("English name")}</span><input name="nameEn" defaultValue={touristPlaceEditor.nameEn} maxLength={180} /></label>
            <label className="field"><span>{t("विवरण")} <b>*</b></span><textarea name="description" defaultValue={touristPlaceEditor.description} rows={4} required maxLength={4000} /></label>
            <label className="field"><span>{t("English description")}</span><textarea name="descriptionEn" defaultValue={touristPlaceEditor.descriptionEn} rows={4} maxLength={4000} /></label>
            <label className="field"><span>{t("ठेगाना / स्थान")}</span><input name="address" defaultValue={touristPlaceEditor.address} maxLength={300} /></label>
            <label className="field"><span>{t("Address in English")}</span><input name="addressEn" defaultValue={touristPlaceEditor.addressEn} maxLength={300} /></label>
            <label className="field"><span>{t("पर्यटन स्थलको तस्बिर")}</span><input type="file" name="image" accept="image/png,image/jpeg,image/webp" /></label>
            {touristPlaceEditor.image && <p className="current-image-note"><Icon name="image" size={15} /> {t("हालको तस्बिर छ; नयाँ छानेमा प्रतिस्थापन हुनेछ।")}</p>}
            <div className="dialog-actions"><button type="button" className="button button-secondary" onClick={() => setTouristPlaceEditor(null)}>{t("रद्द गर्नुहोस्")}</button><button type="submit" className="button button-primary" disabled={savingTouristPlace}><Icon name="check" size={16} /> {savingTouristPlace ? t("सुरक्षित गर्दै...") : t("सुरक्षित गर्नुहोस्")}</button></div>
          </form>
        </section>
      </div>}

      {complaintDetails && <div className="modal-backdrop complaint-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setComplaintDetails(null); }}>
        <section className="dialog-card complaint-detail-dialog" role="dialog" aria-modal="true" aria-labelledby="complaint-dialog-title">
          <div className="dialog-heading"><div><span className="eyebrow">{t("नागरिक गुनासो")}</span><h2 id="complaint-dialog-title">{t("गुनासोको विवरण")}</h2></div><button type="button" className="icon-button" onClick={() => setComplaintDetails(null)} aria-label={t("बन्द गर्नुहोस्")}><Icon name="close" /></button></div>
          <div className="complaint-detail-content">
            <label className="complaint-status-editor"><span>{t("गुनासोको अवस्था")}</span><select value={complaintDetails.status || "pending"} onChange={(event) => updateComplaintStatus(complaintDetails, event.target.value)} disabled={savingComplaintStatus === complaintDetails._id}><option value="pending">{t(complaintStatuses.pending)}</option><option value="completed">{t(complaintStatuses.completed)}</option><option value="cancelled">{t(complaintStatuses.cancelled)}</option></select></label>
            <div className="complaint-detail-meta"><div><small>{t("नागरिक")}</small><strong>{complaintDetails.fullName}</strong></div><div><small>{t("सम्पर्क नम्बर")}</small><a href={`tel:${complaintDetails.phone}`}>{complaintDetails.phone}</a></div><div><small>{t("वडा")}</small><strong>{complaintDetails.ward}</strong></div><div><small>{t("सम्बन्धित शाखा")}</small><strong>{t(complaintDetails.department)}</strong></div><div><small>{t("दर्ता मिति")}</small><strong>{new Date(complaintDetails.createdAt).toLocaleString(language === "en" ? "en-US" : "ne-NP")}</strong></div><div><small>{t("गुनासोको स्थान")}</small>{hasComplaintLocation(complaintDetails.location) ? <><a className="complaint-detail-map-link" href={complaintMapUrl(complaintDetails.location)} target="_blank" rel="noopener noreferrer"><Icon name="mapPin" size={14} /> {t("नक्सामा हेर्नुहोस्")}</a><small className="complaint-location-coordinates">{complaintDetails.location.latitude.toFixed(5)}, {complaintDetails.location.longitude.toFixed(5)}{Number.isFinite(complaintDetails.location.accuracy) ? ` · ±${Math.round(complaintDetails.location.accuracy)} m` : ""}</small></> : <strong>{t("स्थान प्रदान गरिएको छैन")}</strong>}</div></div>
            <div className="complaint-detail-description"><small>{t("समस्या / सुझावको विवरण")}</small><p>{complaintDetails.details}</p></div>
            <div className="complaint-detail-image">{complaintDetails.image ? <a href={imageUrl(complaintDetails.image)} target="_blank" rel="noreferrer"><Image src={imageUrl(complaintDetails.image)} alt={language === "en" ? `Image attached by ${complaintDetails.fullName}` : `${complaintDetails.fullName} द्वारा संलग्न तस्बिर`} width={1600} height={1000} unoptimized /><span><Icon name="eye" size={15} /> {t("पूरा तस्बिर नयाँ ट्याबमा हेर्नुहोस्")}</span></a> : <div className="no-attachment"><Icon name="image" size={23} /> {t("यो गुनासोसँग तस्बिर संलग्न छैन।")}</div>}</div>
          </div>
          <div className="dialog-actions"><button type="button" className="button button-secondary" onClick={() => setComplaintDetails(null)}>{t("बन्द गर्नुहोस्")}</button><button type="button" className="button button-danger" onClick={() => deleteComplaint(complaintDetails)}><Icon name="trash" size={16} /> {t("गुनासो हटाउनुहोस्")}</button></div>
        </section>
      </div>}
    </div>
  );
}

function hasComplaintLocation(location) {
  return Number.isFinite(location?.latitude) && Number.isFinite(location?.longitude);
}

function complaintMapUrl(location) {
  const coordinates = encodeURIComponent(`${location.latitude},${location.longitude}`);
  return `https://www.google.com/maps/search/?api=1&query=${coordinates}`;
}
