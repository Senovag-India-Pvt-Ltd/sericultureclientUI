import { useCallback, useEffect, useState } from "react";
import { Icon } from "../../components";
import sevasindhuApi, { getSession, setSession, toError } from "./sevasindhuApi";
import FarmerStep from "./FarmerStep";
import ApplicationStep, { DoneStep } from "./ApplicationStep";
import "./sevasindhu.css";

// Seva Sindhu citizen application (Token_Based_Integration_V3.pdf).
// Seva Sindhu posts the citizen to dbt (URL 1), which forwards the browser here with a one-time
// ticket in the URL fragment: /seriui/sevasindhu/apply#t=<ticket>. The ticket is exchanged once for
// a citizen session (kept in sessionStorage, never in the staff login keys).

const STEPS = [
  { id: "farmer", label: "Your details" },
  { id: "application", label: "Application" },
  { id: "done", label: "Acknowledgement" },
];

const stepIndex = (status) => (status === "SUBMITTED" ? 2 : status === "FARMER_REGISTERED" ? 1 : 0);

function Shell({ children, edcs }) {
  return (
    <div className="ss-page">
      <div className="ss-topbar">
        <div className="ss-topbar-in">
          <img src={process.env.PUBLIC_URL + "/images/logo/KG.png"} alt="Government of Karnataka emblem" />
          <div className="ss-org">
            <strong>Department of Sericulture</strong>
            <span>Government of Karnataka · e-Reshme</span>
          </div>
          {edcs && <span className="ss-chip" title="Seva Sindhu application reference"><Icon name="link" /> {edcs}</span>}
        </div>
      </div>
      <main className="ss-wrap">{children}</main>
    </div>
  );
}

function Detail({ label, value }) {
  if (!value) return null;
  return (
    <div className="ss-detail">
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}

function SevaSindhuApply() {
  const [state, setState] = useState({ phase: "loading" });

  const load = useCallback(async () => {
    setState({ phase: "loading" });
    try {
      // 1. A fresh hand-over from Seva Sindhu: exchange the one-time ticket, then drop it from the URL.
      const hash = window.location.hash || "";
      const match = hash.match(/[#&]t=([A-Za-z0-9_-]{43})/);
      if (match) {
        window.history.replaceState(null, "", window.location.pathname + window.location.search);
        const res = await sevasindhuApi.post("session", { ticket: match[1] });
        setSession(res.data.sessionToken);
        setState({ phase: "ready", request: res.data });
        return;
      }
      // 2. Reload / return within the same browser tab: reuse the session.
      if (!getSession()) {
        setState({ phase: "error", error: { code: "NO_SESSION", message: "Please open this page from Seva Sindhu to apply for a Department of Sericulture service." } });
        return;
      }
      const res = await sevasindhuApi.get("request");
      setState({ phase: "ready", request: res.data });
    } catch (err) {
      const e = toError(err);
      if (e && e.code === "SESSION_INVALID") setSession(null);
      setState({ phase: "error", error: e || { code: "SERVICE_UNAVAILABLE", message: "Something went wrong. Please try again." } });
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // After a farmer is linked or registered, refresh the request from the server (source of truth).
  const refresh = useCallback(async () => {
    try {
      const res = await sevasindhuApi.get("request");
      setState({ phase: "ready", request: res.data });
    } catch (err) {
      const e = toError(err);
      if (e && e.code === "SESSION_INVALID") setSession(null);
      if (e) setState({ phase: "error", error: e });
    }
  }, []);

  if (state.phase === "loading") {
    return (
      <Shell>
        <div className="ss-center" role="status" aria-live="polite">
          <span className="ss-spin dark" aria-hidden="true" />
          <p>Opening your Seva Sindhu application...</p>
        </div>
      </Shell>
    );
  }

  if (state.phase === "error") {
    const retryable = ["NETWORK", "TIMEOUT", "SERVICE_UNAVAILABLE", "TOO_MANY_REQUESTS"].includes(state.error.code);
    return (
      <Shell>
        <div className="ss-hero">
          <div className="ss-hero-icon" aria-hidden="true"><Icon name="alert-circle" /></div>
          <div>
            <h1>We could not open your application</h1>
            <p>{state.error.message}</p>
          </div>
        </div>
        <div className="ss-actions">
          {retryable && (
            <button type="button" className="ss-btn ss-btn-primary" onClick={load}><Icon name="reload" /> Try again</button>
          )}
          <a className="ss-btn ss-btn-ghost" href="https://sevasindhu.karnataka.gov.in" rel="noreferrer">Go to Seva Sindhu</a>
        </div>
      </Shell>
    );
  }

  const req = state.request;
  const current = stepIndex(req.requestStatus);
  const serviceTitle = req.componentName || req.subSchemeName || req.schemeName;

  return (
    <Shell edcs={req.edcsApplicationRefNo}>
      <div className="ss-hero">
        <div className="ss-hero-icon" aria-hidden="true"><Icon name="file-docs" /></div>
        <div>
          <h1>Apply through Seva Sindhu</h1>
          <p>{serviceTitle || "Department of Sericulture service"}{req.assistedMode ? " · assisted" : ""}</p>
        </div>
      </div>

      <ol className="ss-steps" aria-label="Application steps">
        {STEPS.map((s, i) => (
          <li key={s.id} className={i < current ? "is-done" : i === current ? "is-current" : ""} aria-current={i === current ? "step" : undefined}>
            <span className="ss-num">{i < current ? <Icon name="check" /> : i + 1}</span>
            <span className="ss-step-label">{s.label}</span>
          </li>
        ))}
      </ol>

      {!req.serviceAvailable && (
        <div className="ss-note ss-tone-warn" role="alert">
          <Icon name="alert-circle" />
          <div>
            <p><strong>This service is not available online yet.</strong></p>
            <p>The Department of Sericulture has not enabled Seva Sindhu service {req.serviceId} yet. Please contact your nearest Sericulture office.</p>
          </div>
        </div>
      )}

      <section className="ss-card" aria-labelledby="ss-req-title">
        <h2 id="ss-req-title">Your Seva Sindhu request</h2>
        <p className="ss-sub">Received from Seva Sindhu. Keep the reference number for tracking.</p>
        <dl className="ss-details">
          <Detail label="Seva Sindhu reference" value={req.edcsApplicationRefNo} />
          <Detail label="Service" value={serviceTitle} />
          <Detail label="Scheme" value={req.schemeName} />
          <Detail label="Mobile" value={req.mobileNumber} />
          <Detail label="FRUITS ID" value={req.fruitsId} />
          <Detail label="Application number (ARN)" value={req.arn} />
        </dl>
      </section>

      {req.serviceAvailable && req.requestStatus !== "SUBMITTED" && (
        <FarmerStep
          request={req}
          onLinked={refresh}
          onContinue={() => document.getElementById("ss-application")?.scrollIntoView({ behavior: "smooth" })}
        />
      )}
      {req.serviceAvailable && req.requestStatus === "FARMER_REGISTERED" && <ApplicationStep onSubmitted={refresh} />}
      {req.requestStatus === "SUBMITTED" && <DoneStep request={req} />}
    </Shell>
  );
}

export default SevaSindhuApply;
