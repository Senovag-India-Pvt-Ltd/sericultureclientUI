import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Form } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { Icon } from "../../components";
import { useFiStore, fiActions, cropRecords, unitName, fmtDate, dflsStatus, STAGES, REASONS, CROP_CLOSE_DAYS } from "./fiData";
import { FiPage, FiCard, StatCard, Pill, StagePill, SearchBox, FiTable, farmerInfoColumns, farmerInfoExport, askReason, useOpenExisting } from "./fiUi";
import { FarmerJourneyModal } from "./fiModals";

// Reference shows signed days ("-5 Days" = 5 days before hatching)
export function DaysBadge({ day, t }) {
  const color = day < 0 ? "#0369a1" : day === 0 ? "#b45309" : "#1f2d3d";
  return <span className="fi-days" style={{ color }} title={t("Days from hatching")}>{day} {t("Days")}</span>;
}

export function dayText(day, t) {
  if (day < 0) return <span className="text-info fw-semibold">{t("Hatches in")} {-day} {t("days")}</span>;
  if (day === 0) return <span className="text-warning fw-bold">{t("Hatching today")}</span>;
  return <span className="fw-semibold">{t("Day")} {day}</span>;
}

export function StageProgress({ r }) {
  const idx = STAGES.findIndex((x) => x.key === r.stage.key);
  const pct = Math.round(((idx + 1) / STAGES.length) * 100);
  return (
    <div style={{ minWidth: 130 }}>
      <StagePill stage={r.stage} />
      <div className="fi-progress mt-1"><span style={{ width: `${pct}%`, background: r.stage.color }} /></div>
    </div>
  );
}

export function HarvestBadge({ r, t }) {
  if (r.discarded) return <Pill color="grey">{t("Discarded")}</Pill>;
  if (r.harvest) return <Pill color="green">{t("Harvested")}</Pill>;
  if (r.failed) return <Pill color="red">{t("Crop Failed")}</Pill>;
  if (r.closed) return <Pill color="grey">{t("Closed")}</Pill>;
  return <Pill color="red">{t("Not Harvested")}</Pill>;
}

