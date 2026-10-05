import { useMemo, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import DataTable from "../../components/AppDataTable";
import { Icon } from "../../components";
import { useFiStore, cropRecords, fmtDate, STAGES } from "./fiData";
import { FiPage, FiCard, FarmerCell, SearchBox, EmptyState, tableStyles, Pill, CROP_STATUS_COLOR, useOpenExisting } from "./fiUi";
import { FarmerJourneyModal } from "./fiModals";
import { StageProgress, dayText } from "./FiAssignedDfls";

const boardCss = `
  .fi-pipeline { display:flex; height:14px; border-radius:999px; overflow:hidden; background:#edf1f6; margin:4px 0 14px; }
  .fi-pipeline > span { height:100%; transition:width .3s; }
  .fi-board { display:grid; grid-auto-flow:column; grid-auto-columns:minmax(220px,1fr); gap:12px; overflow-x:auto; padding-bottom:6px; }
  .fi-col { background:#f5f8fc; border-radius:14px; padding:10px; min-height:140px; }
  .fi-col-head { display:flex; justify-content:space-between; align-items:center; font-weight:800; font-size:.8rem; margin-bottom:8px; padding:0 4px; }
  .fi-crop-card { background:#fff; border-radius:12px; padding:10px 12px; margin-bottom:8px; box-shadow:0 1px 6px rgba(16,42,70,.08); border-left:4px solid; }
  .fi-crop-card .fi-farmer-cell { padding:0; }
`;

function FiStageWiseCrop() {
  const { t } = useTranslation();
  const s = useFiStore();
  const recs = useMemo(() => cropRecords(s).filter((r) => !r.discarded && !r.harvest && !r.failed && !r.closed), [s]);
  const [stage, setStage] = useState("all");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [q, setQ] = useState("");
  const [view, setView] = useState("board");
  const openExisting = useOpenExisting();
  const [journey, setJourney] = useState(null);

  const filtered = recs.filter((r) => {
    if (from && r.a.hatchingDate < from) return false;
    if (to && r.a.hatchingDate > to) return false;
    const k = q.trim().toLowerCase();
    if (k && ![r.farmer.name, r.farmer.fruitsId, r.a.lotNumber].some((v) => v.toLowerCase().includes(k))) return false;
    return true;
  });
  const byStage = (key) => filtered.filter((r) => r.stage.key === key);
  const rows = stage === "all" ? filtered : byStage(stage);

  const actions = (r) => (
    <div className="d-flex gap-1 flex-wrap">
      <Button size="sm" className="fi-btn fi-btn-soft fi-btn-sm" onClick={() => openExisting("cropInspection", r.farmer)}><Icon name="clipboard" /> {t("Inspect")}</Button>
      {["spinning", "market"].includes(r.stage.key) && !r.fc && <Button size="sm" className="fi-btn fi-btn-primary fi-btn-sm" onClick={() => openExisting("fitness", r.farmer)}><Icon name="shield-check" /> {t("Fitness")}</Button>}
    </div>
  );

  const columns = [
    { name: t("Farmer"), grow: 2, minWidth: "220px", selector: (r) => r.farmer.name, sortable: true, cell: (r) => <button type="button" className="btn p-0 text-start border-0" onClick={() => setJourney(r.farmer.id)}><FarmerCell farmer={r.farmer} sub={`${r.farmer.village} · ${r.farmer.tsc}`} /></button> },
    { name: t("Lot · DFLs"), minWidth: "120px", cell: (r) => <div><b>{r.a.lotNumber}</b><div className="fi-farmer-sub">{r.a.dflsAssigned} DFLs</div></div> },
    { name: t("Hatching"), minWidth: "150px", selector: (r) => r.a.hatchingDate, sortable: true, cell: (r) => <div><div>{fmtDate(r.a.hatchingDate)}</div><div className="small">{dayText(r.day, t)}</div></div> },
    { name: t("Stage"), minWidth: "160px", cell: (r) => <StageProgress r={r} /> },
    { name: t("Last Inspection"), minWidth: "150px", cell: (r) => (r.lastInspection ? <div><Pill color={CROP_STATUS_COLOR[r.lastInspection.cropStatus] || "grey"}>{r.lastInspection.cropStatus || "–"}</Pill><div className="fi-farmer-sub">{fmtDate(r.lastInspection.date)}</div></div> : <span className="text-muted">{t("Not inspected")}</span>) },
    { name: t("Action"), minWidth: "190px", right: true, cell: actions },
  ];

  return (
    <FiPage title={t("Stage-wise Crop")} subtitle={t("Stage is worked out from the expected hatching date – no entry needed")}>
      <style>{boardCss}</style>
      <FiCard
        title={<span><Icon name="layers" className="me-1" /> {t("Crop pipeline")} <span className="text-muted fw-normal">({filtered.length} {t("crops")})</span></span>}
        right={
          <div className="fi-tabs">
            <button type="button" className={`fi-tab ${view === "board" ? "active" : ""}`} onClick={() => setView("board")}><Icon name="grid" /> {t("Board")}</button>
            <button type="button" className={`fi-tab ${view === "table" ? "active" : ""}`} onClick={() => setView("table")}><Icon name="list" /> {t("Table")}</button>
          </div>
        }
      >
        <div className="fi-filters mb-2">
          <div style={{ gridColumn: "span 2" }}><div className="fi-label">{t("Search")}</div><SearchBox value={q} onChange={setQ} placeholder={t("Farmer, FRUITS ID, lot…")} /></div>
          <div><div className="fi-label">{t("Hatching from")}</div><Form.Control type="date" value={from} onChange={(e) => setFrom(e.target.value)} /></div>
          <div><div className="fi-label">{t("Hatching to")}</div><Form.Control type="date" value={to} min={from} onChange={(e) => setTo(e.target.value)} /></div>
          <div><Button className="fi-btn fi-btn-soft w-100 justify-content-center" onClick={() => { setFrom(""); setTo(""); setQ(""); setStage("all"); }}><Icon name="reload" /> {t("Clear")}</Button></div>
        </div>

        <div className="fi-pipeline" title={t("Crops by stage")}>
          {STAGES.map((st) => { const n = byStage(st.key).length; return n ? <span key={st.key} title={`${st.label}: ${n}`} style={{ width: `${(n / Math.max(filtered.length, 1)) * 100}%`, background: st.color }} /> : null; })}
        </div>
        <div className="fi-tabs mb-3">
          <button type="button" className={`fi-tab ${stage === "all" ? "active" : ""}`} onClick={() => setStage("all")}>{t("All")} <span className="fi-tab-count">{filtered.length}</span></button>
          {STAGES.map((st) => (
            <button type="button" key={st.key} className={`fi-tab ${stage === st.key ? "active" : ""}`} onClick={() => setStage(st.key)}
              style={stage === st.key ? { background: st.color, borderColor: st.color } : undefined}>
              <span style={{ width: 8, height: 8, borderRadius: 4, background: stage === st.key ? "#fff" : st.color, display: "inline-block" }} /> {st.label} <span className="fi-tab-count">{byStage(st.key).length}</span>
            </button>
          ))}
        </div>

        {view === "board" ? (
          <div className="fi-board">
            {(stage === "all" ? STAGES : STAGES.filter((x) => x.key === stage)).map((st) => (
              <div className="fi-col" key={st.key}>
                <div className="fi-col-head" style={{ color: st.color }}><span>{st.label}</span><span className="fi-tab-count" style={{ background: `${st.color}22` }}>{byStage(st.key).length}</span></div>
                {byStage(st.key).map((r) => (
                  <div key={r.a.id} className="fi-crop-card" style={{ borderLeftColor: st.color }}>
                    <button type="button" className="btn p-0 text-start border-0 w-100" onClick={() => setJourney(r.farmer.id)}><FarmerCell farmer={r.farmer} sub={`${r.a.lotNumber} · ${r.a.dflsAssigned} DFLs`} /></button>
                    <div className="d-flex justify-content-between align-items-center mt-2 small">{dayText(r.day, t)}{r.lastInspection && <Pill color={CROP_STATUS_COLOR[r.lastInspection.cropStatus] || "grey"}>{r.lastInspection.cropStatus || "–"}</Pill>}</div>
                    <div className="mt-2">{actions(r)}</div>
                  </div>
                ))}
                {byStage(st.key).length === 0 && <div className="text-muted small text-center py-3">{t("No crops")}</div>}
              </div>
            ))}
          </div>
        ) : (
          <DataTable columns={columns} data={rows} customStyles={tableStyles} pagination paginationPerPage={10} highlightOnHover responsive
            noDataComponent={<EmptyState icon="layers" text={t("No crops in this stage")} />} />
        )}
      </FiCard>
      <FarmerJourneyModal show={!!journey} onHide={() => setJourney(null)} farmerId={journey} />
    </FiPage>
  );
}

export default FiStageWiseCrop;
