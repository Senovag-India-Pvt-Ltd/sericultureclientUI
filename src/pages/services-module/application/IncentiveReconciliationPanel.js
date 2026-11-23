import { useEffect, useRef, useState } from "react";
import { Form, Spinner } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { Icon } from "../../../components";
import api from "../../../services/auth/api";

// SV-018: compares the farmer's CRC (chawki) sale, the rearing (field) record and the market sale before a cocoon
// incentive / bonus is confirmed. Backend: dbt POST /v1/incentive-reconciliation/check. A discrepancy needs the
// officer's remarks to save (enforced again by the backend on save).

const baseURLDBT = process.env.REACT_APP_API_BASE_URL_DBT;

const toIsoDate = (d) => {
  if (!d) return null;
  if (typeof d === "string") return d.slice(0, 10);
  if (!(d instanceof Date) || isNaN(d.getTime())) return null;
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};
const toNumber = (v) => {
  const n = Number(v);
  return v === "" || v === null || v === undefined || !Number.isFinite(n) || n <= 0 ? null : n;
};

const CHECK_LABELS = {
  MARKET_RECORD: "Market sale",
  CRC_SALE: "CRC sale & dates",
  CHAWKI_DATE: "Chawki distribution date",
  RACE_GROUP: "Race",
  DFL_COUNT: "DFLs",
  YIELD: "Yield",
  FIELD_VS_MARKET: "Rearing record vs market",
};

const styles = `
  .irp { border:1px solid #dbe6f3; border-radius:12px; overflow:hidden; margin:18px 0; background:#fff; }
  .irp-head { display:flex; align-items:center; justify-content:space-between; gap:10px; flex-wrap:wrap; padding:10px 16px; background:linear-gradient(135deg,#1e67a8 0%,#0d4f8a 100%); color:#fff; }
  .irp-title { font-weight:700; display:flex; align-items:center; gap:8px; letter-spacing:.2px; }
  .irp-status { border-radius:999px; padding:3px 12px; font-size:.78rem; font-weight:700; display:inline-flex; align-items:center; gap:6px; background:rgba(255,255,255,.18); }
  .irp-status.ok { background:#e9f8ef; color:#18794e; }
  .irp-status.bad { background:#fdecef; color:#c43257; }
  .irp-status.warn { background:#fff4e5; color:#b26a00; }
  .irp-recheck { border:1px solid rgba(255,255,255,.5); background:transparent; color:#fff; border-radius:8px; padding:3px 10px; font-size:.78rem; font-weight:600; display:inline-flex; align-items:center; gap:5px; }
  .irp-recheck:disabled { opacity:.6; }
  .irp-body { padding:14px 16px; }
  .irp-msg { color:#4a5568; font-size:.85rem; margin-bottom:12px; }
  .irp-cols { display:grid; grid-template-columns:repeat(auto-fit,minmax(220px,1fr)); gap:12px; margin-bottom:14px; }
  .irp-col { border:1px solid #e6eef7; border-radius:10px; padding:10px 12px; background:#fbfdff; }
  .irp-col h6 { font-size:.8rem; font-weight:700; color:#1e67a8; text-transform:uppercase; letter-spacing:.04em; margin:0 0 8px; display:flex; align-items:center; gap:6px; }
  .irp-kv { display:flex; justify-content:space-between; gap:10px; font-size:.8rem; padding:3px 0; border-bottom:1px dashed #edf2f7; }
  .irp-kv:last-child { border-bottom:none; }
  .irp-kv span { color:#6b7a8c; }
  .irp-kv b { color:#1f2d3d; text-align:right; word-break:break-word; }
  .irp-none { color:#9aa8b8; font-size:.8rem; font-style:italic; }
  .irp-checks { display:flex; flex-direction:column; gap:6px; }
  .irp-check { display:flex; gap:10px; align-items:flex-start; padding:8px 10px; border-radius:8px; font-size:.82rem; }
  .irp-check .icon { font-size:1.05rem; margin-top:1px; }
  .irp-check.DISCREPANCY { background:#fdf0f3; color:#8f1d3a; }
  .irp-check.OK { background:#f1faf4; color:#1d5e3b; }
  .irp-check.INFO { background:#f4f7fb; color:#4a5568; }
  .irp-check b { display:block; font-size:.74rem; text-transform:uppercase; letter-spacing:.03em; opacity:.85; }
  .irp-remarks { margin-top:14px; border-top:1px solid #f1d4dc; padding-top:12px; }
  .irp-remarks label { font-weight:700; color:#8f1d3a; font-size:.85rem; }
`;

