import { useEffect, useState } from "react";
import { Button, Form, Modal, Row, Col, Spinner } from "react-bootstrap";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";
import { Icon } from "../../../components";
import api from "../../../services/auth/api";

// SR-013: reeler representatives / agents with a configurable maximum (REELER_MAX_REPRESENTATIVES in
// farmer-registration, default 3). The backend enforces the limit; this component mirrors it.
//
// Modes:
//  - reelerId + editable  (Edit page): every add / edit / remove is saved immediately through the API.
//  - no reelerId + editable (New / Transfer): rows are kept in `value` / `onChange`; the page calls
//    saveReelerRepresentatives(newReelerId, rows) after the reeler itself is saved.
//  - readOnly (View / Renew): loads and lists the reeler's representatives.

const baseURL = process.env.REACT_APP_API_BASE_URL_REGISTRATION;
const baseURLMaster = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const DEFAULT_MAX = 3;

export const ID_PROOF_TYPES = [
  { value: "AADHAAR", label: "Aadhaar" },
  { value: "VOTER_ID", label: "Voter ID" },
  { value: "DRIVING_LICENCE", label: "Driving Licence" },
  { value: "PAN", label: "PAN Card" },
  { value: "RATION_CARD", label: "Ration Card" },
  { value: "OTHER", label: "Other" },
];
const idProofLabel = (v) => ID_PROOF_TYPES.find((x) => x.value === v)?.label || v || "";
const isMasked = (n) => /^x{4}/i.test(n || "");
const maskAadhaar = (n) => {
  const d = (n || "").replace(/\D/g, "");
  return d ? "XXXXXXXX" + d.slice(-4) : "";
};

const styles = `
  .rr-wrap { border:1px solid #e3ebf5; border-radius:12px; padding:14px 16px; background:#fbfdff; }
  .rr-head { display:flex; align-items:center; justify-content:space-between; gap:10px; flex-wrap:wrap; margin-bottom:10px; }
  .rr-title { font-weight:700; color:#1f2d3d; font-size:.95rem; display:flex; align-items:center; gap:8px; }
  .rr-count { background:#eef6ff; color:#1e67a8; border-radius:999px; padding:3px 10px; font-size:.75rem; font-weight:700; }
  .rr-count.full { background:#fff4e5; color:#b26a00; }
  .rr-list { display:grid; grid-template-columns:repeat(auto-fill,minmax(260px,1fr)); gap:10px; }
  .rr-item { background:#fff; border:1px solid #e3ebf5; border-radius:10px; padding:10px 12px; position:relative; }
  .rr-item .nm { font-weight:700; color:#1e67a8; padding-right:62px; }
  .rr-item .ln { font-size:.8rem; color:#4a5568; margin-top:3px; display:flex; gap:6px; align-items:flex-start; word-break:break-word; }
  .rr-item .ln .icon { color:#8aa4c0; margin-top:2px; }
  .rr-actions { position:absolute; top:8px; right:8px; display:flex; gap:4px; }
  .rr-actions button { border:none; background:#f3f7fc; color:#1e67a8; width:28px; height:28px; border-radius:50%; display:flex; align-items:center; justify-content:center; }
  .rr-actions button.del { color:#c43257; background:#fdf0f3; }
  .rr-empty { text-align:center; color:#7a8899; font-size:.85rem; padding:14px; border:1px dashed #cbd5e1; border-radius:10px; background:#fff; }
  .rr-hint { color:#7a8899; font-size:.75rem; margin-top:8px; }
`;

const emptyRep = () => ({ name: "", mobileNumber: "", address: "", relationshipId: "", idProofType: "", idProofNumber: "" });

/** Saves locally collected rows for a newly created reeler. Returns the error messages (empty when all saved). */
export async function saveReelerRepresentatives(reelerId, rows) {
  const errors = [];
  for (const r of rows || []) {
    try {
      const res = await api.post(baseURL + "reeler-representative/add", toPayload(r, reelerId));
      const c = res.data?.content;
      if (c?.error) errors.push(`${r.name}: ${c.error_description}`);
    } catch (e) {
      const v = e?.response?.data?.validationErrors;
      errors.push(`${r.name}: ${v ? Object.values(v).join(", ") : "could not be saved"}`);
    }
  }
  return errors;
}

