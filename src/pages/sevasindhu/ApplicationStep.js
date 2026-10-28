import { useEffect, useState } from "react";
import { Icon } from "../../components";
import sevasindhuApi, { toError } from "./sevasindhuApi";

// Step 2 and 3 of the Seva Sindhu citizen flow: the application form, a review page, submission and the
// acknowledgement. The server computes all amounts exactly as the officer screen does; the page only shows them.

const rupees = (n) => (n == null ? "-" : `₹ ${Number(n).toLocaleString("en-IN")}`);

function Note({ tone, icon, title, children, role = "status" }) {
  return (
    <div className={`ss-note ss-tone-${tone}`} role={role}>
      <Icon name={icon} />
      <div>
        {title && <p><strong>{title}</strong></p>}
        {children}
      </div>
    </div>
  );
}

function Field({ id, label, required, error, hint, children }) {
  return (
    <div className="ss-field">
      <label htmlFor={id}>{label} {required && <span className="ss-req" aria-hidden="true">*</span>}</label>
      {children}
      {error ? <p className="ss-err" role="alert">{error}</p> : hint ? <p className="ss-hint">{hint}</p> : null}
    </div>
  );
}

const ACK_TEXT = {
  SENT: { tone: "ok", icon: "check-circle", text: "The acknowledgement has been sent to Seva Sindhu." },
  PENDING: { tone: "info", icon: "clock", text: "The acknowledgement is being sent to Seva Sindhu. This can take a little while; you do not need to do anything." },
  FAILED: { tone: "warn", icon: "alert-circle", text: "The acknowledgement could not be sent to Seva Sindhu yet. The department will send it again; your application is safely submitted." },
};

