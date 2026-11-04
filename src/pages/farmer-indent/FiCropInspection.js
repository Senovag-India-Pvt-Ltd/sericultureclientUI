import { useMemo, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Icon } from "../../components";
import { useFiStore, cropRecords, fmtDate } from "./fiData";
import { FiPage, FiCard, StatCard, Pill, SearchBox, FiTable, farmerInfoColumns, farmerInfoExport, CROP_STATUS_COLOR, FI_BASE, useOpenExisting } from "./fiUi";
import { FarmerJourneyModal } from "./fiModals";
import { StageProgress, dayText } from "./FiAssignedDfls";

function FiCropInspection() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const s = useFiStore();
  const recs = useMemo(() => cropRecords(s).filter((r) => !r.discarded), [s]);
  const [tab, setTab] = useState("pending");
  const [q, setQ] = useState("");
  const [tsc, setTsc] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const openExisting = useOpenExisting();
  const [journey, setJourney] = useState(null);

  const running = recs.filter((r) => !r.harvest && !r.failed && !r.closed && r.day >= 0);
  const pending = running.filter((r) => !r.lastInspection);
  const inspections = recs.flatMap((r) => r.inspections.map((i) => ({ ...i, r })));
  const failures = inspections.filter((i) => i.failed);
  const tscs = [...new Set(recs.map((r) => r.farmer.tsc).filter(Boolean))].sort();

  // pending crops filter on hatching date, completed inspections on inspection date
  const match = (r, date) => {
    const k = q.trim().toLowerCase();
    if (k && ![r.farmer.name, r.farmer.fruitsId, r.farmer.farmerNumber, r.a.lotNumber].some((v) => (v || "").toLowerCase().includes(k))) return false;
    if (tsc && r.farmer.tsc !== tsc) return false;
    if (from && date < from) return false;
    if (to && date > to) return false;
    return true;
  };

  const cropCols = (get) => [
    ...farmerInfoColumns(t, (x) => get(x).farmer, setJourney),
    { name: t("Lot Number"), minWidth: "110px", cell: (x) => <b>{get(x).a.lotNumber}</b> },
    { name: t("No of DFLs Assigned"), minWidth: "120px", cell: (x) => get(x).a.dflsAssigned },
    { name: t("Laid on Date / R/ON"), minWidth: "135px", cell: (x) => fmtDate(get(x).a.laidOnDate) },
    { name: t("Dispatch Date"), minWidth: "120px", cell: (x) => fmtDate(get(x).a.releaseDate) },
    { name: t("Hatching Date"), minWidth: "140px", selector: (x) => get(x).a.hatchingDate, sortable: true, cell: (x) => <div><div>{fmtDate(get(x).a.hatchingDate)}</div><div className="small">{dayText(get(x).day, t)}</div></div> },
  ];
  const cropExport = (get) => [
    ...farmerInfoExport((x) => get(x).farmer),
    { label: "Lot Number", value: (x) => get(x).a.lotNumber }, { label: "No of DFLs Assigned", value: (x) => get(x).a.dflsAssigned },
    { label: "Laid on Date / R/ON", value: (x) => fmtDate(get(x).a.laidOnDate) }, { label: "Dispatch Date", value: (x) => fmtDate(get(x).a.releaseDate) },
    { label: "Hatching Date", value: (x) => fmtDate(get(x).a.hatchingDate) },
  ];

  const pendingCols = [
    ...cropCols((r) => r),
    { name: t("Stage"), minWidth: "160px", cell: (r) => <StageProgress r={r} /> },
    { name: t("Action"), minWidth: "180px", right: true, cell: (r) => <Button size="sm" className="fi-btn fi-btn-primary fi-btn-sm" onClick={() => openExisting("cropInspection", r.farmer)}><Icon name="clipboard" /> {t("Record Inspection")}</Button> },
  ];
  const doneCols = [
    ...cropCols((i) => i.r),
    { name: t("Inspected on"), minWidth: "120px", selector: (i) => i.date, sortable: true, cell: (i) => <div><div>{fmtDate(i.date)}</div>{i.week ? <div className="fi-farmer-sub">{i.week}</div> : null}</div> },
    { name: t("Stage (Moult)"), minWidth: "120px", selector: (i) => i.moult, cell: (i) => i.moult || "–" },
    { name: t("Crop Status"), minWidth: "120px", selector: (i) => i.cropStatus, sortable: true, cell: (i) => <Pill color={CROP_STATUS_COLOR[i.cropStatus] || (i.failed ? "red" : "grey")}>{i.cropStatus || "–"}</Pill> },
    { name: t("Reason / Note"), grow: 2, minWidth: "200px", cell: (i) => <div>{i.reason && <div className="fw-semibold">{i.reason}</div>}<div className="fi-farmer-sub">{i.note || (!i.reason ? "–" : "")}</div></div> },
    { name: t("Action"), width: "90px", right: true, cell: (i) => <Button size="sm" className="fi-btn fi-btn-soft fi-btn-sm" title={t("Edit")} aria-label={t("Edit")} onClick={() => openExisting("cropInspectionEdit", i.r.farmer)}><Icon name="edit" /></Button> },
  ];

  const views = {
    pending: {
      rows: pending.filter((r) => match(r, r.a.hatchingDate)), cols: pendingCols, empty: t("All running crops are inspected"),
      exportCols: [...cropExport((r) => r), { label: "Stage", value: (r) => r.stage.label }],
    },
    completed: {
      rows: inspections.filter((i) => match(i.r, i.date)).sort((a, b) => (a.date < b.date ? 1 : -1)), cols: doneCols, empty: t("No inspections"),
      exportCols: [...cropExport((i) => i.r), { label: "Inspected on", value: (i) => fmtDate(i.date) }, { label: "Week", value: (i) => i.week },
        { label: "Stage (Moult)", value: (i) => i.moult }, { label: "Crop Status", value: (i) => i.cropStatus }, { label: "Reason", value: (i) => i.reason }, { label: "Note", value: (i) => i.note }],
    },
  };
  const v = views[tab];
  const tabsDef = [["pending", t("Pending"), pending.length], ["completed", t("Completed"), inspections.length]];

  return (
    <FiPage
      title={t("Crop Inspection")}
      subtitle={t("Record opens Crop Inspection Add; correct opens Crop Inspection Edit (also captured in the mobile app)")}
      actions={<Button className="fi-btn fi-btn-white" onClick={() => openExisting("cropInspection")}><Icon name="plus" /> {t("Record Inspection")}</Button>}
    >
      <div className="fi-stats">
        <StatCard icon="clock" label={t("Pending Inspection")} value={pending.length} color="#b45309" selected={tab === "pending"} onClick={() => setTab("pending")} />
        <StatCard icon="check-circle" label={t("Inspections Done")} value={inspections.length} color="#15803d" selected={tab === "completed"} onClick={() => setTab("completed")} />
        <StatCard icon="activity" label={t("Crops Inspected")} value={new Set(inspections.map((i) => i.r.a.id)).size} sub={`${t("of")} ${recs.length}`} color="#6d28d9" />
        <StatCard icon="alert-circle" label={t("Crop Failures")} value={failures.length} sub={t("open Crop Failure")} color="#c43257" onClick={() => navigate(`${FI_BASE}/crop-failure`)} />
      </div>
      <FiCard title={<div className="fi-tabs">{tabsDef.map(([k, label, n]) => <button type="button" key={k} className={`fi-tab ${tab === k ? "active" : ""}`} onClick={() => setTab(k)}>{label} <span className="fi-tab-count">{n}</span></button>)}</div>}>
        <div className="fi-filters mb-3">
          <div style={{ gridColumn: "span 2" }}><div className="fi-label">{t("Search")}</div><SearchBox value={q} onChange={setQ} placeholder={t("Farmer, FRUITS ID, lot…")} /></div>
          <div><div className="fi-label">TSC</div><Form.Select value={tsc} onChange={(e) => setTsc(e.target.value)}><option value="">{t("All TSCs")}</option>{tscs.map((x) => <option key={x}>{x}</option>)}</Form.Select></div>
          <div><div className="fi-label">{tab === "pending" ? t("Hatching from") : t("From Date")}</div><Form.Control type="date" value={from} onChange={(e) => setFrom(e.target.value)} /></div>
          <div><div className="fi-label">{tab === "pending" ? t("Hatching to") : t("To Date")}</div><Form.Control type="date" value={to} min={from} onChange={(e) => setTo(e.target.value)} /></div>
        </div>
        <FiTable key={tab} columns={v.cols} data={v.rows} exportCols={v.exportCols} fileName={`crop-inspection-${tab}`} title={`${t("Crop Inspection")} – ${tabsDef.find((x) => x[0] === tab)[1]}`}
          empty={v.empty} emptyIcon="clipboard" />
      </FiCard>

      <FarmerJourneyModal show={!!journey} onHide={() => setJourney(null)} farmerId={journey} />
    </FiPage>
  );
}

export default FiCropInspection;
