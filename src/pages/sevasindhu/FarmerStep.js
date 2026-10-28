import { useEffect, useRef, useState } from "react";
import { Icon } from "../../components";
import { farmerApi, toError } from "./sevasindhuApi";

// Step 1 of the Seva Sindhu citizen flow: identify the farmer by FRUITS ID; a farmer not yet in e-Reshme
// registers here (business rule: a farmer must be registered before applying).

const FID_RE = /^FID\d{13}$/;
const MOBILE_RE = /^[6-9]\d{9}$/;
const IFSC_RE = /^[A-Z]{4}0[A-Z0-9]{6}$/;
const ACCOUNT_RE = /^\d{9,18}$/;
const PIN_RE = /^5[6-9]\d{4}$/;
const TEXT_RE = /^[\p{L}\p{M}0-9 .,()&'/-]{2,100}$/u;
const PASSBOOK_RE = /^[A-Za-z0-9/ -]{1,30}$/;

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
      <label htmlFor={id}>
        {label} {required && <span className="ss-req" aria-hidden="true">*</span>}
      </label>
      {children}
      {error ? <p id={`${id}-err`} className="ss-err" role="alert">{error}</p> : hint ? <p id={`${id}-hint`} className="ss-hint">{hint}</p> : null}
    </div>
  );
}

const describedBy = (id, error, hint) => (error ? `${id}-err` : hint ? `${id}-hint` : undefined);

function LocationSelect({ id, label, value, options, onChange, disabled, error }) {
  return (
    <Field id={id} label={label} required error={error}>
      <select id={id} className="ss-select" value={value || ""} onChange={(e) => onChange(e.target.value ? Number(e.target.value) : null)}
        disabled={disabled} aria-invalid={error ? "true" : "false"} aria-describedby={describedBy(id, error)}>
        <option value="">{disabled ? "—" : `Select ${label.toLowerCase()}`}</option>
        {options.map((o) => (
          <option key={o.id} value={o.id}>{o.name}{o.nameInKannada ? ` / ${o.nameInKannada}` : ""}</option>
        ))}
      </select>
    </Field>
  );
}