export function DoneStep({ request }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const ack = ACK_TEXT[request.ackStatus] || ACK_TEXT.PENDING;

  const download = async () => {
    setBusy(true);
    setError(null);
    try {
      const res = await sevasindhuApi.get("acknowledgement", { responseType: "blob" });
      const url = URL.createObjectURL(new Blob([res.data], { type: "application/pdf" }));
      const a = document.createElement("a");
      a.href = url;
      a.download = `Acknowledgement-${request.arn || "application"}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 10000);
    } catch (err) {
      setError(toError(err) || { message: "Could not download the acknowledgement. Please try again." });
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="ss-card" aria-labelledby="ss-done-title" id="ss-application">
      <h2 id="ss-done-title">Application submitted</h2>
      <Note tone="ok" icon="check-circle" title="Your application has been submitted successfully.">
        <p>Application number (ARN): <strong>{request.arn || "-"}</strong></p>
        <p>Seva Sindhu reference: <strong>{request.edcsApplicationRefNo}</strong></p>
      </Note>
      <Note tone={ack.tone} icon={ack.icon}><p>{ack.text}</p></Note>
      <p className="ss-sub">
        Next: the Sericulture officer for your area will scrutinise the application. Eligibility and the final subsidy are
        decided by the department as per the scheme guidelines.
      </p>
      {error && <Note tone="bad" icon="alert-circle" role="alert"><p>{error.message}</p></Note>}
      <div className="ss-actions">
        <button type="button" className="ss-btn ss-btn-primary" onClick={download} disabled={busy} aria-busy={busy}>
          {busy ? <span className="ss-spin" aria-hidden="true" /> : <Icon name="download" />} Download acknowledgement
        </button>
        <a className="ss-btn ss-btn-ghost" href={`${process.env.PUBLIC_URL}/track-application-status`}>
          <Icon name="search" /> Track application
        </a>
      </div>
    </section>
  );
}

function ApplicationStep({ onSubmitted }) {
  const [options, setOptions] = useState(null);
  const [loadError, setLoadError] = useState(null);
  const [f, setF] = useState({
    componentId: "", categoryId: "", lands: {}, length: "", breadth: "", height: "",
    estimatedCost: "", roofTypeId: "", extentOfMulberry: "", declaration: false,
  });
  const [touched, setTouched] = useState(false);
  const [review, setReview] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  const loadOptions = async () => {
    setLoadError(null);
    try {
      const res = await sevasindhuApi.get("application/options");
      setOptions(res.data);
      if (res.data.components && res.data.components.length === 1) {
        setF((s) => ({ ...s, componentId: String(res.data.components[0].id) }));
      }
    } catch (err) {
      setLoadError(toError(err));
    }
  };
  useEffect(() => { loadOptions(); }, []);

  if (loadError) {
    return (
      <section className="ss-card" id="ss-application">
        <Note tone="bad" icon="alert-circle" role="alert"><p>{loadError.message}</p></Note>
        <button type="button" className="ss-btn ss-btn-primary" onClick={loadOptions}><Icon name="reload" /> Try again</button>
      </section>
    );
  }
  if (!options) {
    return (
      <section className="ss-card" id="ss-application" aria-busy="true">
        <p className="ss-hint"><span className="ss-spin dark" aria-hidden="true" style={{ display: "inline-block", verticalAlign: "middle" }} /> Loading the application form...</p>
      </section>
    );
  }
  if (options.blockedReason) {
    return (
      <section className="ss-card" id="ss-application">
        <h2>Application</h2>
        <Note tone="warn" icon="alert-circle" role="alert"><p>{options.blockedReason}</p></Note>
      </section>
    );
  }

  const set = (k) => (e) => setF((s) => ({ ...s, [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value }));
  const toggleLand = (id) => setF((s) => {
    const lands = { ...s.lands };
    if (lands[id]) delete lands[id];
    else lands[id] = { devAcre: "", devGunta: "" };
    return { ...s, lands };
  });
  const setLand = (id, k, v) => setF((s) => ({ ...s, lands: { ...s.lands, [id]: { ...s.lands[id], [k]: v.replace(/\D/g, "").slice(0, 3) } } }));

  const num = (v) => (v === "" || v == null ? NaN : Number(v));
  const selected = Object.entries(f.lands);
  const errors = {
    componentId: !f.componentId ? "Select the component." : "",
    categoryId: !f.categoryId ? "Select your category." : "",
    lands: selected.length === 0 ? "Select at least one land record."
      : selected.some(([, l]) => { const a = num(l.devAcre || 0), g = num(l.devGunta || 0); return !(a >= 0 && g >= 0 && g <= 39 && a + g > 0); })
        ? "Enter the mulberry area (acre and gunta, gunta 0-39) for each selected land." : "",
    length: !(num(f.length) > 0 && num(f.length) <= 200) ? "Enter the length in feet." : "",
    breadth: !(num(f.breadth) > 0 && num(f.breadth) <= 200) ? "Enter the breadth in feet." : "",
    height: !(num(f.height) > 0 && num(f.height) <= 50) ? "Enter the height in feet." : "",
    estimatedCost: !(num(f.estimatedCost) >= 1000) ? "Enter the estimated construction cost in rupees." : "",
    roofTypeId: !f.roofTypeId ? "Select the roof type." : "",
    extentOfMulberry: !/^\d{1,3}(\.\d{1,2})?$/.test(f.extentOfMulberry.trim()) || Number(f.extentOfMulberry) <= 0 ? "Enter the extent of mulberry in acres, e.g. 1.50." : "",
  };
  const show = (k) => (touched ? errors[k] : "");
  const invalid = Object.values(errors).some(Boolean);

  const payload = () => ({
    componentId: Number(f.componentId),
    categoryId: Number(f.categoryId),
    lands: selected.map(([id, l]) => ({ landId: Number(id), devAcre: Number(l.devAcre || 0), devGunta: Number(l.devGunta || 0) })),
    length: Number(f.length), breadth: Number(f.breadth), height: Number(f.height),
    estimatedCost: Math.round(Number(f.estimatedCost)), roofTypeId: Number(f.roofTypeId),
    extentOfMulberry: f.extentOfMulberry.trim(), declaration: f.declaration,
  });

  const toReview = async (e) => {
    e.preventDefault();
    setTouched(true);
    setError(null);
    if (invalid) return;
    setBusy(true);
    try {
      const res = await sevasindhuApi.post("application/quote", { componentId: Number(f.componentId), categoryId: Number(f.categoryId) });
      setReview(res.data);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setError(toError(err));
    } finally {
      setBusy(false);
    }
  };

  const submit = async () => {
    if (!f.declaration) { setError({ message: "Please confirm the declaration to submit." }); return; }
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      const res = await sevasindhuApi.post("application/submit", payload());
      onSubmitted(res.data);
    } catch (err) {
      setError(toError(err));
      setBusy(false);
    }
  };

  const name = (list, id) => (list.find((o) => String(o.id) === String(id)) || {}).name;

  if (review) {
    return (
      <section className="ss-card" id="ss-application" aria-labelledby="ss-review-title">
        <h2 id="ss-review-title">Review your application</h2>
        <p className="ss-sub">Check the details. After submission they cannot be changed online.</p>
        <dl className="ss-details">
          <div className="ss-detail"><dt>Component</dt><dd>{name(options.components, f.componentId)}</dd></div>
          <div className="ss-detail"><dt>Category</dt><dd>{name(options.categories, f.categoryId)}</dd></div>
          <div className="ss-detail"><dt>Rearing house (L × B × H)</dt><dd>{f.length} × {f.breadth} × {f.height} ft ({Math.round(num(f.length) * num(f.breadth))} sq ft)</dd></div>
          <div className="ss-detail"><dt>Roof</dt><dd>{name(options.roofTypes, f.roofTypeId)}</dd></div>
          <div className="ss-detail"><dt>Estimated cost</dt><dd>{rupees(f.estimatedCost)}</dd></div>
          <div className="ss-detail"><dt>Extent of mulberry</dt><dd>{f.extentOfMulberry} acre</dd></div>
          <div className="ss-detail"><dt>Unit cost</dt><dd>{rupees(review.unitCost)}</dd></div>
          <div className="ss-detail"><dt>Subsidy ({review.sharePercentage}%)</dt><dd>{rupees(review.subsidyAmount)}</dd></div>
        </dl>
        <div className="ss-table-wrap" style={{ marginTop: 12 }}>
          <table className="ss-table">
            <caption className="ss-hint" style={{ captionSide: "top", textAlign: "left" }}>Selected land</caption>
            <thead><tr><th scope="col">Survey / Hissa</th><th scope="col">Village</th><th scope="col">Mulberry area</th></tr></thead>
            <tbody>
              {selected.map(([id, l]) => {
                const land = options.lands.find((x) => String(x.id) === id) || {};
                return <tr key={id}><td>{land.surveyNumber}{land.hissa ? ` / ${land.hissa}` : ""}</td><td>{land.villageName || "-"}</td><td>{l.devAcre || 0} acre {l.devGunta || 0} gunta</td></tr>;
              })}
            </tbody>
          </table>
        </div>
        <Note tone="info" icon="info"><p>The subsidy shown is as configured for this scheme; the final amount is decided by the department after scrutiny.</p></Note>
        <div className="ss-field">
          <label className="ss-check" htmlFor="ss-app-declaration">
            <input id="ss-app-declaration" type="checkbox" checked={f.declaration} onChange={set("declaration")} />
            <span>I declare that the information given is true. I understand the application will be rejected if any information is found false.</span>
          </label>
        </div>
        {error && <Note tone="bad" icon="alert-circle" role="alert"><p>{error.message}</p></Note>}
        <div className="ss-actions">
          <button type="button" className="ss-btn ss-btn-ghost" onClick={() => setReview(null)} disabled={busy}><Icon name="edit" /> Edit</button>
          <button type="button" className="ss-btn ss-btn-primary" onClick={submit} disabled={busy || !f.declaration} aria-busy={busy}>
            {busy ? <span className="ss-spin" aria-hidden="true" /> : <Icon name="send" />} {busy ? "Submitting..." : "Submit application"}
          </button>
        </div>
      </section>
    );
  }

  const input = (k, props = {}) => (
    <input id={`ss-app-${k}`} className="ss-input" value={f[k]} onChange={set(k)} aria-invalid={show(k) ? "true" : "false"} {...props} />
  );

  return (
    <form className="ss-card" id="ss-application" onSubmit={toReview} noValidate aria-labelledby="ss-app-title">
      <h2 id="ss-app-title">Application</h2>
      <p className="ss-sub">{options.subSchemeName}{options.financialYear ? ` · Financial year ${options.financialYear}` : ""}</p>

      <div className="ss-grid">
        <Field id="ss-app-componentId" label="Component" required error={show("componentId")}>
          <select id="ss-app-componentId" className="ss-select" value={f.componentId} onChange={set("componentId")} aria-invalid={show("componentId") ? "true" : "false"}>
            <option value="">Select component</option>
            {options.components.map((o) => <option key={o.id} value={o.id}>{o.name}</option>)}
          </select>
        </Field>
        <Field id="ss-app-categoryId" label="Category" required error={show("categoryId")} hint="As per your caste certificate; the officer will verify it.">
          <select id="ss-app-categoryId" className="ss-select" value={f.categoryId} onChange={set("categoryId")} aria-invalid={show("categoryId") ? "true" : "false"}>
            <option value="">Select category</option>
            {options.categories.map((o) => <option key={o.id} value={o.id}>{o.name}</option>)}
          </select>
        </Field>
      </div>

      <h3 className="ss-h3">Land (from your e-Reshme records)</h3>
      {show("lands") && <p className="ss-err" role="alert">{show("lands")}</p>}
      <div className="ss-table-wrap">
        <table className="ss-table">
          <thead><tr><th scope="col">Select</th><th scope="col">Survey / Hissa</th><th scope="col">Village</th><th scope="col">Extent</th><th scope="col">Mulberry area (acre / gunta)</th></tr></thead>
          <tbody>
            {options.lands.map((l) => {
              const on = !!f.lands[l.id];
              return (
                <tr key={l.id}>
                  <td><input type="checkbox" checked={on} onChange={() => toggleLand(l.id)} aria-label={`Select survey ${l.surveyNumber}`} style={{ width: 20, height: 20, accentColor: "var(--ss-primary)" }} /></td>
                  <td>{l.surveyNumber}{l.hissa ? ` / ${l.hissa}` : ""}</td>
                  <td>{l.villageName || "-"}</td>
                  <td>{l.acre || 0} a {l.gunta || 0} g</td>
                  <td>
                    {on ? (
                      <span style={{ display: "flex", gap: 6 }}>
                        <input className="ss-input" style={{ height: 38, width: 70 }} inputMode="numeric" placeholder="acre" aria-label={`Mulberry acre on survey ${l.surveyNumber}`} value={f.lands[l.id].devAcre} onChange={(e) => setLand(l.id, "devAcre", e.target.value)} />
                        <input className="ss-input" style={{ height: 38, width: 70 }} inputMode="numeric" placeholder="gunta" aria-label={`Mulberry gunta on survey ${l.surveyNumber}`} value={f.lands[l.id].devGunta} onChange={(e) => setLand(l.id, "devGunta", e.target.value)} />
                      </span>
                    ) : <span className="ss-hint">-</span>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <h3 className="ss-h3">Rearing house to be constructed</h3>
      <div className="ss-grid">
        <Field id="ss-app-length" label="Length (feet)" required error={show("length")}>{input("length", { inputMode: "decimal", placeholder: "e.g. 50" })}</Field>
        <Field id="ss-app-breadth" label="Breadth (feet)" required error={show("breadth")}>{input("breadth", { inputMode: "decimal", placeholder: "e.g. 20" })}</Field>
        <Field id="ss-app-height" label="Height (feet)" required error={show("height")}>{input("height", { inputMode: "decimal", placeholder: "e.g. 12" })}</Field>
        <Field id="ss-app-roofTypeId" label="Roof type" required error={show("roofTypeId")}>
          <select id="ss-app-roofTypeId" className="ss-select" value={f.roofTypeId} onChange={set("roofTypeId")} aria-invalid={show("roofTypeId") ? "true" : "false"}>
            <option value="">Select roof type</option>
            {options.roofTypes.map((o) => <option key={o.id} value={o.id}>{o.name}</option>)}
          </select>
        </Field>
        <Field id="ss-app-estimatedCost" label="Estimated cost (₹)" required error={show("estimatedCost")}>{input("estimatedCost", { inputMode: "numeric", placeholder: "e.g. 1200000" })}</Field>
        <Field id="ss-app-extentOfMulberry" label="Extent of mulberry (acres)" required error={show("extentOfMulberry")}>{input("extentOfMulberry", { inputMode: "decimal", placeholder: "e.g. 1.50" })}</Field>
      </div>

      {error && <Note tone="bad" icon="alert-circle" role="alert"><p>{error.message}</p></Note>}
      <div className="ss-actions">
        <button type="submit" className="ss-btn ss-btn-primary" disabled={busy} aria-busy={busy}>
          {busy ? <span className="ss-spin" aria-hidden="true" /> : <Icon name="arrow-right" />} {busy ? "Calculating..." : "Review application"}
        </button>
      </div>
    </form>
  );
}

export default ApplicationStep;
