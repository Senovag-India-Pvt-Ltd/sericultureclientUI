import { useMemo, useState } from "react";
import { Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import DataTable from "../../components/AppDataTable";
import { Icon } from "../../components";
import { useFiStore, cropRecords, fmtDate } from "./fiData";
import { FiPage, FiCard, StatCard, Pill, FarmerCell, SearchBox, EmptyState, tableStyles, exportCsv, useOpenExisting } from "./fiUi";
import { FarmerJourneyModal } from "./fiModals";
import { StageProgress, dayText } from "./FiAssignedDfls";

function FiFitnessCertificate() {
  const { t } = useTranslation();
  const s = useFiStore();
  const recs = useMemo(() => cropRecords(s).filter((r) => !r.discarded && !r.failed), [s]);
  const [tab, setTab] = useState("due");
  const [q, setQ] = useState("");
  const openExisting = useOpenExisting();
  const [journey, setJourney] = useState(null);

  const due = recs.filter((r) => !r.fc && !r.harvest && !r.closed && ["moult4", "spinning", "market"].includes(r.stage.key));
  const fit = recs.filter((r) => r.fc?.fit);
  const notFit = recs.filter((r) => r.fc && !r.fc.fit);
  const lists = { due, fit, notfit: notFit };
  const rows = lists[tab].filter((r) => {
    const k = q.trim().toLowerCase();
    return !k || [r.farmer.name, r.farmer.fruitsId, r.a.lotNumber].some((v) => v.toLowerCase().includes(k));
  });

  const farmer = { name: t("Farmer"), grow: 2, minWidth: "220px", selector: (r) => r.farmer.name, sortable: true, cell: (r) => <button type="button" className="btn p-0 text-start border-0" onClick={() => setJourney(r.farmer.id)}><FarmerCell farmer={r.farmer} sub={`FRUITS ${r.farmer.fruitsId}`} /></button> };
  const lot = { name: t("Lot · Race"), minWidth: "130px", cell: (r) => <div><b>{r.a.lotNumber}</b><div className="fi-farmer-sub">{r.a.race} · {r.a.dflsAssigned} DFLs</div></div> };

  const dueCols = [
    farmer, lot,
    { name: t("Hatching"), minWidth: "140px", cell: (r) => <div><div>{fmtDate(r.a.hatchingDate)}</div><div className="small">{dayText(r.day, t)}</div></div> },
    { name: t("Stage"), minWidth: "160px", cell: (r) => <StageProgress r={r} /> },
    { name: t("Action"), minWidth: "170px", right: true, cell: (r) => <Button size="sm" className="fi-btn fi-btn-primary fi-btn-sm" onClick={() => openExisting("fitness", r.farmer)}><Icon name="shield-check" /> {t("Issue Certificate")}</Button> },
  ];
  const fcCols = [
    farmer, lot,
    { name: t("Spun on"), minWidth: "120px", cell: (r) => fmtDate(r.fc.spunFrom) },
    { name: t("Disease Status"), minWidth: "150px", cell: (r) => <div><Pill color={r.fc.fit ? "green" : "red"}>{r.fc.diseaseStatus || "–"}</Pill>{r.fc.lotTestDetails ? <div className="fi-farmer-sub">{r.fc.lotTestDetails}</div> : null}</div> },
    { name: t("Fitness"), minWidth: "130px", cell: (r) => (r.fc.fit ? <Pill color="green">{t("Fit For Seed")}</Pill> : <Pill color="red">{t("Not Fit")}</Pill>) },
    { name: t("Expected Market"), minWidth: "170px", cell: (r) => <div><div>{fmtDate(r.fc.expectedMarketDate || r.fc.transactionDate)}</div><div className="fi-farmer-sub">{r.fc.expectedKg ?? "–"} kg{r.fc.chandies != null ? ` · ${r.fc.chandies} ${t("chandrikes")}` : ""}</div></div> },
    {
      name: t("Action"), minWidth: "170px", right: true,
      cell: (r) => (
        <div className="d-flex gap-2">
          <Button size="sm" className="fi-btn fi-btn-soft fi-btn-sm" title={t("Edit")} onClick={() => openExisting("fitnessEdit", r.farmer)}><Icon name="edit" /></Button>
          {r.fc.fit && !r.harvest && <Button size="sm" className="fi-btn fi-btn-primary fi-btn-sm" onClick={() => openExisting("harvest", r.farmer)}><Icon name="coins" /> {t("Harvest")}</Button>}
          {r.harvest && <Pill color="green">{t("Harvested")}</Pill>}
        </div>
      ),
    },
  ];

  const doExport = () => exportCsv("fitness-certificates.csv", [
    { label: "Farmer", value: (r) => r.farmer.name }, { label: "FRUITS ID", value: (r) => r.farmer.fruitsId }, { label: "Lot", value: (r) => r.a.lotNumber },
    { label: "Spun On", value: (r) => fmtDate(r.fc?.spunFrom) }, { label: "Disease Status", value: (r) => r.fc?.diseaseStatus }, { label: "Lot Test", value: (r) => r.fc?.lotTestDetails },
    { label: "Fitness", value: (r) => (r.fc ? (r.fc.fit ? "Fit For Seed" : "Not Fit") : "Due") },
    { label: "Expected Market Date", value: (r) => fmtDate(r.fc?.expectedMarketDate || r.fc?.transactionDate) }, { label: "Expected Kg", value: (r) => r.fc?.expectedKg }, { label: "Chandrikes", value: (r) => r.fc?.chandies },
  ], rows);

  const TABS = [["due", t("Due"), due.length], ["fit", t("Fit For Seed"), fit.length], ["notfit", t("Not Fit For Seed"), notFit.length]];
  return (
    <FiPage title={t("Fitness Certificate")} subtitle={t("Issue opens Fitness Certificate Add; correct opens Fitness Certificate Edit")}>
      <div className="fi-stats">
        <StatCard icon="clock" label={t("Certificate Due")} value={due.length} sub={t("4th moult / spinning")} color="#b45309" selected={tab === "due"} onClick={() => setTab("due")} />
        <StatCard icon="shield-check" label={t("Fit For Seed")} value={fit.length} sub={`${fit.reduce((n, r) => n + (r.fc.expectedKg || 0), 0)} kg ${t("expected")}`} color="#15803d" selected={tab === "fit"} onClick={() => setTab("fit")} />
        <StatCard icon="cross-circle" label={t("Not Fit")} value={notFit.length} color="#c43257" selected={tab === "notfit"} onClick={() => setTab("notfit")} />
      </div>
      <FiCard
        title={<div className="fi-tabs">{TABS.map(([k, label, n]) => <button type="button" key={k} className={`fi-tab ${tab === k ? "active" : ""}`} onClick={() => setTab(k)}>{label} <span className="fi-tab-count">{n}</span></button>)}</div>}
        right={<Button size="sm" className="fi-btn fi-btn-soft" onClick={doExport}><Icon name="download" /> {t("Export")}</Button>}
      >
        <div className="fi-filters mb-3"><div style={{ gridColumn: "span 2" }}><div className="fi-label">{t("Search")}</div><SearchBox value={q} onChange={setQ} placeholder={t("Farmer, FRUITS ID, lot…")} /></div></div>
        <DataTable key={tab} columns={tab === "due" ? dueCols : fcCols} data={rows} customStyles={tableStyles} pagination paginationPerPage={10} highlightOnHover responsive
          noDataComponent={<EmptyState icon="shield-check" text={tab === "due" ? t("No certificate due right now") : t("No certificates")} />} />
      </FiCard>
      <FarmerJourneyModal show={!!journey} onHide={() => setJourney(null)} farmerId={journey} />
    </FiPage>
  );
}

export default FiFitnessCertificate;
