import { useMemo, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import DataTable from "../../components/AppDataTable";
import { Icon } from "../../components";
import { useFiStore, grainageFarmers, statusLabel, fmtDate } from "./fiData";
import { FiPage, FiCard, StatCard, Pill, StagePill, FarmerCell, SearchBox, EmptyState, tableStyles, exportCsv, INDENT_STATUS_COLOR } from "./fiUi";
import { IndentModal, FarmerJourneyModal } from "./fiModals";

// Landing page for grainage users (REQ-01 … REQ-09)
function FiFarmerList() {
  const { t } = useTranslation();
  const s = useFiStore();
  const farmers = useMemo(() => grainageFarmers(s), [s]);
  const [q, setQ] = useState("");
  const [tsc, setTsc] = useState("");
  const [card, setCard] = useState("all");
  const [indentFor, setIndentFor] = useState(null);
  const [journey, setJourney] = useState(null);

  const group = (f) => {
    if (f.lastIndent && f.lastIndent.status !== "assigned") return "pending";
    const c = f.crop && !f.crop.discarded ? f.crop : null;
    if (c?.harvest) return "harvested";
    if (c?.failed) return "failed";
    if (c && !c.closed) return "rearing";
    return "noindent";
  };
  const counts = farmers.reduce((m, f) => ({ ...m, [group(f)]: (m[group(f)] || 0) + 1 }), {});

  const rows = farmers.filter((f) => {
    const k = q.trim().toLowerCase();
    if (k && ![f.name, f.fruitsId, f.mobile, f.farmerNumber, f.village].some((v) => v.toLowerCase().includes(k))) return false;
    if (tsc && f.tsc !== tsc) return false;
    if (card !== "all" && group(f) !== card) return false;
    return true;
  });

  const columns = [
    { name: t("Farmer"), grow: 2.2, minWidth: "240px", selector: (f) => f.name, sortable: true, cell: (f) => <FarmerCell farmer={f} /> },
    { name: t("FRUITS ID"), minWidth: "170px", selector: (f) => f.fruitsId, cell: (f) => <span className="fi-mono">{f.fruitsId}</span> },
    { name: t("Village / TSC"), minWidth: "160px", selector: (f) => f.village, sortable: true, cell: (f) => <div><div className="fw-semibold">{f.village}</div><div className="fi-farmer-sub">{f.tsc}</div></div> },
    { name: t("Mulberry"), width: "115px", selector: (f) => f.mulberryAcres || 0, sortable: true, cell: (f) => (f.mulberryAcres != null ? `${f.mulberryAcres} ac` : "–") },
    {
      name: t("Latest Indent"), minWidth: "200px", selector: (f) => f.lastIndent?.indentDate || "",
      sortable: true,
      cell: (f) => f.lastIndent
        ? <div><div className="fw-semibold">{f.lastIndent.dflsOrdered} DFLs <span className="fi-farmer-sub">· {fmtDate(f.lastIndent.indentDate)}</span></div><Pill color={INDENT_STATUS_COLOR[f.lastIndent.status]}>{statusLabel(f.lastIndent.status)}</Pill></div>
        : <span className="text-muted">{t("No indent")}</span>,
    },
    {
      name: t("Crop"), minWidth: "150px",
      cell: (f) => !f.crop ? "–"
        : f.crop.discarded ? <Pill color="grey">{t("Discarded")}</Pill>
        : f.crop.harvest ? <Pill color="green">{t("Harvested")}</Pill>
        : f.crop.failed ? <Pill color="red">{t("Crop Failed")}</Pill>
        : f.crop.closed ? <Pill color="grey">{t("Closed")}</Pill>
        : <StagePill stage={f.crop.stage} />,
    },
    {
      name: t("Action"), minWidth: "200px", right: true,
      cell: (f) => (
        <div className="d-flex gap-2">
          <Button size="sm" className="fi-btn fi-btn-primary fi-btn-sm" onClick={() => setIndentFor(f.id)}><Icon name="plus" /> {t("Indent")}</Button>
          <Button size="sm" className="fi-btn fi-btn-soft fi-btn-sm" onClick={() => setJourney(f.id)}><Icon name="eye" /> {t("View")}</Button>
        </div>
      ),
    },
  ];

  const doExport = () => exportCsv("grainage-farmers.csv", [
    { label: "Farmer Number", value: (f) => f.farmerNumber }, { label: "FRUITS ID", value: (f) => f.fruitsId },
    { label: "Name", value: (f) => f.name }, { label: "Father Name", value: (f) => f.fatherName }, { label: "Mobile", value: (f) => f.mobile },
    { label: "Village", value: (f) => f.village }, { label: "TSC", value: (f) => f.tsc },
    { label: "Latest Indent", value: (f) => f.lastIndent?.indentNo }, { label: "Status", value: (f) => (f.lastIndent ? statusLabel(f.lastIndent.status) : "") },
  ], rows);

  return (
    <FiPage
      title={t("Farmer List")}
      subtitle={t("Farmers of your grainage – start a new indent or follow a farmer’s crop")}
      actions={<>
        <Link to="/seriui/stake-holder-registration" className="btn fi-btn fi-btn-white"><Icon name="user-add" /> {t("Register Farmer")}</Link>
        <Button className="fi-btn fi-btn-white" onClick={() => setIndentFor("")}><Icon name="plus" /> {t("New Indent")}</Button>
      </>}
    >
      <div className="fi-stats">
        <StatCard icon="users" label={t("All Farmers")} value={farmers.length} onClick={() => setCard("all")} selected={card === "all"} />
        <StatCard icon="file-docs" label={t("Indent Pending")} value={counts.pending || 0} sub={t("waiting for DFLs")} color="#b45309" onClick={() => setCard("pending")} selected={card === "pending"} />
        <StatCard icon="layers" label={t("Crop Running")} value={counts.rearing || 0} sub={t("DFLs given")} color="#0f766e" onClick={() => setCard("rearing")} selected={card === "rearing"} />
        <StatCard icon="coins" label={t("Harvested")} value={counts.harvested || 0} color="#15803d" onClick={() => setCard("harvested")} selected={card === "harvested"} />
        <StatCard icon="alert-circle" label={t("Crop Failed")} value={counts.failed || 0} color="#c43257" onClick={() => setCard("failed")} selected={card === "failed"} />
        <StatCard icon="user" label={t("No Active Crop")} value={counts.noindent || 0} sub={t("ready for a new indent")} color="#6b7a8c" onClick={() => setCard("noindent")} selected={card === "noindent"} />
      </div>

      <FiCard
        title={<span><Icon name="users" className="me-1" /> {t("Farmers")} <span className="text-muted fw-normal">({rows.length})</span></span>}
        right={<Button size="sm" className="fi-btn fi-btn-soft" onClick={doExport}><Icon name="download" /> {t("Export")}</Button>}
      >
        <div className="fi-filters mb-3">
          <div style={{ gridColumn: "span 2" }}>
            <div className="fi-label">{t("Search")}</div>
            <SearchBox value={q} onChange={setQ} placeholder={t("Name, FRUITS ID, mobile, village…")} />
          </div>
          <div>
            <div className="fi-label">TSC</div>
            <Form.Select value={tsc} onChange={(e) => setTsc(e.target.value)}>
              <option value="">{t("All TSCs")}</option>
              {s.tscs.map((x) => <option key={x}>{x}</option>)}
            </Form.Select>
          </div>
          <div>
            <Button className="fi-btn fi-btn-soft w-100 justify-content-center" onClick={() => { setQ(""); setTsc(""); setCard("all"); }}><Icon name="reload" /> {t("Clear")}</Button>
          </div>
        </div>
        <DataTable
          columns={columns}
          data={rows}
          customStyles={tableStyles}
          pagination
          paginationPerPage={10}
          highlightOnHover
          responsive
          noDataComponent={<EmptyState icon="users" text={t("No farmers match the filters")} />}
        />
      </FiCard>

      <IndentModal show={indentFor !== null} onHide={() => setIndentFor(null)} farmerId={indentFor || ""} />
      <FarmerJourneyModal show={!!journey} onHide={() => setJourney(null)} farmerId={journey} />
    </FiPage>
  );
}

export default FiFarmerList;
