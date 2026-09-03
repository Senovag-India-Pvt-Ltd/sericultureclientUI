import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import translations from "./translations.json";
import { APP_ROUTES } from "../../config/appRoutes";
import "./Home.Page.css";


const splitTitle = (title = "") => {
  const idx = title.lastIndexOf(", ");
  if (idx === -1) return [title, ""];
  return [title.substring(0, idx), title.substring(idx + 2)];
};

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
    case "totalRegisteredRSP":
      return "🤝";
    case "totalRegisteredNSSO":
      return "🏛️";
    case "totalRegisteredCRC":
      return "🏢";
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
  "totalRegisteredRSP",
  "totalRegisteredNSSO",
  "totalRegisteredCRC",
  "totalFarms",
  "totalGrainages",
  "totalMarkets",
  "schemesOnlineServices",
  "totalBeneficiaryApplications",
  "totalAmountDisbursed",
];

const dummyMetrics = {
  totalRegisteredFarmers: "—",
  totalRegisteredReelers: "—",
  totalRegisteredTraders: "—",
  totalRegisteredRSP: "—",
  totalRegisteredNSSO: "—",
  totalRegisteredCRC: "—",
  totalFarms: "—",
  totalGrainages: "—",
  totalMarkets: "—",
  schemesOnlineServices: "—",
  totalBeneficiaryApplications: "—",
  totalAmountDisbursed: "—",
};

// === Live metric API config ====================================================
// One dedicated count endpoint backs the Statistics panel — a single
// pre-aggregated SQL query returning all twelve scalars in one row. Mounted
// under /v1/dashboard/ which the auth module's SecurityConfig permits without
// a JWT, so the public landing page can call it directly. Master-data tables
// live in the same database so they're folded into this single query.
const REGISTRATION_BASE = process.env.REACT_APP_API_BASE_URL_REGISTRATION || "/farmer-registration/v1/";

// Indian-locale grouping ("1,27,760"). Numbers >= 1 stay integer; falsy/NaN → "—".
const formatNumber = (value) => {
  if (value === null || value === undefined) return "—";
  const num = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(num)) return "—";
  return new Intl.NumberFormat("en-IN").format(Math.round(num));
};

// SQL Server lowercases result-set column names by default, but be tolerant of
// camelCase too in case anyone changes the backend later.
const pickNum = (obj, ...keys) => {
  if (!obj) return 0;
  for (const k of keys) {
    const v = obj[k] ?? obj[k.toLowerCase()] ?? obj[k.toUpperCase()];
    if (v !== undefined && v !== null && v !== "") {
      const n = Number(v);
      if (Number.isFinite(n)) return n;
    }
  }
  return 0;
};

const fetchJson = async (url, signal) => {
  const res = await fetch(url, { signal, cache: "no-store" });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
};

const photoFlashImages = [
  withBasePath("/images/mulberry-field.jpeg"),
  withBasePath("/images/mulberry-tractor.jpeg"),
  withBasePath("/images/grainage-building.jpeg"),
  withBasePath("/images/cocoon-trays.jpeg"),
  withBasePath("/images/cocoon-market.jpeg"),
  withBasePath("/images/8.jpeg"),
  withBasePath("/images/cocoon-garlands.jpeg"),
  withBasePath("/images/cocoon-decoration.jpeg"),
];

const fallbackPhotoFlashImages = [
  withBasePath("/images/7.jpeg"),
  withBasePath("/images/8.jpeg"),
  withBasePath("/images/12.jpeg"),
  withBasePath("/images/17.jpeg"),
];

