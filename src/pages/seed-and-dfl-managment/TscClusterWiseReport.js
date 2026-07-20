import React, { useEffect, useMemo, useState } from "react";
import { Card, Form, Row, Col } from "react-bootstrap";
import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import api from "../../services/auth/api";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";

const baseURLMasterData = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURLTargetSetting = process.env.REACT_APP_API_BASE_URL_TARGET_SETTING;

const MONTHS = [
  { value: 1,  label: "January",   kn: "ಜನವರಿ",      apiValue: "JANUARY" },
  { value: 2,  label: "February",  kn: "ಫೆಬ್ರವರಿ",    apiValue: "FEBRUARY" },
  { value: 3,  label: "March",     kn: "ಮಾರ್ಚ್",      apiValue: "MARCH" },
  { value: 4,  label: "April",     kn: "ಏಪ್ರಿಲ್",     apiValue: "APRIL" },
  { value: 5,  label: "May",       kn: "ಮೇ",          apiValue: "MAY" },
  { value: 6,  label: "June",      kn: "ಜೂನ್",        apiValue: "JUNE" },
  { value: 7,  label: "July",      kn: "ಜುಲೈ",        apiValue: "JULY" },
  { value: 8,  label: "August",    kn: "ಆಗಸ್ಟ್",      apiValue: "AUGUST" },
  { value: 9,  label: "September", kn: "ಸೆಪ್ಟೆಂಬರ್",  apiValue: "SEPTEMBER" },
  { value: 10, label: "October",   kn: "ಅಕ್ಟೋಬರ್",    apiValue: "OCTOBER" },
  { value: 11, label: "November",  kn: "ನವೆಂಬರ್",     apiValue: "NOVEMBER" },
  { value: 12, label: "December",  kn: "ಡಿಸೆಂಬರ್",    apiValue: "DECEMBER" },
];

if (!document.getElementById("tsccwr-styles")) {
  const s = document.createElement("style");
  s.id = "tsccwr-styles";
  s.innerHTML = `
    @keyframes tsccwr-in { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:none; } }
    .tsccwr-wrap { animation: tsccwr-in .35s ease; }
    .tsccwr-num { font-feature-settings:"tnum"; font-variant-numeric: tabular-nums; }
    .tsccwr-scroll::-webkit-scrollbar { height:9px; }
    .tsccwr-scroll::-webkit-scrollbar-track { background:#f1f5f9; border-radius:6px; }
    .tsccwr-scroll::-webkit-scrollbar-thumb { background:linear-gradient(135deg,#0f766e,#5b57ac); border-radius:6px; }
  `;
  document.head.appendChild(s);
}

const sel = { borderRadius: "8px", border: "1.5px solid #d0d9e8", padding: "7px 11px", fontSize: "13px", background: "#f8fafd", color: "#333", width: "100%" };
const lbl = { fontSize: "11px", fontWeight: 700, color: "#5a6a7e", marginBottom: "4px", display: "block", textTransform: "uppercase", letterSpacing: "0.06em" };
const btn = (bg, shadow, disabled) => ({
  background: disabled ? "#c8d6e5" : bg,
  border: "none", borderRadius: "9px", padding: "8px 18px",
  fontWeight: 700, fontSize: "13px", color: "#fff",
  cursor: disabled ? "not-allowed" : "pointer",
  boxShadow: disabled ? "none" : shadow,
  display: "flex", alignItems: "center", gap: "7px", whiteSpace: "nowrap",
  transition: "transform .12s ease, box-shadow .12s ease",
});

const groupHead = (bg) => ({
  background: bg, color: "#fff", padding: "10px 8px", textAlign: "center",
  border: "1px solid rgba(255,255,255,.18)", fontWeight: 800,
});
const leafHead = (bg, text) => ({
  background: bg, color: text, padding: "8px 4px", textAlign: "center",
  border: "1px solid rgba(255,255,255,.18)", fontWeight: 700, minWidth: "78px",
});
// Single fixed color for every header cell (group row + leaf row), instead of a
// different color per column group.
const HEADER_BG = "linear-gradient(135deg,#1e3a8a,#2563eb)";
const LEAF_BG = "linear-gradient(180deg,#93c5fd,#60a5fa)";
const LEAF_TEXT = "#1e3a8a";
const cellBase = {
  padding: "9px 6px", textAlign: "center",
  borderBottom: "1px solid #e2e8f0", borderRight: "1px solid #eef2f6", fontSize: "12px",
};

// ---- formatting / null-safe number helpers ----
const isNil = (v) => v === null || v === undefined || v === "";
const numOrNull = (v) => (isNil(v) ? null : Number(v));
const fmt3 = (v) => (isNil(v) ? "—" : Number(v).toLocaleString(undefined, { minimumFractionDigits: 3, maximumFractionDigits: 3 }));
const fmtInt = (v) => (isNil(v) ? "—" : Math.round(Number(v)).toLocaleString());
const fmtPct = (v) => (isNil(v) ? "—" : `${Number(v).toFixed(0)}%`);

