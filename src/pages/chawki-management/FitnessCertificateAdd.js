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

const styles = `
  .sh-page-header { padding:12px 20px; background:linear-gradient(90deg,#1e67a8 0%,#2b7ac0 60%,#3b8dd6 100%); border-radius:12px; box-shadow:0 6px 18px rgba(30,103,168,.22); margin-bottom:8px; }
  .sh-page-title { margin-bottom:0; color:#fff !important; font-weight:700; }
  .sh-cta-btn { background:#fff !important; color:#1e67a8 !important; border:none !important; box-shadow:0 4px 12px rgba(12,40,68,.25); font-weight:700; }
  .sh-swal-popup { border-radius:14px !important; }
  .sh-swal-confirm { background:linear-gradient(90deg,#1e67a8 0%,#2b7ac0 60%,#3b8dd6 100%) !important; border-radius:8px !important; font-weight:600 !important; }
  .sh-swal-cancel { background:#fff !important; color:#c43257 !important; border:1px solid #e3496a !important; border-radius:8px !important; font-weight:600 !important; }
  ${pickerStyles}
`;
const labelStyle = { fontWeight: 600, color: "#444", fontSize: "0.875rem" };
const inputStyle = { borderRadius: "8px", borderColor: "#d0dff0", fontSize: "0.875rem" };
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
  const onFile = (e) => {
    const f = e.target.files?.[0];
    if (f && f.size > 5 * 1024 * 1024) { Swal.fire({ icon: "warning", title: t("File too large"), text: t("Maximum 5 MB"), customClass: swalClass }); e.target.value = ""; return; }
    setFile(f || null);
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
          <Card className="fcp-card">
            <Card.Header>🛡️ {t("Certificate Details")} · {t("Lot")} {crop.lotNumberCrc} · {crop.numbersOfDfls} DFLs</Card.Header>
            <Card.Body style={{ padding: "20px 24px" }}>
              <Form noValidate validated={validated} onSubmit={save}>
                <Row className="g-3">
                  <Col md={4}>
                    <Form.Label style={labelStyle}>{t("Spun From Date")} <span className="text-danger">*</span></Form.Label>
                    <Form.Control type="date" name="spunFromDate" value={data.spunFromDate} onChange={set} required style={inputStyle} />
                  </Col>
                  <Col md={4}>
                    <Form.Label style={labelStyle}>{t("Spun To Date")} <span className="text-danger">*</span></Form.Label>
                    <Form.Control type="date" name="spunToDate" value={data.spunToDate} min={data.spunFromDate} onChange={set} required style={inputStyle} />
                    <Form.Control.Feedback type="invalid">{t("Must be on or after Spun From Date")}</Form.Control.Feedback>
                  </Col>
                  <Col md={4}>
                    <Form.Label style={labelStyle}>{t("Expected Cocoon Transaction Date")} <span className="text-danger">*</span></Form.Label>
                    <Form.Control type="date" name="transactionDate" value={data.transactionDate} min={data.spunToDate} onChange={set} required style={inputStyle} />
                  </Col>
                  <Col md={4}>
                    <Form.Label style={labelStyle}>{t("Disease Status")} <span className="text-danger">*</span></Form.Label>
                    <Form.Select name="diseaseStatusId" value={data.diseaseStatusId} onChange={set} required style={inputStyle}>
                      <option value="">{t("Select")}</option>
                      {diseaseList.map((x) => <option key={x.diseaseStatusId} value={x.diseaseStatusId}>{x.name}</option>)}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">{t("Disease Status is required")}</Form.Control.Feedback>
                  </Col>
                  <Col md={4}>
                    <Form.Label style={labelStyle}>{t("Expected Cocoon")} (Kg) <span className="text-danger">*</span></Form.Label>
                    <Form.Control type="number" min="0" step="0.1" name="expectedCocoon" value={data.expectedCocoon} onChange={set} required style={inputStyle} />
                  </Col>
                  <Col md={4}>
                    <Form.Label style={labelStyle}>{t("No. of Chandies")}</Form.Label>
                    <Form.Control type="number" min="0" name="noOfChandies" value={data.noOfChandies} onChange={set} style={inputStyle} />
                  </Col>
                  <Col md={6}>
                    <Form.Label style={labelStyle}>{t("Lot Test Details")}</Form.Label>
                    <Form.Control as="textarea" rows={2} name="lotTestDetails" value={data.lotTestDetails} onChange={set} style={inputStyle} />
                  </Col>
                  <Col md={6}>
                    <Form.Label style={labelStyle}>{t("Certificate")} <span className="text-muted fw-normal">(jpg / png / pdf, max 5 MB)</span></Form.Label>
                    <Form.Control type="file" accept=".jpg,.jpeg,.png,.pdf" onChange={onFile} style={inputStyle} />
                  </Col>
                </Row>
                <div className="d-flex justify-content-end gap-2 mt-4">
                  <Button variant="light" onClick={() => { setData(emptyForm()); setFile(null); setValidated(false); setCrop(null); }} style={{ borderRadius: 8 }}>{t("Cancel")}</Button>
                  <Button type="submit" disabled={saving} style={{ borderRadius: 8, background: "linear-gradient(90deg,#1e67a8,#2b7ac0)", border: "none", fontWeight: 600, minWidth: 140 }}>
                    {saving ? <Spinner size="sm" /> : <><Icon name="save" /> {t("Save Certificate")}</>}
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

export default FitnessCertificateAdd;