function FiAssignedDfls() {
  const { t } = useTranslation();
  const s = useFiStore();
  const recs = useMemo(() => cropRecords(s), [s]);
  const [tab, setTab] = useState("running");
  const [q, setQ] = useState("");
  const [tsc, setTsc] = useState("");
  const openExisting = useOpenExisting();
  const navigate = useNavigate();
  const [journey, setJourney] = useState(null);

  // discarded DFLs are listed on the Cancelled page
  const groups = {
    running: recs.filter((r) => !r.discarded && !r.harvest && !r.failed && !r.closed),
    harvested: recs.filter((r) => !r.discarded && r.harvest),
    failed: recs.filter((r) => !r.discarded && r.failed && !r.harvest),
    closed: recs.filter((r) => !r.discarded && r.closed),
  };
  const rows = groups[tab].filter((r) => {
    const k = q.trim().toLowerCase();
    if (k && ![r.farmer.name, r.farmer.fruitsId, r.farmer.farmerNumber, r.a.lotNumber, r.indent.indentNo, r.farmer.mobile].some((v) => (v || "").toLowerCase().includes(k))) return false;
    if (tsc && r.farmer.tsc !== tsc) return false;
    return true;
  }).sort((a, b) => (a.a.hatchingDate < b.a.hatchingDate ? 1 : -1));
  const tscs = [...new Set(groups[tab].map((r) => r.farmer.tsc).filter(Boolean))].sort();
  const totalDfls = (list) => list.reduce((n, r) => n + r.a.dflsAssigned, 0).toLocaleString("en-IN");

  const discard = async (r) => {
    const res = await askReason(`${t("Discard DFLs of lot")} ${r.a.lotNumber}?`, REASONS, t("Discard"));
    if (res) fiActions.discardAssignment(r.a.id, res.reason, res.remarks);
  };

  const columns = [
    { name: t("No of Days"), minWidth: "105px", selector: (r) => r.day, sortable: true, cell: (r) => <DaysBadge day={r.day} t={t} /> },
    { name: t("Harvest"), minWidth: "140px", cell: (r) => <HarvestBadge r={r} t={t} /> },
    { name: t("Indent ID"), minWidth: "150px", selector: (r) => r.indent.indentNo, sortable: true, cell: (r) => <b style={{ whiteSpace: "nowrap" }}>{r.indent.indentNo}</b> },
    ...farmerInfoColumns(t, (r) => r.farmer, setJourney),
    { name: t("CRC / Direct"), minWidth: "200px", cell: (r) => (r.indent.direct ? "–" : unitName(r.indent)) },
    { name: t("No of DFLs Assigned"), minWidth: "120px", selector: (r) => r.a.dflsAssigned, sortable: true, cell: (r) => <div><b>{r.a.dflsAssigned}</b>{!r.indent.direct && <div className="fi-farmer-sub">{t("of")} {r.indent.dflsOrdered} {t("ordered")}</div>}</div> },
    { name: t("No of Sheets"), minWidth: "100px", cell: (r) => r.a.sheetsAssigned ?? (r.a.eggSheetNumbers || "–") },
    { name: t("Indent Date"), minWidth: "115px", cell: (r) => fmtDate(r.indent.indentDate) },
    { name: t("DFLs Assign Date"), minWidth: "125px", selector: (r) => r.a.assignDate, sortable: true, cell: (r) => fmtDate(r.a.assignDate) },
    { name: t("Lot No"), minWidth: "110px", selector: (r) => r.a.lotNumber, sortable: true, cell: (r) => <div><b>{r.a.lotNumber}</b>{r.a.race && <div className="fi-farmer-sub">{r.a.race}</div>}</div> },
    { name: t("Laid on Date / R/ON"), minWidth: "140px", cell: (r) => fmtDate(r.a.laidOnDate) },
    { name: t("Hatching Date"), minWidth: "130px", selector: (r) => r.a.hatchingDate, sortable: true, cell: (r) => <div><div>{fmtDate(r.a.hatchingDate)}</div><div className="small">{dayText(r.day, t)}</div></div> },
    { name: t("Dispatch Date"), minWidth: "120px", cell: (r) => fmtDate(r.a.releaseDate) },
    { name: t("DFLs Status"), minWidth: "190px", cell: (r) => (r.harvest || r.failed || r.closed ? <Pill color={r.harvest ? "green" : r.failed ? "red" : "grey"}>{t(dflsStatus(r))}</Pill> : <div><div className="fw-semibold small">{t(dflsStatus(r))}</div><StageProgress r={r} /></div>) },
    {
      name: t("Action"), minWidth: "120px", right: true,
      cell: (r) => (
        <div className="d-flex gap-2">
          <Button size="sm" className="fi-btn fi-btn-soft fi-btn-sm" title={t("Edit in Sale/Disposal of DFLs")} aria-label={t("Edit")} onClick={() => navigate(`/seriui/Sale-Disposal-of-DFLs-eggs-edit/${r.a.id}`)}><Icon name="edit" /></Button>
          {!r.harvest && <Button size="sm" className="fi-btn fi-btn-danger-soft fi-btn-sm" title={t("Discard")} aria-label={t("Discard")} onClick={() => discard(r)}><Icon name="trash" /></Button>}
        </div>
      ),
    },
  ];

  const exportCols = [
    { label: "No of Days", value: (r) => r.day }, { label: "Harvest", value: (r) => dflsStatus(r) === "Harvested" ? "Harvested" : "Not Harvested" },
    { label: "Indent ID", value: (r) => r.indent.indentNo }, ...farmerInfoExport((r) => r.farmer),
    { label: "CRC / Direct", value: (r) => (r.indent.direct ? "" : unitName(r.indent)) },
    { label: "No of DFLs Assigned", value: (r) => r.a.dflsAssigned }, { label: "No of Sheets", value: (r) => r.a.sheetsAssigned ?? r.a.eggSheetNumbers },
    { label: "Indent Date", value: (r) => fmtDate(r.indent.indentDate) }, { label: "DFLs Assign Date", value: (r) => fmtDate(r.a.assignDate) },
    { label: "Lot No", value: (r) => r.a.lotNumber }, { label: "Race", value: (r) => r.a.race },
    { label: "Laid on Date / R/ON", value: (r) => fmtDate(r.a.laidOnDate) }, { label: "Hatching Date", value: (r) => fmtDate(r.a.hatchingDate) },
    { label: "Dispatch Date", value: (r) => fmtDate(r.a.releaseDate) }, { label: "DFLs Status", value: (r) => dflsStatus(r) },
  ];

  const TABS = [
    ["running", t("Not Harvested"), "layers", "#c43257"],
    ["harvested", t("Harvested"), "coins", "#15803d"],
    ["failed", t("Crop Failed"), "alert-circle", "#b45309"],
    ["closed", t("Closed"), "check", "#94a3b8"],
  ];

  return (
    <FiPage title={t("Assigned DFLs")} subtitle={t("DFLs given to farmers (Sale/Disposal of DFLs) – follow each crop until harvest")}
      actions={<Button className="fi-btn fi-btn-white" onClick={() => openExisting("assignedDflsList")}><Icon name="list" /> {t("Sale/Disposal of DFLs List")}</Button>}>
      <div className="fi-stats">
        {TABS.map(([k, label, icon, color]) => (
          <StatCard key={k} icon={icon} color={color} label={label} value={groups[k].length} sub={`${totalDfls(groups[k])} DFLs`} selected={tab === k} onClick={() => setTab(k)} />
        ))}
      </div>
      <FiCard
        title={<div className="fi-tabs">{TABS.map(([k, label]) => <button type="button" key={k} className={`fi-tab ${tab === k ? "active" : ""}`} onClick={() => setTab(k)}>{label} <span className="fi-tab-count">{groups[k].length}</span></button>)}</div>}
      >
        <div className="fi-filters mb-3">
          <div style={{ gridColumn: "span 2" }}><div className="fi-label">{t("Search")}</div><SearchBox value={q} onChange={setQ} placeholder={t("Farmer, FRUITS ID, lot, indent ID…")} /></div>
          <div><div className="fi-label">TSC</div><Form.Select value={tsc} onChange={(e) => setTsc(e.target.value)}><option value="">{t("All TSCs")}</option>{tscs.map((x) => <option key={x}>{x}</option>)}</Form.Select></div>
        </div>
        {tab === "closed" && <div className="text-muted small mb-2"><Icon name="info" /> {t("No harvest, failure or seed market record")} {CROP_CLOSE_DAYS} {t("days after hatching.")}</div>}
        <FiTable key={tab} columns={columns} data={rows} exportCols={exportCols} fileName={`assigned-dfls-${tab}`} title={`${t("Assigned DFLs")} – ${TABS.find((x) => x[0] === tab)[1]}`}
          empty={t("Nothing here")} emptyIcon="package" />
      </FiCard>
      <FarmerJourneyModal show={!!journey} onHide={() => setJourney(null)} farmerId={journey} />
    </FiPage>
  );
}

export default FiAssignedDfls;