function toPayload(r, reelerId) {
  return {
    reelerRepresentativeId: r.reelerRepresentativeId || null,
    reelerId,
    name: (r.name || "").trim(),
    mobileNumber: (r.mobileNumber || "").trim(),
    address: (r.address || "").trim(),
    relationshipId: r.relationshipId ? Number(r.relationshipId) : null,
    idProofType: r.idProofType || null,
    idProofNumber: r.idProofType ? (r.idProofNumber || "").trim() : null,
  };
}

function validate(r, t) {
  const e = {};
  if (!r.name.trim()) e.name = t("Representative name is required");
  else if (!/^[\p{L}\p{M} .']+$/u.test(r.name.trim())) e.name = t("Name must contain only letters");
  if (!/^[6-9]\d{9}$/.test(r.mobileNumber.trim())) e.mobileNumber = t("Enter a valid 10-digit mobile number");
  if (!r.address.trim()) e.address = t("Address is required");
  if (r.idProofType) {
    const n = (r.idProofNumber || "").trim();
    if (!n) e.idProofNumber = t("Enter the ID proof number");
    else if (r.idProofType === "AADHAAR" && !isMasked(n) && !/^\d{12}$/.test(n.replace(/\s/g, ""))) e.idProofNumber = t("Enter a valid 12-digit Aadhaar number");
    else if (!/^[A-Za-z0-9/ -]+$/.test(n)) e.idProofNumber = t("Only letters and numbers allowed");
  }
  return e;
}

function ReelerRepresentatives({ reelerId, value, onChange, readOnly = false }) {
  const { t } = useTranslation();
  const remote = !!reelerId;
  const [max, setMax] = useState(DEFAULT_MAX);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [relationships, setRelationships] = useState([]);
  const [show, setShow] = useState(false);
  const [form, setForm] = useState(emptyRep());
  const [editIndex, setEditIndex] = useState(null);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const list = remote ? rows : value || [];
  const full = list.length >= max;
  const relName = (id) => relationships.find((x) => String(x.relationshipId) === String(id))?.relationshipName || "";

  useEffect(() => {
    api.get(baseURL + "reeler-representative/config")
      .then((res) => setMax(res.data?.content?.maxRepresentatives || DEFAULT_MAX))
      .catch(() => setMax(DEFAULT_MAX));
    if (!readOnly) {
      api.get(baseURLMaster + "relationship/get-all")
        .then((res) => setRelationships(res.data?.content?.relationship || []))
        .catch(() => setRelationships([]));
    }
  }, [readOnly]);

  const load = () => {
    if (!remote) return;
    setLoading(true);
    api.get(baseURL + `reeler-representative/get-by-reeler-id/${reelerId}`)
      .then((res) => {
        setRows(res.data?.content?.reelerRepresentative || []);
        if (res.data?.content?.maxRepresentatives) setMax(res.data.content.maxRepresentatives);
      })
      .catch(() => setRows([]))
      .finally(() => setLoading(false));
  };
  useEffect(load, [reelerId]); // eslint-disable-line react-hooks/exhaustive-deps

  const openAdd = () => {
    if (full) {
      Swal.fire({ icon: "info", title: t("Limit reached"), text: `${t("A reeler can have at most")} ${max} ${t("representatives")}` });
      return;
    }
    setForm(emptyRep()); setEditIndex(null); setErrors({}); setShow(true);
  };
  const openEdit = (i) => {
    const r = list[i];
    setForm({ ...emptyRep(), ...r, relationshipId: r.relationshipId || "", idProofType: r.idProofType || "", idProofNumber: r.idProofNumber || "" });
    setEditIndex(i); setErrors({}); setShow(true);
  };
  const set = (e) => {
    const { name, value: v } = e.target;
    setForm((f) => ({ ...f, [name]: v, ...(name === "idProofType" ? { idProofNumber: "" } : {}) }));
    setErrors((er) => ({ ...er, [name]: undefined }));
  };

  const submit = async (e) => {
    e.preventDefault();
    // The modal is portalled but React still bubbles submit to the reeler page's own <Form>: stop it there.
    e.stopPropagation();
    const er = validate(form, t);
    const mobile = form.mobileNumber.trim();
    if (!er.mobileNumber && list.some((x, i) => i !== editIndex && x.mobileNumber === mobile)) {
      er.mobileNumber = t("This mobile number is already added");
    }
    setErrors(er);
    if (Object.keys(er).length) return;

    if (!remote) {
      const row = {
        ...form,
        relationshipName: relName(form.relationshipId),
        // never keep a full Aadhaar in page state longer than needed: it is masked by the server on save
        idProofNumberDisplay: form.idProofType === "AADHAAR" ? maskAadhaar(form.idProofNumber) : form.idProofNumber,
      };
      const next = [...list];
      if (editIndex === null) next.push(row); else next[editIndex] = row;
      onChange && onChange(next);
      setShow(false);
      return;
    }

    setSaving(true);
    try {
      const path = editIndex === null ? "add" : "edit";
      const res = await api.post(baseURL + `reeler-representative/${path}`, toPayload(form, reelerId));
      const c = res.data?.content;
      if (c?.error) {
        Swal.fire({ icon: "warning", title: t("Not saved"), text: c.error_description });
        return;
      }
      setShow(false);
      load();
      Swal.fire({ icon: "success", title: editIndex === null ? t("Representative added") : t("Representative updated"), timer: 1500, showConfirmButton: false });
    } catch (err) {
      const v = err?.response?.data?.validationErrors;
      Swal.fire({ icon: "error", title: t("Not saved"), text: v ? Object.values(v).join("\n") : t("Something went wrong!") });
    } finally {
      setSaving(false);
    }
  };

  const remove = (i) => {
    const r = list[i];
    Swal.fire({
      icon: "warning",
      title: t("Remove representative?"),
      text: r.name,
      showCancelButton: true,
      confirmButtonText: t("Remove"),
      cancelButtonText: t("Cancel"),
    }).then(async (ans) => {
      if (!ans.isConfirmed) return;
      if (!remote) {
        onChange && onChange(list.filter((_, idx) => idx !== i));
        return;
      }
      try {
        const res = await api.delete(baseURL + `reeler-representative/delete/${r.reelerRepresentativeId}`);
        if (res.data?.content?.error) {
          Swal.fire({ icon: "warning", title: t("Not removed"), text: res.data.content.error_description });
          return;
        }
        load();
      } catch {
        Swal.fire({ icon: "error", title: t("Not removed"), text: t("Something went wrong!") });
      }
    });
  };

  return (
    <div className="rr-wrap">
      <style>{styles}</style>
      <div className="rr-head">
        <span className="rr-title">
          <Icon name="users" /> {t("Representatives / Agents")}
          <span className={`rr-count ${full ? "full" : ""}`}>{list.length} {t("of")} {max}</span>
        </span>
        {!readOnly && (
          <Button type="button" size="sm" variant="primary" onClick={openAdd} disabled={full}
            title={full ? `${t("Maximum")} ${max} ${t("representatives allowed")}` : ""}>
            <Icon name="plus" /> <span>{t("Add Representative")}</span>
          </Button>
        )}
      </div>

      {loading ? (
        <div className="rr-empty"><Spinner size="sm" /> {t("Loading...")}</div>
      ) : list.length === 0 ? (
        <div className="rr-empty">{readOnly ? t("No representatives added") : `${t("No representatives added yet. You can add up to")} ${max}.`}</div>
      ) : (
        <div className="rr-list">
          {list.map((r, i) => (
            <div className="rr-item" key={r.reelerRepresentativeId || `${r.mobileNumber}-${i}`}>
              <div className="nm">{r.name}</div>
              <div className="ln"><Icon name="mobile" /> {r.mobileNumber}</div>
              <div className="ln"><Icon name="map-pin" /> {r.address}</div>
              {(r.relationshipName || relName(r.relationshipId)) && (
                <div className="ln"><Icon name="user-list" /> {r.relationshipName || relName(r.relationshipId)}</div>
              )}
              {r.idProofType && (
                <div className="ln"><Icon name="cc-alt2" /> {idProofLabel(r.idProofType)}: {r.idProofNumberDisplay || r.idProofNumber}</div>
              )}
              {!readOnly && (
                <div className="rr-actions">
                  <button type="button" onClick={() => openEdit(i)} title={t("Edit")} aria-label={t("Edit")}><Icon name="edit" /></button>
                  <button type="button" className="del" onClick={() => remove(i)} title={t("Remove")} aria-label={t("Remove")}><Icon name="trash" /></button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      {!readOnly && !remote && list.length > 0 && (
        <div className="rr-hint">{t("Representatives will be saved together with the reeler.")}</div>
      )}

      <Modal show={show} onHide={() => !saving && setShow(false)} centered size="lg">
        <Form noValidate onSubmit={submit}>
          <Modal.Header closeButton>
            <Modal.Title>{editIndex === null ? t("Add Representative") : t("Edit Representative")}</Modal.Title>
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

export default ReelerRepresentatives;
