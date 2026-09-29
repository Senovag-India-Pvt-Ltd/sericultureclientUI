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
  .cia-status { display:flex; gap:8px; flex-wrap:wrap; }
  .cia-status button { border:1px solid #d0dff0; background:#fff; border-radius:999px; padding:6px 14px; font-weight:600; font-size:.82rem; color:#4a5568; }
  .cia-status button.active { background:#1e67a8; border-color:#1e67a8; color:#fff; }
  ${pickerStyles}
`;
const labelStyle = { fontWeight: 600, color: "#444", fontSize: "0.875rem" };
const inputStyle = { borderRadius: "8px", borderColor: "#d0dff0", fontSize: "0.875rem" };
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
      Swal.fire({ icon: "success", title: t("Crop inspection saved"), customClass: swalClass });
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

        {crop && (
          <Card className="fcp-card">
            <Card.Header>📋 {t("Inspection Details")} · {t("Lot")} {crop.lotNumberCrc} · {crop.numbersOfDfls} DFLs</Card.Header>
            <Card.Body style={{ padding: "20px 24px" }}>
              <Form noValidate validated={validated} onSubmit={save}>
                <Row className="g-3">
                  <Col md={4}>
                    <Form.Label style={labelStyle}>{t("Inspection Date")} <span className="text-danger">*</span></Form.Label>
                    <Form.Control type="date" name="date" value={data.date} max={today()} onChange={set} required style={inputStyle} />
                  </Col>
                  <Col md={4}>
                    <Form.Label style={labelStyle}>{t("Inspection Type")}</Form.Label>
                    <Form.Select name="cropInspectionTypeId" value={data.cropInspectionTypeId} onChange={set} style={inputStyle}>
                      <option value="">{t("Select")}</option>
                      {masters.types.map((x) => <option key={x.cropInspectionTypeId} value={x.cropInspectionTypeId}>{x.name}</option>)}
                    </Form.Select>
                  </Col>
                  <Col md={4}>
                    <Form.Label style={labelStyle}>{t("Moult")} <span className="text-danger">*</span></Form.Label>
                    <Form.Select name="mountId" value={data.mountId} onChange={set} required style={inputStyle}>
                      <option value="">{t("Select")}</option>
                      {masters.mounts.map((x) => <option key={x.mountId} value={x.mountId}>{x.name}</option>)}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">{t("Moult is required")}</Form.Control.Feedback>
                  </Col>
                  <Col md={12}>
                    <Form.Label style={labelStyle}>{t("Crop Status")} <span className="text-danger">*</span></Form.Label>
                    <div className="cia-status">
                      {masters.statuses.map((x) => (
                        <button type="button" key={x.cropStatusId} className={String(data.cropStatusId) === String(x.cropStatusId) ? "active" : ""}
                          onClick={() => setData((d) => ({ ...d, cropStatusId: x.cropStatusId }))}>{x.name}</button>
                      ))}
                      {!masters.statuses.length && <span className="text-muted small">{t("No crop status in master")}</span>}
                    </div>
                    {/* keeps the form invalid until a status is chosen */}
                    <Form.Control required value={data.cropStatusId} onChange={() => {}} style={{ display: "none" }} />
                    {validated && !data.cropStatusId && <div className="text-danger small mt-1">{t("Select crop status")}</div>}
                  </Col>
                  <Col md={6}>
                    <Form.Label style={labelStyle}>{t("Reason")} <span className="text-muted fw-normal">({t("for poor / failed crop")})</span></Form.Label>
                    <Form.Select name="reasonId" value={data.reasonId} onChange={set} style={inputStyle}>
                      <option value="">{t("Select")}</option>
                      {masters.reasons.map((x) => <option key={x.reasonId} value={x.reasonId}>{x.name}</option>)}
                    </Form.Select>
                  </Col>
                  <Col md={6}>
                    <Form.Label style={labelStyle}>{t("Crop Inspection Photo")} <span className="text-muted fw-normal">(jpg / png / pdf, max 5 MB)</span></Form.Label>
                    <Form.Control type="file" accept=".jpg,.jpeg,.png,.pdf" onChange={onPhoto} style={inputStyle} />
                  </Col>
                  <Col md={12}>
                    <Form.Label style={labelStyle}>{t("Note")}</Form.Label>
                    <Form.Control as="textarea" rows={2} name="note" value={data.note} onChange={set} style={inputStyle} />
                  </Col>
                </Row>
                <div className="d-flex justify-content-end gap-2 mt-4">
                  <Button variant="light" onClick={() => { setData(emptyForm()); setPhoto(null); setValidated(false); setCrop(null); }} style={{ borderRadius: 8 }}>{t("Cancel")}</Button>
                  <Button type="submit" disabled={saving} style={{ borderRadius: 8, background: "linear-gradient(90deg,#1e67a8,#2b7ac0)", border: "none", fontWeight: 600, minWidth: 140 }}>
                    {saving ? <Spinner size="sm" /> : <><Icon name="save" /> {t("Save")}</>}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        )}
      </Block>
    </Layout>
  );
}

export default CropInspectionAdd;
