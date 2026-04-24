import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import translations from "./translations.json";
import { APP_ROUTES } from "../../config/appRoutes";
import "./Home.Page.css";


const getActionIcon = (key) => {
  switch (key) {
    case "login":
      return "🔐";
    case "applicationStatus":
      return "📋";
    case "mobileApp":
      return "📱";
    case "website":
      return "🌐";
    case "helpline":
      return "📞";
    default:
      return "🔹";
  }
};

const getMetricIcon = (key) => {
  switch (key) {
    case "totalRegisteredFarmers":
      return "🌾";
    case "totalRegisteredReelers":
      return "🧵";
    case "totalRegisteredTraders":
      return "🏪";
    case "totalRegisteredExternalStakeholders":
      return "🤝";
    case "totalFarms":
      return "🏡";
    case "totalGrainages":
      return "🏭";
    case "totalMarkets":
      return "📍";
    case "schemesOnlineServices":
      return "📄";
    case "totalBeneficiaryApplications":
      return "👥";
    case "totalAmountDisbursed":
      return "💰";
    default:
      return "📊";
  }
};

const content = translations;
const serverTimeApiUrl = process.env.REACT_APP_SERVER_TIME_API_URL ?? "/api/server-time";
const withBasePath = (path) => `${process.env.PUBLIC_URL || ""}${path}`;

const actionLinks = [
  { key: "login", href: APP_ROUTES.login },
  {
    key: "applicationStatus",
    href: APP_ROUTES.applicationStatus,
  },
  {
    key: "mobileApp",
    // href: APP_ROUTES.mobileAppDownload,
    href: "https://e-reshme.karnataka.gov.in/seriui/sericulture.apk",
  },
  { key: "website", href: "https://sericulture.karnataka.gov.in/en" },
];

const metricKeys = [
  "totalRegisteredFarmers",
  "totalRegisteredReelers",
  "totalRegisteredTraders",
  "totalRegisteredExternalStakeholders",
  "totalFarms",
  "totalGrainages",
  "totalMarkets",
  "schemesOnlineServices",
  "totalBeneficiaryApplications",
  "totalAmountDisbursed",
];

const dummyMetrics = {
  totalRegisteredFarmers: "--",
  totalRegisteredReelers: "--",
  totalRegisteredTraders: "--",
  totalRegisteredExternalStakeholders: "--",
  totalFarms: "--",
  totalGrainages: "--",
  totalMarkets: "--",
  schemesOnlineServices: "--",
  totalBeneficiaryApplications: "--",
  totalAmountDisbursed: "--",
};

const photoFlashImages = [
  withBasePath("/images/7.jpeg"),
  withBasePath("/images/8.jpeg"),
  withBasePath("/images/12.jpeg"),
  withBasePath("/images/17.jpeg"),
];

const fallbackPhotoFlashImages = photoFlashImages;

