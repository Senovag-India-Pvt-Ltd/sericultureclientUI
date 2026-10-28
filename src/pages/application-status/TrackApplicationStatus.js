import { useRef, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Icon } from "../../components";
import CreditedBankDetailsButton from "../direct-benefit-transfer/CreditedBankDetailsButton";
import { APP_ROUTES } from "../../config/appRoutes";

const baseURLDBT = process.env.REACT_APP_API_BASE_URL_DBT;

// New citizen status page (Seva Sindhu work). The existing DbtApplicationStatusCheck page and its
// API are untouched; this page uses the new dbt endpoint dashboard/application-status/track.
//
// Public page: call without the shared `api` instance so a stale login token in localStorage
// is never sent (the auth layer answers a bad Bearer token with 403 even on public endpoints).
const publicApi = axios.create({ timeout: 20000 });

const SEARCH_TYPES = [
  {
    id: "ARN",
    label: "Application Number",
    short: "Application No.",
    placeholder: "e.g. SD000012345",
    hint: "The application (ARN) number on your acknowledgement.",
    inputMode: "text",
    maxLength: 30,
    validate: (v) => (/^[A-Za-z0-9][A-Za-z0-9/-]{3,29}$/.test(v) ? "" : "Enter the application number exactly as printed, for example SD000012345."),
  },
  {
    id: "GSC",
    label: "Seva Sindhu Application No.",
    short: "Seva Sindhu No.",
    placeholder: "Seva Sindhu application number",
    hint: "Only for applications submitted through Seva Sindhu.",
    inputMode: "text",
    maxLength: 50,
    validate: (v) => (/^[A-Za-z0-9/-]{4,50}$/.test(v) ? "" : "Enter a valid Seva Sindhu application number (letters and numbers only)."),
  },
];

// statusCategory from the backend (ApplicationStatusCategory) -> badge tone, icon and citizen message.
const STATUS_UI = {
  NOT_SUBMITTED: { tone: "warn", icon: "file-docs", text: "Your Seva Sindhu request has been received, but the application has not been submitted yet. Please complete it from Seva Sindhu." },
  SUBMITTED: { tone: "info", icon: "file-docs", text: "Your application has been received and is waiting to be processed." },
  IN_PROGRESS: { tone: "info", icon: "clock", text: "Your application is being processed by the department." },
  ON_HOLD: { tone: "warn", icon: "pause-circle", text: "Your application is currently on hold. Please contact your nearest Sericulture office for details." },
  APPROVED: { tone: "ok", icon: "check-circle", text: "Your subsidy has been sanctioned. The payment will be processed through DBT." },
  PAYMENT_PROCESSING: { tone: "info", icon: "money", text: "The sanctioned amount is being processed for payment through DBT." },
  PAYMENT_FAILED: { tone: "bad", icon: "alert-circle", text: "The payment could not be completed. Please contact your nearest Sericulture office or the helpline 080 2441 3900." },
  COMPLETED: { tone: "ok", icon: "check-circle-fill", text: "The payment has been credited to your bank account." },
  REJECTED: { tone: "bad", icon: "cross-circle", text: "Your application was not approved." },
};

const ERROR_UI = {
  NOT_FOUND: { icon: "search", title: "No application found", text: "No application matches this number and mobile number. Please check both and try again.", retry: false },
  INVALID_INPUT: { icon: "alert-circle", title: "Please check the details", text: "", retry: false },
  TOO_MANY_REQUESTS: { icon: "clock", title: "Too many attempts", text: "Please wait a minute and try again.", retry: true },
  SERVICE_UNAVAILABLE: { icon: "alert-circle", title: "Service temporarily unavailable", text: "We could not fetch the status right now. Please try again in a little while.", retry: true },
  NETWORK: { icon: "wifi-off", title: "Could not connect", text: "Please check your internet connection and try again.", retry: true },
  TIMEOUT: { icon: "clock", title: "The request took too long", text: "The service did not respond in time. Please try again.", retry: true },
};

function toError(err) {
  if (axios.isCancel(err)) return null;
  if (err.code === "ECONNABORTED" || err.code === "ETIMEDOUT") return { code: "TIMEOUT" };
  const res = err.response;
  if (!res) return { code: "NETWORK" };
  const code = res.data?.code;
  if (code && ERROR_UI[code]) return { code, message: res.data?.message };
  if (res.status === 404) return { code: "NOT_FOUND" };
  if (res.status === 429) return { code: "TOO_MANY_REQUESTS" };
  return { code: "SERVICE_UNAVAILABLE" };
}

