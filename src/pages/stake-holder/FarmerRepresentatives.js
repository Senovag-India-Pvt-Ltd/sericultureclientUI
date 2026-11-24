import { useEffect, useState } from "react";
import { Button, Form, Modal, Row, Col, Spinner } from "react-bootstrap";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";
import { Icon } from "../../components";
import api from "../../services/auth/api";
import { ID_PROOF_TYPES } from "./reeler-license/ReelerRepresentatives";

// SR-005: authorised agents / representatives of a farmer (people allowed to bring and sell the farmer's cocoons at
// the market). Max per farmer = FARMER_MAX_REPRESENTATIVES in farmer-registration (default 3), enforced by the backend.
// Each agent is authorised from a date up to an optional end date; only agents valid on the auction day can be chosen
// at e-Inward. Backend: farmer-registration /v1/farmer-representative/*
//
// Modes: farmerId (Edit page / Farmer Agents screen) saves every add / edit / remove immediately;
//        readOnly (View page) only lists.

const baseURL = process.env.REACT_APP_API_BASE_URL_REGISTRATION;
const baseURLMaster = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const DEFAULT_MAX = 3;
const swalClass = { popup: "fr-swal-popup", confirmButton: "fr-swal-confirm", cancelButton: "fr-swal-cancel" };
const swal = (o) => Swal.fire({ buttonsStyling: false, customClass: swalClass, ...o });

const idProofLabel = (v) => ID_PROOF_TYPES.find((x) => x.value === v)?.label || v || "";
const isMasked = (n) => /^x{4}/i.test(n || "");
const todayIso = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};
export const dmy = (iso) => {
  if (!iso) return "";
  const [y, m, d] = String(iso).substring(0, 10).split("-");
  return d && m && y ? `${d}-${m}-${y}` : iso;
};

const styles = `
  .fr-wrap { border:1px solid #e3ebf5; border-radius:12px; padding:14px 16px; background:#fbfdff; }
  .fr-head { display:flex; align-items:center; justify-content:space-between; gap:10px; flex-wrap:wrap; margin-bottom:10px; }
  .fr-title { font-weight:700; color:#1f2d3d; font-size:.95rem; display:flex; align-items:center; gap:8px; }
  .fr-count { background:#eef6ff; color:#1e67a8; border-radius:999px; padding:3px 10px; font-size:.75rem; font-weight:700; }
  .fr-count.full { background:#fff4e5; color:#b26a00; }
  .fr-list { display:grid; grid-template-columns:repeat(auto-fill,minmax(270px,1fr)); gap:10px; }
  .fr-item { background:#fff; border:1px solid #e3ebf5; border-radius:10px; padding:10px 12px; position:relative; }
  .fr-item .nm { font-weight:700; color:#1e67a8; padding-right:62px; }
  .fr-item .ln { font-size:.8rem; color:#4a5568; margin-top:3px; display:flex; gap:6px; align-items:flex-start; word-break:break-word; }
  .fr-item .ln .icon { color:#8aa4c0; margin-top:2px; }
  .fr-valid { display:inline-flex; align-items:center; gap:5px; border-radius:999px; padding:2px 9px; font-size:.7rem; font-weight:700; margin-top:6px; }
  .fr-valid:before { content:""; width:6px; height:6px; border-radius:50%; background:currentColor; }
  .fr-valid.ok { background:#e7f7ee; color:#18794e; }
  .fr-valid.no { background:#fdecf0; color:#c43257; }
  .fr-actions { position:absolute; top:8px; right:8px; display:flex; gap:4px; }
  .fr-actions button { border:none; background:#f3f7fc; color:#1e67a8; width:28px; height:28px; border-radius:50%; display:flex; align-items:center; justify-content:center; }
  .fr-actions button.del { color:#c43257; background:#fdf0f3; }
  .fr-empty { text-align:center; color:#7a8899; font-size:.85rem; padding:14px; border:1px dashed #cbd5e1; border-radius:10px; background:#fff; }
  .fr-modal .modal-content { border:none; border-radius:16px; overflow:hidden; }
  .fr-modal .modal-header { background:linear-gradient(90deg,#174f86,#3b8dd6); border:none; }
  .fr-modal .modal-title { color:#fff; font-weight:800; font-size:1rem; }
  .fr-modal .btn-close { filter:invert(1) grayscale(1) brightness(2); }
  .fr-swal-popup { border-radius:16px !important; }
  .fr-swal-confirm { background:linear-gradient(90deg,#1e67a8,#3b8dd6); color:#fff; border:none; border-radius:10px; padding:9px 24px; font-weight:700; margin:0 6px; }
  .fr-swal-cancel { background:#fff; color:#4a5568; border:1px solid #d5dfeb; border-radius:10px; padding:9px 22px; font-weight:700; margin:0 6px; }
`;

