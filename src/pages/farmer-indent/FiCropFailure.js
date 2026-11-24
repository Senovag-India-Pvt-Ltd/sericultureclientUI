import { useMemo, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { Icon } from "../../components";
import { useFiStore, cropRecords, fmtDate, unitName } from "./fiData";
import { FiPage, FiCard, StatCard, SearchBox, FiTable, farmerInfoColumns, farmerInfoExport, useOpenExisting } from "./fiUi";
import { FarmerJourneyModal } from "./fiModals";

// Crop failures are Crop Inspections whose crop status is "Diseased"; recording
// one opens Crop Inspection Add (the same entry the field staff use).
function FiCropFailure() {
  const { t } = useTranslation();
  const s = useFiStore();
  const recs = useMemo(() => cropRecords(s).filter((r) => !r.discarded), [s]);
  const [q, setQ] = useState("");
  const [tsc, setTsc] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const openExisting = useOpenExisting();
  const [journey, setJourney] = useState(null);

  const failures = useMemo(() => recs.flatMap((r) => r.inspections.filter((i) => i.failed).map((i) => ({ ...i, r }))), [recs]);
  const tscs = [...new Set(failures.map((i) => i.r.farmer.tsc).filter(Boolean))].sort();
  const rows = failures.filter((i) => {
    const k = q.trim().toLowerCase();
    if (k && ![i.r.farmer.name, i.r.farmer.fruitsId, i.r.farmer.farmerNumber, i.r.a.lotNumber, i.reason].some((v) => (v || "").toLowerCase().includes(k))) return false;
    if (tsc && i.r.farmer.tsc !== tsc) return false;
    if (from && i.date < from) return false;
    if (to && i.date > to) return false;
    return true;
  }).sort((a, b) => (a.date < b.date ? 1 : -1));

  const crops = new Set(failures.map((i) => i.r.a.id));
  const dflsLost = recs.filter((r) => crops.has(r.a.id)).reduce((n, r) => n + r.a.dflsAssigned, 0);
  const byReason = failures.reduce((m, i) => m.set(i.reason || t("Not given"), (m.get(i.reason || t("Not given")) || 0) + 1), new Map());
  const topReason = [...byReason.entries()].sort((a, b) => b[1] - a[1])[0];

  const columns = [
    ...farmerInfoColumns(t, (i) => i.r.farmer, setJourney),
    { name: t("CRC / Direct"), minWidth: "200px", cell: (i) => (i.r.indent.direct ? "–" : unitName(i.r.indent)) },
    { name: t("Lot No"), minWidth: "100px", cell: (i) => <div><b>{i.r.a.lotNumber}</b><div className="fi-farmer-sub">{i.r.a.dflsAssigned} DFLs</div></div> },
    { name: t("Date"), minWidth: "110px", selector: (i) => i.date, sortable: true, cell: (i) => fmtDate(i.date) },
    { name: t("Stage"), minWidth: "110px", selector: (i) => i.moult, sortable: true, cell: (i) => i.moult || "–" },
    { name: t("Week"), minWidth: "100px", cell: (i) => i.week || "–" },
    { name: t("Reason"), grow: 2, minWidth: "230px", selector: (i) => i.reason, sortable: true, cell: (i) => <div><div className="fw-semibold text-danger">{i.reason || "–"}</div>{i.note && <div className="fi-farmer-sub">{i.note}</div>}</div> },
    { name: t("Action"), width: "90px", right: true, cell: (i) => <Button size="sm" className="fi-btn fi-btn-soft fi-btn-sm" title={t("Edit")} aria-label={t("Edit")} onClick={() => openExisting("cropInspectionEdit", i.r.farmer)}><Icon name="edit" /></Button> },
  ];
  const exportCols = [
    ...farmerInfoExport((i) => i.r.farmer),
    { label: "CRC / Direct", value: (i) => (i.r.indent.direct ? "" : unitName(i.r.indent)) },
    { label: "Lot No", value: (i) => i.r.a.lotNumber }, { label: "No of DFLs", value: (i) => i.r.a.dflsAssigned },
    { label: "Date", value: (i) => fmtDate(i.date) }, { label: "Stage", value: (i) => i.moult }, { label: "Week", value: (i) => i.week },
    { label: "Reason", value: (i) => i.reason }, { label: "Note", value: (i) => i.note },
  ];

  return (
    <FiPage
      title={t("Crop Failure")}
      subtitle={t("Crops reported as diseased in Crop Inspection – add opens Crop Inspection Add")}
      actions={<Button className="fi-btn fi-btn-white" style={{ color: "#c43257" }} onClick={() => openExisting("cropInspection")}><Icon name="plus" /> {t("Add Crop Failure")}</Button>}
    >
      <div className="fi-stats">
        <StatCard icon="alert-circle" label={t("Crop Failures")} value={failures.length} sub={`${crops.size} ${t("crops")}`} color="#c43257" />
        <StatCard icon="package" label={t("DFLs Lost")} value={dflsLost.toLocaleString("en-IN")} color="#b45309" />
        <StatCard icon="info" label={t("Most Common Reason")} value={topReason ? topReason[1] : 0} sub={topReason ? topReason[0] : t("None")} color="#6d28d9" />
      </div>
      <FiCard title={<span><Icon name="alert-circle" className="me-1" /> {t("Crop Failure")} <span className="text-muted fw-normal">({rows.length})</span></span>}>
        <div className="fi-filters mb-3">
          <div style={{ gridColumn: "span 2" }}><div className="fi-label">{t("Search")}</div><SearchBox value={q} onChange={setQ} placeholder={t("Farmer, FRUITS ID, lot, reason…")} /></div>
          <div><div className="fi-label">TSC</div><Form.Select value={tsc} onChange={(e) => setTsc(e.target.value)}><option value="">{t("All TSCs")}</option>{tscs.map((x) => <option key={x}>{x}</option>)}</Form.Select></div>
          <div><div className="fi-label">{t("From Date")}</div><Form.Control type="date" value={from} onChange={(e) => setFrom(e.target.value)} /></div>
          <div><div className="fi-label">{t("To Date")}</div><Form.Control type="date" value={to} min={from} onChange={(e) => setTo(e.target.value)} /></div>
        </div>
        <FiTable columns={columns} data={rows} exportCols={exportCols} fileName="crop-failure" title={t("Crop Failure")}
          empty={t("No crop failures recorded")} emptyIcon="alert-circle" />
      </FiCard>
      <FarmerJourneyModal show={!!journey} onHide={() => setJourney(null)} farmerId={journey} />
    </FiPage>
  );
}

export default FiCropFailure;