function sumOrNull(rows, field) {
  const vals = rows.map((r) => numOrNull(r?.[field])).filter((v) => v !== null);
  return vals.length ? vals.reduce((a, b) => a + b, 0) : null;
}
function avgOrNull(rows, field) {
  const vals = rows.map((r) => numOrNull(r?.[field])).filter((v) => v !== null);
  return vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : null;
}
function pctOrNull(ach, target) {
  return isNil(ach) || isNil(target) || Number(target) === 0 ? null : (Number(ach) * 100) / Number(target);
}

// type7 = Chawki, type8 = Cocoon (per mulberryTargetTypeId mapping)
function metricsFromRows(rows) {
  const chawkiTarget = sumOrNull(rows, "type7_target");
  const chawkiAch = sumOrNull(rows, "type7_achievement");
  const cocoonTarget = sumOrNull(rows, "type8_target");
  const cocoonAch = sumOrNull(rows, "type8_achievement");
  return {
    chawkiTarget, chawkiAch,
    chawkiPct: rows.length === 1 ? numOrNull(rows[0]?.type7_percent_achievement) : pctOrNull(chawkiAch, chawkiTarget),
    rearersCount: sumOrNull(rows, "no_of_sericulturists"),
    failedEggs: sumOrNull(rows, "no_of_dfls_failed"),
    rearedEggs: sumOrNull(rows, "successfully_harvested_dfls"),
    cocoonTarget, cocoonAch,
    cocoonPct: rows.length === 1 ? numOrNull(rows[0]?.type8_percent_achievement) : pctOrNull(cocoonAch, cocoonTarget),
    avgYield: avgOrNull(rows, "average_yield"),
    avgRate: avgOrNull(rows, "average_rate"),
    poorCocoonPct: avgOrNull(rows, "kalave_goodu_percent"),
  };
}

// The backend includes its own pre-computed rollup row with district_name set to
// this marker — that IS the authoritative State Total, so it's pulled out and used
// directly rather than re-aggregated from the real districts (which would either
// double count it or require re-deriving what the backend already computed).
const STATE_TOTAL_MARKERS = ["ರಾಜ್ಯದ ಒಟ್ಟು", "state total"];
const isStateTotalMarkerRow = (r) => {
  // Match as a substring, not an exact match — the backend's district_name for this
  // row may be the combined bilingual label (e.g. "ರಾಜ್ಯದ ಒಟ್ಟು / State Total")
  // rather than just one of the markers alone.
  const name = String(r.district_name || "").trim().toLowerCase();
  return STATE_TOTAL_MARKERS.some((marker) => name.includes(marker.toLowerCase()));
};

function extractStateTotalRows(rawRows) {
  const stateRows = rawRows.filter(isStateTotalMarkerRow);
  return {
    monthRows: stateRows.filter((r) => r.row_label === "Month Start"),
    cumRows: stateRows.filter((r) => r.row_label === "Month End"),
  };
}

// Flat report rows -> District > Cluster tree
function buildGroupedDistricts(rawRows) {
  const districtMap = new Map();
  rawRows.filter((r) => !isStateTotalMarkerRow(r)).forEach((r) => {
    const distId = String(r.district_id);
    if (!districtMap.has(distId)) {
      districtMap.set(distId, { districtId: distId, districtName: r.district_name || "—", clustersMap: new Map() });
    }
    const dist = districtMap.get(distId);
    const clustId = String(r.cluster_id);
    if (!dist.clustersMap.has(clustId)) {
      dist.clustersMap.set(clustId, { clusterId: clustId, clusterName: r.cluster_name || "—", rows: [] });
    }
    // A cluster_id can legitimately appear across multiple raw rows (e.g. stale entries
    // logged before a mega cluster was assigned, alongside newer ones that have one) —
    // collect everything here; which rows actually count is resolved below.
    dist.clustersMap.get(clustId).rows.push(r);
  });

  return Array.from(districtMap.values())
    .map((dist) => {
      const clusters = [];
      dist.clustersMap.forEach((c) => {
        // A cluster_id's raw rows can carry different mega_cluster_id values — not just
        // one real value plus stale nulls, but genuinely *multiple* real mega clusters
        // (e.g. re-assigned mid-year, or separate scheme entries). Split into one entry
        // per distinct real mega cluster so none of that data gets silently dropped.
        // Rows with no mega cluster are only kept as their own "—" entry when this
        // cluster_id has no real mega cluster at all; otherwise they're stale leftovers.
        const hasRealMega = c.rows.some((r) => !isNil(r.mega_cluster_id));
        const relevantRows = hasRealMega ? c.rows.filter((r) => !isNil(r.mega_cluster_id)) : c.rows;

        const byMega = new Map(); // megaClusterId -> raw rows
        relevantRows.forEach((r) => {
          const megaId = hasRealMega ? String(r.mega_cluster_id) : "null";
          if (!byMega.has(megaId)) byMega.set(megaId, []);
          byMega.get(megaId).push(r);
        });

        byMega.forEach((rows, megaId) => {
          const monthRows = rows.filter((r) => r.row_label === "Month Start");
          const cumRows = rows.filter((r) => r.row_label === "Month End");
          clusters.push({
            clusterId: c.clusterId,
            clusterName: c.clusterName,
            megaClusterId: megaId,
            megaClusterName: hasRealMega ? (rows[0].mega_cluster_name || "—") : "—",
            monthRows,
            cumRows,
            chawkiAnnualTarget: sumOrNull(monthRows, "type7_annual_target"),
            cocoonAnnualTarget: sumOrNull(monthRows, "type8_annual_target"),
          });
        });
      });

      // Sort by mega cluster then cluster so clusters sharing a mega cluster sit
      // adjacent — buildRows relies on that to compute the mega cluster rowSpan.
      clusters.sort((a, b) => {
        const megaCmp = String(a.megaClusterName).localeCompare(String(b.megaClusterName));
        if (megaCmp !== 0) return megaCmp;
        return String(a.clusterName).localeCompare(String(b.clusterName));
      });

      return { districtId: dist.districtId, districtName: dist.districtName, clusters };
    })
    .sort((a, b) => String(a.districtName).localeCompare(String(b.districtName)));
}