function Detail({ icon, label, value }) {
  if (!value) return null;
  return (
    <div className="as-detail">
      <dt><Icon name={icon} /> {label}</dt>
      <dd>{value}</dd>
    </div>
  );
}

function ResultCard({ app }) {
  const ui = STATUS_UI[app.statusCategory] || STATUS_UI.IN_PROGRESS;
  const title = app.componentName || app.subSchemeName || app.schemeName || "Application";
  const isPaid = (app.applicationStatus || "").trim().toUpperCase() === "PAYMENT SUCCESS IN DBT";
  return (
    <article className="as-result" aria-label={`Application ${app.arn || app.gscNumber || ""}`}>
      <header className="as-result-hd">
        <div className="as-result-title">
          <span className="as-result-icon" aria-hidden="true"><Icon name="file-docs" /></span>
          <div>
            <h3>{title}</h3>
            {app.schemeName && app.schemeName !== title && <p>{app.schemeName}</p>}
          </div>
        </div>
        <span className={`as-badge as-tone-${ui.tone}`}>
          <Icon name={ui.icon} /> {app.statusLabel || "Under Process"}
        </span>
      </header>

      <div className={`as-note as-tone-${ui.tone}`} role="status">
        <Icon name={ui.icon} className="as-note-icon" />
        <div>
          <p>{ui.text}</p>
          {app.currentStage && (
            <p className="as-note-sub">Current stage: <strong>{app.currentStage}</strong></p>
          )}
          {app.statusCategory === "REJECTED" && app.rejectionReason && (
            <p className="as-note-sub">Reason: <strong>{app.rejectionReason}</strong></p>
          )}
        </div>
      </div>

      <dl className="as-details">
        <Detail icon="file-docs" label="Application No." value={app.arn} />
        <Detail icon="list-index" label="Seva Sindhu No." value={app.gscNumber} />
        <Detail icon="user" label="Applicant" value={app.applicantName} />
        <Detail icon="layers" label="Scheme" value={app.schemeName} />
        <Detail icon="layers" label="Sub-scheme" value={app.subSchemeName !== title ? app.subSchemeName : null} />
        <Detail icon="money" label="Subsidy amount" value={app.schemeAmount ? `₹ ${Number(app.schemeAmount).toLocaleString("en-IN")}` : null} />
        <Detail icon="calendar" label="Submitted on" value={app.submittedDate} />
        <Detail icon="clock" label="Last updated" value={app.lastUpdatedDate} />
      </dl>

      {isPaid && app.arn && (
        <div className="as-result-ft">
          <CreditedBankDetailsButton arn={app.arn} />
        </div>
      )}
    </article>
  );
}

