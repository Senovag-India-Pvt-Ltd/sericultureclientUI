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
    sub: "e-Reshme application number",
    icon: "file-docs",
    placeholder: "e.g. SD000012345 or SSA000000001",
    hint: "The application number printed on your acknowledgement.",
    inputMode: "text",
    maxLength: 30,
    validate: (v) => (/^[A-Za-z0-9][A-Za-z0-9/-]{3,29}$/.test(v) ? "" : "Enter the application number exactly as printed, for example SD000012345."),
  },
  {
    id: "GSC",
    label: "Seva Sindhu Application No.",
    short: "Seva Sindhu No.",
    sub: "For applications made on Seva Sindhu",
    icon: "link",
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

// Progress timeline: which step each status reaches, and whether that step is a problem.
const STEPS = [
  { label: "Submitted", icon: "file-docs" },
  { label: "Under process", icon: "clock" },
  { label: "Sanctioned", icon: "check-circle" },
  { label: "Payment", icon: "money" },
  { label: "Credited", icon: "wallet" },
];
const PROGRESS = {
  SUBMITTED: { at: 0 },
  IN_PROGRESS: { at: 1 },
  ON_HOLD: { at: 1, state: "warn", label: "On hold" },
  REJECTED: { at: 1, state: "bad", label: "Not approved" },
  APPROVED: { at: 2 },
  PAYMENT_PROCESSING: { at: 3 },
  PAYMENT_FAILED: { at: 3, state: "bad", label: "Payment failed" },
  COMPLETED: { at: 4, done: true },
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
      <span className="as-detail-ic" aria-hidden="true"><Icon name={icon} /></span>
      <div style={{ minWidth: 0 }}>
        <dt>{label}</dt>
        <dd>{value}</dd>
      </div>
    </div>
  );
}

function Timeline({ category }) {
  const p = PROGRESS[category];
  if (!p) return null;
  return (
    <ol className="as-timeline" aria-label="Application progress">
      {STEPS.map((s, i) => {
        const done = i < p.at || (p.done && i === p.at);
        const current = i === p.at && !p.done;
        const cls = done ? "is-done" : current ? `is-current${p.state ? ` is-${p.state}` : ""}` : "";
        const label = current && p.label ? p.label : s.label;
        return (
          <li key={s.label} className={cls} aria-current={current ? "step" : undefined}>
            <span className="as-tl-dot" aria-hidden="true">
              <Icon name={done ? "check" : current && p.state === "bad" ? "cross" : current && p.state === "warn" ? "pause" : s.icon} />
            </span>
            <span className="as-tl-label">{label}</span>
          </li>
        );
      })}
    </ol>
  );
}

