import { useCallback, useEffect, useRef, useState } from "react";
import { Icon } from "../../components";
import sevasindhuApi, { toError } from "./sevasindhuApi";
import CopyButton from "./CopyButton";

// Step 2 and 3 of the Seva Sindhu citizen flow. The citizen reviews the details e-Reshme holds for them,
// uploads supporting documents (PDF, JPG, PNG or MP4, 2 MB each) and submits. The application is then assigned
// to the Sericulture officer of their area, who completes it in the department's normal application screen.

const ACCEPT = ".pdf,.jpg,.jpeg,.png,.mp4,application/pdf,image/jpeg,image/png,video/mp4";

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

function Detail({ label, value }) {
  if (!value) return null;
  return (
    <div className="ss-detail">
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}

const sizeText = (bytes) => {
  if (bytes == null) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

const fileIcon = (type = "") => (type.startsWith("image/") ? "img" : type.startsWith("video/") ? "video" : "file-pdf");

const when = (d) => (d ? new Date(d).toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "-");

// Same rule as the server: the file content must match its extension (the server checks again).
const SIGNATURES = {
  pdf: (b) => b[0] === 0x25 && b[1] === 0x50 && b[2] === 0x44 && b[3] === 0x46,
  jpg: (b) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff,
  png: (b) => b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47,
  mp4: (b) => b[4] === 0x66 && b[5] === 0x74 && b[6] === 0x79 && b[7] === 0x70,
};
const extOf = (name) => {
  const e = (name.split(".").pop() || "").toLowerCase();
  return e === "jpeg" ? "jpg" : e;
};
const readHead = (file) =>
  new Promise((resolve) => {
    const r = new FileReader();
    r.onload = () => resolve(new Uint8Array(r.result));
    r.onerror = () => resolve(new Uint8Array());
    r.readAsArrayBuffer(file.slice(0, 16));
  });

async function checkFile(file, rules) {
  const ext = extOf(file.name);
  if (!SIGNATURES[ext]) return `"${file.name}" is not a PDF, JPG, PNG or MP4 file.`;
  if (file.size > rules.maxFileBytes) return `"${file.name}" is ${sizeText(file.size)}. Each file must be ${sizeText(rules.maxFileBytes)} or smaller.`;
  if (file.size === 0) return `"${file.name}" is empty.`;
  const head = await readHead(file);
  if (!SIGNATURES[ext](head)) return `"${file.name}" does not look like a real ${ext.toUpperCase()} file.`;
  return null;
}

// ------------------------------------------------------------------ cards

function BeneficiaryCard({ ctx }) {
  const b = ctx.beneficiary;
  if (!b) return null;
  const reeler = b.type === "Reeler";
  return (
    <section className="ss-card" aria-labelledby="ss-ben-title">
      <div className="ss-card-hd">
        <div className="ss-title">
          <span className="ss-title-ic" aria-hidden="true"><Icon name="user" /></span>
          <div>
            <h2 id="ss-ben-title">{reeler ? "Reeler details" : "Farmer details"}</h2>
          </div>
        </div>
        <span className="ss-badge"><Icon name="shield-check" /> {b.registeredThroughSevaSindhu ? "From FRUITS" : "e-Reshme record"}</span>
      </div>
      <p className="ss-sub" style={{ marginTop: 10 }}>Taken from your FRUITS / e-Reshme registration. If something is wrong, please contact your nearest Sericulture office.</p>
      <dl className="ss-details">
        <Detail label="Name" value={b.name} />
        <Detail label="Name (Kannada)" value={b.nameInKannada} />
        <Detail label="FRUITS ID" value={b.fruitsId} />
        <Detail label="Registered mobile" value={b.mobile} />
        <Detail label="District" value={b.district} />
        <Detail label="Taluk" value={b.taluk} />
        <Detail label="Hobli" value={b.hobli} />
        <Detail label="Village" value={b.village} />
        <Detail label="Reeling licence" value={b.reelingLicenceNumber} />
      </dl>
      {b.lands && b.lands.length > 0 && (
        <div className="ss-table-wrap" style={{ marginTop: 12 }}>
          <table className="ss-table">
            <caption className="ss-hint" style={{ captionSide: "top", textAlign: "left" }}>Land records</caption>
            <thead><tr><th scope="col">Survey / Hissa</th><th scope="col">Village</th><th scope="col">Extent</th></tr></thead>
            <tbody>
              {b.lands.map((l, i) => (
                <tr key={i}><td>{l.surveyNumber}{l.hissa ? ` / ${l.hissa}` : ""}</td><td>{l.villageName || "-"}</td><td>{l.acre || 0} acre {l.gunta || 0} gunta</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

function SchemeCard({ ctx }) {
  return (
    <section className="ss-card" aria-labelledby="ss-scheme-title">
      <div className="ss-card-hd">
        <div className="ss-title">
          <span className="ss-title-ic" aria-hidden="true"><Icon name="layers" /></span>
          <div>
            <h2 id="ss-scheme-title">Scheme you are applying for</h2>
          </div>
        </div>
        {ctx.financialYear && <span className="ss-badge"><Icon name="calendar" /> FY {ctx.financialYear}</span>}
      </div>
      <dl className="ss-details">
        <Detail label="Scheme" value={ctx.schemeName} />
        <Detail label="Sub-scheme" value={ctx.subSchemeName} />
        <Detail label="Component" value={ctx.componentName} />
        <Detail label="Seva Sindhu reference" value={ctx.edcsApplicationRefNo} />
      </dl>
    </section>
  );
}

// ------------------------------------------------------------------ documents

function DocumentsCard({ ctx, documents, setDocuments, disabled }) {
  const rules = ctx.uploadRules || { maxFileBytes: 2097152, maxFiles: 10, minFiles: 1 };
  const types = ctx.documentTypes || [];
  const [typeId, setTypeId] = useState("");
  const [queue, setQueue] = useState([]); // files being uploaded or rejected: { key, name, size, type, progress, error }
  const [drag, setDrag] = useState(false);
  const inputRef = useRef(null);
  const total = documents.length + queue.filter((q) => !q.error).length;

  const upload = async (file) => {
    const key = `${file.name}-${file.size}-${Date.now()}-${Math.random()}`;
    const item = { key, name: file.name, size: file.size, type: file.type, progress: 0 };
    const problem = await checkFile(file, rules);
    if (problem) {
      setQueue((q) => [...q, { ...item, error: problem }]);
      return;
    }
    setQueue((q) => [...q, item]);
    const body = new FormData();
    body.append("file", file);
    try {
      const res = await sevasindhuApi.post("application/documents", body, {
        params: typeId ? { documentTypeId: typeId } : {},
        timeout: 120000,
        onUploadProgress: (e) => {
          const p = e.total ? Math.round((e.loaded * 100) / e.total) : 0;
          setQueue((q) => q.map((x) => (x.key === key ? { ...x, progress: p } : x)));
        },
      });
      setDocuments((d) => [...d, res.data]);
      setQueue((q) => q.filter((x) => x.key !== key));
    } catch (err) {
      const e = toError(err) || { message: "Upload failed. Please try again." };
      setQueue((q) => q.map((x) => (x.key === key ? { ...x, error: e.message } : x)));
    }
  };

  const addFiles = async (fileList) => {
    const files = Array.from(fileList || []);
    if (!files.length) return;
    if (types.length && !typeId) {
      setQueue((q) => [...q, { key: `t${Date.now()}`, name: files[0].name, size: files[0].size, error: "Select what the document is before choosing the file." }]);
      return;
    }
    const room = rules.maxFiles - total;
    files.slice(0, Math.max(room, 0)).forEach(upload);
    if (files.length > room) {
      setQueue((q) => [...q, { key: `m${Date.now()}`, name: `${files.length - Math.max(room, 0)} file(s)`, error: `You can upload at most ${rules.maxFiles} documents.` }]);
    }
    if (inputRef.current) inputRef.current.value = "";
  };

  const remove = async (doc) => {
    try {
      await sevasindhuApi.delete(`application/documents/${doc.id}`);
      setDocuments((d) => d.filter((x) => x.id !== doc.id));
    } catch (err) {
      const e = toError(err);
      setQueue((q) => [...q, { key: `r${Date.now()}`, name: doc.fileName, error: (e && e.message) || "Could not remove the document." }]);
    }
  };

  const missingRequired = types.filter((t) => t.required && !documents.some((d) => String(d.documentTypeId) === String(t.id)));

  return (
    <section className="ss-card" aria-labelledby="ss-docs-title">
      <div className="ss-card-hd">
        <div className="ss-title">
          <span className="ss-title-ic" aria-hidden="true"><Icon name="upload" /></span>
          <div>
            <h2 id="ss-docs-title">Supporting documents</h2>
            <small>Bank passbook, certificates, photos or a short video</small>
          </div>
        </div>
        <span className="ss-badge">{documents.length} / {rules.maxFiles} uploaded</span>
      </div>
      <p className="ss-sub" style={{ marginTop: 10 }}>
        {rules.minFiles > 0 ? `At least ${rules.minFiles} document${rules.minFiles > 1 ? "s are" : " is"} required. ` : ""}You can upload up to {rules.maxFiles} files.
      </p>

      {types.length > 0 && (
        <div className="ss-field">
          <label htmlFor="ss-doc-type">Document type <span className="ss-req" aria-hidden="true">*</span></label>
          <select id="ss-doc-type" className="ss-select" value={typeId} onChange={(e) => setTypeId(e.target.value)} disabled={disabled}>
            <option value="">Select the document you are uploading</option>
            {types.map((t) => <option key={t.id} value={t.id}>{t.name}{t.required ? " (required)" : ""}</option>)}
          </select>
        </div>
      )}

      {!disabled && total < rules.maxFiles && (
        <div
          className={`ss-drop${drag ? " is-drag" : ""}`}
          onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
          onDragLeave={() => setDrag(false)}
          onDrop={(e) => { e.preventDefault(); setDrag(false); addFiles(e.dataTransfer.files); }}
        >
          <span className="ss-drop-ic" aria-hidden="true"><Icon name="upload-cloud" /></span>
          <p><strong>Drag and drop your files here</strong></p>
          <p className="ss-hint" style={{ justifyContent: "center", margin: "0 0 10px" }}>or take a photo / pick files from your phone or computer</p>
          <label className="ss-btn ss-btn-primary" htmlFor="ss-doc-file"><Icon name="plus" /> Choose files</label>
          <input id="ss-doc-file" ref={inputRef} type="file" accept={ACCEPT} multiple className="ss-visually-hidden" onChange={(e) => addFiles(e.target.files)} />
          <div className="ss-types" aria-label="Allowed file types">
            <span>PDF</span><span>JPG</span><span>PNG</span><span>MP4</span><span>max {sizeText(rules.maxFileBytes)} each</span>
          </div>
        </div>
      )}

      {(documents.length > 0 || queue.length > 0) && (
        <ul className="ss-files" aria-live="polite">
          {documents.map((d) => (
            <li key={d.id} className="ss-file is-ok">
              <span className="ss-file-ic" aria-hidden="true"><Icon name={fileIcon(d.contentType)} /></span>
              <span className="ss-file-main">
                <strong title={d.fileName}>{d.fileName}</strong>
                <span>{d.documentTypeName ? `${d.documentTypeName} · ` : ""}{sizeText(d.size)} · <Icon name="check-circle" /> Uploaded</span>
              </span>
              {!disabled && (
                <button type="button" className="ss-icon-btn" onClick={() => remove(d)} aria-label={`Remove ${d.fileName}`}><Icon name="trash" /></button>
              )}
            </li>
          ))}
          {queue.map((q) => (
            <li key={q.key} className={`ss-file${q.error ? " is-bad" : ""}`}>
              <span className="ss-file-ic" aria-hidden="true"><Icon name={q.error ? "alert-circle" : fileIcon(q.type)} /></span>
              <span className="ss-file-main">
                <strong title={q.name}>{q.name}</strong>
                {q.error ? (
                  <span className="ss-file-err" role="alert">{q.error}</span>
                ) : (
                  <span className="ss-progress" role="progressbar" aria-valuenow={q.progress} aria-valuemin={0} aria-valuemax={100} aria-label={`Uploading ${q.name}`}>
                    <span style={{ width: `${q.progress}%` }} />
                  </span>
                )}
              </span>
              {q.error && (
                <button type="button" className="ss-icon-btn" onClick={() => setQueue((x) => x.filter((i) => i.key !== q.key))} aria-label="Dismiss"><Icon name="cross" /></button>
              )}
            </li>
          ))}
        </ul>
      )}

      {missingRequired.length > 0 && (
        <p className="ss-hint"><Icon name="info" /> Still required: {missingRequired.map((t) => t.name).join(", ")}</p>
      )}
    </section>
  );
}

// ------------------------------------------------------------------ done

const ACK_TEXT = {
  SENT: { tone: "ok", icon: "check-circle", text: "The acknowledgement has been sent to Seva Sindhu." },
  PENDING: { tone: "info", icon: "clock", text: "The acknowledgement is being sent to Seva Sindhu. This can take a little while; you do not need to do anything." },
  FAILED: { tone: "warn", icon: "alert-circle", text: "The acknowledgement could not be sent to Seva Sindhu yet. The department will send it again; your application is safely submitted." },
};

export function DoneStep({ submitted, ctx, alreadySubmitted }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const ack = ACK_TEXT[submitted.acknowledgementStatus] || ACK_TEXT.PENDING;

  const download = async () => {
    setBusy(true);
    setError(null);
    try {
      const res = await sevasindhuApi.get("acknowledgement", { responseType: "blob" });
      const url = URL.createObjectURL(new Blob([res.data], { type: "application/pdf" }));
      const a = document.createElement("a");
      a.href = url;
      a.download = `Acknowledgement-${submitted.referenceNo || "application"}.pdf`;
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
    <section className="ss-card ss-done" aria-labelledby="ss-done-title" id="ss-application">
      <div className="ss-done-top">
        <span className="ss-done-ic" aria-hidden="true"><Icon name="check" /></span>
        <h2 id="ss-done-title">{alreadySubmitted ? "Application already submitted" : "Application submitted successfully"}</h2>
        <p>
          {alreadySubmitted
            ? "This Seva Sindhu application was submitted earlier. A second application is not created."
            : "Your application has been received by the Department of Sericulture."}
        </p>
        <div className="ss-refbox">
          <div>
            <small>Your e-Reshme reference</small>
            <strong>{submitted.referenceNo}</strong>
          </div>
          <CopyButton value={submitted.referenceNo} />
        </div>
      </div>
      <div className="ss-done-body">
      <dl className="ss-details">
        <Detail label="Seva Sindhu reference" value={submitted.edcsApplicationRefNo} />
        <Detail label="Scheme" value={ctx && (ctx.subSchemeName || ctx.schemeName)} />
        <Detail label="Submitted on" value={when(submitted.submittedAt)} />
        <Detail label="Status" value={submitted.status || "Submitted"} />
        <Detail label="Application number (ARN)" value={submitted.arn} />
      </dl>
      <div style={{ height: 16 }} />
      <Note tone={ack.tone} icon={ack.icon}><p>{ack.text}</p></Note>
      <p className="ss-sub">
        Next: the Sericulture officer for your area will scrutinise the application and your documents. Eligibility and the
        subsidy are decided by the department as per the scheme guidelines. Keep the e-Reshme reference to track the application.
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
      </div>
    </section>
  );
}

// ------------------------------------------------------------------ step

function ApplicationStep({ onSubmitted }) {
  const [ctx, setCtx] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [loadError, setLoadError] = useState(null);
  const [declaration, setDeclaration] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [done, setDone] = useState(null);
  const submitting = useRef(false);

  const load = useCallback(async () => {
    setLoadError(null);
    try {
      const res = await sevasindhuApi.get("application/context");
      setCtx(res.data);
      setDocuments(res.data.documents || []);
    } catch (err) {
      setLoadError(toError(err) || { message: "Could not load your application. Please try again." });
    }
  }, []);
  useEffect(() => { load(); }, [load]);

  if (loadError) {
    return (
      <section className="ss-card" id="ss-application">
        <Note tone="bad" icon="alert-circle" role="alert"><p>{loadError.message}</p></Note>
        <button type="button" className="ss-btn ss-btn-primary" onClick={load}><Icon name="reload" /> Try again</button>
      </section>
    );
  }
  if (!ctx) {
    return (
      <section className="ss-card" id="ss-application" aria-busy="true">
        <p className="ss-hint"><span className="ss-spin dark" aria-hidden="true" style={{ display: "inline-block", verticalAlign: "middle" }} /> Loading your application...</p>
      </section>
    );
  }
  if (done || ctx.submitted) {
    const s = done || ctx.submitted;
    return <DoneStep submitted={s} ctx={ctx} alreadySubmitted={!!(done ? done.alreadySubmitted : true)} />;
  }

  const rules = ctx.uploadRules || { minFiles: 1 };
  const missingRequired = (ctx.documentTypes || []).filter((t) => t.required && !documents.some((d) => String(d.documentTypeId) === String(t.id)));
  const ready = !ctx.blockedReason && documents.length >= (rules.minFiles || 0) && missingRequired.length === 0 && declaration;

  const submit = async () => {
    if (submitting.current) return; // no double submission
    setError(null);
    if (documents.length < (rules.minFiles || 0)) { setError({ message: "Upload at least one supporting document." }); return; }
    if (missingRequired.length) { setError({ message: `Please upload: ${missingRequired.map((t) => t.name).join(", ")}.` }); return; }
    if (!declaration) { setError({ message: "Please confirm the declaration to submit." }); return; }
    submitting.current = true;
    setBusy(true);
    try {
      const res = await sevasindhuApi.post("application/submit", { declaration: true });
      setDone({
        referenceNo: res.data.referenceNo,
        edcsApplicationRefNo: res.data.edcsApplicationRefNo,
        submittedAt: res.data.submittedAt,
        acknowledgementStatus: res.data.acknowledgementStatus,
        status: "Submitted",
        alreadySubmitted: res.data.alreadySubmitted,
      });
      window.scrollTo({ top: 0, behavior: "smooth" });
      if (onSubmitted) onSubmitted(res.data);
    } catch (err) {
      setError(toError(err) || { message: "Your application could not be submitted. Please try again." });
      submitting.current = false;
      setBusy(false);
    }
  };

  return (
    <div id="ss-application">
      <SchemeCard ctx={ctx} />
      <BeneficiaryCard ctx={ctx} />
      {ctx.blockedReason ? (
        <section className="ss-card">
          <Note tone="warn" icon="alert-circle" role="alert" title="This application cannot be submitted online right now."><p>{ctx.blockedReason}</p></Note>
        </section>
      ) : (
        <>
          <DocumentsCard ctx={ctx} documents={documents} setDocuments={setDocuments} disabled={busy} />
          <section className="ss-card" aria-labelledby="ss-submit-title">
            <div className="ss-title">
              <span className="ss-title-ic" aria-hidden="true"><Icon name="send" /></span>
              <div>
                <h2 id="ss-submit-title">Declaration and submission</h2>
                <small>Check your documents, accept the declaration and submit</small>
              </div>
            </div>
            <div className="ss-field" style={{ marginTop: 12 }}>
              <label className="ss-check" htmlFor="ss-app-declaration">
                <input id="ss-app-declaration" type="checkbox" checked={declaration} onChange={(e) => setDeclaration(e.target.checked)} disabled={busy} />
                <span>I declare that the information and documents given are true. I understand the application will be rejected if any information is found false.</span>
              </label>
            </div>
            {error && <Note tone="bad" icon="alert-circle" role="alert"><p>{error.message}</p></Note>}
            <div className="ss-actions">
              <button type="button" className="ss-btn ss-btn-primary ss-btn-lg" onClick={submit} disabled={busy || !ready} aria-busy={busy}>
                {busy ? <span className="ss-spin" aria-hidden="true" /> : <Icon name="send" />} {busy ? "Submitting..." : "Submit Application"}
              </button>
            </div>
            {!ready && !busy && (
              <p className="ss-hint">
                {documents.length < (rules.minFiles || 0) ? "Upload your supporting documents, " : ""}
                {!declaration ? "tick the declaration, " : ""}then submit.
              </p>
            )}
          </section>
        </>
      )}
    </div>
  );
}

export default ApplicationStep;