// A "null" cluster bucket (targets not assigned to any specific cluster) — and,
// within that, a cluster with no mega cluster assigned — is only worth showing when
// it's the only data available. If real clusters exist, unassigned-cluster rows are
// dropped entirely; among what's left, if mega-cluster-assigned clusters exist,
// clusters with no mega cluster are dropped too. Both exclusions fall back to
// showing everything when there's nothing "real" to prefer, so a district/state
// total never ends up with zero contributing clusters.
function visibleClustersOf(clusters) {
  const hasRealCluster = clusters.some((c) => c.clusterId !== "null");
  const withRealId = hasRealCluster ? clusters.filter((c) => c.clusterId !== "null") : clusters;
  const hasRealMegaCluster = withRealId.some((c) => c.megaClusterId !== "null");
  return hasRealMegaCluster ? withRealId.filter((c) => c.megaClusterId !== "null") : withRealId;
}

// District > Cluster tree -> flat renderable rows (with rowSpan bookkeeping)
function buildRows(districts, stateTotalRows) {
  const rows = [];
  let slNo = 0;

  districts.forEach((district) => {
    const visibleClusters = visibleClustersOf(district.clusters);

    const districtRowSpan = visibleClusters.length * 2 + 2;
    let districtCellUsed = false;
    const districtMonthRows = [];
    const districtCumRows = [];
    let districtChawkiAnnualTarget = 0;
    let districtHasChawkiAnnualTarget = false;
    let districtCocoonAnnualTarget = 0;
    let districtHasCocoonAnnualTarget = false;

    // visibleClusters is sorted by megaClusterId first, so clusters sharing a mega
    // cluster form a contiguous run — precompute each run's start index -> rowSpan.
    const megaClusterRowSpanAt = new Map();
    for (let i = 0; i < visibleClusters.length; ) {
      const megaId = visibleClusters[i].megaClusterId;
      let j = i;
      while (j < visibleClusters.length && visibleClusters[j].megaClusterId === megaId) j++;
      megaClusterRowSpanAt.set(i, (j - i) * 2);
      i = j;
    }

    visibleClusters.forEach((cluster, clusterIdx) => {
      slNo += 1;
      districtMonthRows.push(...cluster.monthRows);
      districtCumRows.push(...cluster.cumRows);
      if (!isNil(cluster.chawkiAnnualTarget)) {
        districtChawkiAnnualTarget += Number(cluster.chawkiAnnualTarget);
        districtHasChawkiAnnualTarget = true;
      }
      if (!isNil(cluster.cocoonAnnualTarget)) {
        districtCocoonAnnualTarget += Number(cluster.cocoonAnnualTarget);
        districtHasCocoonAnnualTarget = true;
      }

      const leadCells = [];
      leadCells.push({ type: "sl", value: slNo, rowSpan: 2 });
      if (!districtCellUsed) {
        leadCells.push({ type: "district", value: district.districtName, rowSpan: districtRowSpan });
        districtCellUsed = true;
      }
      if (megaClusterRowSpanAt.has(clusterIdx)) {
        leadCells.push({ type: "megaCluster", value: cluster.megaClusterName, rowSpan: megaClusterRowSpanAt.get(clusterIdx) });
      }
      leadCells.push({ type: "cluster", value: cluster.clusterName, rowSpan: 2 });

      rows.push({
        key: `c-${cluster.clusterId}-${cluster.megaClusterId}-${district.districtId}-m`,
        leadCells,
        chawkiAnnualTargetCell: { value: cluster.chawkiAnnualTarget, rowSpan: 2 },
        cocoonAnnualTargetCell: { value: cluster.cocoonAnnualTarget, rowSpan: 2 },
        periodLabel: "ಮಾಹೆ",
        metrics: metricsFromRows(cluster.monthRows),
      });
      rows.push({
        key: `c-${cluster.clusterId}-${cluster.megaClusterId}-${district.districtId}-c`,
        leadCells: [],
        periodLabel: "ಮಾ.ಅಂ",
        metrics: metricsFromRows(cluster.cumRows),
      });
    });

    const districtChawkiAnnualTargetValue = districtHasChawkiAnnualTarget ? districtChawkiAnnualTarget : null;
    const districtCocoonAnnualTargetValue = districtHasCocoonAnnualTarget ? districtCocoonAnnualTarget : null;
    rows.push({
      key: `d-${district.districtId}-total-m`,
      leadCells: [
        { type: "sl-blank", rowSpan: 2 },
        // District column is still covered by the district-name cell's rowSpan (it
        // spans through the total rows), so this only needs to fill the Mega Cluster +
        // Cluster columns — both are free here since their rowSpans end with the last cluster.
        { type: "total-label", value: "ಒಟ್ಟು", valueEn: "Total", colSpan: 2, rowSpan: 2 },
      ],
      chawkiAnnualTargetCell: { value: districtChawkiAnnualTargetValue, rowSpan: 2 },
      cocoonAnnualTargetCell: { value: districtCocoonAnnualTargetValue, rowSpan: 2 },
      periodLabel: "ಮಾಹೆ",
      metrics: metricsFromRows(districtMonthRows),
      emphasis: true,
    });
    rows.push({
      key: `d-${district.districtId}-total-c`,
      leadCells: [],
      periodLabel: "ಮಾ.ಅಂ",
      metrics: metricsFromRows(districtCumRows),
      emphasis: true,
    });
  });

  // Pinned to whatever the backend sent as its own rollup row — not re-aggregated
  // from the districts above.
  const stateChawkiAnnualTarget = sumOrNull(stateTotalRows.monthRows, "type7_annual_target");
  const stateCocoonAnnualTarget = sumOrNull(stateTotalRows.monthRows, "type8_annual_target");

  // Label + annual target cells are merged (rowSpan 2) across the Month/Cum pair, like
  // the district-total rows — but unlike district-total, nothing above this block has
  // an open rowSpan reaching it, so the label alone must cover all 3 lead columns
  // (District + Mega Cluster + Cluster) after the sl-blank column, not just 2.
  rows.push({
    key: "state-total-m",
    leadCells: [
      { type: "sl-blank", rowSpan: 2 },
      { type: "state-total-label", value: "ರಾಜ್ಯದ ಒಟ್ಟು", valueEn: "State Total", colSpan: 3, rowSpan: 2 },
    ],
    chawkiAnnualTargetCell: { value: stateChawkiAnnualTarget, rowSpan: 2 },
    cocoonAnnualTargetCell: { value: stateCocoonAnnualTarget, rowSpan: 2 },
    periodLabel: "ಮಾಹೆ",
    metrics: metricsFromRows(stateTotalRows.monthRows),
    emphasis: true,
  });
  rows.push({
    key: "state-total-c",
    leadCells: [],
    periodLabel: "ಮಾ.ಅಂ",
    metrics: metricsFromRows(stateTotalRows.cumRows),
    emphasis: true,
  });

  return rows;
}