function ResultCard({ app }) {
  const ui = STATUS_UI[app.statusCategory] || STATUS_UI.IN_PROGRESS;
  const title = app.componentName || app.subSchemeName || app.schemeName || "Application";
  const isPaid = (app.applicationStatus || "").trim().toUpperCase() === "PAYMENT SUCCESS IN DBT";
  return (
    <article className={`as-result as-edge-${ui.tone}`} aria-label={`Application ${app.arn || app.gscNumber || ""}`}>
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

      <Timeline category={app.statusCategory} />

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
        <Detail icon="link" label="Seva Sindhu No." value={app.gscNumber} />
        <Detail icon="user" label="Applicant" value={app.applicantName} />
        <Detail icon="building" label="Scheme" value={app.schemeName} />
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
          --as-primary: #146c43;
          --as-primary-dark: #0b4a2e;
          --as-primary-soft: #e7f4ec;
          --as-teal: #0e7c66;
          --as-accent: #e8a317;
          --as-ink: #14231b;
          --as-muted: #5b6b62;
          --as-line: #dfe8e2;
          --as-bg: #f3f7f4;
          --as-surface: #ffffff;
          --as-info: #1f5fa8; --as-info-bg: #eaf2fc;
          --as-ok: #12784a; --as-ok-bg: #e5f5ec;
          --as-warn: #8a5a00; --as-warn-bg: #fff5de;
          --as-bad: #b42318; --as-bad-bg: #fdecea;
          --as-shadow: 0 1px 2px rgba(16,40,28,.05), 0 8px 24px rgba(16,40,28,.07);
          min-height: 100vh;
          background: var(--as-bg);
          color: var(--as-ink);
          font-family: "Poppins", "Segoe UI", Tahoma, sans-serif;
          padding-bottom: 32px;
        }
        .as-page *, .as-page *::before, .as-page *::after { box-sizing: border-box; }
        .as-page :focus-visible { outline: 3px solid var(--as-accent); outline-offset: 2px; }
        .as-page h1, .as-page h2, .as-page h3 { font-family: inherit; color: var(--as-ink); }

        /* header band */
        .as-band {
          position: relative; overflow: hidden; color: #fff; padding-bottom: 72px;
          background:
            radial-gradient(1200px 300px at 85% -40%, rgba(255,255,255,.14), transparent 60%),
            radial-gradient(600px 240px at 0% 120%, rgba(232,163,23,.18), transparent 60%),
            linear-gradient(120deg, #0b4a2e 0%, #146c43 55%, #0e7c66 100%);
        }
        .as-band::after { content: ""; position: absolute; inset: 0; pointer-events: none; opacity: .08; background-image: radial-gradient(circle at 1px 1px, #fff 1px, transparent 0); background-size: 22px 22px; }
        .as-topbar-in { position: relative; z-index: 1; max-width: 920px; margin: 0 auto; padding: 14px 16px; display: flex; align-items: center; gap: 12px; }
        .as-emblem { width: 48px; height: 48px; border-radius: 50%; background: #fff; display: grid; place-items: center; flex-shrink: 0; box-shadow: 0 4px 12px rgba(0,0,0,.18); }
        .as-emblem img { width: 38px; height: 38px; object-fit: contain; }
        .as-org { flex: 1; min-width: 0; line-height: 1.25; }
        .as-org strong { display: block; font-size: 1rem; color: #fff; }
        .as-org span { font-size: 0.78rem; color: rgba(255,255,255,.82); }
        .as-home { display: inline-flex; align-items: center; gap: 6px; padding: 8px 14px; border-radius: 999px; color: #fff; font-weight: 600; font-size: 0.85rem; text-decoration: none; white-space: nowrap; background: rgba(255,255,255,.14); border: 1px solid rgba(255,255,255,.28); }
        .as-home:hover { background: rgba(255,255,255,.26); color: #fff; }
        .as-heroband { position: relative; z-index: 1; max-width: 920px; margin: 0 auto; padding: 16px 16px 0; }
        .as-heroband h1 { margin: 0; font-size: 1.85rem; font-weight: 700; color: #fff; line-height: 1.2; letter-spacing: -.01em; }
        .as-heroband p { margin: 6px 0 0; color: rgba(255,255,255,.88); font-size: 0.98rem; }

        .as-wrap { position: relative; z-index: 2; max-width: 920px; margin: -52px auto 0; padding: 0 16px; }

        .as-card { background: var(--as-surface); border: 1px solid rgba(20,108,67,.06); border-radius: 18px; box-shadow: var(--as-shadow); padding: 24px; }
        .as-legend { font-size: 0.8rem; font-weight: 700; text-transform: uppercase; letter-spacing: .05em; color: var(--as-primary-dark); margin: 0 0 10px; padding: 0; }
        .as-types { border: 0; margin: 0 0 20px; padding: 0; min-width: 0; }
        .as-types-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; }
        .as-type { position: relative; }
        .as-type input { position: absolute; opacity: 0; inset: 0; margin: 0; cursor: pointer; }
        .as-type label { display: flex; align-items: center; gap: 12px; min-height: 64px; padding: 10px 14px; border: 1.5px solid var(--as-line); border-radius: 14px; cursor: pointer; background: #fff; transition: border-color .15s, background .15s, box-shadow .15s; }
        .as-type-ic { flex-shrink: 0; width: 38px; height: 38px; border-radius: 11px; display: grid; place-items: center; background: #f1f5f2; color: var(--as-muted); font-size: 1.1rem; transition: all .15s; }
        .as-type-txt strong { display: block; font-size: .92rem; color: var(--as-ink); }
        .as-type-txt small { display: block; font-size: .76rem; color: var(--as-muted); margin-top: 1px; }
        .as-type-tick { margin-left: auto; width: 22px; height: 22px; border-radius: 50%; border: 2px solid var(--as-line); display: grid; place-items: center; color: transparent; font-size: .75rem; flex-shrink: 0; }
        .as-type input:checked + label { border-color: var(--as-primary); background: linear-gradient(90deg, #f2faf5, #fff); box-shadow: 0 0 0 4px rgba(20,108,67,.08); }
        .as-type input:checked + label .as-type-ic { background: var(--as-primary); color: #fff; }
        .as-type input:checked + label .as-type-tick { background: var(--as-primary); border-color: var(--as-primary); color: #fff; }
        .as-type input:focus-visible + label { outline: 3px solid var(--as-accent); outline-offset: 2px; }

        .as-fields { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .as-field label { display: block; font-size: 0.88rem; font-weight: 600; margin-bottom: 6px; }
        .as-field .as-req { color: var(--as-bad); }
        .as-inputwrap { position: relative; }
        .as-inputwrap .icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: var(--as-muted); font-size: 1.1rem; pointer-events: none; }
        .as-input { width: 100%; height: 52px; padding: 0 14px 0 42px; border: 1.5px solid var(--as-line); border-radius: 12px; font-size: 1rem; font-family: inherit; color: var(--as-ink); background: #fff; transition: border-color .15s, box-shadow .15s; }
        .as-input:focus { border-color: var(--as-primary); outline: none; box-shadow: 0 0 0 4px rgba(20,108,67,0.12); }
        .as-input[aria-invalid="true"] { border-color: var(--as-bad); }
        .as-hint { margin: 6px 0 0; font-size: 0.78rem; color: var(--as-muted); line-height: 1.4; }
        .as-err { margin: 6px 0 0; font-size: 0.82rem; color: var(--as-bad); display: flex; align-items: center; gap: 6px; }

        .as-actions { display: flex; gap: 10px; margin-top: 20px; }
        .as-btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; height: 52px; padding: 0 22px; border-radius: 12px; font-size: 0.98rem; font-weight: 600; font-family: inherit; cursor: pointer; border: 1.5px solid transparent; transition: box-shadow .15s, background .15s, transform .05s; }
        .as-btn:active:not(:disabled) { transform: translateY(1px); }
        .as-btn-primary { background: linear-gradient(135deg, var(--as-primary), var(--as-teal)); color: #fff; flex: 1; box-shadow: 0 6px 16px rgba(20,108,67,.25); }
        .as-btn-primary:hover:not(:disabled) { box-shadow: 0 8px 22px rgba(20,108,67,.32); }
        .as-btn-primary:disabled { opacity: .7; cursor: progress; }
        .as-btn-ghost { background: #fff; color: var(--as-primary); border-color: var(--as-line); }
        .as-btn-ghost:hover { background: var(--as-primary-soft); }
        .as-spin { width: 18px; height: 18px; border: 2.5px solid rgba(255,255,255,.4); border-top-color: #fff; border-radius: 50%; animation: as-spin .8s linear infinite; }
        @keyframes as-spin { to { transform: rotate(360deg); } }

        .as-trust { display: flex; gap: 16px; flex-wrap: wrap; margin-top: 16px; padding-top: 14px; border-top: 1px solid var(--as-line); font-size: .78rem; color: var(--as-muted); }
        .as-trust span { display: inline-flex; align-items: center; gap: 6px; }
        .as-trust .icon { color: var(--as-primary); }

        .as-out { margin-top: 20px; outline: none; }
        .as-loading { display: flex; align-items: center; gap: 10px; color: var(--as-muted); font-size: 0.92rem; margin-bottom: 12px; }
        .as-loading .as-spin { border-color: var(--as-line); border-top-color: var(--as-primary); }
        .as-skel { background: var(--as-surface); border-radius: 18px; box-shadow: var(--as-shadow); padding: 24px; }
        .as-skel i { display: block; height: 14px; border-radius: 6px; background: linear-gradient(90deg, #edf2ee 25%, #f6f9f7 50%, #edf2ee 75%); background-size: 200% 100%; animation: as-shimmer 1.2s infinite; margin-bottom: 12px; }
        @keyframes as-shimmer { to { background-position: -200% 0; } }
        @media (prefers-reduced-motion: reduce) { .as-skel i, .as-spin { animation: none; } }

        .as-msg { display: flex; gap: 14px; align-items: flex-start; background: var(--as-surface); border-radius: 18px; box-shadow: var(--as-shadow); padding: 22px; }
        .as-msg-icon { flex-shrink: 0; width: 48px; height: 48px; border-radius: 14px; display: grid; place-items: center; font-size: 1.35rem; background: var(--as-warn-bg); color: var(--as-warn); }
        .as-msg h2 { margin: 0 0 4px; font-size: 1.05rem; font-weight: 700; }
        .as-msg p { margin: 0; color: var(--as-muted); font-size: 0.9rem; }
        .as-msg .as-btn { margin-top: 12px; height: 40px; padding: 0 16px; }

        .as-count { font-size: 0.85rem; font-weight: 600; color: var(--as-muted); margin: 0 0 10px; display: flex; align-items: center; gap: 6px; }
        .as-result { position: relative; background: var(--as-surface); border-radius: 18px; box-shadow: var(--as-shadow); padding: 22px 22px 22px 28px; margin-bottom: 14px; overflow: hidden; }
        .as-result::before { content: ""; position: absolute; left: 0; top: 0; bottom: 0; width: 6px; background: linear-gradient(180deg, var(--as-primary), var(--as-teal)); }
        .as-edge-info::before { background: linear-gradient(180deg, #1f5fa8, #4c8ad6); }
        .as-edge-warn::before { background: linear-gradient(180deg, #d97706, #f2b544); }
        .as-edge-bad::before { background: linear-gradient(180deg, #b42318, #e5534b); }
        .as-result-hd { display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; flex-wrap: wrap; }
        .as-result-title { display: flex; gap: 12px; min-width: 0; flex: 1; align-items: center; }
        .as-result-icon { flex-shrink: 0; width: 44px; height: 44px; border-radius: 13px; background: var(--as-primary-soft); color: var(--as-primary); display: grid; place-items: center; font-size: 1.2rem; }
        .as-result-title h3 { margin: 0; font-size: 1.05rem; font-weight: 700; line-height: 1.35; }
        .as-result-title p { margin: 2px 0 0; font-size: 0.82rem; color: var(--as-muted); }
        .as-badge { display: inline-flex; align-items: center; gap: 6px; padding: 7px 14px; border-radius: 999px; font-size: 0.82rem; font-weight: 700; white-space: nowrap; }
        .as-tone-info { background: var(--as-info-bg); color: var(--as-info); }
        .as-tone-ok { background: var(--as-ok-bg); color: var(--as-ok); }
        .as-tone-warn { background: var(--as-warn-bg); color: var(--as-warn); }
        .as-tone-bad { background: var(--as-bad-bg); color: var(--as-bad); }

        .as-timeline { display: flex; list-style: none; margin: 20px 0 6px; padding: 0; }
        .as-timeline li { flex: 1; position: relative; display: flex; flex-direction: column; align-items: center; text-align: center; gap: 8px; min-width: 0; font-size: .76rem; font-weight: 600; color: var(--as-muted); }
        .as-timeline li:not(:last-child)::after { content: ""; position: absolute; top: 17px; left: calc(50% + 22px); right: calc(-50% + 22px); height: 3px; border-radius: 3px; background: var(--as-line); }
        .as-timeline li.is-done:not(:last-child)::after { background: linear-gradient(90deg, var(--as-ok), var(--as-teal)); }
        .as-tl-dot { width: 36px; height: 36px; border-radius: 50%; display: grid; place-items: center; background: #f1f5f2; border: 2px solid var(--as-line); color: var(--as-muted); font-size: .95rem; position: relative; z-index: 1; }
        .as-timeline li.is-done { color: var(--as-ok); }
        .as-timeline li.is-done .as-tl-dot { background: var(--as-ok); border-color: var(--as-ok); color: #fff; }
        .as-timeline li.is-current { color: var(--as-info); }
        .as-timeline li.is-current .as-tl-dot { background: var(--as-info); border-color: var(--as-info); color: #fff; box-shadow: 0 0 0 6px rgba(31,95,168,.14); }
        .as-timeline li.is-current.is-warn { color: var(--as-warn); }
        .as-timeline li.is-current.is-warn .as-tl-dot { background: #d97706; border-color: #d97706; box-shadow: 0 0 0 6px rgba(217,119,6,.15); }
        .as-timeline li.is-current.is-bad { color: var(--as-bad); }
        .as-timeline li.is-current.is-bad .as-tl-dot { background: var(--as-bad); border-color: var(--as-bad); box-shadow: 0 0 0 6px rgba(180,35,24,.14); }

        .as-note { display: flex; gap: 12px; margin: 16px 0; padding: 14px 16px; border-radius: 14px; font-size: 0.9rem; line-height: 1.5; }
        .as-note p { margin: 0; color: var(--as-ink); }
        .as-note .as-note-sub { margin-top: 4px; }
        .as-note-icon { font-size: 1.25rem; margin-top: 1px; flex-shrink: 0; }
        .as-details { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; margin: 0; }
        .as-detail { display: flex; gap: 12px; align-items: flex-start; padding: 12px; border-radius: 12px; background: #f7faf8; border: 1px solid var(--as-line); min-width: 0; }
        .as-detail-ic { flex-shrink: 0; width: 32px; height: 32px; border-radius: 9px; display: grid; place-items: center; background: #fff; color: var(--as-primary); border: 1px solid var(--as-line); font-size: .95rem; }
        .as-detail dt { font-size: 0.74rem; color: var(--as-muted); font-weight: 500; }
        .as-detail dd { margin: 3px 0 0; font-size: 0.92rem; font-weight: 600; overflow-wrap: anywhere; }
        .as-result-ft { margin-top: 14px; }

        .as-help { max-width: 920px; margin: 20px auto 0; padding: 0 16px; display: flex; gap: 10px; align-items: center; font-size: 0.85rem; color: var(--as-muted); }
        .as-help a { color: var(--as-primary); font-weight: 600; text-decoration: none; }

        @media (max-width: 720px) {
          .as-fields { grid-template-columns: 1fr; }
          .as-details { grid-template-columns: 1fr; }
          .as-timeline li .as-tl-label { font-size: .68rem; }
          .as-tl-dot { width: 30px; height: 30px; font-size: .8rem; }
          .as-timeline li:not(:last-child)::after { top: 14px; left: calc(50% + 18px); right: calc(-50% + 18px); }
        }
        @media (max-width: 480px) {
          .as-heroband h1 { font-size: 1.4rem; }
          .as-types-grid { grid-template-columns: 1fr; }
          .as-card, .as-result { padding: 18px; border-radius: 16px; }
          .as-result { padding-left: 22px; }
          .as-actions { flex-direction: column-reverse; }
          .as-actions .as-btn { width: 100%; flex: none; }
          .as-org span { display: none; }
          .as-home span { display: none; }
          .as-timeline li .as-tl-label { display: none; }
        }
      `}</style>

      <div className="as-page">
        <header className="as-band">
          <div className="as-topbar-in">
            <span className="as-emblem"><img src={process.env.PUBLIC_URL + "/images/logo/KG.png"} alt="Government of Karnataka emblem" /></span>
            <div className="as-org">
              <strong>Department of Sericulture</strong>
              <span>Government of Karnataka · e-Reshme Portal</span>
            </div>
            <Link to={APP_ROUTES.home} className="as-home" aria-label="Back to home page">
              <Icon name="arrow-left" /> <span>Home</span>
            </Link>
          </div>
          <div className="as-heroband">
            <h1>Check Application Status</h1>
            <p>Track your Sericulture scheme application with your application number and registered mobile number.</p>
          </div>
        </header>

        <main className="as-wrap">
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
                    <label htmlFor={`as-type-${s.id}`}>
                      <span className="as-type-ic" aria-hidden="true"><Icon name={s.icon} /></span>
                      <span className="as-type-txt">
                        <strong>{s.short}</strong>
                        <small>{s.sub}</small>
                      </span>
                      <span className="as-type-tick" aria-hidden="true"><Icon name="check" /></span>
                    </label>
                  </div>
                ))}
              </div>
            </fieldset>

            <div className="as-fields">
              <div className="as-field">
                <label htmlFor="as-value">
                  {type.label} <span className="as-req" aria-hidden="true">*</span>
                </label>
                <div className="as-inputwrap">
                  <Icon name={type.icon} />
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
                </div>
                {showFieldError ? (
                  <p id="as-value-err" className="as-err" role="alert"><Icon name="alert-circle" /> {fieldError}</p>
                ) : (
                  <p id="as-value-hint" className="as-hint">{type.hint}</p>
                )}
              </div>

              <div className="as-field">
                <label htmlFor="as-mobile">
                  Registered mobile number <span className="as-req" aria-hidden="true">*</span>
                </label>
                <div className="as-inputwrap">
                  <Icon name="mobile" />
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
                </div>
                {showMobileError ? (
                  <p id="as-mobile-err" className="as-err" role="alert"><Icon name="alert-circle" /> {mobileError}</p>
                ) : (
                  <p id="as-mobile-hint" className="as-hint">Used only to confirm it is your application.</p>
                )}
              </div>
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

            <div className="as-trust">
              <span><Icon name="shield-check" /> Official Department of Sericulture service</span>
              <span><Icon name="lock" /> Your mobile number is not stored or shared</span>
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
                  <Icon name="check-circle" /> {applications.length === 1 ? "1 application found" : `${applications.length} applications found`}
                </p>
                {applications.map((app, i) => (
                  <ResultCard key={`${app.arn || app.gscNumber || "app"}-${i}`} app={app} />
                ))}
              </>
            )}
          </section>
        </main>

        <div className="as-help">
          <Icon name="call" />
          <span>
            Need help? Call the Sericulture helpline <a href="tel:08024413900">080 2441 3900</a>.
          </span>
        </div>
      </div>
    </>
  );
}

export default TrackApplicationStatus;
