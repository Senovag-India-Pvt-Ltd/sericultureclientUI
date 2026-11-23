import { useEffect, useRef, useState } from "react";
import { Spinner } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { Icon } from "../../../components";
import api from "../../../services/auth/api";

// SV-024: a reeler's silk incentive covers only eligible raw silk sales - inside the claimed period, inside the
// reeler's licence validity, after a cocoon purchase, and backed by the cocoons bought. Backend:
// dbt POST /v1/reeler-incentive-eligibility/check (re-checked on save, which refuses ineligible sales).

const baseURLDBT = process.env.REACT_APP_API_BASE_URL_DBT;

const toIsoDate = (d) => {
  if (!d) return null;
  if (typeof d === "string") return /^\d{4}-\d{2}-\d{2}/.test(d) ? d.slice(0, 10) : null;
  if (!(d instanceof Date) || isNaN(d.getTime())) return null;
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};
const toKg = (v) => {
  const n = parseFloat(v);
  return Number.isFinite(n) && n > 0 ? n : null;
};

const styles = `
  .rie { border:1px solid #dbe6f3; border-radius:12px; overflow:hidden; margin-top:14px; background:#fff; }
  .rie-head { display:flex; align-items:center; justify-content:space-between; gap:10px; flex-wrap:wrap; padding:9px 14px; background:#f3f8fe; border-bottom:1px solid #dbe6f3; }
  .rie-title { font-weight:700; color:#1e67a8; display:flex; align-items:center; gap:8px; font-size:.9rem; }
  .rie-pill { border-radius:999px; padding:3px 12px; font-size:.76rem; font-weight:700; display:inline-flex; align-items:center; gap:6px; background:#eef2f7; color:#4a5568; }
  .rie-pill.ok { background:#e9f8ef; color:#18794e; }
  .rie-pill.bad { background:#fdecef; color:#c43257; }
  .rie-pill.warn { background:#fff4e5; color:#b26a00; }
  .rie-body { padding:12px 14px; }
  .rie-facts { display:flex; flex-wrap:wrap; gap:8px 18px; font-size:.8rem; color:#4a5568; margin-bottom:10px; }
  .rie-facts b { color:#1f2d3d; }
  .rie-table { width:100%; border-collapse:separate; border-spacing:0 4px; font-size:.82rem; }
  .rie-table th { color:#6b7a8c; font-weight:600; font-size:.74rem; text-transform:uppercase; letter-spacing:.03em; padding:2px 8px; }
  .rie-table td { padding:7px 8px; vertical-align:top; }
  .rie-table tr.ok td { background:#f1faf4; }
  .rie-table tr.bad td { background:#fdf0f3; color:#8f1d3a; }
  .rie-table tr td:first-child { border-radius:8px 0 0 8px; }
  .rie-table tr td:last-child { border-radius:0 8px 8px 0; }
  .rie-note { font-size:.8rem; border-radius:8px; padding:7px 10px; margin-top:8px; display:flex; gap:8px; align-items:flex-start; }
  .rie-note.bad { background:#fdf0f3; color:#8f1d3a; }
  .rie-note.warn { background:#fff8ec; color:#8a5a00; }
`;

