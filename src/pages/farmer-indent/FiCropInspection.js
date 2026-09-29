import { useMemo, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import DataTable from "../../components/AppDataTable";
import { Icon } from "../../components";
import { useFiStore, cropRecords, fmtDate, TSCS } from "./fiData";
import { FiPage, FiCard, StatCard, Pill, FarmerCell, SearchBox, EmptyState, tableStyles, exportCsv, CROP_STATUS_COLOR, useOpenExisting } from "./fiUi";
import { FarmerJourneyModal } from "./fiModals";
import { StageProgress, dayText } from "./FiAssignedDfls";

function FiCropInspection() {
  const { t } = useTranslation();
  const s = useFiStore();
  const recs = useMemo(() => cropRecords(s).filter((r) => !r.discarded), [s]);
  const [tab, setTab] = useState("pending");
  const [q, setQ] = useState("");
  const [tsc, setTsc] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const openExisting = useOpenExisting();
  const [journey, setJourney] = useState(null);

  const running = recs.filter((r) => !r.harvest && !r.failed && r.day >= 0);
  const pending = running.filter((r) => !r.lastInspection);
  const inspections = recs.flatMap((r) => r.inspections.map((i) => ({ ...i, r })));
  const failures = inspections.filter((i) => i.cropStatus === "Failed");

  const match = (r, date) => {
    const k = q.trim().toLowerCase();
    if (k && ![r.farmer.name, r.farmer.fruitsId, r.a.lotNumber].some((v) => v.toLowerCase().includes(k))) return false;
    if (tsc && r.farmer.tsc !== tsc) return false;
    if (date && from && date < from) return false;
    if (date && to && date > to) return false;
    return true;
  };

  const farmerCol = (get) => ({ name: t("Farmer"), grow: 2, minWidth: "220px", selector: (x) => get(x).farmer.name, sortable: true, cell: (x) => <button type="button" className="btn p-0 text-start border-0" onClick={() => setJourney(get(x).farmer.id)}><FarmerCell farmer={get(x).farmer} sub={`${get(x).farmer.village} · ${get(x).farmer.tsc}`} /></button> });
  const lotCol = (get) => ({ name: t("Lot · DFLs"), minWidth: "120px", cell: (x) => <div><b>{get(x).a.lotNumber}</b><div className="fi-farmer-sub">{get(x).a.dflsAssigned} DFLs</div></div> });

  const pendingCols = [
    farmerCol((r) => r), lotCol((r) => r),
    { name: t("Laid on · Released"), minWidth: "140px", cell: (r) => <div><div>{fmtDate(r.a.laidOnDate)}</div><div className="fi-farmer-sub">{fmtDate(r.a.releaseDate)}</div></div> },
    { name: t("Hatching"), minWidth: "150px", selector: (r) => r.a.hatchingDate, sortable: true, cell: (r) => <div><div>{fmtDate(r.a.hatchingDate)}</div><div className="small">{dayText(r.day, t)}</div></div> },
    { name: t("Stage"), minWidth: "160px", cell: (r) => <StageProgress r={r} /> },
    { name: t("Action"), minWidth: "170px", right: true, cell: (r) => <Button size="sm" className="fi-btn fi-btn-primary fi-btn-sm" onClick={() => openExisting("cropInspection", r.farmer)}><Icon name="clipboard" /> {t("Record Inspection")}</Button> },
  ];
  const doneCols = (isFailure) => [
    farmerCol((i) => i.r), lotCol((i) => i.r),
    { name: t("Inspected on"), minWidth: "120px", selector: (i) => i.date, sortable: true, cell: (i) => <div><div>{fmtDate(i.date)}</div>{i.week ? <div className="fi-farmer-sub">{t("Week")} {i.week}</div> : null}</div> },
    { name: t("Stage (Moult)"), minWidth: "120px", selector: (i) => i.moult, cell: (i) => i.moult },
    { name: t("Crop Status"), minWidth: "110px", selector: (i) => i.cropStatus, sortable: true, cell: (i) => <Pill color={CROP_STATUS_COLOR[i.cropStatus]}>{i.cropStatus}</Pill> },
    { name: t("Reason / Note"), grow: 2, minWidth: "220px", cell: (i) => <div>{i.reason && <div className={`fw-semibold ${isFailure ? "text-danger" : ""}`}>{i.reason}</div>}<div className="fi-farmer-sub">{i.note || (!i.reason ? "–" : "")}</div></div> },
    { name: t("Action"), width: "90px", right: true, cell: (i) => <Button size="sm" className="fi-btn fi-btn-soft fi-btn-sm" title={t("Edit")} onClick={() => openExisting("cropInspectionEdit", i.r.farmer)}><Icon name="edit" /></Button> },
  ];

  const views = {
    pending: { rows: pending.filter((r) => match(r)), cols: pendingCols, empty: t("All running crops are inspected 🎉") },
    completed: { rows: inspections.filter((i) => match(i.r, i.date)).sort((a, b) => (a.date < b.date ? 1 : -1)), cols: doneCols(false), empty: t("No inspections") },
    failure: { rows: failures.filter((i) => match(i.r, i.date)), cols: doneCols(true), empty: t("No crop failures recorded") },
  };
  const v = views[tab];
  const tabsDef = [["pending", t("Pending"), pending.length], ["completed", t("Completed"), inspections.length], ["failure", t("Crop Failure"), failures.length]];

  const doExport = () => (tab === "pending"
    ? exportCsv("pending-inspection.csv", [{ label: "Farmer", value: (r) => r.farmer.name }, { label: "FRUITS ID", value: (r) => r.farmer.fruitsId }, { label: "Lot", value: (r) => r.a.lotNumber }, { label: "Hatching", value: (r) => fmtDate(r.a.hatchingDate) }, { label: "Stage", value: (r) => r.stage.label }], v.rows)
    : exportCsv(`${tab}-inspections.csv`, [{ label: "Farmer", value: (i) => i.r.farmer.name }, { label: "FRUITS ID", value: (i) => i.r.farmer.fruitsId }, { label: "Lot", value: (i) => i.r.a.lotNumber }, { label: "Date", value: (i) => fmtDate(i.date) }, { label: "Moult", value: (i) => i.moult }, { label: "Week", value: (i) => i.week }, { label: "Crop Status", value: (i) => i.cropStatus }, { label: "Reason", value: (i) => i.reason }, { label: "Note", value: (i) => i.note }], v.rows));

  return (
    <FiPage
      title={t("Crop Inspection")}
      subtitle={t("Record opens Crop Inspection Add; correct opens Crop Inspection Edit (also captured in the mobile app)")}
      actions={<Button className="fi-btn fi-btn-white" style={{ color: "#c43257" }} onClick={() => openExisting("cropInspection")}><Icon name="alert-circle" /> {t("Record Crop Failure")}</Button>}
    >
      <div className="fi-stats">
        <StatCard icon="clock" label={t("Pending Inspection")} value={pending.length} color="#b45309" selected={tab === "pending"} onClick={() => setTab("pending")} />
        <StatCard icon="check-circle" label={t("Inspections Done")} value={inspections.length} color="#15803d" selected={tab === "completed"} onClick={() => setTab("completed")} />
        <StatCard icon="activity" label={t("Poor Crops")} value={inspections.filter((i) => i.cropStatus === "Poor").length} color="#b45309" />
        <StatCard icon="alert-circle" label={t("Crop Failures")} value={failures.length} sub={`${failures.reduce((n, i) => n + i.r.a.dflsAssigned, 0)} DFLs lost`} color="#c43257" selected={tab === "failure"} onClick={() => setTab("failure")} />
      </div>
      <FiCard
        title={<div className="fi-tabs">{tabsDef.map(([k, label, n]) => <button type="button" key={k} className={`fi-tab ${tab === k ? "active" : ""}`} onClick={() => setTab(k)}>{label} <span className="fi-tab-count">{n}</span></button>)}</div>}
        right={<Button size="sm" className="fi-btn fi-btn-soft" onClick={doExport}><Icon name="download" /> {t("Export")}</Button>}
      >
        <div className="fi-filters mb-3">
          <div style={{ gridColumn: "span 2" }}><div className="fi-label">{t("Search")}</div><SearchBox value={q} onChange={setQ} placeholder={t("Farmer, FRUITS ID, lot…")} /></div>
          <div><div className="fi-label">TSC</div><Form.Select value={tsc} onChange={(e) => setTsc(e.target.value)}><option value="">{t("All TSCs")}</option>{TSCS.map((x) => <option key={x}>{x}</option>)}</Form.Select></div>
          {tab !== "pending" && <>
            <div><div className="fi-label">{t("From Date")}</div><Form.Control type="date" value={from} onChange={(e) => setFrom(e.target.value)} /></div>
            <div><div className="fi-label">{t("To Date")}</div><Form.Control type="date" value={to} min={from} onChange={(e) => setTo(e.target.value)} /></div>
          </>}
        </div>
        <DataTable key={tab} columns={v.cols} data={v.rows} customStyles={tableStyles} pagination paginationPerPage={10} highlightOnHover responsive
          noDataComponent={<EmptyState icon="clipboard" text={v.empty} />} />
      </FiCard>

      <FarmerJourneyModal show={!!journey} onHide={() => setJourney(null)} farmerId={journey} />
    </FiPage>
  );
}

export default FiCropInspection;
