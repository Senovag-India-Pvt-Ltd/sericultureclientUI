import { useMemo, useState } from "react";
import { Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { Icon } from "../../components";
import { useFiStore, fiActions, cropRecords, farmerById, unitName, fmtDate, unknownFarmer } from "./fiData";
import { FiPage, FiCard, StatCard, SearchBox, FiTable, farmerInfoColumns, farmerInfoExport, fiSwal } from "./fiUi";
import { FarmerJourneyModal } from "./fiModals";

// Cancelled indents and discarded DFL issues in one place, with Restore.
function FiCancelled() {
  const { t } = useTranslation();
  const s = useFiStore();
  const [tab, setTab] = useState("indent");
  const [q, setQ] = useState("");
  const [journey, setJourney] = useState(null);

  const indents = useMemo(() => s.indents.filter((i) => i.cancelled).map((i) => ({ ...i, farmer: farmerById(s, i.farmerId) || unknownFarmer(i.fruitsId) })), [s]);
  const discarded = useMemo(() => cropRecords(s).filter((r) => r.discarded), [s]);
  const k = q.trim().toLowerCase();
  const hit = (f, extra) => !k || [f.name, f.fruitsId, f.farmerNumber, f.mobile, ...extra].some((v) => (v || "").toLowerCase().includes(k));

  const confirmRestore = async (text, fn) => {
    const r = await fiSwal.fire({ icon: "question", title: t("Restore?"), text, showCancelButton: true, confirmButtonText: t("Yes, restore") });
    if (r.isConfirmed) fn();
  };

  const restoreBtn = (onClick) => <Button size="sm" className="fi-btn fi-btn-soft fi-btn-sm" onClick={onClick}><Icon name="reload" /> {t("Restore")}</Button>;
  const reasonCell = (c) => <div><div className="fw-semibold text-danger">{c?.reason || "–"}</div>{c?.remarks && <div className="fi-farmer-sub">{c.remarks}</div>}</div>;

  const indentCols = [
    { name: t("Reason"), grow: 2, minWidth: "220px", selector: (i) => i.cancelled.reason, sortable: true, cell: (i) => reasonCell(i.cancelled) },
    { name: t("Cancelled on"), minWidth: "120px", selector: (i) => i.cancelled.date, sortable: true, cell: (i) => fmtDate(i.cancelled.date) },
    { name: t("Indent ID"), minWidth: "130px", selector: (i) => i.indentNo, sortable: true, cell: (i) => <b>{i.indentNo}</b> },
    ...farmerInfoColumns(t, (i) => i.farmer, setJourney),
    { name: t("No of DFLs Ordered"), minWidth: "120px", selector: (i) => i.dflsOrdered, sortable: true, cell: (i) => i.dflsOrdered },
    { name: t("CRC / Direct"), minWidth: "200px", cell: (i) => unitName(i) },
    { name: t("Indent Date"), minWidth: "115px", cell: (i) => fmtDate(i.indentDate) },
    { name: t("Action"), minWidth: "120px", right: true, cell: (i) => restoreBtn(() => confirmRestore(`${t("Indent")} ${i.indentNo}`, () => fiActions.restoreIndent(i.id))) },
  ];
  const dflCols = [
    { name: t("Reason"), grow: 2, minWidth: "220px", selector: (r) => r.a.discarded.reason, sortable: true, cell: (r) => reasonCell(r.a.discarded) },
    { name: t("Discarded on"), minWidth: "120px", selector: (r) => r.a.discarded.date, sortable: true, cell: (r) => fmtDate(r.a.discarded.date) },
    ...farmerInfoColumns(t, (r) => r.farmer, setJourney),
    { name: t("Indent ID"), minWidth: "130px", cell: (r) => r.indent.indentNo },
    { name: t("Lot No"), minWidth: "100px", cell: (r) => <b>{r.a.lotNumber}</b> },
    { name: t("No of DFLs Assigned"), minWidth: "120px", cell: (r) => r.a.dflsAssigned },
    { name: t("DFLs Assign Date"), minWidth: "125px", cell: (r) => fmtDate(r.a.assignDate) },
    { name: t("Action"), minWidth: "120px", right: true, cell: (r) => restoreBtn(() => confirmRestore(`${t("Lot")} ${r.a.lotNumber}`, () => fiActions.restoreAssignment(r.a.id))) },
  ];

  const views = {
    indent: {
      rows: indents.filter((i) => hit(i.farmer, [i.indentNo, i.cancelled.reason])).sort((a, b) => ((a.cancelled.date || "") < (b.cancelled.date || "") ? 1 : -1)),
      cols: indentCols,
      exportCols: [{ label: "Reason", value: (i) => i.cancelled.reason }, { label: "Remarks", value: (i) => i.cancelled.remarks }, { label: "Cancelled on", value: (i) => fmtDate(i.cancelled.date) },
        { label: "Indent ID", value: (i) => i.indentNo }, ...farmerInfoExport((i) => i.farmer), { label: "No of DFLs Ordered", value: (i) => i.dflsOrdered },
        { label: "CRC / Direct", value: (i) => unitName(i) }, { label: "Indent Date", value: (i) => fmtDate(i.indentDate) }],
    },
    dfls: {
      rows: discarded.filter((r) => hit(r.farmer, [r.a.lotNumber, r.a.discarded.reason])).sort((a, b) => ((a.a.discarded.date || "") < (b.a.discarded.date || "") ? 1 : -1)),
      cols: dflCols,
      exportCols: [{ label: "Reason", value: (r) => r.a.discarded.reason }, { label: "Remarks", value: (r) => r.a.discarded.remarks }, { label: "Discarded on", value: (r) => fmtDate(r.a.discarded.date) },
        ...farmerInfoExport((r) => r.farmer), { label: "Indent ID", value: (r) => r.indent.indentNo }, { label: "Lot No", value: (r) => r.a.lotNumber },
        { label: "No of DFLs Assigned", value: (r) => r.a.dflsAssigned }, { label: "DFLs Assign Date", value: (r) => fmtDate(r.a.assignDate) }],
    },
  };
  const v = views[tab];
  const TABS = [["indent", t("Indent"), indents.length], ["dfls", t("Assigned DFLs"), discarded.length]];

  return (
    <FiPage title={t("Cancelled")} subtitle={t("Cancelled indents and discarded DFLs – restore if cancelled by mistake")}>
      <div className="fi-stats">
        <StatCard icon="file-docs" label={t("Cancelled Indents")} value={indents.length} sub={`${indents.reduce((n, i) => n + i.dflsOrdered, 0).toLocaleString("en-IN")} DFLs`} color="#c43257" selected={tab === "indent"} onClick={() => setTab("indent")} />
        <StatCard icon="package" label={t("Discarded DFLs")} value={discarded.length} sub={`${discarded.reduce((n, r) => n + r.a.dflsAssigned, 0).toLocaleString("en-IN")} DFLs`} color="#6b7a8c" selected={tab === "dfls"} onClick={() => setTab("dfls")} />
      </div>
      <FiCard title={<div className="fi-tabs">{TABS.map(([key, label, n]) => <button type="button" key={key} className={`fi-tab ${tab === key ? "active" : ""}`} onClick={() => setTab(key)}>{label} <span className="fi-tab-count">{n}</span></button>)}</div>}>
        <div className="fi-filters mb-3"><div style={{ gridColumn: "span 2" }}><div className="fi-label">{t("Search")}</div><SearchBox value={q} onChange={setQ} placeholder={t("Farmer, FRUITS ID, indent ID, lot, reason…")} /></div></div>
        <FiTable key={tab} columns={v.cols} data={v.rows} exportCols={v.exportCols} fileName={`cancelled-${tab}`} title={`${t("Cancelled")} – ${TABS.find((x) => x[0] === tab)[1]}`}
          empty={t("Nothing cancelled")} emptyIcon="cross-circle" />
      </FiCard>
      <FarmerJourneyModal show={!!journey} onHide={() => setJourney(null)} farmerId={journey} />
    </FiPage>
  );
}

export default FiCancelled;
