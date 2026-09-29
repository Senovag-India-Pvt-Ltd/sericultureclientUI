// Modal forms shared by the Farmer Indent screens.
import { useEffect, useMemo, useState } from "react";
import { Modal, Form, Row, Col, Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { Icon } from "../../components";
import {
  useFiStore, fiActions, farmerById, unitById, grainageById, statusLabel, fmtDate, todayIso, harvestTotals, cropRecords,
  GRAINAGES, SUPPLY_UNITS, INDENT_STATUSES, FARMER_STATUSES,
} from "./fiData";
import { FarmerCell, Pill, INDENT_STATUS_COLOR, CROP_STATUS_COLOR, fiToast } from "./fiUi";

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

const Footer = ({ onHide, formId, label, t }) => (
  <Modal.Footer>
    <Button className="fi-btn fi-btn-soft" onClick={onHide}>{t("Cancel")}</Button>
    <Button className="fi-btn fi-btn-primary" type="submit" form={formId}><Icon name="check" /> {label}</Button>
  </Modal.Footer>
);

// ─── Farmer picker (search by name / FRUITS ID / mobile) ─────────────────
function FarmerPicker({ farmers, value, onChange, t, invalid }) {
  const [q, setQ] = useState("");
  const list = useMemo(() => {
    const k = q.trim().toLowerCase();
    return farmers.filter((f) => !k || [f.name, f.fruitsId, f.mobile, f.farmerNumber].some((v) => v.toLowerCase().includes(k))).slice(0, 6);
  }, [q, farmers]);
  const selected = farmers.find((f) => f.id === Number(value));
  if (selected) {
    return (
      <div className="fi-infobox" style={{ alignItems: "center" }}>
        <FarmerCell farmer={selected} sub={`FRUITS ${selected.fruitsId} · ${selected.village}, ${selected.tsc}`} />
        <div className="text-end"><Button size="sm" className="fi-btn fi-btn-soft fi-btn-sm" onClick={() => onChange("")}>{t("Change")}</Button></div>
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
          <button type="button" key={f.id} className="fi-stat" style={{ padding: "8px 12px" }} onClick={() => onChange(f.id)}>
            <FarmerCell farmer={f} sub={`FRUITS ${f.fruitsId} · ${f.village}`} />
          </button>
        ))}
        {list.length === 0 && <div className="text-muted small">{t("No farmer found. Register the farmer in Registration → Farmer Registration.")}</div>}
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
  const init = indent
    ? { ...indent }
    : { farmerId: farmerId || "", sheetsOrdered: "", dflsOrdered: "", grainageId: s.grainageId, unitId: "", indentDate: todayIso(), status: "captured", farmerStatus: "Dis-infection" };
  const f = useForm(init, [show, indent, farmerId]);
  const save = () => {
    const d = { ...f.data, farmerId: Number(f.data.farmerId), sheetsOrdered: Number(f.data.sheetsOrdered), dflsOrdered: Number(f.data.dflsOrdered), unitId: Number(f.data.unitId), grainageId: Number(f.data.grainageId) };
    if (indent) fiActions.updateIndent(indent.id, d); else fiActions.addIndent(d);
    fiToast(indent ? t("Indent updated") : t("Indent saved"));
    onHide();
  };
  const perSheet = f.data.sheetsOrdered && f.data.dflsOrdered ? Math.round(f.data.dflsOrdered / f.data.sheetsOrdered) : null;
  return (
    <FiModal show={show} onHide={onHide} title={indent ? `${t("Edit Indent")} · ${indent.indentNo}` : t("New Indent")} icon="file-docs"
      footer={<Footer onHide={onHide} formId="fi-indent-form" label={indent ? t("Update Indent") : t("Save Indent")} t={t} />}>
      <Modal.Body>
        <Form id="fi-indent-form" noValidate validated={f.validated} onSubmit={(e) => submitGuard(e, f.setValidated, save)}>
          <div className="fi-section-title">{t("Farmer")}</div>
          <FarmerPicker farmers={s.farmers} value={f.data.farmerId} onChange={(id) => f.setData((d) => ({ ...d, farmerId: id }))} t={t} invalid={f.validated && !f.data.farmerId} />
          <div className="fi-section-title">{t("Order details")}</div>
          <Row>
            <Field label={t("No of Sheets Ordered")} required md={4}>
              <Form.Control type="number" min="1" name="sheetsOrdered" value={f.data.sheetsOrdered} onChange={f.set} required />
              <Form.Control.Feedback type="invalid">{t("Enter number of sheets")}</Form.Control.Feedback>
            </Field>
            <Field label={t("No of DFLs Ordered")} required md={4} hint={perSheet ? `≈ ${perSheet} ${t("DFLs per sheet")}` : null}>
              <Form.Control type="number" min="1" name="dflsOrdered" value={f.data.dflsOrdered} onChange={f.set} required />
              <Form.Control.Feedback type="invalid">{t("Enter number of DFLs")}</Form.Control.Feedback>
            </Field>
            <Field label={t("Indent Date")} required md={4}>
              <Form.Control type="date" name="indentDate" value={f.data.indentDate} max={todayIso()} onChange={f.set} required />
            </Field>
            <Field label={t("Grainage")} required>
              <Form.Select name="grainageId" value={f.data.grainageId} onChange={f.set} required>
                {GRAINAGES.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
              </Form.Select>
            </Field>
            <Field label={t("CRC / Direct")} required>
              <Form.Select name="unitId" value={f.data.unitId} onChange={f.set} required>
                <option value="">{t("Select")}</option>
                <optgroup label={t("Direct from grainage")}>{SUPPLY_UNITS.filter((u) => u.type === "Direct").map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}</optgroup>
                <optgroup label="CRC">{SUPPLY_UNITS.filter((u) => u.type === "CRC").map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}</optgroup>
              </Form.Select>
              <Form.Control.Feedback type="invalid">{t("Select CRC / Direct")}</Form.Control.Feedback>
            </Field>
            <Field label={t("Indent Status")} required>
              <Form.Select name="status" value={f.data.status} onChange={f.set} disabled={f.data.status === "assigned"}>
                {INDENT_STATUSES.filter((x) => x.key !== "assigned" || f.data.status === "assigned").map((x) => <option key={x.key} value={x.key}>{x.label}</option>)}
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
  const recs = cropRecords(s);
  const indents = s.indents.filter((i) => i.farmerId === farmer.id).sort((a, b) => (a.indentDate < b.indentDate ? 1 : -1));
  const Dot = ({ color, icon }) => <span className="fi-tl-dot" style={{ background: color }}><Icon name={icon} /></span>;
  return (
    <FiModal show={show} onHide={onHide} title={t("Farmer Journey")} icon="user" size="lg">
      <Modal.Body>
        <div className="fi-infobox">
          <div style={{ gridColumn: "span 2" }}><FarmerCell farmer={farmer} sub={`${t("S/o")} ${farmer.fatherName}`} /></div>
          <div><small>FRUITS ID</small><b className="fi-mono">{farmer.fruitsId}</b></div>
          <div><small>{t("Village / TSC")}</small><b>{farmer.village} · {farmer.tsc}</b></div>
          <div><small>{t("Mulberry")}</small><b>{farmer.mulberryAcres} {t("acres")}</b></div>
        </div>
        {indents.length === 0 && <div className="text-muted">{t("No indents yet.")}</div>}
        {indents.map((ind) => {
          const r = recs.find((x) => x.indent.id === ind.id);
          return (
            <div key={ind.id} className="mb-3 p-3" style={{ border: "1px solid #e3ebf5", borderRadius: 14, background: "#fff" }}>
              <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
                <b>{ind.indentNo} <span className="text-muted fw-normal">· {grainageById(ind.grainageId)?.name}</span></b>
                {ind.cancelled ? <Pill color="red">{t("Cancelled")}</Pill> : <Pill color={INDENT_STATUS_COLOR[ind.status]}>{statusLabel(ind.status)}</Pill>}
              </div>
              <div className="fi-timeline">
                <div className="fi-tl-item"><Dot color="#1e67a8" icon="file-docs" />
                  <div className="fi-tl-title">{t("Indent")} – {ind.dflsOrdered} DFLs / {ind.sheetsOrdered} {t("sheets")}</div>
                  <div className="fi-tl-sub">{fmtDate(ind.indentDate)} · {unitById(ind.unitId)?.name}</div></div>
                {ind.cancelled && <div className="fi-tl-item"><Dot color="#c43257" icon="cross" /><div className="fi-tl-title">{t("Cancelled")}</div><div className="fi-tl-sub">{fmtDate(ind.cancelled.date)} · {ind.cancelled.reason}</div></div>}
                {r && <div className="fi-tl-item"><Dot color="#0f766e" icon="package" />
                  <div className="fi-tl-title">{t("DFLs assigned")} – {r.a.dflsAssigned} ({t("Lot")} {r.a.lotNumber})</div>
                  <div className="fi-tl-sub">{t("Released")} {fmtDate(r.a.releaseDate)} · {t("Hatching")} {fmtDate(r.a.hatchingDate)}</div></div>}
                {r && !r.harvest && !r.failed && <div className="fi-tl-item"><Dot color={r.stage.color} icon="layers" /><div className="fi-tl-title">{t("Current stage")}: {r.stage.label}</div><div className="fi-tl-sub">{t("Day")} {r.day} {t("from hatching")}</div></div>}
                {r?.inspections.map((i) => (
                  <div className="fi-tl-item" key={i.id}><Dot color={i.cropStatus === "Failed" ? "#c43257" : "#6d28d9"} icon={i.cropStatus === "Failed" ? "alert-circle" : "clipboard"} />
                    <div className="fi-tl-title">{t("Inspection")} – <Pill color={CROP_STATUS_COLOR[i.cropStatus]}>{i.cropStatus}</Pill></div>
                    <div className="fi-tl-sub">{fmtDate(i.date)} · {i.moult}{i.reason ? ` · ${i.reason}` : ""}</div></div>
                ))}
                {r?.fc && <div className="fi-tl-item"><Dot color={r.fc.fit ? "#15803d" : "#c43257"} icon="shield-check" />
                  <div className="fi-tl-title">{t("Fitness certificate")} – {r.fc.fit ? t("Fit For Seed") : t("Not Fit For Seed")}</div>
                  <div className="fi-tl-sub">{r.fc.diseaseStatus} · {t("expected")} {r.fc.expectedKg} kg</div></div>}
                {r?.harvest && <div className="fi-tl-item"><Dot color="#b45309" icon="coins" />
                  <div className="fi-tl-title">{t("Harvested")} – {harvestTotals(r.harvest).totalKg} kg · ₹{Math.round(harvestTotals(r.harvest).amount).toLocaleString("en-IN")}</div>
                  <div className="fi-tl-sub">{fmtDate(r.harvest.marketDate)} · {r.harvest.market}</div></div>}
              </div>
            </div>
          );
        })}
      </Modal.Body>
    </FiModal>
  );
}
