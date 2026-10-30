import { useState } from "react";
import { Link } from "react-router-dom";
import { Icon } from "../../components";
import "./sevasindhu-source.css";

// "Received through Seva Sindhu" card shown on the department's application pages (Service Application, and the
// edit pages). Presentational only: the page passes the Seva Sindhu details and a document viewer.
//   state: "prefilled" (opened from Seva Sindhu Applications, not saved yet), "created" (normal application exists),
//          "notAssigned" (another officer's / unrouted application), "view" (edit pages), "error"

const PILL = {
  prefilled: { cls: "is-info", icon: "edit", text: "Pre-filled from Seva Sindhu" },
  created: { cls: "is-ok", icon: "check-circle", text: "Application created" },
  notAssigned: { cls: "is-warn", icon: "alert-circle", text: "Not assigned to you" },
  view: { cls: "is-ok", icon: "link", text: "Seva Sindhu application" },
  error: { cls: "is-bad", icon: "alert-circle", text: "Could not load" },
};

const fmtDate = (d) => (d ? new Date(d).toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) : null);
const fmtSize = (b) => (b == null ? "" : b < 1048576 ? `${Math.max(1, Math.round(b / 1024))} KB` : `${(b / 1048576).toFixed(2)} MB`);
const fileIcon = (t = "") => (t.startsWith("image/") ? "img" : t.startsWith("video/") ? "video" : "file-pdf");
const fileKind = (t = "") => (t.startsWith("image/") ? "Image" : t.startsWith("video/") ? "Video" : "PDF");

function Chip({ label, value, mono, copy }) {
  const [copied, setCopied] = useState(false);
  if (!value) return null;
  const doCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (e) {
      /* ignore */
    }
  };
  return (
    <div className="ssc-chip">
      <span className="ssc-chip-label">{label}</span>
      <span className={`ssc-chip-value${mono ? " is-mono" : ""}`}>{value}</span>
      {copy && (
        <button type="button" className="ssc-copy" onClick={doCopy} title={copied ? "Copied" : "Copy"} aria-label={`Copy ${value}`}>
          <Icon name={copied ? "check" : "copy"} />
        </button>
      )}
    </div>
  );
}

function SevaSindhuSourceCard({ info, state = "view", message, createdLink, onViewDocument }) {
  const pill = PILL[state] || PILL.view;
  const docs = (info && info.documents) || [];

  if (state === "error") {
    return (
      <div className="ssc-card is-error" role="alert">
        <div className="ssc-hd">
          <span className="ssc-ic is-bad" aria-hidden="true"><Icon name="alert-circle" /></span>
          <div className="ssc-titles">
            <h3>Seva Sindhu application</h3>
            <p>{message}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`ssc-card ssc-${state}`}>
      <div className="ssc-hd">
        <span className="ssc-ic" aria-hidden="true"><Icon name="link" /></span>
        <div className="ssc-titles">
          <h3>Application received through Seva Sindhu</h3>
          <p>{message}</p>
        </div>
        <span className={`ssc-pill ${pill.cls}`}><Icon name={pill.icon} /> {pill.text}</span>
      </div>

      <div className="ssc-chips">
        <Chip label="Seva Sindhu / EDCS reference" value={info.edcsApplicationRefNo} mono copy />
        <Chip label="e-Reshme reference" value={info.referenceNo} mono copy />
        <Chip label="Applicant" value={info.beneficiary?.name || info.applicantName} />
        <Chip label="Submitted on" value={fmtDate(info.submittedAt)} />
        {state === "created" && createdLink && (
          <Link to={createdLink} className="ssc-open"><Icon name="arrow-right" /> Open the application</Link>
        )}
      </div>

      {docs.length > 0 && (
        <div className="ssc-docs">
          <div className="ssc-docs-hd"><Icon name="files" /> Documents received through Seva Sindhu <span>{docs.length}</span></div>
          <div className="ssc-docs-grid">
            {docs.map((d) => (
              <button key={d.id} type="button" className="ssc-doc" onClick={() => onViewDocument && onViewDocument(d)} title={`View ${d.fileName}`}>
                <span className={`ssc-doc-ic is-${fileKind(d.contentType).toLowerCase()}`} aria-hidden="true"><Icon name={fileIcon(d.contentType)} /></span>
                <span className="ssc-doc-main">
                  <strong>{d.documentTypeName || d.fileName}</strong>
                  <small>{d.documentTypeName ? `${d.fileName} · ` : ""}{fileKind(d.contentType)} · {fmtSize(d.size)}</small>
                </span>
                <span className="ssc-doc-view"><Icon name="eye" /> View</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default SevaSindhuSourceCard;
