import { useMemo, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import DataTable from "../../components/AppDataTable";
import { Icon } from "../../components";
import {
  useFiStore, fiActions, farmerById, unitName, grainageById, statusLabel, fmtDate,
  INDENT_STATUSES, FARMER_STATUSES, REASONS,
} from "./fiData";
import { FiPage, FiCard, StatCard, Pill, FarmerCell, SearchBox, EmptyState, tableStyles, exportCsv, fiSwal, askReason, useOpenExisting } from "./fiUi";
import { IndentModal, FarmerJourneyModal } from "./fiModals";

const STATUS_ICON = { captured: "file-docs", assessment: "clipboard", production: "package", ready: "check-circle", assigned: "truck" };
const STATUS_HEX = { captured: "#556477", assessment: "#6d28d9", production: "#b45309", ready: "#0f766e", assigned: "#15803d" };

function FiIndentManagement() {
  const { t } = useTranslation();
  const s = useFiStore();
  const [tab, setTab] = useState("open");
  const [status, setStatus] = useState("");
  const [unit, setUnit] = useState("");
  const [q, setQ] = useState("");
  const [edit, setEdit] = useState(null); // indent id | "new" | null
  const openExisting = useOpenExisting();
  const [journey, setJourney] = useState(null);

  const all = useMemo(() => s.indents.map((i) => ({ ...i, farmer: farmerById(s, i.farmerId) || { id: i.fruitsId, fruitsId: i.fruitsId, name: i.fruitsId, village: "", tsc: "", mobile: "" } })), [s]);
  const active = all.filter((i) => !i.cancelled);
  const tabs = [
    { key: "open", label: t("Open"), list: active.filter((i) => i.status !== "assigned") },
    { key: "assigned", label: t("DFLs Assigned"), list: active.filter((i) => i.status === "assigned") },
    { key: "cancelled", label: t("Cancelled"), list: all.filter((i) => i.cancelled) },
    { key: "all", label: t("All"), list: all },
  ];
  const rows = tabs.find((x) => x.key === tab).list.filter((i) => {
    const k = q.trim().toLowerCase();
    if (k && ![i.indentNo, i.farmer?.name, i.farmer?.fruitsId, i.farmer?.mobile].some((v) => (v || "").toLowerCase().includes(k))) return false;
    if (status && i.status !== status) return false;
    if (unit && i.unitId !== unit) return false;
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

  const columns = [
    { name: t("Indent No"), minWidth: "140px", selector: (i) => i.indentNo, sortable: true, cell: (i) => <div><div className="fw-bold">{i.indentNo}</div><div className="fi-farmer-sub">{fmtDate(i.indentDate)}</div></div> },
    { name: t("Farmer"), grow: 1.5, minWidth: "210px", selector: (i) => i.farmer?.name, sortable: true, cell: (i) => <button type="button" className="btn p-0 text-start border-0" onClick={() => setJourney(i.farmerId)}><FarmerCell farmer={i.farmer} sub={`${i.farmer?.village} · ${i.farmer?.tsc}`} /></button> },
    { name: t("Sheets / DFLs"), width: "135px", selector: (i) => i.dflsOrdered, sortable: true, cell: (i) => <div><b>{i.dflsOrdered}</b> <span className="fi-farmer-sub">DFLs</span><div className="fi-farmer-sub">{i.sheetsOrdered} {t("sheets")}</div></div> },
    { name: t("Grainage · CRC / Direct"), minWidth: "210px", cell: (i) => <div><div className="fw-semibold">{grainageById(i.grainageId)?.name}</div><div className="fi-farmer-sub">{unitName(i)}</div></div> },
    {
      name: t("Indent Status"), minWidth: "235px",
      cell: (i) => i.cancelled || i.status === "assigned"
        ? (i.cancelled ? <Pill color="red">{t("Cancelled")}</Pill> : <Pill color="green">{statusLabel(i.status)}</Pill>)
        : (
          <Form.Select size="sm" value={i.status} onChange={(e) => fiActions.updateStatus(i.id, { status: e.target.value })}
            style={{ borderRadius: 999, fontWeight: 700, fontSize: ".76rem", color: STATUS_HEX[i.status], background: `${STATUS_HEX[i.status]}12`, borderColor: `${STATUS_HEX[i.status]}55` }}>
            {INDENT_STATUSES.filter((x) => x.key !== "assigned").map((x) => <option key={x.key} value={x.key}>{x.label}</option>)}
          </Form.Select>
        ),
    },
    {
      name: t("Farmer Status"), minWidth: "150px",
      cell: (i) => i.cancelled ? "–" : (
        <Form.Select size="sm" value={i.farmerStatus} style={{ borderRadius: 999, fontSize: ".76rem" }}
          onChange={(e) => fiActions.updateStatus(i.id, { farmerStatus: e.target.value })}>
          {!i.farmerStatus && <option value="">{t("Select")}</option>}
          {FARMER_STATUSES.map((x) => <option key={x}>{x}</option>)}
        </Form.Select>
      ),
    },
    ...(tab === "cancelled" ? [{ name: t("Reason"), minWidth: "220px", cell: (i) => <div><div className="fw-semibold text-danger">{i.cancelled?.reason}</div><div className="fi-farmer-sub">{fmtDate(i.cancelled?.date)}{i.cancelled?.remarks ? ` · ${i.cancelled.remarks}` : ""}</div></div> }] : []),
    {
      name: t("Action"), minWidth: "240px", right: true,
      cell: (i) => i.cancelled ? (
        <Button size="sm" className="fi-btn fi-btn-soft fi-btn-sm" onClick={() => fiActions.restoreIndent(i.id)}><Icon name="reload" /> {t("Restore")}</Button>
      ) : (
        <div className="d-flex gap-2">
          {i.status !== "assigned" && <Button size="sm" className="fi-btn fi-btn-primary fi-btn-sm" onClick={() => openAssign(i)}><Icon name="package" /> {t("Assign DFLs")}</Button>}
          <Button size="sm" className="fi-btn fi-btn-soft fi-btn-sm" title={t("Edit")} onClick={() => setEdit(i.id)}><Icon name="edit" /></Button>
          {i.status !== "assigned" && <Button size="sm" className="fi-btn fi-btn-danger-soft fi-btn-sm" title={t("Cancel")} onClick={() => cancel(i)}><Icon name="cross" /></Button>}
        </div>
      ),
    },
  ];

  const doExport = () => exportCsv("indents.csv", [
    { label: "Indent No", value: (i) => i.indentNo }, { label: "Indent Date", value: (i) => fmtDate(i.indentDate) },
    { label: "Farmer", value: (i) => i.farmer?.name }, { label: "FRUITS ID", value: (i) => i.farmer?.fruitsId }, { label: "Mobile", value: (i) => i.farmer?.mobile },
    { label: "Sheets", value: (i) => i.sheetsOrdered }, { label: "DFLs", value: (i) => i.dflsOrdered },
    { label: "Grainage", value: (i) => grainageById(i.grainageId)?.name }, { label: "CRC / Direct", value: (i) => unitName(i) },
    { label: "Indent Status", value: (i) => (i.cancelled ? "Cancelled" : statusLabel(i.status)) }, { label: "Farmer Status", value: (i) => i.farmerStatus },
    { label: "Cancel Reason", value: (i) => i.cancelled?.reason },
  ], rows);

  const editIndent = edit && edit !== "new" ? s.indents.find((i) => i.id === edit) : null;

  return (
    <FiPage
      title={t("Indent Management")}
      subtitle={t("Capture farmer orders for DFLs, update status and assign DFLs")}
      actions={<Button className="fi-btn fi-btn-white" onClick={() => setEdit("new")}><Icon name="plus" /> {t("New Indent")}</Button>}
    >
      <div className="fi-stats">
        {INDENT_STATUSES.map((st) => (
          <StatCard key={st.key} icon={STATUS_ICON[st.key]} color={STATUS_HEX[st.key]} label={st.label}
            value={active.filter((i) => i.status === st.key).length}
            sub={`${active.filter((i) => i.status === st.key).reduce((n, i) => n + i.dflsOrdered, 0).toLocaleString("en-IN")} DFLs`}
            selected={status === st.key}
            onClick={() => { setStatus(status === st.key ? "" : st.key); setTab(st.key === "assigned" ? "assigned" : "open"); }} />
        ))}
      </div>

      <FiCard
        title={
          <div className="fi-tabs">
            {tabs.map((x) => (
              <button type="button" key={x.key} className={`fi-tab ${tab === x.key ? "active" : ""}`} onClick={() => { setTab(x.key); setStatus(""); }}>
                {x.label} <span className="fi-tab-count">{x.list.length}</span>
              </button>
            ))}
          </div>
        }
        right={<Button size="sm" className="fi-btn fi-btn-soft" onClick={doExport}><Icon name="download" /> {t("Export")}</Button>}
      >
        <div className="fi-filters mb-3">
          <div style={{ gridColumn: "span 2" }}><div className="fi-label">{t("Search")}</div><SearchBox value={q} onChange={setQ} placeholder={t("Indent no, farmer, FRUITS ID, mobile…")} /></div>
          <div><div className="fi-label">{t("CRC / Direct")}</div>
            <Form.Select value={unit} onChange={(e) => setUnit(e.target.value)}><option value="">{t("All")}</option>{s.supplyUnits.filter((u) => s.indents.some((i) => i.unitId === u.id)).map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}</Form.Select></div>
          <div><div className="fi-label">{t("Indent Status")}</div>
            <Form.Select value={status} onChange={(e) => setStatus(e.target.value)}><option value="">{t("All")}</option>{INDENT_STATUSES.map((x) => <option key={x.key} value={x.key}>{x.label}</option>)}</Form.Select></div>
        </div>
        <DataTable key={tab} columns={columns} data={rows} customStyles={tableStyles} pagination paginationPerPage={10} highlightOnHover responsive
          noDataComponent={<EmptyState icon="file-docs" text={t("No indents here")} />} />
      </FiCard>

      <IndentModal show={!!edit} onHide={() => setEdit(null)} indent={editIndent} />
      <FarmerJourneyModal show={!!journey} onHide={() => setJourney(null)} farmerId={journey} />
    </FiPage>
  );
}

export default FiIndentManagement;