const HomePage = () => {
  const [language, setLanguage] = useState("en");
  const [theme, setTheme] = useState("day");
  const [textScale, setTextScale] = useState(1);
  const [activePhoto, setActivePhoto] = useState(0);
  const [useFallbackPhotos, setUseFallbackPhotos] = useState(false);
  const [now, setNow] = useState(new Date());
  const [serverOffsetMs, setServerOffsetMs] = useState(0);
  const [metrics, setMetrics] = useState(dummyMetrics);
  const t = content[language];
  const metricDefinitions = metricKeys.map((key) => ({ key, label: t.metrics[key] }));

  const visiblePhotos = useMemo(
    () => (useFallbackPhotos ? fallbackPhotoFlashImages : photoFlashImages),
    [useFallbackPhotos],
  );

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActivePhoto((prev) => (prev + 1) % visiblePhotos.length);
    }, 2500);

    return () => window.clearInterval(timer);
  }, [visiblePhotos.length]);

  useEffect(() => {
    const controller = new AbortController();

    const toTimeMs = (value) => {
      if (typeof value === "number" && Number.isFinite(value)) {
        return value;
      }
      if (typeof value === "string" && value.trim()) {
        const parsed = new Date(value).getTime();
        return Number.isFinite(parsed) ? parsed : null;
      }
      return null;
    };

    const parseServerMsFromPayload = (payload) => {
      if (payload && typeof payload === "object") {
        const data = payload;
        return (
          toTimeMs(data.now) ??
          toTimeMs(data.serverTime) ??
          toTimeMs(data.currentTime) ??
          toTimeMs(data.timestamp) ??
          null
        );
      }
      return toTimeMs(payload);
    };

    const syncServerTime = async () => {
      try {
        const response = await fetch(serverTimeApiUrl, {
          signal: controller.signal,
          cache: "no-store",
        });

        const dateHeaderMs = toTimeMs(response.headers.get("date"));
        let serverTimeMs = null;

        if (response.ok) {
          try {
            const payload = await response.json();
            serverTimeMs = parseServerMsFromPayload(payload);
          } catch {
            serverTimeMs = null;
          }
        }

        const resolvedServerMs = serverTimeMs ?? dateHeaderMs;
        if (resolvedServerMs !== null && !controller.signal.aborted) {
          const offset = resolvedServerMs - Date.now();
          setServerOffsetMs(offset);
          setNow(new Date(Date.now() + offset));
        }
      } catch {
        if (!controller.signal.aborted) {
          setServerOffsetMs(0);
        }
      }
    };

    void syncServerTime();
    const resyncTimer = window.setInterval(() => {
      void syncServerTime();
    }, 60000);

    return () => {
      controller.abort();
      window.clearInterval(resyncTimer);
    };
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNow(new Date(Date.now() + serverOffsetMs));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [serverOffsetMs]);

  useEffect(() => {
    setMetrics(dummyMetrics);
  }, []);

  const photoSrc = visiblePhotos[activePhoto];
  const languageLeft = language === "en" ? "82px" : "2px";
  const themeLeft = theme === "day" ? "2px" : "42px";
  const locale = language === "en" ? "en-IN" : "kn-IN";
  const dateLocale = language === "en" ? "en-US" : "kn-IN";
  const dayText = new Intl.DateTimeFormat(locale, { weekday: "long" }).format(now);
  const dateText = new Intl.DateTimeFormat(dateLocale, {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(now);
  const timeText = new Intl.DateTimeFormat(locale, {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  }).format(now);
  const decreaseText = () => setTextScale((prev) => Math.max(0.9, Number((prev - 0.05).toFixed(2))));
  const increaseText = () => setTextScale((prev) => Math.min(1.2, Number((prev + 0.05).toFixed(2))));

  const loginLink = actionLinks.find((action) => action.key === "login");
  const applicationStatusLink = actionLinks.find((action) => action.key === "applicationStatus");
  const otherLinks = actionLinks.filter((action) => action.key !== "login" && action.key !== "applicationStatus");
  const formatGovTitle = (title) => title.replace(", Government of Karnataka", ",\nGovernment of Karnataka");

  return (
    <div
      className={`home-page ${theme === "night" ? "theme-night" : "theme-day"} ${language === "en" ? "lang-en" : "lang-kn"}`}
      style={{ "--text-scale": textScale }}
    >
      <div className="content-shell">
        <div className="top-controls">
          <div className="date-time-panel" aria-live="polite">
            <span className="date-day">{dayText}</span>
            <span className="date-full">{dateText}</span>
            <span className="time-live">{timeText}</span>
          </div>

          <div className="right-controls">
            <div className="lang-toggle-wrap">
              <div className="toggle-control language-toggle-control" role="group" aria-label="Language Toggle">
                <span className="toggle-thumb" style={{ left: languageLeft }} />
                <button type="button" className={language === "kn" ? "active" : ""} onClick={() => setLanguage("kn")}>
                  Kannada
                </button>
                <button type="button" className={language === "en" ? "active" : ""} onClick={() => setLanguage("en")}>
                  English
                </button>
              </div>
            </div>

            <div className="theme-toggle-wrap">
              <div className="toggle-control" role="group" aria-label="Theme Toggle">
                <span className="toggle-thumb" style={{ left: themeLeft }} />
                <button
                  type="button"
                  className={theme === "day" ? "active" : ""}
                  onClick={() => setTheme("day")}
                  aria-label="Day Mode"
                  title="Day Mode"
                >
                  {"\u2600"}
                </button>
                <button
                  type="button"
                  className={theme === "night" ? "active" : ""}
                  onClick={() => setTheme("night")}
                  aria-label="Night Mode"
                  title="Night Mode"
                >
                  {"\uD83C\uDF19"}
                </button>
              </div>
            </div>

            <div className="text-size-control" role="group" aria-label="Text Size">
              <button type="button" onClick={decreaseText} disabled={textScale <= 0.9} aria-label="Decrease Text Size">
                A-
              </button>
              <button type="button" onClick={increaseText} disabled={textScale >= 1.2} aria-label="Increase Text Size">
                A+
              </button>
            </div>
          </div>
        </div>

        <section className="hero-card">
          <article className="profile-block left-corner-block">
            <img className="circle-image" src={withBasePath("/images/left-profile.png")} alt={t.left.name} />
            <h1 style={{ margin: '8px 0 2px', fontSize: 'calc(0.79rem * var(--text-scale))', fontWeight: 900, color: 'var(--blue-dark)', lineHeight: '1.28', fontFamily: 'Arial Black, Impact, Segoe UI, Arial, sans-serif' }}>{t.left.name}</h1>
            <p style={{ margin: 0, fontSize: 'calc(0.79rem * var(--text-scale))', fontWeight: 900, color: 'var(--text-muted)', lineHeight: '1.28', whiteSpace: 'pre-line' ,fontFamily: 'Arial Black, Impact, Segoe UI, Arial, sans-serif' }}>{formatGovTitle(t.left.title)}</p>
          </article>

          <article className="center-block">
            <img className="circle-image center-logo" src={withBasePath("/images/center-emblem.png")} alt="Portal emblem" />
            <h1
              style={{
                margin: '8px 0 2px',
                fontSize: 'calc(1.12rem * var(--text-scale))',
                fontWeight: 900,
                color: 'var(--blue-dark)',
                lineHeight: '1.28',
                // fontFamily: 'Arial Black, Impact, Segoe UI, Arial, sans-serif'
                fontFamily: 'Poppins, Segoe UI, Tahoma, Arial, sans-serif'
              }}
            >
              {t.center[0]}
            </h1>
            <p className="subtitle" style={{ margin: 0, fontSize: 'calc(0.92rem * var(--text-scale))', fontWeight: 900, color: '#174c7d', lineHeight: '1.28',fontFamily: 'Poppins, Segoe UI, Tahoma, Arial, sans-serif' }}>{t.center[1]}</p>
            <p style={{ margin: 0, fontSize: 'calc(0.92rem * var(--text-scale))', fontWeight: 900, color: 'var(--text-muted)', lineHeight: '1.28',fontFamily: 'Poppins, Segoe UI, Tahoma, Arial, sans-serif' }}>{t.center[2]}</p>
          </article>

          <article className="profile-block right-corner-block">
            <img className="circle-image" src={withBasePath("/images/pic.png")} alt={t.extra.name} />
            <h2 style={{ margin: '8px 0 2px', fontSize: 'calc(0.79rem * var(--text-scale))', fontWeight: 900, color: 'var(--blue-dark)', lineHeight: '1.28', fontFamily: 'Poppins, Segoe UI, Tahoma, Arial, sans-serif' }}>{t.extra.name}</h2>
            <p style={{ margin: 0, fontSize: 'calc(0.79rem * var(--text-scale))', fontWeight: 900, color: 'var(--text-muted)', lineHeight: '1.28', whiteSpace: 'pre-line',fontFamily: 'Poppins, Segoe UI, Tahoma, Arial, sans-serif' }}>{formatGovTitle(t.extra.title)}</p>
          </article>
        </section>

        <section className="photo-flash-card">
          <div className="photo-stage">
            <img
              src={photoSrc}
              alt={`${t.actions.photoFlash} ${activePhoto + 1}`}
              onError={() => setUseFallbackPhotos(true)}
            />
          </div>
          <div className="photo-dots">
            {visiblePhotos.map((_, index) => (
              <button
                key={index}
                type="button"
                className={`dot ${index === activePhoto ? "active" : ""}`}
                onClick={() => setActivePhoto(index)}
                aria-label={`photo ${index + 1}`}
              />
            ))}
          </div>
        </section>

        <section className="actions-grid">
          {loginLink && (
            <Link className="action-item action-link" to={loginLink.href}>
              <span className="action-head">
                <span className="action-icon" aria-hidden="true">
                  {getActionIcon("login")}
                </span>
                <span>{t.actions.login}</span>
              </span>
            </Link>
          )}

          {applicationStatusLink && (
            <Link className="action-item action-link" to={applicationStatusLink.href}>
              <span className="action-head">
                <span className="action-icon" aria-hidden="true">
                  {getActionIcon("applicationStatus")}
                </span>
                <span>{t.actions.applicationStatus}</span>
              </span>
            </Link>
          )}

          {otherLinks.map((action) => (
            <a key={action.key} className="action-item action-link" href={action.href} target="_blank" rel="noreferrer">
              <span className="action-head">
                <span className="action-icon" aria-hidden="true">
                  {getActionIcon(action.key)}
                </span>
                <span>{t.actions[action.key]}</span>
              </span>
            </a>
          ))}

          <a className="action-item action-link helpline-link" href="tel:08024413900">
            <span className="action-head">
              <span className="action-icon" aria-hidden="true">
                {getActionIcon("helpline")}
              </span>
              <span>
                {t.actions.helpline}: <span className="helpline-number">080 2441 3900</span>
              </span>
            </span>
          </a>

          {/*
          {metricDefinitions.slice(0, 4).map((metric) => (
            <div key={metric.key} className="action-item metric-item">
              <div className="metric-head">
                <span className="metric-icon" aria-hidden="true">
                  {getMetricIcon(metric.key)}
                </span>
                <span className="metric-label">{metric.label}</span>
              </div>
              <strong className="metric-value">{metrics[metric.key] ?? "--"}</strong>
            </div>
          ))}

          {metricDefinitions.slice(4, 7).map((metric) => (
            <div key={metric.key} className="action-item metric-item">
              <div className="metric-head">
                <span className="metric-icon" aria-hidden="true">
                  {getMetricIcon(metric.key)}
                </span>
                <span className="metric-label">{metric.label}</span>
              </div>
              <strong className="metric-value">{metrics[metric.key] ?? "--"}</strong>
            </div>
          ))}

          {metricDefinitions.slice(7).map((metric) => (
            <div key={metric.key} className="action-item metric-item">
              <div className="metric-head">
                <span className="metric-icon" aria-hidden="true">
                  {getMetricIcon(metric.key)}
                </span>
                <span className="metric-label">{metric.label}</span>
              </div>
              <strong className="metric-value">{metrics[metric.key] ?? "--"}</strong>
            </div>
          ))}
          */}
        </section>

        <footer className="site-footer">
          <span>© Department of Sericulture, Government of Karnataka</span>
          <span className="footer-sep">|</span>
          <span>Designed and Developed by Senovag India Pvt. Ltd.</span>
        </footer>
      </div>
    </div>
  );
};

export default HomePage;

