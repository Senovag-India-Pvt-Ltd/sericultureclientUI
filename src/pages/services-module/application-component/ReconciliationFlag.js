import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import api from "../../../services/auth/api";

// SV-018: shows, on the verification / eligibility / sanction lists, whether an incentive application's CRC sale,
// rearing record and market sale matched when it was saved (and the officer's remarks when they did not).
// Backend: dbt POST /v1/incentive-reconciliation/by-application-ids.

const baseURLDBT = process.env.REACT_APP_API_BASE_URL_DBT;

const escapeHtml = (s) =>
  String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

// The in-progress task lists (getInProgressTaskListByUserIdAndStepId) return the sc_application_form_service id as
// "applicationDocumentId"; "applicationFormId" there is the older sc_application_form id.
const DEFAULT_ID_KEY = "applicationDocumentId";

/** Map of application id -> stored reconciliation, for the given rows (rows without a result are simply absent). */
export function useReconciliationFlags(rows, idKey = DEFAULT_ID_KEY) {
  const [flags, setFlags] = useState({});
  const ids = (Array.isArray(rows) ? rows : [])
    .map((r) => Number(r?.[idKey]))
    .filter((id) => Number.isFinite(id) && id > 0);
  const key = Array.from(new Set(ids)).sort((a, b) => a - b).join(",");

  useEffect(() => {
    if (!key) {
      setFlags({});
      return undefined;
    }
    let cancelled = false;
    api.post(baseURLDBT + "incentive-reconciliation/by-application-ids", key.split(",").map(Number))
      .then((res) => {
        if (cancelled) return;
        const map = {};
        (res.data?.content || []).forEach((f) => { map[f.applicationId] = f; });
        setFlags(map);
      })
      .catch(() => { if (!cancelled) setFlags({}); });
    return () => { cancelled = true; };
  }, [key]);

  return flags;
}

const PILL = {
  DISCREPANCY: { bg: "#fdecef", color: "#c43257", border: "#f5c2cf" },
  MATCHED: { bg: "#e9f8ef", color: "#18794e", border: "#bfe6cf" },
  CHECK_FAILED: { bg: "#fff4e5", color: "#b26a00", border: "#f5d9a8" },
};

function showDetails(flag, t) {
  const checks = (flag.checks || [])
    .filter((c) => c.result === "DISCREPANCY")
    .map((c) => `<li style="margin-bottom:6px;">${escapeHtml(c.message)}</li>`)
    .join("");
  Swal.fire({
    icon: flag.status === "DISCREPANCY" ? "warning" : flag.status === "MATCHED" ? "success" : "info",
    title: t ? t("CRC / Rearing / Market check") : "CRC / Rearing / Market check",
    html: `
      <div style="text-align:left;font-size:13.5px;color:#374151;">
        ${checks ? `<ul style="padding-left:18px;margin:0 0 10px;">${checks}</ul>` : `<p>${flag.status === "MATCHED" ? "The CRC sale, rearing record and market sale matched." : "The records could not be checked when the application was saved."}</p>`}
        ${flag.officerRemarks ? `<div style="background:#f4f7fb;border-radius:8px;padding:8px 12px;"><b>Officer remarks:</b><br/>${escapeHtml(flag.officerRemarks)}</div>` : ""}
      </div>`,
    confirmButtonColor: "#1e67a8",
  });
}

/** Small clickable pill; renders "-" for applications without a stored result (not an incentive / bonus claim). */
export function ReconciliationBadge({ flag, t }) {
  if (!flag) return <span style={{ color: "#9aa8b8" }}>-</span>;
  const style = PILL[flag.status] || PILL.CHECK_FAILED;
  const label =
    flag.status === "DISCREPANCY"
      ? `${flag.discrepancyCount} ${flag.discrepancyCount === 1 ? "issue" : "issues"}`
      : flag.status === "MATCHED"
        ? "Matched"
        : "Not checked";
  return (
    <button
      type="button"
      onClick={() => showDetails(flag, t)}
      title={t ? t("View CRC / rearing / market check") : "View CRC / rearing / market check"}
      style={{
        background: style.bg, color: style.color, border: `1px solid ${style.border}`, borderRadius: 999,
        padding: "2px 10px", fontSize: 12, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap",
      }}
    >
      {t ? t(label) : label}
    </button>
  );
}

/** Column definition for react-data-table-component lists. */
export function reconciliationColumn(flags, t, idKey = DEFAULT_ID_KEY) {
  return {
    name: t ? t("CRC/Market Check") : "CRC/Market Check",
    selector: (row) => flags[row?.[idKey]]?.status || "",
    cell: (row) => <ReconciliationBadge flag={flags[row?.[idKey]]} t={t} />,
    sortable: true,
    minWidth: "130px",
  };
}
