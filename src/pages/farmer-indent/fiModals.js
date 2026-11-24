// Modal forms shared by the Farmer Indent screens.
import { useEffect, useMemo, useState } from "react";
import { Modal, Form, Row, Col, Button, Spinner } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { Icon } from "../../components";
import {
  useFiStore, fiActions, farmerById, unitName, statusLabel, fmtDate, todayIso, harvestTotals, cropRecords, unitKey,
  INDENT_STATUSES, FARMER_STATUSES,
} from "./fiData";
import { FarmerCell, Pill, INDENT_STATUS_COLOR, CROP_STATUS_COLOR } from "./fiUi";

function Field({ label, required, children, md = 6, hint }) {
  return (
    <Col md={md} className="mb-3">
      <Form.Label className="fi-label">{label}{required && <span className="text-danger"> *</span>}</Form.Label>
      {children}
      {hint && <Form.Text className="text-muted" style={{ fontSize: ".72rem" }}>{hint}</Form.Text>}
    </Col>
  );
}

function FiModal({ show, onHide, title, icon, size = "lg", children, footer }) {
  return (
    <Modal show={show} onHide={onHide} size={size} centered scrollable dialogClassName="fi-modal" contentClassName="fi-modal-content" className="fi-modal">
      <Modal.Header closeButton>
        <Modal.Title><Icon name={icon} className="me-2" />{title}</Modal.Title>
      </Modal.Header>
      {children}
      {footer}
    </Modal>
  );
}

function useForm(initial, deps) {
  const [data, setData] = useState(initial);
  const [validated, setValidated] = useState(false);
  // reset whenever the modal opens for another record
  useEffect(() => { setData(initial); setValidated(false); }, deps); // eslint-disable-line react-hooks/exhaustive-deps
  const set = (e) => setData((d) => ({ ...d, [e.target.name]: e.target.value }));
  return { data, setData, set, validated, setValidated };
}

function submitGuard(e, setValidated, fn) {
  e.preventDefault();
  e.stopPropagation();
  if (e.currentTarget.checkValidity() === false) { setValidated(true); return; }
  fn();
}

const Footer = ({ onHide, formId, label, t, saving }) => (
  <Modal.Footer>
    <Button className="fi-btn fi-btn-soft" onClick={onHide}>{t("Cancel")}</Button>
    <Button className="fi-btn fi-btn-primary" type="submit" form={formId} disabled={saving}>
      {saving ? <Spinner animation="border" size="sm" /> : <Icon name="check" />} {label}
    </Button>
  </Modal.Footer>
);

// ─── Farmer picker ────────────────────────────────────────────────────────
// Grainage farmers are searched locally; 3+ characters also search all
// registered farmers (FRUITS ID / mobile / farmer number exact, name prefix).
function FarmerPicker({ farmers, selected, onChange, t, invalid }) {
  const [q, setQ] = useState("");
  const [remote, setRemote] = useState([]);
  const [searching, setSearching] = useState(false);
  const k = q.trim().toLowerCase();
  const local = useMemo(
    () => farmers.filter((f) => !k || [f.name, f.fruitsId, f.mobile, f.farmerNumber].some((v) => (v || "").toLowerCase().includes(k))).slice(0, 6),
    [k, farmers],
  );
  useEffect(() => {
    if (k.length < 3) { setRemote([]); return undefined; }
    let live = true;
    setSearching(true);
    const timer = setTimeout(() => fiActions.searchFarmers(q.trim()).then((list) => {
      if (live) { setRemote(list); setSearching(false); }
    }), 350);
    return () => { live = false; clearTimeout(timer); };
  }, [k]); // eslint-disable-line react-hooks/exhaustive-deps
  const list = [...local, ...remote.filter((r) => !local.some((l) => l.id === r.id))].slice(0, 10);

  if (selected) {
    return (
      <div className="fi-infobox" style={{ alignItems: "center" }}>
        <FarmerCell farmer={selected} sub={`FRUITS ${selected.fruitsId}${selected.village ? ` · ${selected.village}` : ""}${selected.tsc ? `, ${selected.tsc}` : ""}`} />
        <div className="text-end"><Button size="sm" className="fi-btn fi-btn-soft fi-btn-sm" onClick={() => onChange(null)}>{t("Change")}</Button></div>
      </div>
    );
  }
  return (
    <div className="mb-3">
      <div className="fi-search mb-2">
        <Icon name="search" />
        <Form.Control autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder={t("Search farmer by name, FRUITS ID or mobile")} />
      </div>
      <div className="d-grid gap-2">
        {list.map((f) => (
          <button type="button" key={f.id} className="fi-stat" style={{ padding: "8px 12px" }} onClick={() => onChange(f)}>
            <FarmerCell farmer={f} sub={`FRUITS ${f.fruitsId}${f.village ? ` · ${f.village}` : ""}`} />
          </button>
        ))}
        {searching && <div className="text-muted small"><Spinner animation="border" size="sm" className="me-1" />{t("Searching registered farmers…")}</div>}
        {!searching && list.length === 0 && <div className="text-muted small">{t("No farmer found. Register the farmer in Registration → Farmer Registration.")}</div>}
      </div>
      {/* keeps the form invalid until a farmer is chosen */}
      <Form.Control required value="" onChange={() => {}} style={{ display: "none" }} />
      {invalid && <div className="text-danger small mt-2">{t("Please select a farmer")}</div>}
    </div>
  );
}

