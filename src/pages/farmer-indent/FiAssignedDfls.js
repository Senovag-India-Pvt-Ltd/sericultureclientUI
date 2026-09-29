import { useMemo, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import DataTable from "../../components/AppDataTable";
import { Icon } from "../../components";
import { useFiStore, fiActions, cropRecords, unitById, fmtDate, STAGES, REASONS, TSCS } from "./fiData";
import { FiPage, FiCard, StatCard, Pill, StagePill, FarmerCell, SearchBox, EmptyState, tableStyles, exportCsv, fiToast, askReason, useOpenExisting } from "./fiUi";
import { FarmerJourneyModal } from "./fiModals";

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
  return <Pill color="amber">{t("Not Harvested")}</Pill>;
}

function FiAssignedDfls() {
  const { t } = useTranslation();
  const s = useFiStore();
  const recs = useMemo(() => cropRecords(s), [s]);
  const [tab, setTab] = useState("running");
  const [q, setQ] = useState("");
  const [tsc, setTsc] = useState("");
  const openExisting = useOpenExisting();
  const [journey, setJourney] = useState(null);

  const groups = {
    running: recs.filter((r) => !r.discarded && !r.harvest && !r.failed),
    harvested: recs.filter((r) => !r.discarded && r.harvest),
    failed: recs.filter((r) => !r.discarded && r.failed && !r.harvest),
    discarded: recs.filter((r) => r.discarded),
  };
  const rows = groups[tab].filter((r) => {
    const k = q.trim().toLowerCase();
    if (k && ![r.farmer.name, r.farmer.fruitsId, r.a.lotNumber, r.indent.indentNo, r.farmer.mobile].some((v) => v.toLowerCase().includes(k))) return false;
    if (tsc && r.farmer.tsc !== tsc) return false;
    return true;
  }).sort((a, b) => (a.a.hatchingDate < b.a.hatchingDate ? 1 : -1));
  const totalDfls = (list) => list.reduce((n, r) => n + r.a.dflsAssigned, 0).toLocaleString("en-IN");

  const discard = async (r) => {
    const res = await askReason(`${t("Discard DFLs of lot")} ${r.a.lotNumber}?`, REASONS, t("Discard"));
    if (res) { fiActions.discardAssignment(r.a.id, res.reason, res.remarks); fiToast(t("DFLs moved to Discarded")); }
  };

  const columns = [
    { name: t("Farmer"), grow: 2, minWidth: "230px", selector: (r) => r.farmer.name, sortable: true, cell: (r) => <button type="button" className="btn p-0 text-start border-0" onClick={() => setJourney(r.farmer.id)}><FarmerCell farmer={r.farmer} sub={`${r.indent.indentNo} · ${r.farmer.tsc}`} /></button> },
    { name: t("Lot · Race"), minWidth: "140px", selector: (r) => r.a.lotNumber, sortable: true, cell: (r) => <div><div className="fw-bold">{r.a.lotNumber}</div><div className="fi-farmer-sub">{r.a.race}</div></div> },
    { name: t("DFLs"), width: "110px", selector: (r) => r.a.dflsAssigned, sortable: true, cell: (r) => <div><b>{r.a.dflsAssigned}</b><div className="fi-farmer-sub">{t("of")} {r.indent.dflsOrdered} · {r.a.sheetsAssigned} sh</div></div> },
    { name: t("Laid on · Released"), minWidth: "140px", cell: (r) => <div><div>{fmtDate(r.a.laidOnDate)}</div><div className="fi-farmer-sub">{fmtDate(r.a.releaseDate)}</div></div> },
    { name: t("Hatching"), minWidth: "150px", selector: (r) => r.a.hatchingDate, sortable: true, cell: (r) => <div><div>{fmtDate(r.a.hatchingDate)}</div><div className="small">{dayText(r.day, t)}</div></div> },
    { name: t("Stage"), minWidth: "150px", cell: (r) => (r.harvest || r.failed || r.discarded ? "–" : <StageProgress r={r} />) },
    { name: t("Status"), minWidth: "130px", cell: (r) => <div><HarvestBadge r={r} t={t} />{r.discarded && <div className="fi-farmer-sub mt-1">{r.a.discarded.reason}</div>}</div> },
    {
      name: t("Action"), minWidth: "130px", right: true,
      cell: (r) => r.discarded ? null : (
        <div className="d-flex gap-2">
          <Button size="sm" className="fi-btn fi-btn-soft fi-btn-sm" title={t("Edit")} onClick={() => openExisting("assignedDflsList", r.farmer)}><Icon name="edit" /></Button>
          {!r.harvest && <Button size="sm" className="fi-btn fi-btn-danger-soft fi-btn-sm" title={t("Discard")} onClick={() => discard(r)}><Icon name="trash" /></Button>}
        </div>
      ),
    },
  ];

  const doExport = () => exportCsv("assigned-dfls.csv", [
    { label: "Indent No", value: (r) => r.indent.indentNo }, { label: "Farmer", value: (r) => r.farmer.name }, { label: "FRUITS ID", value: (r) => r.farmer.fruitsId },
    { label: "TSC", value: (r) => r.farmer.tsc }, { label: "CRC / Direct", value: (r) => unitById(r.indent.unitId)?.name },
    { label: "Lot", value: (r) => r.a.lotNumber }, { label: "Race", value: (r) => r.a.race }, { label: "DFLs", value: (r) => r.a.dflsAssigned },
    { label: "Laid on", value: (r) => fmtDate(r.a.laidOnDate) }, { label: "Released", value: (r) => fmtDate(r.a.releaseDate) }, { label: "Hatching", value: (r) => fmtDate(r.a.hatchingDate) },
    { label: "Days", value: (r) => r.day }, { label: "Stage", value: (r) => r.stage.label },
    { label: "Status", value: (r) => (r.discarded ? "Discarded" : r.harvest ? "Harvested" : r.failed ? "Crop Failed" : "Not Harvested") },
  ], rows);

  const TABS = [
    ["running", t("Not Harvested"), "layers", "#b45309"],
    ["harvested", t("Harvested"), "coins", "#15803d"],
    ["failed", t("Crop Failed"), "alert-circle", "#c43257"],
    ["discarded", t("Discarded"), "trash", "#6b7a8c"],
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
        right={<Button size="sm" className="fi-btn fi-btn-soft" onClick={doExport}><Icon name="download" /> {t("Export")}</Button>}
      >
        <div className="fi-filters mb-3">
          <div style={{ gridColumn: "span 2" }}><div className="fi-label">{t("Search")}</div><SearchBox value={q} onChange={setQ} placeholder={t("Farmer, FRUITS ID, lot, indent no…")} /></div>
          <div><div className="fi-label">TSC</div><Form.Select value={tsc} onChange={(e) => setTsc(e.target.value)}><option value="">{t("All TSCs")}</option>{TSCS.map((x) => <option key={x}>{x}</option>)}</Form.Select></div>
        </div>
        <DataTable key={tab} columns={columns} data={rows} customStyles={tableStyles} pagination paginationPerPage={10} highlightOnHover responsive
          noDataComponent={<EmptyState icon="package" text={t("Nothing here")} />} />
      </FiCard>
      <FarmerJourneyModal show={!!journey} onHide={() => setJourney(null)} farmerId={journey} />
    </FiPage>
  );
}

export default FiAssignedDfls;
