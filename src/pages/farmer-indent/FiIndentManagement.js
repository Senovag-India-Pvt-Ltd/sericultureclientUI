import { useMemo, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { format } from "date-fns";
import { Icon } from "../../components";
import {
  useFiStore, fiActions, farmerById, unitName, grainageById, statusLabel, fmtDate, todayIso, unknownFarmer,
  INDENT_STATUSES, FARMER_STATUSES, REASONS,
} from "./fiData";
import { FiPage, FiCard, StatCard, Pill, SearchBox, FiTable, farmerInfoColumns, farmerInfoExport, fiSwal, askReason, useOpenExisting } from "./fiUi";
import { IndentModal, FarmerJourneyModal } from "./fiModals";

const STATUS_ICON = { captured: "file-docs", assessment: "clipboard", production: "package", ready: "check-circle", assigned: "truck" };
const STATUS_HEX = { captured: "#556477", assessment: "#6d28d9", production: "#b45309", ready: "#0f766e", assigned: "#15803d" };

function FiIndentManagement() {
  const { t } = useTranslation();
  const s = useFiStore();
  const [params, setParams] = useSearchParams();
  const tab = params.get("tab") || "open";
  const unit = params.get("unit") || "";
  const period = params.get("period") || "";
  const [status, setStatus] = useState("");
  const [q, setQ] = useState("");
  const [edit, setEdit] = useState(null); // indent id | "new" | null
  const openExisting = useOpenExisting();
  const [journey, setJourney] = useState(null);

  // dashboard tiles link here with ?tab= / ?unit= / ?period=
  const setParam = (key, value) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value); else next.delete(key);
    setParams(next, { replace: true });
  };

  const all = useMemo(() => s.indents.filter((i) => !i.cancelled).map((i) => ({ ...i, farmer: farmerById(s, i.farmerId) || unknownFarmer(i.fruitsId) })), [s]);
  const tabs = [
    { key: "open", label: t("Pending"), list: all.filter((i) => i.status !== "assigned") },
    { key: "assigned", label: t("DFLs Assigned"), list: all.filter((i) => i.status === "assigned") },
    { key: "all", label: t("All"), list: all },
  ];
  const month = format(new Date(), "yyyy-MM");
  const rows = (tabs.find((x) => x.key === tab) || tabs[0]).list.filter((i) => {
    const k = q.trim().toLowerCase();
    if (k && ![i.indentNo, i.farmer.name, i.farmer.fruitsId, i.farmer.mobile, i.farmer.farmerNumber].some((v) => (v || "").toLowerCase().includes(k))) return false;
    if (status && i.status !== status) return false;
    if (unit && i.unitId !== unit) return false;
    if (period === "today" && i.indentDate !== todayIso()) return false;
    if (period === "month" && !i.indentDate.startsWith(month)) return false;
    return true;
  }).sort((a, b) => (a.indentDate < b.indentDate ? 1 : -1));

  const openAssign = async (i) => {
    if (i.status !== "ready") {
      const r = await fiSwal.fire({
        icon: "question",
        title: t("Indent is not ready"),
        html: `${t("Current status")}: <b>${statusLabel(i.status)}</b><br/>${t("Mark it as “Ready to Assign DFLs” and continue?")}`,
        showCancelButton: true,
        confirmButtonText: t("Yes, continue"),
      });
      if (!r.isConfirmed) return;
      if (!(await fiActions.updateStatus(i.id, { status: "ready" }))) return;
    }
    // existing screen: Seed & DFL -> Sale/Disposal of DFLs (eggs); the sale is saved against this indent
    openExisting("assignDfls", i.farmer, { numberOfDfls: i.dflsOrdered, indentNo: i.indentNo, indentId: i.id });
  };
  const cancel = async (i) => {
    const r = await askReason(`${t("Cancel indent")} ${i.indentNo}?`, REASONS, t("Cancel Indent"));
    if (r) fiActions.cancelIndent(i.id, r.reason, r.remarks);
  };

  const selectStyle = (hex) => ({ borderRadius: 999, fontWeight: 700, fontSize: ".76rem", color: hex, background: `${hex}12`, borderColor: `${hex}55`, minWidth: 200 });
  const columns = [
    {
      name: t("Assign DFLs"), minWidth: "150px",
      cell: (i) => (i.status === "assigned"
        ? <Pill color="green">{t("Assigned")}</Pill>
        : <Button size="sm" className="fi-btn fi-assign-btn fi-btn-sm" onClick={() => openAssign(i)}><Icon name="package" /> {t("Assign DFLs")}</Button>),
    },
    { name: t("Indent ID"), minWidth: "150px", selector: (i) => i.indentNo, sortable: true, cell: (i) => <b style={{ whiteSpace: "nowrap" }}>{i.indentNo}</b> },
    ...farmerInfoColumns(t, (i) => i.farmer, setJourney),
    { name: t("No of DFLs Ordered"), minWidth: "120px", selector: (i) => i.dflsOrdered, sortable: true, cell: (i) => <b>{i.dflsOrdered}</b> },
    { name: t("No of Sheets Ordered"), minWidth: "120px", selector: (i) => i.sheetsOrdered || 0, sortable: true, cell: (i) => i.sheetsOrdered ?? "–" },
    { name: t("Grainage"), minWidth: "130px", cell: (i) => grainageById(i.grainageId)?.name || s.grainage?.name || "–" },
    { name: t("CRC / Direct"), minWidth: "210px", selector: (i) => unitName(i), sortable: true, cell: (i) => unitName(i) },
    {
      name: t("Farmer Current Status"), minWidth: "190px",
      cell: (i) => (
        <Form.Select size="sm" value={i.farmerStatus} style={{ borderRadius: 999, fontSize: ".76rem", minWidth: 160 }}
          onChange={(e) => fiActions.updateStatus(i.id, { farmerStatus: e.target.value })} aria-label={t("Farmer Current Status")}>
          {!i.farmerStatus && <option value="">{t("Select")}</option>}
          {FARMER_STATUSES.map((x) => <option key={x}>{x}</option>)}
        </Form.Select>
      ),
    },
    { name: t("Indent Date"), minWidth: "120px", selector: (i) => i.indentDate, sortable: true, cell: (i) => fmtDate(i.indentDate) },
    {
      name: t("Indent Status"), minWidth: "240px",
      cell: (i) => (i.status === "assigned"
        ? <Pill color="green">{statusLabel(i.status)}</Pill>
        : (
          <Form.Select size="sm" value={i.status} onChange={(e) => fiActions.updateStatus(i.id, { status: e.target.value })} style={selectStyle(STATUS_HEX[i.status])} aria-label={t("Indent Status")}>
            {INDENT_STATUSES.filter((x) => x.key !== "assigned").map((x) => <option key={x.key} value={x.key}>{x.label}</option>)}
          </Form.Select>
        )),
    },
    {
      name: t("Action"), minWidth: "120px", right: true,
      cell: (i) => (
        <div className="d-flex gap-2">
          <Button size="sm" className="fi-btn fi-btn-soft fi-btn-sm" title={t("Edit")} aria-label={t("Edit")} onClick={() => setEdit(i.id)}><Icon name="edit" /></Button>
          {i.status !== "assigned" && <Button size="sm" className="fi-btn fi-btn-danger-soft fi-btn-sm" title={t("Cancel indent")} aria-label={t("Cancel indent")} onClick={() => cancel(i)}><Icon name="trash" /></Button>}
        </div>
      ),
    },
  ];

  const exportCols = [
    { label: "Indent ID", value: (i) => i.indentNo },
    ...farmerInfoExport((i) => i.farmer),
    { label: "No of DFLs Ordered", value: (i) => i.dflsOrdered }, { label: "No of Sheets Ordered", value: (i) => i.sheetsOrdered },
    { label: "Grainage", value: (i) => grainageById(i.grainageId)?.name || s.grainage?.name }, { label: "CRC / Direct", value: (i) => unitName(i) },
    { label: "Farmer Current Status", value: (i) => i.farmerStatus }, { label: "Indent Date", value: (i) => fmtDate(i.indentDate) },
    { label: "Indent Status", value: (i) => statusLabel(i.status) },
  ];

  const editIndent = edit && edit !== "new" ? s.indents.find((i) => i.id === edit) : null;
  const unitOptions = s.supplyUnits.filter((u) => s.indents.some((i) => i.unitId === u.id));
  const periodLabel = { today: t("Today"), month: t("This month") }[period];

  return (
    <FiPage
      title={t("Indent Management")}
      subtitle={t("Capture farmer orders for DFLs, update status and assign DFLs")}
      actions={<Button className="fi-btn fi-btn-white" onClick={() => setEdit("new")}><Icon name="plus" /> {t("Add Indent")}</Button>}
    >
      <div className="fi-stats">
        {INDENT_STATUSES.map((st) => {
          const list = all.filter((i) => i.status === st.key);
          return (
            <StatCard key={st.key} icon={STATUS_ICON[st.key]} color={STATUS_HEX[st.key]} label={st.label} value={list.length}
              sub={`${list.reduce((n, i) => n + i.dflsOrdered, 0).toLocaleString("en-IN")} DFLs`}
              selected={status === st.key}
              onClick={() => { setStatus(status === st.key ? "" : st.key); setParam("tab", st.key === "assigned" ? "assigned" : "open"); }} />
          );
        })}
      </div>

      <FiCard
        title={
          <div className="fi-tabs">
            {tabs.map((x) => (
              <button type="button" key={x.key} className={`fi-tab ${tab === x.key ? "active" : ""}`} onClick={() => { setParam("tab", x.key); setStatus(""); }}>
                {x.label} <span className="fi-tab-count">{x.list.length}</span>
              </button>
            ))}
          </div>
        }
        right={periodLabel && <button type="button" className="fi-tab active" onClick={() => setParam("period", "")} title={t("Clear")}><Icon name="calendar" /> {periodLabel} <Icon name="cross" /></button>}
      >
        <div className="fi-filters mb-3">
          <div style={{ gridColumn: "span 2" }}><div className="fi-label">{t("Search")}</div><SearchBox value={q} onChange={setQ} placeholder={t("Indent ID, farmer, FRUITS ID, mobile…")} /></div>
          <div><div className="fi-label">{t("CRC / Direct")}</div>
            <Form.Select value={unit} onChange={(e) => setParam("unit", e.target.value)}><option value="">{t("All")}</option>{unitOptions.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}</Form.Select></div>
          <div><div className="fi-label">{t("Indent Status")}</div>
            <Form.Select value={status} onChange={(e) => setStatus(e.target.value)}><option value="">{t("All")}</option>{INDENT_STATUSES.map((x) => <option key={x.key} value={x.key}>{x.label}</option>)}</Form.Select></div>
        </div>
        <FiTable key={tab} columns={columns} data={rows} exportCols={exportCols} fileName="indents" title={t("Indent Management")}
          empty={t("No indents here")} emptyIcon="file-docs" />
      </FiCard>

      <IndentModal show={!!edit} onHide={() => setEdit(null)} indent={editIndent} />
      <FarmerJourneyModal show={!!journey} onHide={() => setJourney(null)} farmerId={journey} />
    </FiPage>
  );
}

export default FiIndentManagement;