function IncentiveReconciliationPanel({ fruitsId, marketId, transactionDate, lotNo, raceId, subSchemeId, remarks, onRemarksChange, onResult }) {
  const { t } = useTranslation();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const requestId = useRef(0);
  const onResultRef = useRef(onResult);
  onResultRef.current = onResult;

  const date = toIsoDate(transactionDate);
  const payload = {
    fruitsId: fruitsId || null,
    marketId: toNumber(marketId),
    transactionDate: date,
    lotNo: toNumber(lotNo),
    raceId: toNumber(raceId),
    subSchemeId: toNumber(subSchemeId),
  };
  const key = JSON.stringify(payload);

  const run = () => {
    if (!payload.fruitsId || !payload.transactionDate) {
      setResult(null);
      onResultRef.current && onResultRef.current(null);
      return;
    }
    const id = ++requestId.current;
    setLoading(true);
    setError(null);
    api.post(baseURLDBT + "incentive-reconciliation/check", payload)
      .then((res) => {
        if (id !== requestId.current) return; // a newer check is running
        const r = res.data?.content || null;
        setResult(r);
        onResultRef.current && onResultRef.current(r);
      })
      .catch(() => {
        if (id !== requestId.current) return;
        setResult(null);
        setError(t("The records could not be checked right now. They will be checked again when you save."));
        onResultRef.current && onResultRef.current(null);
      })
      .finally(() => {
        if (id === requestId.current) setLoading(false);
      });
  };

  useEffect(() => {
    const timer = setTimeout(run, 400);
    return () => clearTimeout(timer);
  }, [key]); // eslint-disable-line react-hooks/exhaustive-deps

  if (result && result.status === "NOT_APPLICABLE") return null;

  const discrepancy = result?.status === "DISCREPANCY";
  const statusPill = loading ? (
    <span className="irp-status"><Spinner size="sm" /> {t("Checking...")}</span>
  ) : error ? (
    <span className="irp-status warn"><Icon name="alert-circle" /> {t("Not checked")}</span>
  ) : discrepancy ? (
    <span className="irp-status bad"><Icon name="alert-circle-fill" /> {result.discrepancyCount} {result.discrepancyCount === 1 ? t("discrepancy") : t("discrepancies")}</span>
  ) : result?.status === "MATCHED" ? (
    <span className="irp-status ok"><Icon name="check-circle-fill" /> {t("Records match")}</span>
  ) : null;

  const column = (title, icon, map) => (
    <div className="irp-col">
      <h6><Icon name={icon} /> {title}</h6>
      {map && Object.keys(map).length > 0 ? (
        Object.entries(map).map(([k, v]) => (
          <div className="irp-kv" key={k}><span>{t(k)}</span><b>{v}</b></div>
        ))
      ) : (
        <div className="irp-none">{t("No record found")}</div>
      )}
    </div>
  );

  return (
    <div className="irp" id="incentive-reconciliation">
      <style>{styles}</style>
      <div className="irp-head">
        <span className="irp-title"><Icon name="shield-check" /> {t("CRC Sale / Rearing Record / Market Sale Check")}</span>
        <span className="d-flex align-items-center gap-2">
          {statusPill}
          <button type="button" className="irp-recheck" onClick={run} disabled={loading}>
            <Icon name="reload" /> {t("Re-check")}
          </button>
        </span>
      </div>
      <div className="irp-body">
        {error && <div className="irp-msg">{error}</div>}
        {!error && !result && loading && <div className="irp-msg">{t("Comparing the farmer's CRC sale, rearing record and market sale...")}</div>}
        {result && (
          <>
            <div className="irp-msg">{t(result.message)}</div>
            <div className="irp-cols">
              {column(t("CRC chawki sale"), "cart", result.crcSale)}
              {column(t("Rearing record"), "growth-fill", result.fieldRecord)}
              {column(t("Market sale"), "truck", result.marketSale)}
            </div>
            <div className="irp-checks">
              {(result.checks || []).map((c, i) => (
                <div className={`irp-check ${c.result}`} key={`${c.code}-${i}`}>
                  <Icon name={c.result === "DISCREPANCY" ? "alert-circle-fill" : c.result === "OK" ? "check-circle-fill" : "info-fill"} />
                  <div><b>{t(CHECK_LABELS[c.code] || c.code)}</b>{c.message}</div>
                </div>
              ))}
            </div>
            {discrepancy && (
              <div className="irp-remarks">
                <Form.Label htmlFor="reconciliationRemarks">
                  {t("Remarks on the discrepancy")} <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  id="reconciliationRemarks"
                  as="textarea"
                  rows={2}
                  maxLength={1000}
                  value={remarks || ""}
                  onChange={(e) => onRemarksChange && onRemarksChange(e.target.value)}
                  placeholder={t("Explain why the incentive can still be processed (e.g. verified with the CRC receipt / market slip)")}
                  isInvalid={!(remarks || "").trim()}
                />
                <Form.Control.Feedback type="invalid">{t("Remarks are required to save an application with a discrepancy.")}</Form.Control.Feedback>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default IncentiveReconciliationPanel;