function ReelerIncentiveEligibilityPanel({ fruitsId, month, periodFrom, periodTo, rows, onResult }) {
  const { t } = useTranslation();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const requestId = useRef(0);
  const onResultRef = useRef(onResult);
  onResultRef.current = onResult;

  const payload = {
    fruitsId: fruitsId || null,
    month: month || null,
    periodFrom: toIsoDate(periodFrom),
    periodTo: toIsoDate(periodTo),
    sales: (rows || []).map((r) => ({
      date: toIsoDate(r.equipmentDate),
      quantityKg: toKg(r.noOfRawSilkProduced),
      form17JNo: (r.form17JNo || "").trim() || null,
    })),
  };
  const key = JSON.stringify(payload);

  const run = () => {
    if (!payload.fruitsId || payload.sales.length === 0) {
      setResult(null);
      onResultRef.current && onResultRef.current(null);
      return;
    }
    const id = ++requestId.current;
    setLoading(true);
    setError(null);
    api.post(baseURLDBT + "reeler-incentive-eligibility/check", payload)
      .then((res) => {
        if (id !== requestId.current) return;
        const r = res.data?.content || null;
        setResult(r);
        onResultRef.current && onResultRef.current(r);
      })
      .catch(() => {
        if (id !== requestId.current) return;
        setResult(null);
        setError(t("Eligibility could not be checked right now. It will be checked again when you save."));
        onResultRef.current && onResultRef.current(null);
      })
      .finally(() => {
        if (id === requestId.current) setLoading(false);
      });
  };

  useEffect(() => {
    const timer = setTimeout(run, 500);
    return () => clearTimeout(timer);
  }, [key]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!payload.fruitsId || (result && result.status === "NOT_APPLICABLE")) return null;

  const notEligible = result?.status === "NOT_ELIGIBLE";
  const pill = loading ? (
    <span className="rie-pill"><Spinner size="sm" /> {t("Checking...")}</span>
  ) : error ? (
    <span className="rie-pill warn"><Icon name="alert-circle" /> {t("Not checked")}</span>
  ) : notEligible ? (
    <span className="rie-pill bad"><Icon name="alert-circle-fill" /> {t("Not eligible")}</span>
  ) : result?.status === "ELIGIBLE" ? (
    <span className="rie-pill ok"><Icon name="check-circle-fill" /> {t("Eligible")}</span>
  ) : null;

  return (
    <div className="rie" id="reeler-incentive-eligibility">
      <style>{styles}</style>
      <div className="rie-head">
        <span className="rie-title"><Icon name="shield-check" /> {t("Raw Silk Sale Eligibility")}</span>
        <span className="d-flex align-items-center gap-2">
          {pill}
          <button type="button" className="btn btn-sm btn-outline-primary" onClick={run} disabled={loading}>
            <Icon name="reload" /> {t("Re-check")}
          </button>
        </span>
      </div>
      <div className="rie-body">
        {error && <div className="rie-note warn"><Icon name="alert-circle" /> {error}</div>}
        {result && (
          <>
            <div className="rie-facts">
              <span>{t("Claimed period")}: <b>{result.claimPeriod}</b></span>
              <span>{t("Licence valid")}: <b>{result.licenceValidFrom} {t("to")} {result.licenceValidTo}</b></span>
              {result.cocoonsRequiredKg > 0 && (
                <span>{t("Cocoons bought / needed")}: <b>{result.cocoonsPurchasedKg} / {result.cocoonsRequiredKg} kg</b></span>
              )}
            </div>
            <table className="rie-table">
              <thead>
                <tr><th>#</th><th>{t("Sale date")}</th><th>{t("Raw silk (kg)")}</th><th>{t("Form 17J")}</th><th>{t("Eligibility")}</th></tr>
              </thead>
              <tbody>
                {(result.rows || []).map((row) => (
                  <tr key={row.number} className={row.eligible ? "ok" : "bad"}>
                    <td>{row.number}</td>
                    <td>{row.date}</td>
                    <td>{row.quantityKg ?? "-"}</td>
                    <td>{row.form17JNo || "-"}</td>
                    <td>
                      {row.eligible
                        ? <span><Icon name="check-circle-fill" /> {t("Eligible")}</span>
                        : (row.reasons || []).map((reason, i) => <div key={i}><Icon name="alert-circle-fill" /> {reason}</div>)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {(result.errors || []).map((e, i) => (
              <div className="rie-note bad" key={`e${i}`}><Icon name="alert-circle-fill" /> {e}</div>
            ))}
            {(result.warnings || []).map((w, i) => (
              <div className="rie-note warn" key={`w${i}`}><Icon name="info-fill" /> {w}</div>
            ))}
            {notEligible && (
              <div className="rie-note bad"><Icon name="info-fill" /> {t("The incentive can be claimed only for eligible sales. Remove or correct the sales marked above to save.")}</div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default ReelerIncentiveEligibilityPanel;
