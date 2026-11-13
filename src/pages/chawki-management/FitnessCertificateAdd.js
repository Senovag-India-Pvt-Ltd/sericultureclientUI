import { useEffect, useState } from "react";
import { Card, Form, Row, Col, Button, Spinner, InputGroup } from "react-bootstrap";
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

const styles = `
  .sh-page-header { padding:12px 20px; background:linear-gradient(90deg,#1e67a8 0%,#2b7ac0 60%,#3b8dd6 100%); border-radius:12px; box-shadow:0 6px 18px rgba(30,103,168,.22); margin-bottom:8px; }
  .sh-page-title { margin-bottom:0; color:#fff !important; font-weight:700; }
  .sh-cta-btn { background:#fff !important; color:#1e67a8 !important; border:none !important; box-shadow:0 4px 12px rgba(12,40,68,.25); font-weight:700; }
  .sh-swal-popup { border-radius:14px !important; }
  .sh-swal-confirm { background:linear-gradient(90deg,#1e67a8 0%,#2b7ac0 60%,#3b8dd6 100%) !important; border-radius:8px !important; font-weight:600 !important; }
  .sh-swal-cancel { background:#fff !important; color:#c43257 !important; border:1px solid #e3496a !important; border-radius:8px !important; font-weight:600 !important; }
  ${pickerStyles}

  /* ---- Certificate form ---- */
  .fc-card > .card-header { display:flex; align-items:center; justify-content:space-between; gap:12px; flex-wrap:wrap; }
  .fc-head-title { display:flex; align-items:center; gap:10px; font-size:1rem; }
  .fc-head-title .icon { font-size:1.35rem; background:rgba(255,255,255,.16); width:34px; height:34px; border-radius:10px; display:inline-flex; align-items:center; justify-content:center; }
  .fc-head-chips { display:flex; gap:8px; flex-wrap:wrap; }
  .fc-chip { background:rgba(255,255,255,.16); border:1px solid rgba(255,255,255,.28); color:#fff; border-radius:999px; padding:4px 12px; font-size:.78rem; font-weight:600; display:inline-flex; align-items:center; gap:6px; }
  .fc-body { padding:22px 24px 8px; background:#fbfdff; }
  .fc-section { background:#fff; border:1px solid #e6eef7; border-radius:14px; padding:18px 18px 16px; margin-bottom:16px; transition:box-shadow .15s; }
  .fc-section:focus-within { box-shadow:0 0 0 3px rgba(30,103,168,.08); border-color:#c9dcf0; }
  .fc-section-head { display:flex; align-items:center; gap:10px; margin-bottom:14px; }
  .fc-step { width:26px; height:26px; border-radius:50%; background:#e8f1fb; color:#1e67a8; font-weight:800; font-size:.8rem; display:inline-flex; align-items:center; justify-content:center; flex-shrink:0; }
  .fc-section-title { font-weight:700; color:#1f2d3d; font-size:.95rem; margin:0; }
  .fc-section-sub { color:#7a8899; font-size:.78rem; margin:0; }
  .fc-label { font-weight:600; color:#3b4a5c; font-size:.82rem; margin-bottom:6px; display:flex; align-items:center; gap:6px; }
  .fc-label .icon { color:#1e67a8; font-size:1rem; }
  .fc-label .req { color:#e3496a; }
  .fc-label .opt { color:#9aa8b8; font-weight:500; font-size:.72rem; margin-left:auto; text-transform:uppercase; letter-spacing:.03em; }
  .fc-body .form-control, .fc-body .form-select { border-radius:10px; border-color:#d6e3f1; font-size:.875rem; min-height:42px; background-color:#fff; transition:border-color .15s, box-shadow .15s; }
  .fc-body .form-control:hover, .fc-body .form-select:hover { border-color:#a9c6e6; }
  .fc-body .form-control:focus, .fc-body .form-select:focus { border-color:#1e67a8; box-shadow:0 0 0 3px rgba(30,103,168,.14); }
  .fc-body .input-group .form-control { border-top-right-radius:0; border-bottom-right-radius:0; }
  .fc-body .input-group-text { border-radius:0 10px 10px 0; background:#f1f6fc; border-color:#d6e3f1; color:#1e67a8; font-weight:700; font-size:.8rem; min-width:56px; justify-content:center; }
  .fc-hint { color:#7a8899; font-size:.74rem; margin-top:5px; }
  .fc-summary { display:flex; gap:10px; flex-wrap:wrap; margin-top:14px; }
  .fc-pill { display:inline-flex; align-items:center; gap:6px; background:#eef6ff; color:#1e67a8; border-radius:999px; padding:5px 12px; font-size:.78rem; font-weight:600; }
  .fc-pill.warn { background:#fff4e5; color:#b26a00; }
  .fc-pill.ok { background:#e9f8ef; color:#18794e; }
  .fc-count { text-align:right; color:#9aa8b8; font-size:.72rem; margin-top:4px; }
  .fc-drop { position:relative; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; gap:6px; min-height:118px; border:2px dashed #c4d8ee; border-radius:12px; background:#f7fbff; padding:14px; cursor:pointer; transition:all .15s; margin:0; }
  .fc-drop:hover, .fc-drop.drag { border-color:#1e67a8; background:#eef6ff; }
  .fc-drop .icon { font-size:1.9rem; color:#1e67a8; }
  .fc-drop b { color:#1f2d3d; font-size:.86rem; }
  .fc-drop span { color:#7a8899; font-size:.75rem; }
  .fc-drop input { position:absolute; inset:0; opacity:0; cursor:pointer; }
  .fc-file { display:flex; align-items:center; gap:12px; min-height:118px; border:1px solid #cfe3d6; background:#f3fbf6; border-radius:12px; padding:14px 16px; }
  .fc-file-icon { width:44px; height:44px; border-radius:10px; background:#fff; border:1px solid #d6eadc; display:flex; align-items:center; justify-content:center; font-size:1.4rem; color:#18794e; flex-shrink:0; }
  .fc-file-name { font-weight:700; color:#1f2d3d; font-size:.86rem; word-break:break-all; }
  .fc-file-meta { color:#5f7a6a; font-size:.75rem; }
  .fc-file-remove { margin-left:auto; border:none; background:#fff; color:#c43257; width:34px; height:34px; border-radius:50%; display:flex; align-items:center; justify-content:center; box-shadow:0 1px 4px rgba(0,0,0,.08); flex-shrink:0; }
  .fc-file-remove:hover { background:#fdecef; }
  .fc-footer { display:flex; align-items:center; justify-content:space-between; gap:12px; flex-wrap:wrap; padding:14px 24px; border-top:1px solid #e6eef7; background:#fff; }
  .fc-footer-note { color:#7a8899; font-size:.78rem; display:flex; align-items:center; gap:6px; }
  .fc-btn-cancel { border-radius:10px !important; background:#fff !important; border:1px solid #d6e3f1 !important; color:#4a5568 !important; font-weight:600 !important; min-width:110px; }
  .fc-btn-cancel:hover { background:#f4f7fb !important; }
  .fc-btn-save { border-radius:10px !important; background:linear-gradient(90deg,#1e67a8,#2b7ac0) !important; border:none !important; font-weight:700 !important; min-width:170px; box-shadow:0 6px 14px rgba(30,103,168,.25); display:inline-flex !important; align-items:center; justify-content:center; gap:6px; }
  .fc-btn-save:hover:not(:disabled) { transform:translateY(-1px); box-shadow:0 8px 18px rgba(30,103,168,.3); }
  @media (max-width: 575px) {
    .fc-body { padding:16px 12px 4px; }
    .fc-section { padding:14px 12px; }
    .fc-footer { padding:12px; }
    .fc-footer > div:last-child { width:100%; display:flex; gap:8px; }
    .fc-footer .btn { flex:1; min-width:0; }
  }
`;
const ACCEPT = [".jpg", ".jpeg", ".png", ".pdf"];
const MAX_NOTE = 500;
const dayDiff = (a, b) => (a && b ? Math.round((new Date(b) - new Date(a)) / 86400000) : null);
const fmtSize = (n) => (n >= 1024 * 1024 ? (n / 1024 / 1024).toFixed(1) + " MB" : Math.max(1, Math.round(n / 1024)) + " KB");
const emptyForm = () => ({ transactionDate: "", spunFromDate: "", spunToDate: "", diseaseStatusId: "", noOfChandies: "", expectedCocoon: "", lotTestDetails: "" });