function RegisterForm({ fruits, onCancel, onDone }) {
  const [f, setF] = useState({
    mobileNumber: "",
    passbookNumber: "",
    bankName: "",
    bankBranchName: "",
    ifscCode: "",
    accountNumber: "",
    accountNumber2: "",
    districtId: fruits.suggestedDistrictId || null,
    talukId: fruits.suggestedTalukId || null,
    hobliId: fruits.suggestedHobliId || null,
    villageId: fruits.suggestedVillageId || null,
    addressText: fruits.addressText || "",
    pincode: fruits.pincode || "",
    consent: false,
  });
  const [lists, setLists] = useState({ districts: [], taluks: [], hoblis: [], villages: [] });
  const [touched, setTouched] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const topRef = useRef(null);

  const set = (k) => (e) => setF((s) => ({ ...s, [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value }));

  // Location cascade from e-Reshme masters (Karnataka only).
  const load = async (key, path, params) => {
    try {
      const res = await farmerApi.get(path, { params });
      setLists((l) => ({ ...l, [key]: res.data || [] }));
    } catch (err) {
      setError(toError(err));
    }
  };
  useEffect(() => { load("districts", "locations/districts"); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { if (f.districtId) load("taluks", "locations/taluks", { districtId: f.districtId }); else setLists((l) => ({ ...l, taluks: [] })); }, [f.districtId]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { if (f.talukId) load("hoblis", "locations/hoblis", { talukId: f.talukId }); else setLists((l) => ({ ...l, hoblis: [] })); }, [f.talukId]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { if (f.hobliId) load("villages", "locations/villages", { hobliId: f.hobliId }); else setLists((l) => ({ ...l, villages: [] })); }, [f.hobliId]); // eslint-disable-line react-hooks/exhaustive-deps

  const choose = (level) => (id) => {
    setF((s) => {
      const next = { ...s, [level]: id };
      const order = ["districtId", "talukId", "hobliId", "villageId"];
      order.slice(order.indexOf(level) + 1).forEach((k) => { next[k] = null; });
      return next;
    });
  };

  const ifsc = f.ifscCode.trim().toUpperCase();
  const errors = {
    mobileNumber: !fruits.mobileFromSevaSindhu && !MOBILE_RE.test(f.mobileNumber.trim()) ? "Enter a valid 10-digit mobile number." : "",
    passbookNumber: !PASSBOOK_RE.test(f.passbookNumber.trim()) ? "Enter your bank passbook number." : "",
    bankName: !TEXT_RE.test(f.bankName.trim()) ? "Enter your bank name." : "",
    bankBranchName: !TEXT_RE.test(f.bankBranchName.trim()) ? "Enter your bank branch name." : "",
    ifscCode: !IFSC_RE.test(ifsc) ? "Enter a valid 11-character IFSC code, for example SBIN0040510." : "",
    accountNumber: !ACCOUNT_RE.test(f.accountNumber.trim()) ? "Enter a valid account number (9 to 18 digits)." : "",
    accountNumber2: f.accountNumber2.trim() !== f.accountNumber.trim() ? "Account numbers do not match." : "",
    districtId: !f.districtId ? "Select your district." : "",
    talukId: !f.talukId ? "Select your taluk." : "",
    hobliId: !f.hobliId ? "Select your hobli." : "",
    villageId: !f.villageId ? "Select your village." : "",
    addressText: f.addressText.trim().length < 5 || f.addressText.trim().length > 250 ? "Enter your address (5 to 250 characters)." : "",
    pincode: !PIN_RE.test(f.pincode.trim()) ? "Enter a valid 6-digit Karnataka pincode." : "",
    consent: !f.consent ? "Please confirm the declaration to continue." : "",
  };
  const show = (k) => (touched ? errors[k] : "");
  const invalid = Object.values(errors).some(Boolean);

  const submit = async (e) => {
    e.preventDefault();
    setTouched(true);
    setError(null);
    if (invalid) {
      const first = Object.keys(errors).find((k) => errors[k]);
      const el = document.getElementById(`ss-reg-${first}`);
      if (el) el.focus();
      return;
    }
    if (saving) return;
    setSaving(true);
    try {
      const res = await farmerApi.post("register", {
        fruitsId: fruits.fruitsId,
        mobileNumber: f.mobileNumber.trim(),
        passbookNumber: f.passbookNumber.trim(),
        bankName: f.bankName.trim(),
        bankBranchName: f.bankBranchName.trim(),
        ifscCode: ifsc,
        accountNumber: f.accountNumber.trim(),
        districtId: f.districtId,
        talukId: f.talukId,
        hobliId: f.hobliId,
        villageId: f.villageId,
        addressText: f.addressText.trim(),
        pincode: f.pincode.trim(),
        consent: f.consent,
      });
      onDone(res.data);
    } catch (err) {
      setError(toError(err));
      setSaving(false);
      if (topRef.current) topRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const input = (k, props = {}) => (
    <input id={`ss-reg-${k}`} className="ss-input" value={f[k]} onChange={set(k)} aria-invalid={show(k) ? "true" : "false"}
      aria-describedby={describedBy(`ss-reg-${k}`, show(k), props.hint)} {...props} hint={undefined} />
  );

  return (
    <form className="ss-card" onSubmit={submit} noValidate aria-labelledby="ss-reg-title">
      <div ref={topRef} />
      <h2 id="ss-reg-title">Farmer registration</h2>
      <p className="ss-sub">Your name and land details come from FRUITS. Add your contact, address and bank details to complete registration.</p>

      {error && (
        <Note tone="bad" icon="alert-circle" role="alert" title="Registration could not be completed">
          <p>{error.message}</p>
        </Note>
      )}

      <h3 className="ss-h3">From FRUITS</h3>
      <dl className="ss-details">
        <div className="ss-detail"><dt>FRUITS ID</dt><dd>{fruits.fruitsId}</dd></div>
        <div className="ss-detail"><dt>Name</dt><dd>{fruits.farmerName}{fruits.farmerNameInKannada ? ` / ${fruits.farmerNameInKannada}` : ""}</dd></div>
        {fruits.fatherName && <div className="ss-detail"><dt>Father's name</dt><dd>{fruits.fatherName}</dd></div>}
      </dl>
      {fruits.lands && fruits.lands.length > 0 && (
        <div className="ss-table-wrap" style={{ marginTop: 12 }}>
          <table className="ss-table">
            <caption className="ss-hint" style={{ captionSide: "top", textAlign: "left" }}>Land records from FRUITS</caption>
            <thead><tr><th scope="col">Survey / Hissa</th><th scope="col">Village</th><th scope="col">Extent</th></tr></thead>
            <tbody>
              {fruits.lands.map((l, i) => (
                <tr key={i}>
                  <td>{l.surveyNumber || "-"}{l.hissa ? ` / ${l.hissa}` : ""}</td>
                  <td>{[l.villageName, l.hobliName, l.talukName].filter(Boolean).join(", ") || "-"}</td>
                  <td>{l.acre || 0} acre {l.gunta || 0} gunta</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {fruits.warnings && fruits.warnings.map((w, i) => (
        <p key={i} className="ss-hint"><Icon name="info" /> {w}</p>
      ))}

      <h3 className="ss-h3">Contact</h3>
      {fruits.mobileFromSevaSindhu ? (
        <Field id="ss-reg-mobile-ss" label="Mobile number" hint="Taken from your Seva Sindhu login.">
          <input id="ss-reg-mobile-ss" className="ss-input" value={fruits.sevaSindhuMobile} readOnly aria-describedby="ss-reg-mobile-ss-hint" />
        </Field>
      ) : (
        <Field id="ss-reg-mobileNumber" label="Mobile number" required error={show("mobileNumber")} hint="Your own 10-digit mobile number.">
          {input("mobileNumber", { inputMode: "numeric", maxLength: 10, autoComplete: "tel-national", placeholder: "10-digit mobile number", hint: "x" })}
        </Field>
      )}

      <h3 className="ss-h3">Address</h3>
      <div className="ss-grid">
        <LocationSelect id="ss-reg-districtId" label="District" value={f.districtId} options={lists.districts} onChange={choose("districtId")} error={show("districtId")} />
        <LocationSelect id="ss-reg-talukId" label="Taluk" value={f.talukId} options={lists.taluks} onChange={choose("talukId")} disabled={!f.districtId} error={show("talukId")} />
        <LocationSelect id="ss-reg-hobliId" label="Hobli" value={f.hobliId} options={lists.hoblis} onChange={choose("hobliId")} disabled={!f.talukId} error={show("hobliId")} />
        <LocationSelect id="ss-reg-villageId" label="Village" value={f.villageId} options={lists.villages} onChange={choose("villageId")} disabled={!f.hobliId} error={show("villageId")} />
      </div>
      <div className="ss-grid">
        <Field id="ss-reg-addressText" label="House / street / landmark" required error={show("addressText")}>
          {input("addressText", { maxLength: 250, placeholder: "e.g. #12, Temple Street" })}
        </Field>
        <Field id="ss-reg-pincode" label="Pincode" required error={show("pincode")}>
          {input("pincode", { inputMode: "numeric", maxLength: 6, placeholder: "6-digit pincode" })}
        </Field>
      </div>

      <h3 className="ss-h3">Bank account (for DBT payment)</h3>
      <div className="ss-grid">
        <Field id="ss-reg-bankName" label="Bank name" required error={show("bankName")}>
          {input("bankName", { maxLength: 100, placeholder: "e.g. State Bank of India" })}
        </Field>
        <Field id="ss-reg-bankBranchName" label="Branch" required error={show("bankBranchName")}>
          {input("bankBranchName", { maxLength: 100, placeholder: "Branch name" })}
        </Field>
        <Field id="ss-reg-ifscCode" label="IFSC code" required error={show("ifscCode")}>
          {input("ifscCode", { maxLength: 11, placeholder: "e.g. SBIN0040510", autoCapitalize: "characters", spellCheck: false })}
        </Field>
        <Field id="ss-reg-passbookNumber" label="Passbook number" required error={show("passbookNumber")}>
          {input("passbookNumber", { maxLength: 30, placeholder: "As printed on your passbook" })}
        </Field>
        <Field id="ss-reg-accountNumber" label="Account number" required error={show("accountNumber")}>
          {input("accountNumber", { inputMode: "numeric", maxLength: 18, placeholder: "Bank account number", autoComplete: "off" })}
        </Field>
        <Field id="ss-reg-accountNumber2" label="Re-enter account number" required error={show("accountNumber2")}>
          {input("accountNumber2", { inputMode: "numeric", maxLength: 18, placeholder: "Type it again", autoComplete: "off" })}
        </Field>
      </div>

      <Note tone="info" icon="shield-check">
        <p><strong>Privacy</strong></p>
        <p>Your details are used only by the Department of Sericulture to register you and to pay approved benefits to your bank account through DBT. Aadhaar is not collected here.</p>
      </Note>
      <div className="ss-field">
        <label className="ss-check" htmlFor="ss-reg-consent">
          <input id="ss-reg-consent" type="checkbox" checked={f.consent} onChange={set("consent")} aria-invalid={show("consent") ? "true" : "false"} />
          <span>I declare that the details given are true and belong to me, and I agree to their use for this registration.</span>
        </label>
        {show("consent") && <p className="ss-err" role="alert">{show("consent")}</p>}
      </div>

      <div className="ss-actions">
        <button type="button" className="ss-btn ss-btn-ghost" onClick={onCancel} disabled={saving}><Icon name="arrow-left" /> Back</button>
        <button type="submit" className="ss-btn ss-btn-primary" disabled={saving} aria-busy={saving}>
          {saving ? <span className="ss-spin" aria-hidden="true" /> : <Icon name="check" />} {saving ? "Saving..." : "Save and Continue"}
        </button>
      </div>
    </form>
  );
}

function FarmerStep({ request, onLinked, onContinue }) {
  const [fruitsId, setFruitsId] = useState(request.fruitsId || "");
  const [touched, setTouched] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [registering, setRegistering] = useState(false);
  const linked = request.requestStatus === "FARMER_REGISTERED" || request.requestStatus === "SUBMITTED";

  const value = fruitsId.trim().toUpperCase();
  const fieldError = !FID_RE.test(value) ? "Enter your FRUITS ID: FID followed by 13 digits, for example FID2806000049272." : "";

  const check = async (e) => {
    if (e) e.preventDefault();
    setTouched(true);
    if (fieldError || busy) return;
    setBusy(true);
    setError(null);
    setResult(null);
    try {
      const res = await farmerApi.post("check", { fruitsId: value });
      setResult(res.data);
      if (res.data.status === "REGISTERED") onLinked();
    } catch (err) {
      setError(toError(err));
    } finally {
      setBusy(false);
    }
  };

  if (linked) {
    return (
      <section className="ss-card" aria-labelledby="ss-farmer-title">
        <h2 id="ss-farmer-title">Your details</h2>
        <Note tone="ok" icon="check-circle" title={result && result.message && result.message.startsWith("Farmer registration completed") ? "Registration complete" : "Registered farmer"}>
          {result && result.message && result.message.startsWith("Farmer registration completed") && <p>{result.message}</p>}
          <p>FRUITS ID {request.fruitsId}{result && result.farmerName ? ` (${result.farmerName})` : ""} is registered with e-Reshme and linked to this Seva Sindhu request.</p>
        </Note>
        {request.requestStatus === "FARMER_REGISTERED" && (
          <div className="ss-actions">
            <button type="button" className="ss-btn ss-btn-primary" onClick={onContinue}><Icon name="arrow-right" /> Continue Application</button>
          </div>
        )}
      </section>
    );
  }

  if (registering && result && result.status === "NOT_REGISTERED") {
    return (
      <RegisterForm
        fruits={result}
        onCancel={() => setRegistering(false)}
        onDone={(data) => { setRegistering(false); setResult(data); onLinked(); }}
      />
    );
  }

  return (
    <section className="ss-card" aria-labelledby="ss-farmer-title">
      <h2 id="ss-farmer-title">Your details</h2>
      <p className="ss-sub">A farmer must be registered with e-Reshme before applying. Enter your FRUITS ID to check.</p>

      <form onSubmit={check} noValidate>
        <Field id="ss-fid" label="FRUITS ID" required error={touched ? fieldError : ""} hint="Printed on your FRUITS registration, e.g. FID2806000049272.">
          <input id="ss-fid" className="ss-input" value={fruitsId} maxLength={16} autoCapitalize="characters" spellCheck={false}
            placeholder="FID followed by 13 digits" onChange={(e) => setFruitsId(e.target.value.toUpperCase().replace(/\s/g, ""))}
            aria-invalid={touched && fieldError ? "true" : "false"} aria-describedby={touched && fieldError ? "ss-fid-err" : "ss-fid-hint"} />
        </Field>
        <div className="ss-actions">
          <button type="submit" className="ss-btn ss-btn-primary" disabled={busy} aria-busy={busy}>
            {busy ? <span className="ss-spin" aria-hidden="true" /> : <Icon name="search" />} {busy ? "Checking..." : "Check registration"}
          </button>
        </div>
      </form>

      <div aria-live="polite">
        {busy && <p className="ss-hint">Checking e-Reshme and FRUITS records...</p>}
        {error && (
          <div style={{ marginTop: 16 }}>
            <Note tone="bad" icon="alert-circle" role="alert"><p>{error.message}</p></Note>
          </div>
        )}
        {result && result.status === "MOBILE_MISMATCH" && (
          <div style={{ marginTop: 16 }}>
            <Note tone="warn" icon="alert-circle" role="alert" title="Mobile number does not match">
              <p>{result.message}</p>
              {result.registeredMobile && <p>Registered mobile: {result.registeredMobile}</p>}
            </Note>
          </div>
        )}
        {result && result.status === "NOT_REGISTERED" && (
          <div style={{ marginTop: 16 }}>
            <Note tone="warn" icon="user-add" title="Not registered yet">
              <p>{result.message}</p>
              <p>FRUITS shows: <strong>{result.farmerName}</strong>{result.lands ? ` · ${result.lands.length} land record(s)` : ""}</p>
            </Note>
            <div className="ss-actions">
              <button type="button" className="ss-btn ss-btn-ghost" onClick={() => { setResult(null); setTouched(false); }}>
                <Icon name="arrow-left" /> Back to Application
              </button>
              <button type="button" className="ss-btn ss-btn-primary" onClick={() => setRegistering(true)}>
                <Icon name="user-add" /> Register Now
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default FarmerStep;