const HomePage = () => {
  const [language, setLanguage] = useState("kn");
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
    const controller = new AbortController();
    const { signal } = controller;

    // One endpoint — single SQL query, twelve scalars in one row.
    const loadMetrics = async () => {
      let res = null;
      try {
        res = await fetchJson(`${REGISTRATION_BASE}dashboard/home-stats`, signal);
      } catch {
        return; // network/abort — leave existing values in place
      }

      if (signal.aborted) return;

      setMetrics({
        totalRegisteredFarmers:       formatNumber(pickNum(res, "farmers")),
        totalRegisteredReelers:       formatNumber(pickNum(res, "reelers")),
        totalRegisteredTraders:       formatNumber(pickNum(res, "traders")),
        totalRegisteredRSP:           formatNumber(pickNum(res, "rsp")),
        totalRegisteredNSSO:          formatNumber(pickNum(res, "nsso")),
        totalRegisteredCRC:           formatNumber(pickNum(res, "crc")),
        totalFarms:                   formatNumber(pickNum(res, "farms")),
        totalGrainages:               formatNumber(pickNum(res, "grainages")),
        totalMarkets:                 formatNumber(pickNum(res, "markets")),
        schemesOnlineServices:        formatNumber(pickNum(res, "schemes")),
        totalBeneficiaryApplications: formatNumber(pickNum(res, "beneficiaries")),
        totalAmountDisbursed:         formatNumber(pickNum(res, "disbursed_amount", "disbursedAmount")),
      });
    };

    void loadMetrics();

    // Refresh once a minute so the "LIVE" badge isn't a lie.
    const interval = window.setInterval(() => { void loadMetrics(); }, 60000);

    return () => {
      controller.abort();
      window.clearInterval(interval);
    };
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

  return (
    <div
      className={`home-page ${theme === "night" ? "theme-night" : "theme-day"} ${language === "en" ? "lang-en" : "lang-kn"}`}
      style={{ "--text-scale": textScale }}
    >
      <div className="content-shell">

        {/* ===== UTILITY BAR ===== */}
        <div className="utility-bar">
          <div className="date-time-panel" aria-live="polite">
            <span className="date-day">{dayText}</span>
            <span className="date-full">{dateText}</span>
            <span className="time-live">{timeText}</span>
          </div>

          <div className="right-controls">
            <div className="toggle-control language-toggle-control" role="group" aria-label="Language Toggle">
              <span className="toggle-thumb" style={{ left: languageLeft }} />
              <button type="button" className={language === "kn" ? "active" : ""} onClick={() => setLanguage("kn")}>
                Kannada
              </button>
              <button type="button" className={language === "en" ? "active" : ""} onClick={() => setLanguage("en")}>
                English
              </button>
            </div>

            <div className="toggle-control" role="group" aria-label="Theme Toggle">
              <span className="toggle-thumb" style={{ left: themeLeft }} />
              <button
                type="button"
                className={theme === "day" ? "active" : ""}
                onClick={() => setTheme("day")}
                aria-label="Day Mode"
                title="Day Mode"
              >
                {"☀"}
              </button>
              <button
                type="button"
                className={theme === "night" ? "active" : ""}
                onClick={() => setTheme("night")}
                aria-label="Night Mode"
                title="Night Mode"
              >
                {"🌙"}
              </button>
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

        {/* ===== PORTAL HEADER ===== */}
        <header className="portal-header">
          {/* Left: CM D.K. Shivakumar — photo + name below */}
          <div className="officials-row officials-row--left">
            <div className="header-official header-official--stacked">
              <img className="official-img" src={withBasePath("/images/right-profile.jpeg")} alt={t.right.name} />
              <div className="official-info">
                <h3>{t.right.name}</h3>
                <p className="official-role">{splitTitle(t.right.title)[0]}</p>
                <p className="official-org">{splitTitle(t.right.title)[1]}</p>
              </div>
            </div>
          </div>

          {/* Center: e-Reshme Portal — emblem + text */}
          <div className="header-brand-col header-brand-col--center">
            <img className="emblem-img" src={withBasePath("/images/center-emblem.png")} alt="Portal emblem" />
            <div className="header-title-group">
              <h1>{t.center[0]}</h1>
              <p className="header-subtitle">{t.center[1]}, {t.center[2]}</p>
            </div>
          </div>

          {/* Right: Minister for Sericulture — photo + name below */}
          <div className="officials-row officials-row--right">
            <div className="header-official header-official--stacked">
              <img className="official-img" src={withBasePath("/images/left-profile1.jpeg")} alt={t.extra.name} />
              <div className="official-info">
                {t.extra.name && <h3>{t.extra.name}</h3>}
                <p className="official-role">{splitTitle(t.extra.title)[0]}</p>
                <p className="official-org">{splitTitle(t.extra.title)[1]}</p>
              </div>
            </div>
          </div>
        </header>

        {/* ===== PORTAL NAV BAR ===== */}
        <nav className="portal-nav" role="navigation" aria-label="Main navigation">
          {loginLink && (
            <Link className="nav-item nav-item--login" to={loginLink.href}>
              <span className="nav-item-icon" aria-hidden="true">{getActionIcon("login")}</span>
              {t.actions.login}
            </Link>
          )}

          {applicationStatusLink && (
            <Link className="nav-item" to={applicationStatusLink.href}>
              <span className="nav-item-icon" aria-hidden="true">{getActionIcon("applicationStatus")}</span>
              {t.actions.applicationStatus}
            </Link>
          )}

          {otherLinks.map((action) => (
            <a key={action.key} className="nav-item" href={action.href} target="_blank" rel="noreferrer">
              <span className="nav-item-icon" aria-hidden="true">{getActionIcon(action.key)}</span>
              {t.actions[action.key]}
            </a>
          ))}

          <a className="nav-item" href="tel:08024413900">
            <span className="nav-item-icon" aria-hidden="true">{getActionIcon("helpline")}</span>
            {t.actions.helpline}: <span className="helpline-num">080 2441 3900</span>
          </a>
        </nav>

        {/* ===== MAIN BODY: two-column ===== */}
        <div className="portal-body">

          {/* LEFT: Photo Slideshow */}
          <div className="slideshow-col">
            <div className="photo-stage">
              <img
                src={photoSrc}
                alt={`${t.actions.photoFlash} ${activePhoto + 1}`}
                onError={() => setUseFallbackPhotos(true)}
              />
            </div>
            <p className="photo-caption">{t.center[1]} — {t.center[2]}</p>
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
          </div>

          {/* RIGHT: Statistics Panel */}
          <div className="stats-col">
            <div className="stats-panel">
              <div className="stats-panel-header">
                <span className="stats-panel-title">Statistics</span>
                <span className="stats-panel-badge">LIVE</span>
              </div>
              <div className="metrics-list">
                <div className="metrics-scroll-inner">
                  {metricDefinitions.map((metric) => (
                    <div key={metric.key} className="metric-row">
                      <div className="metric-row-left">
                        <span className="metric-row-icon" aria-hidden="true">{getMetricIcon(metric.key)}</span>
                        <span className="metric-row-label">{metric.label}</span>
                      </div>
                      <strong className="metric-row-value">{metrics[metric.key] ?? "--"}</strong>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* ===== FOOTER ===== */}
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