function FitnessCertificateAdd() {
  const { t } = useTranslation();
  const [farmer, setFarmer] = useState(null);
  const [crop, setCrop] = useState(null);
  const [data, setData] = useState(emptyForm());
  const [file, setFile] = useState(null);
  const [validated, setValidated] = useState(false);
  const [saving, setSaving] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [diseaseList, setDiseaseList] = useState([]);

  useEffect(() => {
    api.get(baseURLMasterData + "diseaseStatus/get-all")
      .then((r) => setDiseaseList(r.data.content?.diseaseStatus || []))
      .catch(() => setDiseaseList([]));
  }, []);

  const set = (e) => setData((d) => ({ ...d, [e.target.name]: e.target.value }));
  const [drag, setDrag] = useState(false);
  const pickFile = (f) => {
    if (!f) return;
    const ext = "." + (f.name.split(".").pop() || "").toLowerCase();
    if (!ACCEPT.includes(ext)) { Swal.fire({ icon: "warning", title: t("Unsupported file"), text: t("Upload a JPG, PNG or PDF file"), customClass: swalClass }); return; }
    if (f.size > 5 * 1024 * 1024) { Swal.fire({ icon: "warning", title: t("File too large"), text: t("Maximum 5 MB"), customClass: swalClass }); return; }
    setFile(f);
  };
  const onFile = (e) => { pickFile(e.target.files?.[0]); e.target.value = ""; };
  const onDrop = (e) => { e.preventDefault(); setDrag(false); pickFile(e.dataTransfer.files?.[0]); };

  const spunDays = dayDiff(data.spunFromDate, data.spunToDate);
  const txnGap = dayDiff(data.spunToDate, data.transactionDate);
  const isPdf = file && /\.pdf$/i.test(file.name);

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
        transactionDate: data.transactionDate,
        spunFromDate: data.spunFromDate,
        spunToDate: data.spunToDate,
        diseaseStatusId: data.diseaseStatusId,
        noOfChandies: data.noOfChandies ? Number(data.noOfChandies) : null,
        expectedCocoon: Number(data.expectedCocoon),
        lotTestDetails: data.lotTestDetails,
      };
      const res = await api.post(`${baseURL}cropInspection/add-fitness-info`, payload);
      const r = res.data?.content ?? res.data;
      if (r?.error) {
        Swal.fire({ icon: "warning", title: t("Not saved"), text: r.message || r.error_description, customClass: swalClass });
        return;
      }
      if (file && r?.fitnessCertificateId) {
        const fd = new FormData();
        fd.append("multipartFile", file);
        fd.append("fitnessCertificateId", r.fitnessCertificateId);
        await api.post(`${baseURL}cropInspection/upload-fitness-certificate`, fd, { headers: { "Content-Type": "multipart/form-data" } });
      }
      Swal.fire({ icon: "success", title: t("Fitness certificate saved"), customClass: swalClass });
      setData(emptyForm()); setFile(null); setValidated(false); setReloadKey((k) => k + 1);
    } catch {
      Swal.fire({ icon: "error", title: t("Save attempt was not successful"), text: t("Something went wrong!"), customClass: swalClass });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Layout title={t("Fitness Certificate")}>
      <style>{styles}</style>
      <Block.Head>
        <div className="sh-page-header">
          <Block.HeadBetween>
            <Block.HeadContent><Block.Title tag="h2" className="sh-page-title">{t("Fitness Certificate")}</Block.Title></Block.HeadContent>
            <Block.HeadContent>
              <Link to="/seriui/fitness-certificate-edit" className="btn btn-primary d-inline-flex sh-cta-btn"><Icon name="edit" /><span>{t("Fitness Certificate Edit")}</span></Link>
            </Block.HeadContent>
          </Block.HeadBetween>
        </div>
      </Block.Head>

      <Block className="mt-n2">
        <FarmerCropPicker
          cropsPath="getInspectioninfoForFarmerForFitnessCertificate"
          emptyText={t("No crop is ready for a fitness certificate. The crop must be inspected first and must not already have a certificate.")}
          selected={crop} onSelect={setCrop} onFarmer={setFarmer} reloadKey={reloadKey}
        />

        {crop && (
          <Card className="fcp-card fc-card">
            <Card.Header>
              <span className="fc-head-title"><Icon name="shield-check" /> {t("Certificate Details")}</span>
              <span className="fc-head-chips">
                <span className="fc-chip"><Icon name="tag" /> {t("Lot")} {crop.lotNumberCrc}</span>
                <span className="fc-chip"><Icon name="package" /> {crop.numbersOfDfls} DFLs</span>
              </span>
            </Card.Header>
            <Form noValidate validated={validated} onSubmit={save}>
              <div className="fc-body">
                {/* 1. Dates */}
                <div className="fc-section">
                  <div className="fc-section-head">
                    <span className="fc-step">1</span>
                    <div>
                      <p className="fc-section-title">{t("Spinning & Transaction")}</p>
                      <p className="fc-section-sub">{t("When the worms spun and when the cocoons will be sold")}</p>
                    </div>
                  </div>
                  <Row className="g-3">
                    <Col md={4}>
                      <Form.Label className="fc-label"><Icon name="calendar" /> {t("Spun From Date")} <span className="req">*</span></Form.Label>
                      <Form.Control type="date" name="spunFromDate" value={data.spunFromDate} onChange={set} required />
                      <Form.Control.Feedback type="invalid">{t("Spun From Date is required")}</Form.Control.Feedback>
                    </Col>
                    <Col md={4}>
                      <Form.Label className="fc-label"><Icon name="calendar-check" /> {t("Spun To Date")} <span className="req">*</span></Form.Label>
                      <Form.Control type="date" name="spunToDate" value={data.spunToDate} min={data.spunFromDate} onChange={set} required />
                      <Form.Control.Feedback type="invalid">{t("Must be on or after Spun From Date")}</Form.Control.Feedback>
                    </Col>
                    <Col md={4}>
                      <Form.Label className="fc-label"><Icon name="calendar-alt" /> {t("Expected Cocoon Transaction Date")} <span className="req">*</span></Form.Label>
                      <Form.Control type="date" name="transactionDate" value={data.transactionDate} min={data.spunToDate} onChange={set} required />
                      <Form.Control.Feedback type="invalid">{t("Must be on or after Spun To Date")}</Form.Control.Feedback>
                    </Col>
                  </Row>
                  {(spunDays !== null || txnGap !== null) && (
                    <div className="fc-summary">
                      {spunDays !== null && (
                        <span className={`fc-pill ${spunDays < 0 ? "warn" : ""}`}>
                          <Icon name="clock" /> {spunDays < 0 ? t("Spun To Date is before Spun From Date") : `${t("Spinning period")}: ${spunDays + 1} ${spunDays === 0 ? t("day") : t("days")}`}
                        </span>
                      )}
                      {txnGap !== null && (
                        <span className={`fc-pill ${txnGap < 0 ? "warn" : "ok"}`}>
                          <Icon name="calendar-check" /> {txnGap < 0 ? t("Transaction date is before spinning ended") : `${t("Sale")} ${txnGap} ${txnGap === 1 ? t("day") : t("days")} ${t("after spinning")}`}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* 2. Health & yield */}
                <div className="fc-section">
                  <div className="fc-section-head">
                    <span className="fc-step">2</span>
                    <div>
                      <p className="fc-section-title">{t("Crop Health & Yield")}</p>
                      <p className="fc-section-sub">{t("Inspection result and expected cocoon output")}</p>
                    </div>
                  </div>
                  <Row className="g-3">
                    <Col md={4}>
                      <Form.Label className="fc-label"><Icon name="activity-round" /> {t("Disease Status")} <span className="req">*</span></Form.Label>
                      <Form.Select name="diseaseStatusId" value={data.diseaseStatusId} onChange={set} required>
                        <option value="">{t("Select")}</option>
                        {diseaseList.map((x) => <option key={x.diseaseStatusId} value={x.diseaseStatusId}>{x.name}</option>)}
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">{t("Disease Status is required")}</Form.Control.Feedback>
                    </Col>
                    <Col md={4}>
                      <Form.Label className="fc-label"><Icon name="growth" /> {t("Expected Cocoon")} <span className="req">*</span></Form.Label>
                      <InputGroup hasValidation>
                        <Form.Control type="number" min="0" step="0.1" name="expectedCocoon" value={data.expectedCocoon} onChange={set} required placeholder="0.0" />
                        <InputGroup.Text>Kg</InputGroup.Text>
                        <Form.Control.Feedback type="invalid">{t("Enter the expected cocoon quantity")}</Form.Control.Feedback>
                      </InputGroup>
                    </Col>
                    <Col md={4}>
                      <Form.Label className="fc-label"><Icon name="bag" /> {t("No. of Chandies")} <span className="opt">{t("Optional")}</span></Form.Label>
                      <InputGroup hasValidation>
                        <Form.Control type="number" min="0" step="1" name="noOfChandies" value={data.noOfChandies} onChange={set} placeholder="0" />
                        <InputGroup.Text>{t("Nos")}</InputGroup.Text>
                        <Form.Control.Feedback type="invalid">{t("Enter a whole number")}</Form.Control.Feedback>
                      </InputGroup>
                    </Col>
                  </Row>
                </div>

                {/* 3. Notes & certificate */}
                <div className="fc-section">
                  <div className="fc-section-head">
                    <span className="fc-step">3</span>
                    <div>
                      <p className="fc-section-title">{t("Lot Test & Certificate")}</p>
                      <p className="fc-section-sub">{t("Test remarks and a scanned copy of the certificate")}</p>
                    </div>
                  </div>
                  <Row className="g-3">
                    <Col md={6}>
                      <Form.Label className="fc-label"><Icon name="file-text" /> {t("Lot Test Details")} <span className="opt">{t("Optional")}</span></Form.Label>
                      <Form.Control as="textarea" rows={4} name="lotTestDetails" value={data.lotTestDetails} onChange={set} maxLength={MAX_NOTE}
                        placeholder={t("e.g. Pebrine test result, sample size, remarks")} style={{ resize: "vertical", minHeight: 118 }} />
                      <div className="fc-count">{data.lotTestDetails.length}/{MAX_NOTE}</div>
                    </Col>
                    <Col md={6}>
                      <Form.Label className="fc-label"><Icon name="upload-cloud" /> {t("Certificate")} <span className="opt">{t("Optional")}</span></Form.Label>
                      {file ? (
                        <div className="fc-file">
                          <span className="fc-file-icon"><Icon name={isPdf ? "file-pdf" : "img"} /></span>
                          <div style={{ minWidth: 0 }}>
                            <div className="fc-file-name">{file.name}</div>
                            <div className="fc-file-meta"><Icon name="check-circle-fill" /> {t("Ready to upload")} · {fmtSize(file.size)}</div>
                          </div>
                          <button type="button" className="fc-file-remove" onClick={() => setFile(null)} title={t("Remove")} aria-label={t("Remove")}>
                            <Icon name="trash-alt" />
                          </button>
                        </div>
                      ) : (
                        <label className={`fc-drop ${drag ? "drag" : ""}`}
                          onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
                          onDragLeave={() => setDrag(false)} onDrop={onDrop}>
                          <input type="file" accept={ACCEPT.join(",")} onChange={onFile} />
                          <Icon name="upload-cloud" />
                          <b>{t("Click to upload or drag & drop")}</b>
                          <span>JPG, PNG {t("or")} PDF · {t("max 5 MB")}</span>
                        </label>
                      )}
                    </Col>
                  </Row>
                </div>
              </div>

              <div className="fc-footer">
                <span className="fc-footer-note"><Icon name="info" /> {t("Fields marked")} <span style={{ color: "#e3496a" }}>*</span> {t("are required")}</span>
                <div className="d-flex gap-2">
                  <Button className="fc-btn-cancel" disabled={saving} onClick={() => { setData(emptyForm()); setFile(null); setValidated(false); setCrop(null); }}>{t("Cancel")}</Button>
                  <Button type="submit" className="fc-btn-save" disabled={saving}>
                    {saving ? <><Spinner size="sm" /> {t("Saving...")}</> : <><Icon name="save" /> {t("Save Certificate")}</>}
                  </Button>
                </div>
              </div>
            </Form>
          </Card>
        )}
      </Block>
    </Layout>
  );
}

export default FitnessCertificateAdd;
