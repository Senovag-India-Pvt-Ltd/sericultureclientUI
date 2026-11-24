import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Spinner, Table } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { Icon } from "../../../components";
import api from "../../../services/auth/api";

// SR-012: benefit / subsidy history on the reeler profile.
// Only reeler applications are shown (the DBT farmer_id column also matches unrelated farmers, the backend filters on
// beneficiary type). A sanctioned copy is merged with its application, so each benefit appears once. Benefits taken
// under an earlier licence (before a transfer) are shown in their own labelled group, not in this reeler's totals.
// Backend: dbt /v1/reeler-benefit-history/{reelerId}

const baseURLDBT = process.env.REACT_APP_API_BASE_URL_DBT;

const inr = (v) => (v === null || v === undefined ? "-" : Number(v).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
const dmy = (iso) => {
  if (!iso) return "-";
  const [y, m, d] = String(iso).substring(0, 10).split("-");
  return d && m && y ? `${d}-${m}-${y}` : iso;
};
const appLink = (b) =>
  b.serviceApplicationId ? `/seriui/service-application-edit/${b.serviceApplicationId}`
    : b.formApplicationId ? `/seriui/application-form-edit/${b.formApplicationId}` : null;

const styles = `
  .rbh-stats { display:grid; grid-template-columns:repeat(auto-fit,minmax(150px,1fr)); gap:10px; margin-bottom:12px; }
  .rbh-stat { border:1px solid #e3eaf3; border-radius:12px; padding:10px 12px; background:#fff; }
  .rbh-stat b { display:block; font-size:1.1rem; color:#1f2d3d; }
  .rbh-stat span { font-size:.7rem; color:#6b7a8c; text-transform:uppercase; letter-spacing:.04em; font-weight:700; }
  .rbh-stat.ok b { color:#18794e; }
  .rbh-wrap { border:1px solid #e3eaf3; border-radius:12px; overflow:auto; max-height:460px; }
  .rbh-table { margin:0 !important; }
  .rbh-table thead th { position:sticky; top:0; z-index:1; background:#f4f8fd !important; font-size:.7rem; text-transform:uppercase; letter-spacing:.04em; color:#5a6b80; white-space:nowrap; padding:9px 10px !important; }
  .rbh-table td { font-size:.82rem; vertical-align:middle; padding:9px 10px !important; border-color:#eef2f7 !important; }
  .rbh-table .num { text-align:right; white-space:nowrap; font-variant-numeric:tabular-nums; }
  .rbh-sub { display:block; font-size:.72rem; color:#6b7a8c; }
  .rbh-status { display:inline-block; border-radius:999px; padding:2px 9px; font-size:.7rem; font-weight:700; background:#eef3f9; color:#4a5568; white-space:nowrap; }
  .rbh-status.paid { background:#e7f7ee; color:#18794e; }
  .rbh-status.rej { background:#fdecf0; color:#c43257; }
  .rbh-status.sanc { background:#eef6ff; color:#1e67a8; }
  .rbh-open { font-weight:700; color:#1e67a8; text-decoration:none; white-space:nowrap; display:inline-flex; align-items:center; gap:4px; }
  .rbh-earlier { margin-top:16px; border:1px dashed #c9d6e6; border-radius:12px; padding:12px; background:#fbfdff; }
  .rbh-earlier-head { font-weight:800; color:#1f2d3d; display:flex; align-items:center; gap:8px; flex-wrap:wrap; margin-bottom:8px; }
  .rbh-earlier-head .tag { background:#fff4e5; color:#b26a00; border-radius:999px; padding:2px 9px; font-size:.7rem; font-weight:800; }
  .rbh-empty { text-align:center; color:#7a8899; font-size:.85rem; padding:16px; border:1px dashed #cbd5e1; border-radius:10px; background:#fff; }
`;

function statusClass(b) {
  if (b.paid) return "paid";
  if (b.rejected) return "rej";
  if (b.sanctioned) return "sanc";
  return "";
}

function Benefits({ group, t }) {
  const list = group?.benefits || [];
  if (!list.length) return <div className="rbh-empty">{t("No subsidy / benefit applications")}</div>;
  return (
    <div className="rbh-wrap">
      <Table hover size="sm" className="rbh-table">
        <thead>
          <tr>
            <th>{t("ARN")}</th><th>{t("Scheme / Component")}</th><th>{t("Year / Month")}</th>
            <th className="num">{t("Amount (₹)")}</th><th>{t("Status")}</th><th>{t("Sanction / Payment")}</th><th />
          </tr>
        </thead>
        <tbody>
          {list.map((b, i) => (
            <tr key={`${b.serviceApplicationId || ""}-${b.formApplicationId || ""}-${i}`}>
              <td><b>{b.arn || "-"}</b><span className="rbh-sub">{t("Applied")} {dmy(b.appliedOn)}</span></td>
              <td>{b.subScheme || b.scheme || "-"}<span className="rbh-sub">{[b.scheme, b.component !== b.subScheme ? b.component : null, b.machineType].filter(Boolean).join(" · ")}</span></td>
              <td style={{ whiteSpace: "nowrap" }}>{b.financialYear || "-"}<span className="rbh-sub">{b.month || ""}</span></td>
              <td className="num"><b>{inr(b.amount)}</b></td>
              <td><span className={`rbh-status ${statusClass(b)}`}>{b.applicationStatus || b.approvalStage || t("In progress")}</span>
                {b.approvalStage && b.applicationStatus && <span className="rbh-sub">{b.approvalStage}</span>}</td>
              <td>
                {b.sanctionOrderNumber ? <span className="rbh-sub" style={{ color: "#1f2d3d" }}>{b.sanctionOrderNumber}</span> : <span className="rbh-sub">-</span>}
                {b.dateOfPayment && <span className="rbh-sub">{t("Paid")} {dmy(b.dateOfPayment)}{b.paymentReference ? ` · ${b.paymentReference}` : ""}</span>}
              </td>
              <td>{appLink(b) && <Link className="rbh-open" to={appLink(b)}><Icon name="external" /> {t("Open")}</Link>}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

function Totals({ group, t }) {
  return (
    <div className="rbh-stats">
      <div className="rbh-stat"><b>{group.benefitCount}</b><span>{t("Applications")}</span></div>
      <div className="rbh-stat"><b>₹ {inr(group.totalAmount)}</b><span>{t("Total applied")}</span></div>
      <div className="rbh-stat"><b>{group.sanctionedCount} · ₹ {inr(group.sanctionedAmount)}</b><span>{t("Sanctioned")}</span></div>
      <div className="rbh-stat ok"><b>{group.paidCount} · ₹ {inr(group.paidAmount)}</b><span>{t("Paid")}</span></div>
    </div>
  );
}

function ReelerBenefitHistory({ reelerId }) {
  const { t } = useTranslation();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!reelerId) return;
    setLoading(true);
    setFailed(false);
    api.get(baseURLDBT + `reeler-benefit-history/${reelerId}`)
      .then((res) => {
        const c = res.data?.content;
        if (!c || c.error) { setFailed(true); setData(null); } else setData(c);
      })
      .catch(() => { setFailed(true); setData(null); })
      .finally(() => setLoading(false));
  }, [reelerId]);

  if (loading) return <div className="rbh-empty"><style>{styles}</style><Spinner size="sm" /> {t("Loading...")}</div>;
  if (failed || !data) return <div className="rbh-empty"><style>{styles}</style>{t("Benefit history could not be loaded.")}</div>;

  return (
    <div>
      <style>{styles}</style>
      <Totals group={data.own} t={t} />
      <Benefits group={data.own} t={t} />
      {(data.earlierLicences || []).map((g) => (
        <div className="rbh-earlier" key={g.reeler.reelerId}>
          <div className="rbh-earlier-head">
            <span className="tag">{t("Earlier licence")}</span>
            <span>{g.reeler.name} · {g.reeler.reelingLicenseNumber || `#${g.reeler.reelerId}`}</span>
            <Link className="rbh-open" to={`/seriui/reeler-license-view/${g.reeler.reelerId}`}><Icon name="user" /> {t("Open that profile")}</Link>
          </div>
          <div className="rbh-sub mb-2">{t("Benefits taken under the earlier licence before transfer - shown for reference, not included in the totals above.")}</div>
          <Totals group={g} t={t} />
          <Benefits group={g} t={t} />
        </div>
      ))}
    </div>
  );
}

export default ReelerBenefitHistory;