const emptyAgent = () => ({
  name: "", mobileNumber: "", address: "", relationshipId: "", idProofType: "", idProofNumber: "",
  authorisedFrom: todayIso(), authorisedTo: "",
});

function toPayload(r, farmerId) {
  return {
    farmerRepresentativeId: r.farmerRepresentativeId || null,
    farmerId: Number(farmerId),
    name: (r.name || "").trim(),
    mobileNumber: (r.mobileNumber || "").trim(),
    address: (r.address || "").trim(),
    relationshipId: r.relationshipId ? Number(r.relationshipId) : null,
    idProofType: r.idProofType || null,
    idProofNumber: r.idProofType ? (r.idProofNumber || "").trim() : null,
    authorisedFrom: r.authorisedFrom || null,
    authorisedTo: r.authorisedTo || null,
  };
}

function validate(r, t) {
  const e = {};
  if (!r.name.trim()) e.name = t("Agent name is required");
  else if (!/^[\p{L}\p{M} .']+$/u.test(r.name.trim())) e.name = t("Name must contain only letters");
  if (!/^[6-9]\d{9}$/.test(r.mobileNumber.trim())) e.mobileNumber = t("Enter a valid 10-digit mobile number");
  if (!r.address.trim()) e.address = t("Address is required");
  if (!r.authorisedFrom) e.authorisedFrom = t("Authorised from date is required");
  if (r.authorisedFrom && r.authorisedTo && r.authorisedTo < r.authorisedFrom) e.authorisedTo = t("Must be on or after the from date");
  if (r.idProofType) {
    const n = (r.idProofNumber || "").trim();
    if (!n) e.idProofNumber = t("Enter the ID proof number");
    else if (r.idProofType === "AADHAAR" && !isMasked(n) && !/^\d{12}$/.test(n.replace(/\s/g, ""))) e.idProofNumber = t("Enter a valid 12-digit Aadhaar number");
    else if (!/^[A-Za-z0-9/ -]+$/.test(n)) e.idProofNumber = t("Only letters and numbers allowed");
  }
  return e;
}

function FarmerRepresentatives({ farmerId, readOnly = false, onChanged }) {
  const { t } = useTranslation();
  const [max, setMax] = useState(DEFAULT_MAX);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [relationships, setRelationships] = useState([]);
  const [show, setShow] = useState(false);
  const [form, setForm] = useState(emptyAgent());
  const [editIndex, setEditIndex] = useState(null);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const full = rows.length >= max;

  useEffect(() => {
    if (!readOnly) {
      api.get(baseURLMaster + "relationship/get-all")
        .then((res) => setRelationships(res.data?.content?.relationship || []))
        .catch(() => setRelationships([]));
    }
  }, [readOnly]);

  const load = () => {
    if (!farmerId) { setRows([]); return; }
    setLoading(true);
    api.get(baseURL + `farmer-representative/get-by-farmer-id/${farmerId}`)
      .then((res) => {
        setRows(res.data?.content?.farmerRepresentative || []);
        if (res.data?.content?.maxRepresentatives) setMax(res.data.content.maxRepresentatives);
      })
      .catch(() => setRows([]))
      .finally(() => setLoading(false));
  };
  useEffect(load, [farmerId]); // eslint-disable-line react-hooks/exhaustive-deps

  const openAdd = () => {
    if (full) {
      swal({ icon: "info", title: t("Limit reached"), text: `${t("A farmer can have at most")} ${max} ${t("agents")}` });
      return;
    }
    setForm(emptyAgent()); setEditIndex(null); setErrors({}); setShow(true);
  };
  const openEdit = (i) => {
    const r = rows[i];
    setForm({
      ...emptyAgent(), ...r,
      relationshipId: r.relationshipId || "", idProofType: r.idProofType || "", idProofNumber: r.idProofNumber || "",
      authorisedFrom: r.authorisedFrom || todayIso(), authorisedTo: r.authorisedTo || "",
    });
    setEditIndex(i); setErrors({}); setShow(true);
  };
  const set = (e) => {
    const { name, value: v } = e.target;
    setForm((f) => ({ ...f, [name]: v, ...(name === "idProofType" ? { idProofNumber: "" } : {}) }));
    setErrors((er) => ({ ...er, [name]: undefined }));
  };

  const submit = async (e) => {
    e.preventDefault();
    // The modal is portalled but React still bubbles submit to the host page's own <Form>: stop it here.
    e.stopPropagation();
    const er = validate(form, t);
    const mobile = form.mobileNumber.trim();
    if (!er.mobileNumber && rows.some((x, i) => i !== editIndex && x.mobileNumber === mobile)) {
      er.mobileNumber = t("This mobile number is already added");
    }
    setErrors(er);
    if (Object.keys(er).length) return;

    setSaving(true);
    try {
      const path = editIndex === null ? "add" : "edit";
      const res = await api.post(baseURL + `farmer-representative/${path}`, toPayload(form, farmerId));
      const c = res.data?.content;
      if (c?.error) {
        swal({ icon: "warning", title: t("Not saved"), text: c.error_description });
        return;
      }
      setShow(false);
      load();
      onChanged && onChanged();
      swal({ icon: "success", title: editIndex === null ? t("Agent added") : t("Agent updated"), timer: 1500, showConfirmButton: false });
    } catch (err) {
      const v = err?.response?.data?.validationErrors;
      swal({ icon: "error", title: t("Not saved"), text: v ? Object.values(v).join("\n") : t("Something went wrong!") });
    } finally {
      setSaving(false);
    }
  };

  const remove = (i) => {
    const r = rows[i];
    swal({
      icon: "warning",
      title: t("Remove agent?"),
      text: `${r.name} - ${t("past transactions done by this agent stay traceable.")}`,
      showCancelButton: true,
      confirmButtonText: t("Remove"),
      cancelButtonText: t("Cancel"),
    }).then(async (ans) => {
      if (!ans.isConfirmed) return;
      try {
        const res = await api.delete(baseURL + `farmer-representative/delete/${r.farmerRepresentativeId}`);
        if (res.data?.content?.error) {
          swal({ icon: "warning", title: t("Not removed"), text: res.data.content.error_description });
          return;
        }
        load();
        onChanged && onChanged();
      } catch {
        swal({ icon: "error", title: t("Not removed"), text: t("Something went wrong!") });
      }
    });
  };

  return (
    <div className="fr-wrap">
      <style>{styles}</style>
      <div className="fr-head">
        <span className="fr-title">
          <Icon name="users" /> {t("Authorised Agents / Representatives")}
          <span className={`fr-count ${full ? "full" : ""}`}>{rows.length} {t("of")} {max}</span>
        </span>
        {!readOnly && (
          <Button type="button" size="sm" variant="primary" onClick={openAdd} disabled={full || !farmerId}
            title={full ? `${t("Maximum")} ${max} ${t("agents allowed")}` : ""}>
            <Icon name="plus" /> <span>{t("Add Agent")}</span>
          </Button>
        )}
      </div>

      {loading ? (
        <div className="fr-empty"><Spinner size="sm" /> {t("Loading...")}</div>
      ) : rows.length === 0 ? (
        <div className="fr-empty">{readOnly ? t("No agents added") : `${t("No agents added yet. You can add up to")} ${max}.`}</div>
      ) : (
        <div className="fr-list">
          {rows.map((r, i) => (
            <div className="fr-item" key={r.farmerRepresentativeId || `${r.mobileNumber}-${i}`}>
              <div className="nm">{r.name}</div>
              <div className="ln"><Icon name="mobile" /> {r.mobileNumber}</div>
              <div className="ln"><Icon name="map-pin" /> {r.address}</div>
              {r.relationshipName && <div className="ln"><Icon name="user-list" /> {r.relationshipName}</div>}
              {r.idProofType && <div className="ln"><Icon name="cc-alt2" /> {idProofLabel(r.idProofType)}: {r.idProofNumber}</div>}
              <div className="ln"><Icon name="calendar" /> {dmy(r.authorisedFrom)} {t("to")} {r.authorisedTo ? dmy(r.authorisedTo) : t("no end date")}</div>
              <span className={`fr-valid ${r.authorisedToday ? "ok" : "no"}`}>{r.authorisedToday ? t("Authorised today") : t("Not authorised today")}</span>
              {!readOnly && (
                <div className="fr-actions">
                  <button type="button" onClick={() => openEdit(i)} title={t("Edit")} aria-label={t("Edit")}><Icon name="edit" /></button>
                  <button type="button" className="del" onClick={() => remove(i)} title={t("Remove")} aria-label={t("Remove")}><Icon name="trash" /></button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <Modal show={show} onHide={() => !saving && setShow(false)} centered size="lg" className="fr-modal">
        <Form noValidate onSubmit={submit}>
          <Modal.Header closeButton>
            <Modal.Title>{editIndex === null ? t("Add Authorised Agent") : t("Edit Authorised Agent")}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Row className="g-3">
              <Col md={6}>
                <Form.Label>{t("Name")} <span className="text-danger">*</span></Form.Label>
                <Form.Control name="name" value={form.name} onChange={set} maxLength={150} isInvalid={!!errors.name} placeholder={t("Enter Name")} />
                <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
              </Col>
              <Col md={6}>
                <Form.Label>{t("Mobile Number")} <span className="text-danger">*</span></Form.Label>
                <Form.Control name="mobileNumber" value={form.mobileNumber} onChange={set} maxLength={10} inputMode="numeric" isInvalid={!!errors.mobileNumber} placeholder="9876543210" />
                <Form.Control.Feedback type="invalid">{errors.mobileNumber}</Form.Control.Feedback>
              </Col>
              <Col md={12}>
                <Form.Label>{t("Address")} <span className="text-danger">*</span></Form.Label>
                <Form.Control as="textarea" rows={2} name="address" value={form.address} onChange={set} maxLength={500} isInvalid={!!errors.address} placeholder={t("Enter Address")} />
                <Form.Control.Feedback type="invalid">{errors.address}</Form.Control.Feedback>
              </Col>
              <Col md={4}>
                <Form.Label>{t("Relationship")}</Form.Label>
                <Form.Select name="relationshipId" value={form.relationshipId} onChange={set}>
                  <option value="">{t("Select")}</option>
                  {relationships.map((x) => <option key={x.relationshipId} value={x.relationshipId}>{x.relationshipName}</option>)}
                </Form.Select>
              </Col>
              <Col md={4}>
                <Form.Label>{t("ID Proof Type")}</Form.Label>
                <Form.Select name="idProofType" value={form.idProofType} onChange={set}>
                  <option value="">{t("Select")}</option>
                  {ID_PROOF_TYPES.map((x) => <option key={x.value} value={x.value}>{t(x.label)}</option>)}
                </Form.Select>
              </Col>
              <Col md={4}>
                <Form.Label>{t("ID Proof Number")}{form.idProofType && <span className="text-danger"> *</span>}</Form.Label>
                <Form.Control name="idProofNumber" value={form.idProofNumber} onChange={set} maxLength={form.idProofType === "AADHAAR" ? 14 : 30}
                  disabled={!form.idProofType} isInvalid={!!errors.idProofNumber}
                  placeholder={form.idProofType === "AADHAAR" ? "12-digit Aadhaar" : ""} />
                <Form.Control.Feedback type="invalid">{errors.idProofNumber}</Form.Control.Feedback>
                {form.idProofType === "AADHAAR" && <Form.Text muted>{t("Only the last 4 digits are stored.")}</Form.Text>}
              </Col>
              <Col md={6}>
                <Form.Label>{t("Authorised from")} <span className="text-danger">*</span></Form.Label>
                <Form.Control type="date" name="authorisedFrom" value={form.authorisedFrom} onChange={set} isInvalid={!!errors.authorisedFrom} />
                <Form.Control.Feedback type="invalid">{errors.authorisedFrom}</Form.Control.Feedback>
              </Col>
              <Col md={6}>
                <Form.Label>{t("Authorised till")}</Form.Label>
                <Form.Control type="date" name="authorisedTo" value={form.authorisedTo} onChange={set} min={form.authorisedFrom || undefined} isInvalid={!!errors.authorisedTo} />
                <Form.Control.Feedback type="invalid">{errors.authorisedTo}</Form.Control.Feedback>
                <Form.Text muted>{t("Leave empty for no end date.")}</Form.Text>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="light" onClick={() => setShow(false)} disabled={saving}>{t("Cancel")}</Button>
            <Button type="submit" variant="primary" disabled={saving}>
              {saving ? <Spinner size="sm" /> : <><Icon name="save" /> <span>{editIndex === null ? t("Add") : t("Update")}</span></>}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
}

export default FarmerRepresentatives;
