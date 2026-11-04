import { useMemo, useState } from "react";
import { Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { Icon } from "../../components";
import { useFiStore, cropRecords, fmtDate, harvestTotals, unitName } from "./fiData";
import { FiPage, FiCard, StatCard, Pill, SearchBox, FiTable, farmerInfoColumns, farmerInfoExport, useOpenExisting } from "./fiUi";
import { FarmerJourneyModal } from "./fiModals";

const inr = (n) => `₹${Math.round(n).toLocaleString("en-IN")}`;
const kg = (n) => Math.round(Number(n) * 100) / 100;

function FiHarvestDetails() {
  const { t } = useTranslation();
  const s = useFiStore();
  const recs = useMemo(() => cropRecords(s).filter((r) => !r.discarded), [s]);
  const [tab, setTab] = useState("ready");
  const [q, setQ] = useState("");
  const openExisting = useOpenExisting();
  const [journey, setJourney] = useState(null);

  const ready = recs.filter((r) => r.fc?.fit && !r.harvest && !r.closed);
  // marketedOnly = lot disposed at Seed Cocoon Inward, no Crop Details-Seed Market entry
  const done = recs.filter((r) => r.harvest).map((r) => {
    const tot = harvestTotals(r.harvest);
    return { ...r, tot, yld: r.harvest.marketedOnly || !r.a.dflsAssigned ? null : (tot.totalKg / r.a.dflsAssigned) * 100 };
  });
  const entered = done.filter((r) => !r.harvest.marketedOnly);
  const totalKg = entered.reduce((n, r) => n + r.tot.totalKg, 0);
  const totalAmt = entered.reduce((n, r) => n + r.tot.amount, 0);
  const totalDfls = entered.reduce((n, r) => n + r.a.dflsAssigned, 0);
  const rows = (tab === "ready" ? ready : done).filter((r) => {
    const k = q.trim().toLowerCase();
    return !k || [r.farmer.name, r.farmer.fruitsId, r.farmer.farmerNumber, r.a.lotNumber].some((v) => (v || "").toLowerCase().includes(k));
  });

  const farmer = [
    ...farmerInfoColumns(t, (r) => r.farmer, setJourney),
    { name: t("CRC / Direct"), minWidth: "200px", cell: (r) => (r.indent.direct ? "–" : unitName(r.indent)) },
  ];
  const lot = { name: t("No of DFLs Assigned"), minWidth: "130px", cell: (r) => <div><b>{r.a.dflsAssigned}</b><div className="fi-farmer-sub">{t("Lot")} {r.a.lotNumber}</div></div> };
  const readyCols = [
    ...farmer, lot,
    { name: t("Fitness"), minWidth: "130px", cell: () => <Pill color="green">{t("Fit For Seed")}</Pill> },
    { name: t("Expected"), minWidth: "170px", cell: (r) => <div><div>{fmtDate(r.fc.expectedMarketDate || r.fc.transactionDate)}</div><div className="fi-farmer-sub">{r.fc.expectedKg ?? "–"} kg</div></div> },
    { name: t("Action"), minWidth: "170px", right: true, cell: (r) => <Button size="sm" className="fi-btn fi-btn-primary fi-btn-sm" onClick={() => openExisting("harvest", r.farmer)}><Icon name="coins" /> {t("Enter Harvest")}</Button> },
  ];
  const doneCols = [
    ...farmer, lot,
    { name: t("Market"), minWidth: "170px", selector: (r) => r.harvest.marketDate, sortable: true, cell: (r) => <div><div>{r.harvest.market}</div><div className="fi-farmer-sub">{fmtDate(r.harvest.marketDate)}</div></div> },
    { name: t("Seed"), minWidth: "120px", cell: (r) => (r.harvest.seedKg != null ? <div><b>{kg(r.harvest.seedKg)} kg</b>{r.harvest.seedRate != null && <div className="fi-farmer-sub">@ ₹{r.harvest.seedRate}/kg</div>}</div> : "–") },
    { name: t("Reeling"), minWidth: "120px", cell: (r) => (r.harvest.reelingKg ? <div><b>{kg(r.harvest.reelingKg)} kg</b>{r.harvest.reelingRate != null && <div className="fi-farmer-sub">@ ₹{r.harvest.reelingRate}/kg</div>}</div> : "–") },
    { name: t("Yield / 100 DFLs"), minWidth: "120px", selector: (r) => r.yld ?? -1, sortable: true, cell: (r) => (r.yld == null ? "–" : <Pill color={r.yld >= 60 ? "green" : r.yld >= 45 ? "amber" : "red"}>{r.yld.toFixed(1)} kg</Pill>) },
    { name: t("Total Amount"), minWidth: "130px", selector: (r) => r.tot.amount, sortable: true, cell: (r) => (r.harvest.marketedOnly ? "–" : <b>{inr(r.tot.amount)}</b>) },
    { name: t("Action"), width: "90px", right: true, cell: (r) => <Button size="sm" className="fi-btn fi-btn-soft fi-btn-sm" title={t("Edit")} onClick={() => openExisting("harvest", r.farmer)}><Icon name="edit" /></Button> },
  ];

  const exportCols = [
    ...farmerInfoExport((r) => r.farmer), { label: "CRC / Direct", value: (r) => (r.indent.direct ? "" : unitName(r.indent)) },
    { label: "Lot", value: (r) => r.a.lotNumber }, { label: "No of DFLs Assigned", value: (r) => r.a.dflsAssigned },
    { label: "Expected Market Date", value: (r) => fmtDate(r.fc?.expectedMarketDate || r.fc?.transactionDate) }, { label: "Expected Kg", value: (r) => r.fc?.expectedKg },
    { label: "Market", value: (r) => r.harvest?.market }, { label: "Date", value: (r) => fmtDate(r.harvest?.marketDate) },
    { label: "Seed Kg", value: (r) => r.harvest?.seedKg }, { label: "Seed Rate", value: (r) => r.harvest?.seedRate }, { label: "Reeling Kg", value: (r) => r.harvest?.reelingKg }, { label: "Reeling Rate", value: (r) => r.harvest?.reelingRate },
    { label: "Bonus", value: (r) => r.harvest?.bonus }, { label: "Incentive", value: (r) => r.harvest?.incentive }, { label: "Total Amount", value: (r) => (r.tot ? Math.round(r.tot.amount) : "") },
  ];

  return (
    <FiPage title={t("Harvest Details")} subtitle={t("Seed market sale of cocoons. Entry opens DBT → Crop Details-Seed Market")}
      actions={<Button className="fi-btn fi-btn-white" onClick={() => openExisting("harvest")}><Icon name="plus" /> {t("Add Harvest Details")}</Button>}>
      <div className="fi-stats">
        <StatCard icon="clock" label={t("Ready to Harvest")} value={ready.length} sub={`${ready.reduce((n, r) => n + (r.fc.expectedKg || 0), 0)} kg ${t("expected")}`} color="#b45309" selected={tab === "ready"} onClick={() => setTab("ready")} />
        <StatCard icon="check-circle" label={t("Harvested")} value={done.length} color="#15803d" selected={tab === "done"} onClick={() => setTab("done")} />
        <StatCard icon="box" label={t("Total Cocoons")} value={`${kg(totalKg).toLocaleString("en-IN")} kg`} color="#0f766e" />
        <StatCard icon="coins" label={t("Total Amount")} value={inr(totalAmt)} color="#1e67a8" />
        <StatCard icon="growth" label={t("Avg Yield / 100 DFLs")} value={`${totalDfls ? ((totalKg / totalDfls) * 100).toFixed(1) : 0} kg`} color="#6d28d9" />
      </div>
      <FiCard
        title={<div className="fi-tabs">{[["ready", t("Ready to Harvest"), ready.length], ["done", t("Harvested"), done.length]].map(([k, label, n]) => <button type="button" key={k} className={`fi-tab ${tab === k ? "active" : ""}`} onClick={() => setTab(k)}>{label} <span className="fi-tab-count">{n}</span></button>)}</div>}
      >
        <div className="fi-filters mb-3"><div style={{ gridColumn: "span 2" }}><div className="fi-label">{t("Search")}</div><SearchBox value={q} onChange={setQ} placeholder={t("Farmer, FRUITS ID, lot…")} /></div></div>
        <FiTable key={tab} columns={tab === "ready" ? readyCols : doneCols} data={rows} exportCols={exportCols} fileName={`harvest-${tab}`}
          title={`${t("Harvest Details")} – ${tab === "ready" ? t("Ready to Harvest") : t("Harvested")}`}
          empty={tab === "ready" ? t("No crop is waiting for harvest entry") : t("No harvest recorded yet")} emptyIcon="coins" />
      </FiCard>
      <FarmerJourneyModal show={!!journey} onHide={() => setJourney(null)} farmerId={journey} />
    </FiPage>
  );
}

export default FiHarvestDetails;
