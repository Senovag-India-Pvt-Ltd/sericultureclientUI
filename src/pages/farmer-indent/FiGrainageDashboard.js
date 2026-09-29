import { useMemo } from "react";
import { Row, Col, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend } from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";
import { format, parseISO } from "date-fns";
import { Icon } from "../../components";
import { useFiStore, fiActions, cropRecords, grainageFarmers, harvestTotals, todayIso, STAGES, SUPPLY_UNITS, INDENT_STATUSES } from "./fiData";
import { FiPage, FiCard, StatCard, FI_BASE, fiSwal, fiToast } from "./fiUi";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

const STATUS_HEX = { captured: "#94a3b8", assessment: "#8b5cf6", production: "#f59e0b", ready: "#14b8a6", assigned: "#22c55e" };
const baseOpts = { responsive: true, maintainAspectRatio: false, animation: false, plugins: { legend: { display: false }, tooltip: { padding: 10, cornerRadius: 8 } } };

function FiGrainageDashboard() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const s = useFiStore();
  const recs = useMemo(() => cropRecords(s).filter((r) => !r.discarded), [s]);
  const farmers = useMemo(() => grainageFarmers(s), [s]);
  const active = s.indents.filter((i) => !i.cancelled);
  const month = format(new Date(), "yyyy-MM");
  const sumDfls = (list) => list.reduce((n, i) => n + i.dflsOrdered, 0);

  const today = active.filter((i) => i.indentDate === todayIso());
  const thisMonth = active.filter((i) => i.indentDate.startsWith(month));
  const assignedDfls = recs.reduce((n, r) => n + r.a.dflsAssigned, 0);
  const notAssigned = active.filter((i) => i.status !== "assigned");
  const failed = recs.filter((r) => r.failed && !r.harvest);
  const harvested = recs.filter((r) => r.harvest);
  const harvestKg = harvested.reduce((n, r) => n + harvestTotals(r.harvest).totalKg, 0);
  const running = recs.filter((r) => !r.harvest && !r.failed);

  const byUnit = {
    labels: ["Magadi GG", "Solur GG", "Kudur GG", "Kempegowda CRC", "Sri Bhavani CRC"],
    datasets: [{ label: "DFLs", data: SUPPLY_UNITS.map((u) => sumDfls(active.filter((i) => i.unitId === u.id))), backgroundColor: ["#1e67a8", "#3b8dd6", "#7fb3e6", "#0f766e", "#14b8a6"], borderRadius: 8, maxBarThickness: 46 }],
  };
  const stageCounts = STAGES.map((st) => running.filter((r) => r.stage.key === st.key).length);
  const byStage = { labels: STAGES.map((x) => x.label), datasets: [{ data: stageCounts, backgroundColor: STAGES.map((x) => x.color), borderWidth: 2, borderColor: "#fff" }] };
  const funnel = {
    labels: INDENT_STATUSES.map((x) => x.label),
    datasets: [{ label: t("Indents"), data: INDENT_STATUSES.map((x) => active.filter((i) => i.status === x.key).length), backgroundColor: INDENT_STATUSES.map((x) => STATUS_HEX[x.key]), borderRadius: 8, maxBarThickness: 26 }],
  };

  const attention = [
    { n: active.filter((i) => i.status === "ready").length, text: t("indents ready – assign DFLs"), to: "indents", icon: "package", color: "#0f766e" },
    { n: recs.filter((r) => !r.harvest && !r.failed && r.day >= 0 && !r.lastInspection).length, text: t("crops waiting for inspection"), to: "crop-inspection", icon: "clipboard", color: "#b45309" },
    { n: recs.filter((r) => !r.fc && !r.harvest && !r.failed && ["moult4", "spinning", "market"].includes(r.stage.key)).length, text: t("fitness certificates due"), to: "fitness-certificate", icon: "shield-check", color: "#6d28d9" },
    { n: recs.filter((r) => r.fc?.fit && !r.harvest).length, text: t("harvest entries pending"), to: "harvest", icon: "coins", color: "#1e67a8" },
    { n: failed.length, text: t("crop failures to follow up"), to: "crop-inspection", icon: "alert-circle", color: "#c43257" },
  ];

  const reset = async () => {
    const r = await fiSwal.fire({ icon: "question", title: t("Reset demo data?"), text: t("All changes made on these screens will be cleared."), showCancelButton: true, confirmButtonText: t("Reset") });
    if (r.isConfirmed) { fiActions.resetDemo(); fiToast(t("Demo data reset")); }
  };

  return (
    <FiPage
      title={t("Grainage Dashboard")}
      subtitle={t("Indents, DFLs, crops and harvest of your grainage at a glance")}
      actions={<Button className="fi-btn fi-btn-white" onClick={() => navigate(`${FI_BASE}/indents`)}><Icon name="plus" /> {t("New Indent")}</Button>}
    >
      <div className="fi-stats" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(165px,1fr))" }}>
        <StatCard icon="users" label={t("Farmers")} value={farmers.length} onClick={() => navigate(`${FI_BASE}/farmer-list`)} />
        <StatCard icon="calendar" label={t("Today's Indents")} value={today.length} sub={`${sumDfls(today)} DFLs`} color="#0369a1" onClick={() => navigate(`${FI_BASE}/indents`)} />
        <StatCard icon="file-docs" label={t("This Month")} value={thisMonth.length} sub={`${sumDfls(thisMonth).toLocaleString("en-IN")} DFLs`} color="#6d28d9" onClick={() => navigate(`${FI_BASE}/indents`)} />
        <StatCard icon="package" label={t("DFLs Assigned")} value={assignedDfls.toLocaleString("en-IN")} sub={`${recs.length} ${t("crops")}`} color="#0f766e" onClick={() => navigate(`${FI_BASE}/assigned-dfls`)} />
        <StatCard icon="clock" label={t("Not Assigned")} value={sumDfls(notAssigned).toLocaleString("en-IN")} sub={`${notAssigned.length} ${t("indents")}`} color="#b45309" onClick={() => navigate(`${FI_BASE}/indents`)} />
        <StatCard icon="coins" label={t("Cocoons Harvested")} value={`${harvestKg.toLocaleString("en-IN")} kg`} sub={`${harvested.length} ${t("crops")}`} color="#15803d" onClick={() => navigate(`${FI_BASE}/harvest`)} />
        <StatCard icon="alert-circle" label={t("Crop Failures")} value={failed.length} sub={`${failed.reduce((n, r) => n + r.a.dflsAssigned, 0)} DFLs`} color="#c43257" onClick={() => navigate(`${FI_BASE}/crop-inspection`)} />
      </div>

      <Row className="g-3">
        <Col xl={8}>
          <FiCard title={<span><Icon name="bar-chart" className="me-1" /> {t("DFLs ordered by CRC / Direct")}</span>}>
            <div style={{ height: 280 }}><Bar data={byUnit} options={{ ...baseOpts, scales: { y: { beginAtZero: true, grid: { color: "#eef2f7" } }, x: { grid: { display: false } } } }} /></div>
          </FiCard>
        </Col>
        <Col xl={4}>
          <FiCard title={<span><Icon name="activity" className="me-1" /> {t("Needs attention")}</span>}>
            <div className="d-grid gap-2">
              {attention.map((x) => (
                <Link key={x.text} to={`${FI_BASE}/${x.to}`} className="fi-stat text-decoration-none" style={{ padding: "10px 12px", boxShadow: "none", border: "1px solid #e3ebf5" }}>
                  <span className="fi-stat-icon" style={{ width: 36, height: 36, borderRadius: 10, background: `${x.color}1a`, color: x.color }}><Icon name={x.icon} /></span>
                  <span className="flex-grow-1"><b style={{ color: x.color, fontSize: "1.1rem" }}>{x.n}</b> <span className="text-muted small">{x.text}</span></span>
                  <span className="text-muted">›</span>
                </Link>
              ))}
            </div>
          </FiCard>
        </Col>
        <Col lg={6}>
          <FiCard title={<span><Icon name="layers" className="me-1" /> {t("Running crops by stage")}</span>}>
            <div className="d-flex align-items-center gap-3 flex-wrap">
              <div style={{ height: 220, width: 220 }}><Doughnut data={byStage} options={{ ...baseOpts, cutout: "62%" }} /></div>
              <div className="flex-grow-1" style={{ minWidth: 160 }}>
                {STAGES.map((st, i) => stageCounts[i] ? (
                  <div key={st.key} className="d-flex justify-content-between small py-1" style={{ borderBottom: "1px dashed #e3ebf5" }}>
                    <span><span style={{ width: 10, height: 10, borderRadius: 3, background: st.color, display: "inline-block", marginRight: 6 }} />{st.label}</span><b>{stageCounts[i]}</b>
                  </div>
                ) : null)}
                {!running.length && <div className="text-muted small">{t("No running crops")}</div>}
              </div>
            </div>
          </FiCard>
        </Col>
        <Col lg={6}>
          <FiCard title={<span><Icon name="file-docs" className="me-1" /> {t("Indent status")}</span>}>
            <div style={{ height: 220 }}><Bar data={funnel} options={{ ...baseOpts, indexAxis: "y", scales: { x: { beginAtZero: true, ticks: { precision: 0 }, grid: { color: "#eef2f7" } }, y: { grid: { display: false } } } }} /></div>
          </FiCard>
        </Col>
      </Row>
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mt-1">
        <span className="fi-demo-note"><Icon name="info" /> {t("UI preview with demo data – will show live data once the APIs are connected.")} ({t("as on")} {format(parseISO(todayIso()), "dd/MM/yyyy")})</span>
        <Button size="sm" className="fi-btn fi-btn-soft" onClick={reset}><Icon name="reload" /> {t("Reset demo data")}</Button>
      </div>
    </FiPage>
  );
}

export default FiGrainageDashboard;