function TscClusterWiseReport() {
  const { t } = useTranslation();
  const today = new Date();

  const [filter, setFilter] = useState({ financialYearMasterId: "", month: today.getMonth() + 1, districtId: "" });
  const [financialyearListData, setFinancialyearListData] = useState([]);
  const [districtListData, setDistrictListData] = useState([]);
  const [rawRows, setRawRows] = useState([]);
  const [hasReport, setHasReport] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const [isDownloadingExcel, setIsDownloadingExcel] = useState(false);

  useEffect(() => {
    api.get(baseURLMasterData + `financialYearMaster/get-all`)
      .then((r) => setFinancialyearListData(r.data.content.financialYearMaster || []))
      .catch(() => setFinancialyearListData([]));

    api.get(baseURLMasterData + `district/get-all`)
      .then((r) => setDistrictListData(r.data.content.district || []))
      .catch(() => setDistrictListData([]));
  }, []);

  const showWarn = (msg) =>
    Swal.fire({ icon: "warning", title: t("Required Fields"), text: msg, confirmButtonColor: "#d97706" });

  const showErr = (title, msg) =>
    Swal.fire({ icon: "error", title, text: msg, confirmButtonColor: "#e53e3e" });

  const validate = () => {
    if (!filter.financialYearMasterId) return t("Please select Financial Year");
    if (!filter.month) return t("Please select Month");
    return null;
  };

  const reportParams = () => {
    const params = {
      financialYearMasterId: filter.financialYearMasterId,
      month: MONTHS.find((m) => String(m.value) === String(filter.month))?.apiValue,
    };
    if (filter.districtId) params.districtId = filter.districtId;
    return params;
  };

  const handleView = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) { showWarn(err); return; }
    setIsLoading(true);
    try {
      const res = await api.get(baseURLTargetSetting + "productionSchemeReport", { params: reportParams() });
      setRawRows(Array.isArray(res.data) ? res.data : []);
      setHasReport(true);
    } catch (err) {
      setRawRows([]);
      setHasReport(true);
      showErr(t("Fetch Failed"), err?.response?.data?.message || err?.message || t("Failed to load the report."));
    } finally {
      setIsLoading(false);
    }
  };

  const handlePdf = async () => {
    const err = validate();
    if (err) { showWarn(err); return; }
    setIsDownloadingPdf(true);
    try {
      const res = await api.get(baseURLTargetSetting + "productionSchemeReport/pdf", { params: reportParams(), responseType: "blob" });
      window.open(URL.createObjectURL(new Blob([res.data], { type: "application/pdf" })));
    } catch {
      showErr(t("PDF Failed"), t("Could not generate the PDF report."));
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  const handleExcel = async () => {
    const err = validate();
    if (err) { showWarn(err); return; }
    setIsDownloadingExcel(true);
    try {
      const res = await api.get(baseURLTargetSetting + "productionSchemeReport/excel", { params: reportParams(), responseType: "blob" });
      const url = URL.createObjectURL(new Blob([res.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }));
      const a = document.createElement("a");
      a.href = url;
      a.download = `tsc_cluster_wise_report_${filter.financialYearMasterId}_${filter.month}.xlsx`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      showErr(t("Excel Failed"), t("Could not generate the Excel report."));
    } finally {
      setIsDownloadingExcel(false);
    }
  };

  const groupedDistricts = useMemo(() => buildGroupedDistricts(rawRows), [rawRows]);
  const stateTotalRows = useMemo(() => extractStateTotalRows(rawRows), [rawRows]);
  const rows = useMemo(() => buildRows(groupedDistricts, stateTotalRows), [groupedDistricts, stateTotalRows]);

  const monthLabel = MONTHS.find((m) => String(m.value) === String(filter.month));
  const yearLabel = financialyearListData.find(
    (y) => String(y.financialYearMasterId) === String(filter.financialYearMasterId)
  )?.financialYear || "";

  return (
    <Layout title={t("Bivoltine Cluster Wise Report")}>
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">{t("Bivoltine Cluster Wise Report")}</Block.Title>
          </Block.HeadContent>
        </Block.HeadBetween>
      </Block.Head>

      <Block className="mt-n4">
        <Card className="mt-1" style={{ borderRadius: "14px", border: "none", boxShadow: "0 4px 20px rgba(13,78,72,.10)", overflow: "hidden" }}>
          <div style={{
            background: "linear-gradient(135deg,#0f766e 0%,#14b8a6 50%,#5b57ac 100%)",
            padding: "12px 20px", display: "flex", alignItems: "center", gap: "12px",
          }}>
            <div style={{ width: "42px", height: "42px", borderRadius: "12px", background: "rgba(255,255,255,.18)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", backdropFilter: "blur(6px)" }}>🧵</div>
            <div style={{ flex: 1 }}>
              <div style={{ color: "#fff", fontWeight: 800, fontSize: "15px", lineHeight: 1.2 }}>
                ದ್ವಿತಳಿ ಕ್ಲಸ್ಟರ್ ವಾರು ಪ್ರಗತಿ ವರದಿ — Bivoltine Cluster Wise Report
              </div>
            </div>
            {hasReport && (
              <span style={{ background: "rgba(255,255,255,.22)", borderRadius: "20px", padding: "4px 12px", color: "#fff", fontSize: "11px", fontWeight: 700, backdropFilter: "blur(6px)" }}>
                {monthLabel ? `${monthLabel.label} · ${monthLabel.kn}` : ""} {yearLabel}
              </span>
            )}
          </div>

          <Card.Body style={{ padding: "16px 20px 18px", background: "linear-gradient(180deg,#ffffff,#f8fffe)" }}>
            <Form onSubmit={handleView}>
              <Row className="g-2 align-items-end">
                <Col md={3}>
                  <label style={lbl}>{t("Financial Year")} <span style={{ color: "#e53e3e" }}>*</span></label>
                  <Form.Select
                    value={filter.financialYearMasterId}
                    onChange={(e) => { setFilter((p) => ({ ...p, financialYearMasterId: e.target.value })); setHasReport(false); }}
                    style={sel}
                  >
                    <option value="">{t("Select Year")}</option>
                    {financialyearListData.map((y) => (
                      <option key={y.financialYearMasterId} value={y.financialYearMasterId}>{y.financialYear}</option>
                    ))}
                  </Form.Select>
                </Col>
                <Col md={2}>
                  <label style={lbl}>{t("Month")} <span style={{ color: "#e53e3e" }}>*</span></label>
                  <Form.Select
                    value={filter.month}
                    onChange={(e) => { setFilter((p) => ({ ...p, month: e.target.value })); setHasReport(false); }}
                    style={sel}
                  >
                    {MONTHS.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
                  </Form.Select>
                </Col>
                <Col md={3}>
                  <label style={lbl}>{t("District")}</label>
                  <Form.Select
                    value={filter.districtId}
                    onChange={(e) => { setFilter((p) => ({ ...p, districtId: e.target.value })); setHasReport(false); }}
                    style={sel}
                  >
                    <option value="">{t("All Districts")}</option>
                    {districtListData.map((d) => (
                      <option key={d.districtId} value={d.districtId}>{d.districtName}</option>
                    ))}
                  </Form.Select>
                </Col>
                <Col md={4}>
                  <div className="d-flex gap-2 flex-wrap align-items-center">
                    <button type="submit" disabled={isLoading} style={btn("linear-gradient(135deg,#0f766e,#14b8a6)", "0 4px 12px rgba(15,118,110,.32)", isLoading)}>
                      {isLoading ? <><span className="spinner-border spinner-border-sm" /> {t("Loading")}…</> : <>📋 {t("View")}</>}
                    </button>
                    {hasReport && (
                      <>
                        <button type="button" disabled={isDownloadingPdf} onClick={handlePdf} style={btn("linear-gradient(135deg,#b91c1c,#dc2626)", "0 4px 12px rgba(185,28,28,.30)", isDownloadingPdf)}>
                          {isDownloadingPdf ? <><span className="spinner-border spinner-border-sm" /> {t("Generating PDF")}…</> : <>📄 {t("PDF")}</>}
                        </button>
                        <button type="button" disabled={isDownloadingExcel} onClick={handleExcel} style={btn("linear-gradient(135deg,#15803d,#16a34a)", "0 4px 12px rgba(21,128,61,.30)", isDownloadingExcel)}>
                          {isDownloadingExcel ? <><span className="spinner-border spinner-border-sm" /> {t("Exporting")}…</> : <>📊 {t("Excel")}</>}
                        </button>
                      </>
                    )}
                  </div>
                </Col>
              </Row>
            </Form>
          </Card.Body>
        </Card>

        {hasReport && (
          <div className="tsccwr-wrap mt-4">
            <Card style={{ borderRadius: "14px", border: "none", boxShadow: "0 6px 28px rgba(13,78,72,.12)", overflow: "hidden" }}>
              <div style={{
                background: "linear-gradient(135deg,#134e4a,#0f766e 50%,#5b57ac)",
                color: "#fff", padding: "16px 22px", fontWeight: 800, fontSize: "15px", textAlign: "center",
              }}>
                ದ್ವಿತಳಿ ಕ್ಲಸ್ಟರ್ ವಾರು ಪ್ರಗತಿ ವರದಿ
                <div style={{ fontSize: "12px", fontWeight: 600, opacity: .9, marginTop: "4px" }}>
                  Bivoltine Cluster Wise Report · {monthLabel?.label} {yearLabel}
                </div>
              </div>

              <div className="tsccwr-scroll" style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px", minWidth: "1900px" }}>
                  <thead>
                    <tr>
                      <th rowSpan={2} style={{ ...groupHead(HEADER_BG), width: "50px" }}>
                        <div>ಕ್ರ.ಸಂ</div><div style={{ fontSize: "9.5px", fontWeight: 600, opacity: .85 }}>Sl.</div>
                      </th>
                      <th rowSpan={2} style={{ ...groupHead(HEADER_BG), textAlign: "left", minWidth: "150px" }}>
                        <div>ಜಿಲ್ಲೆಯ ಹೆಸರು</div><div style={{ fontSize: "9.5px", fontWeight: 600, opacity: .85 }}>District</div>
                      </th>
                      <th rowSpan={2} style={{ ...groupHead(HEADER_BG), textAlign: "left", minWidth: "160px" }}>
                        <div>ಮೆಗಾ ಕ್ಲಸ್ಟರ್ ಹೆಸರು</div><div style={{ fontSize: "9.5px", fontWeight: 600, opacity: .85 }}>Mega Cluster</div>
                      </th>
                      <th rowSpan={2} style={{ ...groupHead(HEADER_BG), textAlign: "left", minWidth: "170px" }}>
                        <div>ಕ್ಲಸ್ಟರ್ ಹೆಸರು</div><div style={{ fontSize: "9.5px", fontWeight: 600, opacity: .85 }}>Cluster</div>
                      </th>
                      <th rowSpan={2} style={groupHead(HEADER_BG)}>
                        <div>ಮಾಹೆ/ಮಾ.ಅಂ</div><div style={{ fontSize: "9.5px", fontWeight: 600, opacity: .85 }}>Month/Cum.</div>
                      </th>
                      <th colSpan={5} style={groupHead(HEADER_BG)}>
                        <div>ಚಾಕಿ ಇವರಗಳು (ಲಕ್ಷಗಳಲ್ಲಿ)</div><div style={{ fontSize: "9.5px", fontWeight: 600, opacity: .85 }}>Chawki Rearers (in Lakhs)</div>
                      </th>
                      <th rowSpan={2} style={groupHead(HEADER_BG)}>
                        <div>ವಿಫಲವಾದ ಮೊಟ್ಟೆಗಳು</div><div style={{ fontSize: "9.5px", fontWeight: 600, opacity: .85 }}>Failed Eggs</div>
                      </th>
                      <th rowSpan={2} style={groupHead(HEADER_BG)}>
                        <div>ಬೆಳೆಯಾದ ಮೊಟ್ಟೆಗಳು</div><div style={{ fontSize: "9.5px", fontWeight: 600, opacity: .85 }}>Reared Eggs</div>
                      </th>
                      <th colSpan={4} style={groupHead(HEADER_BG)}>
                        <div>ಗೂಡಿನ ಅಂದಾಜನೆ (ಮೆ.ಟನ್ ಗಳಲ್ಲಿ)</div><div style={{ fontSize: "9.5px", fontWeight: 600, opacity: .85 }}>Cocoon Estimation (in MT)</div>
                      </th>
                      <th rowSpan={2} style={groupHead(HEADER_BG)}>
                        <div>ಸರಾಸರಿ ಇಳುವರಿ</div><div style={{ fontSize: "9.5px", fontWeight: 600, opacity: .85 }}>Avg Yield</div>
                      </th>
                      <th rowSpan={2} style={groupHead(HEADER_BG)}>
                        <div>ಸರಾಸರಿ ದರ (ರೂ.ಗಳಲ್ಲಿ)</div><div style={{ fontSize: "9.5px", fontWeight: 600, opacity: .85 }}>Avg Rate (Rs)</div>
                      </th>
                      <th rowSpan={2} style={groupHead(HEADER_BG)}>
                        <div>ಕಳಪೆ ಗೂಡು (ಶೇ)</div><div style={{ fontSize: "9.5px", fontWeight: 600, opacity: .85 }}>Poor Cocoon (%)</div>
                      </th>
                    </tr>
                    <tr>
                      <th style={leafHead(LEAF_BG, LEAF_TEXT)}><div>ವಾರ್ಷಿಕ ಗುರಿ</div><div style={{ fontSize: "8.5px", opacity: .8 }}>Annual Target</div></th>
                      <th style={leafHead(LEAF_BG, LEAF_TEXT)}><div>ಗುರಿ</div><div style={{ fontSize: "8.5px", opacity: .8 }}>Target</div></th>
                      <th style={leafHead(LEAF_BG, LEAF_TEXT)}><div>ಸಾಧನೆ</div><div style={{ fontSize: "8.5px", opacity: .8 }}>Achv.</div></th>
                      <th style={leafHead(LEAF_BG, LEAF_TEXT)}><div>ಶೇ. ಸಾಧನೆ</div><div style={{ fontSize: "8.5px", opacity: .8 }}>% Achv.</div></th>
                      <th style={leafHead(LEAF_BG, LEAF_TEXT)}><div>ಬೆಳೆಗಾರರ ಸಂಖ್ಯೆ</div><div style={{ fontSize: "8.5px", opacity: .8 }}>Rearers No.</div></th>

                      <th style={leafHead(LEAF_BG, LEAF_TEXT)}><div>ವಾರ್ಷಿಕ ಗುರಿ</div><div style={{ fontSize: "8.5px", opacity: .8 }}>Annual Target</div></th>
                      <th style={leafHead(LEAF_BG, LEAF_TEXT)}><div>ಗುರಿ</div><div style={{ fontSize: "8.5px", opacity: .8 }}>Target</div></th>
                      <th style={leafHead(LEAF_BG, LEAF_TEXT)}><div>ಸಾಧನೆ</div><div style={{ fontSize: "8.5px", opacity: .8 }}>Achv.</div></th>
                      <th style={leafHead(LEAF_BG, LEAF_TEXT)}><div>ಶೇ. ಸಾಧನೆ</div><div style={{ fontSize: "8.5px", opacity: .8 }}>% Achv.</div></th>
                    </tr>
                  </thead>
                  <tbody>
                    {rawRows.length === 0 && (
                      <tr>
                        <td colSpan={19} style={{ padding: "40px 20px", textAlign: "center", color: "#a0aec0", fontSize: "14px" }}>
                          ಯಾವುದೇ ಮಾಹಿತಿ ಲಭ್ಯವಿಲ್ಲ &nbsp;/&nbsp; No records found.
                        </td>
                      </tr>
                    )}
                    {rawRows.length > 0 && rows.map((row) => {
                      const rowBg = row.emphasis ? "linear-gradient(135deg,#f1f5f9,#e2e8f0)" : "#ffffff";
                      const m = row.metrics;
                      return (
                        <tr key={row.key} style={{ background: rowBg }}>
                          {row.leadCells.map((cell, i) => {
                            if (cell.type === "sl")
                              return <td key={i} rowSpan={cell.rowSpan} style={{ ...cellBase, color: "#475569", fontWeight: 700 }}>{cell.value}</td>;
                            if (cell.type === "sl-blank")
                              return <td key={i} rowSpan={cell.rowSpan} style={cellBase}></td>;
                            if (cell.type === "district")
                              return (
                                <td key={i} rowSpan={cell.rowSpan} style={{ ...cellBase, textAlign: "left", paddingLeft: "12px", fontWeight: 700, color: "#0f172a", borderRight: "2px solid #e2e8f0" }}>
                                  {cell.value}
                                </td>
                              );
                            if (cell.type === "megaCluster")
                              return (
                                <td key={i} rowSpan={cell.rowSpan} style={{ ...cellBase, textAlign: "left", paddingLeft: "12px", fontWeight: 650, color: "#334155", borderRight: "2px solid #e2e8f0" }}>
                                  {cell.value}
                                </td>
                              );
                            if (cell.type === "cluster")
                              return (
                                <td key={i} rowSpan={cell.rowSpan} style={{ ...cellBase, textAlign: "left", paddingLeft: "12px", fontWeight: 600, color: "#1e293b" }}>
                                  {cell.value}
                                </td>
                              );
                            return (
                              <td key={i} colSpan={cell.colSpan} rowSpan={cell.rowSpan} style={{ ...cellBase, textAlign: "left", paddingLeft: "12px", fontWeight: 800, color: "#0f172a" }}>
                                <div>{cell.value}</div>
                                <div style={{ fontSize: "9.5px", color: "#64748b", fontWeight: 600 }}>{cell.valueEn}</div>
                              </td>
                            );
                          })}
                          <td style={{ ...cellBase, fontWeight: 700, color: "#334155" }}>{row.periodLabel}</td>
                          {row.chawkiAnnualTargetCell && (
                            <td rowSpan={row.chawkiAnnualTargetCell.rowSpan} className="tsccwr-num" style={{ ...cellBase, fontWeight: 700, color: "#334155" }}>
                              {fmt3(row.chawkiAnnualTargetCell.value)}
                            </td>
                          )}
                          <td className="tsccwr-num" style={cellBase}>{fmt3(m.chawkiTarget)}</td>
                          <td className="tsccwr-num" style={cellBase}>{fmt3(m.chawkiAch)}</td>
                          <td className="tsccwr-num" style={{ ...cellBase, fontWeight: 700 }}>{fmtPct(m.chawkiPct)}</td>
                          <td className="tsccwr-num" style={cellBase}>{fmtInt(m.rearersCount)}</td>
                          <td className="tsccwr-num" style={cellBase}>{fmt3(m.failedEggs)}</td>
                          <td className="tsccwr-num" style={cellBase}>{fmt3(m.rearedEggs)}</td>
                          {row.cocoonAnnualTargetCell && (
                            <td rowSpan={row.cocoonAnnualTargetCell.rowSpan} className="tsccwr-num" style={{ ...cellBase, fontWeight: 700, color: "#334155" }}>
                              {fmt3(row.cocoonAnnualTargetCell.value)}
                            </td>
                          )}
                          <td className="tsccwr-num" style={cellBase}>{fmt3(m.cocoonTarget)}</td>
                          <td className="tsccwr-num" style={cellBase}>{fmt3(m.cocoonAch)}</td>
                          <td className="tsccwr-num" style={{ ...cellBase, fontWeight: 700 }}>{fmtPct(m.cocoonPct)}</td>
                          <td className="tsccwr-num" style={cellBase}>{fmtInt(m.avgYield)}</td>
                          <td className="tsccwr-num" style={cellBase}>{fmtInt(m.avgRate)}</td>
                          <td className="tsccwr-num" style={{ ...cellBase, borderRight: "none" }}>{fmtInt(m.poorCocoonPct)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div style={{
                background: "linear-gradient(135deg,#ecfdf5,#eef2ff)",
                padding: "12px 24px", display: "flex",
                alignItems: "center", justifyContent: "space-between",
                flexWrap: "wrap", gap: "8px", borderTop: "1.5px solid #c7d2fe",
              }}>
                <span style={{ fontSize: "12px", color: "#4338ca", fontWeight: 600 }}>
                  {t("Bivoltine Cluster Wise Report")} — {monthLabel?.label} {yearLabel}
                </span>
                <div className="d-flex gap-2 flex-wrap">
                  <button type="button" onClick={handlePdf} disabled={isDownloadingPdf} style={btn("linear-gradient(135deg,#b91c1c,#dc2626)", "0 2px 8px rgba(185,28,28,.25)", isDownloadingPdf)}>
                    📄 {t("Download PDF")}
                  </button>
                  <button type="button" onClick={handleExcel} disabled={isDownloadingExcel} style={btn("linear-gradient(135deg,#15803d,#16a34a)", "0 2px 8px rgba(21,128,61,.25)", isDownloadingExcel)}>
                    📊 {t("Download Excel")}
                  </button>
                </div>
              </div>
            </Card>
          </div>
        )}
      </Block>
    </Layout>
  );
}

export default TscClusterWiseReport;