// ─── Add / Edit Indent ────────────────────────────────────────────────────
export function IndentModal({ show, onHide, indent, farmerId }) {
  const { t } = useTranslation();
  const s = useFiStore();
  const [saving, setSaving] = useState(false);
  const init = indent
    ? { ...indent }
    : { farmerId: farmerId || "", sheetsOrdered: "", dflsOrdered: "", unitId: unitKey("DIRECT", s.grainageId), indentDate: todayIso(), status: "captured", farmerStatus: "Dis-infection" };
  const f = useForm(init, [show, indent, farmerId]);
  const assigned = indent?.status === "assigned";
  const save = async () => {
    setSaving(true);
    const ok = await fiActions.saveIndent(indent?.id, f.data);
    setSaving(false);
    if (ok) onHide();
  };
  const perSheet = f.data.sheetsOrdered && f.data.dflsOrdered ? Math.round(f.data.dflsOrdered / f.data.sheetsOrdered) : null;
  const direct = s.supplyUnits.filter((u) => u.type === "Direct");
  const crc = s.supplyUnits.filter((u) => u.type === "CRC");
  const pickFarmer = (farmer) => {
    if (farmer) fiActions.rememberFarmer(farmer);
    f.setData((d) => ({ ...d, farmerId: farmer ? farmer.id : "" }));
  };
  return (
    <FiModal show={show} onHide={onHide} title={indent ? `${t("Edit Indent")} · ${indent.indentNo}` : t("New Indent")} icon="file-docs"
      footer={<Footer onHide={onHide} formId="fi-indent-form" label={indent ? t("Update Indent") : t("Save Indent")} t={t} saving={saving} />}>
      <Modal.Body>
        <Form id="fi-indent-form" noValidate validated={f.validated} onSubmit={(e) => submitGuard(e, f.setValidated, save)}>
          <div className="fi-section-title">{t("Farmer")}</div>
          {assigned
            ? <div className="fi-infobox"><FarmerCell farmer={farmerById(s, f.data.farmerId)} sub={`FRUITS ${f.data.farmerId} · ${t("DFLs already assigned")}`} /></div>
            : <FarmerPicker farmers={s.farmers} selected={f.data.farmerId ? farmerById(s, f.data.farmerId) : null} onChange={pickFarmer} t={t} invalid={f.validated && !f.data.farmerId} />}
          <div className="fi-section-title">{t("Order details")}</div>
          <Row>
            <Field label={t("No of Sheets Ordered")} required md={4}>
              <Form.Control type="number" min="1" name="sheetsOrdered" value={f.data.sheetsOrdered ?? ""} onChange={f.set} required />
              <Form.Control.Feedback type="invalid">{t("Enter number of sheets")}</Form.Control.Feedback>
            </Field>
            <Field label={t("No of DFLs Ordered")} required md={4} hint={perSheet ? `≈ ${perSheet} ${t("DFLs per sheet")}` : null}>
              <Form.Control type="number" min="1" name="dflsOrdered" value={f.data.dflsOrdered ?? ""} onChange={f.set} required />
              <Form.Control.Feedback type="invalid">{t("Enter number of DFLs")}</Form.Control.Feedback>
            </Field>
            <Field label={t("Indent Date")} required md={4}>
              <Form.Control type="date" name="indentDate" value={f.data.indentDate} max={todayIso()} onChange={f.set} required />
            </Field>
            <Field label={t("Grainage")} required>
              <Form.Control value={s.grainage?.name || ""} disabled readOnly />
            </Field>
            <Field label={t("CRC / Direct")} required>
              <Form.Select name="unitId" value={f.data.unitId} onChange={f.set} required>
                <option value="">{t("Select")}</option>
                <optgroup label={t("Direct from grainage")}>{direct.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}</optgroup>
                <optgroup label="CRC">{crc.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}</optgroup>
              </Form.Select>
              <Form.Control.Feedback type="invalid">{t("Select CRC / Direct")}</Form.Control.Feedback>
            </Field>
            <Field label={t("Indent Status")} required>
              <Form.Select name="status" value={f.data.status} onChange={f.set} disabled={assigned}>
                {INDENT_STATUSES.filter((x) => x.key !== "assigned" || assigned).map((x) => <option key={x.key} value={x.key}>{x.label}</option>)}
              </Form.Select>
            </Field>
            <Field label={t("Farmer Current Status")} required>
              <Form.Select name="farmerStatus" value={f.data.farmerStatus} onChange={f.set}>
                {FARMER_STATUSES.map((x) => <option key={x}>{x}</option>)}
              </Form.Select>
            </Field>
          </Row>
        </Form>
      </Modal.Body>
    </FiModal>
  );
}