function TrackApplicationStatus() {
  const [searchType, setSearchType] = useState("ARN");
  const [value, setValue] = useState("");
  const [mobile, setMobile] = useState("");
  const [touched, setTouched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [applications, setApplications] = useState([]);
  const controllerRef = useRef(null);
  const resultsRef = useRef(null);
  const inputRef = useRef(null);

  const type = SEARCH_TYPES.find((s) => s.id === searchType);
  const trimmed = value.trim();
  const fieldError = !trimmed ? `Please enter your ${type.label.toLowerCase()}.` : type.validate(trimmed);
  const showFieldError = touched && fieldError;
  const mobileTrimmed = mobile.trim();
  const mobileError = !mobileTrimmed ? "Please enter your registered mobile number." : /^[6-9]\d{9}$/.test(mobileTrimmed) ? "" : "Enter a valid 10-digit mobile number.";
  const showMobileError = touched && mobileError;
  const mobileRef = useRef(null);

  const chooseType = (id) => {
    setSearchType(id);
    setValue("");
    setTouched(false);
    setError(null);
    setApplications([]);
    inputRef.current?.focus();
  };

  const onChange = (e) => {
    setValue(e.target.value.slice(0, type.maxLength));
  };

  const search = async () => {
    setTouched(true);
    if (fieldError) {
      inputRef.current?.focus();
      return;
    }
    if (mobileError) {
      mobileRef.current?.focus();
      return;
    }
    if (loading) return;
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;
    setLoading(true);
    setError(null);
    setApplications([]);
    try {
      const res = await publicApi.post(
        baseURLDBT + "dashboard/application-status/track",
        { searchType, value: trimmed, mobileNumber: mobileTrimmed },
        { signal: controller.signal }
      );
      const list = res.data?.applications || [];
      if (list.length === 0) setError({ code: "NOT_FOUND" });
      else setApplications(list);
    } catch (err) {
      const e = toError(err);
      if (e) setError(e);
    } finally {
      if (controllerRef.current === controller) {
        setLoading(false);
        setTimeout(() => resultsRef.current?.focus(), 0);
      }
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    search();
  };

  const reset = () => {
    controllerRef.current?.abort();
    setValue("");
    setMobile("");
    setTouched(false);
    setLoading(false);
    setError(null);
    setApplications([]);
    inputRef.current?.focus();
  };

  const errUi = error ? ERROR_UI[error.code] || ERROR_UI.SERVICE_UNAVAILABLE : null;

  return (
    <>
      <style>{`
        .as-page {
          --as-primary: #176b45;
          --as-primary-dark: #0f4f33;
          --as-primary-soft: #e8f3ec;
          --as-accent: #f2b544;
          --as-ink: #1d2a23;
          --as-muted: #5f6d65;
          --as-line: #dbe5de;
          --as-bg: #f4f7f5;
          --as-surface: #ffffff;
          --as-info: #1f5fa8; --as-info-bg: #e9f1fb;
          --as-ok: #157a43; --as-ok-bg: #e6f4ec;
          --as-warn: #8a5a00; --as-warn-bg: #fff4dc;
          --as-bad: #b42318; --as-bad-bg: #fdecea;
          min-height: 100vh;
          background: var(--as-bg);
          color: var(--as-ink);
          font-family: "Poppins", "Segoe UI", Tahoma, sans-serif;
          padding-bottom: 48px;
        }
        .as-page *, .as-page *::before, .as-page *::after { box-sizing: border-box; }
        .as-page :focus-visible { outline: 3px solid var(--as-accent); outline-offset: 2px; }

        .as-topbar { background: var(--as-surface); border-bottom: 1px solid var(--as-line); }
        .as-topbar-in { max-width: 920px; margin: 0 auto; padding: 10px 16px; display: flex; align-items: center; gap: 12px; }
        .as-topbar img { width: 44px; height: 44px; object-fit: contain; }
        .as-org { flex: 1; min-width: 0; line-height: 1.25; }
        .as-org strong { display: block; font-size: 0.95rem; color: var(--as-primary-dark); }
        .as-org span { font-size: 0.78rem; color: var(--as-muted); }
        .as-home { display: inline-flex; align-items: center; gap: 6px; padding: 8px 12px; border-radius: 8px; color: var(--as-primary); font-weight: 600; font-size: 0.85rem; text-decoration: none; white-space: nowrap; }
        .as-home:hover { background: var(--as-primary-soft); color: var(--as-primary-dark); }

        .as-wrap { max-width: 920px; margin: 0 auto; padding: 0 16px; }
        .as-hero { display: flex; align-items: center; gap: 16px; padding: 28px 0 20px; }
        .as-hero-icon { flex-shrink: 0; width: 56px; height: 56px; border-radius: 16px; background: var(--as-primary); color: #fff; display: grid; place-items: center; font-size: 1.6rem; box-shadow: 0 6px 16px rgba(23,107,69,0.25); }
        .as-hero h1 { margin: 0; font-size: 1.6rem; font-weight: 700; color: var(--as-ink); line-height: 1.2; }
        .as-hero p { margin: 4px 0 0; color: var(--as-muted); font-size: 0.95rem; }

        .as-card { background: var(--as-surface); border: 1px solid var(--as-line); border-radius: 16px; box-shadow: 0 4px 18px rgba(20,50,35,0.06); padding: 22px; }
        .as-legend { font-size: 0.9rem; font-weight: 600; margin: 0 0 10px; padding: 0; }
        .as-types { border: 0; margin: 0 0 18px; padding: 0; min-width: 0; }
        .as-types-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; }
        .as-type { position: relative; }
        .as-type input { position: absolute; opacity: 0; inset: 0; margin: 0; cursor: pointer; }
        .as-type label { display: flex; align-items: center; justify-content: center; text-align: center; min-height: 48px; padding: 8px 10px; border: 1.5px solid var(--as-line); border-radius: 10px; font-size: 0.86rem; font-weight: 600; color: var(--as-muted); cursor: pointer; background: #fff; transition: all .15s; }
        .as-type input:checked + label { border-color: var(--as-primary); background: var(--as-primary-soft); color: var(--as-primary-dark); }
        .as-type input:focus-visible + label { outline: 3px solid var(--as-accent); outline-offset: 2px; }

        .as-field label { display: block; font-size: 0.9rem; font-weight: 600; margin-bottom: 6px; }
        .as-field .as-req { color: var(--as-bad); }
        .as-input { width: 100%; height: 50px; padding: 0 14px; border: 1.5px solid var(--as-line); border-radius: 10px; font-size: 1rem; font-family: inherit; color: var(--as-ink); background: #fff; }
        .as-input:focus { border-color: var(--as-primary); outline: none; box-shadow: 0 0 0 3px rgba(23,107,69,0.15); }
        .as-input[aria-invalid="true"] { border-color: var(--as-bad); }
        .as-hint { margin: 6px 0 0; font-size: 0.8rem; color: var(--as-muted); }
        .as-err { margin: 6px 0 0; font-size: 0.82rem; color: var(--as-bad); display: flex; align-items: center; gap: 6px; }

        .as-actions { display: flex; gap: 10px; margin-top: 18px; }
        .as-btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; height: 48px; padding: 0 22px; border-radius: 10px; font-size: 0.95rem; font-weight: 600; font-family: inherit; cursor: pointer; border: 1.5px solid transparent; transition: background .15s, opacity .15s; }
        .as-btn-primary { background: var(--as-primary); color: #fff; flex: 1; }
        .as-btn-primary:hover:not(:disabled) { background: var(--as-primary-dark); }
        .as-btn-primary:disabled { opacity: .7; cursor: progress; }
        .as-btn-ghost { background: #fff; color: var(--as-primary); border-color: var(--as-line); }
        .as-btn-ghost:hover { background: var(--as-primary-soft); }
        .as-spin { width: 18px; height: 18px; border: 2.5px solid rgba(255,255,255,.4); border-top-color: #fff; border-radius: 50%; animation: as-spin .8s linear infinite; }
        @keyframes as-spin { to { transform: rotate(360deg); } }

        .as-out { margin-top: 22px; outline: none; }
        .as-loading { display: flex; align-items: center; gap: 10px; color: var(--as-muted); font-size: 0.92rem; margin-bottom: 12px; }
        .as-loading .as-spin { border-color: var(--as-line); border-top-color: var(--as-primary); }
        .as-skel { background: var(--as-surface); border: 1px solid var(--as-line); border-radius: 16px; padding: 22px; }
        .as-skel i { display: block; height: 14px; border-radius: 6px; background: linear-gradient(90deg, #edf2ee 25%, #f6f9f7 50%, #edf2ee 75%); background-size: 200% 100%; animation: as-shimmer 1.2s infinite; margin-bottom: 12px; }
        @keyframes as-shimmer { to { background-position: -200% 0; } }
        @media (prefers-reduced-motion: reduce) { .as-skel i, .as-spin { animation: none; } }

        .as-msg { display: flex; gap: 14px; align-items: flex-start; background: var(--as-surface); border: 1px solid var(--as-line); border-radius: 16px; padding: 20px; }
        .as-msg-icon { flex-shrink: 0; width: 44px; height: 44px; border-radius: 12px; display: grid; place-items: center; font-size: 1.3rem; background: var(--as-warn-bg); color: var(--as-warn); }
        .as-msg h2 { margin: 0 0 4px; font-size: 1.05rem; font-weight: 700; }
        .as-msg p { margin: 0; color: var(--as-muted); font-size: 0.9rem; }
        .as-msg .as-btn { margin-top: 12px; height: 40px; padding: 0 16px; }

        .as-count { font-size: 0.9rem; color: var(--as-muted); margin: 0 0 10px; }
        .as-result { background: var(--as-surface); border: 1px solid var(--as-line); border-radius: 16px; box-shadow: 0 4px 18px rgba(20,50,35,0.06); padding: 20px; margin-bottom: 14px; }
        .as-result-hd { display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; flex-wrap: wrap; }
        .as-result-title { display: flex; gap: 12px; min-width: 0; flex: 1; }
        .as-result-icon { flex-shrink: 0; width: 40px; height: 40px; border-radius: 10px; background: var(--as-primary-soft); color: var(--as-primary); display: grid; place-items: center; font-size: 1.15rem; }
        .as-result-title h3 { margin: 0; font-size: 1rem; font-weight: 700; line-height: 1.35; }
        .as-result-title p { margin: 2px 0 0; font-size: 0.82rem; color: var(--as-muted); }
        .as-badge { display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px; border-radius: 999px; font-size: 0.8rem; font-weight: 700; white-space: nowrap; }
        .as-tone-info { background: var(--as-info-bg); color: var(--as-info); }
        .as-tone-ok { background: var(--as-ok-bg); color: var(--as-ok); }
        .as-tone-warn { background: var(--as-warn-bg); color: var(--as-warn); }
        .as-tone-bad { background: var(--as-bad-bg); color: var(--as-bad); }
        .as-note { display: flex; gap: 10px; margin: 16px 0; padding: 12px 14px; border-radius: 12px; font-size: 0.9rem; }
        .as-note p { margin: 0; color: var(--as-ink); }
        .as-note .as-note-sub { margin-top: 4px; }
        .as-note-icon { font-size: 1.2rem; margin-top: 1px; }
        .as-details { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0 24px; margin: 0; }
        .as-detail { padding: 10px 0; border-bottom: 1px dashed var(--as-line); min-width: 0; }
        .as-detail dt { font-size: 0.76rem; color: var(--as-muted); font-weight: 500; display: flex; align-items: center; gap: 6px; }
        .as-detail dd { margin: 3px 0 0; font-size: 0.92rem; font-weight: 600; overflow-wrap: anywhere; }
        .as-result-ft { margin-top: 14px; }

        .as-help { margin-top: 22px; display: flex; gap: 10px; align-items: flex-start; font-size: 0.85rem; color: var(--as-muted); }
        .as-help a { color: var(--as-primary); font-weight: 600; }

        @media (max-width: 720px) {
          .as-types-grid { grid-template-columns: repeat(2, 1fr); }
          .as-details { grid-template-columns: 1fr; }
        }
        @media (max-width: 480px) {
          .as-hero { padding: 20px 0 16px; gap: 12px; }
          .as-hero-icon { width: 46px; height: 46px; font-size: 1.3rem; border-radius: 13px; }
          .as-hero h1 { font-size: 1.3rem; }
          .as-hero p { font-size: 0.86rem; }
          .as-card, .as-result { padding: 16px; border-radius: 14px; }
          .as-actions { flex-direction: column-reverse; }
          .as-actions .as-btn { width: 100%; flex: none; }
          .as-org span { display: none; }
          .as-home span { display: none; }
        }
      `}</style>

      <div className="as-page">
        <div className="as-topbar">
          <div className="as-topbar-in">
            <img src={process.env.PUBLIC_URL + "/images/logo/KG.png"} alt="Government of Karnataka emblem" />
            <div className="as-org">
              <strong>Department of Sericulture</strong>
              <span>Government of Karnataka · e-Reshme Portal</span>
            </div>
            <Link to={APP_ROUTES.home} className="as-home" aria-label="Back to home page">
              <Icon name="arrow-left" /> <span>Home</span>
            </Link>
          </div>
        </div>

        <main className="as-wrap">
          <div className="as-hero">
            <div className="as-hero-icon" aria-hidden="true"><Icon name="file-docs" /></div>
            <div>
              <h1>Check Application Status</h1>
              <p>Track the current status of your application using the required application details.</p>
            </div>
          </div>

          <form className="as-card" noValidate onSubmit={onSubmit} aria-labelledby="as-form-title">
            <fieldset className="as-types">
              <legend id="as-form-title" className="as-legend">Search by</legend>
              <div className="as-types-grid">
              {SEARCH_TYPES.map((s) => (
                <div className="as-type" key={s.id}>
                  <input
                    type="radio"
                    id={`as-type-${s.id}`}
                    name="as-search-type"
                    value={s.id}
                    checked={searchType === s.id}
                    onChange={() => chooseType(s.id)}
                    disabled={loading}
                  />
                  <label htmlFor={`as-type-${s.id}`}>{s.short}</label>
                </div>
              ))}
              </div>
            </fieldset>

            <div className="as-field">
              <label htmlFor="as-value">
                {type.label} <span className="as-req" aria-hidden="true">*</span>
              </label>
              <input
                ref={inputRef}
                id="as-value"
                className="as-input"
                type="text"
                inputMode={type.inputMode}
                autoComplete="off"
                autoCapitalize="characters"
                spellCheck={false}
                maxLength={type.maxLength}
                placeholder={type.placeholder}
                value={value}
                onChange={onChange}
                onBlur={() => trimmed && setTouched(true)}
                aria-required="true"
                aria-invalid={showFieldError ? "true" : "false"}
                aria-describedby={showFieldError ? "as-value-err" : "as-value-hint"}
              />
              {showFieldError ? (
                <p id="as-value-err" className="as-err" role="alert"><Icon name="alert-circle" /> {fieldError}</p>
              ) : (
                <p id="as-value-hint" className="as-hint">{type.hint}</p>
              )}
            </div>

            <div className="as-field" style={{ marginTop: 14 }}>
              <label htmlFor="as-mobile">
                Registered mobile number <span className="as-req" aria-hidden="true">*</span>
              </label>
              <input
                ref={mobileRef}
                id="as-mobile"
                className="as-input"
                type="text"
                inputMode="numeric"
                autoComplete="tel-national"
                maxLength={10}
                placeholder="10-digit mobile number"
                value={mobile}
                onChange={(e) => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))}
                aria-required="true"
                aria-invalid={showMobileError ? "true" : "false"}
                aria-describedby={showMobileError ? "as-mobile-err" : "as-mobile-hint"}
              />
              {showMobileError ? (
                <p id="as-mobile-err" className="as-err" role="alert"><Icon name="alert-circle" /> {mobileError}</p>
              ) : (
                <p id="as-mobile-hint" className="as-hint">The mobile number registered with the Department of Sericulture. Used only to confirm it is your application.</p>
              )}
            </div>

            <div className="as-actions">
              <button type="button" className="as-btn as-btn-ghost" onClick={reset}>
                <Icon name="reload" /> Clear
              </button>
              <button type="submit" className="as-btn as-btn-primary" disabled={loading} aria-busy={loading}>
                {loading ? <span className="as-spin" aria-hidden="true" /> : <Icon name="search" />}
                {loading ? "Checking..." : "Check Status"}
              </button>
            </div>
          </form>

          <section className="as-out" ref={resultsRef} tabIndex={-1} aria-live="polite" aria-label="Application status result">
            {loading && (
              <>
                <div className="as-loading"><span className="as-spin" aria-hidden="true" /> Fetching your application status...</div>
                <div className="as-skel" aria-hidden="true">
                  <i style={{ width: "55%" }} /><i style={{ width: "35%" }} /><i style={{ width: "90%", height: 40 }} /><i style={{ width: "70%" }} /><i style={{ width: "60%", marginBottom: 0 }} />
                </div>
              </>
            )}

            {!loading && errUi && (
              <div className="as-msg" role="alert">
                <div className="as-msg-icon" aria-hidden="true"><Icon name={errUi.icon} /></div>
                <div>
                  <h2>{errUi.title}</h2>
                  <p>{error.code === "INVALID_INPUT" ? error.message : errUi.text}</p>
                  {errUi.retry && (
                    <button type="button" className="as-btn as-btn-ghost" onClick={search}>
                      <Icon name="reload" /> Try again
                    </button>
                  )}
                </div>
              </div>
            )}

            {!loading && applications.length > 0 && (
              <>
                <p className="as-count">
                  {applications.length === 1 ? "1 application found" : `${applications.length} applications found`}
                </p>
                {applications.map((app, i) => (
                  <ResultCard key={`${app.arn || app.gscNumber || "app"}-${i}`} app={app} />
                ))}
              </>
            )}
          </section>

          <div className="as-help">
            <Icon name="info" />
            <span>
              Need help? Call the Sericulture helpline <a href="tel:08024413900">080 2441 3900</a>.
            </span>
          </div>
        </main>
      </div>
    </>
  );
}

export default TrackApplicationStatus;
