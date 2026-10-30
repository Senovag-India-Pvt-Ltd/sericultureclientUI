import { useCallback, useEffect, useState } from "react";
import { Icon } from "../../components";
import sevasindhuApi, { getSession, setSession, toError } from "./sevasindhuApi";
import FarmerStep from "./FarmerStep";
import ApplicationStep from "./ApplicationStep";
import CopyButton from "./CopyButton";
import "./sevasindhu.css";

// Seva Sindhu citizen application (Token_Based_Integration_V3.pdf).
// Seva Sindhu posts the citizen to dbt (URL 1), which forwards the browser here with a one-time
// ticket in the URL fragment: /seriui/sevasindhu/apply#t=<ticket>. The ticket is exchanged once for
// a citizen session (kept in sessionStorage, never in the staff login keys).

const STEPS = [
  { id: "farmer", label: "Your details" },
  { id: "application", label: "Documents & submit" },
  { id: "done", label: "Acknowledgement" },
];

const stepIndex = (status) => (status === "SUBMITTED" ? 2 : status === "FARMER_REGISTERED" ? 1 : 0);

function Shell({ children, edcs, title, subtitle }) {
  return (
    <div className="ss-page">
      <header className="ss-band">
        <div className="ss-topbar-in">
          <span className="ss-emblem"><img src={process.env.PUBLIC_URL + "/images/logo/KG.png"} alt="Government of Karnataka emblem" /></span>
          <div className="ss-org">
            <strong>Department of Sericulture</strong>
            <span>Government of Karnataka · e-Reshme Portal</span>
          </div>
          {edcs && (
            <span className="ss-chip" title="Seva Sindhu application reference">
              <Icon name="link" /> {edcs} <CopyButton value={edcs} className="ss-chip-copy" withText={false} />
            </span>
          )}
        </div>
        <div className="ss-heroband">
          <div>
            <h1>{title}</h1>
            {subtitle && <p>{subtitle}</p>}
          </div>
          <span className="ss-secure"><Icon name="shield-check" /> Secure Seva Sindhu session</span>
        </div>
      </header>
      <main className="ss-wrap">{children}</main>
      <footer className="ss-foot">
        <span><Icon name="call" /> Helpline: <a href="tel:08024413900">080 2441 3900</a></span>
        <span><Icon name="lock" /> Your details are used only to process this application.</span>
      </footer>
    </div>
  );
}

function Tile({ icon, label, value, children }) {
  if (!value) return null;
  return (
    <div className="ss-tile">
      <span className="ss-tile-ic" aria-hidden="true"><Icon name={icon} /></span>
      <div style={{ minWidth: 0, flex: 1 }}>
        <dt>{label}</dt>
        <dd>{value}</dd>
      </div>
      {children}
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
      <Shell title="Apply through Seva Sindhu" subtitle="Department of Sericulture services">
        <div className="ss-center" role="status" aria-live="polite">
          <span className="ss-spin dark" aria-hidden="true" />
          <p style={{ margin: 0, color: "var(--ss-muted)" }}>Opening your Seva Sindhu application...</p>
        </div>
      </Shell>
    );
  }

  if (state.phase === "error") {
    const retryable = ["NETWORK", "TIMEOUT", "SERVICE_UNAVAILABLE", "TOO_MANY_REQUESTS"].includes(state.error.code);
    return (
      <Shell title="Apply through Seva Sindhu" subtitle="Department of Sericulture services">
        <section className="ss-card">
          <div className="ss-title" style={{ alignItems: "flex-start" }}>
            <span className="ss-title-ic" aria-hidden="true" style={{ background: "var(--ss-warn-bg)", color: "var(--ss-warn)" }}><Icon name="alert-circle" /></span>
            <div>
              <h2>We could not open your application</h2>
              <small style={{ fontSize: ".92rem", lineHeight: 1.5 }}>{state.error.message}</small>
            </div>
          </div>
          <div className="ss-actions">
            {retryable && (
              <button type="button" className="ss-btn ss-btn-primary" onClick={load}><Icon name="reload" /> Try again</button>
            )}
            <a className="ss-btn ss-btn-ghost" href="https://sevasindhu.karnataka.gov.in" rel="noreferrer"><Icon name="arrow-left" /> Go to Seva Sindhu</a>
          </div>
        </section>
      </Shell>
    );
  }

  const req = state.request;
  const current = stepIndex(req.requestStatus);
  const serviceTitle = req.componentName || req.subSchemeName || req.schemeName;

  return (
    <Shell
      edcs={req.edcsApplicationRefNo}
      title="Apply through Seva Sindhu"
      subtitle={`${serviceTitle || "Department of Sericulture service"}${req.assistedMode ? " · assisted application" : ""}`}
    >
      <ol className="ss-steps" aria-label="Application steps">
        {STEPS.map((s, i) => (
          <li key={s.id} className={i < current ? "is-done" : i === current ? "is-current" : ""} aria-current={i === current ? "step" : undefined}>
            <span className="ss-num">{i < current ? <Icon name="check" /> : i + 1}</span>
            <span className="ss-step-label">{s.label}</span>
          </li>
        ))}
      </ol>
      <p className="ss-step-mobile">Step {current + 1} of {STEPS.length} · {STEPS[current].label}</p>

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
        <div className="ss-title">
          <span className="ss-title-ic" aria-hidden="true"><Icon name="file-docs" /></span>
          <div>
            <h2 id="ss-req-title">Your Seva Sindhu request</h2>
            <small>Received from Seva Sindhu. Keep the reference number for tracking.</small>
          </div>
        </div>
        <dl className="ss-tiles">
          <Tile icon="link" label="Seva Sindhu reference" value={req.edcsApplicationRefNo}>
            <CopyButton value={req.edcsApplicationRefNo} className="ss-tile-copy" withText={false} />
          </Tile>
          <Tile icon="layers" label="Service" value={serviceTitle} />
          <Tile icon="building" label="Scheme" value={req.schemeName} />
          <Tile icon="mobile" label="Registered mobile" value={req.mobileNumber} />
          <Tile icon="user-check" label="FRUITS ID" value={req.fruitsId} />
          <Tile icon="check-circle" label="e-Reshme reference" value={req.arn}>
            <CopyButton value={req.arn} className="ss-tile-copy" withText={false} />
          </Tile>
        </dl>
      </section>

      {req.serviceAvailable && req.requestStatus !== "SUBMITTED" && (
        <FarmerStep
          request={req}
          onLinked={refresh}
          onContinue={() => document.getElementById("ss-application")?.scrollIntoView({ behavior: "smooth" })}
        />
      )}
      {(req.requestStatus === "SUBMITTED" || (req.serviceAvailable && req.requestStatus === "FARMER_REGISTERED")) && (
        // One element for both states, so a fresh submission keeps its confirmation instead of remounting.
        <ApplicationStep
          key="application"
          onSubmitted={(res) => setState((st) => ({ ...st, request: { ...st.request, requestStatus: "SUBMITTED", arn: res.referenceNo } }))}
        />
      )}
    </Shell>
  );
}

export default SevaSindhuApply;