// ─── Farmer journey (timeline) ────────────────────────────────────────────
export function FarmerJourneyModal({ show, onHide, farmerId }) {
  const { t } = useTranslation();
  const s = useFiStore();
  const farmer = farmerById(s, farmerId);
  if (!farmer) return null;
  const recs = cropRecords(s).filter((r) => r.farmer.id === farmer.id);
  const indents = s.indents.filter((i) => i.farmerId === farmer.id);
  // indents (with their DFL issue) + DFLs issued without an indent, newest first
  const entries = [
    ...indents.map((ind) => ({ key: `i${ind.id}`, date: ind.indentDate, ind, r: recs.find((x) => x.indent.id === ind.id) })),
    ...recs.filter((r) => r.indent.direct).map((r) => ({ key: `a${r.a.id}`, date: r.a.assignDate, ind: null, r })),
  ].sort((a, b) => (a.date < b.date ? 1 : -1));
  const Dot = ({ color, icon }) => <span className="fi-tl-dot" style={{ background: color }}><Icon name={icon} /></span>;
  return (
    <FiModal show={show} onHide={onHide} title={t("Farmer Journey")} icon="user" size="lg">
      <Modal.Body>
        <div className="fi-infobox">
          <div style={{ gridColumn: "span 2" }}><FarmerCell farmer={farmer} sub={farmer.fatherName ? `${t("S/o")} ${farmer.fatherName}` : null} /></div>
          <div><small>FRUITS ID</small><b className="fi-mono">{farmer.fruitsId}</b></div>
          <div><small>{t("Village / TSC")}</small><b>{[farmer.village, farmer.tsc].filter(Boolean).join(" · ") || "–"}</b></div>
          <div><small>{t("Mulberry")}</small><b>{farmer.mulberryAcres != null ? `${farmer.mulberryAcres} ${t("acres")}` : "–"}</b></div>
        </div>
        {entries.length === 0 && <div className="text-muted">{t("No indents yet.")}</div>}
        {entries.map(({ key, ind, r }) => (
          <div key={key} className="mb-3 p-3" style={{ border: "1px solid #e3ebf5", borderRadius: 14, background: "#fff" }}>
            <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
              <b>{ind ? ind.indentNo : `${t("Direct sale")} · ${r.a.invoiceNo}`} <span className="text-muted fw-normal">· {s.grainage?.name}</span></b>
              {ind && (ind.cancelled ? <Pill color="red">{t("Cancelled")}</Pill> : <Pill color={INDENT_STATUS_COLOR[ind.status]}>{statusLabel(ind.status)}</Pill>)}
            </div>
            <div className="fi-timeline">
              {ind && <div className="fi-tl-item"><Dot color="#1e67a8" icon="file-docs" />
                <div className="fi-tl-title">{t("Indent")} – {ind.dflsOrdered} DFLs{ind.sheetsOrdered ? ` / ${ind.sheetsOrdered} ${t("sheets")}` : ""}</div>
                <div className="fi-tl-sub">{fmtDate(ind.indentDate)} · {unitName(ind)}</div></div>}
              {ind?.cancelled && <div className="fi-tl-item"><Dot color="#c43257" icon="cross" /><div className="fi-tl-title">{t("Cancelled")}</div><div className="fi-tl-sub">{fmtDate(ind.cancelled.date)} · {ind.cancelled.reason}</div></div>}
              {r && <div className="fi-tl-item"><Dot color="#0f766e" icon="package" />
                <div className="fi-tl-title">{t("DFLs assigned")} – {r.a.dflsAssigned} ({t("Lot")} {r.a.lotNumber})</div>
                <div className="fi-tl-sub">{fmtDate(r.a.assignDate)} · {t("Released")} {fmtDate(r.a.releaseDate)} · {t("Hatching")} {fmtDate(r.a.hatchingDate)}</div></div>}
              {r?.discarded && <div className="fi-tl-item"><Dot color="#6b7a8c" icon="trash" /><div className="fi-tl-title">{t("Discarded")}</div><div className="fi-tl-sub">{fmtDate(r.a.discarded.date)} · {r.a.discarded.reason}</div></div>}
              {r && !r.harvest && !r.failed && !r.closed && !r.discarded && <div className="fi-tl-item"><Dot color={r.stage.color} icon="layers" /><div className="fi-tl-title">{t("Current stage")}: {r.stage.label}</div><div className="fi-tl-sub">{t("Day")} {r.day} {t("from hatching")}</div></div>}
              {r?.inspections.map((i) => (
                <div className="fi-tl-item" key={i.id}><Dot color={i.failed ? "#c43257" : "#6d28d9"} icon={i.failed ? "alert-circle" : "clipboard"} />
                  <div className="fi-tl-title">{t("Inspection")} – <Pill color={CROP_STATUS_COLOR[i.cropStatus] || (i.failed ? "red" : "grey")}>{i.cropStatus || "–"}</Pill></div>
                  <div className="fi-tl-sub">{fmtDate(i.date)}{i.moult ? ` · ${i.moult}` : ""}{i.reason ? ` · ${i.reason}` : ""}</div></div>
              ))}
              {r?.fc && <div className="fi-tl-item"><Dot color={r.fc.fit ? "#15803d" : "#c43257"} icon="shield-check" />
                <div className="fi-tl-title">{t("Fitness certificate")} – {r.fc.fit ? t("Fit For Seed") : t("Not Fit For Seed")}</div>
                <div className="fi-tl-sub">{r.fc.diseaseStatus}{r.fc.expectedKg != null ? ` · ${t("expected")} ${r.fc.expectedKg} kg` : ""}</div></div>}
              {r?.harvest && (r.harvest.marketedOnly
                ? <div className="fi-tl-item"><Dot color="#b45309" icon="coins" /><div className="fi-tl-title">{t("Sold at seed cocoon market")}</div></div>
                : <div className="fi-tl-item"><Dot color="#b45309" icon="coins" />
                  <div className="fi-tl-title">{t("Harvested")} – {harvestTotals(r.harvest).totalKg} kg · ₹{Math.round(harvestTotals(r.harvest).amount).toLocaleString("en-IN")}</div>
                  <div className="fi-tl-sub">{fmtDate(r.harvest.marketDate)} · {r.harvest.market}</div></div>)}
              {r?.closed && !r.discarded && <div className="fi-tl-item"><Dot color="#94a3b8" icon="check" /><div className="fi-tl-title">{t("Closed – no harvest recorded")}</div></div>}
            </div>
          </div>
        ))}
      </Modal.Body>
    </FiModal>
  );
}
