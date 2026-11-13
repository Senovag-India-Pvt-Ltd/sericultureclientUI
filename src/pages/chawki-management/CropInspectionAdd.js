import { useEffect, useState } from "react";
import { Card, Form, Row, Col, Button, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";
import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import { Icon } from "../../components";
import api from "../../services/auth/api";
import FarmerCropPicker, { pickerStyles } from "./FarmerCropPicker";

const baseURL = process.env.REACT_APP_API_BASE_URL_CHAWKI_MANAGEMENT;
const baseURLMasterData = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const swalClass = { popup: "sh-swal-popup", confirmButton: "sh-swal-confirm", cancelButton: "sh-swal-cancel" };
const today = () => new Date().toISOString().slice(0, 10);

const styles = `
  .sh-page-header { padding:12px 20px; background:linear-gradient(90deg,#1e67a8 0%,#2b7ac0 60%,#3b8dd6 100%); border-radius:12px; box-shadow:0 6px 18px rgba(30,103,168,.22); margin-bottom:8px; }
  .sh-page-title { margin-bottom:0; color:#fff !important; font-weight:700; }
  .sh-cta-btn { background:#fff !important; color:#1e67a8 !important; border:none !important; box-shadow:0 4px 12px rgba(12,40,68,.25); font-weight:700; }
  .sh-swal-popup { border-radius:14px !important; }
  .sh-swal-confirm { background:linear-gradient(90deg,#1e67a8 0%,#2b7ac0 60%,#3b8dd6 100%) !important; border-radius:8px !important; font-weight:600 !important; }
  .sh-swal-cancel { background:#fff !important; color:#c43257 !important; border:1px solid #e3496a !important; border-radius:8px !important; font-weight:600 !important; }
  ${pickerStyles}
  .cia-card { border:none !important; border-radius:18px !important; overflow:hidden; box-shadow:0 10px 30px rgba(13,79,138,.10) !important; margin-bottom:24px; }
  .cia-hero { background:radial-gradient(circle at 92% -30%, rgba(255,255,255,.22) 0, transparent 45%), linear-gradient(110deg,#0d4f8a 0%,#1e67a8 55%,#3b8dd6 100%); color:#fff; padding:18px 24px; display:flex; flex-wrap:wrap; gap:18px; align-items:center; justify-content:space-between; }
  .cia-hero h5 { color:#fff !important; margin:0; font-weight:700; font-size:1.1rem; display:flex; align-items:center; gap:8px; }
  .cia-hero p { margin:2px 0 0; color:rgba(255,255,255,.82); font-size:.8rem; }
  .cia-facts { display:flex; flex-wrap:wrap; gap:8px; }
  .cia-fact { background:rgba(255,255,255,.14); border:1px solid rgba(255,255,255,.28); border-radius:12px; padding:6px 12px; min-width:92px; }
  .cia-fact small { display:block; font-size:.66rem; text-transform:uppercase; letter-spacing:.4px; color:rgba(255,255,255,.75); font-weight:600; }
  .cia-fact b { font-size:.92rem; color:#fff; }
  .cia-body { padding:22px 24px 8px; background:#fff; }
  .cia-section { border:1px solid #e3ebf5; border-radius:14px; padding:16px 18px; margin-bottom:16px; background:#fbfdff; }
  .cia-step { display:flex; align-items:center; gap:10px; margin-bottom:14px; }
  .cia-step-no { width:26px; height:26px; border-radius:50%; background:#1e67a8; color:#fff; font-weight:800; font-size:.8rem; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
  .cia-step-no.done { background:#16a34a; }
  .cia-step h6 { margin:0; font-weight:700; color:#1f2d3d; font-size:.95rem; }
  .cia-step span.hint { color:#6b7a8c; font-size:.78rem; margin-left:auto; }
  .cia-label { font-weight:600; color:#3b4a5c; font-size:.82rem; margin-bottom:6px; display:block; }
  .cia-label .req { color:#e3496a; }
  .cia-input { border-radius:10px !important; border-color:#d0dff0 !important; font-size:.88rem !important; min-height:42px; }
  .cia-input:focus { border-color:#1e67a8 !important; box-shadow:0 0 0 3px rgba(30,103,168,.12) !important; }
  .cia-chips { display:flex; flex-wrap:wrap; gap:8px; }
  .cia-chip { border:1.5px solid #d0dff0; background:#fff; color:#3b4a5c; border-radius:999px; padding:7px 16px; font-weight:600; font-size:.82rem; transition:all .15s; }
  .cia-chip:hover { border-color:#9cc2e8; background:#f3f8fe; }
  .cia-chip.active { background:#1e67a8; border-color:#1e67a8; color:#fff; box-shadow:0 4px 10px rgba(30,103,168,.25); }
  .cia-chips.invalid .cia-chip { border-color:#f2a7b8; }
  .cia-status-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(210px,1fr)); gap:12px; }
  .cia-status-card { text-align:left; border:2px solid #e3ebf5; background:#fff; border-radius:14px; padding:14px 16px; display:flex; gap:12px; align-items:center; transition:all .15s; width:100%; }
  .cia-status-card:hover { transform:translateY(-1px); box-shadow:0 6px 16px rgba(13,79,138,.08); }
  .cia-status-card .ic { width:40px; height:40px; border-radius:12px; display:flex; align-items:center; justify-content:center; font-size:1.2rem; flex-shrink:0; }
  .cia-status-card b { display:block; color:#1f2d3d; font-size:.92rem; }
  .cia-status-card small { color:#6b7a8c; font-size:.74rem; }
  .cia-status-card .tick { margin-left:auto; width:22px; height:22px; border-radius:50%; border:2px solid #cbd5e1; display:flex; align-items:center; justify-content:center; color:#fff; font-size:.7rem; flex-shrink:0; }
  .cia-status-card.good .ic { background:#e7f7ee; color:#15803d; }
  .cia-status-card.bad .ic { background:#fdecef; color:#c43257; }
  .cia-status-card.neutral .ic { background:#eef5fc; color:#1e67a8; }
  .cia-status-card.good.active { border-color:#16a34a; background:#f3fcf6; }
  .cia-status-card.bad.active { border-color:#e3496a; background:#fff6f8; }
  .cia-status-card.neutral.active { border-color:#1e67a8; background:#f3f8fe; }
  .cia-status-card.good.active .tick { background:#16a34a; border-color:#16a34a; }
  .cia-status-card.bad.active .tick { background:#e3496a; border-color:#e3496a; }
  .cia-status-card.neutral.active .tick { background:#1e67a8; border-color:#1e67a8; }
  .cia-reason { margin-top:14px; padding:14px 16px; border-radius:12px; background:#fff6f8; border:1px dashed #f2a7b8; }
  .cia-drop { position:relative; border:2px dashed #c6d8ec; border-radius:12px; background:#f7fbff; padding:16px; text-align:center; transition:all .15s; cursor:pointer; min-height:110px; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:4px; }
  .cia-drop:hover, .cia-drop.over { border-color:#1e67a8; background:#eef6ff; }
  .cia-drop input { position:absolute; inset:0; opacity:0; cursor:pointer; }
  .cia-drop .big { font-size:1.6rem; color:#1e67a8; }
  .cia-drop b { color:#1f2d3d; font-size:.86rem; }
  .cia-drop small { color:#6b7a8c; font-size:.74rem; }
  .cia-file { display:flex; align-items:center; gap:10px; border:1px solid #cfe3d6; background:#f3fcf6; border-radius:12px; padding:10px 14px; min-height:110px; }
  .cia-file .nm { font-weight:600; color:#1f2d3d; font-size:.86rem; word-break:break-all; }
  .cia-file button { margin-left:auto; border:none; background:#fff1f3; color:#c43257; border-radius:8px; padding:4px 10px; font-weight:600; font-size:.78rem; }
  .cia-count { text-align:right; font-size:.72rem; color:#94a3b8; margin-top:4px; }
  .cia-footer { position:sticky; bottom:0; z-index:5; background:rgba(255,255,255,.96); backdrop-filter:blur(6px); border-top:1px solid #e3ebf5; padding:14px 24px; display:flex; flex-wrap:wrap; gap:12px; align-items:center; }
  .cia-progress { display:flex; align-items:center; gap:10px; color:#4a5568; font-size:.82rem; font-weight:600; }
  .cia-progress .bar { width:140px; height:8px; border-radius:99px; background:#e3ebf5; overflow:hidden; }
  .cia-progress .bar span { display:block; height:100%; background:linear-gradient(90deg,#1e67a8,#3b8dd6); transition:width .25s; }
  .cia-btn-cancel { border-radius:10px !important; border:1.5px solid #d0dff0 !important; background:#fff !important; color:#4a5568 !important; font-weight:600 !important; padding:9px 18px !important; }
  .cia-btn-save { border-radius:10px !important; border:none !important; background:linear-gradient(90deg,#1e67a8,#2b7ac0 60%,#3b8dd6) !important; font-weight:700 !important; padding:9px 22px !important; min-width:170px; box-shadow:0 6px 16px rgba(30,103,168,.28); display:inline-flex !important; align-items:center; justify-content:center; gap:6px; }
  .cia-btn-save:disabled { opacity:.65; }
  @media (max-width:576px) { .cia-hero, .cia-body, .cia-footer { padding-left:16px; padding-right:16px; } .cia-footer .ms-auto { width:100%; } .cia-footer .ms-auto .btn { flex:1; } }
`;
const statusTone = (name = "") => {
  const n = name.toLowerCase();
  if (/(free|good|healthy|normal|excellent)/.test(n)) return "good";
  if (/(diseas|fail|poor|bad|loss|damage)/.test(n)) return "bad";
  return "neutral";
};
const STATUS_ICON = { good: "✓", bad: "!", neutral: "•" };
const STATUS_HINT = { good: "Crop is healthy", bad: "Needs attention – add a reason", neutral: "" };
// "2026-11-13" or "13-11-2026" → Date
const parseDate = (s) => {
  if (!s) return null;
  const m = String(s).match(/^(\d{4})-(\d{2})-(\d{2})/) || String(s).match(/^(\d{2})[-/](\d{2})[-/](\d{4})/);
  if (!m) return null;
  const d = m[1].length === 4 ? new Date(+m[1], +m[2] - 1, +m[3]) : new Date(+m[3], +m[2] - 1, +m[1]);
  return Number.isNaN(d.getTime()) ? null : d;
};
const fmt = (s) => { const d = parseDate(s); return d ? d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : s || "–"; };
const NOTE_MAX = 500;
const emptyForm = () => ({ cropInspectionTypeId: "", date: today(), mountId: "", cropStatusId: "", reasonId: "", note: "" });

function CropInspectionAdd() {
  const { t } = useTranslation();
  const [farmer, setFarmer] = useState(null);
  const [crop, setCrop] = useState(null);
  const [data, setData] = useState(emptyForm());
  const [photo, setPhoto] = useState(null);
  const [validated, setValidated] = useState(false);
  const [saving, setSaving] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [masters, setMasters] = useState({ types: [], mounts: [], statuses: [], reasons: [] });

  useEffect(() => {
    const get = (path, key) => api.get(baseURLMasterData + path).then((r) => r.data.content?.[key] || []).catch(() => []);
    Promise.all([
      get("cropInspectionType/get-all", "cropInspectionType"),
      get("mount/get-all", "mount"),
      get("cropStatus/get-all", "cropStatus"),
      get("reason/get-all", "reason"),
    ]).then(([types, mounts, statuses, reasons]) => setMasters({ types, mounts, statuses, reasons }));
  }, []);

  const set = (e) => setData((d) => ({ ...d, [e.target.name]: e.target.value }));
  const onPhoto = (e) => {
    const f = e.target.files?.[0];
    if (f && f.size > 5 * 1024 * 1024) { Swal.fire({ icon: "warning", title: t("File too large"), text: t("Maximum 5 MB"), customClass: swalClass }); e.target.value = ""; return; }
    setPhoto(f || null);
  };

  const save = async (e) => {
    e.preventDefault();
    if (!crop) { Swal.fire({ icon: "info", title: t("Select a crop first"), customClass: swalClass }); return; }
    if (e.currentTarget.checkValidity() === false) { setValidated(true); return; }
    setSaving(true);
    try {
      const payload = {
        farmerId: farmer.farmerId,
        fruitsId: farmer.fruitsId,
        saleAndDisposalId: crop.saleAndDisposalId,
        cropInspectionTypeId: data.cropInspectionTypeId || null,
        date: data.date,
        mountId: data.mountId || null,
        cropStatusId: data.cropStatusId,
        reasonId: data.reasonId || null,
        note: data.note,
      };
      const res = await api.post(`${baseURL}cropInspection/add-crop-inspection-info`, payload);
      const r = res.data?.content ?? res.data;
      if (r?.error) {
        Swal.fire({ icon: "warning", title: t("Not saved"), text: r.message || r.error_description, customClass: swalClass });
        return;
      }
      if (photo && r?.cropInspectionId) {
        const fd = new FormData();
        fd.append("multipartFile", photo);
        fd.append("cropInspectionId", r.cropInspectionId);
        await api.post(`${baseURL}cropInspection/upload-crop-inspection`, fd, { headers: { "Content-Type": "multipart/form-data" } });
      }
      const st = masters.statuses.find((x) => String(x.cropStatusId) === String(data.cropStatusId));
      const mo = masters.mounts.find((x) => String(x.mountId) === String(data.mountId));
      Swal.fire({
        icon: "success", title: t("Crop inspection saved"), customClass: swalClass, confirmButtonText: t("Done"),
        html: `<div style="text-align:left;background:#f3f8fe;border:1px solid #d9e7f5;border-radius:12px;padding:12px 16px;font-size:.88rem;line-height:1.9">
          <div><span style="color:#6b7a8c">${t("Lot")}</span> <b style="float:right">${crop.lotNumberCrc || "–"} · ${crop.numbersOfDfls ?? "–"} DFLs</b></div>
          <div><span style="color:#6b7a8c">${t("Moult")}</span> <b style="float:right">${mo?.name || "–"}</b></div>
          <div><span style="color:#6b7a8c">${t("Crop Status")}</span> <b style="float:right">${st?.name || "–"}</b></div>
          <div><span style="color:#6b7a8c">${t("Date")}</span> <b style="float:right">${fmt(data.date)}</b></div></div>`,
      });
      setData(emptyForm()); setPhoto(null); setValidated(false); setReloadKey((k) => k + 1);
    } catch {
      Swal.fire({ icon: "error", title: t("Save attempt was not successful"), text: t("Something went wrong!"), customClass: swalClass });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Layout title={t("Crop Inspection")}>
      <style>{styles}</style>
      <Block.Head>
        <div className="sh-page-header">
          <Block.HeadBetween>
            <Block.HeadContent><Block.Title tag="h2" className="sh-page-title">{t("Crop Inspection")}</Block.Title></Block.HeadContent>
            <Block.HeadContent>
              <Link to="/seriui/crop-inspection-edit" className="btn btn-primary d-inline-flex sh-cta-btn"><Icon name="edit" /><span>{t("Crop Inspection Edit")}</span></Link>
            </Block.HeadContent>
          </Block.HeadBetween>
        </div>
      </Block.Head>

      <Block className="mt-n2">
        <FarmerCropPicker
          cropsPath="getInspectioninfoForFarmerFromSaleDisposalOfDFlsForNewApp"
          emptyText={t("No DFLs pending inspection for this farmer")}
          selected={crop} onSelect={setCrop} onFarmer={setFarmer} reloadKey={reloadKey}
        />

        {crop && (() => {
          const hatch = parseDate(crop.hatchingInspectionDate);
          const age = hatch ? Math.floor((parseDate(data.date || today()) - hatch) / 86400000) : null;
          const status = masters.statuses.find((x) => String(x.cropStatusId) === String(data.cropStatusId));
          const tone = status ? statusTone(status.name) : null;
          const filled = [data.date, data.mountId, data.cropStatusId].filter(Boolean).length;
          const farmerName = farmer ? [farmer.firstName, farmer.lastName].filter(Boolean).join(" ") : "";
          return (
            <Card className="cia-card">
              <div className="cia-hero">
                <div>
                  <h5>📋 {t("Inspection Details")}</h5>
                  <p>{t("Record what you saw on the farm today")}{farmerName ? ` · ${farmerName}` : ""}</p>
                </div>
                <div className="cia-facts">
                  <div className="cia-fact"><small>{t("Lot")}</small><b>{crop.lotNumberCrc || "–"}</b></div>
                  <div className="cia-fact"><small>DFLs</small><b>{crop.numbersOfDfls ?? "–"}</b></div>
                  <div className="cia-fact"><small>{t("Race")}</small><b>{crop.raceName || "–"}</b></div>
                  <div className="cia-fact"><small>{t("Hatching")}</small><b>{fmt(crop.hatchingInspectionDate)}</b></div>
                  {age !== null && <div className="cia-fact"><small>{t("Crop age")}</small><b>{age < 0 ? `${-age} ${t("days to hatch")}` : `${t("Day")} ${age}`}</b></div>}
                </div>
              </div>

              <Form noValidate validated={validated} onSubmit={save}>
                <div className="cia-body">
                  {/* 1 · When & stage */}
                  <div className="cia-section">
                    <div className="cia-step"><span className={`cia-step-no ${data.date && data.mountId ? "done" : ""}`}>{data.date && data.mountId ? "✓" : 1}</span><h6>{t("When & which stage")}</h6></div>
                    <Row className="g-3">
                      <Col md={4}>
                        <span className="cia-label">{t("Inspection Date")} <span className="req">*</span></span>
                        <Form.Control className="cia-input" type="date" name="date" value={data.date} max={today()} onChange={set} required />
                        <Form.Control.Feedback type="invalid">{t("Select a date (not in the future)")}</Form.Control.Feedback>
                      </Col>
                      <Col md={8}>
                        <span className="cia-label">{t("Inspection Type")} <span className="text-muted fw-normal">({t("optional")})</span></span>
                        {masters.types.length <= 6 ? (
                          <div className="cia-chips">
                            {masters.types.map((x) => (
                              <button type="button" key={x.cropInspectionTypeId} className={`cia-chip ${String(data.cropInspectionTypeId) === String(x.cropInspectionTypeId) ? "active" : ""}`}
                                onClick={() => setData((d) => ({ ...d, cropInspectionTypeId: String(d.cropInspectionTypeId) === String(x.cropInspectionTypeId) ? "" : x.cropInspectionTypeId }))}>{x.name}</button>
                            ))}
                            {!masters.types.length && <span className="text-muted small">{t("No inspection types in master")}</span>}
                          </div>
                        ) : (
                          <Form.Select className="cia-input" name="cropInspectionTypeId" value={data.cropInspectionTypeId} onChange={set}>
                            <option value="">{t("Select")}</option>
                            {masters.types.map((x) => <option key={x.cropInspectionTypeId} value={x.cropInspectionTypeId}>{x.name}</option>)}
                          </Form.Select>
                        )}
                      </Col>
                      <Col md={12}>
                        <span className="cia-label">{t("Moult / Stage")} <span className="req">*</span></span>
                        {masters.mounts.length <= 10 ? (
                          <div className={`cia-chips ${validated && !data.mountId ? "invalid" : ""}`}>
                            {masters.mounts.map((x) => (
                              <button type="button" key={x.mountId} className={`cia-chip ${String(data.mountId) === String(x.mountId) ? "active" : ""}`}
                                onClick={() => setData((d) => ({ ...d, mountId: x.mountId }))}>{x.name}</button>
                            ))}
                            {!masters.mounts.length && <span className="text-muted small">{t("No moults in master")}</span>}
                          </div>
                        ) : (
                          <Form.Select className="cia-input" name="mountId" value={data.mountId} onChange={set}>
                            <option value="">{t("Select")}</option>
                            {masters.mounts.map((x) => <option key={x.mountId} value={x.mountId}>{x.name}</option>)}
                          </Form.Select>
                        )}
                        {/* keeps the form invalid until a moult is chosen */}
                        <Form.Control required value={data.mountId} onChange={() => {}} style={{ display: "none" }} />
                        {validated && !data.mountId && <div className="text-danger small mt-1">{t("Moult is required")}</div>}
                      </Col>
                    </Row>
                  </div>

                  {/* 2 · Crop status */}
                  <div className="cia-section">
                    <div className="cia-step"><span className={`cia-step-no ${data.cropStatusId ? "done" : ""}`}>{data.cropStatusId ? "✓" : 2}</span><h6>{t("How is the crop?")} <span className="req" style={{ color: "#e3496a" }}>*</span></h6></div>
                    <div className="cia-status-grid">
                      {masters.statuses.map((x) => {
                        const tn = statusTone(x.name);
                        const active = String(data.cropStatusId) === String(x.cropStatusId);
                        return (
                          <button type="button" key={x.cropStatusId} className={`cia-status-card ${tn} ${active ? "active" : ""}`}
                            onClick={() => setData((d) => ({ ...d, cropStatusId: x.cropStatusId, reasonId: tn === "bad" ? d.reasonId : "" }))}>
                            <span className="ic">{STATUS_ICON[tn]}</span>
                            <span><b>{x.name}</b>{STATUS_HINT[tn] && <small>{t(STATUS_HINT[tn])}</small>}</span>
                            <span className="tick">{active ? "✓" : ""}</span>
                          </button>
                        );
                      })}
                      {!masters.statuses.length && <span className="text-muted small">{t("No crop status in master")}</span>}
                    </div>
                    <Form.Control required value={data.cropStatusId} onChange={() => {}} style={{ display: "none" }} />
                    {validated && !data.cropStatusId && <div className="text-danger small mt-2">{t("Select crop status")}</div>}

                    {tone === "bad" && (
                      <div className="cia-reason">
                        <span className="cia-label">{t("Reason")} <span className="text-muted fw-normal">({t("what is wrong with the crop?")})</span></span>
                        <Form.Select className="cia-input" name="reasonId" value={data.reasonId} onChange={set}>
                          <option value="">{t("Select reason")}</option>
                          {masters.reasons.map((x) => <option key={x.reasonId} value={x.reasonId}>{x.name}</option>)}
                        </Form.Select>
                      </div>
                    )}
                  </div>

                  {/* 3 · Evidence & notes */}
                  <div className="cia-section">
                    <div className="cia-step"><span className="cia-step-no">3</span><h6>{t("Photo & notes")}</h6><span className="hint">{t("optional")}</span></div>
                    <Row className="g-3">
                      <Col md={5}>
                        <span className="cia-label">{t("Crop Inspection Photo")}</span>
                        {photo ? (
                          <div className="cia-file">
                            <span style={{ fontSize: "1.6rem" }}>{/pdf$/i.test(photo.name) ? "📄" : "🖼️"}</span>
                            <div><div className="nm">{photo.name}</div><small className="text-muted">{(photo.size / 1024 / 1024).toFixed(2)} MB</small></div>
                            <button type="button" onClick={() => setPhoto(null)}>{t("Remove")}</button>
                          </div>
                        ) : (
                          <label className="cia-drop">
                            <input type="file" accept=".jpg,.jpeg,.png,.pdf" onChange={onPhoto} />
                            <span className="big">📷</span>
                            <b>{t("Click or drop a photo here")}</b>
                            <small>JPG / PNG / PDF · {t("max")} 5 MB</small>
                          </label>
                        )}
                      </Col>
                      <Col md={7}>
                        <span className="cia-label">{t("Note")}</span>
                        <Form.Control className="cia-input" as="textarea" rows={4} name="note" value={data.note} maxLength={NOTE_MAX} onChange={set}
                          placeholder={t("e.g. Larvae uniform, leaf quality good, rearing house clean")} />
                        <div className="cia-count">{(data.note || "").length}/{NOTE_MAX}</div>
                      </Col>
                    </Row>
                  </div>
                </div>

                <div className="cia-footer">
                  <div className="cia-progress">
                    <div className="bar"><span style={{ width: `${(filled / 3) * 100}%` }} /></div>
                    {filled}/3 {t("required done")}
                  </div>
                  <div className="ms-auto d-flex gap-2">
                    <Button className="cia-btn-cancel" onClick={() => { setData(emptyForm()); setPhoto(null); setValidated(false); setCrop(null); }}>{t("Cancel")}</Button>
                    <Button type="submit" className="cia-btn-save" disabled={saving}>
                      {saving ? <><Spinner size="sm" /> {t("Saving…")}</> : <><Icon name="save" /> {t("Save Inspection")}</>}
                    </Button>
                  </div>
                </div>
              </Form>
            </Card>
          );
        })()}
      </Block>
    </Layout>
  );
}

export default CropInspectionAdd;
